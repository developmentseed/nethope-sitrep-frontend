'use strict'
import React from 'react'
import { ago } from 'time-ago'

export default function Report ({ report }) {
  const { created_at, forked_from } = report
  const verb = forked_from ? 'forked' : 'created'
  return (
    <div className='report'>
      <h3 className='report__title'>{report.name}</h3>
      <p className='report__meta'>Author {verb} {ago(created_at)}</p>
    </div>
  )
}
