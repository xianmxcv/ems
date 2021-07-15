import api from '@/service/api'
import { dataUnits, IAttributeTypeName } from '@/types/common'
import { IResIElectricMeterPageHistory, IResIElectricMeter } from '@/types/resType'
import { Table, Row, Col, Input, Space, message, DatePicker } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { omit } from 'lodash-es'
import moment from 'moment'
import React, { useState, useCallback, useEffect } from 'react'

interface Iprops {
  checkedKeys: any
  electric: IResIElectricMeter
}

const HistoricalData = (props: Iprops) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>(props.checkedKeys)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [queryParams, setQueryParams] = useState<any>({})
  // add 参数验证
  const [tableData, setTabelData] = useState<IResIElectricMeterPageHistory[]>([])
  const [dates, setDates] = useState<any>([])
  const [filtered, setFiltered] = useState<Partial<Record<'电参数' | '电能', string[]>>>()
  const [attrType, setAttrType] = useState('')

  const columns: ColumnType<IResIElectricMeterPageHistory>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text: string, record: IResIElectricMeterPageHistory, index: number) => (
        <span>{current && size && (current - 1) * size + index + 1}</span>
      ),
    },
    {
      title: '电表名称',
      dataIndex: 'thingName',
      key: 'thingName',
      align: 'left',
      ellipsis: true,
      width: 120,
      // render: () => props.electric.emName,
    },
    // {
    //   title: '实例名称',
    //   dataIndex: 'thingName',
    //   key: 'thingName',
    //   align: 'left', IAttributeTypeName
    //   ellipsis: true,
    // },
    {
      title: '类型',
      dataIndex: 'attrType',
      key: 'attrType',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, row: IResIElectricMeterPageHistory) => IAttributeTypeName[row.attrType],
      filters: [
        ...Object.entries(IAttributeTypeName).map((ele) => ({
          value: ele[0],
          text: ele[1],
        })),
      ],
      filteredValue: filtered ? filtered['电参数'] : null,
      filterMultiple: false,
    },
    {
      title: '属性',
      dataIndex: 'attrName',
      key: 'attrName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '值',
      dataIndex: 'attrValue',
      key: 'attrValue',
      align: 'left',
      ellipsis: true,
      width: 80,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      align: 'left',
      ellipsis: true,
      render: (text, row: IResIElectricMeterPageHistory) => dataUnits[row.unit],
      width: 60,
    },
    {
      title: '采集时间',
      dataIndex: 'collectDate',
      key: 'collectDate',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, row: IResIElectricMeterPageHistory) =>
        row.collectDate ? moment(row.collectDate).format('YY-MM-DD HH:mm:ss') : '--',
    },
    {
      title: '采集频率（*100ms）',
      dataIndex: 'collectionInterval',
      key: 'collectionInterval',
      align: 'left',
      ellipsis: true,
      width: 150,
    },
  ]
  const handleSearch = (value: any) => {
    setQueryParams({ ...queryParams, attrName: value })
    setCurrent(1)
  }
  const handleTableChange = (pagination: TablePaginationConfig, filter: any) => {
    filter.attrType ? setAttrType(filter.attrType[0]) : setAttrType('')
    setSize(Number(pagination.pageSize))
    setCurrent(Number(pagination.current))
    setFiltered(filter)
  }
  const onChangeDate = (date: any, dateString: any) => {
    if (date) {
      const [mrecTimeStart, mrecTimeEnd] = date
      setQueryParams({ ...queryParams, mrecTimeStart, mrecTimeEnd })
    } else {
      setQueryParams({ ...omit(queryParams, ['mrecTimeStart', 'mrecTimeEnd']) })
    }
  }

  const getList = useCallback(async () => {
    setLoading(true)
    const o = checkedKeys.length ? { emId: checkedKeys[0] } : {}
    const attrTypeO = attrType ? { attrType: parseInt(attrType) } : {}
    try {
      const res = await api.getElectricMeterHistory({
        size,
        current,
        ...o,
        ...attrTypeO,
        ...queryParams,
      })
      if (res.data) {
        setTabelData(res.data?.records?.map((ele, index) => ({ ...ele, rowKey: index })))
        setTotal(res.data.total)
      }
    } catch (err) {
      setTabelData([])
      message.error(err)
    } finally {
      setLoading(false)
    }
  }, [size, current, checkedKeys, queryParams, attrType])
  const disabledDate = (current: any) => {
    if (!dates || dates.length === 0) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7
    return tooEarly || tooLate
  }
  useEffect(() => {
    getList()
  }, [getList])
  useEffect(() => {
    setCheckedKeys(props.checkedKeys)
    setCurrent(1)
  }, [props.checkedKeys])
  return (
    <div>
      <Row align="middle" style={{ paddingBottom: 12 }}>
        <Col span={19} push={5} style={{ textAlign: 'right' }}>
          <Space>
            <div style={{ width: 110 }}>采集时间：</div>
            <DatePicker.RangePicker
              disabledDate={disabledDate}
              onChange={onChangeDate}
              showTime
              style={{ width: 330 }}
              onCalendarChange={(value) => {
                setDates(value)
              }}
            />
            <Input.Search allowClear placeholder="电能属性" onSearch={handleSearch} />
          </Space>
        </Col>
        <Col span={5} pull={19}>
          自动采集历史列表
        </Col>
      </Row>
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        size="small"
        scroll={{ x: 'scroll' }}
        onChange={handleTableChange}
        pagination={{
          current: current,
          pageSize: size,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: () => <span>共 {total} 条</span>,
        }}
        rowKey="rowKey"
      />
    </div>
  )
}

export default HistoricalData
