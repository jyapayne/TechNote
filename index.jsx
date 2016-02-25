import React from 'react'
import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin()
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './app/containers/App'
import configureStore from './app/store/configureStore'

const store = configureStore()

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('main')
)

