'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { clearUploadState } from '../actions'

class UploadReportSuccess extends React.Component {
  componentDidUpdate (prevProps) {
    // Report upload success: clear upload state and render the new report.
    const { nextReportID } = this.props
    if (nextReportID && !prevProps.nextReportID) {
      setTimeout(() => {
        this.props.clearUploadState()
        this.props.history.push(`/reports/${nextReportID}`)
      }, 800)
    }
  }

  render () {
    if (!this.props.nextReportID) return null
    return (
      <div className='success'>
        <p>Upload successful! Loading new report...</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  nextReportID: state.uploadReport.nextReportID
})

const mapDispatch = { clearUploadState }

export default withRouter(connect(mapStateToProps, mapDispatch)(UploadReportSuccess))
