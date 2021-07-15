import DianBiao from '@/assets/images/dianbiao.png'
import TreeComponent from '@/component/showTree'
import { AppState } from '@/redux/reducers'
import api from '@/service/api'
import { IelectricMeterTypeName } from '@/types/common'
import { IResElectricNameList, IResIElectricMeter } from '@/types/resType'
import { transformTree1 } from '@/utils/common'
import { actions } from '@/views/meter_reading/realtime/action'
import { Row, Col, Tabs, Divider, message } from 'antd'
import { findIndex, isEmpty, replace, trimEnd } from 'lodash-es'
import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HistoricalData from './HistoricalData'
import RealTimeData from './RealTimeData'
import styles from './index.module.less'
const { TabPane } = Tabs

const initElectric: IResIElectricMeter = {
  createdBy: '',
  createdTime: '',
  ecChainName: '',
  ecId: '',
  ecnNameStr: '',
  emCabinetCode: '',
  emCabinetName: '',
  emCode: '',
  emDesc: '',
  emId: '',
  emManufacturer: '',
  emModel: '',
  emName: '',
  emType: 1,
  thingId: '',
  updatedBy: '',
  regionName: '',
}
interface IPropsDispatch {
  actions: {
    getSubMeterList: typeof actions.getSubMeterList
    updateTopicky: typeof actions.updateTopicky
    updateList: typeof actions.updateList
    unsubscribe: typeof actions.unsubscribe
  }
}

