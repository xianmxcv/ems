import ButtonComponent from '@/component/button'
import api from '@/service/api'
import { IelectricMeterTypeName, IMeterType } from '@/types/common'
import { IElectricMeter, IResEnergyList } from '@/types/resType'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  RightCircleFilled,
} from '@ant-design/icons'
import {
  Table,
  Row,
  Col,
  Input,
  Space,
  Button,
  message,
  Modal,
  Divider,
  Card,
  Drawer,
  Tabs,
} from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { replace, trimEnd } from 'lodash-es'
import React, { useState, useCallback, useEffect } from 'react'
import AddElectricMeter from './addElectricMeter'
import ElectricMeterDetail from './electricMeterDetail'
import styles from './index.module.less'
import GasMeter from './meters/gasmeter'
import WaterMeter from './meters/waterMeter'

const { TabPane } = Tabs

const Ammeter = () => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParmas] = useState({ current: 1, size: 10 })
  const [tableData, setTabelData] = useState<IElectricMeter[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [inputName, setInputName] = useState<string>('')
  const [emId, setEmId] = useState<any>(undefined)
  const [detailVisible, setDetailVisible] = useState<boolean>(false)
  const [emName, setEmName] = useState<string>('')
  const [emInfo, setEmInfo] = useState<IElectricMeter>()
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }
  const handleSearch = (value: string) => {
    setInputName(value)
  }
  //新增记录
  const addRecord = () => {
    setEmId('')
    setEmInfo(undefined)
    setVisible(true)
  }
  const recordDetail = (emId: string, emName: string) => {
    setDetailVisible(true)
    setEmName(emName)
    setEmId(emId)
  }
  //修改记录
  const editRecord = (params: IElectricMeter) => {
    setEmInfo(params)
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
  // 参数等变动
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setQueryParmas({
      ...queryParams,
      size: Number(pagination.pageSize),
      current: Number(pagination.current),
    })
  }
  // 获取设备列表
  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getElectricMeterPage({
        ...queryParams,
        inputName,
        emMeterType: IMeterType.AMMETER,
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
  }, [queryParams, inputName])

  useEffect(() => {
    getList()
  }, [getList])

  // 表头
  const columns: ColumnType<IElectricMeter>[] = [
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
      title: '电表名称',
      dataIndex: 'emName',
      key: 'emName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '编码',
      dataIndex: 'emCode',
      key: 'emCode',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'item',
      key: 'item',
      align: 'left',
      render: (_text: any, record: IElectricMeter, index: number) =>
        IelectricMeterTypeName[record.emType],
    },
    {
      title: '生产厂家',
      dataIndex: 'emManufacturer',
      key: 'emManufacturer',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '型号',
      dataIndex: 'emModel',
      key: 'emModel',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '上级支路',
      dataIndex: 'ecChainName',
      key: 'ecChainName',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{replace(trimEnd(record.ecChainName || '--', ','), /,/g, '-')}</span>
      ),
    },
    {
      title: '电箱名称',
      dataIndex: 'emCabinetName',
      key: 'emCabinetName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '电箱号',
      dataIndex: 'emCabinetCode',
      key: 'emCabinetCode',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '关联网关',
      dataIndex: 'ecnNameStr',
      key: 'ecnNameStr',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'emDesc',
      key: 'emDesc',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'inputPowerRated',
      key: 'inputPowerRated',
      align: 'center',
      width: 230,
      render: (_text: any, record: IElectricMeter, index: number) => {
        return (
          <>
            <Space>
              <ButtonComponent
                othertype="detail"
                type="primary"
                danger
                size="small"
                onClick={() => recordDetail(record.emId as string, record.emName as string)}
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

  const handleTabsChange = () => {}

  return (
    <div>
      <Row align="middle" className={styles.ammeter} style={{ padding: 12 }}>
        <Tabs defaultActiveKey="1" onChange={handleTabsChange}>
          <TabPane tab="电表信息" key="1">
            <Card>
              <Row align="middle">
                <Col span={6}>电表列表</Col>
                <Col span={18} style={{ textAlign: 'right' }} className={styles['operate-button']}>
                  <Space>
                    <Input.Search
                      onSearch={handleSearch}
                      placeholder="电表名称/编码/关联网关"
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
          </TabPane>
          <TabPane tab="水表信息" key="2">
            <WaterMeter />
          </TabPane>
          <TabPane tab="燃气表信息" key="3">
            <GasMeter />
          </TabPane>
        </Tabs>
      </Row>
      <Drawer
        placement="bottom"
        closable={false}
        height={400}
        onClose={() => setDetailVisible(false)}
        visible={detailVisible}
      >
        <ElectricMeterDetail emId={emId} emName={emName} />
      </Drawer>
      <Modal
        bodyStyle={{ padding: '24px 24px 0px 24px' }}
        title={emInfo ? '修改电表信息' : '添加电表信息'}
        visible={visible}
        maskClosable={false}
        width="35%"
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
      >
        <AddElectricMeter emInfo={emInfo} onOk={onOk} onCancel={onClose} />
      </Modal>
    </div>
  )
}

export default Ammeter
