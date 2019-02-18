'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { getReport } from '../actions'

import AsyncStatus from '../components/async-status'

class ReportDetail extends React.Component {
  componentDidMount () {
    if (!this.props.report) {
      this.props.getReport({ id: this.props.match.params.reportId })
    }
  }

  render () {
    const { report } = this.props
    if (!report) return null
    return (
      <div className='report__dl'>
        <AsyncStatus />
        <h3 className='report__title'>{report.name}</h3>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { reports, reportMap } = state
  const { reportId } = props.match.params
  // Check reports list and the report map
  // to see if we already fetched this.
  const report = reportMap[reportId] || reports.find(d => d.id === reportId)
  return { report }
}

const mapDispatch = {
  getReport
}

export default connect(mapStateToProps, mapDispatch)(ReportDetail)
