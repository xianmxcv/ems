import api from '@/service/api'
import { IReqDeviceComsumption } from '@/types/reqType'
import { handleDownFile } from '@/utils/downfile'
import { Column } from '@ant-design/charts'
import { UploadOutlined } from '@ant-design/icons'
import { Row, Col, DatePicker, Form, Table, Button, Spin, message } from 'antd'
import moment from 'moment'
import React, { useState, useEffect, Key } from 'react'
const { RangePicker } = DatePicker
import styles from '../index.module.less'
interface IProps {
  checkedKeys: Key[]
}
const ConsumptionRank = (props: IProps) => {
  const [reqForm, setReqForm] = useState<IReqDeviceComsumption>({
    begin: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    unitIds: [],
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>([])
  const columns: any = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text: any, record: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: '重点耗能设备名称',
      dataIndex: 'device',
      key: 'device',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '能耗',
      dataIndex: 'value',
      key: 'value',
      align: 'left',
      ellipsis: true,
    },
  ]
  let BarConfig = {
    height: 300,
    data: data,
    xField: 'device',
    yField: 'value',
    columnWidthRatio: 0.2,
    label: {
      position: 'top',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    legend: false,
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
                      <span>用电量:</span>
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
        const res = await api.getItemConsumptionChartSort({
          ...reqForm,
          unitIds: props.checkedKeys as string[],
        })
        let data: any = []
        res.data.datasets.map((item) => {
          data.push({
            device: item.label,
            value: item.value,
          })
        })
        setData(data)
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
              name="username"
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
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>单位：kWh</Col>
        <Col span={24}>
          <Spin spinning={loading}>
            <Column {...(BarConfig as any)} />
          </Spin>
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
                `/energy-config/reportItem/export/sort?begin=${reqForm.begin}&end=${
                  reqForm.end
                }&unitIds=${reqForm.unitIds?.join(',')}&dataSort=${false}`
              )
            }
          >
            <UploadOutlined /> 导出
          </Button>
        </Col>
      </Row>
      <Row style={{ height: 300, overflowY: 'scroll' }}>
        <Col span={24}>
          <Table
            size="small"
            columns={columns}
            rowKey="device"
            dataSource={data}
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  )
}

export default ConsumptionRank
