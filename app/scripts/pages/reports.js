'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import { getReportsWithQs, forms, getTags } from '../actions'
import { disasterTypes, reportTypes } from '../utils/static-types'
import { currentQueryAsObject } from '../utils/location'

import Report from '../components/report'
import AsyncStatus from '../components/async-status'
import ReactSelect from '../components/react-select'
import EditableText from '../components/editable-text'

const dTypes = disasterTypes.map(d => d.value)
const rTypes = reportTypes.map(d => d.value)

const fields = {
  dtype: 'disaster_type',
  rtype: 'report_type',
  country: 'country',
  search: 'search'
}

class Reports extends React.Component {
  constructor (props) {
    super(props)
    this.clearFilters = (e) => {
      e.preventDefault()
      this.props.history.push('/reports')
    }
  }

  componentDidMount () {
    this.queryReports()
    if (!this.props.themes) {
      this.props.getTags()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.queryReports()
    }
  }

  // Use location state to query reports
  queryReports () {
    const s = currentQueryAsObject(this.props.location.search)
    let query = {}

    if (s[fields.dtype] && dTypes.indexOf(s[fields.dtype].toLowerCase()) >= 0) {
      query[fields.dtype] = `like.${s[fields.dtype]}`
    }

    if (s[fields.rtype] && rTypes.indexOf(s[fields.rtype].toLowerCase()) >= 0) {
      query[fields.rtype] = `like.${s[fields.rtype]}`
    }

    // Loaded async, so we don't do checking on this.
    if (s[fields.country]) {
      query[fields.country] = `eq.${s[fields.country]}`
    }

    if (s[fields.search]) {
      query.name = `fts.${s.search}`
    }

    let qs = stringify(query)
    qs = qs ? '?' + qs : ''
    this.props.getReportsWithQs({ qs })
  }

  renderClear () {
    return <a href='#' onClick={this.clearFilters} className='clear__filter'>
      <span className='collecticons collecticons-trash-bin' />
    </a>
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
            <h3 className='section__title'>Search and filter reports {!!this.props.location.search && this.renderClear()}</h3>
            <div className='tags'>
              <EditableText
                canEdit={true}
                formID={fields.search}
                label={'Search for a report'}
                placeholder='Type a search...'
                onSubmit={() => false}
                schemaPropertyName='value'
                isLocationAware={true}
              />
            </div>

            <div className='tags'>
              <ReactSelect formID={fields.country}
                label='Filter by country'
                options={this.props.countries}
                isLocationAware={true} />
            </div>

            <div className='tags tags__inline'>
              <ReactSelect formID={fields.rtype}
                className='reactselect__cont--inline'
                label='Filter by report type'
                options={reportTypes}
                isLocationAware={true} />
              <ReactSelect formID={fields.dtype}
                className='reactselect__cont--inline'
                label='Filter by disaster type'
                options={disasterTypes}
                isLocationAware={true} />
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
    countryField: state.forms[fields.country],
    typeField: state.forms[fields.rtype],
    disasterField: state.forms[fields.dtype],
    themeField: state.forms['filter-themes'],
    searchField: state.forms[fields.search]
  }
}

const mapDispatch = {
  getReportsWithQs,
  getTags,
  update: forms.update
}

export default connect(mapStateToProps, mapDispatch)(Reports)
