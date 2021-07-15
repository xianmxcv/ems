import api from '@/service/api'
import { formatNum } from '@/utils/common'
import { Line } from '@ant-design/charts'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { Card, Col, message, Row, Spin, Statistic } from 'antd'
import { round } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.less'
const ElectricityConsumption = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>([])
  const [currentSumEpi, setCurrentSumEpi] = useState<string>('0')
  const [lastSumEpi, setLastSumEpi] = useState<string>('0')
  const [compare, setCompare] = useState<number>(0)
  useEffect(() => {
    const getList = async () => {
      setLoading(true)
      try {
        const res = await api.getHomeEnergyConsumption()
        if (res.data) {
          let arr: any = []
          if (res.data.currentList !== null) {
            res.data.currentList.forEach((item) => {
              arr.push({
                date: item.collectDate.substr(8),
                type: '本月',
                value: item.sumEpi,
              })
              arr.push({
                date: item.collectDate.substr(8),
                type: '上月',
                value: item.lastSumEpi,
              })
            })
          }
          setCurrentSumEpi(formatNum(res.data.currentMonth))
          setLastSumEpi(formatNum(res.data.lastMonth))
          let iCompare: number = 0
          if (res.data.lastMonth !== 0) {
            iCompare = ((res.data.currentMonth - res.data.lastMonth) / res.data.lastMonth) * 100
          } else {
            iCompare = 0
          }
          setCompare(round(iCompare, 2))
          setData(arr)
        }
      } catch (err) {
        message.error(err)
      } finally {
        setLoading(false)
      }
    }
    getList()
  }, [])
  let config = {
    // height: 350,
    autoFit: true,
    data: data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    areaStyle: { fillOpacity: 0.7 },
    appendPadding: 10,
    isPercent: true,
    legend: {
      position: 'bottom',
    },
    supportCSSTransform: true,
  }
  return (
    <div className={styles.ElectricityConsumption}>
      <Card title="用电情况" size="small" className={styles.ElectricityConsumption_Card}>
        <Spin spinning={loading} className={styles.ElectricityConsumption_height}>
          <Row className={styles.ElectricityConsumption_height}>
            <Col span={6} className={styles.ElectricityConsumption_height}>
              <Row className={styles.ElectricityConsumption_height_33}>
                <Col
                  span={24}
                  className={styles.eleConsumptionItem}
                  style={{ backgroundColor: '#E5F4FE', borderColor: '#0099FF' }}
                >
                  <Statistic
                    title="当月用电"
                    value={currentSumEpi ? currentSumEpi : 0}
                    suffix={'kWh'}
                  />
                </Col>
              </Row>
              <Row className={styles.ElectricityConsumption_height_33}>
                <Col
                  span={24}
                  className={styles.eleConsumptionItem}
                  style={{ backgroundColor: '#EDFAED', borderColor: '#51D351' }}
                >
                  <Statistic title="上月用电" value={lastSumEpi ? lastSumEpi : 0} suffix={'kWh'} />
                </Col>
              </Row>
              <Row className={styles.ElectricityConsumption_height_33}>
                <Col
                  span={24}
                  className={styles.eleConsumptionItem}
                  style={{ backgroundColor: '#FEF6EB', borderColor: '#FCAD42' }}
                >
                  <Statistic
                    title="环比(%)"
                    value={compare}
                    suffix={compare > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={18} style={{ maxHeight: '100%' }}>
              <Line {...(config as any)} style={{ marginTop: 16, height: '100%', width: '100%' }} />
            </Col>
          </Row>
        </Spin>
      </Card>
    </div>
  )
}

export default ElectricityConsumption
