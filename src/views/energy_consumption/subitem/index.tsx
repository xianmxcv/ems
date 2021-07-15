import TreeComponent from '@/component/showTree'
import api from '@/service/api'
import { ITreeData } from '@/types/resType'
import { transformTree } from '@/utils/common'
import { Col, Divider, message, Row, Tabs } from 'antd'
import { findIndex, pull } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import Compare from './component/Compare'
import ConsumptionRank from './component/ConsumptionRank'
import RatePeriod from './component/RatePeriod'
import Statistics from './component/Statistics'
import styles from './index.module.less'
const { TabPane } = Tabs
const Subitem = () => {
  const [treeData, setTreeData] = useState<Array<ITreeData>>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [defaultExpandId, setDefaultExpandId] = useState<React.Key>('')
  const [loading, setLoading] = useState<boolean>(true)
  const getList = async () => {
    try {
      const { data = [] } = await api.getReportItemTree()
      let treeIteratedData = transformTree(data)
      let index = findIndex(treeIteratedData, ['disabled', false])
      if (index >= 0) {
        setCheckedKeys([treeIteratedData[index].key])
        setDefaultExpandId(treeIteratedData[index].fullLinkKey || '')
      } else {
        setCheckedKeys([])
      }
      setTreeData(data)
    } catch (error) {
      message.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getList()
  }, [])

  const onCheck = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys)
  }

  return (
    <Row className={styles.region}>
      <Col className={styles.tree}>
        <Row
          align="middle"
          justify="space-between"
          style={{ padding: 16, backgroundColor: 'rgba(249, 249, 249, 1)', marginBottom: 12 }}
        >
          <Col>分项能耗名称</Col>
        </Row>
        <div style={{ padding: `0 12px` }}>
          <TreeComponent
            placeholder="分项名称"
            isSearch={true}
            checkable
            selectable={false}
            checkedKeys={checkedKeys}
            defaultExpandId={defaultExpandId}
            treeData={treeData}
            onCheck={onCheck}
          />
        </div>
      </Col>
      <Divider type="vertical" className={styles.divider} />
      <Col className={styles.TableComponents} style={{ padding: `0 12px` }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="分项能耗统计" key="1">
            {loading ? null : <Statistics checkedKeys={pull(checkedKeys, '-1')} />}
          </TabPane>
          <TabPane tab="分项能耗环比同比统计" key="2">
            <Compare checkedKeys={pull(checkedKeys, '-1')} />
          </TabPane>
          <TabPane tab="分项能耗排序统计" key="3">
            <ConsumptionRank checkedKeys={pull(checkedKeys, '-1')} />
          </TabPane>
          <TabPane tab="分项费率时段统计" key="4">
            <RatePeriod checkedKeys={pull(checkedKeys, '-1')} />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}

export default Subitem
