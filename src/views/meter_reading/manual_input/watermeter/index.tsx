import DianBiao from '@/assets/images/dianbiao.png'
import TreeComponent from '@/component/showTree'
import api from '@/service/api'
import { IelectricMeterTypeName, IMeterType, IWaterMeterTypeName } from '@/types/common'
import { MrecQuery, IReqAddManualRecordForm } from '@/types/reqType'
import { IResElectricNameList, IResIElectricMeter } from '@/types/resType'
import { transformTree1 } from '@/utils/common'
import { Row, Col, Tabs, Divider, Form, Input, Button, Space, DatePicker } from 'antd'
import { message } from 'antd'
import { findIndex, forIn, isEmpty } from 'lodash-es'
import moment from 'moment'
import React, { useState, useCallback, useEffect } from 'react'
import TableList from './TableList'
import styles from './index.module.less'

const { TabPane } = Tabs

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}
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
const WaterMeter = () => {
  const [treeData, setTreeData] = useState<IResElectricNameList[]>([])
  const [defaultExpandId, setDefaultExpandId] = useState<React.Key>('')
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [ids, setIds] = useState<string>('')
  const [electric, setElectric] = useState<IResIElectricMeter>(initElectric)
  const [loading, setLoading] = useState<boolean>(false)
  const [activeKey, setActiveKey] = useState<string>('1')
  const callback = (key: string) => {
    setActiveKey(key)
  }
  const [meter] = Form.useForm()
  const { setFieldsValue } = meter
  const getList = useCallback(async () => {
    try {
      const { data = [] } = await api.getMeterList({ emMeterType: IMeterType.WATERMETER })
      const tData = data.map((item) => ({
        ...item,
        title: item.emName,
        key: item.emId,
        pid: item.emId,
      }))
      let treeIteratedData = transformTree1(tData)
      let index = findIndex(treeIteratedData, ['disabled', false])
      if (index >= 0) {
        setSelectedKeys([treeIteratedData[index].key])
        setIds(treeIteratedData[index].key)
        setDefaultExpandId(treeIteratedData[index].fullLinkKey || '')
      } else {
        setSelectedKeys([])
      }
      setTreeData(tData)
    } catch (error) {
      message.error(error)
    }
  }, [])
  const getDetail = async (emId: string) => {
    if (!emId) return
    try {
      const res = await api.getElectricMeterDetailSingle({ emId })
      setElectric(res.data || initElectric)
    } catch (error) {
      message.error(error)
    }
  }
  const onCheck = (checkedKeys: any, e: any) => {
    const { node: { children = [] } = {} } = e
    if (!isEmpty(children)) return
    setSelectedKeys(checkedKeys)
    setIds(checkedKeys[0])
  }
  const onFinish = async (values: any) => {
    setLoading(true)
    const recordList: MrecQuery[] = []
    forIn(values, (value, key) => {
      if (key === 'mrecTime') return
      recordList.push({ mrecType: key, mrecVal: Number(value), mrecUnit: 'm??' })
    })
    const { mrecTime } = values
    const { emId } = electric
    const addManualRecordForm: IReqAddManualRecordForm = {
      emId,
      mrecTime: mrecTime ? moment(mrecTime.format('YYYY-MM-DD')) : '',
      recordList,
    }
    try {
      await api.postManualRecord(addManualRecordForm)
      message.success('????????????')
      reset()
    } catch (error) {
      message.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const reset = () => {
    setFieldsValue({
      mrecTime: null,
      P_FLOW: null,
      R_FLOW: null,
    })
  }

  useEffect(() => {
    getList()
  }, [getList])

  useEffect(() => {
    getDetail(ids)
  }, [ids])

  return (
    <Row style={{ height: '100%' }}>
      <Col style={{ width: 300, height: '100%', overflow: 'auto' }}>
        <Row
          align="middle"
          style={{ padding: '0 16px', backgroundColor: 'rgba(249, 249, 249, 1)' }}
        >
          ??????????????????
        </Row>
        <div style={{ padding: 12 }}>
          <TreeComponent
            placeholder="????????????"
            isSearch={true}
            selectedKeys={selectedKeys}
            checkedKeys={selectedKeys}
            defaultExpandId={defaultExpandId}
            treeData={treeData}
            onSelect={onCheck}
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
        <Row
          align="middle"
          style={{ padding: '0 16px', backgroundColor: 'rgba(249, 249, 249, 1)' }}
        >
          ??????????????????
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
              {IWaterMeterTypeName[electric.emType]}
            </div>
          </Col>
          <Col span={18}>
            <Row style={{ minHeight: 36 }} wrap={false}>
              <Col span={12} className={styles.col_2}>
                <span className={styles.col_1}>???????????????</span> {electric.emName}
              </Col>
              <Col span={12} className={styles.col_2}>
                <span className={styles.col_1}>?????????</span> {electric.emCode}
              </Col>
            </Row>
            <Row style={{ minHeight: 36 }} wrap={false}>
              <Col span={12} className={styles.col_2}>
                <span className={styles.col_1}>?????????</span> {electric.emModel}
              </Col>
              <Col span={12} className={styles.col_2}>
                <span className={styles.col_1}>???????????????</span> {electric.emManufacturer || '--'}
              </Col>
            </Row>
            <Row style={{ minHeight: 36 }} wrap={false}>
              <Col span={24} className={styles.col_2}>
                <span className={styles.col_1}>?????????</span> {electric.emDesc || '--'}
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider
          type="horizontal"
          style={{
            height: 6,
            backgroundColor: '#eee',
            width: 'calc(100% + 24px)',
            margin: '12px 0',
          }}
        />
        <Tabs
          defaultActiveKey="1"
          onChange={callback}
          style={{ padding: '0 12px', height: ' calc(100% - 220px)', overflowY: 'auto' }}
        >
          <TabPane
            tab="????????????"
            key="1"
            style={{ color: '#999', padding: '0 12px' }}
            className={styles.auto_acquisition_form}
          >
            <>
              <Form
                form={meter}
                // initialValues={{ remember: true }}
                // defaultValue={initElectric}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="????????????"
                  name="mrecTime"
                  rules={[{ required: true, message: '??????????????????' }]}
                >
                  <DatePicker />
                </Form.Item>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="??????????????????"
                      name="P_FLOW"
                      rules={[
                        { required: true, message: '?????????????????????' },
                        {
                          pattern: /(^[1-9]([0-9]\d{0,8})?(\.[0-9]{0,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                          message: '????????????????????????2????????????????????????10???',
                        },
                      ]}
                    >
                      <Input style={{ width: 250 }} suffix="m??" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="??????????????????"
                      name="R_FLOW"
                      rules={[
                        { required: true, message: '???????????????????????????' },
                        {
                          pattern: /(^[1-9]([0-9]\d{0,8})?(\.[0-9]{0,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                          message: '????????????????????????2????????????????????????10???',
                        },
                      ]}
                    >
                      <Input style={{ width: 250 }} suffix="m??" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item {...tailLayout}>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      ??????
                    </Button>
                    <Button onClick={reset}>??????</Button>
                  </Space>
                </Form.Item>
              </Form>
            </>
          </TabPane>
          <TabPane tab="??????????????????" key="2">
            {activeKey === '2' ? <TableList checkedKeys={selectedKeys} /> : null}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}

export default WaterMeter
