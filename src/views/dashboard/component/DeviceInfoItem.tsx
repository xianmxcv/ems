import svg1 from '@/assets/images/dashboard/u229.svg'
import svg2 from '@/assets/images/dashboard/u230.svg'
import svg3 from '@/assets/images/dashboard/u231.svg'
import svg4 from '@/assets/images/dashboard/u232.svg'
import api from '@/service/api'
import { IResHomeCountDevice, ITreeData } from '@/types/resType'
import { Card, Col, DatePicker, Input, message, Row, Spin, TreeSelect } from 'antd'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import styles from '../index.module.less'
const DeviceInfoItem = () => {
  const [branchTreeData, setBranchTreeData] = useState<ITreeData[]>([])
  const [ecId, setEcId] = useState<string>('')
  const [queryDate, setQueryDate] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [deviceInfo, setDeviceInfo] = useState<IResHomeCountDevice>({
    deviceCount: 0,
    ecnCount: 0,
    emCount: 0,
    tfCount: 0,
  })
  useEffect(() => {
    const getBranchTreeData = async () => {
      const { data = [] } = await api.getBranchList()
      setBranchTreeData(data)
    }
    getBranchTreeData()
  }, [])
  const changeDate = (date: any, dateString: string) => {
    setQueryDate(dateString)
  }
  const changeBranch = (val: string) => {
    setEcId(val ? val : '')
  }
  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        setLoading(true)
        const res = await api.getHomeDeviceInfo(`${ecId}!${queryDate}`)
        if (res.data) {
          setDeviceInfo(res.data)
        }
      } catch (err) {
        message.error(err)
      } finally {
        setLoading(false)
      }
    }
    getDeviceInfo()
  }, [ecId, queryDate])
  return (
    <div className={styles.ElectricityConsumption}>
      <Card title="设备情况" size="small" className={styles.ElectricityConsumption_Card}>
        <Spin spinning={loading}>
          <Row gutter={8}>
            <Col span={14} style={{ padding: '3px 10px' }}>
              <TreeSelect
                style={{ width: '100%' }}
                allowClear
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={branchTreeData}
                onChange={changeBranch}
                placeholder="请选择关联支路名称"
                treeDefaultExpandAll
              />
            </Col>
            <Col span={10} style={{ padding: '3px 10px' }}>
              <DatePicker onChange={changeDate} style={{ width: '100%' }} />
            </Col>
          </Row>
          <Row style={{ padding: '3px 8px' }} gutter={32} className={styles.deviceInfo_box}>
            <Col span={12} className={styles.deviceInfo_box_1}>
              <Row className={styles.deviceInfo}>
                <Col span={12} className={styles.deviceInfoImg}>
                  <span>
                    <img src={svg1} height={30} alt=" " />
                  </span>
                </Col>
                <Col span={12} className={styles.deviceInfo_flex}>
                  <div>
                    <div className={styles.deviceInfoValue}>{deviceInfo.tfCount}</div>
                    <div className={styles.deviceInfoLabel}>变压器台数</div>{' '}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={12} className={styles.deviceInfo_box_1}>
              <Row className={styles.deviceInfo}>
                <Col span={12} className={styles.deviceInfoImg}>
                  <span>
                    <img src={svg2} height={30} alt=" " />
                  </span>
                </Col>
                <Col span={12} className={styles.deviceInfo_flex}>
                  <div>
                    <div className={styles.deviceInfoValue}>{deviceInfo.emCount}</div>
                    <div className={styles.deviceInfoLabel}>电表台数</div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={12} className={styles.deviceInfo_box_1}>
              <Row className={styles.deviceInfo}>
                <Col span={12} className={styles.deviceInfoImg}>
                  <span>
                    <img src={svg3} height={30} alt=" " />
                  </span>
                </Col>
                <Col span={12} className={styles.deviceInfo_flex}>
                  <div>
                    <div className={styles.deviceInfoValue}>{deviceInfo.ecnCount}</div>
                    <div className={styles.deviceInfoLabel}>边缘节点台数</div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={12} className={styles.deviceInfo_box_1}>
              <Row className={styles.deviceInfo}>
                <Col span={12} className={styles.deviceInfoImg}>
                  <span>
                    <img src={svg4} height={30} alt=" " />
                  </span>
                </Col>
                <Col span={12} className={styles.deviceInfo_flex}>
                  <div>
                    <div className={styles.deviceInfoValue}>{deviceInfo.deviceCount}</div>
                    <div className={styles.deviceInfoLabel}>耗能设备台数</div>{' '}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </Card>
    </div>
  )
}

export default DeviceInfoItem
