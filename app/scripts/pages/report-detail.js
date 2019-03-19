'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import fileDownload from 'js-file-download'
import slugify from 'slugify'
import { get } from 'object-path'

import { getReport } from '../actions'

import AsyncStatus from '../components/async-status'
import Notebook from '../components/notebook'
import UpdateReport from '../components/update-report'
import ForkReport from '../components/fork-report'
import Versions from '../components/versions'
import UploadReportSuccess from '../components/upload-report-success'

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
  }

  id (...args) {
    const id = this.props.match.params.reportID
    if (!args.length) {
      return id
    }
    return [id].concat(args).join('-')
  }

  renderUpdateReport () {
    const { report, isReportOwner } = this.props
    return (
      <React.Fragment>
        <div className='report__ctrls'>
          <Link className='report__ctrl report__ctrl--small' to={`/reports/${this.id()}`}>
            <span className='collecticons collecticons-arrow-return' />
            Go back
          </Link>
        </div>

        { isReportOwner ? <UpdateReport report={report} /> : (
          <div className='report__meta'>
            <p className='status error'><span className='error__icon collecticons-circle-exclamation' /> Oops, you can only edit reports you own. Fork this report so you can edit it.</p>
          </div>
        ) }
      </React.Fragment>
    )
  }

  renderReport () {
    const { report, isReportOwner } = this.props
    return (
      <React.Fragment>
        <div className='report__ctrls'>
          <button className='report__ctrl report__ctrl__dl' onClick={this.download}>
            <span className='collecticons collecticons-download' /> Download report
          </button>
          { isReportOwner ? (
            <Link className='report__ctrl report__ctrl__up' to={`/reports/${this.id()}/update`}>
              <span className='collecticons collecticons-wrench' />Update this report
            </Link>
          ) : <ForkReport current={report.id} /> }
        </div>
        <Versions docID={report['doc_id']} current={report.id} />
        <Notebook data={report} />
      </React.Fragment>
    )
  }

  render () {
    const { report, match } = this.props
    if (!report) return null
    const showUpdateUI = /update/.test(match.path)
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
            <UploadReportSuccess />
            { showUpdateUI ? this.renderUpdateReport() : this.renderReport() }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { reports, reportMap } = state
  const { reportID } = props.match.params
  // Check reports list and the report map
  // to see if we already fetched this.
  const report = reportMap[reportID] || reports.find(d => d.id === reportID)
  const author = get(report, 'author')
  return {
    report,
    isReportOwner: author && author === state.user.email
  }
}

const mapDispatch = { getReport }

export default connect(mapStateToProps, mapDispatch)(ReportDetail)
