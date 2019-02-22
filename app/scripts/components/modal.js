'use strict'
import React from 'react'

export default function modal ({ children, cancel }) {
  return (
    <React.Fragment>
      <div className='modal__bg' onClick={cancel}/>
      <div className='modal__cont'>
        <div className='modal'>
          {children}
        </div>
      </div>
    </React.Fragment>
  )
}
