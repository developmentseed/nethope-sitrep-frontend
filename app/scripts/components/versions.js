'use strict'
import React from 'react'
import { connect } from 'react-redux'

import { getReportVersions } from '../actions'

class Versions extends React.Component {
  componentDidMount () {
    this.getVersions()
  }

  componentDidUpdate (prevProps) {
    if (this.props.docID !== prevProps.docID) {
      this.getVersions()
    }
  }

  getVersions () {
    this.props.getReportVersions({ docID: this.props.docID })
  }

  render () {
    const { older, newer } = this.props
    return (
      <div className='versions'>
        { older.length > 0 && <p className='versions__count'>{older.length} older version(s) available.</p> }
        { newer.length > 0 && <p className='versions__count'>{newer.length} newer version(s) available.</p> }
      </div>
    )
  }
}

const mapDispatch = {
  getReportVersions
}

const mapStateToProps = (state, props) => {
  // Get all documents with the same version,
  // then return the IDs of those that are older/newer.
  const { docID, current } = props
  const { reportMap } = state
  const createdAt = reportMap[current]['created_at']
  const versions = Object.values(reportMap)
    .filter(report => report['doc_id'] === docID)
  return {
    older: versions.filter(d => d['created_at'] < createdAt).map(d => d.id),
    newer: versions.filter(d => d['created_at'] > createdAt).map(d => d.id)
  }
}

export default connect(mapStateToProps, mapDispatch)(Versions)
