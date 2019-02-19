'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getReport, patchReport } from '../actions'

import AsyncStatus from '../components/async-status'
import EditableText from '../components/editable-text'
import Notebook from '../components/notebook'

class ReportDetail extends React.Component {
  constructor (props) {
    super(props)
    this.updateReportMetadata = (payload) => {
      this.props.patchReport({ id: this.id(), payload })
    }
  }
  componentDidMount () {
    if (!this.props.report) {
      this.props.getReport({ id: this.id() })
    }
  }

  id (...args) {
    const id = this.props.match.params.reportId
    if (!args.length) {
      return id
    }
    return [id].concat(args).join('-')
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
        { !canEdit && <Link to={`/reports/${this.id()}/update`}>Update this notebook</Link> }
        <Notebook data={report} />
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