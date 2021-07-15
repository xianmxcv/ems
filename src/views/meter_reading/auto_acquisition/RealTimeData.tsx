import { AppState } from '@/redux/reducers'
import { dataUnits, IAttributeTypeName } from '@/types/common'
import { IResIElectricMeterRealTime, IResIElectricMeter } from '@/types/resType'
import { Table, Row, Col, Input, Space } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { includes, toLower, toUpper } from 'lodash-es'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

interface Iprops {
  checkedKeys: any
  electric: IResIElectricMeter
}
interface IPropsState {
  list: any
}
const RealTimeData = (props: Iprops & IPropsState) => {
  const [searchValue, setSearchValue] = useState<any>('')
  // add 参数验证
  const [tableData, setTabelData] = useState<IResIElectricMeterRealTime[]>([])

  // 表头
  const columns: ColumnType<IResIElectricMeterRealTime>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text: string, record: IResIElectricMeterRealTime, index: number) => (
        <span>{index + 1}</span>
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
    {
      title: '类型',
      dataIndex: 'edDep',
      key: 'edDep',
      align: 'left',
      ellipsis: true,
      render: (text, row: IResIElectricMeterRealTime) => IAttributeTypeName[row.attrType],
      width: 80,
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
      width: 60,
      render: (text, row: IResIElectricMeterRealTime) => dataUnits[row.unit],
    },
    {
      title: '采集时间',
      dataIndex: 'collectDate',
      key: 'collectDate',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, row: IResIElectricMeterRealTime) => {
        return moment(row.collectDate).format('YY-MM-DD HH:mm:ss')
      },
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
  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (value) {
      const list: IResIElectricMeterRealTime[] = []
      props.list.forEach((ele: IResIElectricMeterRealTime) => {
        const status = includes(ele.attrName, value)
        if (status) list.push(ele)
      })
      setTabelData(list)
    }
  }

  useEffect(() => {
    if (!searchValue) {
      setTabelData(props.list)
    } else {
      const list: IResIElectricMeterRealTime[] = []
      props.list.forEach((ele: IResIElectricMeterRealTime) => {
        const status =
          includes(ele.attrName, searchValue) ||
          includes(ele.attrName, toUpper(searchValue)) ||
          includes(ele.attrName, toLower(searchValue))
        if (status) list.push(ele)
      })
      setTabelData(list)
    }
  }, [props.list, searchValue])

  return (
    <div>
      {/* {JSON.stringify(tableData)} */}
      <Row align="middle" style={{ paddingBottom: 12 }} justify="space-between">
        <Col>自动采集实时数据列表</Col>
        <Col>
          <Space>
            属性名称：
            <Input.Search
              placeholder="电能属性"
              onSearch={handleSearch}
              allowClear /* onChange={onChange} */
            />
          </Space>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={tableData}
        size="small"
        scroll={{ x: 'scroll' }}
        pagination={false}
        rowKey="attrName"
      />
    </div>
  )
}

// export default RealTimeData
export default connect((state: AppState) => {
  return {
    list: state.meterState.list,
  }
})(RealTimeData)
