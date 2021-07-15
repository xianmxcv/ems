import api from '@/service/api'
import { dataUnits, ITemplateAttrTagName } from '@/types/common'
import { IReqTransformDetailPage } from '@/types/reqType'
import { ElectricMeterAttrVO } from '@/types/resType'
import { Table, Row, Col, Input, Space, message } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import React, { useState, useCallback, useEffect } from 'react'
import styles from './index.module.less'
interface IState {
  emId: string
  emName: string
}

const ElectricMeterDetail = (props: IState) => {
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [queryParams, setQueryParmas] = useState<IReqTransformDetailPage>({
    current: 1,
    inputName: '',
    emId: '',
    attrName: '',
    size: 10,
  })
  const [tableData, setTabelData] = useState<ElectricMeterAttrVO[]>([])
  const [name, setName] = useState<string>('')
  // 表头
  const columns: ColumnType<ElectricMeterAttrVO>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => (
        <span>{current && queryParams.size && (current - 1) * queryParams.size + index + 1}</span>
      ),
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
      title: '采集周期(*100ms)',
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
    },
  ]
  // 搜索
  const handleSearch = (value: string) => {
    setName(value)
  }
  // 参数等变动
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setQueryParmas({
      ...queryParams,
      current: pagination.current ? pagination.current : current,
      size: pagination.pageSize ? Number(pagination.pageSize) : queryParams.size,
    })
    setCurrent(pagination.current ? pagination.current : current)
  }
  // 获取设备列表
  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getElectricMeterDetail({
        ...queryParams,
        emId: props.emId,
        attrName: name,
      })
      if (res.data) {
        setTabelData(res.data.records)
        setTotal(res.data.total)
      }
    } catch (err) {
      message.error(err)
    } finally {
      setLoading(false)
    }
  }, [props.emId, queryParams, name])

  useEffect(() => {
    getList()
  }, [getList])

  return (
    <div>
      <Row align="middle" className={styles.ammeter} style={{ paddingBottom: 12 }}>
        <Col span={6}>电表型号：{props.emName} 电参数详情</Col>
        <Col span={18} style={{ textAlign: 'right' }} className={styles['operate-button']}>
          <Space>
            <Input.Search onSearch={handleSearch} placeholder="属性名称" allowClear />
          </Space>
        </Col>
        <Col span={24} style={{ marginTop: 16 }}>
          <Table
            loading={loading}
            dataSource={tableData}
            size="small"
            bordered
            columns={columns}
            onChange={handleTableChange}
            scroll={{ y: 200 }}
            pagination={{
              current: queryParams.current,
              pageSize: queryParams.size,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: () => <span>共 {total} 条</span>,
            }}
            rowKey="attrName"
          />
        </Col>
      </Row>
    </div>
  )
}

export default ElectricMeterDetail
