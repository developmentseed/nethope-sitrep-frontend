'use strict'
import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'

import _initialValue from '../utils/initial-editor-value.json'
const initialValue = Value.fromJSON(_initialValue)

class MarkdownReportEditor extends React.Component {
  constructor (props) {
    super(props)
    this.onChange = (change) => {
      console.log(change)
    }
  }

  render () {
    return (
      <div className='editor__cont'>
        <Editor
          id='new-report-slate-editor'
          defaultValue={initialValue}
          onChange={this.onChange}
          className='editor'
        />
      </div>
    )
  }
}

export default MarkdownReportEditor
