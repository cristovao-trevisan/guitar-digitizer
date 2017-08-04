const INPUT_SIZE = 6
const MAX_SAMPLE = 0xfff

let dataBuffer = []
for (let i = 0; i < INPUT_SIZE; i++) dataBuffer.push([])
let inputCount = 0
let headerFlag = false
let lastIndex

let interpretData = buffer => {
  for (let i = 0; i < buffer.length; i += 2) {
    var data = buffer.readUInt16LE(i, true) // true means to skip any assertion

    if (data === 0xabcd) {
      if (inputCount !== 0) {
        console.error('Missing input count')
      }
      inputCount = 0
      headerFlag = true
    } else if (headerFlag) {
      if ((data & 0xff00) !== 0xef00) {
        console.error('Error on header second short')
      } else {
        if (lastIndex && ((data & 0xff) !== lastIndex + 1)) {
          console.error('Lost index')
        }
        headerFlag = false
        lastIndex = data & 0xff
      }
    } else {
      dataBuffer[inputCount++].push((data & MAX_SAMPLE) - (MAX_SAMPLE / 2))
      if (inputCount === INPUT_SIZE) inputCount = 0
    }
  }
}

module.exports = interpretData
