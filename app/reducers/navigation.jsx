import { UPDATE_SELECTION } from '../constants/navigation'

const initialState =
{
    selection: {
    }
}

export default function navigation(state = initialState, action){
    switch (action.type) {
        case UPDATE_SELECTION:
            return Object.assign({}, state, {
                selection: action.selection
            })
        default:
            return state
    }
}
