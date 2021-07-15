import api from '@/service/api'
import { ITransformerTypeName, IVoltageLevelName } from '@/types/common'
import { IEtrList, ITransformer } from '@/types/resType'
import { Row, message, Descriptions, Col, Table, Card } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { replace, trimEnd } from 'lodash-es'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import styles from './index.module.less'

interface IProps {
  tfInfo: ITransformer
}
const ViewTransformer = (props: IProps) => {
  const [transformer, setTransformer] = useState<ITransformer>()
  useEffect(() => {
    const getTransformerInfo = async (tfId: string) => {
      try {
        const res = await api.getTransformerInfo(tfId)
        if (res.data) {
          setTransformer(res.data)
        }
      } catch (err) {
        message.error(err)
      }
    }
    if (props.tfInfo) {
      getTransformerInfo(props.tfInfo.tfId ? props.tfInfo.tfId : '')
    }
  }, [props.tfInfo])
  const renderEcName = (params: IEtrList[]) => {
    let arr: string[] = []
    params.map((item) => {
      if (moment().isBefore(item.etrEndTime) && moment(item.etrBeginTime).isBefore(moment())) {
        arr.push(replace(trimEnd(item.ecChainName || '--', ','), /,/g, '-'))
      }
    })
    return arr.join(',')
  }
  const columns: ColumnType<IEtrList>[] = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '变更下挂支路名称',
      dataIndex: 'ecName',
      key: 'ecName',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => (
        <span>{replace(trimEnd(record.ecChainName || '--', ','), /,/g, '-')}</span>
      ),
    },
    {
      title: '变更时间',
      dataIndex: 'etrBeginTime',
      key: 'etrBeginTime',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
            <Descriptions.Item label="变压器名称">{transformer?.tfName}</Descriptions.Item>
            <Descriptions.Item label="变压器类型">
              {transformer ? ITransformerTypeName[transformer?.tfType] : ''}
            </Descriptions.Item>
            <Descriptions.Item label="变压器容量(KVA)">{transformer?.tfCapacity}</Descriptions.Item>
            <Descriptions.Item label="一次侧电压(KV)">{transformer?.tfOnceVolts}</Descriptions.Item>
            <Descriptions.Item label="二次侧电压(KV)">
              {transformer?.tfSecondVolts}
            </Descriptions.Item>
            <Descriptions.Item label="低压侧额定电流(A)">
              {transformer?.tfLowvolElectric}
            </Descriptions.Item>
            <Descriptions.Item label="下挂支路名称">
              {renderEcName(transformer ? transformer?.etrList : [])}
            </Descriptions.Item>
            <Descriptions.Item label="供电单位">
              {transformer?.tfPowerUnit || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="备注">{transformer?.tfDesc || '--'}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
      <Col span={24} style={{ marginTop: 16 }}>
        支路变更记录：
      </Col>
      <Col span={24} style={{ marginTop: 8, marginBottom: 16 }}>
        <Table
          dataSource={transformer?.etrList}
          size="small"
          bordered
          // scroll={{ y: 300 }}
          columns={columns}
          pagination={false}
          rowKey="etrBeginTime"
        />
      </Col>
    </Row>
  )
}

export default ViewTransformer
