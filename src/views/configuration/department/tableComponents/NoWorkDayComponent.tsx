import api from '@/service/api'
import { ITreeData, IResNoWorkDay } from '@/types/resType'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { Button, Row, Col, Space, DatePicker, Calendar, message } from 'antd'
import { filter, find, isEmpty, omit } from 'lodash-es'
import moment, { Moment } from 'moment'
import React, { useState, useEffect } from 'react'
import styles from './index.module.less'

const colors = [
  '#2894FF',
  '#FFA042',
  '#9D9D9D',
  '#FF5809',
  '#FF2D2D',
  '#FF79BC',
  '#B15BFF',
  '#FF00FF',
  '#4A4AFF',
  '#D3FF93',
  '#408080',
  '#9F4D95',
  '#9F4D95',
  '#804040',
  '#842B00',
]

interface Iprops {
  checkedKeys: any
}

const initDate = moment(moment().format('YYYY-MM'))
const initDate1 = initDate.clone().add(1, 'months')
const NoWorkDayComponent = (props: Iprops) => {
  const [validRange1, setValidRange1] = useState<Moment>(initDate)
  const [validRange2, setValidRange2] = useState<Moment>(initDate1)
  const [defaultDate, setDefaultDate] = useState<Moment>(initDate.clone())
  const [queryParams, setQueryParams] = useState<any>({ date: initDate.format('YYYY-MM') })
  const [days, setDays] = useState<Array<IResNoWorkDay>>([])

  const getNoWork = async (query: any) => {
    const o = isEmpty(query.depIds) ? omit(query, ['depIds']) : query
    setValidRange1(moment(query.date))
    setValidRange2(moment(query.date).add(1, 'months').subtract(1, 'days'))
    try {
      const { data = [] } = await api.postNoWork({ ...o })
      setDays(
        data.map((ele: IResNoWorkDay) => ({
          ...ele,
          nwdDay: moment(ele.nwdDay).format('YYYY-MM-DD'),
        }))
      )
    } catch (error) {
      message.error(error)
    }
  }

  const headerRender = (
    value: Moment,
    type: string,
    onChange: Function,
    onTypeChange: Function
  ): React.ReactNode => {
    const onChangeTime = (time: any) => {
      const newValue = time.clone()
      onChange(newValue.month(newValue.month()))
      onChange(newValue.year(newValue.year()))
      const date = newValue.format('YYYY-MM')
      setQueryParams({ date })
    }
    const month = value.month()
    const year = value.year()
    return (
      <div style={{ padding: 8 }}>
        <Row align="middle" justify="space-between" style={{ paddingBottom: 12 }}>
          <Col>
            <Space>
              <div className={`${styles.noworkday} ${styles.day}`}>非工作日</div>
              <div className={`${styles.workday} ${styles.day}`}>工作日</div>
            </Space>
          </Col>
          <Col />
        </Row>
        <Row align="middle" justify="space-between" gutter={8} style={{ height: 80 }}>
          <Col>
            <Button
              type="text"
              onClick={() => {
                const newValue = value.clone()
                let newValue1 = value.clone()
                let date = ''
                if (month - 1 >= 0) {
                  newValue1 = moment(newValue).month(month - 1)
                } else {
                  newValue1 = moment(newValue)
                    .year(year - 1)
                    .month(11)
                }
                onChange(newValue1)
                date = newValue1.clone().format('YYYY-MM')
                setQueryParams({ ...queryParams, date })
              }}
            >
              <ArrowLeftOutlined />
            </Button>
          </Col>
          <Col style={{ fontSize: 28 }}>
            <DatePicker
              style={{ fontSize: 28, width: 150 }}
              picker="month"
              value={value}
              inputReadOnly
              onChange={(val) => onChangeTime(val)}
              suffixIcon=""
              allowClear={false}
            />
          </Col>
          <Col>
            <Button
              type="text"
              onClick={() => {
                const newValue = value.clone()
                let newValue1 = value.clone()
                let date = ''
                if (month + 1 < 12) {
                  newValue1 = moment(newValue).month(month + 1)
                } else {
                  newValue1 = moment(newValue)
                    .year(year + 1)
                    .month(0)
                }
                onChange(newValue1)
                date = newValue1.clone().format('YYYY-MM')
                setQueryParams({ ...queryParams, date })
              }}
            >
              <ArrowRightOutlined />
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
  const dateCellRender = (date: Moment): React.ReactNode => {
    const day = find(days, (ele) => ele.nwdDay === date.format('YYYY-MM-DD'))
    const dayList = filter(days, (ele) => ele.nwdDay === date.format('YYYY-MM-DD'))
    if (!day) {
      return <Row className={styles.calendar_workday} />
    } else {
      return (
        <Row className={styles.calendar_noworkday}>
          <ul className={styles.events}>
            {dayList.map((item, index) => (
              <li key={index} style={{ color: colors[index] }} className={styles.ellipsis}>
                {(item || {}).depName}
              </li>
            ))}
          </ul>
        </Row>
      )
    }
  }
  const monthCellRender = (date: Moment): React.ReactNode => {
    return (
      <Row
        style={{ height: '100%' }}
        onClick={() => setQueryParams({ date: date.format('YYYY-MM') })}
      />
    )
  }

  const onSelectDate = async (date: Moment) => {
    setDefaultDate(date)
  }
  const getParentKey = (value: string, tree: ITreeData[]): any => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some((item: ITreeData) => (item.title || '').indexOf(value) > -1)) {
          parentKey = node.key
        } else if (getParentKey(value, node.children)) {
          parentKey = getParentKey(value, node.children)
        }
      }
    }
    return parentKey
  }

  useEffect(() => {
    getNoWork({ ...queryParams, depIds: props.checkedKeys })
  }, [props.checkedKeys, queryParams])
  return (
    <div>
      <Row style={{ fontSize: 18 }}>
        <Col className={styles.other_calendar}>
          <Calendar
            validRange={[validRange1, validRange2]}
            defaultValue={defaultDate}
            headerRender={({ value, type, onChange, onTypeChange }) =>
              headerRender(value, type, onChange, onTypeChange)
            }
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
            onSelect={(date) => onSelectDate(date)}
          />
        </Col>
      </Row>
    </div>
  )
}

export default NoWorkDayComponent
