import ButtonComponent from '@/component/button'
import api from '@/service/api'
import { ITransformerTypeName } from '@/types/common'
import { ITransformer } from '@/types/resType'
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  RightCircleFilled,
} from '@ant-design/icons'
import { Table, Row, Col, Input, Space, Button, message, Modal, Divider, Card } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { replace, trimEnd } from 'lodash-es'
import React, { useState, useCallback, useEffect } from 'react'
import AddTransformer from './addTransformer'
import styles from './index.module.less'
import ViewTransformer from './viewTransformer'

const Transformer = () => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [total, setTotal] = useState(0)
  const [inputName, setInputName] = useState<string>('')
  const [queryParams, setQueryParmas] = useState({ current: 1, size: 10 })
  const [tableData, setTabelData] = useState<ITransformer[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [tfInfo, setTfInfo] = useState<any>(undefined)
  const [tfType, setTfType] = useState('')
  const [filtered, setFiltered] = useState<
    Partial<Record<'干式变压器' | '油浸式变压器' | '单相变压器' | '三相变压器', string[]>>
  >()
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }
  //新增记录
  const addRecord = () => {
    setTfInfo(undefined)
    setVisible(true)
  }
  //修改记录
  const editRecord = (params: ITransformer) => {
    setTfInfo(params)
    setVisible(true)
  }
  //查看记录
  const viewRecord = (params: ITransformer) => {
    setTfInfo(params)
    setDetailVisible(true)
  }
  //删除记录
  const deleteRecords = async (tfId?: string) => {
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
          const res = await api.delTransformerInfo(tfId ? tfId : selectedRowKeys.join(','))
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
  // 搜索
  const handleSearch = (value: string) => {
    setInputName(value)
  }
  const handleCancel = () => {
    setVisible(false)
  }
  const handleCancelDetail = () => {
    setDetailVisible(false)
  }
  const renderEcName = (params: ITransformer) => {
    let arr: string[] = []
    if (params.etrList !== null) {
      params.etrList.map((item) => {
        arr.push(replace(trimEnd(item.ecChainName || '--', ','), /,/g, '-'))
      })
    }
    return arr.join(',')
  }
  // 参数等变动
  const handleTableChange = (pagination: TablePaginationConfig, filter: any) => {
    filter.tfTypeName ? setTfType(filter.tfTypeName[0]) : setTfType('')
    setQueryParmas({
      ...queryParams,
      size: Number(pagination.pageSize),
      current: Number(pagination.current),
    })
    setFiltered(filter)
  }
  // 获取设备列表
  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const tfTypeO = tfType ? { tfType } : {}
      const res = await api.getTransformerList({ ...queryParams, ...tfTypeO, inputName })
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
  }, [queryParams, inputName, tfType])

  useEffect(() => {
    getList()
  }, [getList])
  // 表头
  const columns: ColumnType<ITransformer>[] = [
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
      title: '变压器名称',
      dataIndex: 'tfName',
      key: 'tfName',
      align: 'left',
      ellipsis: true,
      width: 120,
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
      title: '变压器容量(KVA)',
      dataIndex: 'tfCapacity',
      key: 'tfCapacity',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: '一次侧电压(KV)',
      dataIndex: 'tfOnceVolts',
      key: 'tfOnceVolts',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '二次侧电压(KV)',
      dataIndex: 'tfSecondVolts',
      key: 'tfSecondVolts',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '低压侧额定电流(A)',
      dataIndex: 'tfLowvolElectric',
      key: 'tfLowvolElectric',
      align: 'left',
      ellipsis: true,
      width: 140,
    },
    {
      title: '下挂支路名称',
      dataIndex: 'ecName',
      key: 'ecName',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record: ITransformer, index) => renderEcName(record),
    },
    {
      title: '供电单位',
      dataIndex: 'tfPowerUnit',
      key: 'tfPowerUnit',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'tfDesc',
      key: 'tfDesc',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '操作',
      align: 'center',
      width: 240,
      render: (_text: any, record: ITransformer, index: number) => {
        return (
          <>
            <Space>
              <ButtonComponent
                othertype="detail"
                type="primary"
                danger
                size="small"
                onClick={() => viewRecord(record)}
              >
                <RightCircleFilled /> 详情
              </ButtonComponent>
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
                onClick={() => deleteRecords(record.tfId)}
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
    <div>
      <Row align="middle" className={styles.transformer} style={{ paddingBottom: 12 }}>
        <Card style={{ width: '100%' }}>
          <Row align="middle">
            <Col span={6}>变压器管理列表</Col>
            <Col span={18} style={{ textAlign: 'right' }} className={styles['operate-button']}>
              <Space>
                <Input.Search
                  style={{ width: '290px' }}
                  onSearch={handleSearch}
                  placeholder="变压器名称/下挂支路/供电单位"
                  allowClear
                />
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
                scroll={{ x: 'scroll' }}
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
                rowKey="tfId"
              />
            </Col>
          </Row>
        </Card>
      </Row>

      <Modal
        bodyStyle={{ padding: '24px 24px 0px 24px' }}
        title={tfInfo ? '修改变压器信息' : '添加变压器信息'}
        visible={visible}
        width="35%"
        footer={null}
        maskClosable={false}
        onCancel={handleCancel}
        destroyOnClose
      >
        <AddTransformer tfInfo={tfInfo} onOk={onOk} onCancel={onClose} />
      </Modal>
      <Modal
        bodyStyle={{ padding: '24px 24px 0px 24px' }}
        title="变压器详情"
        visible={detailVisible}
        width="40%"
        footer={null}
        maskClosable={false}
        onCancel={handleCancelDetail}
        destroyOnClose
        className={styles.AddRateComponent}
      >
        <ViewTransformer tfInfo={tfInfo} />
      </Modal>
    </div>
  )
}

export default Transformer
