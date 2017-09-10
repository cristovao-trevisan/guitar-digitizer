const { calculateAverageAmplitude } = require('../app/modules/calculator')

const { Sinewave } = require('wave-generator')

const sinewave = Sinewave(2048, 440, 44100, 500)(2048)

console.time('average amplitude')
for (let i = 0; i < 10000; i++) {
  var amplitude = calculateAverageAmplitude(sinewave)
}
console.timeEnd('average amplitude')
console.log(amplitude)
