'use strict'
import React from 'react'
import { get } from 'object-path'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import { readReport, postReport, patchReport } from '../actions'

import Notebook from '../components/notebook'
import EditableText from '../components/editable-text'

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
      <div>
        <div className='report__ctrls'>
          <Link className='report__ctrl report__ctrl--small' to={`/reports/${report.id}`}>
            <span className='collecticons collecticons-arrow-return' />
            Go back
          </Link>
        </div>
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
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  nextReport: state.uploadReport.nextReport
})

const mapDispatch = { ...readReport, postReport, patchReport }

export default withRouter(connect(mapStateToProps, mapDispatch)(UpdateReport))
