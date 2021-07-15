import { ElectricMeterHistory } from '@/types/reqType'
import { IPageResponse } from '@/types/resType'
import mqtt from 'mqtt'
import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('common')

export enum TypeKeys {
  SUB_METER_LIST = 'SUB_METER_LIST',
  LIST_MQTT_MESSAGE = 'LIST_MQTT_MESSAGE',
  GET_LIST = 'GET_LIST',
  UPDATE_LIST = 'UPDATE_LIST',
  UPDATE_TOPICKY = 'UPDATE_TOPICKY',
  GET_SUB_METER = 'GET_SUB_METER',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export const actions = {
  subMeterList: actionCreator<any>(TypeKeys.SUB_METER_LIST),
  getList: actionCreator<any>(TypeKeys.GET_LIST),
  updateList: actionCreator<any>(TypeKeys.UPDATE_LIST),
  updateTopicky: actionCreator<any>(TypeKeys.UPDATE_TOPICKY),
  getSubMeterList: actionCreator<any>(TypeKeys.GET_SUB_METER),
  unsubscribe: actionCreator(TypeKeys.UNSUBSCRIBE),
  // 接受mqtt推送的列表消息
  listMqttMessage: actionCreator<IPageResponse<ElectricMeterHistory>>(TypeKeys.LIST_MQTT_MESSAGE),
}
export const asyncActions = {
  getList: actionCreator.async<ElectricMeterHistory, IPageResponse<ElectricMeterHistory>, null>(
    TypeKeys.LIST_MQTT_MESSAGE
  ),
  // getSubMeterList: actionCreator.async<any, IPageResponse<ElectricMeterHistory>, null>(
  //   TypeKeys.GET_SUB_METER
  // ),
}
