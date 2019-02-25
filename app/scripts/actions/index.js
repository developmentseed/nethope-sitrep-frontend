'use strict'
import url from 'url'
import { actionCreator, asyncActionCreator } from 'redux-action-creator'
import axios from 'axios'
import types from './types'
import { api, authToken } from '../config'

if (!authToken) {
  console.warn('No auth token found in local config. API requests will fail.') // eslint-disable-line no-console
} else {
  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
}

// Note, For "detail" queries, ie a single report, we include
// a special header so the API returns the data as an object,
// and throws an error code if it's not found.
// Otherwise, it would return an empty array.
// http://postgrest.org/en/v5.2/api.html#singular-or-plural

export const getReports = asyncActionCreator(
  types.GET_REPORTS,
  () => axios.get(url.resolve(api, 'reports'))
)

export const getReport = asyncActionCreator(
  types.GET_REPORT, 'id',
  ({ id }) => axios.get(url.resolve(api, `reports?id=eq.${id}`), {
    headers: { Accept: 'application/vnd.pgrst.object+json' }
  })
)

export const getReportVersions = asyncActionCreator(
  types.GET_REPORT_VERSIONS, 'docID',
  ({ docID }) => axios.get(url.resolve(api, `reports?doc_id=eq.${docID}`))
)

export const patchReport = asyncActionCreator(
  types.PATCH_REPORT, 'id', 'payload',
  ({ id, payload }) => axios.patch(url.resolve(api, `reports?id=eq.${id}`), payload, {
    headers: {
      Prefer: 'return=representation',
      Accept: 'application/vnd.pgrst.object+json'
    }
  })
)

export const postReport = asyncActionCreator(
  types.POST_REPORT, 'payload', 'lastReport',
  ({ payload }) => axios.post(url.resolve(api, 'reports'), payload, {
    headers: {
      Prefer: 'return=representation',
      Accept: 'application/vnd.pgrst.object+json'
    }
  })
)

export const forms = {
  create: actionCreator(types.CREATE_FORM, 'formID', 'initialValue'),
  update: actionCreator(types.UPDATE_FORM, 'formID', 'value'),
  destroy: actionCreator(types.DESTROY_FORM, 'formID')
}

export const readReport = {
  readReportStart: actionCreator(types.READ_REPORT),
  readReportFail: actionCreator(types.READ_REPORT_FAIL, 'error'),
  readReportSuccess: actionCreator(types.READ_REPORT_SUCCESS, 'report')
}

export const clearUploadState = actionCreator(types.CLEAR_UPLOAD_REPORT_STATE)

export const user = {
  setCredentials: actionCreator(types.SET_USER_CREDENTIALS, 'accessToken', 'idToken', 'expiresAt'),
  clearCredentials: actionCreator(types.CLEAR_USER_CREDENTIALS)
}
