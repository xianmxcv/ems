import api from '@/service/api'
import { handleDownFilePost } from '@/utils/downfile'
import { UploadOutlined } from '@ant-design/icons'
import { Table, Row, Col, Input, Space, Button, message } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { trim } from 'lodash-es'
import React, { useState, useCallback, useEffect } from 'react'
interface EnergyDevice {
  edName: string
  edItem: string
  edVoltage: number | null
  edInputPower: number | null
  edInputElectric: number | null
  edMaxPower: number | null
  edMaxElectric: number | null
}
interface TableEnergyDevice extends EnergyDevice {
  ecId?: string
  edId?: string
  edRegionid: string
  edDepid: string
}
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
  // add 参数验证
  const [tableData, setTabelData] = useState<TableEnergyDevice[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [exportLoading, setExportLoading] = useState(false)
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }
  // 表头
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
      title: '能耗部门',
      dataIndex: 'edDep',
      key: 'edDep',
      align: 'left',
      ellipsis: true,
      render: (text, record: any, index) => <span>{record.edDep || '--'}</span>,
      width: 120,
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
      depIds: checkedKeys,
      edIds: selectedRowKeys,
      ...searchValue,
    })
    setExportLoading(false)
  }
  const getList = useCallback(async () => {
    setLoading(true)
    const o = checkedKeys.length ? { depIds: checkedKeys } : {}
    try {
      const res = await api.postEnergyDeviceList({
        size,
        current,
        ...o,
        ...searchValue,
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
            <Input.Search onSearch={handleSearch} allowClear placeholder="设备名称/设备分项" />
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
        scroll={{ x: 'scroll' }}
        rowSelection={rowSelection}
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
