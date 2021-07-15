import ButtonComponent from '@/component/button'
import api from '@/service/api'
import { IregionCircuitConditions, IResEnergyList } from '@/types/resType'
import { handleDownFilePost } from '@/utils/downfile'
import {
  UploadOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Table, Row, Col, Input, Space, Button, message, Card, Modal } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { replace, trimEnd } from 'lodash-es'
import React, { Key, useState, useCallback, useEffect } from 'react'
import styles from '../index.module.less'
import AddBranchInfo from './addBranchInfo'
interface IState {
  regionIds: Key[]
}

const BranchInfo = (props: IState) => {
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [visible, setVisible] = useState(false)
  // add 参数验证
  const [queryParams, setQueryParmas] = useState({ current: 1, size: 10 })
  const [ecName, setEcName] = useState<string>('')
  const [tableData, setTabelData] = useState<IregionCircuitConditions[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [egionCircuitConditions, setRegionCircuitConditions] = useState<IregionCircuitConditions>()
  const [exportLoading, setExportLoading] = useState(false)
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
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
    await handleDownFilePost(event, `/energy-config/region/export`, {
      regionIds: props.regionIds,
      erIds: selectedRowKeys,
      ecName: ecName,
    })
    setExportLoading(false)
  }
  // 获取设备列表
  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getRegionCircuitConditions({
        ...queryParams,
        ecName,
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
  }, [queryParams, ecName, props.regionIds])
  useEffect(() => {
    getList()
  }, [getList])
  // 搜索
  const handleSearch = (value: string) => {
    setEcName(value)
  }
  //新增记录
  const addRecord = () => {
    setRegionCircuitConditions(undefined)
    setVisible(true)
  }
  //修改记录
  const editRecord = (params: IregionCircuitConditions) => {
    setRegionCircuitConditions(params)
    setVisible(true)
  }
  //删除记录
  const deleteRecords = async (erId?: string) => {
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
          const res = await api.delRegionCircuit(erId ? erId : selectedRowKeys.join(','))
          if (res.data) {
            message.success('删除成功')
            onOk()
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
  //弹窗子组件方法
  const onClose = () => {
    setVisible(false)
  }
  //弹窗子组件方法
  const onOk = () => {
    setVisible(false)
    setQueryParmas({ size: 10, current: 1 })
  }
  const handleCancel = () => {
    setVisible(false)
  }
  // 表头
  const columns: ColumnType<IregionCircuitConditions>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => (
        <span>{(queryParams.current - 1) * queryParams.size + index + 1}</span>
      ),
    },
    {
      title: '区域名称',
      dataIndex: 'rchainName',
      key: 'rchainName',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{replace(trimEnd(record.rchainName || '--', ','), /,/g, '-')}</span>
      ),
    },
    {
      title: '支路名称',
      dataIndex: 'ecChainName',
      key: 'ecChainName',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{replace(trimEnd(record.ecChainName || '--', ','), /,/g, '-')}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'inputPowerRated',
      key: 'inputPowerRated',
      align: 'center',
      width: 160,
      render: (_text: any, record: IregionCircuitConditions, index: number) => {
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
                onClick={() => deleteRecords(record.erId)}
              >
                <DeleteOutlined /> 删除
              </ButtonComponent>
            </Space>
          </>
        )
      },
    },
  ]
  return (
    <>
      <Card>
        <Row align="middle" style={{ paddingBottom: 12 }}>
          <Col span={6}>支路列表</Col>
          <Col span={18} style={{ textAlign: 'right' }} className={styles['operate-button']}>
            <Space>
              <Input.Search onSearch={handleSearch} allowClear placeholder="支路名称" />
              <Button onClick={() => addRecord()}>
                <PlusOutlined /> 添加
              </Button>
              <Button
                disabled={selectedRowKeys.length ? false : true}
                onClick={() => deleteRecords()}
              >
                <DeleteOutlined /> 批量删除
              </Button>
              {/* <Button onClick={(event) => exportTable(event)} loading={exportLoading}>
                <UploadOutlined /> 导出
              </Button> */}
            </Space>
          </Col>
          <Col span={24} style={{ marginTop: 8 }}>
            <Table
              loading={loading}
              dataSource={tableData}
              size="small"
              rowKey="erId"
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
            />
          </Col>
        </Row>
      </Card>
      <Modal
        bodyStyle={{ padding: '24px 24px 0px 24px' }}
        title={egionCircuitConditions ? '修改支路信息' : '添加支路信息'}
        visible={visible}
        width="35%"
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
      >
        {visible && (
          <AddBranchInfo
            regionCircuitConditions={egionCircuitConditions}
            onOk={onOk}
            onCancel={onClose}
          />
        )}
      </Modal>
    </>
  )
}

export default BranchInfo
