'use strict'
import React from 'react'
import Select from 'react-select'

class ReactSelect extends React.Component {
  render () {
    const { options, label } = this.props
    return (
      <div className='select'>
        <label className='select__label'>{this.props.label}</label>
        <Select options={options} />
      </div>
    )
  }
}

export default ReactSelect
