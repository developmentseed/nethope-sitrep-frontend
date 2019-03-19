'use strict'
import React from 'react'
import { authorize } from '../components/auth'

function login (e) {
  e.preventDefault()
  authorize()
}

const Login = () => {
  return (
    <div className='page page__login'>
      <p className='login__prompt'>Please <a href='#' onClick={login}>login</a> to see this page.</p>
    </div>
  )
}
export default Login
