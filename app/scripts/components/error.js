'use strict'
import React from 'react'
import c from 'classnames'

function Error ({ message, level }) {
  const _level = level || 'warning'
  return (
    <div className={ c('error', 'error__' + _level) }>
      <p>{ message || 'An error occurred' }</p>
    </div>
  )
}

export default Error
