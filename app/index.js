import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import 'semantic-ui-css/semantic.min.css'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './components/App'
import reducers from './reducers'
import * as usb from './modules/usb'
import {addDevice, removeDevice} from './actions'
import './css/index.css'

const store = createStore(reducers)

usb.getDevices().forEach(device => {
  store.dispatch(addDevice(device))
})
usb.onAttach(device => store.dispatch(addDevice(device)))
usb.onDetach(device => store.dispatch(removeDevice(device)))

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default
    render(NextApp)
  })
}
