import api from '@/service/api'
import { ITransformerTypeName } from '@/types/common'
import { ITransformer } from '@/types/resType'
import { handleDownFile } from '@/utils/downfile'
import { UploadOutlined } from '@ant-design/icons'
import { Table, Row, Col, Input, Space, Button, message } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { replace, trim, trimEnd } from 'lodash-es'
import React, { useState, useCallback, useEffect } from 'react'
interface Iprops {
  checkedKeys: any
}

const TransformerComponent = (props: Iprops) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>(props.checkedKeys)
  const [searchValue, setSearchValue] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [tfType, setTfType] = useState('')
  const [size, setSize] = useState(10)
  const [filtered, setFiltered] = useState<
    Partial<Record<'干式变压器' | '油浸式变压器' | '单相变压器' | '三相变压器', string[]>>
  >()
  // add 参数验证
  const [tableData, setTabelData] = useState<ITransformer[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }
  // 表头
  const columns: ColumnType<ITransformer>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'left',
      render: (text, record, index) => (
        <span>{current && size && (current - 1) * size + index + 1}</span>
      ),
    },
    {
      title: '变压器名称',
      dataIndex: 'tfName',
      key: 'tfName',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '变压器类型',
      dataIndex: 'tfTypeName',
      key: 'tfTypeName',
      align: 'left',
      ellipsis: true,
      width: 120,
      filters: [
        ...Object.entries(ITransformerTypeName).map((ele) => ({
          value: ele[0],
          text: ele[1],
        })),
      ],
      filteredValue: filtered ? filtered['干式变压器'] : null,
      filterMultiple: false,
    },
    {
      title: '变压器容量（KVA）',
      dataIndex: 'tfCapacity',
      key: 'tfCapacity',
      align: 'left',
      ellipsis: true,
      width: 160,
    },
    {
      title: '一次侧电压（KV）',
      dataIndex: 'tfOnceVolts',
      key: 'tfOnceVolts',
      align: 'left',
      ellipsis: true,
      width: 140,
    },
    {
      title: '二次侧电压（KV）',
      dataIndex: 'tfSecondVolts',
      key: 'tfSecondVolts',
      align: 'left',
      ellipsis: true,
      width: 140,
    },
    // {
    //   title: '电压等级',
    //   dataIndex: 'tfVoltageLevel',
    //   key: 'tfVoltageLevel',
    //   align: 'left',
    //   ellipsis: true,
    //   width: 80,
    //   render: (_text: any, record: ITransformer, index: number) => <>{record.tfVoltageLevel}V</>,
    // },
    {
      title: '低压侧额定电流（A）',
      dataIndex: 'tfLowvolElectric',
      key: 'tfLowvolElectric',
      align: 'left',
      ellipsis: true,
      width: 160,
    },
    {
      title: '下挂总支路名称',
      dataIndex: 'etrList',
      key: 'etrList',
      align: 'left',
      ellipsis: true,
      width: 120,

      render: (_text: any, record: ITransformer, index: number) => {
        return (
          <span>{replace(trimEnd(record.etrList[0]?.ecChainName || '--', ','), /,/g, '-')}</span>
        )
      },
    },
    {
      title: '供电单位',
      dataIndex: 'tfPowerUnit',
      key: 'tfPowerUnit',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'tfDesc',
      key: 'tfDesc',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (_text: any, record: ITransformer, index: number) => <>{record.tfDesc || '--'}</>,
    },
  ]

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
  const handleTableChange = (pagination: TablePaginationConfig, filter: any) => {
    filter.tfTypeName ? setTfType(filter.tfTypeName[0]) : setTfType('')

    setSize(Number(pagination.pageSize))
    setCurrent(Number(pagination.current))
    setFiltered(filter)
  }
  // 获取设备列表
  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const o = checkedKeys.length ? { ecIdList: checkedKeys } : {}
      const tfTypeO = tfType ? { tfType } : {}
      const res = await api.getTransformerList({ ...o, size, current, ...searchValue, ...tfTypeO })
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
  }, [size, current, checkedKeys, searchValue, tfType])
  const exportTable = async (event: any) => {
    setExportLoading(true)
    let str = ''
    if (checkedKeys.length && selectedRowKeys.length) {
      str = `?ids=${selectedRowKeys.join(',')}&ecIds=${checkedKeys.join(',')}`
    } else if (selectedRowKeys.length) {
      str = `?${str}ids=${selectedRowKeys.join(',')}`
    } else if (checkedKeys.length) {
      str = `?${str}ecIds=${checkedKeys.join(',')}`
    }
    await handleDownFile(event, `/energy-config/transformer/export${str}`)
    setExportLoading(false)
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
        <Col span={18} push={6} style={{ textAlign: 'right' }}>
          <Space>
            <Input.Search
              onSearch={handleSearch}
              allowClear
              placeholder="变压器名称"
              style={{ width: 300 }}
            />
            <Button onClick={(event) => exportTable(event)} loading={exportLoading}>
              <UploadOutlined /> 导出
            </Button>
          </Space>
        </Col>
        <Col span={6} pull={18}>
          变压器管理列表
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
        rowKey="tfId"
      />
    </div>
  )
}

export default TransformerComponent
