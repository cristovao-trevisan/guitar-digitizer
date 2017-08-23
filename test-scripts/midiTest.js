import {
  onChange as onMidiChange,
  createVirtual as createVirtualMidi,
  open as openMidi,
  getDevices
} from '../app/modules/midi'

console.log(getDevices())

// A4 note
const noteOn = [0x93, 0x45, 0x4F]
const noteOff = [0x83, 0x45, 0x4F]

createVirtualMidi('Test')

onMidiChange(list => {
  console.log(list)
  console.log('Continue?')
  process.stdin.once('data', () => {
    const device = openMidi(list[list.length - 1])
    console.log('note on')
    device.sendMessage(noteOn)
    setTimeout(() => {
      console.log('note off')
      device.sendMessage(noteOff)
      setTimeout(process.exit, 100)
    }, 1000)
  })
})
