'use strict'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import { environment } from './config'

const initialState = {}
const composeEnhancers = environment !== 'production' ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compos
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)))

export default store
