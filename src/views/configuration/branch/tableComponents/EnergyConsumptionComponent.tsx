import api from '@/service/api'
import { IResEnergyDevice as TableEnergyDevice } from '@/types/resType'
import { handleDownFilePost } from '@/utils/downfile'
import { UploadOutlined } from '@ant-design/icons'
import { Table, Row, Col, Input, Space, Button, message } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { replace, trim, trimEnd } from 'lodash-es'
import React, { useState, useCallback, useEffect } from 'react'
interface Iprops {
  checkedKeys: any
}

const EnergyConsumptionComponent = (props: Iprops) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>(props.checkedKeys)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [searchValue, setSearchValue] = useState<any>({})
  const [tableData, setTabelData] = useState<TableEnergyDevice[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [exportLoading, setExportLoading] = useState(false)
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }

  const columns: ColumnType<TableEnergyDevice>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => (
        <span>{current && size && (current - 1) * size + index + 1}</span>
      ),
    },
    {
      title: '设备名称',
      dataIndex: 'edName',
      key: 'edName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '所属分项',
      dataIndex: 'itemName',
      key: 'itemName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '额定电压',
      dataIndex: 'edVoltage',
      key: 'edVoltage',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => <span>{record.edVoltage}V</span>,
    },
    {
      title: '额定输入功率',
      dataIndex: 'edInputPower',
      key: 'edInputPower',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => <span>{record.edInputPower}W</span>,
    },
    {
      title: '额定输入电流',
      dataIndex: 'edInputElectric',
      key: 'edInputElectric',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => <span>{record.edInputElectric}A</span>,
    },
    {
      title: '最大输入功率',
      dataIndex: 'edMaxPower',
      key: 'edMaxPower',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => <span>{record.edMaxPower}W</span>,
    },
    {
      title: '最大输入电流',
      dataIndex: 'edMaxElectric',
      key: 'edMaxElectric',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => <span>{record.edMaxElectric}A</span>,
    },
    {
      title: '上级支路名称',
      dataIndex: 'rchainName',
      key: 'rchainName',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (_text: any, record: TableEnergyDevice, index: number) => {
        return <span>{replace(trimEnd(record.ecChainName || '--', ','), /,/g, '-')}</span>
      },
    },
  ]
  const handleSearch = (value1: string) => {
    const value = trim(value1)
    if (value) {
      setSearchValue({ edName: value })
      setCurrent(1)
    } else {
      setSearchValue({})
      setCurrent(1)
    }
  }
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setSize(Number(pagination.pageSize))
    setCurrent(Number(pagination.current))
  }
  const exportTable = async (event: any) => {
    setExportLoading(true)
    await handleDownFilePost(event, `/energy-config/energy-device/export`, {
      ecIds: checkedKeys,
      edIds: selectedRowKeys,
      order: 1,
      ...searchValue,
    })
    setExportLoading(false)
  }

  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const o = checkedKeys.length ? { ecIds: checkedKeys } : {}
      const res = await api.postEnergyDeviceList({
        size,
        current,
        ...o,
        ...searchValue,
        order: 1,
      })
      if (res.data) {
        setTabelData(res.data.records)
        setTotal(res.data.total)
      }
    } catch (err) {
      setTabelData([])
      message.error(err)
    } finally {
      setLoading(false)
    }
  }, [size, current, checkedKeys, searchValue])

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
        <Col span={18} push={6} style={{ textAlign: 'right' }}>
          <Space>
            <Input.Search onSearch={handleSearch} allowClear placeholder="设备名称/所属分项" />
            <Button onClick={(event) => exportTable(event)} loading={exportLoading}>
              <UploadOutlined /> 导出
            </Button>
          </Space>
        </Col>
        <Col span={6} pull={18}>
          重点能耗设备列表
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
        rowKey="edId"
      />
    </div>
  )
}

export default EnergyConsumptionComponent
