'use strict'
import React from 'react'
import nb from 'notebookjs'
import ErrorMessage from './error'

function Notebook ({ data }) {
  try {
    var notebook = nb.parse(data.content)
  } catch (e) {
    return <ErrorMessage message='Could not parse notebook' />
  }
  const rendered = notebook.render()
  return (
    <div className='notebook'>
      <div dangerouslySetInnerHTML={{ __html: rendered.outerHTML }} />
    </div>
  )
}

export default Notebook
