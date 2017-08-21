import React from 'react'

import SideBar from './SideBar'
import Home from '../containers/Home'
import Plot from '../containers/Plot'
import Options from '../containers/Options'

class App extends React.Component {
  state = {
    activePage: 'Home'
  }

  handlePageChange = item => this.setState({activePage: item})

  render () {
    let page
    switch (this.state.activePage) {
      case 'Plot': {
        page = <Plot />
        break
      }
      case 'Options': {
        page = <Options />
        break
      }
      default: { // Home
        page = <Home />
      }
    }

    return (
      <div>
        <div style={{float: 'left', width: 80}}>
          <SideBar
            activeItem={this.state.activePage}
            onItemChange={this.handlePageChange}
            items={[['Home', 'home'], ['Plot', 'line chart'], ['Options', 'options']]} />
          {/* items = [title, iconName ] */}
        </div>
        <div style={{float: 'left', width: 'calc(100% - 80px)'}}>
          { page }
        </div>
      </div>
    )
  }
}

export default App