const AutoAcquisition = (props: IPropsDispatch) => {
  const [treeData, setTreeData] = useState<IResElectricNameList[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [defaultExpandId, setDefaultExpandId] = useState<React.Key>('')
  const [ids, setIds] = useState<string>('')
  const [electric, setElectric] = useState<IResIElectricMeter>(initElectric)
  const [activeKey, setActiveKey] = useState<string>('1')
  function callback(key: string) {
    setActiveKey(key)
  }
  const getList = useCallback(async () => {
    try {
      const { data = [] } = await api.getElectricNameList({})
      let treeIteratedData = transformTree1(data)
      let index = findIndex(treeIteratedData, ['disabled', false])
      if (index >= 0) {
        setSelectedKeys([treeIteratedData[index].key])
        setIds(treeIteratedData[index].key)
        setDefaultExpandId(treeIteratedData[index].fullLinkKey || '')
      } else {
        setSelectedKeys([])
      }
      setTreeData(data)
    } catch (error) {
      message.error(error)
    }
  }, [])
  const onSelect = (checkedKeys: any, e: any) => {
    if (isEmpty(checkedKeys)) return
    const { node: { children = [] } = {} } = e
    if (!isEmpty(children)) return
    setSelectedKeys(checkedKeys)
    setIds(checkedKeys[0])
  }

  const getDetail = async (emId: string) => {
    if (!emId) return
    try {
      const res = await api.getElectricMeterDetailSingle({ emId })
      if (isEmpty(res.data)) {
        message.error('未查询到电表')
      }
      setElectric(res.data || initElectric)
    } catch (error) {
      message.error(error)
    }
  }

  useEffect(() => {
    getList()
  }, [getList])
  useEffect(() => {
    getDetail(ids)
  }, [ids])

  useEffect(() => {
    if (!ids) return
    props.actions.updateList([])
    const time = `${new Date().getTime()}`

    props.actions.updateTopicky({ topicKey: time })

    try {
      api
        .postElectricMeterRealtime({
          emId: ids,
          sequence: time,
        })
        .then(() => {
          props.actions.getSubMeterList(time)
        })
    } catch (error) {
      message.error(error)
    }
    return () => {
      props.actions.unsubscribe()
    }
  }, [props.actions, ids])

  return (
    <Row style={{ height: '100%' }}>
      <Col style={{ width: 300, height: '100%', overflow: 'auto' }}>
        <Row align="middle" style={{ padding: 16, backgroundColor: 'rgba(249, 249, 249, 1)' }}>
          电表名称选择
        </Row>
        <div style={{ padding: 12 }}>
          <TreeComponent
            // showLine={{ showLeafIcon: false }}
            placeholder="电表名称"
            isSearch={true}
            selectedKeys={selectedKeys}
            checkedKeys={selectedKeys}
            defaultExpandId={defaultExpandId}
            treeData={treeData}
            onSelect={onSelect}
          />
        </div>
      </Col>
      <Divider type="vertical" className={styles.auto_acquisition} />
      <Col
        style={{
          width: 'calc(100% - 306px)',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Row align="middle" style={{ padding: 16, backgroundColor: 'rgba(249, 249, 249, 1)' }}>
          电表基础信息
        </Row>
        <Row style={{ minHeight: 160, paddingTop: 24, fontSize: 14 }} justify="center">
          <Col span={6} style={{ textAlign: 'center' }}>
            <div>
              <img src={DianBiao} height="91px" alt="" />
            </div>
            <div
              style={{
                backgroundColor: 'rgba(92, 210, 217, 1)',
                minWidth: 120,
                padding: '3px 10px',
                color: '#fff',
                borderRadius: 16,
                display: 'inline-block',
                marginTop: 24,
              }}
            >
              {IelectricMeterTypeName[electric.emType]}
            </div>
          </Col>
          <Col span={18}>
            <Row style={{ minHeight: 36 }}>
              <Col span={8} className={styles.col_2}>
                <span className={styles.col_1}>电表名称：</span> {electric.emName}
              </Col>
              <Col span={8} className={styles.col_2}>
                <span className={styles.col_1}>编码：</span> {electric.emCode}
              </Col>
              <Col span={8} className={styles.col_2}>
                <span className={styles.col_1}>上级支路：</span>
                {replace(trimEnd(electric.ecChainName || '--', ','), /,/g, '-')}
              </Col>
            </Row>
            <Row style={{ minHeight: 36 }}>
              <Col span={8} className={styles.col_2}>
                <span className={styles.col_1}>型号：</span> {electric.emModel}
              </Col>
              <Col span={8} className={styles.col_2}>
                <span className={styles.col_1}>生产厂家：</span> {electric.emManufacturer || '--'}
              </Col>
              <Col span={8} className={styles.col_2}>
                <span className={styles.col_1}>部署区域：</span> {electric.regionName || '--'}
              </Col>
            </Row>
            <Row style={{ minHeight: 36 }}>
              <Col span={8} className={styles.col_2}>
                <span className={styles.col_1}>关联网关：</span> {electric.ecnNameStr || '--'}
              </Col>
              <Col span={8} className={styles.col_2}>
                <span className={styles.col_1}>接入柜号：</span> {electric.emCabinetCode}
              </Col>
              <Col span={8} className={styles.col_2}>
                <span className={styles.col_1}>接入柜名：</span> {electric.emCabinetName}
              </Col>
            </Row>
            <Row style={{ minHeight: 36 }}>
              <Col span={24} className={styles.col_2}>
                <span className={styles.col_1}>备注：</span> {electric.emDesc || '--'}
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider
          type="horizontal"
          style={{
            width: 'calc(100% + 24px)',
            height: 6,
            backgroundColor: '#eee',
            margin: '12px 0',
          }}
        />
        <Tabs defaultActiveKey="1" onChange={callback} style={{ padding: '0 12px' }}>
          <TabPane tab="实时数据" key="1">
            <>
              <RealTimeData checkedKeys={selectedKeys} electric={electric} />
            </>
          </TabPane>
          <TabPane tab="历史数据" key="2">
            <>
              {activeKey === '2' ? (
                <HistoricalData checkedKeys={selectedKeys} electric={electric} />
              ) : null}
            </>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}

// export default AutoAcquisition
export default connect(
  (state: AppState) => {
    return {
      client: state.common.client,
    }
  },
  (dispatch: any) => {
    return {
      actions: bindActionCreators(
        {
          getSubMeterList: actions.getSubMeterList,
          updateTopicky: actions.updateTopicky,
          updateList: actions.updateList,
          unsubscribe: actions.unsubscribe,
        },
        dispatch
      ),
    }
  }
)(AutoAcquisition)
