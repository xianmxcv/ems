import ButtonComponent from '@/component/button'
import api from '@/service/api'
import { IReqEnergyDeviceList } from '@/types/reqType'
import { ITreeData, IResEnergyDevice as TableEnergyDevice } from '@/types/resType'
import {
  PlusOutlined,
  DeleteOutlined,
  RightCircleOutlined,
  ExclamationCircleOutlined,
  RightCircleFilled,
} from '@ant-design/icons'
import { Table, Row, Col, Input, Space, Button, message, Modal } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { replace, trimEnd, omit, find, isEmpty, trim } from 'lodash-es'
import React, { useState, useCallback, useEffect } from 'react'
import DeviceInfo from './device_info'
import DeviceDetail from './device_info/detail'
import styles from './index.module.less'

export interface IFormEnergyDevice {
  edName: string
  edItem: string
  edVoltage: number | null
  edInputPower: number | null
  edInputElectric: number | null
  edMaxPower: number | null
  edMaxElectric: number | null
  ecId?: string
  edId?: string
  ecDeviceList?: any[]
  edRegionid: string
  edDepid: string
  edrBeginTime?: any
  rchainName?: string
  ecChainName?: string
}
export interface IFormEnergyDeviceDetail extends IFormEnergyDevice {
  edRegion?: string
  edDep?: string
  rchainName?: string
  itemName?: string
  ecChainName?: string
  ecDeviceList?: any[]
}

