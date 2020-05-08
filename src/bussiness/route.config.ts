/** @format */

import App from '@/app'
import Home from '@/bussiness/page/home'

const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
      },
    ],
  },
]

export default routes
