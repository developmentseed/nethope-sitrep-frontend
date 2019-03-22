'use strict'
import { parse, stringify } from 'qs'

export function currentQueryAsObject (search) {
  if (!search.length) {
    return {}
  }
  return parse(search.slice(1, search.length))
}

export function syncLocation (history, location, formValue, formID) {
  const params = currentQueryAsObject(location.search)
  if ((!formValue && params.hasOwnProperty(formID)) ||
    (formValue && formValue !== params[formID])) {
    params[formID] = formValue
    !formValue && delete params[formID]
    history.push(`${location.pathname}?${stringify(params)}`)
  }
}
