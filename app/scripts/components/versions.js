'use strict'
import React from 'react'
import { connect } from 'react-redux'

import { getReportVersions } from '../actions'

class Versions extends React.Component {
  componentDidMount () {
    this.getVersions()
  }

  componentDidUpdate (prevProps) {
    if (this.props.latest['doc_id'] !== prevProps.latest['doc_id']) {
    this.getVersions()
    }
  }

  getVersions () {
    this.props.getReportVersions({ docID: this.props.latest['doc_id'] })
  }

  render () {
    const { versions } = this.props
    if (versions.length <= 1) return null
    return (
      <div className='versions'>
        <p className='versions__count'>{versions.length - 1} older version(s) available.</p>
      </div>
    )
  }
}

const mapDispatch = {
  getReportVersions
}

const mapStateToProps = (state, props) => {
  // Get all documents with the same version,
  // sorted chronologically.
  const docID = props.latest['doc_id']
  const { reportMap } = state
  const versions = Object.values(reportMap)
  .filter(report => report['doc_id'] === docID)
  .sort((a, b) => a['created_at'] < b['created_at'] ? -1 : 1)
  return { versions }
}

export default connect(mapStateToProps, mapDispatch)(Versions)
