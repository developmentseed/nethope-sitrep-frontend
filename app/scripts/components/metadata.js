import React from 'react'

function renderMetadataItem (d, i) {
  const source = d.source && d.link ? <a href={d.link} target='_blank'>{d.source}</a> : d.source
  return (
    <React.Fragment key={i}>
      <dt>{d.label}:</dt>
      <dd>{d.value} {!!source && <span className='dd__source'>Source: {source}</span>}</dd>
    </React.Fragment>
  )
}

function Metadata ({ data }) {
  return (
    <dl className='dl reportcard__dl'>
      {data.map(renderMetadataItem)}
    </dl>
  )
}
export default Metadata
