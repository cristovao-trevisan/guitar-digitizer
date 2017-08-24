import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Checkbox } from 'semantic-ui-react'
import Plotter from 'react-plotter'
import LineStyle from 'react-plotter/dist/plot-styles/line'
import CircleMarker from 'react-plotter/dist/markers/circle'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import { setPlotPageProp } from '../actions'
import { sampleFrequency } from '../constants/guitar'

const milliSecondsToSamples = (time) => parseInt(time * sampleFrequency / 1000)

const style = LineStyle({marker: CircleMarker()})
class Plot extends React.Component {
  state = {
    signal: undefined,
    dataSize: milliSecondsToSamples(1000)
  }

  componentWillReceiveProps (props) {
    if (props.timeWindow !== this.props.timeWindow) {
      this.setState({
        dataSize: milliSecondsToSamples(props.timeWindow)
      })
    }
  }

  handleSignalChange = (e, { value }) => this.setState({signal: value})

  handleTimeWindowChange = timeWindow => this.props.setPlotPageProp({ timeWindow })

  handleTriggerValueChange = triggerValue => this.props.setPlotPageProp({ triggerValue })

  handleTriggerChange = (e, { checked }) => this.props.setPlotPageProp({ trigger: checked })

  render () {
    const options = this.props.signals.map(signal => ({
      key: signal.id, text: signal.name, value: signal.id
    }))

    let data = (this.props.signalsData || {})[this.state.signal]
    let height = Math.max(window.innerHeight * 0.4, 190)
    return (
      <div style={{marginTop: '2%', marginLeft: '2%'}}>
        <Dropdown options={options} onChange={this.handleSignalChange} style={{width: 110, whiteSpace: 'nowrap'}} fluid selection />
        <div style={{height: window.innerHeight * 0.4, minHeight: 190}}>
          <div style={{float: 'left'}}>
            <Plotter
              min={-0x7ff}
              max={+0x7FF}
              dataSize={this.state.dataSize}
              width={window.innerWidth * 0.6}
              height={height}
              appendData={data}
              initialData={[0, 10]}
              trigger={this.props.trigger ? this.props.triggerValue : undefined}
              style={style} />
          </div>
          <div style={{float: 'left', marginLeft: 10}}>
            <Checkbox label='Trigger' style={{marginLeft: 6.5, display: 'block'}} onChange={this.handleTriggerChange} checked={this.props.trigger} />
            <div style={{marginTop: (height / 2 - 95 - 17 + 5), width: 30, display: 'inline-block'}}>
              <Slider
                tooltip
                min={-0x7ff}
                max={+0x7FF}
                value={this.props.triggerValue}
                orientation='vertical'
                onChange={this.handleTriggerValueChange} />
            </div>
          </div>
        </div>
        <div style={{width: window.innerWidth * 0.6, paddingLeft: 5, paddingRight: 10}}>
          <Slider
            tooltip
            min={1}
            max={2000}
            labels={{1: '1ms', 500: '500ms', 1000: '1s', 2000: '2s'}}
            value={this.props.timeWindow}
            onChange={this.handleTimeWindowChange} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  signals: state.signals,
  signalsData: state.signalsData,
  timeWindow: state.plotPage.timeWindow || 1000,
  triggerValue: state.plotPage.triggerValue || 0,
  trigger: state.plotPage.trigger || false
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setPlotPageProp: props => dispatch(setPlotPageProp(props))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plot)
