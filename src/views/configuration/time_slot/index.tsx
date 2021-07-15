import { Tabs } from 'antd'
import React from 'react'
import NoWorkDayComponent from './NoWorkDayComponent'
import RateComponent from './RateComponent'

const { TabPane } = Tabs

const TimeSlot = () => {
  return (
    <Tabs defaultActiveKey="1" style={{ padding: 12 }}>
      <TabPane tab="费率时段维护" key="1">
        <RateComponent />
      </TabPane>
      <TabPane tab="非工作日维护" key="2">
        <NoWorkDayComponent />
      </TabPane>
    </Tabs>
  )
}

export default TimeSlot
