'use strict'
import { combineReducers } from 'redux'
import async from './async'
import reports from './reports'
import reportMap from './report-map'
import forms from './forms'
import uploadReport from './upload-report'
import user from './user'
import countries from './countries'
import emergencies from './emergencies'
import emergencyMap from './emergency-map'
import featured from './featured-emergencies'

export default combineReducers({
  reports,
  reportMap,
  async,
  forms,
  uploadReport,
  user,
  countries,
  emergencies,
  emergencyMap,
  featured
})
