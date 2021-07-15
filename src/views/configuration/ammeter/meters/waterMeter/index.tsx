import ButtonComponent from '@/component/button'
import api from '@/service/api'
import { IelectricMeterTypeName, IMeterType, IWaterMeterTypeName } from '@/types/common'
import { IElectricMeter } from '@/types/resType'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Table, Row, Col, Input, Space, Button, message, Modal, Card } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { TableRowSelection } from 'antd/lib/table/interface'
import React, { ReactText, useCallback, useEffect, useState } from 'react'
import AddWaterMeter from './addWaterMeter'
import styles from './index.module.less'

const WaterMeter = () => {
  const [inputName, setInputName] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([])
  const [loading, setLoading] = useState(false)
  const [queryParams, setQueryParmas] = useState({ current: 1, size: 10 })
  const [tableData, setTabelData] = useState<IElectricMeter[]>([])
  const [total, setTotal] = useState(0)
  const [emInfo, setEmInfo] = useState<IElectricMeter>()
  const [filtered, setFiltered] = useState<Partial<Record<'emType', string[]>>>()

  // 获取设备列表
  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getElectricMeterPage({
        ...queryParams,
        inputName,
        emMeterType: IMeterType.WATERMETER,
        emType: filtered?.emType,
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
  }, [queryParams, inputName, filtered?.emType])

  useEffect(() => {
    getList()
  }, [getList])

  const handleSearch = (value: string) => {
    setInputName(value)
  }

  //新增记录
  const addRecord = () => {
    setVisible(true)
  }

  //删除记录
  const deleteRecords = async (emId?: string) => {
    Modal.confirm({
      title: '是否确定删除数据？',
      icon: <ExclamationCircleOutlined />,
      content: '是否确定删除数据？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true)
        try {
          const res = await api.delElectricMeter(emId ? emId : selectedRowKeys.join(','))
          if (res.data) {
            message.success('删除成功')
            getList()
          }
        } catch (err) {
          message.error(err)
        } finally {
          setLoading(false)
        }
      },
      onCancel() {},
    })
  }

  //修改记录
  const editRecord = (params: IElectricMeter) => {
    setEmInfo(params)
    setVisible(true)
  }

  // 参数等变动
  const handleTableChange = (pagination: TablePaginationConfig, filter: any) => {
    setQueryParmas({
      ...queryParams,
      current: pagination.current ? pagination.current : queryParams.current,
      size: pagination.pageSize ? Number(pagination.pageSize) : queryParams.size,
    })
    setFiltered(filter)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  //弹窗子组件方法
  const onOk = () => {
    setVisible(false)
    setQueryParmas({ size: 10, current: 1 })
  }

  // 表头
  const columns: ColumnType<IElectricMeter>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => (
        <span>
          {queryParams.current &&
            queryParams.size &&
            (queryParams.current - 1) * queryParams.size + index + 1}
        </span>
      ),
    },
    {
      title: '水表名称',
      dataIndex: 'emName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '编码',
      dataIndex: 'emCode',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '类型',
      key: 'emType',
      align: 'left',
      render: (_text: any, record: IElectricMeter) => IWaterMeterTypeName[record.emType],
      filters: Object.entries(IWaterMeterTypeName).map((item) => ({
        text: item[1],
        value: item[0],
      })),
    },
    {
      title: '型号',
      dataIndex: 'emModel',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '生产厂家',
      dataIndex: 'emManufacturer',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'emDesc',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'inputPowerRated',
      align: 'center',
      width: 230,
      render: (_text: any, record: IElectricMeter, index: number) => {
        return (
          <>
            <Space>
              <ButtonComponent
                othertype="success"
                type="primary"
                size="small"
                onClick={() => editRecord(record)}
              >
                <EditOutlined /> 编辑
              </ButtonComponent>
              <ButtonComponent
                othertype="danger"
                type="primary"
                danger
                size="small"
                onClick={() => deleteRecords(record.emId)}
              >
                <DeleteOutlined /> 删除
              </ButtonComponent>
            </Space>
          </>
        )
      },
    },
  ]

  const rowSelection: TableRowSelection<IElectricMeter> = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<ReactText>) => setSelectedRowKeys(selectedRowKeys),
  }

  return (
    <>
      <Card>
        <Row align="middle">
          <Col span={6}>电表列表</Col>
          <Col span={18} style={{ textAlign: 'right' }} className={styles['operate-button']}>
            <Space>
              <Input.Search onSearch={handleSearch} placeholder="水表名称/编码" allowClear />
              <Button onClick={() => addRecord()}>
                <PlusOutlined /> 添加
              </Button>
              <Button
                disabled={selectedRowKeys.length ? false : true}
                onClick={() => deleteRecords()}
              >
                <DeleteOutlined /> 批量删除
              </Button>
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
              rowSelection={rowSelection}
              pagination={{
                current: queryParams.current,
                pageSize: queryParams.size,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: () => <span>共 {total} 条</span>,
              }}
              rowKey="emId"
            />
          </Col>
        </Row>
      </Card>
      <Modal
        bodyStyle={{ padding: '24px 24px 0px 24px' }}
        title={emInfo ? '修改水表信息' : '添加水表信息'}
        visible={visible}
        maskClosable={false}
        width="35%"
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
      >
        <AddWaterMeter emInfo={emInfo} onOk={onOk} onCancel={handleCancel} />
      </Modal>
    </>
  )
}

export default WaterMeter
