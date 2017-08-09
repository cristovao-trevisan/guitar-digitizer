import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Button, List } from 'semantic-ui-react'
import { setDevice } from '../actions'

class Home extends React.Component {
  state = {
    selectedSignals: {}
  }

  handleSignalClick = (e, {name}) => this.setState({ selectedSignals: {
    ...this.state.selectedSignals,
    [name]: !this.state.selectedSignals[name]
  } })

  handleOpenClick = () => this.props.setDevice(this.props.devices[this.refs.devices.getSelectedItem().value])

  render () {
    let selectedDevice
    const options = this.props.devices.map((device, i) => {
      if (device === this.props.device) selectedDevice = i
      return {
        key: i, text: 'Device ' + i, value: i
      }
    })

    return (
      <div style={{marginTop: '2%'}}>
        <div style={{float: 'left', marginLeft: '5%'}}>
          <Button.Group>
            <Dropdown ref='devices' defaultValue={selectedDevice} options={options} button style={{width: 110, whiteSpace: 'nowrap'}} />
            <Button onClick={this.handleOpenClick}>Open</Button>
          </Button.Group>
          <List selection animated style={{
            borderBottom: 'groove rgba(224, 225, 226, 0.23)',
            borderRight: 'groove rgba(224, 225, 226, 0.23)',
            height: 200,
            overflow: 'auto'
          }}>
            {
              this.props.signals.map(signal => (
                <List.Item active={this.state.selectedSignals[signal.name]}
                  onClick={this.handleSignalClick}
                  name={signal.name}
                  key={signal.id}>
                  {signal.name}
                </List.Item>
              ))
            }
          </List>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  device: state.device,
  devices: state.devices,
  signals: state.signals
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setDevice: device => dispatch(setDevice(device))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
