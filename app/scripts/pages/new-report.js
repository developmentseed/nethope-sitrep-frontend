'use strict'
import React from 'react'
import { connect } from 'react-redux'
import Plain from 'slate-plain-serializer'

import { getSimpleNotebookPayload } from '../utils/async'
import { createReport, postReport, forms } from '../actions'

import AsyncStatus from '../components/async-status'
import MarkdownReportEditor from '../components/markdown-report-editor'
import EditableText from '../components/editable-text'
import UploadReportSuccess from '../components/upload-report-success'
import ReactSelect from '../components/react-select'

import _disasterTypes from '../../static/disaster-types.json'
import _reportTypes from '../../static/report-types.json'
import _themes from '../../static/themes.json'

const disasterTypes = _disasterTypes.map(d => ({ label: d.name, value: d.name }))
const reportTypes = _reportTypes.map(d => ({ label: d.type, value: d.type }))
const themes = _themes.map(d => ({ label: d.theme, value: d.theme }))

const nameFieldID = 'new-report-name'
const countryFormID = 'new-report-country'

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

    this.selectCountry = (e) => {
      e.preventDefault()
      this.props.update({
        formID: countryFormID,
        value: e.currentTarget.getAttribute('data-value')
      })
    }
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

            <ReactSelect label='Type' options={reportTypes} />
            <ReactSelect label='Country' options={countries} />
            <ReactSelect label='Themes' options={themes} />
            <ReactSelect label='Disaster Types' options={disasterTypes} />

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
  countries: state.countries || {}
})
const mapDispatch = { ...createReport, postReport, update: forms.update }
export default connect(mapStateToProps, mapDispatch)(NewReport)
