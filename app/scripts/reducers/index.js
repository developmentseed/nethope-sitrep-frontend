'use strict'
import { combineReducers } from 'redux'
import async from './async'
import reports from './reports'
import reportMap from './report-map'
import forms from './forms'
import uploadReport from './upload-report'

export default combineReducers({
  reports,
  reportMap,
  async,
  forms,
  uploadReport
})
