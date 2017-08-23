import React from 'react'
import PropTypes from 'prop-types'
import { Icon, List } from 'semantic-ui-react'

class MidiList extends React.Component {
  static propTypes = {
    devices: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired
  }

  state = {
    selectedMidi: null
  }

  handleSelection = name => {
    let selectedMidi
    if (this.state.selectedMidi === name) selectedMidi = null
    else selectedMidi = name
    this.setState({ selectedMidi })
    this.props.onChange(selectedMidi)
  }

  handleCloseClick = device => () => {
    if (device === this.state.selectedMidi) {
      this.setState({ selectedMidi: null })
      this.props.onChange(null)
    }
    this.props.onCloseClick(device)
  }

  render () {
    const { devices } = this.props
    return (
      <List selection animated style={{
        borderBottom: 'groove rgba(224, 225, 226, 0.23)',
        borderRight: 'groove rgba(224, 225, 226, 0.23)',
        height: 200,
        overflow: 'auto'}}>
        {
          devices.map(device => (
            <List.Item active={this.state.selectedMidi === device}
              onClick={this.handleSelection.bind(this, device)}
              name={device}
              key={device}
              >
              <List.Content floated='left'>
                {device}
              </List.Content>
              <List.Content floated='right'>
                <Icon link name='close' onClick={this.handleCloseClick(device)} />
              </List.Content>
            </List.Item>
          ))
        }
      </List>
    )
  }
}

export default MidiList
