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
      <div className='page page__reports'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Recent Reports</h2>
          </div>
        </div>
        <div className='section'>
          <div className='inner'>
            <AsyncStatus />
            <div className='reports__cont'>
              {reports.map(report => <Report key={report.id} report={report} />)}
            </div>
          </div>
        </div>
        <div id='bg-test' />
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
