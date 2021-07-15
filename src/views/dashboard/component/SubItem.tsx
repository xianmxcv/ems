import api from '@/service/api'
import { Pie } from '@ant-design/charts'
import { Card, Col, Empty, message, Radio, Row } from 'antd'
import { round } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.less'
const SubItem = () => {
  const [dateType, setDateType] = useState<string>('day')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>([])
  const [sum, setSum] = useState<number>(0)
  const [dataException, setDataException] = useState(false)
  const onChange = (value: any) => {
    setDateType(value.target.value)
  }
  useEffect(() => {
    const getPieData = async () => {
      setLoading(true)
      try {
        const res = await api.getHomeCountItem(dateType)
        if (res.data) {
          let arr: any = []
          let sumValue: number = 0
          let flag = false
          res.data.forEach((item) => {
            if (item.sumEpi < 0) {
              flag = true
            }
            arr.push({
              type: item.iname,
              value: item.sumEpi,
            })
            sumValue += item.sumEpi
          })
          if (flag) {
            setData([])
            setDataException(true)
          } else {
            setData(arr)
          }
          setSum(sumValue)
        }
      } catch (err) {
        message.error(err)
      } finally {
        setLoading(false)
      }
    }
    getPieData()
  }, [dateType])
  const getSize = (size = 0) => {
    const h = window.screen.height
    if (h >= 1080) {
      return 24 - size
    } else if (h >= 1024) {
      return 24 - size
    } else if (h >= 992) {
      return 18 - size
    } else if (h >= 900) {
      return 16 - size
    } else if (h >= 768) {
      return 14 - size
    }
    return 24
  }
  let config = {
    // height: 311,
    autoFit: true,
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    supportCSSTransform: true,
    label: {
      type: 'outer',
      style: { fontSize: getSize(4) },
      autoRotate: false,
      content: '{value}',
    },
    legend: {
      position: 'bottom',
      layout: 'horizontal',
      flipPage: false,
      itemName: {
        style: { fontSize: getSize(4) },
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          fontSize: getSize(),
        },
        formatter: function formatter(value: any) {
          return value
            ? `<div style="font-size:${getSize(2)}px"><div>${value?.type}</div>
          <div>${round((value?.value * 100) / sum, 2)}%</div></div>`
            : `<div style="font-size:${getSize(2)}px"><div>总计</div>
            <div>${round(sum, 2)}</div></div>`
        },
      },
    },
  }
  return (
    <div className={styles.ElectricityConsumption}>
      <Card
        title="电能分项占比"
        className={styles.ElectricityConsumption_Card}
        size="small"
        extra={
          <Radio.Group defaultValue="day" size="small" onChange={onChange}>
            <Radio.Button value="day">今日</Radio.Button>
            <Radio.Button value="month">本月</Radio.Button>
            <Radio.Button value="year">当年</Radio.Button>
          </Radio.Group>
        }
      >
        <Row style={{ height: '100%', maxHeight: '100%' }}>
          <Col span={24} style={{ height: '100%', maxHeight: '100%' }}>
            {data.length > 0 ? (
              data.length > 0 && (
                <Pie
                  {...(config as any)}
                  loading={loading}
                  style={{ height: '100%', maxHeight: '100%' }}
                />
              )
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={dataException ? '数据异常：存在负数，无法生成统计图' : '暂无数据'}
              />
            )}
          </Col>
          {/* <Col span={24} style={{ height: '100%', maxHeight: '100%' }}>
            {data.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </Col> */}
        </Row>
      </Card>
    </div>
  )
}

export default SubItem
