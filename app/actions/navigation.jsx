import * as types from '../constants/navigation'

export function updateSelection(selection, callback) {
    return {
        type: types.UPDATE_SELECTION,
        selection,
        callback
    }
}

export function addMenuItem(item, callback){
    return {
        type: types.ADD_MENU_ITEM,
        item,
        callback
    }
}

export function updateMenuItem(item, index, callback){
    return {
        type: types.UPDATE_MENU_ITEM,
        item,
        index,
        callback
    }
}

export function removeMenuItem(index, callback){
    return {
        type: types.REMOVE_MENU_ITEM,
        index,
        callback
    }
}

export function addNotebook(notebook, callback){
    return {
        type: types.ADD_NOTEBOOK,
        notebook,
        callback
    }
}

export function removeNotebook(index, callback){
    return {
        type: types.REMOVE_NOTEBOOK,
        index,
        callback
    }
}

export function updateNotebook(notebook, index, callback){
    return {
        type: types.UPDATE_NOTEBOOK,
        notebook,
        index,
        callback
    }
}

export function sortNotebooks(sortFunc, callback){
    return {
        type: types.SORT_NOTEBOOKS,
        sortFunc,
        callback
    }
}

export function refreshNavigation(callback){
    return {
        type: types.REFRESH,
        callback
    }
}
