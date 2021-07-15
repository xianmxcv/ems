import { ICommonState, reducer as commonReducer } from '@/common/reducer'
import { IMeterState, reducer as meterReducer } from '@/views/meter_reading/realtime/reducer'

import { combineReducers } from 'redux'

export interface AppState {
  common: ICommonState
  meterState: IMeterState
}

export default combineReducers<AppState>({
  common: commonReducer,
  meterState: meterReducer,
})
