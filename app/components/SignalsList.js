import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'semantic-ui-react'

const SignalsList = ({ signals, selectedSignals, onClick }) => (
  <List selection animated style={{
    borderBottom: 'groove rgba(224, 225, 226, 0.23)',
    borderRight: 'groove rgba(224, 225, 226, 0.23)',
    height: 200,
    overflow: 'auto'
  }}>
    {
      signals.map(signal => (
        <List.Item active={selectedSignals[signal.name]}
          onClick={(e, {name}) => onClick(name)}
          name={signal.name}
          key={signal.id}>
          {signal.name}
        </List.Item>
      ))
    }
  </List>
)

SignalsList.propTypes = {
  signals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedSignals: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default SignalsList
