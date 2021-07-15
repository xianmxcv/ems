import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import BranchConsumption from './component/BranchConsumption'
import DeviceInfoItem from './component/DeviceInfoItem'
import ElectricityConsumption from './component/ElectricityConsumption'
import EnergyConsumption from './component/EnergyConsumption'
import SubItem from './component/SubItem'
import styles from './index.module.less'
const Dashboard = () => {
  return (
    <div
      className={styles.dashboard}
      style={{
        width: `${100}%`,
        height: `${100}%`,
      }}
    >
      <Row gutter={16} style={{ height: '50%', width: '100%' }}>
        <Col span={8}>
          <DeviceInfoItem />
        </Col>
        <Col span={8}>
          <EnergyConsumption />
        </Col>
        <Col span={8}>
          <SubItem />
        </Col>
      </Row>
      <Row
        gutter={16}
        style={{
          // height: 'calc(50% - 20px)',
          height: '50%',
          width: '100%',
        }}
      >
        <Col span={16} style={{ maxHeight: '100%' }}>
          <ElectricityConsumption />
        </Col>
        <Col span={8} style={{ maxHeight: '100%' }}>
          <BranchConsumption />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
