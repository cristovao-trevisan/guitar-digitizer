import React from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown } from 'semantic-ui-react'

class DevicesSelection extends React.Component {
  static propTypes = {
    devices: PropTypes.array.isRequired,
    onOpenClick: PropTypes.func.isRequired,
    device: PropTypes.object
  }

  handleOpenClick = () => {
    const device = this.props.devices[this.refs.devices.getSelectedItem().value]
    this.props.onOpenClick(device)
  }

  render () {
    const { devices, device } = this.props
    let selectedDevice
    const options = devices.map((d, i) => {
      if (d === device) selectedDevice = i
      return {
        key: i, text: 'Device ' + i, value: i
      }
    })

    return (
      <Button.Group style={{width: '95%'}}>
        <Dropdown ref='devices' defaultValue={selectedDevice} options={options} button />
        <Button onClick={this.handleOpenClick}>Open</Button>
      </Button.Group>
    )
  }
}

export default DevicesSelection
