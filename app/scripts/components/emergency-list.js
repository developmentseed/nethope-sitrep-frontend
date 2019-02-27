'use strict'
import React from 'react'
import { get } from 'object-path'
import { ago } from 'time-ago'

const nope = '--'
function EmergencyList ({ data }) {
  return (
    <div className='em__list'>
      <h3 className='section__title'>Emergencies</h3>
      <table className='table'>
        <thead className='table__head'>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Num. Impacted</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody className='table__body'>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{get(d, 'dtype.name', nope)}</td>
              <td>{get(d, 'num_affected')}</td>
              <td>{ago(d['created_at'])}</td>
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  )
}

export default EmergencyList
