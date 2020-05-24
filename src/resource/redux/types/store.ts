import {AnyAction} from './actions'
import {Reducer} from './reducers'

export interface Dispatch<A = AnyAction> {
  <T extends A>(action: T, ...extraProps: any[]): T
}

export interface Unsubscribe {
  (): void
}

export interface Store<S = any, A = AnyAction> {
  dispatch: Dispatch<A>
  getState(): S
  subscribe(listener: () => void): Unsubscribe
}

export type StoreEnhancer = (next: StoreEnhancerStoreCreator) => StoreEnhancerStoreCreator

export type StoreEnhancerStoreCreator = <A extends AnyAction, S = any>(
  reducer: Reducer<S, A>,
  preloadedState: any,
) => Store<S, A>
