import api from '@/service/api'
import { IResEnergyDevice } from '@/types/resType'
import { handleDownFilePost } from '@/utils/downfile'
import { UploadOutlined } from '@ant-design/icons'
import { Table, Row, Col, Input, Space, Button, message, Card } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { replace, trimEnd, values } from 'lodash-es'
import React, { useState, useCallback, useEffect, Key } from 'react'
import styles from '../index.module.less'
interface IState {
  regionIds: Key[]
}

const KeyEnergyConsumingDeviceInfo = (props: IState) => {
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  // add 参数验证
  const [queryParams, setQueryParmas] = useState({ current: 1, size: 10 })
  const [tableData, setTabelData] = useState<IResEnergyDevice[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [edName, setEdName] = useState<string>('')
  const [exportLoading, setExportLoading] = useState(false)
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }
  // 表头
  const columns: ColumnType<IResEnergyDevice>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'left',
      render: (text, record, index) => (
        <span>{(queryParams.current - 1) * queryParams.size + index + 1} </span>
      ),
    },
    {
      title: '设备名称',
      dataIndex: 'edName',
      key: 'edName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '所属分项',
      dataIndex: 'itemName',
      key: 'itemName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '额定电压',
      dataIndex: 'edVoltage',
      key: 'edVoltage',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '额定输入功率',
      dataIndex: 'edInputPower',
      key: 'edInputPower',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '额定输入电流',
      dataIndex: 'edInputElectric',
      key: 'edInputElectric',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '最大输入功率',
      dataIndex: 'edMaxPower',
      key: 'edMaxPower',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '最大输入电流',
      dataIndex: 'edMaxElectric',
      key: 'edMaxElectric',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '区域位置',
      dataIndex: 'rchainName',
      key: 'rchainName',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{replace(trimEnd(record.rchainName || '--', ','), /,/g, '-')}</span>
      ),
    },
  ]
  // 搜索
  const handleSearch = (value: string) => {
    setEdName(value)
  }
  // 参数等变动
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setQueryParmas({
      ...queryParams,
      size: Number(pagination.pageSize),
      current: Number(pagination.current),
    })
  }
  const exportTable = async (event: any) => {
    setExportLoading(true)
    await handleDownFilePost(event, `/energy-config/energy-device/export`, {
      regionIds: props.regionIds,
      erIds: selectedRowKeys,
      edName: edName,
    })
    setExportLoading(false)
  }

  // 获取设备列表
  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.postEnergyDeviceList({
        ...queryParams,
        edName,
        regionIds: props.regionIds as string[],
      })
      if (res.data) {
        setTabelData(res.data.records)
        setTotal(res.data.total)
        if (res.data.records.length === 0 && res.data.total > 0) {
          setQueryParmas({ ...queryParams, current: queryParams.current - 1 })
        }
      }
    } catch (err) {
      message.error(err)
    } finally {
      setLoading(false)
    }
  }, [queryParams, edName, props.regionIds])

  useEffect(() => {
    getList()
  }, [getList])

  return (
    <>
      <Card>
        <Row align="middle" style={{ paddingBottom: 12 }}>
          <Col span={6}>重点能耗设备列表</Col>
          <Col span={18} style={{ textAlign: 'right' }} className={styles['operate-button']}>
            <Space>
              <Input.Search onSearch={handleSearch} allowClear placeholder="设备名称/设备分项" />
              <Button onClick={(event) => exportTable(event)} loading={exportLoading}>
                <UploadOutlined /> 导出
              </Button>
            </Space>
          </Col>
          <Col span={24} style={{ marginTop: 8 }}>
            <Table
              loading={loading}
              dataSource={tableData}
              size="small"
              bordered
              columns={columns}
              onChange={handleTableChange}
              rowSelection={rowSelection}
              pagination={{
                current: queryParams.current,
                pageSize: queryParams.size,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: () => <span>共 {total} 条</span>,
              }}
              rowKey="edName"
            />
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default KeyEnergyConsumingDeviceInfo
