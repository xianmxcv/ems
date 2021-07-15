import { AppState } from '@/redux/reducers'
import api from '@/service/api'
import { mqttPort, mqttUrl, username, password } from '@/service/api.config'
import { INodePlatformType } from '@/types/common'
import { Uint8ArrayToString } from '@/utils/common'
import { takeAsyncAction } from '@/utils/saga'
import { message, Modal } from 'antd'
import mqtt, { MqttClient } from 'mqtt'
import { push } from 'react-router-redux'
import { eventChannel, SagaIterator } from 'redux-saga'
import { takeEvery, put, select, call, take } from 'redux-saga/effects'
import { actions, asyncActions } from './action'

function* initMqtt(): SagaIterator {
  let hadclient = yield select((state: AppState) => state.common.client)
  if (hadclient) {
    return
  }
  const path = mqttUrl
  const port = mqttPort

  const clientId =
    sessionStorage.getItem('userAccount') +
    'clientid_' +
    Math.floor(Math.random() * 65535) +
    new Date().getTime()
  const client = mqtt.connect(`${path}:${port}/ws`, {
    clientId,
    clean: true,
    keepalive: 30,
    username,
    password,
    connectTimeout: 30 * 1000,
    reconnectPeriod: 10 * 1000,
  })
  yield put(actions.connectMqtt(client))

  console.log('连接成功')

  const channel: any = yield call(subscribeMessage, { client })
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}

// 登陆互踢
function* subscribeMessage({ client }: { client: MqttClient }): SagaIterator {
  const topicKey = yield select((state: AppState) => state.common.topicKey)

  return eventChannel((emitter): any => {
    // 订阅消息
    console.log('开始登陆订阅')
    client.subscribe(`/v1/portal/offline/${topicKey}`, { qos: 1 }, (err) => {
      if (!err) {
        console.log('登陆订阅成功', 'topicKey', topicKey)
        client.publish(
          `/v1/portal/login/${topicKey}`,
          JSON.stringify({ systemSource: INodePlatformType.EMS }),
          {
            qos: 1,
          }
        )
      }
    })

    // 接收消息
    client.on('message', (resptopic, message: any) => {
      console.log('登陆接收消息', resptopic, `/v1/portal/offline/${topicKey}`)
      if (resptopic.includes('/v1/portal/offline')) {
        if (typeof message === 'object') {
          emitter(actions.offline(Uint8ArrayToString(message)))
        }
      }
    })

    // 连接错误，断开
    client.on('error', (err) => {
      message.error('mqtt连接异常,请重新尝试')
      client.end()
    })
    return () => {}
  })
}
// 登出
function* logout(): SagaIterator {
  const topicKey = yield select((state: AppState) => state.common.topicKey)
  const client = yield select((state: AppState) => state.common.client)
  if (!client) {
    return
  }
  client.unsubscribe(`/v1/portal/offline/${topicKey}`)
  client.end()
  console.log('断开mqtt')
  sessionStorage.clear()
  yield put(actions.clearMqtt())
  yield put(push('/login'))
}

// 被踢下线
function* offline(params: any): SagaIterator {
  console.log('offline', params)
  const client = yield select((state: AppState) => state.common.client)
  if (!client) {
    return
  }
  console.log('被踢下线', 'clientId', client.options.clientId)
  const topicKey = yield select((state: AppState) => state.common.topicKey)
  client.unsubscribe(`/v1/portal/offline/${topicKey}`)
  client.end()
  Modal.warning({
    title: '提示',
    content: params.payload,
    okText: '确认',
  })
  yield put(push('/login'))
  yield put(actions.clearMqtt())
}

function* closeMqtt(): SagaIterator {
  const client = yield select((state: AppState) => state.common.client)
  if (!client) {
    return
  }
  console.log('closeMqtt', client.options.clientId)
  const topicKey = yield select((state: AppState) => state.common.topicKey)
  client.unsubscribe(`/v1/portal/offline/${topicKey}`)
  client.end()
  yield put(push('/login'))
}

function* gotoLogin(): SagaIterator {
  yield put(push('/login'))
}

function* gotoPage(params: any): SagaIterator {
  yield put(push(params.payload.params))
}

export function* rootSaga(): SagaIterator {
  yield takeEvery(actions.initMqtt, initMqtt)
  yield takeEvery(actions.offline, offline)
  yield takeEvery(actions.logout, logout)
  yield takeEvery(actions.closeMqtt, closeMqtt)
  yield takeAsyncAction(actions.getMenus, asyncActions.asyncGetMenus, api.getUserMenu)
  yield takeEvery(asyncActions.asyncGetMenus.failed, gotoLogin)
  yield takeEvery(asyncActions.asyncGetMenus.done, gotoPage)
}
