import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import routes from '@/bussiness/route.config'
import renderRoutes from '@/bussiness/utils/routes.render'

const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: () => void) : () => void => f
))

const Root = (
  <BrowserRouter>
    {/* <Switch>
      <Route />
      <Route />
    </Switch> */}
    {renderRoutes(routes)}
  </BrowserRouter>
)

ReactDOM.render(
  Root, document.getElementById('root')
)
