import { ITreeData } from '@/types/resType'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { round } from 'lodash-es'

export const getClientHeight = () => {
  return document.body.clientHeight
}

export const pageSize = getClientHeight() > 850 ? 20 : 15

export const tableFilter = <T>(args: T): Array<{ text: string; value: string }> => {
  return Object.entries(args).map((item) => ({ text: item[1], value: item[0] }))
}

export const tableDateFormat = (args: string, format?: string): string => {
  return args
    ? format
      ? dayjs(args).format(format)
      : dayjs(args).format('YYYY-MM-DD HH:mm:ss')
    : ''
}

export const Uint8ArrayToString = (message: Buffer) => {
  const dataString = message.toString()
  return JSON.parse(dataString)
}
export const formatHms = (data: number) => {
  const d = dayjs(data)
  const hours = Math.floor(d.hour())
  const mins = Math.floor(d.minute()) - hours * 60
  const ss = Math.floor(d.second()) - hours * 60 * 60 - mins * 60
  return `${data < 0 ? '-' : ''}${hours > 9 ? hours : `0${hours}`}时${
    mins > 9 ? mins : `0${mins}`
  }分${ss > 9 ? ss : `0${ss}`}秒`
}

export const setCookie = (str: string) => {
  let Days = 30
  let exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 30)
  document.cookie = 'account' + '=' + escape(str) + ';expires=' + exp.toUTCString()
}

export const getCookie = () => {
  let arr,
    reg = new RegExp('(^| )' + 'account' + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return unescape(arr[2])
  else return null
}
export const transformTree = (source: ITreeData[]) => {
  let data: ITreeData[] = []
  // fullLinkKey
  const treeIterate = (treeData: ITreeData[], parentKey?: string) => {
    treeData.forEach((el) => {
      el.fullLinkKey = `${parentKey || ''},${el.key}`
      data.push(el)
      el.children && el.children.length > 0 ? treeIterate(el.children, el.fullLinkKey) : '' // 子级递归
    })
  }
  treeIterate(source)
  return data
}
export const transformTree1 = (source: ITreeData[]) => {
  let data: ITreeData[] = []
  // fullLinkKey
  const treeIterate = (treeData: ITreeData[], parentKey?: string) => {
    treeData.forEach((el) => {
      el.fullLinkKey = `${parentKey || ''},${el.key}`
      el.disabled = isEmpty(el.children) ? false : true
      data.push(el)
      el.children && el.children.length > 0 ? treeIterate(el.children, el.fullLinkKey) : '' // 子级递归
    })
  }
  treeIterate(source)
  return data
}
export const getTreeIds = (source: ITreeData[] = []) => {
  const data: string[] = []
  const treeIterate = (treeData: ITreeData[]) => {
    treeData.forEach((el) => {
      data.push(el.key)
      el.children && el.children.length > 0 ? treeIterate(el.children) : [] // 子级递归
    })
  }
  treeIterate(source)
  return data
}
export const formatNum = (num: number) => {
  if (num > 10000000) {
    return `${round(num / 10000000, 2)}千万`
  } else if (num > 10000) {
    return `${round(num / 10000, 2)}万`
  }
  return `${num}`
}
