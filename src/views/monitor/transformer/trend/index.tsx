import { ITransformer } from '@/types/resType'
import { DatePicker, Tabs } from 'antd'
import { Moment } from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'
import React, { useContext, useState } from 'react'
import { ParmasContext } from '..'
import RealTimeElectric from './RealTimeElectric'
import RealTimePower from './RealTimePower'
import styles from './index.module.less'

const { RangePicker } = DatePicker

const { TabPane } = Tabs

const TransformerTrend = ({ selected }: { selected?: ITransformer }) => {
  const [dates, setDates] = useState<RangeValue<Moment>>()
  const [activeKey, setActiveKey] = useState('1')

  const onDateChange = (value: RangeValue<Moment>) => {
    setDates(value)
  }

  const getRangePicker = (
    <div style={{ textAlign: 'right', marginBottom: 10 }}>
      <span>日期范围:</span>
      <RangePicker value={dates} onChange={onDateChange} style={{ margin: '0 20px' }} showNow />
    </div>
  )

  const onTabsChange = (key: string) => {
    setActiveKey(key)
    setDates(undefined)
  }

  return (
    <div className={styles.container}>
      <div>
        <Tabs
          onChange={onTabsChange}
          tabBarExtraContent={<div className={styles.title}>数据趋势</div>}
        >
          <TabPane tab="功率实时趋势" key="1">
            {getRangePicker}
            {activeKey === '1' && <RealTimePower dates={dates} selected={selected} />}
          </TabPane>
          <TabPane tab="电流实时趋势" key="2">
            {getRangePicker}
            {activeKey === '2' && <RealTimeElectric dates={dates} selected={selected} />}
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default TransformerTrend
