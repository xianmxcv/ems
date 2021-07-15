import { AppState } from '@/redux/reducers'
import { Uint8ArrayToString } from '@/utils/common'
import { message } from 'antd'
import { MqttClient } from 'mqtt'
import { eventChannel, SagaIterator } from 'redux-saga'
import { takeEvery, put, select, call, take } from 'redux-saga/effects'
import { actions } from './action'

const url = '/v1/portal/electric/attr/data'

// 开始订阅
function* subMeterList({ res, client }: { res: any; client: MqttClient }): SagaIterator {
  const topicKey = yield select((state: AppState) => state.common.topicKey)
  const time = res.payload
  const urlSuffix = `${sessionStorage.getItem('userAccount')}${time}`

  return eventChannel((emitter): any => {
    // 订阅消息
    console.log('订阅消息', url, `${url}/${urlSuffix}`)
    client.subscribe(`${url}/${urlSuffix}`, { qos: 1 }, () => {})
    // 接收消息
    client.on('message', (resptopic, message: any) => {
      if (resptopic.includes(`${url}/${urlSuffix}`)) {
        console.log('实时数据接收消息', resptopic)
        if (typeof message === 'object') {
          try {
            const jsonMessage = Uint8ArrayToString(message)
            console.log('实时数据接收消息内容', jsonMessage)
            emitter(actions.getList(jsonMessage))
          } catch (error) {
            return error
          }
        }
      }
    })

    // 连接错误，断开
    client.on('error', () => {
      message.error('mqtt连接异常,请重新尝试')
      client.end()
    })
    return () => {}
  })
}
// 获取列表推送
function* getSubMeterList(res: any, e?: any): SagaIterator {
  const client = yield select((state: AppState) => state.common.client)
  if (!client) {
    return
  }
  const channel: any = yield call(subMeterList, { res, client })
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}
// 取消订阅
function* unsubscribe(): SagaIterator {
  const client = yield select((state: AppState) => state.common.client)
  const topicKey = yield select((state: AppState) => state.meterState.topicKey)
  if (!client) {
    return
  }
  const urlSuffix = `${sessionStorage.getItem('userAccount')}${topicKey}`
  console.log('取消订阅', `${url}/${urlSuffix}`)
  client.unsubscribe([`${url}/${urlSuffix}`])
}

export function* rootSaga(): SagaIterator {
  yield takeEvery(actions.getSubMeterList, getSubMeterList)
  yield takeEvery(actions.unsubscribe, unsubscribe)
}
