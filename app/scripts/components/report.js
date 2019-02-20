'use strict'
import React from 'react'
import { Link } from 'react-router-dom'
import { ago } from 'time-ago'

export default function Report ({ report }) {
  const verb = report['forked_from'] ? 'forked' : 'created'
  return (
    <div className='report'>
      <h3 className='report__title'><Link to={`/reports/${report.id}`}>{report.name}</Link></h3>
      <p className='report__meta'>Author {verb} {ago(report['created_at'])}</p>
    </div>
  )
}
