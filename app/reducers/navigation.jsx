import {
    UPDATE_SELECTION,
    ADD_MENU_ITEM,
    UPDATE_MENU_ITEM,
    REMOVE_MENU_ITEM,
    ADD_NOTEBOOK,
    REMOVE_NOTEBOOK,
    UPDATE_NOTEBOOK,
    SORT_NOTEBOOKS,
    NOTEBOOK_TYPE,
    MENU_TYPE,
    REFRESH
} from '../constants/navigation'

import * as utils from '../utils'
import glob from 'glob'
import jsfile from 'jsonfile'
import path from 'path-extra'

// Load default selection
utils.createNotebookDir('Entries')

const initialState =
{
    selection: utils.loadNotebookByName('Entries'),
    selectionIndex: 0,
    selectionType: MENU_TYPE,
    menuItems: [],
    notebooks: [],
    callback: () => {}
}

var emptyFunc = () => {}

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
        var nb = menuItems[i]
        if(nb.isNotebook){
            var temp = {
                title: nb.name,
                uuid: nb.name,
                notes: 0
            }

            var loaded = utils.loadNotebookByName(nb.name)

            nb.title = loaded.title
            nb.uuid = loaded.uuid
            nb.path = loaded.path
            nb.notes = loaded.notes
        }
        else if(nb.glob){
            var dataPath = utils.getAppDataPath()
            var notes = glob.sync(path.join(dataPath, nb.glob))

            nb.title = nb.name
            nb.uuid = nb.name
            nb.notes = notes.length
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

        default:
            return state
    }
}
