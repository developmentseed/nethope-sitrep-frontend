'use strict'
import React from 'react'
import { connect } from 'react-redux'
import Plain from 'slate-plain-serializer'

import { getSimpleNotebookPayload } from '../utils/async'
import { recentQs } from '../utils/timespans'
import { createReport, postReport, forms, getEmergencies } from '../actions'

import AsyncStatus from '../components/async-status'
import MarkdownReportEditor from '../components/markdown-report-editor'
import EditableText from '../components/editable-text'
import UploadReportSuccess from '../components/upload-report-success'
import ReactSelect from '../components/react-select'
import Select from '../components/select'
import EmergencyList from '../components/emergency-list'

import _disasterTypes from '../../static/disaster-types.json'
import _reportTypes from '../../static/report-types.json'
import _themes from '../../static/themes.json'

const disasterTypes = _disasterTypes.map(d => ({ label: d.name, value: d.name }))
const reportTypes = _reportTypes.map(d => ({ label: d.type, value: d.type }))
const themes = _themes.map(d => ({ label: d.theme, value: d.theme }))

const nameFieldID = 'new-report-name'
const emergencyFieldID = 'new-report-emergency'

class NewReport extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showNameRequired: false
    }

    this.onChange = (change) => {
      this.props.sync({ value: change.value })
    }

    this.save = () => {
      const { name, editorValue } = this.props
      const nextState = {
        showNameRequired: !name
      }
      const body = Plain.serialize(editorValue)
      const payload = getSimpleNotebookPayload(name, body)
      this.props.postReport({ payload })
      this.setState(nextState)
    }

    this.selectEmergency = (e) => {
      e.preventDefault()
      const value = e.currentTarget.getAttribute('data-name')
      this.props.update({
        formID: emergencyFieldID,
        value
      })
    }
  }

  componentDidMount () {
    // We need to query emergencies here to support metadata selection
    if (!this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
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
    const countries = Object.values(this.props.countries)
      .sort((a, b) => a.name < b.name ? -1 : 1)
      .map(d => ({ label: d.name, value: d.id }))

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
                label='Name'
                placeholder='Enter a report name'
                hideSubmit={true}
                schemaPropertyName='name'
                showRequired={this.state.showNameRequired}
              />
            </div>

            <MarkdownReportEditor
              onChange={this.onChange}
              value={this.props.editorValue}/>

            <div className='tags'>
              <Select formID={emergencyFieldID}
                label='Emergency'
                placeholder='Select an emergency...'
                prompt='Choose an emergency'>
                {this.renderEmergencyTable()}
              </Select>
              <ReactSelect label='Country' options={countries} />
            </div>

            <div className='tags tags__inline'>
              <ReactSelect className='reactselect__cont--inline' label='Report Type' options={reportTypes} />
              <ReactSelect className='reactselect__cont--inline' label='Theme' options={themes} />
              <ReactSelect className='reactselect__cont--inline' label='Disaster Type' options={disasterTypes} />
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
  editorValue: state.newReport.value,
  name: state.forms[nameFieldID],
  countries: state.countries || {},
  emergencies: state.emergencies[recentQs],
  qs: recentQs
})
const mapDispatch = {
  ...createReport,
  postReport,
  getEmergencies,
  update: forms.update
}
export default connect(mapStateToProps, mapDispatch)(NewReport)
