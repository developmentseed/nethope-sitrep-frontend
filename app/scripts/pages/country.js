'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import { recent } from '../utils/timespans'
import { getReports, getEmergencies, getStaticCountryAssets } from '../actions'

import AsyncStatus from '../components/async-status'
import Report from '../components/report'
import EmergencyList from '../components/emergency-list'

class Country extends React.Component {
  componentDidMount () {
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
    this.props.getReports()
    this.props.getStaticCountryAssets({ countryID: this.props.countryID })
  }

  componentDidUpdate (prevProps) {
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
      this.props.getStaticCountryAssets({ countryID: this.props.countryID })
    }
  }

  renderMetadataItem (d, i) {
    const source = d.source && d.link ? <a href={d.link} target='_blank'>{d.source}</a> : d.source
    return (
      <React.Fragment key={i}>
        <dt>{d.label}:</dt>
        <dd>{d.value} {!!source && <span className='dd__source'>{source}</span>}</dd>
      </React.Fragment>
    )
  }

  renderCountryMetadata () {
    const { metadata } = this.props.country
    return (
      <section className='section'>
        <div className='inner'>
          <dl className='reportcard__dl'>
            {metadata.map(this.renderMetadataItem)}
          </dl>
        </div>
      </section>
    )
  }

  render () {
    const { country, emergencies, reports } = this.props
    return (
      <div className='page page__country'>
        { country && (
          <div className='page__header'>
            <div className='inner'>
              <h2 className='page__title'>{country.name}</h2>
            </div>
          </div>
        ) }
        { !!(country && Array.isArray(country.metadata)) && this.renderCountryMetadata() }
        <section className='section'>
          <div className='inner'>
            <AsyncStatus />
            <div className='reports__cont'>
              {reports.map(report => <Report key={report.id} report={report} />)}
            </div>
          </div>
        </section>
        <section className='section'>
          <div className='inner'>
            { emergencies && <EmergencyList data={emergencies.data} title='Recent Emergencies (last 30 days)' /> }
          </div>
        </section>
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
  const qs = stringify({
    disaster_start_date__gt: recent,
    ordering: '-disaster_start_date',
    countries__in: countryID,
    limit: 100
  })
  const emergencies = state.emergencies[qs]

  // Reports matching this emergency
  const reports = state.reports.filter(d => d.country.toString() === countryID)

  return {
    country,
    qs,
    emergencies,
    reports,
    countryID
  }
}

const mapDispatch = { getReports, getEmergencies, getStaticCountryAssets }

export default connect(mapStateToProps, mapDispatch)(Country)
