'use strict'
import React from 'react'
import { NavLink } from 'react-router-dom'

import Auth from './auth'

const Header = () => {
  return (
    <nav className='nav'>
      <ul className='nav__opts'>
        <li className='nav__opt'><NavLink exact className='nav__link' to='/'>Home</NavLink></li>
        <li className='nav__opt'><NavLink exact className='nav__link' to='/emergencies'>Emergencies</NavLink></li>
        <li className='nav__opt'><NavLink exact className='nav__link' to='/reports'>Reports</NavLink></li>
        <li className='nav__opt'><NavLink exact className='nav__link nav__link--heavy' to='/reports/new'>+ New Report</NavLink></li>
        <li className='nav__opt nav__opt--right'><Auth /></li>
      </ul>
    </nav>
  )
}

export default Header
