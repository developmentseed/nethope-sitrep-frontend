'use strict';
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import getStore from './store'

import App from './components/app'
import Home from './pages/home'
import Reports from './pages/reports'
import ReportDetail from './pages/report-detail'
import Login from './pages/login'

import Auth from './auth'
const auth = new Auth()

const store = getStore()

class PrivateRoute extends React.Component {
  isAuthenticated () {
    return !!store.getState().user.token
  }

  render () {
    const { component: Component, render: renderComponent, ...rest } = this.props
    let render
    if (this.isAuthenticated()) {
      render = props => renderComponent ? renderComponent(props) : <Component {...props} />
    } else {
      render = props => <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
    }
    return <Route {...rest} render={render} />
  }
}

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Switch>
          <Route path='/login' component={Login} />
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
