import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import thunkMiddleware from 'redux-thunk'

export default function configureStore(initialState) {
    const store = createStore(rootReducer,
                              applyMiddleware(thunkMiddleware),
                              initialState)
    return store
}

