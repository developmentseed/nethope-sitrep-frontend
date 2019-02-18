'use strict'
import { combineReducers } from 'redux'
import async from './async'
import reports from './reports'

const app = (initialState = {}) => initialState
export default combineReducers({
  reports,
  async
})
