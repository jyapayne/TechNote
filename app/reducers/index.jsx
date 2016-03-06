import { combineReducers } from 'redux'
import contextMenu from './contextMenu'
import navigation from './navigation'

const rootReducer = combineReducers({
    contextMenu,
    navigation
})

export default rootReducer
