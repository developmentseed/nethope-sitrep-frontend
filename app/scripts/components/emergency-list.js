'use strict'
import React from 'react'
import { Link } from 'react-router-dom'
import { get } from 'object-path'
import { ago } from 'time-ago'

function linkToGO (id) {
  return 'https://go.ifrc.org/emergencies/' + id
}

const nope = '--'
function EmergencyList ({ data, showCountry }) {
  return (
    <div className='em__list'>
      <h3 className='section__title'>Recent Emergencies (last 30 days)</h3>
      <table className='table'>
        <thead className='table__head'>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Num. Impacted</th>
            {showCountry && <th>Countries</th>}
            <th>Created</th>
          </tr>
        </thead>
        <tbody className='table__body'>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.name} <a href={linkToGO(d.id)} target='_blank' className='table__extlink'>
                <span className='collecticons collecticons-expand-top-right' /></a>
              </td>
              <td>{get(d, 'dtype.name', nope)}</td>
              <td>{get(d, 'num_affected')}</td>
              {showCountry && (
                <td>{(d.countries || []).map(c => <Link key={c.id} to={`/emergencies/country/${c.id}`}>{c.name}</Link>)}</td>
              )}
              <td>{ago(d['created_at'])}</td>
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  )
}

export default EmergencyList
