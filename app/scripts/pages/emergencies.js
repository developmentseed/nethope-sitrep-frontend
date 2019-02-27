'use strict'
import React from 'react'

import Map from '../components/map'

class Emergencies extends React.Component {
  render () {
    return (
      <div className='page page__ees'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Active Emergencies</h2>
          </div>
        </div>
        <Map />
      </div>
    )
  }
}

export default Emergencies
