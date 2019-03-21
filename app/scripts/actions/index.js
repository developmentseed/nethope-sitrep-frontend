'use strict'
import Promise from 'promise-polyfill'
import url from 'url'
import { actionCreator, asyncActionCreator } from 'redux-action-creator'
import axios from 'axios'
import { get, set } from 'object-path'
import types from './types'
import { api, goApi, siteRoot } from '../config'

// These requests will all fail without a bearer token.
// They rely on the auth component setting a default Authorization header.
// Check app/assets/scripts/components/auth.js

// Note, For "detail" queries, ie a single report, we include
// a special header so the API returns the data as an object,
// and throws an error code if it's not found.
// Otherwise, it would return an empty array.
// http://postgrest.org/en/v5.2/api.html#singular-or-plural

export const getReports = asyncActionCreator(
  types.GET_REPORTS,
  () => axios.get(url.resolve(api, 'reports'))
)

export const getReportsWithQs = asyncActionCreator(
  types.GET_REPORTS, 'qs',
  ({ qs }) => axios.get(url.resolve(api, `reports${qs}`))
)

const requestReport = (id) => axios.get(url.resolve(api, `reports?id=eq.${id}`), {
  headers: { Accept: 'application/vnd.pgrst.object+json' }
})

const requestReportTags = (id) => axios.get(url.resolve(api, `reports?id=eq.${id}&select=id,tags(name)`), {
  headers: { Accept: 'application/vnd.pgrst.object+json' }
})

export const getReport = asyncActionCreator(
  types.GET_REPORT, 'id',
  ({ id }) => axios.all([requestReport(id), requestReportTags(id)])
    .then(axios.spread((report, tags) => {
      set(report, 'data.tags', get(tags, 'data.tags'), [])
      return Promise.resolve(report)
    }))
)

export const getReportVersions = asyncActionCreator(
  types.GET_REPORT_VERSIONS, 'docID',
  ({ docID }) => axios.get(url.resolve(api, `reports?doc_id=eq.${docID}&select=id,created_at,doc_id,name`))
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

// Note, we currently don't use the `lastReport` property;
// however it may be useful at some point to attach fork references.
export const postReport = asyncActionCreator(
  types.POST_REPORT, 'payload', 'lastReport', 'tags',
  ({ payload, tags }) => {
    let _payload = Object.assign({}, payload)
    delete _payload.author
    return axios.post(url.resolve(api, 'reports'), _payload, {
      headers: {
        Prefer: 'return=representation',
        Accept: 'application/vnd.pgrst.object+json'
      }
    }).then(postPayload => {
      if (!tags || !tags.length) {
        return Promise.resolve(postPayload)
      }
      const id = postPayload.data.id
      const _tags = tags.map(d => ({ report_id: id, tag_id: d }))
      return axios.post(url.resolve(api, 'reports_tags'), _tags)
        .then(() => Promise.resolve(postPayload))
        .catch(e => Promise.reject(e))
    })
  }
)

// TODO The report delete might not be necessary, confirming whether behavior is CASCADE
const deleteReportItem = (id) => axios.delete(url.resolve(api, `reports?id=eq.${id}`))
const deleteReportTags = (id) => axios.delete(url.resolve(api, `report_tags?report_id=eq.${id}`))

export const deleteReport = asyncActionCreator(
  types.DELETE_REPORT, 'id',
  ({ id }) => axios.all([deleteReportItem(id), deleteReportTags(id)])
    .then(axios.spread(() => Promise.resolve(true)))
)

export const getCountries = asyncActionCreator(
  types.GET_COUNTRIES,
  () => axios.get(url.resolve(goApi, 'country/?limit=300')) // there are about 279 total countries here
)

export const getEmergencies = asyncActionCreator(
  types.GET_EMERGENCIES, 'qs',
  (config) => axios.get(url.resolve(goApi, 'event/' + (config && `?${config.qs}`)))
)

export const getFeaturedEmergencies = asyncActionCreator(
  types.GET_FEATURED_EMERGENCIES,
  () => axios.get(url.resolve(siteRoot, 'static/featured-emergencies.json'))
)

export const getEmergency = asyncActionCreator(
  types.GET_EMERGENCY, 'emergencyID',
  ({ emergencyID }) => axios.get(url.resolve(goApi, `event/${emergencyID}`))
)

export const getStaticCountryAssets = asyncActionCreator(
  types.GET_STATIC_COUNTRY_ASSETS, 'countryID',
  ({ countryID }) => axios.get(url.resolve(siteRoot, `static/country/${countryID}.json`))
)

export const getStaticEmergencyAssets = asyncActionCreator(
  types.GET_STATIC_EMERGENCY_ASSETS, 'emergencyID',
  ({ emergencyID }) => axios.get(url.resolve(siteRoot, `static/emergency/${emergencyID}.json`))
)

export const getTags = asyncActionCreator(
  types.GET_TAGS,
  () => axios.get(url.resolve(api, 'tags'))
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
  setCredentials: actionCreator(types.SET_USER_CREDENTIALS, 'accessToken', 'idToken', 'expiresAt', 'email'),
  clearCredentials: actionCreator(types.CLEAR_USER_CREDENTIALS)
}

export const createReport = {
  sync: actionCreator(types.CREATE_REPORT_SYNC, 'value'),
  clear: actionCreator(types.CREATE_REPORT_CLEAR)
}
