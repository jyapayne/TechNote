import * as types from '../constants/contextMenu'

export function updateContextMenu(items) {
      return { type: types.UPDATE_CONTEXT_MENU, items }
}

export function openContextMenu(x, y){
    return {type: types.OPEN_CONTEXT_MENU, x, y}
}

export function closeContextMenu(){
    return {type: types.CLOSE_CONTEXT_MENU}
}
