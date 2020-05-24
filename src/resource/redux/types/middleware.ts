import {Dispatch} from './store'
import {AnyAction} from './actions'

export interface MiddlewareApi<D = Dispatch<AnyAction>, S = any> {
  dispatch: D
  getState(): S
}

export interface Middleware<D = Dispatch<AnyAction>, S = any> {
  (api: MiddlewareApi<D, S>): (next: Dispatch<AnyAction>) => (action: any) => any
}
