import { Tabs } from 'antd'
import React from 'react'
import AmMeter from './ammeter'
import GasMeter from './gasmeter'
import styles from './index.module.less'
import WaterMeter from './watermeter'

const { TabPane } = Tabs

const ManualInput = () => {
  return (
    <div className={styles.container} style={{ padding: 10 }}>
      <Tabs defaultActiveKey="1" className={styles.tabs}>
        <TabPane tab="耗电抄表" key="1">
          <AmMeter />
        </TabPane>
        <TabPane tab="耗水抄表" key="2">
          <WaterMeter />
        </TabPane>
        <TabPane tab="燃气抄表" key="3">
          <GasMeter />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default ManualInput
