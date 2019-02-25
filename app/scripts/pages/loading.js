'use strict'
import React from 'react'
const Loading = () => {
  return (
    <div className='page page__loading'>
      <div className='loading'>
        <span className='async__status async__loading collecticons collecticons-arrow-spin-ccw' />
      </div>
    </div>
  )
}
export default Loading
