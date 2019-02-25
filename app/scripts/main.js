'use strict';
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import getStore from './store'

import App from './components/app'
import Home from './pages/home'
import Reports from './pages/reports'
import ReportDetail from './pages/report-detail'
import Login from './pages/login'
import Loading from './pages/loading'

// Optimistically show a logged-in state, even though
// the actual token may have expired.
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
const store = getStore({
  user: { isLoggedIn }
})

const loginStatus = {
  LOGGED_IN: 'LOGGED_IN',
  INFLIGHT: 'INFLIGHT',
  NULL: 'NULL'
}

class PrivateRoute extends React.Component {
  getAuthStatus () {
    const { user } = store.getState()
    return user.isLoggedIn && user.accessToken ? loginStatus.LOGGED_IN
      : user.isLoggedIn ? loginStatus.INFLIGHT // show a loading screen until we're ready to make requests
        : loginStatus.NULL
  }

  render () {
    const { component: Component, render: renderComponent, ...rest } = this.props
    let render

    switch (this.getAuthStatus()) {
      case loginStatus.LOGGED_IN:
        render = props => renderComponent ? renderComponent(props) : <Component {...props} />
        break
      case loginStatus.INFLIGHT:
        render = (props) => <Route path={props.location.path} component={Loading} />
        break
      case loginStatus.NULL:
        render = () => <Route path='/' component={Login} />
    }

    return <Route {...rest} render={render} />
  }
}

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Switch>
          <PrivateRoute exact path='/' component={Home} />
          <PrivateRoute exact path='/reports' component={Reports} />
          <PrivateRoute exact path='/reports/:reportId' component={ReportDetail} />
          <PrivateRoute exact path='/reports/:reportId/update' component={ReportDetail} />
        </Switch>
      </App>
    </BrowserRouter>
  </Provider>
)

render(
  <Root store={store} />,
  document.querySelector('#app-container')
)
