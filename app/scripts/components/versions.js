'use strict'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { get } from 'object-path'
import { ago } from 'time-ago'

import { getReportVersions } from '../actions'

class Versions extends React.Component {
  constructor (props) {
    super(props)
    this.toggleOld = this.expand.bind(this, 'older')
    this.toggleNew = this.expand.bind(this, 'newer')
    this.state = {
      older: false,
      newer: false
    }
  }

  componentDidMount () {
    this.getVersions()
  }

  componentDidUpdate (prevProps) {
    if (this.props.docID !== prevProps.docID) {
      this.getVersions()
    }

    if (this.props.current !== prevProps.current) {
      this.setState({
        older: false,
        newer: false
      })
    }
  }

  getVersions () {
    this.props.getReportVersions({ docID: this.props.docID })
  }

  expand (propName, e) {
    e.preventDefault()
    this.setState({ [propName]: !this.state[propName] })
  }

  renderVersionLinks (versions) {
    return (
      <ul className='versions'>
        {versions.map(d => <li key={d.id}>
          <span className='collecticons collecticons-pages'/>&nbsp;
          <Link to={`/reports/${d.id}`}>{d.name}</Link>&nbsp;
          <span className='light'>created {ago(d.created_at)}</span>
        </li>)}
      </ul>
    )
  }

  renderNoVersions () {
    return <p className='report__info'>This is the first version of this report.</p>
  }

  render () {
    const { older, newer } = this.props
    if (!older.length && !newer.length) return this.renderNoVersions()
    return (
      <div className='report__versions'>
        { older.length > 0 && <p className='versions__count'>{older.length} older version(s) available. <a href='#' onClick={this.toggleOld}>{this.state.older ? 'Hide' : 'Show'}</a></p> }
        { this.state.older && this.renderVersionLinks(older) }
        { newer.length > 0 && <p className='versions__count'>{newer.length} newer version(s) available. <a href='#' onClick={this.toggleNew}>{this.state.newer ? 'Hide' : 'Show'}</a></p> }
        { this.state.newer && this.renderVersionLinks(newer) }
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
  const { reportMap, reportVersions } = state
  const createdAt = get(reportMap, [current, 'created_at'])
  const versions = Object.values(reportVersions)
    .filter(report => report['doc_id'] === docID)
  return {
    older: versions.filter(d => d['created_at'] < createdAt).sort((a, b) => a['created_at'] > b['created_at'] ? -1 : 1),
    newer: versions.filter(d => d['created_at'] > createdAt).sort((a, b) => a['created_at'] > b['created_at'] ? -1 : 1),
    current
  }
}

export default connect(mapStateToProps, mapDispatch)(Versions)
