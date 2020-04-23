import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { RouteConfig } from 'react-router-config'

function renderRoutes(routes: RouteConfig[], extraProps = {}, switchProps = {}) {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route: RouteConfig, i: number) => {
        console.log('route....', route)
        return (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={
            props => {
              const clildRoutes = renderRoutes(route.routes) 
              var a = route.render ? (
                route.render({ ...props, ...extraProps, route: route })
              ) : (
                <route.component {...props} {...extraProps} route={route}>
                  {clildRoutes}
                </route.component>
              )
              return a
            }
          }
        />
      )})}
    </Switch>
  ) : null
}

export default renderRoutes
