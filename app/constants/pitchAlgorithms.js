module.exports = [
  {
    name: 'MacLeod',
    options: [
      {
        name: 'freqCutoff',
        label: 'Min. Freq.',
        default: 80
      }, {
        name: 'cutoff',
        label: 'Cut Off',
        default: 0.93
      }, {
        name: 'probabilityThreshold',
        label: 'Prob. Threshold',
        default: 0
      }
    ]
  }, {
    name: 'YIN',
    options: [
      {
        name: 'threshold',
        label: 'Min. Freq.',
        default: 80
      }, {
        name: 'probabilityThreshold',
        label: 'Prob. Threshold',
        default: 0
      }
    ]
  }
]
