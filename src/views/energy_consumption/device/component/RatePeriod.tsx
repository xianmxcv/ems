import api from '@/service/api'
import { IReqDeviceComsumption } from '@/types/reqType'
import { handleDownFile } from '@/utils/downfile'
import { Column, Pie } from '@ant-design/charts'
import { BarChartOutlined, PieChartOutlined, UploadOutlined } from '@ant-design/icons'
import { Row, Col, DatePicker, Form, Space, Table, Button, message, Empty } from 'antd'
import { round } from 'lodash-es'
import moment from 'moment'
import React, { useState, useEffect, Key } from 'react'
const { RangePicker } = DatePicker
import styles from '../index.module.less'
interface IProps {
  checkedKeys: Key[]
}
const RatePeriod = (props: IProps) => {
  const [chartType, setChartType] = useState<string>('pie')
  const [reqForm, setReqForm] = useState<IReqDeviceComsumption>({
    begin: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    unitIds: [],
  })
  const [data, setData] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sum, setSum] = useState<unknown>(0)
  const [dataException, setDataException] = useState(false)
  const columns: any = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text: any, record: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: '费率时间段',
      dataIndex: 'type',
      key: 'type',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '能耗值',
      dataIndex: 'value',
      key: 'value',
      align: 'left',
      ellipsis: true,
    },
  ]
  let PieConfig = {
    height: 280,
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: function content(_ref: any) {
        let percent = round(_ref.percent * 100, 2)
        return `${percent}%`
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        formatter: function formatter() {
          return `<div><h3 style="font-size:24px;font-weight:900;padding:0px 0px">${sum}</h3><h5 style="font-size:14px;color:#999999;padding:0px 0px">总耗能</h5></div>`
        },
      },
    },
  }
  let BarConfig = {
    data: data,
    xField: 'type',
    yField: 'value',
    columnWidthRatio: 0.2,
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    tooltip: {
      customContent: (title: any, items: any) => {
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
                      <span>能耗值：</span>
                      <span className="g2-tooltip-list-item-value">{value}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </>
        )
      },
    },
  }
  const changeDate = (dates: any, dateStrings: any) => {
    setReqForm({ ...reqForm, begin: dateStrings[0], end: dateStrings[1] })
  }
  useEffect(() => {
    const getList = async () => {
      try {
        setLoading(true)
        const res = await api.getDeviceConsumptionCostChart({
          ...reqForm,
          unitIds: props.checkedKeys as string[],
        })
        let data: any = []
        let sumValue: number = 0
        let flag = false
        res.data.datasets.map((item) => {
          if (item.value < 0) {
            flag = true
          }
          data.push({
            type: item.label,
            value: item.value,
          })
          sumValue += item.value
        })
        setSum(round(sumValue, 2))
        if (flag) {
          setData([])
          setDataException(true)
        } else {
          setData(data)
        }
      } catch (err) {
        message.error(err)
      } finally {
        setLoading(false)
      }
    }
    getList()
  }, [reqForm, props.checkedKeys])
  return (
    <div style={{ padding: '8px' }}>
      <Row>
        <Col span={24}>
          <Form name="basic" layout="inline">
            <Form.Item
              label="日期范围"
              name="dateTime"
              initialValue={[moment().subtract(30, 'days'), moment()]}
            >
              <RangePicker
                separator="至"
                allowClear={false}
                format={['YYYY-MM-DD', 'YYYY-MM-DD']}
                onChange={changeDate}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button
              type={chartType === 'pie' ? 'primary' : 'default'}
              shape="circle"
              icon={<PieChartOutlined />}
              onClick={() => setChartType('pie')}
            />
            <Button
              type={chartType === 'bar' ? 'primary' : 'default'}
              shape="circle"
              icon={<BarChartOutlined />}
              onClick={() => setChartType('bar')}
            />
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {chartType === 'pie' && data.length > 0 && <Pie {...(PieConfig as any)} />}
          {chartType === 'bar' && data.length > 0 && <Column {...(BarConfig as any)} />}
          {data.length === 0 && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={dataException ? '数据异常：存在负数，无法生成统计图' : '暂无数据'}
            />
          )}
        </Col>
      </Row>
      <Row style={{ marginTop: 8, padding: '8px 0px' }}>
        <Col span={12}>能耗列表</Col>
        <Col
          span={12}
          style={{ textAlign: 'right', color: '#999999' }}
          className={styles['operate-button']}
        >
          单位kWh
          <Button
            style={{ marginLeft: '8px' }}
            onClick={(event) =>
              handleDownFile(
                event,
                `/energy-config/reportDevice/export/cost?begin=${reqForm.begin}&end=${
                  reqForm.end
                }&unitIds=${reqForm.unitIds?.join(',')}&dataSort=${false}`
              )
            }
          >
            <UploadOutlined /> 导出
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            size="small"
            loading={loading}
            columns={columns}
            rowKey="type"
            dataSource={data}
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  )
}

export default RatePeriod
