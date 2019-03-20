'use strict'
import React from 'react'
import c from 'classnames'

export default function modal ({ children, cancel, transparent, className }) {
  return (
    <React.Fragment>
      <div className={c('modal__bg', { modal__bg__transparent: transparent })} onClick={cancel}/>
      <div className={c('modal__cont', className)}>
        <div className='modal'>
          {children}
        </div>
      </div>
    </React.Fragment>
  )
}
