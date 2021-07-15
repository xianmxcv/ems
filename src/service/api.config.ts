import { IResponse } from '@/types/resType'
import { message, Modal } from 'antd'
import { AxiosRequestConfig } from 'axios'
import api from './api'

const baseURL = ''
export const mqttUrl = (window as any).ems_mqttUrl
export const mqttPort = (window as any).ems_mqttPort
export const username = (window as any).ems_mqttUsername
export const password = (window as any).ems_mqttPassword

export const user = 'admin'
let timeout: any
function transformResponse(response: IResponse<any>) {
  //判断是否超时

  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(function () {
    api.logOut()
    Modal.warning({
      title: '提示',
      content: '长时间未操作，你已下线！',
      okText: '确认',
    })
    window.location.href = '#/login'
    window.location.reload()
  }, 1000 * 60 * 30)

  if (response && response.code === '000000') {
    return response.data
  } else if (response && response.code === '080001') {
    api.logOut()
    message.error(response.mesg)
    window.location.href = '#/login'
    throw new Error(response.mesg + '\n' + (response.data ? response.data : ''))
  } else if (response) {
    throw new Error(response.mesg + '\n' + (response.data ? response.data : ''))
  } else {
    throw new Error('连接异常')
  }
}

const baseConfig: AxiosRequestConfig = {
  url: '',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  responseType: 'json',
  timeout: 30000,
}

// 租户、用户的启用禁用
export const commonConfig: AxiosRequestConfig = Object.assign(
  {},
  { ...baseConfig, baseURL: baseURL },
  {
    transformResponse: [transformResponse],
  }
)

// 租户、用户的启用禁用
export const testConfig: AxiosRequestConfig = Object.assign(
  {},
  {
    ...baseConfig,
    baseURL: baseURL,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    timeout: 30000,
  },
  {
    transformResponse: [transformResponse],
  }
)

// 默认form表单路由
export const uploadConfig = Object.assign(
  {},
  { ...baseConfig, baseURL: baseURL },
  {
    headers: { 'content-type': 'multipart/form-data' },
    timeout: 0, // no timeout
  },
  {
    transformResponse: [transformResponse],
  }
)
export const downloadConfig: any = Object.assign(
  {},
  { responseType: 'blob', Authorization: sessionStorage.getItem('Authorization') }
)
