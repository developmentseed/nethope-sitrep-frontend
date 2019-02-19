'use strict'

import { createTypes, async } from 'redux-action-creator'

const types = createTypes([
  ...async('GET_REPORTS'),
  ...async('GET_REPORT'),
  ...async('PATCH_REPORT'),

  'CREATE_FORM',
  'UPDATE_FORM',
  'DESTROY_FORM'
])

export default types
