jest.autoMockOff()

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

import * as utils from '../../utils'
utils.APP_NAME = 'JestTest'
import path from 'path'

import fs from 'fs'

const injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin()

const LibraryNav = require('../LibraryNav').default

function tap(element){
    var dom = ReactDOM.findDOMNode(element).firstChild
    TestUtils.Simulate.touchTap(dom)
}

describe('LibraryNav', () => {

    beforeEach(() => {
    })

    it('test index select', () => {
        var libraryNav = TestUtils.renderIntoDocument(
            <LibraryNav id="library-nav" className="left inline fill-height" />
        )
        expect(libraryNav.state.navItems.length).toEqual(5)

        var libraryNavList = libraryNav.refs.mainList

        var entriesItem = libraryNav.refs.Entries
        tap(entriesItem)
        expect(libraryNavList.state.selectedIndex).toEqual(0)

        var allNotesItem = libraryNav.refs['All Notes']
        tap(allNotesItem)
        expect(libraryNavList.state.selectedIndex).toEqual(4)
    })

    it('test add notebook', (done) => {
    
        var libraryNav = TestUtils.renderIntoDocument(
            <LibraryNav id="library-nav" className="left inline fill-height" />
        )
        
        var initialLen = libraryNav.state.notebooks.length

        var callback = (notebook) => {
            var afterLen = libraryNav.state.notebooks.length

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
        var libraryNav = TestUtils.renderIntoDocument(
            <LibraryNav id="library-nav" className="left inline fill-height" />
        )

        var initialLen = libraryNav.state.notebooks.length

        var callback = (notebook) => {
            var afterLen = libraryNav.state.notebooks.length

            expect(initialLen).toBeGreaterThan(afterLen)

            var nbExists = fs.existsSync(notebook.path)
            expect(nbExists).toEqual(false)

            done()
        }

        libraryNav.deleteTapped(0, callback)

    })
})
