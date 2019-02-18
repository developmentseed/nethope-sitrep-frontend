'use strict'

import { createTypes, async } from 'redux-action-creator'

const types = createTypes([
  ...async('GET_REPORTS')
])
console.log(types)

export default types
