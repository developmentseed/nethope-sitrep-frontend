'use strict'
import React from 'react'
import { connect } from 'react-redux'

import AsyncStatus from '../components/async-status'

function Country ({ country }) {
  return (
    <div className='page page__home'>
      { country && (
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>{country.name}</h2>
          </div>
        </div>
      ) }
      <div className='section'>
        <div className='inner'>
          <AsyncStatus />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, props) => {
  const { countryID } = props.match.params
  const country = state.countries[countryID]
  return {
    country
  }
}

export default connect(mapStateToProps)(Country)
