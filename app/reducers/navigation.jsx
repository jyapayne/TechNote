import {
    UPDATE_SELECTION,
    ADD_MENU_ITEM,
    UPDATE_MENU_ITEM,
    REMOVE_MENU_ITEM,
    ADD_NOTEBOOK,
    REMOVE_NOTEBOOK,
    UPDATE_NOTEBOOK,
    NOTE_ADDED,
    SORT_NOTEBOOKS,
    NOTEBOOK_TYPE,
    MAX_MENU_ITEMS,
    MENU_TYPE,
    REFRESH
} from '../constants/navigation'

import React from 'react'
import Styles from 'material-ui/lib/styles'
import ActionGrade from 'material-ui/lib/svg-icons/action/grade'
import History from 'material-ui/lib/svg-icons/action/history'
import Folder from 'material-ui/lib/svg-icons/file/folder'
import Delete from 'material-ui/lib/svg-icons/action/delete'

import * as utils from '../utils'
import glob from 'glob'
import jsfile from 'jsonfile'
import path from 'path-extra'
import mkdirp from 'mkdirp'

const Colors = Styles.Colors

const initialState = getInitialState()

var emptyFunc = () => {}

function initDefaultNotebookPath(notebook){
    var nbPath = utils.getNotebookPath(notebook)
    var dir = mkdirp.sync(nbPath)

    var notePath = utils.getNotebookPath(notebook)

    var meta = {
        'name': notebook.title,
        'uuid': notebook.uuid
    }

    var metaPath = path.join(nbPath, 'meta.json')
    jsfile.writeFileSync(metaPath, meta)

}

function getInitialState(){
    var menuItems = [
        {
            'name': 'Entries',
            'isNotebook': true,
            'icon': <img src="images/note.svg"/>,
        },
        {
            'name': 'Starred',
            'notes': 0,
            'icon': <ActionGrade color={Colors.amberA700}/>,
        },
        {
            'name': 'Recents',
            'notes': 0,
            'icon': <History color="#4BAE4E"/>,
            'glob': '*.qvnotebook/*.qvnote',
            'filter': (notes) => {
                // Get the most recent notes
                notes.sort(utils.compareNotes())
                return notes.slice(0, MAX_MENU_ITEMS)
            }
        },
        {
            'name': 'Trash',
            'isNotebook': true,
            'icon': <Delete color={Colors.grey500}/>,
        },
        {
            'name': 'All Notes',
            'notes': 0,
            'glob': '*.qvnotebook/*.qvnote',
            'icon': <Folder color="#FFCC5F" />,
        }

    ]

    for(var i=0; i<menuItems.length; i++){
        var menuItem = menuItems[i]
        if(menuItem.isNotebook){
            var temp = {
                title: menuItem.name,
                uuid: menuItem.name,
                notes: 0
            }

            initDefaultNotebookPath(temp)

            var loaded = utils.loadNotebookByName(menuItem.name)

            menuItem.title = loaded.title
            menuItem.uuid = loaded.uuid
            menuItem.path = loaded.path
            menuItem.notes = loaded.notes
        }
        else if(menuItem.glob){
            var dataPath = utils.getAppDataPath()
            var notes = glob.sync(path.join(dataPath, menuItem.glob))

            if(menuItem.filter){
                notes = menuItem.filter(notes)
            }

            menuItem.title = menuItem.name
            menuItem.uuid = menuItem.name
            menuItem.notes = notes.length
        }
    }

    const state = {
        selection: menuItems[0],
        selectionIndex: 0,
        selectionType: MENU_TYPE,
        clickedCallbacks: [],
        menuItems: menuItems,
        notebooks: [],
        callback: () => {}
    }

    return state
}


