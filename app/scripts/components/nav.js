'use strict'
import React from 'react'
import { NavLink } from 'react-router-dom'

class Header extends React.Component {
  render () {
    return (
      <nav className='nav'>
        <ul className='nav__opts'>
          <li className='nav__opt'><NavLink to='/'>Home</NavLink></li>
          <li className='nav__opt'><NavLink to='/reports'>Reports</NavLink></li>
          <li className='nav__opt'><NavLink to='/emergencies'>Emergencies</NavLink></li>
        </ul>
      </nav>
    )
  }
}
export default Header
