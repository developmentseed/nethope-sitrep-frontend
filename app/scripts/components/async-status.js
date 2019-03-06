'use strict'
import React from 'react'
import { connect } from 'react-redux'

class AsyncState extends React.Component {
  renderLoading () {
    return <span className='status async__loading collecticons collecticons-arrow-spin-ccw' />
  }

  renderError (e) {
    return <span className='status error'><span className='error__icon collecticons-circle-exclamation' /> {e.message}</span>
  }

  render () {
    const { loading, error } = this.props
    return (
      <div>
        <div className='async'>
          { loading ? this.renderLoading() : error ? this.renderError(error) : null }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.async.loading,
  error: state.async.error
})

export default connect(mapStateToProps)(AsyncState)
