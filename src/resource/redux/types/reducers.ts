/** @format */

import {AnyAction} from './actions'

export type Reducer<S = any, A = AnyAction> = (state: S, action: A) => S
