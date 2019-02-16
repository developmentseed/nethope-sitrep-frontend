'use strict'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import { environment } from './config'

const middlewares = [thunk]

if (environment !== 'production') {
  const logger = require('redux-logger').default
  middlewares.push(logger)
}

const composeEnhancers = environment !== 'production' ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose

const initialState = {}
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(...middlewares)))

export default store
