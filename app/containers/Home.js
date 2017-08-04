import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Button, List } from 'semantic-ui-react'

class Home extends React.Component {
  state = {
    selectedSignals: {}
  }

  handleSignalClick = (e, {name}) => this.setState({ selectedSignals: {
    ...this.state.selectedSignals,
    [name]: !this.state.selectedSignals[name]
  } })

  render () {
    let signals = ['Sig 1', 'Sig 2', 'Sig 3']
    const options = this.props.devices.map((device, i) => ({
      key: i, text: 'Device ' + i, value: i
    }))

    return (
      <div style={{marginTop: '2%'}}>
        <div style={{float: 'left', marginLeft: '5%'}}>
          <Button.Group color='gray'>
            <Dropdown options={options} button style={{width: 110, whiteSpace: 'nowrap'}} />
            <Button>Open</Button>
          </Button.Group>
          <List selection animated style={{
            borderBottom: 'groove rgba(224, 225, 226, 0.23)',
            borderRight: 'groove rgba(224, 225, 226, 0.23)',
            height: 200,
            overflow: 'auto'
          }}>
            {
              signals.map(signal => (
                <List.Item active={this.state.selectedSignals[signal]}
                  onClick={this.handleSignalClick}
                  name={signal}>
                  {signal}
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
  devices: state.devices
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
