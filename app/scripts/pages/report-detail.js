'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import fileDownload from 'js-file-download'
import slugify from 'slugify'

import { getReport, clearUploadState } from '../actions'

import AsyncStatus from '../components/async-status'
import Notebook from '../components/notebook'
import UpdateReport from '../components/update-report'
import ForkReport from '../components/fork-report'
import Versions from '../components/versions'

class ReportDetail extends React.Component {
  constructor (props) {
    super(props)

    this.download = () => {
      fileDownload(
        JSON.stringify(this.props.report.content, null, 2),
        `${slugify(this.props.report.name)}.ipynb`,
        'application/json'
      )
    }
  }

  componentDidMount () {
    if (!this.props.report) {
      this.props.getReport({ id: this.id() })
    }
  }

  componentDidUpdate (prevProps) {
    // Router navigated to new report.
    const id = this.id()
    if (id !== prevProps.match.params.reportID && !this.props.report) {
      this.props.getReport({ id })
    }

    // Report upload success: clear upload state and render the new report.
    const { nextReportID } = this.props
    if (nextReportID && !prevProps.nextReportID) {
      setTimeout(() => {
        this.props.clearUploadState()
        this.props.history.push(`/reports/${nextReportID}`)
      }, 800)
    }
  }

  id (...args) {
    const id = this.props.match.params.reportID
    if (!args.length) {
      return id
    }
    return [id].concat(args).join('-')
  }

  renderReport () {
    const { report } = this.props
    return (
      <React.Fragment>
        <div className='report__ctrls'>
          <button className='report__ctrl report__ctrl__dl' onClick={this.download}>
            <span className='collecticons collecticons-download' /> Download report
          </button>
          <Link className='report__ctrl report__ctrl__up' to={`/reports/${this.id()}/update`}>
            <span className='collecticons collecticons-wrench' />Update this report
          </Link>
          <ForkReport current={report.id} />
        </div>
        <Versions docID={report['doc_id']} current={report.id} />
        <Notebook data={report} />
      </React.Fragment>
    )
  }

  renderUploadSuccess () {
    return (
      <div className='success'>
        <p>Upload successful! Loading new report...</p>
      </div>
    )
  }

  render () {
    const { report, match } = this.props
    if (!report) return null
    const canEdit = /update/.test(match.path)
    return (
      <div className='page page__report'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>{report.name}</h2>
          </div>
        </div>
        <div className='section'>
          <div className='inner'>
            <AsyncStatus />
            {this.props.nextReportID && this.renderUploadSuccess() }
            { canEdit ? <UpdateReport report={report} /> : this.renderReport() }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { reports, reportMap } = state
  const reportID = props.match.params.reportID
  // Check reports list and the report map
  // to see if we already fetched this.
  const report = reportMap[reportID] || reports.find(d => d.id === reportID)
  return {
    report,
    nextReportID: state.uploadReport.nextReportID
  }
}

const mapDispatch = { getReport, clearUploadState }

export default connect(mapStateToProps, mapDispatch)(ReportDetail)
