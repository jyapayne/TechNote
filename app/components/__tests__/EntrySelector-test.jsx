jest.autoMockOff()

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

const EntrySelector = require('../EntrySelector').default

describe('EntrySelector', () => {

    it('test jest', () => {
        var entrySelector = TestUtils.renderIntoDocument(
            <EntrySelector id="entry-selector" className="left inline fill-height" />
        )
        expect(entrySelector.state.notes.length).toEqual(0)
    })
})
