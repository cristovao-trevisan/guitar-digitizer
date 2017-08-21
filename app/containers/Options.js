import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Input } from 'semantic-ui-react'

import pitchAlgorithms from '../constants/pitchAlgorithms'
import { setOption } from '../actions'

class Options extends React.Component {
  handleAlgorithmChange = (e, { value }) => this.props.setOption('pitchAlgorithm', value)

  handleOptionChange = (algorithm, optionName) => (e, { value }) => this.props.setOption(algorithm, Object.assign(
    {}, this.props.options[algorithm] || {}, {[optionName]: value}
  ))

  renderPitchAlgorithmOptions = () => {
    const algorithm = this.props.options.pitchAlgorithm
    const index = pitchAlgorithms.findIndex(algo => algorithm === algo.name)
    const options = pitchAlgorithms[index || 0].options
    const values = this.props.options[algorithm] || {}
    return (
      <div key={algorithm}>
        {
          options.map(option => (
            <Input
              key={option.name}
              type='number'
              onChange={this.handleOptionChange(algorithm, option.name)}
              value={values[option.name]}
              label={option.label}
              defaultValue={option.default} />
          ))
        }
      </div>
    )
  }

  render () {
    const { pitchAlgorithm } = this.props.options
    const dropdownOptions = pitchAlgorithms.map(algo => ({text: algo.name, value: algo.name, key: algo.name}))

    return (
      <div style={{marginTop: '2%', marginLeft: '2%'}}>
        <Dropdown options={dropdownOptions} value={pitchAlgorithm} onChange={this.handleAlgorithmChange} style={{width: 110, whiteSpace: 'nowrap'}} />
        {this.renderPitchAlgorithmOptions()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  options: state.options
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setOption: (id, value) => dispatch(setOption(id, value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Options)
