import ButtonComponent from '@/component/button'
import api from '@/service/api'
import { IResIElectricMeterPage } from '@/types/resType'
import { handleDownFilePost } from '@/utils/downfile'
import {
  UndoOutlined,
  SearchOutlined,
  UploadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Table, Row, Col, Space, Button, message, DatePicker, Modal } from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { isEmpty } from 'lodash-es'
import moment from 'moment'
import React, { useState, useCallback, useEffect } from 'react'

interface Iprops {
  checkedKeys: any
}

const TableList = (props: Iprops) => {
  const [emId, setEmId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [queryParams1, setQueryParams1] = useState<any>({})
  const [dateValue, setDateValue] = useState<any>({})
  const [queryParams, setQueryParams] = useState<any>({})
  const [exportLoading, setExportLoading] = useState(false)
  // add 参数验证
  const [tableData, setTabelData] = useState<IResIElectricMeterPage[]>([])

  const columns: ColumnType<IResIElectricMeterPage>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text: string, record: IResIElectricMeterPage, index: number) => (
        <span>{current && size && (current - 1) * size + index + 1}</span>
      ),
    },
    {
      title: '水表名称',
      dataIndex: 'emName',
      key: 'emName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '正向累计流量',
      key: 'pFlow',
      align: 'left',
      ellipsis: true,
      width: 150,
      render: (text, row) => `${row.pFlow || 0}`,
    },
    {
      title: '反向累计流量',
      key: 'rFlow',
      align: 'left',
      ellipsis: true,
      width: 150,
      render: (text, row) => `${row.rFlow || 0}`,
    },
    {
      title: '手抄时间',
      dataIndex: 'mrecTime',
      key: 'mrecTime',
      align: 'left',
      ellipsis: true,
      width: 150,
      render: (text, row) => `${row.mrecTime ? moment(row.mrecTime).format('YYYY-MM-DD') : '--'}`,
    },
    {
      title: '操作',
      dataIndex: 'inputPowerRated',
      key: 'inputPowerRated',
      align: 'center',
      width: 120,
      render: (value, row: IResIElectricMeterPage, index: number) => {
        return (
          <>
            <Space>
              <ButtonComponent
                othertype="danger"
                type="primary"
                size="small"
                danger
                onClick={() => delRecord(row)}
              >
                <DeleteOutlined /> 删除
              </ButtonComponent>
            </Space>
          </>
        )
      },
    },
  ]
  const delRecord = (record: IResIElectricMeterPage) => {
    Modal.confirm({
      title: '是否确定删除数据？',
      icon: <ExclamationCircleOutlined />,
      content: '是否确定删除数据？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.delManualRecord({
            emId: record.emId,
            mrecTime: moment(record.mrecTime).format('YYYY-MM-DD HH:mm:ss'),
          })
          message.success('删除成功')
          await getList()
        } catch (error) {
          message.error(error)
        }
      },
      onCancel() {},
    })
  }
  const handleSearch = () => {
    setQueryParams({ ...queryParams1 })
    setCurrent(1)
  }
  const reSet = () => {
    setDateValue([])
    setQueryParams1({})
    setQueryParams({})
    setCurrent(1)
  }
  const onChangeDate = (date: any, dateString: any) => {
    if (isEmpty(date)) {
      setDateValue([])
      setQueryParams1({})
    } else {
      const [mrecTimeStart, mrecTimeEnd] = date
      setDateValue(date)
      setQueryParams1({ mrecTimeStart, mrecTimeEnd })
    }
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setSize(Number(pagination.pageSize))
    setCurrent(Number(pagination.current))
  }
  const exportTable = async (event: any) => {
    setExportLoading(true)

    await handleDownFilePost(event, `/energy-config/manual_record/export`, { emId, ...queryParams })
    setExportLoading(false)
  }
  const getList = useCallback(async () => {
    if (!emId) return
    setLoading(true)
    try {
      const res = await api.postManualRecordPage({
        size,
        current,
        ...queryParams,
        emId,
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
  }, [size, current, queryParams, emId])

  useEffect(() => {
    getList()
  }, [getList])

  useEffect(() => {
    setEmId(props.checkedKeys[0])
    setCurrent(1)
  }, [props.checkedKeys])
  return (
    <div>
      <Row align="middle" style={{ paddingBottom: 12 }}>
        <Col span={20} push={4} style={{ textAlign: 'right' }}>
          <Space>
            <span>单位：m³ </span>
            手抄时间段:
            <DatePicker.RangePicker
              value={dateValue}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={onChangeDate}
              showTime
            />
            <Button type="primary" onClick={handleSearch}>
              <SearchOutlined /> 查询
            </Button>
            <Button onClick={reSet}>
              <UndoOutlined /> 重置
            </Button>
            <Button onClick={(event) => exportTable(event)} loading={exportLoading}>
              <UploadOutlined /> 导出
            </Button>
          </Space>
        </Col>
        <Col span={4} pull={20}>
          手动抄表列表
        </Col>
      </Row>
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        bordered
        size="small"
        scroll={{ x: 100 }}
        onChange={handleTableChange}
        pagination={{
          current: current,
          pageSize: size,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: () => <span>共 {total} 条</span>,
        }}
        rowKey="mrecTime"
      />
    </div>
  )
}

export default TableList
