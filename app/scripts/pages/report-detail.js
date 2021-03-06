'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import fileDownload from 'js-file-download'
import slugify from 'slugify'
import { get } from 'object-path'
import { ago } from 'time-ago'
import { stringify } from 'qs'

import { nope, cap, reportTitle } from '../utils/format'
import { getReport, getEmergency, deleteReport, getReportsWithQs } from '../actions'
import { getAuthorFromEmail, getReportRefs } from '../utils/notebook'

import AsyncStatus from '../components/async-status'
import Notebook from '../components/notebook'
import UpdateReport from '../components/update-report'
import ForkReport from '../components/fork-report'
import Versions from '../components/versions'
import UploadReportSuccess from '../components/upload-report-success'
import Report from '../components/report'

class ReportDetail extends React.Component {
  constructor (props) {
    super(props)

    this.download = () => {
      fileDownload(
        JSON.stringify(this.props.report.content, null, 2),
        `${slugify(this.props.report.name)}.ipynb`,
        'application/json'
      )
    }

    this.delete = () => {
      this.props.deleteReport({ id: this.id() })
    }
  }

  componentDidMount () {
    if (!this.props.report) {
      this.props.getReport({ id: this.id() })
    }
    if (this.props.report && this.props.report.emergency && !this.props.emergency) {
      this.props.getEmergency({ emergencyID: this.props.report.emergency })
    }
  }

  componentDidUpdate (prevProps) {
    // Router navigated to new report.
    const id = this.id()
    if (id !== prevProps.match.params.reportID && !this.props.report) {
      this.props.getReport({ id })
    }
    if (this.props.report && this.props.report.emergency && !this.props.emergency) {
      this.props.getEmergency({ emergencyID: this.props.report.emergency })
    }
    // Just loaded a report, check if we have all the referenced reports loaded.
    if (this.props.report && !prevProps.report && this.props.refs.length > this.props.referencedReports.length) {
      const op = this.props.refs.length > 1 ? 'in' : 'eq'
      // For multiple reports, wrap the request in "()" ie. id=in.(id1,id2).
      const refs = op === 'in' ? `(${this.props.refs.join(',')})` : this.props.refs[0];
      this.props.getReportsWithQs({
        qs: '?' + stringify({ id: `${op}.${refs}` })
      })
    }
  }

  id (...args) {
    const id = this.props.match.params.reportID
    if (!args.length) {
      return id
    }
    return [id].concat(args).join('-')
  }

  renderUpdateReport () {
    const { report, isReportOwner } = this.props
    return (
      <div className='inner'>
        <div className='report__ctrls'>
          <Link className='report__ctrl report__ctrl--small' to={`/reports/${this.id()}`}>
            <span className='collecticons collecticons-arrow-return' />
            Go back
          </Link>
        </div>

        { isReportOwner ? <UpdateReport report={report} /> : (
          <div className='report__meta'>
            <p className='status error'><span className='error__icon collecticons-circle-exclamation' /> Oops, you can only edit reports you own. Fork this report so you can edit it.</p>
          </div>
        ) }
      </div>
    )
  }

  renderReportRefs () {
    const { referencedReports } = this.props
    if (!referencedReports.length) { return null }
    return <section className='section section__refs'>
      <h1 className='report__section__title'>References</h1>
      <div className='report__refs__cont'>
        <ul className='report__refs'>
          { referencedReports.map(report => (
            <li key={report.id}>
              <Report report={report} />
            </li>
          )) }
        </ul>
      </div>
    </section>
  }

  renderReportOwner () {
    const { report, isReportOwner } = this.props
    const owner = isReportOwner ? 'You' : getAuthorFromEmail(report.author)
    return (
      <div className='report__info'>
        <p>{owner} created this report {ago(report['created_at'])}.</p>
      </div>
    )
  }

  renderReportMeta () {
    const { report, country, emergency } = this.props
    const themes = !report.tags || !report.tags.length ? nope : report.tags.map(d => d.name).join(', ')
    return (
      <div className='report__tags'>
        <dl className='dl'>
          { !!emergency && !!emergency.name && (
            <React.Fragment>
              <dt>Emergency:</dt>
              <dd><Link to={`/emergencies/emergency/${emergency.id}`}>{emergency.name}</Link></dd>
            </React.Fragment>
          ) }
          <dt>Disaster type:</dt>
          <dd>{cap(report['disaster_type'])}</dd>

          <dt>Themes:</dt>
          <dd>{themes}</dd>
          { !!country && (
            <React.Fragment>
              <dt>Country:</dt>
              <dd><Link to={`/emergencies/country/${country.id}`}>{country.name}</Link></dd>
            </React.Fragment>
          ) }
        </dl>
      </div>
    )
  }

  renderReport () {
    const { report, isReportOwner } = this.props
    return (
      <React.Fragment>
        <div className='inner'>
          <div className='report__ctrls'>
            <button className='report__ctrl report__ctrl__dl' onClick={this.download}>
              <span className='collecticons collecticons-download' /> Download report
            </button>
            { isReportOwner ? (
              <Link className='report__ctrl report__ctrl__up' to={`/reports/${this.id()}/update`}>
                <span className='collecticons collecticons-wrench' />Update this report
              </Link>
            ) : <ForkReport current={report.id} /> }
            { false && (
              <button className='report__ctrl report__ctrl__del' onClick={this.delete}>
                <span className='collecticons collecticons-trash-bin' />Delete this report
              </button>
            ) }
          </div>
          <section className='section'>
            <h1 className='report__section__title'>Report details</h1>
            {this.renderReportOwner()}
            {this.renderReportMeta()}
            <Versions docID={report['doc_id']} current={report.id} />
          </section>
        </div>
        <div className='report__cont'>
          <section className='section section__report'>
            <h1 className='report__section__title'>Report body</h1>
            <Notebook data={report} />
          </section>
          {this.renderReportRefs()}
        </div>
      </React.Fragment>
    )
  }

  render () {
    const { report, match } = this.props
    if (!report) return null
    const showUpdateUI = /update/.test(match.path)
    return (
      <div className='page page__report'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>{reportTitle(report)}</h2>
          </div>
        </div>
        <div className='section'>
          <div className='inner'>
            <AsyncStatus />
            <UploadReportSuccess />
          </div>
          { showUpdateUI ? this.renderUpdateReport() : this.renderReport() }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { reportMap } = state
  const { reportID } = props.match.params
  const report = reportMap[reportID]
  const author = get(report, 'author')
  const country = report && report.country && state.countries[report.country]
  const emergency = report && report.emergency && state.emergencyMap[report.emergency]
  const refs = getReportRefs(report)
  const referencedReports = refs.map(id => state.reports.find(d => d.id === id)).filter(Boolean)
  return {
    report,
    country,
    emergency,
    refs,
    referencedReports,
    isReportOwner: author && author === state.user.email
  }
}

const mapDispatch = { getReport, getEmergency, deleteReport, getReportsWithQs }

export default connect(mapStateToProps, mapDispatch)(ReportDetail)
