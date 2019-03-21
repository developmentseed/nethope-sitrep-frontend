'use strict'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ago } from 'time-ago'
import c from 'classnames'

import { cap, reportTitle } from '../utils/format'
import { getReportLeadImage, getAuthorFromEmail } from '../utils/notebook'

function renderCountryDetails (country) {
  if (!country) return null
  return [
    <dt key='dt'>Country:</dt>,
    <dd key='dd'><Link to={`/emergencies/country/${country.id}`}>{country.name}</Link></dd>
  ]
}

function renderDisasterTypeDetails (report) {
  if (!report['disaster_type']) return null
  return [
    <dt key='dt'>Disaster Type:</dt>,
    <dd key='dd'>{report['disaster_type']}</dd>
  ]
}

function Report ({ report, country }) {
  const verb = report['forked_from'] ? 'forked' : 'created'
  const image = getReportLeadImage(report)
  const dataUri = image && (image.dataUri ? 'data:' + image.mime + ';base64,' + image.dataUri : image.imageUri)
  return (
    <div className={c('reportcard', { 'reportcard__wide': !!image })}>
      <Link className='reportcard__primary' to={`/reports/${report.id}`}>
        {image && (
          <div className='reportcard__image'>
            <img src={dataUri} />
          </div>
        )}
        <h3 className='reportcard__title'>{reportTitle(report)}</h3>
      </Link>
      <div className='reportcard__details'>
        <p><span className='reportcard__author'>{cap(getAuthorFromEmail(report.author))}</span> {verb} {ago(report['created_at'])}</p>

        <dl className='dl reportcard__dl'>
          {renderCountryDetails(country)}
          {renderDisasterTypeDetails(report)}
        </dl>

      </div>
    </div>
  )
}

const mapStateToProps = (state, { report }) => {
  return {
    country: (report && report.country) ? state.countries[report.country] : undefined
  }
}
export default connect(mapStateToProps)(Report)
