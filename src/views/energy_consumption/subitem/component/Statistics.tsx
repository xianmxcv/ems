import { IReqDeviceComsumption } from '@/types/reqType'
import { BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons'
import { Row, Col, DatePicker, Form, Radio, Checkbox, Space, Button, message } from 'antd'
import moment from 'moment'
import React, { useState, Key } from 'react'
import ChartComponent from './chart'
const { RangePicker } = DatePicker
import ComponentTable from './table'
interface IProps {
  checkedKeys: Key[]
}
const Statistics = (props: IProps) => {
  const [form] = Form.useForm()
  const { setFieldsValue } = form
  const [reqForm, setReqForm] = useState<IReqDeviceComsumption>({
    dateType: 'DAY',
    begin: moment().format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    ecId: '',
    unitIds: [],
  })
  const [chartType, setChartType] = useState<string>('line')
  const [chartItem, setChartItem] = useState<string[]>([])

  const changeDate = (dates: any, dateStrings: any) => {
    if (reqForm.dateType === 'DAY') {
      if (moment(dateStrings[1]).diff(moment(dateStrings[0]), 'day') < 7) {
        setReqForm({
          ...reqForm,
          begin: dateStrings[0],
          end: dateStrings[1],
          unitIds: props.checkedKeys as string[],
        })
      } else {
        setFieldsValue({
          dateType: reqForm.dateType,
          dateTime: [moment(reqForm.begin), moment(reqForm.end)],
        })
        message.info('月维度时间跨度不能超过7天')
      }
    } else if (reqForm.dateType === 'MONTH') {
      if (moment(dateStrings[1]).diff(moment(dateStrings[0]), 'day') < 31) {
        setReqForm({
          ...reqForm,
          begin: dateStrings[0],
          end: dateStrings[1],
          unitIds: props.checkedKeys as string[],
        })
      } else {
        setFieldsValue({
          dateType: reqForm.dateType,
          dateTime: [moment(reqForm.begin), moment(reqForm.end)],
        })
        message.info('月维度时间跨度不能超过31天')
      }
    } else {
      setReqForm({
        ...reqForm,
        begin: dateStrings[0],
        end: dateStrings[1],
        unitIds: props.checkedKeys as string[],
      })
    }
  }
  const changeType = (e: any) => {
    if (e.target.value === 'DAY') {
      if (moment(reqForm.end).diff(moment(reqForm.begin), 'day') < 7) {
        setReqForm({ ...reqForm, dateType: e.target.value, unitIds: props.checkedKeys as string[] })
      } else {
        setFieldsValue({
          dateType: e.target.value,
          dateTime: [moment().subtract(6, 'days'), moment()],
        })
        setReqForm({
          ...reqForm,
          begin: moment().subtract(6, 'days').format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD'),
          dateType: e.target.value,
          unitIds: props.checkedKeys as string[],
        })
      }
    } else if (e.target.value === 'MONTH') {
      if (moment(reqForm.end).diff(moment(reqForm.begin), 'day') < 31) {
        setReqForm({ ...reqForm, dateType: e.target.value, unitIds: props.checkedKeys as string[] })
      } else {
        setFieldsValue({
          dateType: e.target.value,
          dateTime: [moment().subtract(30, 'days'), moment()],
        })
        setReqForm({
          ...reqForm,
          begin: moment().subtract(30, 'days').format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD'),
          dateType: e.target.value,
          unitIds: props.checkedKeys as string[],
        })
      }
    } else {
      setReqForm({ ...reqForm, dateType: e.target.value, unitIds: props.checkedKeys as string[] })
    }
  }
  const changeChartItem = (checkedValues: any) => {
    setChartItem(checkedValues)
  }
  return (
    <div style={{ padding: '8px' }}>
      <Row>
        <Col span={24}>
          <Form name="basic" layout="inline" form={form}>
            <Form.Item label="统计维度" name="dateType" initialValue="DAY">
              <Radio.Group onChange={changeType}>
                <Radio.Button value="DAY">日</Radio.Button>
                <Radio.Button value="MONTH">月</Radio.Button>
                <Radio.Button value="YEAR">年</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="日期范围" name="dateTime" initialValue={[moment(), moment()]}>
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
          <Checkbox.Group onChange={changeChartItem}>
            <Checkbox value="showCoal">折合标准煤</Checkbox>
          </Checkbox.Group>
          <Space>
            <Button
              type={chartType === 'bar' ? 'primary' : 'default'}
              shape="circle"
              icon={<BarChartOutlined />}
              onClick={() => setChartType('bar')}
            />
            <Button
              type={chartType === 'line' ? 'primary' : 'default'}
              shape="circle"
              icon={<LineChartOutlined />}
              onClick={() => setChartType('line')}
            />
            <Button
              type={chartType === 'pie' ? 'primary' : 'default'}
              shape="circle"
              icon={<PieChartOutlined />}
              onClick={() => setChartType('pie')}
            />
          </Space>
        </Col>
      </Row>
      <ChartComponent
        queryParams={{ ...reqForm, unitIds: props.checkedKeys as string[] }}
        chartItem={chartItem}
        chartType={chartType}
      />
      <ComponentTable queryParams={{ ...reqForm, unitIds: props.checkedKeys as string[] }} />
    </div>
  )
}

export default Statistics