export default function navigation(state = initialState, action){
    switch (action.type) {
        case UPDATE_SELECTION:

            var selectionDetails = findIndex(state, action.selection)

            return Object.assign({}, state, {
                selection: action.selection,
                selectionType: selectionDetails.type,
                selectionIndex: selectionDetails.index,
                callback: action.callback || emptyFunc
            })
        case ADD_MENU_ITEM:
            state.menuItems.push(action.item)
            return Object.assign({}, state, {
                menuItems: state.menuItems,
                callback: action.callback || emptyFunc
            })
        case REMOVE_MENU_ITEM:
            state.menuItems.splice(action.index, 1)
            return Object.assign({}, state, {
                menuItems: state.menuItems,
                callback: action.callback || emptyFunc
            })
        case ADD_NOTEBOOK:
            state.notebooks.splice(0, 0, action.notebook)
            return Object.assign({}, state, {
                notebooks: state.notebooks,
                callback: action.callback || emptyFunc
            })
        case REMOVE_NOTEBOOK:
            state.notebooks.splice(action.index, 1)
            return Object.assign({}, state, {
                notebooks: state.notebooks,
                callback: action.callback || emptyFunc
            })
        case UPDATE_MENU_ITEM:
            state.menuItems[action.index] = action.item
            return Object.assign({}, state, {
                menuItems: state.menuItems,
                callback: action.callback || emptyFunc
            })
        case UPDATE_NOTEBOOK:
            state.notebooks[action.index] = action.notebook
            return Object.assign({}, state, {
                notebooks: state.notebooks,
                callback: action.callback || emptyFunc
            })

        case SORT_NOTEBOOKS:
            state.notebooks.sort(action.sortFunc)
            return Object.assign({}, state, {
                notebooks: state.notebooks,
                callback: action.callback || emptyFunc
            })

        case REFRESH:

            var menuItems = refreshMenuItems(state)
            var newNotebooks = refreshNotebooks()

            return Object.assign({}, state, {
                notebooks: newNotebooks,
                menuItems: menuItems,
                callback: action.callback || emptyFunc
            })
        case NOTE_ADDED:
            var notebookIndex = state.selectionIndex

            if(state.selectionType == MENU_TYPE){
                var menuItem = state.menuItems[notebookIndex]
                menuItem.notes += 1
            }
            else if(state.selectionType == NOTEBOOK_TYPE){
                var notebook = state.notebooks[notebookIndex]
                notebook.notes += 1
            }

            for(var i=0; i<state.menuItems.length; i++){
                var menuItem = state.menuItems[i]
                if (menuItem.uuid == 'All Notes'){
                    menuItem.notes += 1
                }
                if(menuItem.uuid == 'Recents'){
                    if(menuItem.notes < MAX_MENU_ITEMS){
                        menuItem.notes += 1
                    }
                }
            }

            return Object.assign({}, state, {
                notebooks: state.notebooks,
                menuItems: state.menuItems,
                callback: action.callback || emptyFunc
            })

        default:
            return state
    }
}

function findIndexGeneric(array, notebook, type){
    for(var i=0; i<array.length; i++){
        var item = array[i]
        if (item.uuid == notebook.uuid){
            return {
                'type': type,
                'index': i
            }
        }
    }
    return null
}

function findIndex(state, notebook){
    var result = null
    result = findIndexGeneric(state.menuItems, notebook, MENU_TYPE)

    if (result != null){
        return result
    }

    result = findIndexGeneric(state.notebooks, notebook, NOTEBOOK_TYPE)

    if (result != null){
        return result
    }

    return {'type': MENU_TYPE, 'index': 0}
}

function refreshMenuItems(state){
    var menuItems = state.menuItems
    for(var i=0; i<menuItems.length; i++){
        var menuItem = menuItems[i]
        if(menuItem.isNotebook){
            var temp = {
                title: menuItem.name,
                uuid: menuItem.name,
                notes: 0
            }

            var loaded = utils.loadNotebookByName(menuItem.name)

            menuItem.title = loaded.title
            menuItem.uuid = loaded.uuid
            menuItem.path = loaded.path
            menuItem.notes = loaded.notes
        }
        else if(menuItem.glob){
            var dataPath = utils.getAppDataPath()
            var notes = glob.sync(path.join(dataPath, menuItem.glob))

            if(menuItem.filter){
                notes = menuItem.filter(notes)
            }

            menuItem.title = menuItem.name
            menuItem.uuid = menuItem.name
            menuItem.notes = notes.length
        }
    }

    return menuItems
}

function refreshNotebooks(){

    var dataPath = utils.getAppDataPath()
    var notebooks = glob.sync(path.join(dataPath, '!(Entries|Trash).qvnotebook'))
    var newNotebooks = []
    for(var i=0; i<notebooks.length; i++){
        var nbPath = notebooks[i]
        var obj = jsfile.readFileSync(path.join(nbPath, 'meta.json'))
        var notes = glob.sync(path.join(nbPath, '*.qvnote'))

        var nb = {}
        nb.title = obj.name
        nb.uuid = obj.uuid
        nb.notes = notes.length
        nb.path = nbPath

        if(nb.title == ''){
            nb.state = 'editing'
        }
        else{
            nb.state = 'displaying'
        }

        newNotebooks.push(nb)
    }

    newNotebooks.sort(utils.compareNotebooks)
    return newNotebooks
}
