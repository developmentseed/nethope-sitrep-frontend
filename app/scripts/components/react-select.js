'use strict'
import React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import c from 'classnames'
import { forms } from '../actions'

class ReactSelect extends React.Component {
  constructor (props) {
    super(props)
    this.onChange = (value) => {
      this.props.update({ formID: this.props.formID, value })
    }
  }

  componentDidMount () {
    this.props.create({ formID: this.props.formID, initialValue: this.props.initialValue || '' })
  }

  render () {
    const { options, label } = this.props
    return (
      <div className={c('reactselect__cont', this.props.className)}>
        <label className='select__label'>{this.props.label} {this.props.showRequired && <span className='error__label'><span className='collecticons collecticons-circle-information' /> this field is required</span>}</label>
        <Select
          options={options}
          onChange={this.onChange}
          value={this.props.value} />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  value: state.forms[props.formID]
})

const mapDispatch = { ...forms }

export default connect(mapStateToProps, mapDispatch)(ReactSelect)
