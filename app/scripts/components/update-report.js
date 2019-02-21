'use strict'
import React from 'react'
import { get } from 'object-path'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { readReport, postReport, clearUploadState } from '../actions'

import Notebook from '../components/notebook'

const errors = {
  json: 'JSON parse error',
  invalid: 'Invalid or empty file'
}

class UpdateReport extends React.Component {
  constructor (props) {
    super(props)

    this.onFileInputChange = (e) => {
      this.props.readReportStart()
      const reader = new FileReader()
      reader.onloadend = this.validateReport
      reader.readAsText(e.target.files[0])
    }

    this.validateReport = (e) => {
      // Validate JSON-ness
      try {
        var content = JSON.parse(e.target.result)
      } catch (e) {
        return this.props.readReportFail({ error: new Error(errors.json) })
      }

      // Cells should be array with length >= 1
      if (!Array.isArray(get(content, 'cells')) ||
        !content.cells.length) {
        return this.props.readReportFail({ error: new Error(errors.invalid) })
      }

      const report = Object.assign({}, this.props.report, { content })
      delete report['id']
      delete report['created_at']
      this.props.readReportSuccess({ report })
    }

    this.upload = () => {
      this.props.postReport({
        payload: this.props.nextReport,
        lastReport: this.props.report.id
      })
    }
  }

  componentDidUpdate (prevProps) {
    const { nextReportID } = this.props
    // Report upload success: clear upload state and render the new report.
    if (nextReportID && !prevProps.nextReportID) {
      setTimeout(() => {
        this.props.clearUploadState()
        this.props.history.push(`/reports/${nextReportID}`)
      }, 800)
    }
  }

  renderSuccess () {
    return (
      <div className='success'>
        <p>Upload successful! Loading new report...</p>
      </div>
    )
  }

  renderUploadNotebookUI () {
    return (
      <div className='report__upload'>
        <button onClick={this.upload}>Upload this notebook</button>
        {this.props.nextReportID && this.renderSuccess() }
        <div className='report__upload__next'>
          <Notebook data={this.props.nextReport} />
        </div>
      </div>
    )
  }

  render () {
    return (
      <React.Fragment>
        <div className='report__ctrls'>
          <form className='report__upload' onChange={this.onFileInputChange}>
            <input type='file'
              accept='application/json,.ipynb'
              multiple={false}
            />
          </form>
        </div>
        {this.props.nextReport && this.renderUploadNotebookUI()}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  nextReport: state.uploadReport.nextReport,
  nextReportID: state.uploadReport.nextReportID
})

const mapDispatch = { ...readReport, postReport, clearUploadState }

export default withRouter(connect(mapStateToProps, mapDispatch)(UpdateReport))
