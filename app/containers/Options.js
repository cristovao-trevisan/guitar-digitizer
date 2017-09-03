import React from 'react'
import { connect } from 'react-redux'
import { Button, Divider, Dropdown, Input, Segment } from 'semantic-ui-react'

import { createVirtual as createVirtualMidi } from '../modules/midi'

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
              step={option.step}
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

  handleCreateMidiClick = () => {
    const name = window.prompt('MIDI Name:', 'GUITAR MIDI')
    if (name) createVirtualMidi(name)
  }

  render () {
    const { pitchAlgorithm } = this.props.options
    const dropdownOptions = pitchAlgorithms.map(algo => ({text: algo.name, value: algo.name, key: algo.name}))

    return (
      <div style={{margin: '2%'}}>
        <Segment padded>
          <Dropdown options={dropdownOptions} value={pitchAlgorithm} onChange={this.handleAlgorithmChange} fluid selection style={{width: 110, whiteSpace: 'nowrap'}} />
          <Divider />
          {this.renderPitchAlgorithmOptions()}
        </Segment>
        <Button onClick={this.handleCreateMidiClick}>
          Create Virtual MIDI
        </Button>
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
