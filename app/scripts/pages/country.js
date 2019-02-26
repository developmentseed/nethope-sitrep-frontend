'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import { getEmergencies } from '../actions'

import AsyncStatus from '../components/async-status'
import EmergencyList from '../components/emergency-list'

class Country extends React.Component {
  componentDidMount () {
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
  }

  componentDidUpdate (prevProps) {
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
  }

  render () {
    const { country, emergencies } = this.props
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
            { emergencies && <EmergencyList data={emergencies.data} /> }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { countryID } = props.match.params

  // Country meta (ie name, iso, etc).
  const country = state.countries[countryID]

  // Query string to resolve this country from the GO api.
  // Also the storage key for queried emergencies in this country.
  const qs = stringify({ countries__in: countryID })
  const emergencies = state.emergencies[qs]
  return {
    country,
    qs,
    emergencies
  }
}

const mapDispatch = { getEmergencies }

export default connect(mapStateToProps, mapDispatch)(Country)
