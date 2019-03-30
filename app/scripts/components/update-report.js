'use strict'
import React from 'react'
import { get } from 'object-path'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { readReport, postReport, patchReport, clearUploadState } from '../actions'
import { setReportRefs, getReportRefs } from '../utils/notebook'

import Notebook from './notebook'
import EditableText from './editable-text'
import SelectReport from './select-report'

const errors = {
  json: 'JSON parse error',
  invalid: 'Invalid or empty file'
}

class UpdateReport extends React.Component {
  constructor (props) {
    super(props)

    this.updateReportMetadata = (payload) => {
      this.props.patchReport({ id: this.props.report.id, payload })
    }

    this.updateReportRefs = ({ value }) => {
      setReportRefs(this.props.report, value)
      this.props.patchReport({ id: this.props.report.id, payload: { content: this.props.report.content } })
    }

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

  componentWillUnmount () {
    this.props.clearUploadState()
  }

  renderUploadNotebookUI () {
    return (
      <div className='report__upload'>
        <button className='report__ctrl report__ctrl__confirm'
          onClick={this.upload}>Upload this notebook</button>
        <div className='report__upload__next'>
          <Notebook data={this.props.nextReport} />
        </div>
      </div>
    )
  }

  render () {
    const { report } = this.props
    return (
      <React.Fragment>
        <div className='report__meta'>
          <h3 className='report__meta__title'>Edit report metadata</h3>
          <EditableText
            canEdit={true}
            className='report__name'
            formID={`${report.id}-name`}
            initialValue={report.name}
            label={'Name'}
            placeholder='Enter a report name'
            onSubmit={this.updateReportMetadata}
            schemaPropertyName='name'
          />
          <SelectReport
            formID={`${report.id}-reports`}
            initialValue={getReportRefs(report, true)}
            showSubmit={true}
            onModalClose={this.updateReportRefs}
            without={[report.id]}
          />
        </div>
        <div className='report__next'>
          <h3 className='report__meta__title'>Upload a new version of this report</h3>
          <form className='report__upload' onChange={this.onFileInputChange}>
            <input type='file'
              accept='application/json,.ipynb'
              multiple={false}
            />
          </form>
          {this.props.nextReport && this.renderUploadNotebookUI()}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  nextReport: state.uploadReport.nextReport
})

const mapDispatch = { ...readReport, postReport, patchReport, clearUploadState }

export default withRouter(connect(mapStateToProps, mapDispatch)(UpdateReport))
