'use strict'
import React from 'react'
import { get } from 'object-path'

import Notebook from '../components/notebook'
import Error from '../components/error'

const errors = {
  json: 'JSON parse error',
  invalid: 'Invalid or empty file'
}

class UpdateReport extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      payload: null
    }

    this.upload = (report) => {
    }

    this.validateReport = (e) => {
      // Validate JSON-ness
      try {
        var report = JSON.parse(e.target.result)
      } catch (e) {
        return this.setState({ error: errors.json })
      }

      // Cells should be array with length >= 1
      if (!Array.isArray(get(report, 'cells')) ||
        !report.cells.length) {
        return this.setState({ error: errors.invalid })
      }

      this.setState({
        error: null,
        payload: report
      })
    }

    this.onFileInputChange = (e) => {
      const reader = new FileReader()
      reader.onloadend = this.validateReport
      reader.readAsText(e.target.files[0])
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
        {this.state.error && <Error message={this.state.error} />}
        {this.state.payload && <Notebook error={this.state.payload} />}
      </React.Fragment>
    )
  }
}

export default UpdateReport
