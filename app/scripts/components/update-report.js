'use strict'
import React from 'react'
import { get } from 'object-path'
import { connect } from 'react-redux'

import { readReport } from '../actions'

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
      this.props.readReportSuccess({ report })
    }

    this.upload = (report) => {
    }
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
        {this.props.nextReport && <Notebook data={this.props.nextReport} />}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  nextReport: state.uploadReport.report
})

const mapDispatch = { ...readReport }

export default connect(mapStateToProps, mapDispatch)(UpdateReport)
