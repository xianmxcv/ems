import { Tabs } from 'antd'
import React from 'react'
import styles from '../index.module.less'
import EnergyConsumptionComponent from './EnergyConsumptionComponent'
import NoWorkDayComponent from './NoWorkDayComponent'

const { TabPane } = Tabs
interface Iprops {
  checkedKeys: any
}

const TableComponents = (props: Iprops) => {
  return (
    <Tabs defaultActiveKey="1" className={styles.operate_button}>
      <TabPane tab="重点耗能设备" key="1">
        <EnergyConsumptionComponent checkedKeys={props.checkedKeys} />
      </TabPane>
      <TabPane tab="非工作日时间" key="2">
        <NoWorkDayComponent checkedKeys={props.checkedKeys} />
      </TabPane>
    </Tabs>
  )
}

export default TableComponents
