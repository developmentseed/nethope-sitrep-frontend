'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import auth0 from 'auth0-js'
import c from 'classnames'

import { user } from '../actions'
import { authDomain, authClientID, authRedirectUri } from '../config'

class Auth extends React.Component {
  constructor (props) {
    super(props)

    this.auth0 = new auth0.WebAuth({
      domain: authDomain,
      clientID: authClientID,
      redirectUri: authRedirectUri,
      responseType: 'token id_token',
      scope: 'openid role email'
    })

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.renewSession = this.renewSession.bind(this)
  }

  componentDidMount () {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.renewSession()
    }
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.handleAuthentication()
    }
  }

  componentDidUpdate () {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.handleAuthentication()
    }
  }

  login (e) {
    e && typeof e.preventDefault === 'function' && e.preventDefault()
    this.auth0.authorize()
  }

  logout (e) {
    e && typeof e.preventDefault === 'function' && e.preventDefault()
    this.props.clearCredentials()

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn')

    this.props.history.replace('/')
  }

  handleAuthentication () {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        this.props.history.replace('/')
        console.error(err) // eslint-disable-line no-console
      }
    })
  }

  setSession (authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true')

    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + new Date().getTime()
    this.props.setCredentials({
      accessToken: authResult.accessToken,
      idToken: authResult.idToken,
      expiresAt
    })
    this.props.history.replace(this.props.location.path)
  }

  renewSession () {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        this.logout()
        console.error(err) // eslint-disable-line no-console
      }
    })
  }

  render () {
    const { isLoggedIn } = this.props
    const cls = 'nav__link nav__link__login'
    return isLoggedIn
      ? <a className={c(cls, 'nav__link__logout')} onClick={this.logout} href='#'>Log out</a>
      : <a className={c(cls)} onClick={this.login} href='#'>Login</a>
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn
})

const mapDispatch = {
  ...user
}

export default withRouter(connect(mapStateToProps, mapDispatch)(Auth))
