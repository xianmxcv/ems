import { IResUserMenu } from '@/types/resType'
import mqtt from 'mqtt'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('common')

export enum TypeKeys {
  CLEAR_CACHE = 'CLEAR_CACHE',
  INIT_MQTT = 'INIT_MQTT',
  CONNECT_MQTT = 'CONNECT_MQTT',
  OFFLINE = 'OFFLINE',
  LOGOUT = 'LOGOUT',
  CLEARMQTT = 'CLEARMQTT',
  SET_URL_SEG = 'SET_URL_SEG',
  CLOSE_MQTT = 'CLOSE_MQTT',
  SET_CACHE_PARAMS = 'SET_CACHE_PARAMS',
  CLEAR_CACHE_PARAMS = 'CLEAR_CACHE_PARAMS',
  FORM_CHANGE = 'FORM_CHANGE', // 表单变化（主要用于在离开编辑页面时提醒没有保存数据）
  GET_MENUS = 'GET_MENUS',
  ASYNC_GET_MENUS = 'ASYNC_GET_MENUS',
}

export const actions = {
  clearCache: actionCreator<boolean>(TypeKeys.CLEAR_CACHE),
  initMqtt: actionCreator(TypeKeys.INIT_MQTT),
  connectMqtt: actionCreator<mqtt.MqttClient>(TypeKeys.CONNECT_MQTT),
  offline: actionCreator<string>(TypeKeys.OFFLINE),
  logout: actionCreator(TypeKeys.LOGOUT),
  clearMqtt: actionCreator(TypeKeys.CLEARMQTT),
  setUrlSeg: actionCreator<string>(TypeKeys.SET_URL_SEG),
  closeMqtt: actionCreator(TypeKeys.CLOSE_MQTT),
  setCacheParams: actionCreator<{ [T in string]: any }>(TypeKeys.SET_CACHE_PARAMS),
  clearCacheParams: actionCreator(TypeKeys.CLEAR_CACHE_PARAMS),
  formChange: actionCreator<boolean>(TypeKeys.FORM_CHANGE),
  getMenus: actionCreator<string>(TypeKeys.GET_MENUS),
}

export const asyncActions = {
  asyncGetMenus: actionCreator.async<null, IResUserMenu[], string>(TypeKeys.ASYNC_GET_MENUS),
}
