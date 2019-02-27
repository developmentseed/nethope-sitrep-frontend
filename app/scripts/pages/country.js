'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import { getReports, getEmergencies } from '../actions'

import AsyncStatus from '../components/async-status'
import Report from '../components/report'
import EmergencyList from '../components/emergency-list'

class Country extends React.Component {
  componentDidMount () {
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
    this.props.getReports()
  }

  componentDidUpdate (prevProps) {
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
  }

  render () {
    const { country, emergencies, reports } = this.props
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
            <div className='reports__cont'>
              {reports.map(report => <Report key={report.id} report={report} />)}
            </div>
          </div>
        </div>
        <div className='section'>
          <div className='inner'>
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

  // Reports matching this emergency
  const reports = state.reports.filter(d => d.country.toString() === countryID)

  return {
    country,
    qs,
    emergencies,
    reports
  }
}

const mapDispatch = { getReports, getEmergencies }

export default connect(mapStateToProps, mapDispatch)(Country)
