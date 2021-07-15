import api from '@/service/api'
import { IReqDeviceComsumption } from '@/types/reqType'
import { handleDownFile } from '@/utils/downfile'
import { UploadOutlined } from '@ant-design/icons'
import { Row, Col, Table, Button, message, Spin } from 'antd'
import { TablePaginationConfig } from 'antd/lib/table'
import React, { useState, useEffect } from 'react'
import styles from '../index.module.less'
interface IProps {
  queryParams: IReqDeviceComsumption
}
const ComponentTable = (props: IProps) => {
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setSize(Number(pagination.pageSize))
    setCurrent(Number(pagination.current))
  }
  const [columns, setColumns] = useState<any>([])
  useEffect(() => {
    const getTableData = async () => {
      try {
        setLoading(true)
        const res = await api.getBranchConsumptionPage({ ...props.queryParams, current, size })
        if (res.data) {
          let arr: any = [
            {
              title: '序号',
              key: 'index',
              width: 60,
              align: 'center',
              render: (text: any, record: any, index: number) => (
                <span>{current && size && (current - 1) * size + index + 1}</span>
              ),
            },
          ]
          arr.push({
            title: '时间',
            dataIndex: 'dateTime',
            key: 'dateTime',
            align: 'left',
            ellipsis: true,
          })
          res.data.data.labels.forEach((element, index) => {
            arr.push({
              title: element,
              dataIndex: 'device' + index,
              key: 'device' + index,
              align: 'left',
              ellipsis: true,
            })
          })
          if (res.data.data.rates) {
            arr.push({
              title: res.data.data.rates.label,
              dataIndex: 'rate',
              key: 'rate',
              align: 'left',
              ellipsis: true,
            })
          }
          setColumns(arr)
          let dataArr: any = []
          res.data.data.datasets.forEach((item, dateIndex) => {
            let obj: any = {
              dateTime: item.label,
            }
            item.values.forEach((value, index) => {
              obj['device' + index] = value
            })
            if (res.data.data.rates) {
              obj['rate'] = res.data.data.rates.values[dateIndex]
            }
            dataArr.push(obj)
          })
          setTableData(dataArr)
          setTotal(res.data.total)
        }
      } catch (err) {
        message.error(err)
      } finally {
        setLoading(false)
      }
    }
    getTableData()
  }, [props.queryParams, current, size])
  useEffect(() => {
    setCurrent(1)
  }, [props.queryParams])
  return (
    <div>
      <Row style={{ marginTop: 8, padding: '8px 0px' }}>
        <Col span={12}>支路列表</Col>
        <Col
          span={12}
          style={{ textAlign: 'right', color: '#999999' }}
          className={styles['operate-button']}
        >
          单位kWh
          <Button
            style={{ marginLeft: '8px' }}
            onClick={(event) =>
              handleDownFile(
                event,
                `/energy-config/reportCircuit/export?begin=${props.queryParams.begin}&end=${
                  props.queryParams.end
                }&dateType=${props.queryParams.dateType}&unitIds=${props.queryParams.unitIds?.join(
                  ','
                )}` +
                  (props.queryParams.compareType
                    ? `&compareType=${props.queryParams.compareType}`
                    : '')
              )
            }
          >
            <UploadOutlined /> 导出
          </Button>
        </Col>
      </Row>
      <Row style={{ height: 300, overflowY: 'scroll' }}>
        <Col span={24}>
          <Table
            size="small"
            loading={loading}
            columns={columns}
            dataSource={tableData}
            onChange={handleTableChange}
            pagination={{
              current: current,
              pageSize: size,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: () => <span>共 {total} 条</span>,
            }}
            rowKey="dateTime"
          />
        </Col>
      </Row>
    </div>
  )
}

export default ComponentTable
