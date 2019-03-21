'use strict'
import React from 'react'
import { connect } from 'react-redux'
import Plain from 'slate-plain-serializer'
import { get } from 'object-path'

import { getSimpleNotebookPayload } from '../utils/async'
import { recentQs } from '../utils/timespans'
import { createReport, postReport, forms, getEmergencies, getTags } from '../actions'
import { disasterTypes, reportTypes } from '../utils/static-types'

import AsyncStatus from '../components/async-status'
import MarkdownReportEditor from '../components/markdown-report-editor'
import EditableText from '../components/editable-text'
import UploadReportSuccess from '../components/upload-report-success'
import ReactSelect from '../components/react-select'
import Select from '../components/select'
import EmergencyList from '../components/emergency-list'

const nameFieldID = 'new-report-name'
const emergencyFieldID = 'new-report-emergency'
const countryFieldID = 'new-report-country'
const typeFieldID = 'new-report-type'
const themeFieldID = 'new-report-theme'
const disasterFieldID = 'new-report-disaster-type'

class NewReport extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showNameRequired: false,
      showCountryRequired: false,
      showReportTypeRequired: false,
      showDisasterTypeRequired: false
    }

    this.onEditorChange = (change) => {
      this.props.sync({ value: change.value })
    }

    this.getEmergency = (value) => {
      if (!value || !this.props.emergencies || !this.props.emergencies.data.length) return null
      return this.props.emergencies.data.find(d => d.name === value)
    }

    this.save = () => {
      const {
        name,
        editorValue,
        emergencyField,
        countryField,
        typeField,
        themeField,
        disasterField
      } = this.props

      const nextState = {
        showNameRequired: !name,
        showCountryRequired: !countryField,
        showReportTypeRequired: !typeField,
        showDisasterTypeRequired: !disasterField
      }

      if (name && countryField && typeField && disasterField) {
        const body = Plain.serialize(editorValue)
        const payload = getSimpleNotebookPayload(name, body)
        payload.country = countryField.value
        payload.emergency = get(this.getEmergency(emergencyField), 'id')
        payload['report_type'] = typeField.value
        payload['disaster_type'] = disasterField.value

        const tags = Array.isArray(themeField) && themeField.map(d => d.value)
        this.props.postReport({ payload, tags })
      }

      this.setState(nextState)
    }

    this.selectEmergency = (e) => {
      e.preventDefault()
      const value = e.currentTarget.getAttribute('data-name')
      this.props.update({ formID: emergencyFieldID, value })
      // If the country hasn't been set, sync it
      if (!this.props.countryField) {
        // Though an emergency can have multiple countries, we use the first one.
        const countryID = get(this.getEmergency(value), 'countries.0.id', false)
        const country = countryID && this.props.countries.find(d => d.value === countryID)
        if (country) this.props.update({ formID: countryFieldID, value: country })
      }
    }
  }

  componentDidMount () {
    // We need to query emergencies here to support metadata selection
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }

    if (!this.props.themes) {
      this.props.getTags()
    }
  }

  componentWillUnmount () {
    this.props.clear()
  }

  renderEmergencyTable () {
    const { emergencies } = this.props
    if (!emergencies || !emergencies.data.length) return <AsyncStatus />
    return (
      <div className='modal__select modal__select--emergency'>
        <EmergencyList
          isSelect={true}
          onRowSelect={this.selectEmergency}
          data={emergencies.data} />
      </div>
    )
  }

  render () {
    return (
      <React.Fragment>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Create a Report</h2>
          </div>
        </div>
        <section className='section section__editor'>
          <div className='inner'>
            <AsyncStatus />
            <UploadReportSuccess />

            <div className='editable__cont'>
              <EditableText
                canEdit={true}
                className='report__name'
                formID={nameFieldID}
                initialValue=''
                label='Name*'
                placeholder='Enter a report name'
                hideSubmit={true}
                schemaPropertyName='name'
                showRequired={this.state.showNameRequired}
              />
            </div>

            <MarkdownReportEditor
              onChange={this.onEditorChange}
              value={this.props.editorValue}/>

            <div className='tags'>
              <Select formID={emergencyFieldID}
                label='Emergency'
                placeholder='Select an emergency...'
                prompt='Choose an emergency'>
                {this.renderEmergencyTable()}
              </Select>

              <ReactSelect formID={countryFieldID}
                label='Country*'
                options={this.props.countries}
                showRequired={this.state.showCountryRequired} />
            </div>

            <div className='tags tags__inline'>
              <ReactSelect formID={typeFieldID}
                className='reactselect__cont--inline'
                label='Report Type*'
                options={reportTypes}
                showRequired={this.state.showReportTypeRequired} />
              <ReactSelect formID={disasterFieldID}
                className='reactselect__cont--inline'
                label='Disaster Type*'
                options={disasterTypes}
                showRequired={this.state.showDisasterTypeRequired} />
            </div>

            <div className='tags'>
              <ReactSelect formID={themeFieldID}
                multiselect={true}
                label='Themes'
                options={this.props.themes || []} />
            </div>

            <div className='report__ctrls'>
              <button className='report__ctrl report__ctrl__save' onClick={this.save}>Save</button>
            </div>
          </div>
        </section>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  countries: Object.values(state.countries || {})
    .sort((a, b) => a.name < b.name ? -1 : 1)
    .map(d => ({ label: d.name, value: d.id })),

  emergencies: state.emergencies[recentQs],
  qs: recentQs,
  themes: state.tags.themes,

  // form values
  editorValue: state.newReport.value,
  name: state.forms[nameFieldID],
  emergencyField: state.forms[emergencyFieldID],
  countryField: state.forms[countryFieldID],
  typeField: state.forms[typeFieldID],
  themeField: state.forms[themeFieldID],
  disasterField: state.forms[disasterFieldID]
})

const mapDispatch = {
  ...createReport,
  postReport,
  getEmergencies,
  getTags,
  update: forms.update
}
export default connect(mapStateToProps, mapDispatch)(NewReport)
