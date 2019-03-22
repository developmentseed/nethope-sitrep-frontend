'use strict'
import React from 'react'
import { connect } from 'react-redux'
import c from 'classnames'
import { get } from 'object-path'

import { forms } from '../actions'

class EditableText extends React.Component {
  constructor (props) {
    super(props)

    this.isDisabled = () => {
      return this.props.value === this.props.initialValue ||
        this.props.loading
    }

    this.update = (e) => {
      this.props.update({ formID: this.props.formID, value: e.currentTarget.value })
    }

    this.onSubmit = (e) => {
      e.preventDefault()
      if (!this.isDisabled()) {
        this.props.onSubmit({ [this.props.schemaPropertyName]: this.props.value })
      }
    }
  }

  componentDidMount () {
    this.props.create({ formID: this.props.formID, initialValue: this.props.initialValue || '' })
  }

  componentWillUnmount () {
    this.props.destroy({ formID: this.props.formID })
  }

  renderEditable () {
    const placeholder = this.props.placeholder || 'Enter a value'
    const disabled = this.isDisabled()
    return (
      <form className='editable__form' onSubmit={this.onSubmit}>
        <label className='editable__label' htmlFor={this.props.formID}>{this.props.label} {this.props.showRequired && <span className='error__label'><span className='collecticons collecticons-circle-information' /> this field is required</span>}</label>
        <input className='editable__input'
          type='text'
          id={this.props.formID}
          placeholder={placeholder}
          value={this.props.value || ''}
          onChange={this.update}
        />
        { !this.props.hideSubmit && (
          <input type='submit' value='Submit' className={c('editable__submit', { disabled })} />
        ) }
      </form>
    )
  }

  renderReadOnly () {
    return (
      <p>{this.props.value}</p>
    )
  }

  render () {
    const { className, canEdit } = this.props
    return (
      <div className={c(className)}>
        <div className={c('editable editable__text', { readonly: !canEdit }) }>
          { canEdit ? this.renderEditable() : this.renderReadOnly() }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    value: get(state.forms, props.formID, ''),
    loading: state.async.loading
  }
}

const mapDispatch = { ...forms }

export default connect(mapStateToProps, mapDispatch)(EditableText)
