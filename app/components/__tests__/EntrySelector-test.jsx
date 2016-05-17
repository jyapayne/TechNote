jest.autoMockOff()

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin()

const { Provider } = require('react-redux')
const App = require('../../containers/App').default
const EntrySelector = require('../EntrySelector').default

const configureStore  = require('../../store/configureStore').default

const store = configureStore()

const Chrome49 = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36'

global.navigator = { userAgent: Chrome49 }

describe('EntrySelector', () => {

    it('test jest', () => {
        var prov = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <App />
            </Provider>
        )
        var entrySelector = TestUtils.findRenderedComponentWithType(prov, EntrySelector)
        expect(entrySelector.state.notes.length).toEqual(0)
    })
})
