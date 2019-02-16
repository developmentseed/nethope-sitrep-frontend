'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { getReports } from '../actions'
import types from '../actions/types'

class Reports extends React.Component {
  componentDidMount () {
    this.props.getReports()
  }

  render () {
    return (
      <div className='reports'>
        <p>Reports!</p>
      </div>
    )
  }
}

const mapDispatch = {
  getReports
}

export default connect(null, mapDispatch)(Reports)
