import api from '@/service/api'
import { CalendarOutlined } from '@ant-design/icons'
import { Radio, Space, Button, DatePicker } from 'antd'
import moment from 'moment'
import { Moment } from 'moment'
import React, { useState, useEffect } from 'react'

interface IProps {
  onEmitValue?: Function
  configType: any
  status: string
}
const ElectricParameterReport = (props: IProps) => {
  const [status, setStatus] = useState<any>('DAY')
  const [dates, setDate] = useState<Moment>(moment())
  const [isOpen, setOpen] = useState(false)

  const onChange = (e: any) => {
    setStatus(e.target.value)
    const { onEmitValue = Function } = props
    onEmitValue({ dateType: e.target.value, date: (dates || moment()).format('YYYY-MM-DD') })
  }
  const reset = () => {
    setDate(moment())
    const { onEmitValue = Function } = props
    onEmitValue({ reset: true })
  }
  const search = () => {
    const { onEmitValue = Function } = props
    onEmitValue({ date: (dates || moment()).format('YYYY-MM-DD') })
  }
  const onChangeDate = (date: any, mode: any) => {
    setDate(date)
    if (mode !== 'date' && status === 'DAY') {
      setOpen(false)
    } else if (
      !(mode === 'month' || mode === 'year') &&
      (status === 'WEEK' || status === 'MONTH')
    ) {
      setOpen(false)
    } else if (
      !(mode === 'decade' || mode === 'year') &&
      (status === 'QUARTER' || status === 'YEAR')
    ) {
      setOpen(false)
    }
  }
  const onChangeDay = (date: any, mode: any) => {
    setDate(date)
  }

  useEffect(() => {
    console.log(props.status, 'props.status')
    setStatus(props.status)
  }, [props.status])
  return (
    <Space style={{ marginTop: 12 }}>
      <Radio.Group value={status} onChange={onChange} defaultValue="DAY">
        {props.configType.map((item: any) => (
          <Radio.Button value={item.value} key={item.value}>
            <CalendarOutlined /> {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <DatePicker
        value={dates}
        onPanelChange={onChangeDate}
        onChange={onChangeDay}
        open={isOpen}
        allowClear={false}
        onOpenChange={(status) => {
          if (status) {
            setOpen(true)
          } else {
            setOpen(false)
          }
        }}
        mode={
          status === 'DAY'
            ? 'date'
            : status === 'WEEK' || status === 'MONTH'
            ? 'month'
            : status === 'QUARTER' || status === 'YEAR'
            ? 'year'
            : 'date'
        }
        format={
          status === 'DAY'
            ? 'YYYY-MM-DD'
            : status === 'WEEK' || status === 'MONTH'
            ? 'YYYY-MM'
            : status === 'QUARTER' || status === 'YEAR'
            ? 'YYYY'
            : 'YYYY-MM-DD'
        }
      />

      {/* <DatePicker value={dates} onChange={onChangeDate} /> */}
      <Button type="primary" onClick={search}>
        搜索
      </Button>
      <Button onClick={reset}>重置</Button>
    </Space>
  )
}

export default ElectricParameterReport
