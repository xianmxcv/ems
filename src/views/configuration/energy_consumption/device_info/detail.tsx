import { Row, Col, Table, Card, Descriptions } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { replace, trimEnd } from 'lodash-es'
import moment from 'moment'
import React from 'react'
import { IFormEnergyDeviceDetail } from '../index'
import styles from './index.module.less'

interface IProps {
  title: string
  initialValues: IFormEnergyDeviceDetail
  addDevice: () => void
  Cancel: () => void
}

const DeviceDetail = (props: IProps) => {
  const columns: ColumnType<any>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text: any, record: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: '变更上级支路名称',
      dataIndex: 'edCircuit',
      key: 'edCircuit',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '变更时间',
      dataIndex: 'edrBeginTime',
      key: 'edrBeginTime',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text: any, record: any, index: number) => (
        <span>
          {record.edrBeginTime ? moment(record.edrBeginTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
        </span>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      align: 'left',
      ellipsis: true,
    },
  ]

  return (
    <Row className={styles['view-modal']}>
      <Col span={24}>
        <Card>
          <Descriptions column={2}>
            <Descriptions.Item label="编设备名称">{props.initialValues.edName}</Descriptions.Item>
            <Descriptions.Item label="所属分项">{props.initialValues.itemName}</Descriptions.Item>
            <Descriptions.Item label="额定电压(V)">
              {props.initialValues.edVoltage}
            </Descriptions.Item>
            <Descriptions.Item label="额定输入功率(W)">
              {props.initialValues.edInputPower}
            </Descriptions.Item>
            <Descriptions.Item label="额定输入电流(A)">
              {props.initialValues.edInputElectric}
            </Descriptions.Item>
            <Descriptions.Item label="最大输入功率(W)">
              {props.initialValues.edMaxPower}
            </Descriptions.Item>
            <Descriptions.Item label="最大输入电流(A)">
              {props.initialValues.edMaxElectric}
            </Descriptions.Item>
            <Descriptions.Item label="所属区域">
              {replace(trimEnd(props.initialValues.rchainName || '--', ','), /,/g, '-')}
            </Descriptions.Item>
            <Descriptions.Item label="上级支路名称">
              {replace(trimEnd(props.initialValues.ecChainName || '--', ','), /,/g, '-')}
            </Descriptions.Item>
            <Descriptions.Item label="能耗部门">
              {props.initialValues.edDep || '--'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
      <Col span={24} style={{ marginTop: 16 }}>
        支路变更记录：
      </Col>
      <Col span={24} style={{ marginTop: 8, marginBottom: 16 }}>
        <Table
          dataSource={props.initialValues.ecDeviceList?.map((ele, index) => ({
            ...ele,
            rowKey: `${ele.ecId}${index}`,
          }))}
          size="small"
          columns={columns}
          pagination={false}
          rowKey="rowKey"
        />
      </Col>
    </Row>
  )
}

export default DeviceDetail
