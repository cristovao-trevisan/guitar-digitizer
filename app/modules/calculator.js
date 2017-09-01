/**
 * @param {number[]} data
 * @return {number} The mean amplitude (removing DC component)
 */
export const calculateAverageAmplitude = data => {
  let mean = 0
  let amplitude = 0

  for (let value of data) {
    mean += value
  }
  mean /= data.length
  for (let value of data) {
    amplitude += Math.abs(value - mean)
  }

  return amplitude / data.length
}
