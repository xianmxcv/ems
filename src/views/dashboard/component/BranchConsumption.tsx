import api from '@/service/api'
import { IResHomeBranchConsumption } from '@/types/resType'
import { Card, Col, Input, message, Radio, Row, Select, Table, Tabs } from 'antd'
import { ColumnType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.less'
const { TabPane } = Tabs
const BranchConsumption = () => {
  const [dateType, setDateType] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const onChange = (value: any) => {
    setDateType(value.target.value)
  }
  const [tableData, setTableData] = useState<IResHomeBranchConsumption[]>([])
  const columns: ColumnType<IResHomeBranchConsumption>[] = [
    {
      title: '序号',
      width: 60,
      align: 'left',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '支路名称',
      dataIndex: 'ecName',
      align: 'center',
      key: 'ecName',
      // ellipsis: true,
      // width: 100,
    },
    {
      title: '支路能耗',
      dataIndex: 'ecConsume',
      key: 'ecConsume',
      align: 'center',
      // ellipsis: true,
      // width: 100,
    },
    {
      title: '下级支路能耗',
      dataIndex: 'nextEcConsume',
      key: 'nextEcConsume',
      align: 'center',
      // ellipsis: true,
      // width: 120,
    },
    {
      title: '耗损量',
      dataIndex: 'consumeDiff',
      key: 'consumeDiff',
      align: 'center',
      // ellipsis: true,
      // width: 120,
    },
  ]
  const getHeight = () => {
    const h = document.body.clientHeight + 100
    if (h >= 1080) {
      return 308
    } else if (h >= 1024) {
      return 260
    } else if (h >= 992) {
      return 260
    } else if (h >= 900) {
      return 195
    } else if (h >= 768) {
      return 140
    }
    return 140
  }
  useEffect(() => {
    const getList = async () => {
      setLoading(true)
      try {
        const res = await api.getHomeBranchConsumption(dateType)
        if (res.data) {
          setTableData(res.data)
        }
      } catch (err) {
        setTableData([])
        message.error(err)
      } finally {
        setLoading(false)
      }
    }
    getList()
  }, [dateType])
  return (
    <div className={styles.ElectricityConsumption}>
      <Card
        className={styles.ElectricityConsumption_Card}
        title="支路耗损TOP5"
        size="small"
        extra={
          <Radio.Group defaultValue={1} size="small" onChange={onChange}>
            <Radio.Button value={1}>今日</Radio.Button>
            <Radio.Button value={2}>本月</Radio.Button>
            <Radio.Button value={3}>当年</Radio.Button>
          </Radio.Group>
        }
      >
        <Row className={styles.ElectricityConsumption_height}>
          <Col span={24} className={styles.ElectricityConsumption_height}>
            <Table
              loading={loading}
              dataSource={tableData}
              columns={columns}
              pagination={false}
              scroll={{ y: getHeight() }}
              rowKey="ecName"
              className={styles.ElectricityConsumption_height}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default BranchConsumption
