import React from 'react'
import { Icon, Menu } from 'semantic-ui-react'

export default class SideBar extends React.Component {
  state = { activeItem: 'gamepad' }

  handleItemClick = (e, { name }) => this.props.onItemChange(name)

  render () {
    const { activeItem, items = [] } = this.props

    let toRender = []
    items.forEach(([name, icon], i) => {
      toRender.push(
        <Menu.Item key={i} active={activeItem === name} name={name} onClick={this.handleItemClick}>
          <Icon name={icon} />
          {name}
        </Menu.Item>
      )
    })

    return (
      <Menu icon='labeled' size='tiny' vertical inverted style={{height: '100%', width: '80px', borderRadius: 0}}>
        {toRender}
      </Menu>
    )
  }
}
