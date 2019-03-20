'use strict'
import React from 'react'
import { connect } from 'react-redux'
import Plain from 'slate-plain-serializer'

import { getSimpleNotebookPayload } from '../utils/async'
import { createReport, postReport } from '../actions'

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
              schemaPropertyName='country'
              placeholder='No country selected'
            />

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
  name: state.forms[nameFieldID]
})
const mapDispatch = { ...createReport, postReport }
export default connect(mapStateToProps, mapDispatch)(NewReport)
