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

    this.onSubmit = () => {
      this.props.onSubmit && this.props.onSubmit({ value: this.getCurrentValue() })
    }

    this.onModalClose = () => {
      this.props.onModalClose && this.props.onModalClose({ value: this.getCurrentValue() })
    }
  }

  getCurrentValue () {
    return this.props.reportField ? this.props.reportField.split(', ') : []
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
      <React.Fragment>
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
        {this.props.showSubmit && <button className='modal__submit' onClick={this.onSubmit}>Submit</button>}
      </React.Fragment>
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
        initialValue={this.props.initialValue || ''}
        onModalClose={this.onModalClose}
        prompt={this.renderPrompt()}>
        {this.renderReportSelect()}
      </Select>
    )
  }
}

const mapStateToProps = (state, props) => ({
  reports: Array.isArray(props.without) ? state.reports.filter(d => props.without.indexOf(d.id) < 0) : state.reports,
  reportField: state.forms[props.formID]
})

const mapDispatch = {
  ...forms,
  getReports
}

export default connect(mapStateToProps, mapDispatch)(SelectReport)
