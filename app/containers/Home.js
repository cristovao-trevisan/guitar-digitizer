import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'

import { setDevice, setSignalToMidiConnection, removeSignalToMidiConnection } from '../actions'
import { open as openMidi, close as closeMidi } from '../modules/midi'

import SignalsList from '../components/SignalsList'
import DevicesSelection from '../components/DevicesSelection'
import MidiSelection from '../components/MidiSelection'
import MidiList from '../components/MidiList'
import SignalToMidiConnectionsList from '../components/SignalToMidiConnectionsList'

class Home extends React.Component {
  state = {
    selectedSignals: {},
    selectedMidi: null
  }

  handleSignalClick = name => this.setState({ selectedSignals: {
    ...this.state.selectedSignals,
    [name]: !this.state.selectedSignals[name]
  } })

  handleSignalToMidiConnection = () => {
    const { selectedMidi, selectedSignals } = this.state
    if (selectedMidi) {
      for (let name in selectedSignals) {
        if (selectedSignals[name]) {
          let signal = this.props.signals.find(signal => signal.name === name)
          this.props.setSignalToMidiConnection(signal, selectedMidi)
        }
      }
    }
  }

  render () {
    return (
      <div style={{width: '100%'}}>
        <div style={{marginTop: '2%', float: 'left', marginLeft: '5%', width: '25%'}}>
          <DevicesSelection
            devices={this.props.devices}
            device={this.props.device}
            onOpenClick={this.props.setDevice} />
          <SignalsList
            signals={this.props.signals}
            selectedSignals={this.state.selectedSignals}
            onClick={this.handleSignalClick} />
        </div>
        <div style={{marginTop: '2%', float: 'left', marginLeft: '5%', width: '25%'}}>
          <MidiSelection
            devices={this.props.midi.devices}
            onOpenClick={openMidi} />
          <MidiList
            devices={this.props.midi.openDevices}
            onCloseClick={closeMidi}
            onChange={selectedMidi => this.setState({ selectedMidi })} />
        </div>
        <div style={{marginTop: '2%', float: 'left', marginLeft: '5%', width: '25%'}}>
          <Button onClick={this.handleSignalToMidiConnection}>Connect Signal to Midi</Button>
          <SignalToMidiConnectionsList
            connections={this.props.signalToMidiConnections}
            onCloseClick={this.props.removeSignalToMidiConnection}
             />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  device: state.device,
  devices: state.devices,
  signals: state.signals,
  midi: state.midi,
  signalToMidiConnections: state.signalToMidiConnections
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setDevice: device => dispatch(setDevice(device)),
  setSignalToMidiConnection: (signal, midi) => dispatch(setSignalToMidiConnection(signal, midi, 1)),
  removeSignalToMidiConnection: id => dispatch(removeSignalToMidiConnection(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
