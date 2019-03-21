import _disasterTypes from '../../static/disaster-types.json'
import _reportTypes from '../../static/report-types.json'

export const disasterTypes = _disasterTypes.map(d => ({ label: d.name, value: d.name.toLowerCase() }))
export const reportTypes = _reportTypes.map(d => ({ label: d.type, value: d.type.toLowerCase() }))
