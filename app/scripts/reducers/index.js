'use strict'
import { combineReducers } from 'redux'
import async from './async'
import reports from './reports'
import reportMap from './report-map'
import reportVersions from './report-versions'
import forms from './forms'
import uploadReport from './upload-report'
import newReport from './new-report'
import user from './user'
import countries from './countries'
import emergencies from './emergencies'
import emergencyMap from './emergency-map'
import featured from './featured-emergencies'
import tags from './tags'

export default combineReducers({
  reports,
  reportMap,
  reportVersions,
  async,
  forms,
  uploadReport,
  newReport,
  user,
  countries,
  emergencies,
  emergencyMap,
  featured,
  tags
})