export const InitDevice = {
  edName: '',
  edItem: '',
  edVoltage: null,
  edInputPower: null,
  edInputElectric: null,
  edMaxPower: null,
  edMaxElectric: null,
  edId: '',
  edRegionid: '',
  edDepid: '',
}
export const deepHandler = (data: any[]): any[] => {
  return data.map((ele) => {
    if (isEmpty(ele.children)) {
      return { ...ele, value: ele.key, children: [] }
    } else {
      return { ...ele, value: ele.key, children: deepHandler(ele.children) }
    }
  })
}
const EnergyConsumption = () => {
  const [loading, setLoading] = useState(false)
  const [device, setDevice] = useState(false)
  const [detailStatus, setDeviceDetail] = useState(false)
  const [title, setTitle] = useState('??????????????????')
  const [initialValues, setInit] = useState<IFormEnergyDevice>(InitDevice)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [regionList, setRegionList] = useState<Array<ITreeData>>([])

  const [queryParams, setQueryParmas] = useState<IReqEnergyDeviceList>({ current: 1, size: 10 })
  const [tableData, setTabelData] = useState<TableEnergyDevice[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [itemList, setItemList] = useState<any[]>([])
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }
  const getRegionList = async () => {
    if (regionList.length && itemList.length) return
    try {
      const data1 = api.getEnergyItem()
      const data2 = api.getRegionList()
      const [{ data: data1Copy = [] }, { data: data2Copy = [] }] = await Promise.all([data1, data2])
      setItemList(data1Copy)
      setRegionList(deepHandler(data2Copy))
    } catch (error) {
      message.error(error)
    }
  }

  const editDevice = async (record: TableEnergyDevice) => {
    setTitle('??????????????????')
    setInit({
      ...record,
      edRegionid: record.edRegionid,
      edDepid: record.edDepid,
      ecId: record.ecId,
    })
    setDevice(true)
    await getRegionList()
  }

  const batchDel = (ids: string) => {
    Modal.confirm({
      title: '???????????????????????????',
      icon: <ExclamationCircleOutlined />,
      content: '???????????????????????????',
      okText: '??????',
      okType: 'danger',
      cancelText: '??????',
      onOk: async () => {
        try {
          await api.delEnergyDevice(ids)
          await getList()
        } catch (error) {
          message.error(error)
        }
      },
      onCancel() {},
    })
  }

  const delRecord = (record: TableEnergyDevice) => {
    batchDel(record.edId)
  }

  const columns: ColumnType<TableEnergyDevice>[] = [
    {
      title: '??????',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => (
        <span>{current && queryParams.size && (current - 1) * queryParams.size + index + 1}</span>
      ),
    },
    {
      title: '????????????',
      dataIndex: 'edName',
      key: 'edName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '????????????',
      dataIndex: 'itemName',
      key: 'itemName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '????????????',
      dataIndex: 'edVoltage',
      key: 'edVoltage',
      width: 100,
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => <span>{record.edVoltage}V</span>,
    },
    {
      title: '??????????????????',
      dataIndex: 'edInputPower',
      key: 'edInputPower',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => <span>{record.edInputPower}W</span>,
    },
    {
      title: '??????????????????',
      dataIndex: 'edInputElectric',
      key: 'edInputElectric',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => <span>{record.edInputElectric}A</span>,
    },
    {
      title: '??????????????????',
      dataIndex: 'edMaxPower',
      key: 'edMaxPower',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => <span>{record.edMaxPower}W</span>,
    },
    {
      title: '??????????????????',
      dataIndex: 'edMaxElectric',
      key: 'edMaxElectric',
      align: 'left',
      ellipsis: true,
      width: 120,

      render: (text, record, index) => <span>{record.edMaxElectric}A</span>,
    },
    {
      title: '????????????',
      dataIndex: 'rchainName',
      key: 'rchainName',
      align: 'left',
      width: 150,
      ellipsis: true,
      render: (_text: any, record: TableEnergyDevice, index: number) => {
        return <span>{replace(trimEnd(record.rchainName || '--', ','), /,/g, '-')}</span>
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'ecChainName',
      key: 'ecChainName',
      width: 150,
      align: 'left',
      ellipsis: true,
      render: (_text: any, record: TableEnergyDevice, index: number) => {
        return <span>{replace(trimEnd(record.ecChainName || '--', ','), /,/g, '-')}</span>
      },
    },
    {
      title: '????????????',
      dataIndex: 'edDep',
      key: 'edDep',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => <span>{record.edDep || '--'}</span>,
    },
    {
      title: '??????',
      align: 'center',
      width: 240,
      render: (_text: any, record: TableEnergyDevice, index: number) => {
        return (
          <>
            <Space>
              <ButtonComponent
                othertype="detail"
                type="primary"
                danger
                size="small"
                onClick={() => openDetailModal(record)}
              >
                <RightCircleFilled /> ??????
              </ButtonComponent>
              <ButtonComponent
                othertype="success"
                size="small"
                type="primary"
                onClick={() => editDevice(record)}
              >
                <RightCircleOutlined /> ??????
              </ButtonComponent>
              <ButtonComponent
                othertype="danger"
                type="primary"
                size="small"
                danger
                onClick={() => delRecord(record)}
              >
                <DeleteOutlined /> ??????
              </ButtonComponent>
            </Space>
          </>
        )
      },
    },
  ]
  const addDevice = async () => {
    await getList()
    setDevice(false)
  }

  const handleSearch = (value1: string) => {
    const value = trim(value1)
    if (value) {
      setQueryParmas({
        ...queryParams,
        edName: value,
        current: 1,
      })
    } else {
      setQueryParmas({
        ...omit({ ...queryParams, current: 1 }, ['edName']),
      })
    }
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setQueryParmas({
      ...queryParams,
      current: pagination.current ? pagination.current : current,
      size: pagination.pageSize ? Number(pagination.pageSize) : queryParams.size,
    })
    setCurrent(pagination.current ? pagination.current : current)
  }

  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { records = [], total = 0 } = {} } = await api.postEnergyDeviceList(queryParams)
      setTabelData(records)
      setTotal(total)
      setSelectedRowKeys([])
      if (records.length === 0 && total > 0 && queryParams.current > 1) {
        setQueryParmas({ ...queryParams, current: queryParams.current - 1 })
      }
    } catch (err) {
      setTabelData([])
      message.error(err)
    } finally {
      setLoading(false)
    }
  }, [queryParams])

  const openAddModal = async () => {
    setInit(InitDevice)
    setTitle('??????????????????')
    setDevice(true)
    getRegionList()
  }
  const openDetailModal = async (record: TableEnergyDevice) => {
    api.getEnergyDeviceDetail(record.edId).then(({ data }) => {
      setInit({
        ...record,
        ecDeviceList: data,
      })
    })
    setDeviceDetail(true)
  }

  useEffect(() => {
    getList()
  }, [getList])

  return (
    <div className={styles.cumson_table}>
      <Row align="middle" className={styles.header}>
        <Col span={18} push={6} className={styles.headerRight}>
          <Space className={styles.operate_button}>
            <Input.Search
              style={{ width: 400 }}
              onSearch={handleSearch}
              allowClear
              placeholder="????????????/??????/????????????/????????????/????????????"
            />
            <Button onClick={openAddModal}>
              <PlusOutlined /> ??????
            </Button>
            <Button
              disabled={selectedRowKeys.length ? false : true}
              onClick={() => batchDel(selectedRowKeys.join(','))}
            >
              <DeleteOutlined /> ????????????
            </Button>
            {/* <Button>
              <DownloadOutlined /> ??????
            </Button> */}
          </Space>
        </Col>
        <Col span={6} pull={18}>
          ????????????????????????
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
          current: queryParams.current,
          pageSize: queryParams.size,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: () => <span>??? {total} ???</span>,
        }}
        rowKey="edId"
      />
      <Modal
        centered
        title={title}
        visible={device}
        maskClosable={false}
        width="35%"
        footer={null}
        destroyOnClose
        onCancel={() => setDevice(false)}
      >
        <DeviceInfo
          itemList={itemList}
          regionList={regionList}
          title={title}
          initialValues={initialValues}
          addDevice={addDevice}
          Cancel={() => setDevice(false)}
          // reset={reset}
        />
      </Modal>
      <Modal
        bodyStyle={{ padding: '24px 24px 0px 24px' }}
        title="??????????????????"
        visible={detailStatus}
        maskClosable={false}
        width="40%"
        footer={null}
        destroyOnClose
        onCancel={() => setDeviceDetail(false)}
        className={styles.AddRateComponent}
      >
        <DeviceDetail
          title="??????????????????"
          initialValues={initialValues}
          addDevice={() => setDeviceDetail(false)}
          Cancel={() => setDeviceDetail(false)}
          // reset={reset}
        />
      </Modal>
    </div>
  )
}

export default EnergyConsumption
