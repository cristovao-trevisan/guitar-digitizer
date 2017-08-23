import React from 'react'
import PropTypes from 'prop-types'
import { Icon, List } from 'semantic-ui-react'

class SignalToMidiConnectionsList extends React.Component {
  static propTypes = {
    connections: PropTypes.object.isRequired,
    onCloseClick: PropTypes.func.isRequired
  }

  render () {
    const { connections } = this.props
    const list = []
    for (let id in connections) {
      list.push({
        signal: connections[id].signal,
        midi: connections[id].midi
      })
    }

    return (
      <List selection animated style={{
        borderBottom: 'groove rgba(224, 225, 226, 0.23)',
        borderRight: 'groove rgba(224, 225, 226, 0.23)',
        height: 200,
        overflow: 'auto'}}>
        {
          list.map(({signal, midi}) => (
            <List.Item
              key={signal.id}
              >
              <List.Content floated='left'>
                {signal.name + ' -> ' + midi}
              </List.Content>
              <List.Content floated='right'>
                <Icon link name='close' onClick={() => this.props.onCloseClick(signal.id)} />
              </List.Content>
            </List.Item>
          ))
        }
      </List>
    )
  }
}

export default SignalToMidiConnectionsList
