'use strict'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import { getStaticApi, getEmergencies } from '../actions'

import EmergencyList from '../components/emergency-list'
import AsyncStatus from '../components/async-status'

class Home extends React.Component {
  componentDidMount () {
    this.props.getStaticApi({ resource: 'featured-emergencies.json' })
  }

  componentDidUpdate () {
    if (!this.props.emergencies) {
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
            <h3 className='section__title'><Link to='/reports'>Reports</Link></h3>
            <h3 className='section__title'><Link to='/emergencies'>Emergencies</Link></h3>
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
  const qs = stringify({
    id__in: featured.join(',')
  })

  const emergencies = state.emergencies[qs]
  return {
    featured,
    qs,
    emergencies
  }
}
const mapDispatch = { getStaticApi, getEmergencies }
export default connect(mapStateToProps, mapDispatch)(Home)
