import api from '@/service/api'
import { IReqDeviceComsumption } from '@/types/reqType'
import { Line, Column, Pie } from '@ant-design/charts'
import { Row, Col, message, Spin, Empty } from 'antd'
import { round } from 'lodash-es'
import React, { useEffect, useState } from 'react'
interface IProps {
  queryParams: IReqDeviceComsumption
  chartType: string
  chartItem: string[]
}
const ChartComponent = (props: IProps) => {
  const [data, setData] = useState<any>([])
  const [piedData, setPieData] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataException, setDataException] = useState(false)

  let lineConfig = {
    height: 280,
    data: data,
    xField: 'time',
    yField: 'value',
    seriesField: 'device',
    guide: {
      text: {
        top: true, // 指定 giude 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
        position: ['start', 'end'], // 文本的起始位置，值为原始数据值，支持 callback
        content: '(%)', // 显示的文本内容
        style: {
          // 文本的图形样式属性
          fill: '#9BB7EF', // 文本颜色
          fontSize: '12', // 文本大小
        }, // 文本的图形样式属性
        offsetX: -25, // x 方向的偏移量
        offsetY: -20, // y 方向偏移量
      },
    },
    label: false,
    slider: {
      start: 0,
      end: 1,
    },
    legend: data?.length && { position: 'bottom' },
    tooltip: {
      customContent: (title: any, items: any) => {
        let compare = '0'
        if (items.length === 2 && items[0].value !== '0') {
          compare = `${round(((items[1].value - items[0].value) / items[0].value) * 100, 2)}`
        } else {
          compare = '--'
        }
        return (
          <>
            <h5 style={{ marginTop: 16 }}>{title}</h5>
            <ul style={{ paddingLeft: 0 }}>
              {items?.map((item: any, index: any) => {
                const { name, value, color } = item
                return (
                  <li
                    key={item.name}
                    className="g2-tooltip-list-item"
                    data-index={index}
                    style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                  >
                    <span className="g2-tooltip-marker" style={{ backgroundColor: color }} />
                    <span
                      style={{
                        display: 'inline-flex',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{name}:</span>
                      <span className="g2-tooltip-list-item-value">{value}</span>
                    </span>
                  </li>
                )
              })}
              {props.queryParams.compareType && (
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span className="g2-tooltip-marker" style={{ backgroundColor: '#13C2C2' }} />
                  <span
                    style={{ display: 'inline-flex', flex: 1, justifyContent: 'space-between' }}
                  >
                    <span>{props.queryParams.compareType === 'YoY' ? '同比' : '环比'}:</span>
                    <span className="g2-tooltip-list-item-value">{compare}%</span>
                  </span>
                </li>
              )}
            </ul>
          </>
        )
      },
    },
  }
  let BarConfig = {
    height: 280,
    data: data,
    isGroup: true,
    xField: 'time',
    yField: 'value',
    seriesField: 'device',
    label: false,
    slider: {
      start: 0,
      end: 1,
    },
    legend: data?.length && { position: 'bottom' },
    tooltip: {
      customContent: (title: any, items: any) => {
        let compare = '0'
        if (items.length === 2 && items[0].value !== '0') {
          compare = `${round(((items[1].value - items[0].value) / items[0].value) * 100, 2)}`
        } else {
          compare = '--'
        }
        return (
          <>
            <h5 style={{ marginTop: 16 }}>{title}</h5>
            <ul style={{ paddingLeft: 0 }}>
              {items?.map((item: any, index: any) => {
                const { name, value, color } = item
                return (
                  <li
                    key={item.name}
                    className="g2-tooltip-list-item"
                    data-index={index}
                    style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                  >
                    <span className="g2-tooltip-marker" style={{ backgroundColor: color }} />
                    <span
                      style={{
                        display: 'inline-flex',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{name}:</span>
                      <span className="g2-tooltip-list-item-value">{value}</span>
                    </span>
                  </li>
                )
              })}
              {props.queryParams.compareType && (
                <li
                  className="g2-tooltip-list-item"
                  style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                >
                  <span className="g2-tooltip-marker" style={{ backgroundColor: '#13C2C2' }} />
                  <span
                    style={{ display: 'inline-flex', flex: 1, justifyContent: 'space-between' }}
                  >
                    <span>{props.queryParams.compareType === 'YoY' ? '同比' : '环比'}:</span>
                    <span className="g2-tooltip-list-item-value">{compare}%</span>
                  </span>
                </li>
              )}
            </ul>
          </>
        )
      },
    },
  }
  let PieConfig = {
    appendPadding: 10,
    data: piedData,
    angleField: 'value',
    colorField: 'device',
    radius: 0.9,
    label: {
      type: 'outer',
      content: function content(_ref: any) {
        let percent = round(_ref.percent * 100, 2)
        return `${percent}%`
      },
    },
    interactions: [{ type: 'element-active' }],
  }
  useEffect(() => {
    const getList = async () => {
      try {
        setLoading(true)
        const res = await api.getBranchConsumptionChart(props.queryParams)
        let data: any = []
        res.data.datasets.map((item) => {
          if (props.chartItem.indexOf('showCoal') === -1) {
            item.values.map((value, index) => {
              data.push({
                device: item.label,
                time: res.data.labels[index],
                value: value,
              })
            })
          } else {
            item.toCoals.map((value, index) => {
              data.push({
                device: item.label,
                time: res.data.labels[index],
                value: value,
              })
            })
          }
        })
        setData(data)
      } catch (err) {
        message.error(err)
      } finally {
        setLoading(false)
      }
    }
    getList()
  }, [props.queryParams, props.chartItem])
  //获取饼图数据
  useEffect(() => {
    const getPieList = async () => {
      try {
        //setLoading(true)
        const res = await api.getBranchConsumptionChartSort(props.queryParams)
        let data: any = []
        let flag = false
        res.data.datasets.map((item) => {
          if (item.value < 0) {
            flag = true
          }
          data.push({
            device: item.label,
            value: item.value,
          })
        })
        if (flag) {
          setPieData([])
          setDataException(true)
        } else {
          setPieData(data)
        }
      } catch (err) {
        message.error(err)
      } finally {
        //setLoading(false)
      }
    }
    if (props.chartType === 'pie') {
      getPieList()
    }
  }, [props.queryParams, props.chartType])

  return (
    <div style={{ padding: '8px' }}>
      <Spin spinning={loading}>
        <Row>
          <Col span={24}>单位：{props.chartItem.indexOf('showCoal') != -1 ? '吨' : 'kWh'}</Col>
          <Col span={24}>
            {props.chartType === 'line' && <Line {...(lineConfig as any)} />}
            {props.chartType === 'bar' && <Column {...(BarConfig as any)} />}
            {props.chartType === 'pie' &&
              (piedData.length > 0 ? (
                piedData.length > 0 && <Pie {...(PieConfig as any)} />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={dataException ? '数据异常：存在负数，无法生成统计图' : '暂无数据'}
                />
              ))}
          </Col>
        </Row>
      </Spin>
    </div>
  )
}
export default ChartComponent
