'use strict'
import url from 'url'
import { asyncActionCreator } from 'redux-action-creator'
import axios from 'axios'
import types from './types'
import { api } from '../config'

export const getReports = asyncActionCreator(
  types.GET_REPORTS,
  () => axios.get(url.resolve(api, 'reports'))
)
