/** @format */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './src/reducers'
import App from './src/app'

// const store = createStore(reducers, compose(
//   applyMiddleware(thunk),
//   (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: () => void) : () => void => f
// ))

ReactDOM.render(
  // <Provider>
    <App />,
  // </Provider>, 
  document.getElementById('root')
)
