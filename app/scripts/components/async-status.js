'use strict'
import React from 'react'
import { connect } from 'react-redux'

class AsyncState extends React.Component {
  render () {
    const { loading, error } = this.props
    if (!loading && !error) return null
    return (
      <div className='async'>
        { loading ? <span className='async__status async__loading'>Loading</span>
          : <span className='async__status async__error'>{error.message}</span>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.async.loading,
  error: state.async.error
})

export default connect(mapStateToProps)(AsyncState)
