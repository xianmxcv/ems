import ButtonComponent from '@/component/button'
import api from '@/service/api'
import { IelectricMeterTypeName, IMeterType } from '@/types/common'
import { IElectricMeter } from '@/types/resType'
import { handleDownFilePost } from '@/utils/downfile'
import { UploadOutlined, RightCircleOutlined } from '@ant-design/icons'
import { Table, Row, Col, Input, Space, Button, message, Drawer } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { replace, trim, trimEnd } from 'lodash-es'
import React, { useState, useCallback, useEffect } from 'react'
import AmmeterDetailComponent from './AmmeterDetailComponent'
interface Iprops {
  checkedKeys: any
}

const AmmeterListComponent = (props: Iprops) => {
  const [detailVisible, setDetailVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [searchValue, setSearchValue] = useState<any>({})
  const [checkedKeys, setCheckedKeys] = useState<string[]>(props.checkedKeys)
  // add 参数验证
  // const [queryParams, setQueryParmas] = useState({ current: 1, size: 10 })
  const [tableData, setTabelData] = useState<IElectricMeter[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }
  const [info, setEmIdInfo] = useState<IElectricMeter | undefined>()
  const [exportLoading, setExportLoading] = useState(false)
  // 表头
  const columns: ColumnType<IElectricMeter>[] = [
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
      title: '电表名称',
      dataIndex: 'emName',
      key: 'emName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '编码',
      dataIndex: 'emCode',
      key: 'emCode',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'emType',
      key: 'emType',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (_text: any, record: IElectricMeter, index: number) =>
        IelectricMeterTypeName[record.emType],
    },
    {
      title: '生产厂家',
      dataIndex: 'emManufacturer',
      key: 'emManufacturer',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '型号',
      dataIndex: 'emModel',
      key: 'emModel',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '上级支路',
      dataIndex: 'ecChainName',
      key: 'ecChainName',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (_text: any, record: IElectricMeter, index: number) => {
        return <span>{replace(trimEnd(record.ecChainName || '--', ','), /,/g, '-')}</span>
      },
    },
    {
      title: '电箱号',
      dataIndex: 'emCabinetCode',
      key: 'emCabinetCode',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '电箱名称',
      dataIndex: 'emCabinetName',
      key: 'emCabinetName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '关联网关',
      dataIndex: 'ecnNameStr',
      key: 'ecnNameStr',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'emDesc',
      key: 'emDesc',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => <span>{record.emDesc || '--'}</span>,
    },
    {
      title: '操作',
      dataIndex: ' ',
      key: ' ',
      align: 'center',
      width: 90,
      render: (_text: any, record: IElectricMeter, index: number) => {
        return (
          <>
            <Space>
              <ButtonComponent
                othertype="detail"
                type="primary"
                danger
                size="small"
                onClick={() => onDetail(record)}
              >
                <RightCircleOutlined /> 详情
              </ButtonComponent>
            </Space>
          </>
        )
      },
    },
  ]
  const onDetail = (record: IElectricMeter) => {
    setDetailVisible(true)
    setEmIdInfo(record)
  }
  // 搜索
  const handleSearch = (value1: string) => {
    const value = trim(value1)
    if (value) {
      setSearchValue({ inputName: value })
      setCurrent(1)
    } else {
      setSearchValue({})
      setCurrent(1)
    }
  }
  const exportTable = async (event: any) => {
    setExportLoading(true)
    await handleDownFilePost(event, `/energy-config/electric-meter/export`, {
      ecList: checkedKeys,
      emIds: selectedRowKeys,
      emMeterType: IMeterType.AMMETER,
      ...searchValue,
    })
    setExportLoading(false)
  }
  // 参数等变动
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setSize(Number(pagination.pageSize))
    setCurrent(Number(pagination.current))
  }
  // 获取设备列表
  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const o = checkedKeys.length ? { ecList: checkedKeys } : {}
      const res = await api.getElectricMeterList({
        size,
        current,
        ...o,
        ...searchValue,
        emMeterType: IMeterType.AMMETER,
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
            <Input.Search
              onSearch={handleSearch}
              allowClear
              placeholder="电表名称/编码/型号/关联网关"
              style={{ width: 300 }}
            />
            <Button onClick={(event) => exportTable(event)} loading={exportLoading}>
              <UploadOutlined /> 导出
            </Button>
          </Space>
        </Col>
        <Col span={6} pull={18}>
          电表列表
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
        rowKey="emId"
      />

      <Drawer
        placement="bottom"
        closable={false}
        height={400}
        onClose={() => setDetailVisible(false)}
        visible={detailVisible}
      >
        <AmmeterDetailComponent info={info} />
      </Drawer>
    </div>
  )
}

export default AmmeterListComponent
