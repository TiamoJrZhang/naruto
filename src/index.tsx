import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import routes from '@/bussiness/route.config'
import renderRoutes from '@/bussiness/utils/routes.render'
import reducers from './reducers'

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: () => void): (() => void) => f,
  ),
)

const Root = (
  <Provider store={store}>
    <BrowserRouter>
      {/* <Switch>
        <Route />
        <Route />
      </Switch> */}
      {renderRoutes(routes)}
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(Root, document.getElementById('root'))
