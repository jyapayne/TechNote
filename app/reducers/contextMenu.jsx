import { UPDATE_CONTEXT_MENU, OPEN_CONTEXT_MENU, CLOSE_CONTEXT_MENU } from '../constants'


const initialState =
  {
    opened: false,
    x: 0,
    y: 0,
    items: []
  }

export default function contextMenu(state = initialState, action){
    switch (action.type) {
        case UPDATE_CONTEXT_MENU:
            return Object.assign({}, state,{
                items: action.items
            })
        case OPEN_CONTEXT_MENU:
            return Object.assign({}, state, {
                opened: true,
                x: action.x,
                y: action.y
            })
        case CLOSE_CONTEXT_MENU:
            return Object.assign({}, state, {
                opened: false
            })
        default:
            return state
    }
}
