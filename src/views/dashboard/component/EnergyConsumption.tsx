import api from '@/service/api'
import { IResHomeEnergyConsumptionStatic, IResHomeEnergyUsage } from '@/types/resType'
import { Card, Col, message, Radio, Row, Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.less'

const EnergyConsumption = () => {
  const [dateType, setDateType] = useState<string>('day')
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<IResHomeEnergyConsumptionStatic[]>([])
  const [datas, setDatas] = useState<IResHomeEnergyUsage[]>([])

  const onChange = (value: any) => {
    setDateType(value.target.value)
  }

  const getHeight = () => {
    const h = document.body.clientHeight + 100
    if (h >= 1080) {
      return 308
    } else if (h >= 1024) {
      return 260
    } else if (h >= 992) {
      return 260
    } else if (h >= 900) {
      return 220
    } else if (h >= 768) {
      return 160
    }
    return 160
  }

  useEffect(() => {
    const getList = async () => {
      try {
        const res = await api.getHomeEnergyConsumptionStatic(dateType)
        if (res.data) {
          setTableData(res.data)
        }
      } catch (err) {
        setTableData([])
        message.error(err)
      }
    }
    const getDatas = async () => {
      setLoading(true)
      try {
        const res = await api.getHomeEnergyUsage(dateType)
        if (res.data) {
          setDatas(res.data)
        }
      } catch (err) {
        setTableData([])
        message.error(err)
      } finally {
        setLoading(false)
      }
    }
    getList()
    getDatas()
  }, [dateType])

  const tableColumns: ColumnType<IResHomeEnergyUsage>[] = [
    {
      title: '分项名称',
      dataIndex: 'name',
    },
    {
      title: '能耗',
      dataIndex: 'amount',
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
  ]

  const expandedRowRender = () => {
    const columns: ColumnType<IResHomeEnergyConsumptionStatic>[] = [
      {
        title: '一级区域名称',
        dataIndex: 'regionName',
      },
      {
        title: '耗电',
        dataIndex: 'sumEpi',
      },
      {
        title: '占比',
        dataIndex: 'areaProportion',
      },
    ]

    return <Table columns={columns} dataSource={tableData} pagination={false} />
  }

  return (
    <div className={styles.ElectricityConsumption}>
      <Card
        className={styles.ElectricityConsumption_Card}
        title="分项能耗"
        size="small"
        extra={
          <Radio.Group defaultValue="day" size="small" onChange={onChange}>
            <Radio.Button value="day">今日</Radio.Button>
            <Radio.Button value="month">本月</Radio.Button>
            <Radio.Button value="year">当年</Radio.Button>
          </Radio.Group>
        }
      >
        <Row>
          <Col span={24}>
            <Table
              loading={loading}
              dataSource={datas}
              columns={tableColumns}
              pagination={false}
              scroll={{ y: getHeight() }}
              rowKey="name"
              expandable={{
                expandedRowRender,
                rowExpandable: (record) => record.name === '电',
                fixed: 'right',
              }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default EnergyConsumption
