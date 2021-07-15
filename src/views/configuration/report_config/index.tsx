import config1Svg from '@/assets/images/config1.svg'
import config2Svg from '@/assets/images/config2.svg'
import ButtonComponent from '@/component/button'
import api from '@/service/api'
import { IReportTypeName } from '@/types/common'
import { IReportConfig, ITransformer } from '@/types/resType'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import {
  Table,
  Row,
  Col,
  Space,
  Button,
  DatePicker,
  message,
  Modal,
  Tooltip,
  Card,
  Switch,
  Input,
} from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import moment from 'moment'
import React, { useState, useCallback, useEffect } from 'react'
import AddConfig from './addConfig'
import styles from './index.module.less'
const { RangePicker } = DatePicker
const ReportConfig = () => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [total, setTotal] = useState(0)
  const [reportTypeDic] = useState(Object.entries(IReportTypeName))
  const [queryParams, setQueryParmas] = useState({ current: 1, size: 10, inputName: '' })
  const [tableData, setTabelData] = useState<IReportConfig[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [configInfo, setConfigInfo] = useState<any>()
  const [configType, setConfigType] = useState<string[]>([])
  const [configTypeCopy, setConfigTypeCopy] = useState<string[]>([])
  const [inputName, setInputName] = useState<string>('')
  const [dateTime, setDateTime] = useState<string[]>([])
  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>) => setSelectedRowKeys(selectedRowKeys),
  }
  //新增记录
  const addRecord = () => {
    setConfigInfo(undefined)
    setVisible(true)
  }
  //修改记录
  const editRecord = (params: IReportConfig) => {
    setConfigInfo(params)
    setVisible(true)
  }
  //修改记录
  const editRecordStatus = async (status: boolean, params: IReportConfig) => {
    try {
      const res = await api.editReportConfigStatus({ ...params, manulState: status })
      if (res.data) {
        message.success('操作成功')
        onOk()
      }
    } catch (err) {
      message.error(err)
    } finally {
      setLoading(false)
    }
  }
  //删除记录
  const deleteRecords = async (params?: string) => {
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
          const res = await api.deleteReportConfig(params ? params : selectedRowKeys.join(','))
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
  const handleSearch = (value: string) => {
    setInputName(value)
  }
  // 获取设备列表
  const getList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getReportConfigPage({
        ...queryParams,
        inputName,
        begin: dateTime.length > 0 ? dateTime[0] : undefined,
        end: dateTime.length > 0 ? dateTime[1] : undefined,
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
  }, [queryParams, inputName, dateTime])
  //弹窗子组件方法
  const onClose = () => {
    setVisible(false)
  }
  //弹窗子组件方法
  const onOk = useCallback(() => {
    setVisible(false)
    getList()
  }, [getList])
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

  const getReportConfigTypes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getReportConfigTypes()
      if (res.data) {
        setConfigType(res.data.mrcTypeList)
        setConfigTypeCopy(res.data.mrcTypeList)
      }
    } catch (err) {
      message.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getList()
    getReportConfigTypes()
  }, [getList, getReportConfigTypes])

  const activeConfig = (params: any) => {
    let arr: string[] = Object.assign([], configTypeCopy)
    if (arr.indexOf(params[0]) > -1) {
      const index = arr.indexOf(params[0])
      arr.splice(index, 1)
    } else {
      arr = arr.concat([params[0]])
    }
    editReportConfigTypes(arr)
  }
  const editReportConfigTypes = useCallback(
    async (params: string[]) => {
      try {
        const res = await api.editReportConfigTypes({ mrcTypeList: params })
        if (res.data) {
          getReportConfigTypes()
        }
      } catch (err) {
        message.error(err)
      }
    },
    [getReportConfigTypes]
  )
  const changeDate = (val: any, valString: any) => {
    if (valString[0] !== '') {
      setDateTime(valString)
    } else {
      setDateTime([])
    }
  }
  // 表头
  const columns: ColumnType<IReportConfig>[] = [
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
      title: '启用抄表时段',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => (
        <span>
          {moment(record.manulBegintime).format('YYYY-MM-DD HH:mm:ss')}~
          {moment(record.manulEndtime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '操作时间',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      align: 'left',
      width: 200,
      ellipsis: true,
      render: (text, record, index) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'manulState',
      key: 'manulState',
      align: 'left',
      width: 150,
      ellipsis: true,
      render: (text, record, index) => (
        <Switch
          checked={record.manulState}
          onChange={(checked: boolean) => editRecordStatus(checked, record)}
        />
      ),
    },
    {
      title: '备注',
      dataIndex: 'manulDesc',
      key: 'manulDesc',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'center',
      width: 210,
      render: (_text: any, record: IReportConfig, index: number) => {
        return (
          <>
            <Space>
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
                onClick={() => deleteRecords(record.manulId)}
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
      <Row align="middle" className={styles.reportConfig} style={{ paddingBottom: 12 }}>
        <Card style={{ width: '100%', fontSize: 18 }}>
          <Row>
            <Col style={{ width: 100, lineHeight: '43px', fontSize: 14, color: '#00A2B7' }}>
              生成报表:
            </Col>
            <Col style={{ width: 'calc(100% - 120)' }}>
              <Row gutter={24}>
                {reportTypeDic.map((item) => (
                  <Col
                    className={styles.configItem}
                    style={{
                      borderColor: configType.indexOf(item[0]) > -1 ? '#13C2C2' : '#F0F0F0',
                    }}
                    key={item[0]}
                    onClick={() => activeConfig(item)}
                  >
                    {item[1]}
                    <img
                      src={configType.indexOf(item[0]) > -1 ? config2Svg : config1Svg}
                      style={{ marginLeft: 24 }}
                      height={20}
                      alt=" "
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 16 }}>
          <Row>
            <Col span={5} style={{ lineHeight: '32px' }}>
              手动抄表维护
              <Tooltip
                placement="bottom"
                title="开始月份：对于跨月收费，可以将收费的全额记录到开始月份中;
                结束月份：对于跨月收费，可以将收费的全额记录到结束月份中;"
              >
                <span style={{ marginLeft: '20%', color: '#CCCCCC' }}>
                  <ExclamationCircleOutlined style={{ paddingRight: 8 }} />
                  说明
                </span>
              </Tooltip>
            </Col>
            <Col
              span={19}
              style={{ textAlign: 'right', color: '#8E8E8E' }}
              className={styles['operate-button']}
            >
              <Space>
                启用抄表时段：
                <RangePicker onChange={changeDate} />
                <Input.Search onSearch={handleSearch} placeholder="操作人" allowClear />
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
                rowKey="manulId"
              />
            </Col>
          </Row>
        </Card>
      </Row>

      <Modal
        bodyStyle={{ padding: '24px 24px 0px 24px' }}
        title={configInfo ? '修改报表配置信息' : '添加报表配置信息'}
        visible={visible}
        width="35%"
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
      >
        <AddConfig configInfo={configInfo} onOk={onOk} onCancel={onClose} />
      </Modal>
    </div>
  )
}

export default ReportConfig
