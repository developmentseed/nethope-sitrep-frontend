'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import { recent } from '../utils/timespans'
import { getReports, getEmergencies } from '../actions'

import AsyncStatus from '../components/async-status'
import Map from '../components/map'
import EmergencyList from '../components/emergency-list'

class Emergencies extends React.Component {
  componentDidMount () {
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
    this.props.getReports()
  }

  componentDidUpdate () {
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
  }

  render () {
    const { emergencies } = this.props
    return (
      <div className='page page__ees'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Emergencies</h2>
          </div>
        </div>
        <Map />
        <div className='section'>
          <div className='inner'>
            <AsyncStatus />
            { emergencies && <EmergencyList data={emergencies.data} title='Recent Emergencies (last 30 days)' showCountry={true} /> }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const qs = stringify({
    disaster_start_date__gt: recent,
    ordering: '-disaster_start_date',
    limit: 100
  })
  const emergencies = state.emergencies[qs]

  return {
    qs,
    emergencies
  }
}

const mapDispatch = { getReports, getEmergencies }

export default connect(mapStateToProps, mapDispatch)(Emergencies)
