'use strict';
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Route, Switch } from 'react-router-dom'

import store from './store'
import App from './components/app'
import Home from './components/home'
import Reports from './components/reports'

const Root = () => (
  <Provider store={store}>
    <HashRouter>
      <App>
        <Switch>
          <Route exact path='/reports' component={Reports} />
          <Route exact path='/' component={Home} />
        </Switch>
      </App>
    </HashRouter>
  </Provider>
)

render(
  <Root store={store} />,
  document.querySelector('#app-container')
)
