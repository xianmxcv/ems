import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import App from '@/App'
// import initMock from '@/service/mock.config'
import React from 'react'
import ReactDOM from 'react-dom'
import configStore from './configStore'

import '@/styles/index.less'
import '@/assets/iconfont/iconfont.css'
import '@/styles/animate.less'

// initMock()
const store = configStore()
ReactDOM.render(<App store={store} />, document.getElementById('root'))
