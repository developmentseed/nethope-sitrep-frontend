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
      this.props.update({ formId: this.props.formId, value: e.currentTarget.value })
    }

    this.onSubmit = (e) => {
      e.preventDefault()
      if (!this.isDisabled()) {
        this.props.onSubmit({ [this.props.schemaPropertyName]: this.props.value })
      }
    }
  }

  componentDidMount () {
    this.props.create({ formId: this.props.formId, initialValue: this.props.initialValue || '' })
  }

  componentWillUnmount () {
    this.props.destroy({ formId: this.props.formId })
  }

  renderEditable () {
    const placeholder = this.props.placeholder || 'Enter a value'
    const disabled = this.isDisabled()
    return (
      <form className='form form--inline' onSubmit={this.onSubmit}>
        <input type='text'
          placeholder={placeholder}
          value={this.props.value}
          onChange={this.update}
        />
        <input type='submit' value='Submit' className={c('submit', { disabled })} />
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
    value: get(state.forms, props.formId, ''),
    loading: state.async.loading
  }
}

const mapDispatch = { ...forms }

export default connect(mapStateToProps, mapDispatch)(EditableText)
