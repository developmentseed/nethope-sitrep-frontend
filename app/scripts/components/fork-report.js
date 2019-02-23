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
        <div className='modal__inner'>
          <p className='modal__prompt'>This will create a copy of this report that you can edit</p>
          <button className='modal__ctrl modal__ctrl--confirm' onClick={this.fork}>Confirm</button>
          <button className='modal__ctrl' onClick={this.toggleConfirm}>Cancel</button>
        </div>
      </React.Fragment>
    )
  }

  render () {
    return (
      <React.Fragment>
        <button className='report__ctrl report__ctrl__fork' onClick={this.toggleConfirm}>
          <span className='collecticons collecticons-git-fork' /> Fork this report
        </button>
        { this.state.showConfirm && <Modal transparent={true} cancel={this.toggleConfirm}>{this.renderPrompt()}</Modal> }
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, props) => ({
  report: state.reportMap[props.current]
})

const mapDispatch = { postReport, clearUploadState }

export default withRouter(connect(mapStateToProps, mapDispatch)(ForkReport))
