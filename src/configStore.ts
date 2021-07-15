import reducers, { AppState } from '@/redux/reducers'
import { routerMiddleware } from 'react-router-redux'
import { applyMiddleware, compose, createStore, StoreEnhancer } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import AppSaga from './saga/sagas'
// eslint-disable-next-line import/order
const createHistory = require('history').createHashHistory

export const history = createHistory()

const sagaMiddleware = createSagaMiddleware()
const routerReduxMiddleware = routerMiddleware(history)

const middlewares = [sagaMiddleware, routerReduxMiddleware]

let enhancer: StoreEnhancer

if (process.env.NODE_ENV === 'development') {
  enhancer = composeWithDevTools(applyMiddleware(...middlewares))
}

if (process.env.NODE_ENV === 'production') {
  enhancer = compose(applyMiddleware(...middlewares))
}

export default function configureStore() {
  const store = createStore<AppState, any, any, any>(reducers, enhancer)
  sagaMiddleware.run(AppSaga)
  return store
}
