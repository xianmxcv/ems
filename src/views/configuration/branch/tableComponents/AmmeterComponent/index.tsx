import { Row } from 'antd'
import React from 'react'
import AmmeterListComponent from './AmmeterListComponent'
interface Iprops {
  checkedKeys: any
}

const AmmeterComponent = (props: Iprops) => {
  return (
    <Row style={{ maxWidth: '100%' }}>
      <AmmeterListComponent checkedKeys={props.checkedKeys} />
    </Row>
  )
}

export default AmmeterComponent
