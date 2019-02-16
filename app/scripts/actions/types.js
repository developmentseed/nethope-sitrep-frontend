'use strict'

import { createTypes, async } from 'redux-action-creator'

const types = createTypes([
  ...async('GET_REPORTS'),
  'POLL',
  'POLLSTOP'
])

export default types
