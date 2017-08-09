const LENGTH = 6
const MAX_SAMPLE = 0x0fff

export default () => {
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
          throw new Error('Error on header second short')
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
