import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import upgradeDevList from './mockData/upgrade/devlist.json'
import things from './mockData/upgrade/things.json'
import versions from './mockData/upgrade/versions.json'

const mock = new MockAdapter(axios, { delayResponse: 2000 })

const initMock = () => {
  mock.onGet('/login').reply(200, {
    result: true,
    data: [{ id: '111111', name: 'admin' }],
  })

  // 固件升级
  mock.onGet('eca/thing/page').reply(200, upgradeDevList)
  // 实例列表
  mock.onGet('eca/thing').reply(200, things)
  // 版本列表
  mock.onGet('/eca/thing/version/1').reply(200, versions)
}

export default initMock
