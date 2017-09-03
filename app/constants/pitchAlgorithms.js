module.exports = [
  {
    name: 'MacLeod',
    options: [
      {
        name: 'freqCutoff',
        label: 'Min. Freq.',
        default: 80,
        step: 1
      }, {
        name: 'cutoff',
        label: 'Cut Off',
        default: 0.93,
        step: 0.01
      }, {
        name: 'probabilityThreshold',
        label: 'Prob. Threshold',
        default: 0,
        step: 0.1
      }
    ]
  }, {
    name: 'YIN',
    options: [
      {
        name: 'threshold',
        label: 'Threshold',
        default: 0.1,
        step: 0.01
      }, {
        name: 'probabilityThreshold',
        label: 'Prob. Threshold',
        default: 0,
        step: 0.1
      }
    ]
  }
]
