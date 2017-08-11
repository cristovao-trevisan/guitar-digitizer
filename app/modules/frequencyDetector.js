const java = require('java')
java.classpath.push('./lib/TarsosDSP.jar')

export const frequencyDetector = (fs, bufferSize) => {
  const detector = java.newInstanceSync('be.tarsos.dsp.pitch.McLeodPitchMethod', java.newLong(fs), bufferSize)
  return data => {
    return new Promise((resolve, reject) => {
      detector.getPitch(java.newArray('float', data), (err, result) => {
        if (err) reject(err)
        else {
          result.getPitch((err, pitch) => {
            if (err) reject(err)
            else {
              resolve(pitch)
            }
          })
        }
      })
    })
  }
}

export const frequencyDetectorSync = (fs, bufferSize) => {
  const detector = java.newInstanceSync('be.tarsos.dsp.pitch.McLeodPitchMethod', java.newLong(fs), bufferSize)
  return data => detector.getPitchSync(java.newArray('float', data)).getPitchSync()
}
