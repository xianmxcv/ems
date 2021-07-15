import api from '@/service/api'
import { message } from 'antd'

export const handleDownFile = (event: any, url: string) => {
  if (event.persist) {
    event.persist()
  }
  if (event.domEvent?.persist) {
    event.domEvent.persist()
  }
  return api
    .downloadFile(url)
    .then((res) => {
      try {
        const data = res.data
        let blob: any = new Blob([data])
        let fileName = res.headers['content-disposition']?.split('=')
        if (fileName) {
          fileName = fileName[fileName.length - 1]
          fileName = decodeURI(fileName.replace(/"/g, ''))
        }
        const selfURL = window[window.webkitURL ? 'webkitURL' : 'URL']
        let a = document.createElement('a')
        if ('download' in a) {
          a.download = fileName
          a.style.display = 'none'
          a.href = selfURL['createObjectURL'](blob)
          document.body.appendChild(a)
          // 触发链接
          a.click()
          selfURL.revokeObjectURL(a.href)
          document.body.removeChild(a)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
      } catch (err) {
        message.error(err)
      }
    })
    .catch((err) => {
      message.error(err)
    })
}
export const handleDownFilePost = (event: any, url: string, params: any) => {
  if (event.persist) {
    event.persist()
  }
  if (event.domEvent?.persist) {
    event.domEvent.persist()
  }
  return api
    .downloadFilePost(url, params)
    .then((res) => {
      try {
        const data = res.data
        let blob: any = new Blob([data])
        let fileName = res.headers['content-disposition']?.split('=')
        if (fileName) {
          fileName = fileName[fileName.length - 1]
          fileName = decodeURI(fileName.replace(/"/g, ''))
        }
        const selfURL = window[window.webkitURL ? 'webkitURL' : 'URL']
        let a = document.createElement('a')
        if ('download' in a) {
          a.download = fileName
          a.style.display = 'none'
          a.href = selfURL['createObjectURL'](blob)
          document.body.appendChild(a)
          // 触发链接
          a.click()
          selfURL.revokeObjectURL(a.href)
          document.body.removeChild(a)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
      } catch (err) {
        message.error(err)
      }
    })
    .catch((err) => {
      message.error(err)
    })
}
