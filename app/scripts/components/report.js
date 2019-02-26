'use strict'
import React from 'react'
import { Link } from 'react-router-dom'
import { ago } from 'time-ago'

import { getFirstImageOutput } from '../utils/notebook'

export default function Report ({ report }) {
  const verb = report['forked_from'] ? 'forked' : 'created'
  const image = getFirstImageOutput(report)
  const dataUri = image && 'data:' + image.mime + ';base64,' + image.dataUri
  return (
    <div className='report'>
      <Link className='report__inner' to={`/reports/${report.id}`}>
        <h3 className='report__title'>{report.name}</h3>
        {image && (
          <div className='report__image'>
            <img src={dataUri} />
          </div>
        )}
        <p className='report__meta'>Author {verb} {ago(report['created_at'])}</p>
      </Link>
    </div>
  )
}
