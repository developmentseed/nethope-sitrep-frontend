'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { get } from 'object-path'

import { forms } from '../actions'

import Modal from './modal'
import AsyncStatus from './async-status'

class Select extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showSelect: false
    }

    this.toggle = () => {
      this.setState({ showSelect: !this.state.showSelect })
    }
  }

  componentDidMount () {
    this.props.create({ formID: this.props.formID, initialValue: this.props.initialValue || '' })
  }

  renderSelect () {
    return (
      <Modal className='modal__lg' cancel={this.toggle}>
        <div className='modal__inner'>
        </div>
      </Modal>
    )
  }

  render () {
    return (
      <React.Fragment>
        <div className='select__cont' onClick={this.toggle}>
          <label className='select__label' htmlFor={this.props.formID}>{this.props.label}</label>
          <input className='select__input'
            type='text'
            id={this.props.formID}
            placeholder={this.props.placeholder}
            value={this.props.value}
            readOnly />
          <button className='select__trigger'>Select</button>
        </div>
        { this.state.showSelect && this.renderSelect() }
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    value: get(state.forms, props.formID, ''),
  }
}

const mapDispatch = { ...forms }

export default connect(mapStateToProps, mapDispatch)(Select)
