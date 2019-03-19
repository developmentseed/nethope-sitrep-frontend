'use strict'
import React from 'react'

import MarkdownReportEditor from '../components/markdown-report-editor'

class NewReport extends React.Component {
  render () {
    return (
      <React.Fragment>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Create a Report</h2>
          </div>
        </div>
        <section className='section section__editor'>
          <div className='inner'>
            <MarkdownReportEditor />
          </div>
        </section>
      </React.Fragment>
    )
  }
}

export default NewReport
