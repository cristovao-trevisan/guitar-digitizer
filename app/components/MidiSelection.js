import React from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown } from 'semantic-ui-react'

class MidiSelection extends React.Component {
  static propTypes = {
    devices: PropTypes.array.isRequired,
    onOpenClick: PropTypes.func.isRequired
  }

  handleOpenClick = () => {
    const device = this.refs.devices.getSelectedItem().value
    this.props.onOpenClick(device)
  }

  render () {
    const { devices } = this.props
    const options = devices.map((name, i) => {
      return {
        key: i, text: name, value: name
      }
    })
    return (
      <Button.Group style={{width: '95%'}}>
        <Dropdown ref='devices' options={options} button />
        <Button onClick={this.handleOpenClick}>Open</Button>
      </Button.Group>
    )
  }
}

export default MidiSelection
