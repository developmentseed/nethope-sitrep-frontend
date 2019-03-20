'use strict'

import { createTypes, async } from 'redux-action-creator'

const types = createTypes([
  ...async('GET_REPORTS'),
  ...async('GET_REPORT'),
  ...async('PATCH_REPORT'),
  ...async('GET_REPORT_VERSIONS'),

  ...async('READ_REPORT'),
  ...async('POST_REPORT'),

  ...async('GET_COUNTRIES'),
  ...async('GET_EMERGENCIES'),
  ...async('GET_EMERGENCY'),

  ...async('GET_FEATURED_EMERGENCIES'),
  ...async('GET_STATIC_COUNTRY_ASSETS'),
  ...async('GET_STATIC_EMERGENCY_ASSETS'),

  ...async('GET_TAGS'),
  'SET_USER_CREDENTIALS',
  'CLEAR_USER_CREDENTIALS',

  'CLEAR_UPLOAD_REPORT_STATE',

  'CREATE_REPORT_SYNC',
  'CREATE_REPORT_CLEAR',

  'CREATE_FORM',
  'UPDATE_FORM',
  'DESTROY_FORM'
])

export default types
