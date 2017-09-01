import { toMidi as freqToMidi } from 'tonal-freq'

import { signals } from '../constants/guitar'
import { calculateAverageAmplitude } from './calculator'

const LENGTH = 6
const MAX_SAMPLE = 0x0fff

export const interpreter = () => {
  let buffer = []
  for (let i = 0; i < LENGTH; i++) buffer.push([])
  let inputCount = 0
  let headerFlag = false
  let expectedIndex

  return data => {
    for (let i = 0; i < data.length; i += 2) {
      let value = data.readUInt16LE(i, true) // true means to skip any assertion

      if (value === 0xabcd) {
        if (inputCount !== 0) {
          throw new Error('Missing input count: ' + inputCount)
        }
        inputCount = 0
        headerFlag = true
      } else if (headerFlag) {
        if ((value & 0xff00) !== 0xef00) {
          throw new Error('Error on header second short ' + value.toString(16))
        } else {
          if (expectedIndex && ((value & 0xff) !== expectedIndex)) {
            throw new Error('Lost index. Expected: ' + expectedIndex + ', but got: ' + (value & 0xff))
          }
          headerFlag = false
          expectedIndex = (value + 1) & 0xff
        }
      } else {
        buffer[inputCount++].push((value & MAX_SAMPLE) - (MAX_SAMPLE / 2))
        if (inputCount === LENGTH) inputCount = 0
      }
    }
    if (inputCount === 0) {
      let output = buffer
      buffer = []
      for (let i = 0; i < LENGTH; i++) buffer.push([])
      return output
    }
  }
}

// 5% of the max average value of a sinewave
const MIN_AMPLITUDE = 0.05 * 2 * MAX_SAMPLE / Math.PI
const MAX_AMPLITUDE = 2 * MAX_SAMPLE / Math.PI

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
  let lastNote = null
  const turnOffSignal = id => {
    if (playing[id]) {
      // console.trace()
      onNoteOff(id, playing[id])
      playing[id] = false
      lastNote = null
    }
  }
  const turnOnSignal = (id, note, velocity) => {
    if (Math.round(note) !== Math.round(playing[id])) {
      turnOffSignal(id)
      playing[id] = note
      lastNote = note
      onNoteOn(id, note, velocity)
    }
  }

  return data => {
    const amplitudes = []
    signals.forEach((signal, i) => {
      const amplitude = calculateAverageAmplitude(data[i])
      amplitudes.push(amplitude)
      if (amplitude > MIN_AMPLITUDE) {
        const pitch = getPitchDetector()(data[i].slice(0, 2048))
        if (freqWithinRange(pitch, signal.id)) {
          const note = freqToMidi(pitch)
          // remove interference (equal note but less than 20% of the last amplitude)
          if (Math.round(note) === Math.round(lastNote) && amplitudes[i - 1] * 0.20 > amplitude) {
            turnOffSignal(signal.id)
          } else {
            turnOnSignal(signal.id, note, amplitude * 0x7F / MAX_AMPLITUDE)
          }
        } else if (pitch > 0) {
          turnOffSignal(signal.id)
        }
      } else turnOffSignal(signal.id)
    })
  }
}
