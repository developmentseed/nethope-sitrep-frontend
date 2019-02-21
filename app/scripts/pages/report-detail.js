'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import fileDownload from 'js-file-download'
import slugify from 'slugify'

import { getReport, patchReport } from '../actions'

import AsyncStatus from '../components/async-status'
import EditableText from '../components/editable-text'
import Notebook from '../components/notebook'
import UpdateReport from '../components/update-report'

class ReportDetail extends React.Component {
  constructor (props) {
    super(props)

    this.updateReportMetadata = (payload) => {
      this.props.patchReport({ id: this.id(), payload })
    }

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
    const id = this.id()
    if (id !== prevProps.match.params.reportId && !this.props.report) {
      this.props.getReport({ id })
    }
  }

  id (...args) {
    const id = this.props.match.params.reportId
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
          <button className='report__ctrl report__ctrl__dl' onClick={this.download}>Download report</button>
          <Link className='report__ctrl report__ctrl__up' to={`/reports/${this.id()}/update`}>Update this report</Link>
        </div>
        <Notebook data={report} />
      </React.Fragment>
    )
  }

  render () {
    const { report, match } = this.props
    if (!report) return null
    const canEdit = /update/.test(match.path)
    return (
      <div className='report__dl'>
        <AsyncStatus />
        <EditableText
          className='report__name'
          initialValue={report.name}
          schemaPropertyName='name'
          formId={this.id('name')}
          canEdit={canEdit}
          placeholder='Enter a report name'
          onSubmit={this.updateReportMetadata}
        />
        { canEdit ? <UpdateReport report={report} /> : this.renderReport() }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { reports, reportMap } = state
  const reportId = props.match.params.reportId
  // Check reports list and the report map
  // to see if we already fetched this.
  const report = reportMap[reportId] || reports.find(d => d.id === reportId)
  return { report }
}

const mapDispatch = {
  getReport,
  patchReport
}

export default connect(mapStateToProps, mapDispatch)(ReportDetail)
