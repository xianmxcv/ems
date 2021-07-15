import { actions } from '@/common/action'
import { ConfigProvider, message, Spin } from 'antd'
// import enUS from 'antd/es/locale/en_US'
import zhCN from 'antd/es/locale/zh_CN'
import dayjs from 'dayjs'
import React, { Suspense, useEffect } from 'react'
import { connect, Provider } from 'react-redux'
import { Redirect, Switch, Route, HashRouter as Router } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import MainLayout from './layout/MainLayout'
import { AppState } from './redux/reducers'
import { IResUserMenu } from './types/resType'
import login from './views/passport/login'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
interface IProps {
  store: any
}

message.config({
  top: 100,
  duration: 2,
  maxCount: 1,
  rtl: true,
})

interface IPropsDispatch {
  actions: {
    getMenus: typeof actions.getMenus
    closeMqtt: typeof actions.closeMqtt
    initMqtt: typeof actions.initMqtt
  }
}

interface IStateProps {
  menus: IResUserMenu[]
}

const App = (props: IProps & IPropsDispatch & IStateProps) => {
  window.onbeforeunload = () => {
    let token = sessionStorage.getItem('Authorization')
    if (!token) {
      return
    }
    props.actions.closeMqtt()
  }

  useEffect(() => {
    let token = sessionStorage.getItem('Authorization') || localStorage.getItem('Authorization')
    const hash = window.location.hash
    if (hash === '#/') {
      window.location.href = '#/login'
      return
    }
    if (!token || hash.includes('login')) {
      return
    }
    props.actions.getMenus(hash.split('#')[1])
  }, [props.actions])

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('login')) {
      return
    }
    if (props.menus.length) {
      props.actions.initMqtt()
    }
  }, [props.actions, props.menus])

  return (
    <div className="App" style={{ height: '100%' }}>
      <Provider store={props.store}>
        <ConfigProvider locale={zhCN}>
          <Router>
            <Suspense fallback={<Spin spinning className="suspenseSpin" />}>
              <Switch>
                <Route path="/login" component={login} />
                {props.menus.length ? <Route path="/main" component={MainLayout} /> : null}
              </Switch>
            </Suspense>
          </Router>
        </ConfigProvider>
      </Provider>
    </div>
  )
}

export default connect(
  (state: AppState) => {
    return {
      menus: state.common.menus,
    }
  },
  (dispatch) => {
    return {
      actions: bindActionCreators(
        { getMenus: actions.getMenus, closeMqtt: actions.closeMqtt, initMqtt: actions.initMqtt },
        dispatch
      ),
    }
  }
)(App)
