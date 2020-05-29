import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {RouteConfig} from 'react-router-config'

function renderRoutes(routes: RouteConfig[], extraProps = {}, switchProps = {}) {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route: RouteConfig, i: number) => {
        return (
          <Route
            key={route.key || i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={props => {
              const clildRoutes = renderRoutes(route.routes)
              return route.render ? (
                route.render({...props, ...extraProps, route: route})
              ) : (
                <route.component {...props} {...extraProps} route={route}>
                  {clildRoutes}
                </route.component>
              )
            }}
          />
        )
      })}
    </Switch>
  ) : null
}

export default renderRoutes
