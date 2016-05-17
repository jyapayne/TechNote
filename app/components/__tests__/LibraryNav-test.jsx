jest.autoMockOff()

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

import path from 'path'

import fs from 'fs'

const Chrome49 = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36'

global.navigator = { userAgent: Chrome49 }

const injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin()

const LibraryNav = require('../LibraryNav').default
const { Provider } = require('react-redux')
const App = require('../../containers/App').default

const configureStore  = require('../../store/configureStore').default

const store = configureStore()

function tap(element){
    var dom = ReactDOM.findDOMNode(element).firstChild
    TestUtils.Simulate.touchTap(dom)
}

describe('LibraryNav', () => {

    it('test index select', (done) => {
        var prov = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <App />
            </Provider>
        )
        var libraryNav = TestUtils.findRenderedComponentWithType(prov, LibraryNav)

        var state = libraryNav.context.store.getState()
        expect(state.navigation.menuItems.length).toEqual(5)

        expect(state.navigation.selectionIndex).toEqual(0)

        var allNotesItem = libraryNav.refs['All Notes']
        libraryNav.menuItemClicked(allNotesItem.props.value, {}, () => {
            state = libraryNav.context.store.getState()
            expect(state.navigation.selectionIndex).toEqual(4)
            done()
        })

    })

    it('test add notebook', (done) => {
    
        var prov = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <App />
            </Provider>
        )
        var libraryNav = TestUtils.findRenderedComponentWithType(prov, LibraryNav)

        var state = libraryNav.context.store.getState()

        var initialLen = state.navigation.notebooks.length

        var callback = (notebook) => {
            var afterLen = state.navigation.notebooks.length

            expect(afterLen).toBeGreaterThan(initialLen)

            var nbExists = fs.existsSync(notebook.path)
            var nbMetaExists = fs.existsSync(path.join(notebook.path, 'meta.json'))
            expect(nbExists).toEqual(true)

            expect(nbMetaExists).toEqual(true)

            done()
        }
        libraryNav.addNotebookTapped(callback)
    })

    it('test delete notebook', (done) => {
        var prov = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <App />
            </Provider>
        )
        var libraryNav = TestUtils.findRenderedComponentWithType(prov, LibraryNav)

        var state = libraryNav.context.store.getState()

        var initialLen = state.navigation.notebooks.length

        var callback = (notebook) => {
            var afterLen = state.navigation.notebooks.length

            expect(initialLen).toBeGreaterThan(afterLen)

            var nbExists = fs.existsSync(notebook.path)
            expect(nbExists).toEqual(false)

            done()
        }

        libraryNav.deleteTapped(0, callback)

    })
})
