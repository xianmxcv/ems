import { orderBy, unionBy } from 'lodash-es'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { actions, asyncActions } from './action'

export interface IMeterState {
  list: any
  total: number
  topicKey: string
}

const INITIAL_STATE: IMeterState = {
  topicKey: '',
  total: 0,
  list: [],
}

export const reducer = reducerWithInitialState(INITIAL_STATE)
  .case(actions.listMqttMessage, (state, payload) => {
    return {
      ...state,
      alarmList: payload.records,
      total: payload.total,
    }
  })
  .case(actions.updateTopicky, (state, payload) => {
    return {
      ...state,
      topicKey: payload.topicKey,
    }
  })
  .case(actions.getList, (state, payload: any) => {
    const list = unionBy(payload, state.list, 'attrName')
    return {
      ...state,
      list: orderBy(list, ['attrName'], ['asc']),
    }
  })
  .case(actions.updateList, (state, payload: any) => {
    return {
      ...state,
      list: [],
    }
  })
  .case(actions.getSubMeterList, (state, payload: any) => {
    return {
      ...state,
    }
  })
