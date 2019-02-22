'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { getForkPayloadFromReport } from '../utils/async'
import { postReport, clearUploadState } from '../actions'

import Modal from './modal'

class ForkReport extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showConfirm: false
    }

    this.toggleConfirm = () => {
      this.setState({ showConfirm: !this.state.showConfirm })
    }

    this.fork = () => {
      const payload = getForkPayloadFromReport(this.props.report)
      this.props.postReport({
        payload,
        lastReport: this.props.report.id
      })
    }
  }

  renderPrompt () {
    return (
      <React.Fragment>
        <p>This will create a copy of this report that you can edit</p>
        <button onClick={this.fork}>Fork it</button>
        <button onClick={this.toggleConfirm}>Cancel</button>
      </React.Fragment>
    )
  }

  render () {
    return (
      <div className='fork__ctrl'>
        <button className='report__ctrl report__ctrl__fork' onClick={this.toggleConfirm}>Fork this report</button>
        { this.state.showConfirm && <Modal cancel={this.toggleConfirm}>{this.renderPrompt()}</Modal> }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  report: state.reportMap[props.current]
})

const mapDispatch = { postReport, clearUploadState }

export default withRouter(connect(mapStateToProps, mapDispatch)(ForkReport))
