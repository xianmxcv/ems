import api from '@/service/api'
import { dataUnits, ITemplateAttrTagName } from '@/types/common'
import { ElectricMeterAttrVO, IElectricMeter } from '@/types/resType'
import { Table, Row, Col, Input, Space, message } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { trim } from 'lodash-es'
import React, { useState, useCallback, useEffect } from 'react'
interface Iprops {
  info: IElectricMeter | undefined
}

const AmmeterDetailComponent = (props: Iprops) => {
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  // add 参数验证
  const [attrName, setAttrName] = useState<string>('')
  const [tableData, setTabelData] = useState<ElectricMeterAttrVO[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }
  // 表头
  const columns: ColumnType<ElectricMeterAttrVO>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '属性名称',
      dataIndex: 'attrName',
      key: 'attrName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '标签类型',
      dataIndex: 'attrType',
      key: 'attrType',
      align: 'left',
      ellipsis: true,
      render: (text, record) => ITemplateAttrTagName[record.attrType],
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '单位',
      dataIndex: 'attrUnit',
      key: 'attrUnit',
      align: 'left',
      ellipsis: true,
      render: (text, record) => dataUnits[record.attrUnit],
    },
    {
      title: '默认数据',
      dataIndex: 'defaultData',
      key: 'defaultData',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '采集周期（*100ms）',
      dataIndex: 'collectionInterval',
      key: 'collectionInterval',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'attrDesc',
      key: 'attrDesc',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => <span>{record.attrDesc || '--'}</span>,
    },
  ]
  // 搜索
  const handleSearch = (value: string) => {
    setAttrName(trim(value))
  }
  // 参数等变动
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setSize(Number(pagination.pageSize))
    setCurrent(Number(pagination.current))
  }
  // 获取设备列表
  const getList = useCallback(async () => {
    if (!props.info?.emId) {
      setTabelData([])
      setTotal(0)
      return
    }
    setLoading(true)
    try {
      // const o = attrName ? { attrName, inputName: attrName, emName: attrName } : {}
      const o = attrName ? { attrName } : {}
      const res = await api.getElectricMeterDetail({ emId: props.info.emId, size, current, ...o })
      if (res.data) {
        setTabelData(res.data.records)
        setTotal(res.data.total)
      }
    } catch (err) {
      // ce shi
      setTabelData([])
      message.error(err)
    } finally {
      setLoading(false)
    }
  }, [size, current, props.info, attrName])

  useEffect(() => {
    getList()
  }, [getList])
  useEffect(() => {
    setCurrent(1)
  }, [props.info])

  return (
    <div>
      <Row align="middle" style={{ paddingBottom: 12 }}>
        <Col span={18} push={6} style={{ textAlign: 'right' }}>
          <Space>
            <Input.Search onSearch={handleSearch} allowClear placeholder="属性名称" />
          </Space>
        </Col>
        <Col span={6} pull={18}>
          电表型号：{props.info?.emName || '-'} 电参数详情
        </Col>
      </Row>
      <Table
        loading={loading}
        dataSource={tableData}
        size="small"
        bordered
        columns={columns}
        onChange={handleTableChange}
        rowSelection={rowSelection}
        scroll={{ x: 'scroll' }}
        pagination={{
          current: current,
          pageSize: size,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: () => <span>共 {total} 条</span>,
        }}
        rowKey="attrName"
      />
    </div>
  )
}

export default AmmeterDetailComponent
