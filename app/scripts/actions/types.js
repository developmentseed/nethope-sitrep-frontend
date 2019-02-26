'use strict'

import { createTypes, async } from 'redux-action-creator'

const types = createTypes([
  ...async('GET_REPORTS'),
  ...async('GET_REPORT'),
  ...async('PATCH_REPORT'),
  ...async('GET_REPORT_VERSIONS'),

  ...async('READ_REPORT'),
  ...async('POST_REPORT'),

  'SET_USER_CREDENTIALS',
  'CLEAR_USER_CREDENTIALS',

  'CLEAR_UPLOAD_REPORT_STATE',

  'CREATE_FORM',
  'UPDATE_FORM',
  'DESTROY_FORM'
])

export default types
