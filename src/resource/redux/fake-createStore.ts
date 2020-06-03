import {Reducer} from './types/reducers'
import {AnyAction} from './types/actions'
import {Store, StoreEnhancer, Dispatch} from './types/store'

export default function createStore<A extends AnyAction, S>(
  reducer: Reducer<S, A>,
  preloadedState: any,
  enhancer?: StoreEnhancer,
): Store<S, A> {
  if (enhancer && typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, preloadedState)
  }
  if (typeof reducer !== 'function') {
    throw new Error('reducer must be a function!')
  }

  const currentReducer: Reducer<S, A> = reducer
  let currentState = preloadedState
  let currentListeners: (() => void | null)[] = []
  let nextListeners = currentListeners
  let isDispatching = false

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  function subscribe(listener: () => void) {
    if (isDispatching || typeof listener !== 'function') return

    let isSubscribed = true
    nextListeners.push(listener)

    return function unsubscribe() {
      if (isSubscribed || isDispatching) return
      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null
    }
  }

  function dispatch(action: A) {
    if (isDispatching) return

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } catch (error) {
      isDispatching = false
    }

    nextListeners.forEach(listener => {
      listener()
    })

    return action
  }

  function getState() {
    return currentState
  }

  dispatch({type: '@@redux/INIT'} as A)

  const store = {
    dispatch: dispatch as Dispatch<A>,
    subscribe,
    getState,
  } as Store
  return store
}
