import { Tabs } from 'antd'
import React from 'react'
import styles from '../index.module.less'
import AmmeterComponent from './AmmeterComponent/AmmeterListComponent'
// import AmmeterComponent from './AmmeterComponent/index'
// import AmmeterListComponent from './AmmeterListComponent'
import EnergyConsumptionComponent from './EnergyConsumptionComponent'
import TransformerComponent from './TransformerComponent'

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
      <TabPane tab="电表信息" key="2">
        <AmmeterComponent checkedKeys={props.checkedKeys} />
      </TabPane>
      <TabPane tab="上挂变压器" key="3">
        <TransformerComponent checkedKeys={props.checkedKeys} />
      </TabPane>
    </Tabs>
  )
}

export default TableComponents
