import sslsJson from '@/assets/topology/monitor/ssls.json'
import {
  activityFinal,
  activityFinalIconRect,
  activityFinalTextRect,
} from '@topology/activity-diagram'
import { Topology } from '@topology/core'
import { registerNode } from '@topology/core'
import React, { useEffect } from 'react'
import styles from './index.module.less'

let canvas: Topology | undefined

const canvasOptions = {
  rotateCursor: '/rotate.cur',
  width: 1600,
  height: 800,
}

const PowerMonitor = () => {
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
    canvasRegister()
    canvas = new Topology('topology-canvas-ssls', canvasOptions)

    if (!canvas) {
      return
    }

    let pens: any[] = sslsJson.pens.map((item: any) => {
      return {
        ...item,
        image: require(`@/assets/images/topology/ssls.png`).default,
      }
    })

    canvas?.open({ ...sslsJson, pens })
    canvas.resize()
    canvas?.lock(1)
  }, [])

  return (
    <div
      className={styles.traffic}
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <div
        id="topology-canvas-ssls"
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  )
}

export default PowerMonitor
