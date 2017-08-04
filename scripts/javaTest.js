#!/usr/bin/env node

const java = require('java')
const tone = require('tonegenerator')

java.classpath.push('./lib/TarsosDSP.jar')

var A440 = tone(440, 0.1)

var detector = java.newInstanceSync('be.tarsos.dsp.pitch.McLeodPitchMethod', 44100)
var result = detector.getPitchSync(java.newArray('float', A440.slice(0, 1023))).getPitchSync()
console.log(result)

java.newInstance('be.tarsos.dsp.pitch.McLeodPitchMethod', 44100, (err, det) => {
  if (!err) {
    det.getPitchSync(java.newArray('float', A440.slice(0, 1023))).getPitch((err, pitch) => {
      if (!err) {
        console.log('Assync pitch', pitch)
      }
    })
  }
})
