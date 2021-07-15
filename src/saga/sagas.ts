import { rootSaga as commonSaga } from '@/common/saga'
import { rootSaga as meterSaga } from '@/views/meter_reading/realtime/saga.saga'
import { all, fork } from 'redux-saga/effects'

export default function* AppSaga() {
  yield all([fork(commonSaga)])
  yield all([fork(meterSaga)])
}
