import { IResUserMenu } from '@/types/resType'
import mqtt from 'mqtt'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { actions, asyncActions } from './action'

export interface ICommonState {
  isCache: boolean
  client?: mqtt.MqttClient
  topicKey?: string
  urlSeg: string
  cacheData?: any // 缓存queryparams等table的筛选信息和编辑时保存的id信息
  formChange: boolean
  menuLoading: boolean
  menus: IResUserMenu[]
}

const INITIAL_STATE: ICommonState = {
  isCache: false,
  urlSeg: '',
  formChange: false,
  menuLoading: false,
  menus: [],
}

export const reducer = reducerWithInitialState(INITIAL_STATE)
  .case(actions.clearCache, (state, payload) => {
    return { ...state, isCache: payload }
  })
  .case(actions.connectMqtt, (state, payload) => {
    return {
      ...state,
      client: payload,
      topicKey: `${sessionStorage.getItem('userAccount') + '' + new Date().getTime()}`,
    }
  })
  .case(actions.clearMqtt, (state) => {
    return {
      ...state,
      client: undefined,
      topicKey: '',
    }
  })
  .case(actions.setUrlSeg, (state, payload) => {
    return {
      ...state,
      urlSeg: payload,
    }
  })
  .case(actions.setCacheParams, (state, payload) => {
    return {
      ...state,
      cacheData: payload,
    }
  })
  .case(actions.clearCacheParams, (state, payload) => {
    return {
      ...state,
      cacheData: undefined,
    }
  })
  .case(actions.formChange, (state, payload) => {
    return { ...state, formChange: payload }
  })
  .case(asyncActions.asyncGetMenus.started, (state) => {
    return { ...state, menuLoading: true }
  })
  .case(asyncActions.asyncGetMenus.done, (state, payload) => {
    return { ...state, menus: payload.result, menuLoading: false }
  })
  .case(asyncActions.asyncGetMenus.failed, (state) => {
    return { ...state, menuLoading: false }
  })
