'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { parse, stringify } from 'qs'
import { Link } from 'react-router-dom'

import { getReportsWithQs, forms, getTags } from '../actions'
import { disasterTypes, reportTypes } from '../utils/static-types'

import Report from '../components/report'
import AsyncStatus from '../components/async-status'
import ReactSelect from '../components/react-select'
import EditableText from '../components/editable-text'

const dTypes = disasterTypes.map(d => d.value)
const rTypes = reportTypes.map(d => d.value)

const DTYPE = 'disaster_type'
const RTYPE = 'report_type'
const THEME = 'theme'
const COUNTRY = 'country'

const fields = [
  { propName: 'countryField', qs: COUNTRY },
  { propName: 'typeField', qs: RTYPE },
  { propName: 'disasterField', qs: DTYPE },
  { propName: 'themeField', qs: THEME }
]

class Reports extends React.Component {
  constructor (props) {
    super(props)
    this.submitSearch = ({ value }) => {
      const s = this.currentQueryAsObject() || {}
      if (!value) {
        delete s.search
      } else {
        s.search = value
      }
      this.props.history.push(`/reports/?${stringify(s)}`)
    }
  }

  componentDidMount () {
    this.props.getReportsWithQs({ qs: this.queryString() })
    if (!this.props.themes) {
      this.props.getTags()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.props.getReportsWithQs({ qs: this.queryString() })
    }

    const needsUpdate = fields.some(f => this.props[f.propName] && this.props[f.propName] !== prevProps[f.propName])
    if (needsUpdate) {
      let qs = {}
      fields.forEach(f => {
        let stateValue = this.props[f.propName]
        if (Array.isArray(stateValue) && stateValue.length) {
          qs[f.qs] = stateValue.map(d => d.value).join(',')
        } else if (stateValue && stateValue.hasOwnProperty('value')) {
          qs[f.qs] = stateValue.value
        }
      })
      const search = `?${stringify(qs)}`
      if (search !== this.props.location.search) {
        this.props.history.push(`/reports/?${stringify(qs)}`)
      }
    }
  }

  currentQueryAsObject () {
    if (!this.props.location.search.length) {
      return null
    }
    return parse(this.props.location.search.slice(1, this.props.location.search.length))
  }

  queryString () {
    const s = this.currentQueryAsObject()
    if (!s) {
      return ''
    }

    let qs = {}

    if (s.hasOwnProperty(DTYPE) && dTypes.indexOf(s[DTYPE].toLowerCase()) >= 0) {
      qs[DTYPE] = `like.${s[DTYPE]}`
      if (!this.props.disasterField || this.props.disasterField.value !== s[DTYPE]) {
        this.props.update({
          formID: 'filter-disaster-type',
          value: disasterTypes.find(d => d.value === s[DTYPE])
        })
      }
    }

    if (s.hasOwnProperty(RTYPE) && rTypes.indexOf(s[RTYPE].toLowerCase()) >= 0) {
      qs[RTYPE] = `like.${s[RTYPE]}`
      if (!this.props.typeField || this.props.typeField.value !== s[RTYPE]) {
        this.props.update({
          formID: 'filter-report-type',
          value: reportTypes.find(d => d.value === s[RTYPE])
        })
      }
    }

    // Since these two are loaded async,
    // we don't do checking on them
    if (s.hasOwnProperty(COUNTRY)) {
      qs[COUNTRY] = `eq.${s[COUNTRY]}`
    }

    if (s.hasOwnProperty('search')) {
      qs.name = `fts.${s.search}`
    }

    return '?' + stringify(qs)
  }

  clearFilters () {
  }

  renderClearFilters () {
    if (!this.propscountryField && !this.props.typeField && !this.props.disasterField) {
      return null
    }
    return <Link to='/reports'>clear</Link>
  }

  render () {
    const { reports } = this.props
    return (
      <div className='page page__reports'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Recent Reports</h2>
          </div>
        </div>
        <div className='section'>
          <div className='inner'>
            <AsyncStatus />
            <h3 className='section__title'>Search and filter reports {false && this.renderClearFilters()}</h3>
            <div className='tags'>
              <EditableText
                canEdit={true}
                formID={'report-search'}
                label={'Search for a report'}
                placeholder='Type a search...'
                onSubmit={this.submitSearch}
                schemaPropertyName='value'
              />
            </div>

            <div className='tags'>
              <ReactSelect formID='filter-country'
                label='Filter by country'
                options={this.props.countries} />
            </div>

            <div className='tags tags__inline'>
              <ReactSelect formID='filter-report-type'
                className='reactselect__cont--inline'
                label='Filter by report type'
                options={reportTypes} />
              <ReactSelect formID='filter-disaster-type'
                className='reactselect__cont--inline'
                label='Filter by disaster type'
                options={disasterTypes} />
            </div>

            { false && (
              <div className='tags'>
                <ReactSelect formID='filter-themes'
                  multiselect={true}
                  label='Themes'
                  options={this.props.themes || []} />
              </div>
            ) }

            <div className='reports__cont'>
              {reports.map(report => <Report key={report.id} report={report} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    countries: Object.values(state.countries || {})
      .sort((a, b) => a.name < b.name ? -1 : 1)
      .map(d => ({ label: d.name, value: d.id })),

    themes: state.tags.themes,
    reports: state.reports,

    // form state
    countryField: state.forms['filter-country'],
    typeField: state.forms['filter-report-type'],
    disasterField: state.forms['filter-disaster-type'],
    themeField: state.forms['filter-themes'],
    searchField: state.forms['report-search']
  }
}

const mapDispatch = {
  getReportsWithQs,
  getTags,
  update: forms.update
}

export default connect(mapStateToProps, mapDispatch)(Reports)
