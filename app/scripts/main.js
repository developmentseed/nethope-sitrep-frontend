'use strict';
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Route, Switch } from 'react-router-dom'

import store from './store'

import App from './components/app'
import Home from './pages/home'
import Reports from './pages/reports'
import ReportDetail from './pages/report-detail'

const Root = () => (
  <Provider store={store()}>
    <HashRouter>
      <App>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/reports' component={Reports} />
          <Route exact path='/reports/:reportId' component={ReportDetail} />
          <Route exact path='/reports/:reportId/update' component={ReportDetail} />
        </Switch>
      </App>
    </HashRouter>
  </Provider>
)

render(
  <Root store={store} />,
  document.querySelector('#app-container')
)
