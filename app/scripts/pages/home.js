'use strict'
import React from 'react'
import { Link } from 'react-router-dom'
class Home extends React.Component {
  render () {
    return (
      <div className='page page__home'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Situation Reporting Platform Beta</h2>
          </div>
        </div>
        <div className='section'>
          <div className='inner'>
            <h3 className='section__title'><Link to='/reports'>Reports</Link></h3>
            <h3 className='section__title'><Link to='/emergencies'>Emergencies</Link></h3>
          </div>
        </div>
      </div>
    )
  }
}
export default Home
