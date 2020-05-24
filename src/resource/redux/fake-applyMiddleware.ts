import {Middleware, MiddlewareApi} from './types/middleware'
import {Reducer} from './types/reducers'
import {AnyAction} from './types/actions'
import {Dispatch} from './types/store'
import compose from './fake-compose'

export default function applyMiddleware(...middlewares: Middleware[]) {
  return (createStore: any) => <S, A extends AnyAction>(reducer: Reducer<S, A>, ...args: any[]) => {
    const store = createStore(reducer, ...args)
    let dispatch: Dispatch = () => {
      throw new Error('')
    }

    const middlewareApi: MiddlewareApi = {
      getState: store.getState,
      dispatch: (actions, ...args) => dispatch(actions, ...args),
    }

    const chain = middlewares.map(middleware => middleware(middlewareApi))

    //(middleware3(middleware2(middleware1(store.dispatch))))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
}
