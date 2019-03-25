'use strict'
import React from 'react'
import { connect } from 'react-redux'
import _without from 'lodash.without'

import { forms, getReports } from '../actions'

import Select from './select'
import AsyncStatus from './async-status'
import Report from './report'

class SelectReport extends React.Component {
  constructor (props) {
    super(props)
    this.selectReport = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const value = e.currentTarget.getAttribute('data-value')
      const current = this.props.reportField
      let next = current ? current.split(', ') : []
      if (current.indexOf(value) >= 0) {
        next = _without(next, value)
      } else {
        next.push(value)
      }
      this.props.update({ formID: this.props.formID, value: next.join(', ') })
    }

    this.clearChosenReports = (e) => {
      e.preventDefault()
      this.props.update({ formID: this.props.formID, value: '' })
    }
  }

  componentDidMount () {
    if (!this.props.reports.length) {
      this.props.getReports()
    }
  }

  renderReportSelect () {
    const { reports, reportField } = this.props
    if (!reports.length) return <AsyncStatus />
    const selectedReports = reportField ? reportField.split(', ') : []
    return (
      <div className='modal__select modal__select--report'>
        {reports.map(report => <Report
          isSelect={true}
          isSelected={selectedReports.indexOf(report.id) >= 0}
          onSelect={this.selectReport}
          key={report.id}
          report={report}
          hideImage={true}
        />)}
      </div>
    )
  }

  renderPrompt () {
    return <React.Fragment>
      Choose a report {this.props.reportField && <a className='modal__clear' href='#' onClick={this.clearChosenReports}><span className='collecticons collecticons-circle-xmark' />Clear chosen reports</a>}
    </React.Fragment>
  }

  render () {
    return (
      <Select formID={this.props.formID}
        label='Attached report(s)'
        placeholder='Select one or more reports to reference...'
        prompt={this.renderPrompt()}>
        {this.renderReportSelect()}
      </Select>
    )
  }
}

const mapStateToProps = (state, props) => ({
  reports: state.reports,
  reportField: state.forms[props.formID]
})

const mapDispatch = {
  ...forms,
  getReports
}

export default connect(mapStateToProps, mapDispatch)(SelectReport)
