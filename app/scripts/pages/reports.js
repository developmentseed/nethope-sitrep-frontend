'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { getReports } from '../actions'

import Report from '../components/report'
import AsyncStatus from '../components/async-status'

class Reports extends React.Component {
  componentDidMount () {
    this.props.getReports()
  }

  render () {
    const { reports } = this.props
    return (
      <div className='reports'>
        <AsyncStatus />
        {reports.map(report => <Report key={report.id} report={report} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  reports: state.reports
})

const mapDispatch = {
  getReports
}

export default connect(mapStateToProps, mapDispatch)(Reports)
