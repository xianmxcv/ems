import ButtonComponent from '@/component/button'
import api from '@/service/api'
import { IRateTypeName } from '@/types/common'
import { BaseRate as BaseRateCom } from '@/types/reqType'
import { ITreeData } from '@/types/resType'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Table, Row, Col, Input, Space, message, Modal, Button } from 'antd'
import { ColumnType } from 'antd/lib/table'
import {
  isEmpty,
  forIn,
  groupBy,
  orderBy,
  find,
  flattenDeep,
  trim,
  isEqual,
  differenceBy,
  pullAllWith,
  differenceWith,
  filter,
  isArray,
} from 'lodash-es'
import moment from 'moment'
import React, { useState, useCallback, useEffect } from 'react'
import AddRateComponent from './add_rate'
import styles from './index.module.less'

export const InitDevice = {
  regionId: '',
  cpAddress: [],
  itemList: [
    {
      cpAllDate: [],
      cpDesc: '',
      itemList_1: [
        {
          cpRateType: '',
          cpCost: undefined,
          cpAllTime: [],
          disableEndTime: 0,
        },
      ],
    },
  ],
}
interface ItemList_1 {
  cpRateType: string
  cpCost: undefined
  cpAllTime: any[]
  disableEndTime?: number
}

export interface BaseRate extends BaseRateCom {
  regionName?: string
  itemList_1?: ItemList_1[]
  cpAddressRow?: number
  cpStartDateRow?: number
  regionNameRow?: number
  cpAllDate?: any[]
  cpId?: string
  cpIds?: any[]
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

const Rate = () => {
  const [loading, setLoading] = useState(false)
  const [device, setRate] = useState(false)
  const [title, setTitle] = useState('添加设备信息')
  const [initialValues, setInit] = useState({})
  const [regionList, setRegionList] = useState<Array<ITreeData>>([])
  const [tableData, setTabelData] = useState<BaseRate[]>([])
  const [groupData, setGroupData] = useState<any>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>, selectedRows: any) => {
      const keys: string[] = flattenDeep(
        filter(selectedRows, (el: any) => isArray(el.cpIds)).map((el: any) => el.cpIds)
      )
      return setSelectedRowKeys(keys)
    },
    renderCell: (checked: any, record: any, index: any, originNode: any) => {
      return {
        children: originNode,
        props: { rowSpan: tableData[index].cpStartDateRow },
      }
    },
  }
  const editDevice = async (record: BaseRate, index: number) => {
    const { regionName, cpAddress } = tableData[index]
    const str1 = `${regionName}${cpAddress}`
    const actives = groupData[str1]
    const actives1 = groupBy(
      actives,
      (o) => o.regionName + o.cpAddress + o.cpStartDate + o.cpEndDate
    )
    const initValue: any = { regionId: null, cpAddress: null, itemList: [], actives }
    forIn(actives1, (val, key) => {
      const [{ regionId, cpAddress, cpDesc, cpStartDate, cpEndDate }] = val
      initValue.regionId = regionId
      initValue.cpAddress = cpAddress.split('||')[0].split(',')
      initValue.regionName = cpAddress.split('||')[1]
      const cpAllDate = [moment(cpStartDate), moment(cpEndDate)]
      const itemList_1 = val.map(({ cpRateType, cpCost, cpBegintime, cpEndtime, cpId }) => ({
        cpId,
        cpRateType,
        cpCost,
        cpBegintime,
        cpEndtime,
        disableEndTime: cpBegintime,
        cpAllTime: [
          cpBegintime,
          cpEndtime,
          // moment(`${cpBegintime}:00:00`, 'HH:mm:ss'),
          // moment(`${cpEndtime}:00:00'`, 'HH:mm:ss'),
        ],
      }))
      initValue.itemList.push({ itemList_1, cpAllDate, cpDesc })
    })
    setInit(initValue)
    setTitle('编辑设备信息')
    setRate(true)
    getRegionList()
  }
  const delRecord = (record: BaseRate, index: number) => {
    const { regionName, cpAddress, cpStartDate, cpEndDate } = tableData[index]
    const str1 = `${regionName}${cpAddress}`
    const actives = groupData[str1]
    const cpIds = actives.map((el: any) => el.cpId).join(',')
    batchDel(cpIds)
  }
  const columns: ColumnType<BaseRate>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '一级区域名称',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'left',
      ellipsis: true,
      width: 200,
      render: (value, row, index) => {
        return {
          children: value,
          props: { rowSpan: tableData[index].regionNameRow },
        }
      },
    },
    {
      title: '地址',
      dataIndex: 'cpAddress',
      key: 'cpAddress',
      align: 'left',
      ellipsis: true,
      width: 200,
      render: (value, row, index) => {
        return {
          children: <span>{row.cpAddress.split('||')[1]}</span>,
          props: { rowSpan: tableData[index].cpAddressRow },
        }
      },
    },
    {
      title: '周期段',
      dataIndex: 'cpStartDate',
      key: 'cpStartDate',
      align: 'left',
      ellipsis: true,
      width: 150,
      render: (value, row, index) => {
        return {
          children: (
            <span>
              {moment(row.cpStartDate).format('YYYY-MM')}~{moment(row.cpEndDate).format('YYYY-MM')}
            </span>
          ),
          props: { rowSpan: tableData[index].cpStartDateRow },
        }
      },
    },
    {
      title: '费率类型',
      dataIndex: 'cpRateType',
      key: 'cpRateType',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (_text: any, record: BaseRate, index: number) => {
        return <>{IRateTypeName[record.cpRateType]}</>
        // return <>{JSON.stringify(rateTypes)}</>
      },
    },
    {
      title: '开始时间',
      dataIndex: 'cpBegintime',
      key: 'cpBegintime',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (_text: any, record: BaseRate, index: number) => {
        return <>{record.cpBegintime}:00:00</>
      },
    },
    {
      title: '结束时间',
      dataIndex: 'cpEndtime',
      key: 'cpEndtime',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (_text: any, record: BaseRate, index: number) => {
        return <>{record.cpEndtime}:00:00</>
      },
    },
    {
      title: '电费（元/度）',
      dataIndex: 'cpCost',
      key: 'cpCost',
      align: 'left',
      ellipsis: true,
      width: 140,
    },
    {
      title: '备注',
      dataIndex: 'inputPowerRated',
      key: 'inputPowerRated',
      align: 'left',
      ellipsis: true,
      render: (value, row, index) => {
        return {
          children: row.cpDesc || '--',
          props: { rowSpan: tableData[index].cpStartDateRow },
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'inputPowerRated',
      key: 'inputPowerRated',
      align: 'center',
      width: 200,
      render: (value, row: BaseRate, index: number) => {
        return {
          children: (
            <>
              <Space>
                <ButtonComponent
                  othertype="success"
                  type="primary"
                  size="small"
                  onClick={() => editDevice(row, index)}
                >
                  <EditOutlined /> 编辑
                </ButtonComponent>
                <ButtonComponent
                  othertype="danger"
                  type="primary"
                  size="small"
                  danger
                  onClick={() => delRecord(row, index)}
                >
                  <DeleteOutlined /> 删除
                </ButtonComponent>
              </Space>
            </>
          ),
          props: { rowSpan: tableData[index].cpAddressRow },
        }
      },
    },
  ]

  const batchDel = async (ids: string) => {
    Modal.confirm({
      title: '是否确定删除数据？',
      icon: <ExclamationCircleOutlined />,
      content: '是否确定删除数据？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.delCostPeriod(ids)
          await getList()
        } catch (error) {
          message.error(error)
        }
      },
      onCancel() {},
    })
  }
  const AddRate = async () => {
    setRate(false)
    getList()
  }
  const handleSearch = (value1: string) => {
    const value = trim(value1)
    if (value) {
      getList({ regionName: value })
    } else {
      getList({})
    }
  }

  const getList = useCallback(async (query: any = {}) => {
    setLoading(true)
    try {
      const { data: { records = [], total } = {} } = await api.postCostPeriod(query)
      const groupData = groupBy(records, (o) => o.regionName + o.cpAddress)
      setGroupData(groupData)
      const groupData1 = groupBy(
        records,
        (o) => o.regionName + o.cpAddress + o.cpStartDate + o.cpEndDate
      )
      const orderData = orderBy(records, ['regionName', 'cpAddress', 'cpStartDate'], ['asc'])
      let rowMark1 = ''
      let rowMark2 = ''
      const tableDataRes = orderBy(
        orderData.map((item) => {
          const { regionName, cpAddress, cpStartDate, cpEndDate, cpId } = item
          let regionNameRow = 0
          let cpStartDateRow = 0
          let cpIds = cpId
          const str1 = `${regionName}${cpAddress}`
          const str2 = `${str1}${cpStartDate}${cpEndDate}`
          if (rowMark1 !== str1) {
            rowMark1 = str1
            regionNameRow = groupData[str1].length
          }
          if (rowMark2 !== str2) {
            rowMark2 = str2
            cpStartDateRow = (groupData1[str2] || []).length
            cpIds = (groupData1[str2] || []).map((ele) => ele.cpId)
          }
          return { ...item, regionNameRow, cpAddressRow: regionNameRow, cpStartDateRow, cpIds }
        }),
        ['regionName', 'cpAddress', 'cpStartDate'],
        ['asc']
      )
      setTabelData(tableDataRes)
    } catch (err) {
      setTabelData([])
      message.error(err)
    } finally {
      setLoading(false)
    }
  }, [])
  const getRegionList = async () => {
    if (regionList.length) return
    try {
      const { data = [] } = await api.getRegionList(1)
      setRegionList(deepHandler(data))
    } catch (error) {
      message.error(error)
    }
  }
  const openAddModal = async () => {
    setInit(InitDevice)
    setTitle('添加费率时段')
    setRate(true)
    getRegionList()
  }

  useEffect(() => {
    getList()
  }, [getList])

  return (
    <div className={styles.cumson_table}>
      <Row align="middle" style={{ paddingBottom: 12 }} className={styles.operate_button}>
        <Col span={18} push={6} style={{ textAlign: 'right' }}>
          <Space>
            <Input.Search onSearch={handleSearch} allowClear placeholder="地区" />
            <Button onClick={openAddModal}>
              <PlusOutlined /> 添加
            </Button>
            <Button
              disabled={selectedRowKeys.length ? false : true}
              onClick={() => batchDel(selectedRowKeys.join(','))}
            >
              <DeleteOutlined /> 批量删除
            </Button>
          </Space>
        </Col>
        <Col span={6} pull={18}>
          时间块详情
        </Col>
      </Row>
      <Table
        loading={loading}
        dataSource={tableData}
        size="small"
        bordered
        scroll={{ x: 'scroll' }}
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        rowKey="cpId"
      />
      <Modal
        centered
        title={title}
        visible={device}
        width="900"
        footer={null}
        destroyOnClose
        maskClosable={false}
        zIndex={123}
        onCancel={() => setRate(false)}
        className={styles.AddRateComponent}
      >
        <AddRateComponent
          regionList={regionList}
          // roletip={roletip}
          title={title}
          initialValues={initialValues}
          AddRate={AddRate}
          Cancel={() => setRate(false)}
        />
      </Modal>
    </div>
  )
}

export default Rate
