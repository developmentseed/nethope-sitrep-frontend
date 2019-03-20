'use strict'
import React from 'react'
import Select from 'react-select'
import c from 'classnames'

class ReactSelect extends React.Component {
  render () {
    const { options, label } = this.props
    return (
      <div className={c('reactselect__cont', this.props.className)}>
        <label className='select__label'>{this.props.label}</label>
        <Select options={options} />
      </div>
    )
  }
}

export default ReactSelect
