import api from '@/service/api'
import { ITreeData, IResNoWorkDay } from '@/types/resType'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { Button, Row, Col, Space, DatePicker, Input, Calendar, Tree, message } from 'antd'
import { filter, find, findIndex, isEmpty, last } from 'lodash-es'
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

const initDate = moment(moment().format('YYYY-MM'))
const initDate1 = initDate.clone().add(1, 'months')

const NoWorkDayComponent = () => {
  const [treeData, setTreeData] = useState<Array<ITreeData>>([])
  const [defaultDate, setDefaultDate] = useState<Moment>(initDate.clone())
  const [validRange1, setValidRange1] = useState<Moment>(initDate)
  const [validRange2, setValidRange2] = useState<Moment>(initDate1)
  const [disableDate, setDisableDate] = useState<string[]>([])
  const [queryParams, setQueryParams] = useState<any>({})
  const [days, setDays] = useState<Array<IResNoWorkDay>>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [depIds, setDepId] = useState<any[]>([])
  const [isLast, setIsLast] = useState<boolean>(false)
  // const [isLoading, setLoading] = useState<boolean>(false)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const getList = async () => {
    try {
      const { data = [] } = await api.getDepartmentList()
      const [{ key = '', children = [] } = {}] = data
      if (!children.length) {
        setIsLast(true)
      }
      setSelectedKeys([key])
      setDepId([key])
      setQueryParams({ depIds: [key], date: initDate.format('YYYY-MM') })
      setTreeData(data)
    } catch (error) {
      message.error(error)
    }
  }

  const addNoWork = async (query: any) => {
    if (query.depId) {
      try {
        await api.addNoWork(query)
      } catch (error) {
        message.error(error)
      }
    }
  }
  const delNoWork = async (query: any) => {
    if (query.id) {
      try {
        await api.delNoWork(query.id)
      } catch (error) {
        message.error(error)
      }
    }
  }
  const getNoWork = async (query: any) => {
    if (isEmpty(query.depIds)) return

    setValidRange1(moment(query.date))
    setValidRange2(moment(query.date).add(1, 'months').subtract(1, 'days'))
    try {
      const { data = [] } = await api.postNoWork(query)
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

  const onSelect = (checkedkeys: any, e: any) => {
    const { node: { children = [] } = {} } = e
    const depIdLast: any = last(checkedkeys)
    if (depIdLast) {
      if (children.length) {
        setIsLast(false)
      } else {
        setIsLast(true)
      }
      setSelectedKeys([depIdLast])
      setQueryParams({ ...queryParams, depIds: [depIdLast] })
      setDepId([depIdLast])
    } else {
      setDepId([])
      setSelectedKeys([])
    }
  }
  // 自定义头部
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
      setQueryParams({ ...queryParams, date })
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
      return (
        <Row className={styles.calendar_workday} onClick={() => setNoWork(date)}>
          <div
            style={{
              color: '#000',
              fontSize: 24,
              paddingRight: 8,
              height: 36,
              width: '100%',
              textAlign: 'right',
            }}
          >
            {moment(date).date()}
          </div>
        </Row>
      )
    } else {
      return (
        <Row className={styles.calendar_noworkday} onClick={() => setNoWork(date)}>
          <div
            style={{
              color: '#000',
              fontSize: 24,
              paddingRight: 8,
              height: 36,
              width: '100%',
              backgroundColor: '#f5f5f5',
              textAlign: 'right',
            }}
          >
            {moment(date).date()}
          </div>
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
        onClick={() => getNoWork({ depIds, date: date.format('YYYY-MM') })}
      />
    )
  }

  const setNoWork = async (date: Moment) => {
    if (moment(date).month() !== moment(validRange1).month()) return
    if (!isLast) return
    const dateDtr = date.format('YYYY-MM-DD')
    const dateCopy = date.format('YYYY-MM')
    const indexCopy1 = findIndex(disableDate, (ele) => ele === date.format('YYYY-MM-DD'))
    if (indexCopy1 !== -1) return
    disableDate.push(dateDtr)
    setDisableDate(disableDate)
    const index = findIndex(days, (ele) => ele.nwdDay === date.format('YYYY-MM-DD'))
    if (index === -1) {
      await addNoWork({ nwdDay: dateDtr, depId: depIds[0] })
    } else {
      await delNoWork({ nwdDay: dateDtr, id: days[index].nwdId })
    }
    await getNoWork({ depIds, date: dateCopy })
    const indexCopy = findIndex(disableDate, (ele) => ele === date.format('YYYY-MM-DD'))
    disableDate.splice(indexCopy, 1)
    setDisableDate(disableDate)
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
  const onChangeSearch = (e: any) => {
    const { value } = e.target
    const expandedKeys = treeData
      .map((item: ITreeData) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(value, treeData)
        } else if (item.children) {
          return getParentKey(value, treeData)
        }
        return null
      })
      .filter((item: any, i: any, self: ITreeData[]) => item && self.indexOf(item) === i)
    setExpandedKeys(expandedKeys)
  }
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue)
  }
  useEffect(() => {
    getList()
  }, [])
  useEffect(() => {
    getNoWork(queryParams)
  }, [queryParams])
  return (
    <div>
      <Row>
        <Col
          style={{ width: 300, marginRight: 16, height: '100%', overflow: 'auto' }}
          className={styles.right_border}
        >
          <Row align="middle" style={{ padding: 14, backgroundColor: 'rgba(249, 249, 249, 1)' }}>
            部门名称
          </Row>
          <div style={{ padding: '12px' }}>
            <Input.Search
              style={{ marginBottom: 8 }}
              placeholder="部门名称"
              onChange={onChangeSearch}
            />
            <Tree
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              autoExpandParent={true}
              onSelect={onSelect}
              onExpand={onExpand}
              treeData={treeData}
            />
          </div>
        </Col>
        <Col style={{ width: 'calc(100% - 316px)' }} className={styles.other_calendar}>
          <Calendar
            defaultValue={defaultDate}
            headerRender={({ value, type, onChange, onTypeChange }) =>
              headerRender(value, type, onChange, onTypeChange)
            }
            validRange={[validRange1, validRange2]}
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
