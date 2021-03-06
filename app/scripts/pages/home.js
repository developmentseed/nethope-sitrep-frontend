'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import { getFeaturedEmergencies, getEmergencies } from '../actions'

import EmergencyList from '../components/emergency-list'
import AsyncStatus from '../components/async-status'

class Home extends React.Component {
  componentDidMount () {
    if (!this.props.featured.length) {
      this.props.getFeaturedEmergencies()
    }
    if (this.props.qs && !this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
  }

  componentDidUpdate () {
    if (this.props.qs && !this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
  }

  render () {
    const { emergencies } = this.props
    return (
      <div className='page page__home'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Situation Reporting Platform Beta</h2>
          </div>
        </div>
        <div className='section'>
          <div className='inner'>
            <AsyncStatus />
            { emergencies && <EmergencyList data={emergencies.data} title='Active Emergencies' showCountry={true} /> }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { featured } = state
  const qs = featured.length ? stringify({
    id__in: featured.join(','),
    limit: 100
  }) : null

  let emergencies = state.emergencies[qs]
  if (emergencies && Array.isArray(emergencies.data)) {
    emergencies.data = emergencies.data.filter(d => featured.indexOf(d.id) >= 0)
  }

  return {
    featured,
    qs,
    emergencies
  }
}
const mapDispatch = { getFeaturedEmergencies, getEmergencies }
export default connect(mapStateToProps, mapDispatch)(Home)
