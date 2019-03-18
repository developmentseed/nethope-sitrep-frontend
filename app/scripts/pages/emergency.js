'use strict'
import React from 'react'
import url from 'url'
import { connect } from 'react-redux'
import { getEmergency, getStaticEmergencyAssets } from '../actions'
import { goRoot } from '../config'
import { n } from '../utils/format'

import Metadata from '../components/metadata'

function getReportStats (emergency = {}) {
  const reports = emergency['field_reports']
  if (!Array.isArray(reports) || !reports.length) {
    return null
  }
  if (reports.length === 1) {
    return reports[0]
  }
  return reports.sort((a, b) => new Date(a['report_date'] > b['report_date'] ? -1 : 1))[0]
}

function extractMetadataFromStats (stats, emergencyID) {
  const metadata = {}
  const link = url.resolve(goRoot, `emergencies/${emergencyID}`)
  const config = [
    ['Number Affected', 'num_affected'],
    ['Number Missing', 'num_missing'],
    ['Number Injured', 'num_injured'],
    ['Number Displaced', 'num_displaced'],
    ['Number Dead', 'num_dead']
  ]
  config.forEach(d => {
    let label = d[0]
    let value = d[1]
    if (stats[value] || stats[value] === 0) {
      metadata[label] = {
        label,
        link,
        value: n(stats[value]),
        source: 'IFRC GO'
      }
    }
  })
  return metadata
}

class Emergency extends React.Component {
  componentDidMount () {
    this.props.getEmergency({ emergencyID: this.props.emergencyID })
    this.props.getStaticEmergencyAssets({ emergencyID: this.props.emergencyID })
  }

  componentDidUpdate (prevProps) {
    if (this.props.emergencyID !== prevProps.emergencyID) {
      this.props.getEmergency({ emergencyID: this.props.emergencyID })
      this.props.getStaticEmergencyAssets({ emergencyID: this.props.emergencyID })
    }
  }

  renderEmergencyMetadata () {
    const { emergency, stats } = this.props
    let metadata = stats ? extractMetadataFromStats(stats, emergency.id) : {}
    if (Array.isArray(emergency.metadata)) {
      Object.keys(emergency.metadata).forEach(key => {
        metadata[key] = emergency.metadata[key]
      })
    }
    return (
      <section className='section'>
        <div className='inner'>
          <Metadata data={Object.values(metadata)} />
        </div>
      </section>
    )
  }

  render () {
    const { emergency } = this.props
    return (
      <React.Fragment>
        { !!(emergency && emergency.name) && (
          <div className='page__header'>
            <div className='inner'>
              <h2 className='page__title'>{emergency.name}</h2>
            </div>
          </div>
        ) }
        { !!emergency && this.renderEmergencyMetadata() }
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { emergencyID } = props.match.params
  const emergency = state.emergencyMap[emergencyID]
  const stats = getReportStats(emergency)
  return {
    emergencyID,
    emergency,
    stats
  }
}

const mapDispatch = { getEmergency, getStaticEmergencyAssets }

export default connect(mapStateToProps, mapDispatch)(Emergency)
