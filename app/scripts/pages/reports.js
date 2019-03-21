'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { parse, stringify } from 'qs'

import { getReportsWithQs } from '../actions'
import { disasterTypes, reportTypes } from '../utils/static-types'

import Report from '../components/report'
import AsyncStatus from '../components/async-status'

const dTypes = disasterTypes.map(d => d.value)
const rTypes = reportTypes.map(d => d.value)

const DTYPE = 'disaster_type'
const RTYPE = 'report_type'

class Reports extends React.Component {
  componentDidMount () {
    this.props.getReportsWithQs({ qs: this.queryString() })
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.props.getReportsWithQs({ qs: this.queryString() })
    }
  }

  queryString () {
    if (!this.props.location.search.length) {
      return ''
    }

    const s = parse(this.props.location.search.slice(1, this.props.location.search.length))
    let qs = {}

    if (s.hasOwnProperty(DTYPE) &&
        dTypes.indexOf(s[DTYPE].toLowerCase()) >= 0) {
      qs[DTYPE] = `like.${s[DTYPE]}`
    }

    if (s.hasOwnProperty(RTYPE) &&
        rTypes.indexOf(s[RTYPE].toLowerCase()) >= 0) {
      qs[RTYPE] = `like.${s[RTYPE]}`
    }

    return '?' + stringify(qs)
  }

  render () {
    const { reports } = this.props
    return (
      <div className='page page__reports'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Recent Reports</h2>
          </div>
        </div>
        <div className='section'>
          <div className='inner'>
            <AsyncStatus />
            <div className='report__ctrls'>
              <h4>Filter reports</h4>
            </div>
            <div className='reports__cont'>
              {reports.map(report => <Report key={report.id} report={report} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    reports: state.reports
  }
}

const mapDispatch = {
  getReportsWithQs
}

export default connect(mapStateToProps, mapDispatch)(Reports)
