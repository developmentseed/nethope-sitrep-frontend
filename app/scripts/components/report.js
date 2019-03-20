'use strict'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ago } from 'time-ago'

import { getReportLeadImage, getAuthorFromEmail } from '../utils/notebook'

function Report ({ report, country }) {
  const verb = report['forked_from'] ? 'forked' : 'created'
  const image = getReportLeadImage(report)
  const dataUri = image && (image.dataUri ? 'data:' + image.mime + ';base64,' + image.dataUri : image.imageUri)
  return (
    <div className='reportcard'>
      <Link className='reportcard__primary' to={`/reports/${report.id}`}>
        {image && (
          <div className='reportcard__image'>
            <img src={dataUri} />
          </div>
        )}
        <h3 className='reportcard__title'>{report.name}</h3>
      </Link>
      <div className='reportcard__details'>
        <p><span className='reportcard__author'>{getAuthorFromEmail(report.author)}</span> {verb} {ago(report['created_at'])}</p>
        { country && (
          <dl className='dl reportcard__dl'>
            <dt>Country:</dt>
            <dd><Link to={`/emergencies/country/${country.id}`}>{country.name}</Link></dd>
          </dl>
        ) }
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
