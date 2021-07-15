import { IReqDeviceComsumption } from '@/types/reqType'
import { Row, Col, DatePicker, Form, Radio, message } from 'antd'
import moment from 'moment'
import React, { useState, Key } from 'react'
import ChartComponent from './chart'
const { RangePicker } = DatePicker
import ComponentTable from './table'
interface IProps {
  checkedKeys: Key[]
}
const Compare = (props: IProps) => {
  const [form] = Form.useForm()
  const { setFieldsValue } = form
  const [reqForm, setReqForm] = useState<IReqDeviceComsumption>({
    dateType: 'MONTH',
    compareType: 'YoY',
    begin: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    unitIds: [],
  })
  const changeDate = (dates: any, dateStrings: any) => {
    if (reqForm.dateType === 'MONTH') {
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
    if (e.target.value === 'MONTH') {
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
  const changeCompareType = (e: any) => {
    setReqForm({ ...reqForm, compareType: e.target.value })
  }
  return (
    <div style={{ padding: '8px' }}>
      <Row>
        <Col span={24}>
          <Form name="basic" layout="inline" form={form}>
            <Form.Item label="统计维度" name="dateType" initialValue="MONTH">
              <Radio.Group onChange={changeType}>
                <Radio.Button value="MONTH">月</Radio.Button>
                <Radio.Button value="YEAR">年</Radio.Button>
              </Radio.Group>
            </Form.Item>
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
          <Radio.Group defaultValue="YoY" onChange={changeCompareType}>
            <Radio.Button value="YoY">同比</Radio.Button>
            <Radio.Button value="MoM">环比</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <ChartComponent
        queryParams={{ ...reqForm, unitIds: props.checkedKeys as string[] }}
        chartItem={[]}
        chartType="bar"
      />
      <ComponentTable queryParams={{ ...reqForm, unitIds: props.checkedKeys as string[] }} />
    </div>
  )
}

export default Compare
