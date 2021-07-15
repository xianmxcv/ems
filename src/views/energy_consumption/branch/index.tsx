import TreeComponent from '@/component/showTree'
import api from '@/service/api'
import { ITreeData } from '@/types/resType'
import { transformTree } from '@/utils/common'
import { Col, Divider, message, Row, Spin, Tabs } from 'antd'
import { findIndex } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import Compare from './component/Compare'
import ConsumptionRank from './component/ConsumptionRank'
import RatePeriod from './component/RatePeriod'
import Statistics from './component/Statistics'
import styles from './index.module.less'
const { TabPane } = Tabs
const Branch = () => {
  const [treeData, setTreeData] = useState<Array<ITreeData>>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [defaultExpandId, setDefaultExpandId] = useState<React.Key>('')
  const [loading, setLoading] = useState<boolean>(true)
  const getList = useCallback(async () => {
    try {
      const { data = [] } = await api.getBranchEnergyConsumptionList()
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
  }, [])
  useEffect(() => {
    getList()
  }, [getList])

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
          <Col>支路能耗名称</Col>
        </Row>
        <div style={{ padding: `0 12px` }}>
          <TreeComponent
            placeholder="支路名称"
            isSearch={true}
            checkable
            selectable={false}
            defaultExpandId={defaultExpandId}
            checkedKeys={checkedKeys}
            treeData={treeData}
            onCheck={onCheck}
          />
        </div>
      </Col>
      <Divider type="vertical" className={styles.divider} />
      <Col className={styles.TableComponents} style={{ padding: `0 12px` }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="支路能耗统计" key="1">
            {loading ? null : <Statistics checkedKeys={checkedKeys} />}
          </TabPane>
          <TabPane tab="支路能耗环比同比统计" key="2">
            <Compare checkedKeys={checkedKeys} />
          </TabPane>
          <TabPane tab="支路能耗排序统计" key="3">
            <ConsumptionRank checkedKeys={checkedKeys} />
          </TabPane>
          <TabPane tab="支路费率时段统计" key="4">
            <RatePeriod checkedKeys={checkedKeys} />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}

export default Branch
