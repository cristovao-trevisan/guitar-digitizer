import { toMidi as freqToMidi } from 'tonal-freq'

import { signals } from '../constants/guitar'
import { calculateAverageAmplitude } from './calculator'

const LENGTH = signals.length
const MAX_SAMPLE = 0x0fff

const WINDOW_SIZE = 1024
const WINDOW_DELTA = 1024
const MAX_BUFFER_SIZE = WINDOW_SIZE * 5

export const interpreter = () => {
  let buffer = []
  const clearBuffer = () => {
    buffer = []
    for (let i = 0; i < LENGTH; i++) buffer.push([])
  }
  clearBuffer()
  let inputCount = 0
  let headerFlag = false
  let expectedIndex

  return data => {
    // separate data for each channel (adding to buffer) and check headers
    for (let i = 0; i < data.length; i += 2) {
      let value = data.readUInt16LE(i, true) // true means to skip any assertion

      if (value === 0xabcd) {
        if (inputCount !== 0) {
          let errorCount = inputCount
          inputCount = 0
          clearBuffer()
          throw new Error('Missing input count: ' + errorCount)
        }
        headerFlag = true
      } else if (headerFlag) {
        headerFlag = false
        if ((value & 0xff00) !== 0xef00) {
          throw new Error('Error on header second short ' + value.toString(16))
        } else {
          if (expectedIndex && ((value & 0xff) !== expectedIndex)) {
            throw new Error('Lost index. Expected: ' + expectedIndex + ', but got: ' + (value & 0xff))
          }
          expectedIndex = (value + 1) & 0xff
        }
      } else {
        buffer[inputCount++].push((value & MAX_SAMPLE) - (MAX_SAMPLE / 2))
        if (inputCount === LENGTH) inputCount = 0
      }
    }
    if (inputCount === 0) {
      let output = buffer
      clearBuffer()
      return output
    }
  }
}

// keep last WINDOW_SIZE samples and return values for each change with at least WINDOW_DELTA new samples
export const windowBuffer = (windowSize = WINDOW_SIZE, windowDelta = WINDOW_DELTA, maxBufferSize = MAX_BUFFER_SIZE) => {
  let buffer = []

  return data => {
    buffer.push(...data)
    if (buffer.length > maxBufferSize) {
      buffer = []
      throw new Error('Buffer overflow')
    }

    if (buffer.length >= windowSize) {
      let output = buffer.slice(buffer.length - windowSize)
      buffer = buffer.slice(windowDelta, buffer.length)
      return output
    }
    return null
  }
}

export const guitarWindowBuffer = (windowSize = WINDOW_SIZE, windowDelta = WINDOW_DELTA, maxBufferSize = MAX_BUFFER_SIZE) => {
  let buffers = []
  for (let i = 0; i < LENGTH; i++) buffers.push(windowBuffer(windowSize, windowDelta, maxBufferSize))

  return data => {
    const output = signals.map((signal, i) => buffers[i](data[i]))
    if (output[0] instanceof Array) return output
    return null
  }
}

// max avareage value of a sinewave
const MAX_AMPLITUDE = 2 * MAX_SAMPLE / Math.PI
// 5% of the max average value of a sinewave
const MIN_AMPLITUDE = 0.05 * MAX_AMPLITUDE

const freqWithinRange = (freq, signalId) => {
  switch (signalId) {
    case 6: return freq > 70 && freq < 265 // E string notes from C2# to C4
    case 5: return freq > 95 && freq < 350 // A string notes from G2 to F4
    case 4: return freq > 130 && freq < 470 // D string notes from C3 to A4#
    case 3: return freq > 170 && freq < 625 // G string notes from F3 to D5#
    case 2: return freq > 215 && freq < 785 // B string notes from A3 to G5
    case 1: return freq > 290 && freq < 1050 // e string notes from D4 to C6
    default: return false
  }
}

export const processor = (onNoteOn, onNoteOff, getPitchDetector) => {
  let playing = {}
  let playingAmplitude = {}
  const turnOffSignal = id => {
    if (playing[id]) {
      onNoteOff(id, playing[id])
      playing[id] = false
      playingAmplitude[id] = -1
    }
  }
  const turnOnSignal = (id, note, amplitude) => {
    turnOffSignal(id)
    playing[id] = note
    onNoteOn(id, note, amplitude * 0x7F / MAX_AMPLITUDE) // 0x7F = max velocity
  }

  return data => {
    const amplitudes = []
    signals.forEach((signal, i) => {
      const amplitude = calculateAverageAmplitude(data[i])
      amplitudes.push(amplitude)
      if (amplitude > MIN_AMPLITUDE) {
        const pitch = getPitchDetector()(data[i].slice(0, WINDOW_SIZE))
        if (freqWithinRange(pitch, signal.id)) {
          const note = freqToMidi(pitch)
          // remove interference (equal note but less than 20% of the last amplitude)
          if (Math.round(note) === Math.round(playing[signal.id]) &&
              amplitudes[i - 1] * 0.20 > amplitude) {
            turnOffSignal(signal.id)
          } else if (Math.round(note) !== Math.round(playing[signal.id]) || // different note
                      amplitude > 1.6 * playingAmplitude[signal.id]) { // plucking
            playingAmplitude[signal.id] = amplitude
            turnOnSignal(signal.id, note, amplitude)
          }
        } else if (pitch > 0) turnOffSignal(signal.id)
      } else turnOffSignal(signal.id)
    })
  }
}
