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
import Select from '../components/select'

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

  renderCountrySelect () {
    const { countries } = this.props
    const options = Object.values(countries).sort((a, b) => a.name < b.name ? -1 : 1)
    return (
      <div className='select__country'>
        <ul className='select__list select__country__list'>
          {options.map(d => (
            <li key={d.id}>
              <a className='select__list__item'
                href='#'
                data-value={d.name}
                onClick={this.selectCountry}>{d.name}</a>
            </li>
          ))}
        </ul>
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

            <Select
              formID={countryFormID}
              label='Country'
              placeholder='No country selected'
              prompt='Select a country'
              schemaPropertyName='country'>
              {this.renderCountrySelect()}
            </Select>

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
  countries: state.countries
})
const mapDispatch = { ...createReport, postReport, update: forms.update }
export default connect(mapStateToProps, mapDispatch)(NewReport)
