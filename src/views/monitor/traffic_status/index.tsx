import peidianxiangJson from '@/assets/topology/trafficStatus/peidianxiang.json'
import api from '@/service/api'
import apiDatas from '@/service/mockData/topology/trafficStatus.json'
import { IThingStatus } from '@/types/common'
import { IRegionInfo, IResTrafficInfo } from '@/types/resType'
import { calcPoint, DevStatusColor } from '@/utils/calcPoint'
import {
  activityFinal,
  activityFinalIconRect,
  activityFinalTextRect,
} from '@topology/activity-diagram'
import { Topology } from '@topology/core'
import { registerNode } from '@topology/core'
import { Cascader, message } from 'antd'
import { CascaderValueType } from 'antd/lib/cascader'
import React, { useEffect } from 'react'
import { useState } from 'react'
import styles from './index.module.less'

let canvas: Topology | undefined

const canvasOptions = {
  rotateCursor: '/rotate.cur',
}

const sequence = sessionStorage.getItem('userAccount') + '' + new Date().getTime()

const TrafficStatusMonitor = () => {
  const [regionIds, setRegionIds] = useState<CascaderValueType>([])
  const [options, setOptions] = useState<IRegionInfo[]>([])

  const canvasRegister = () => {
    registerNode(
      'activityFinal',
      activityFinal,
      undefined,
      activityFinalIconRect,
      activityFinalTextRect
    )
  }

  useEffect(() => {
    const getRegionData = async () => {
      try {
        const res = await api.getRegionData()
        if (res && res.data) {
          setOptions(res.data)
          if (res.data.length) {
            const defaultRegionId = [res.data[0].value]
            setRegionIds(defaultRegionId)
          }
        }
      } catch (err) {
        message.error(err)
      }
    }
    getRegionData()
  }, [])

  useEffect(() => {
    canvasRegister()
    canvas = new Topology('topology-canvas-preview', canvasOptions)

    canvas.lock(1)
    if (!regionIds.length) {
      return
    }
    const getTrafficStatusData = async () => {
      if (!canvas) {
        return
      }
      try {
        const rId = regionIds[regionIds.length - 1] as string
        const res = await api.getTrafficStatusData(rId, sequence)
        if (res) {
          const previewDatas = calcPoint(res.data)
          console.log(previewDatas)
          canvas?.open(previewDatas)
          canvas?.lock(1)
        }
      } catch (err) {
        message.error(err)
        let pens: any[] = peidianxiangJson.pens.map((item: any) => {
          return {
            ...item,
            image:
              item.imageName && require(`@/assets/images/topology/${item.imageName}.svg`).default,
          }
        })
        canvas.open({ ...peidianxiangJson, pens })
      }
    }
    getTrafficStatusData()
  }, [regionIds])

  useEffect(() => {
    if (canvas) {
      const {
        ems_monitor_mqttUrl,
        ems_monitor_mqttPort,
        ems_monitor_mqttUsername,
        ems_monitor_mqttPassword,
      } = window as any

      const clientId =
        sessionStorage.getItem('userAccount') +
        'clientid_' +
        Math.floor(Math.random() * 65535) +
        new Date().getTime()

      canvas.data = {
        ...canvas.data,
        mqttUrl: `${ems_monitor_mqttUrl}:${ems_monitor_mqttPort}/ws`,
        mqttTopics: `/v1/portal/ems/thing/collect/status/${sequence}`,
      }

      canvas.openMqtt(`${ems_monitor_mqttUrl}:${ems_monitor_mqttPort}/ws`, {
        mqttTopics: `/v1/portal/ems/thing/collect/status/${sequence}`,
        clientId: clientId,
        username: ems_monitor_mqttUsername,
        password: ems_monitor_mqttPassword,
        keepalive: 30,
        connectTimeout: 30 * 1000,
        reconnectPeriod: 20 * 1000,
      })
      console.log(`/v1/portal/ems/thing/collect/status/${sequence}`)
      canvas.data.socketEvent = true
      canvas.on('mqtt', (e) => {
        const str = e.message.toString()
        try {
          const data = JSON.parse(str)
          // if (data.tag.includes('bianyuanwangguan')) {
          //   canvas.setValue(data.tag, {
          //     image: data.text
          //       ? require(`@/assets/images/topology/bianyuanwangguan.svg`).default
          //       : require(`@/assets/images/topology/bianyuanwangguan_red.svg`).default,
          //   })
          // } else if (data.tag.includes('peidianxiang')) {
          //   canvas.setValue(data.tag, {
          //     image: data.text
          //       ? require(`@/assets/images/topology/peidianxiang.svg`).default
          //       : require(`@/assets/images/topology/peidianxiang_red.svg`).default,
          //   })
          // } else
          // if (data.tag.includes('devicesIndex')) {
          canvas?.setValue(data.tag, {
            fillStyle:
              data.status === IThingStatus.NORMAL
                ? DevStatusColor.normal
                : data.status === IThingStatus.EXCEPTION
                ? DevStatusColor.exception
                : DevStatusColor.timeout,
          })
          // }
          // else {
          //   canvas.setValue(data.tag, {
          //     text: data.text,
          //   })
          // }
          console.log(str, new Date().getTime(), 'mqtt', canvas)
        } catch (err) {
          message.error(err)
        }
      })
    }
    return () => {
      if (canvas) {
        canvas.data.socketEvent = false
        canvas.closeMqtt()
        canvas.destroy()
        canvas = undefined
      }
    }
  }, [])

  function onChange(value: CascaderValueType) {
    console.log(value)

    setRegionIds(value)
  }

  return (
    <div
      className={styles.traffic}
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <div
        id="topology-canvas-preview"
        style={{
          height: '100%',
          width: '100%',
        }}
      />
      <div className={styles.cascader}>
        <Cascader
          options={options}
          onChange={onChange}
          changeOnSelect
          value={regionIds}
          placeholder="请选择区域"
          allowClear={false}
          style={{ width: 300 }}
        />
      </div>
    </div>
  )
}

export default TrafficStatusMonitor
