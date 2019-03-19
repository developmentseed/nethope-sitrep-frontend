'use strict'
import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'

import _initialValue from '../utils/initial-editor-value.json'
const initialValue = Value.fromJSON(_initialValue)

function MarkdownReportEditor ({ onChange, value }) {
  return (
    <div className='editor__cont'>
      <Editor
        id='new-report-slate-editor'
        defaultValue={initialValue}
        onChange={onChange}
        value={value}
        className='editor'
      />
    </div>
  )
}

export default MarkdownReportEditor
