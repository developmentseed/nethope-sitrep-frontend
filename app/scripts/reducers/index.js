'use strict'
import { combineReducers } from 'redux'
import async from './async'
import reports from './reports'

export default combineReducers({
  reports,
  async
})
