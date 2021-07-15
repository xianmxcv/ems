import TreeComponent from '@/component/showTree'
import api from '@/service/api'
import { IResElectricNameList } from '@/types/resType'
import { transformTree } from '@/utils/common'
import { handleDownFile } from '@/utils/downfile'
import { UploadOutlined, SearchOutlined, UndoOutlined, PrinterOutlined } from '@ant-design/icons'
import {
  Row,
  Col,
  Divider,
  Space,
  DatePicker,
  Button,
  Input,
  Table,
  message,
  Spin,
  Modal,
  Empty,
} from 'antd'
import { ColumnType, TablePaginationConfig } from 'antd/lib/table'
import { findIndex, omit } from 'lodash-es'
import moment, { Moment } from 'moment'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import ReactToPrint from '../common/ReactToPrint'
import styles from './index.module.less'
const ElectricEnergyReport = () => {
  const date = moment()
  const [treeData, setTreeData] = useState<IResElectricNameList[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [queryParams, setQueryParams] = useState<any>({ date: date.format('YYYY-MM-DD HH:mm:ss') })
  const [defaultValue, setDefaultValue] = useState<Moment>(date)
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [ctxParams] = useState<any>({ width: 1400 })
  const [tables, setTables] = useState<any[]>([])
  const [exportLoading, setExportLoading] = useState(false)
  const [defaultExpandId, setDefaultExpandId] = useState<React.Key>('')
  const componentRef = useRef<any>(null)
  const [visiblePrint, setVisiblePrint] = useState(false)

  const getList = useCallback(async () => {
    try {
      const { data = [] } = await api.getRegionList()
      // let treeIteratedData = transformTree(data)
      // let index = findIndex(treeIteratedData, ['disabled', false])
      // if (index >= 0) {
      //   setCheckedKeys([treeIteratedData[index].key])
      //   setDefaultExpandId(treeIteratedData[index].fullLinkKey || '')
      // } else {
      //   setCheckedKeys([])
      // }
      transformTree(data)
      setTreeData(data)
    } catch (error) {
      message.error(error)
    }
  }, [])
  const getReportParams = useCallback(async () => {
    setLoading(true)
    try {
      const { data = [] } = await api.getReportParams(queryParams)

      const commons: any = [
        {
          title: '电箱编号',
          key: 'emName',
          dataIndex: 'emName',
          align: 'center',
          render: (text: any) => (
            <div style={{ width: 100, wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {text}
            </div>
          ),
        },
        {
          title: '序号',
          key: 'emNumber',
          dataIndex: 'emNumber',
          align: 'center',
          render: (text: any) => (
            <div style={{ width: 60, wordWrap: 'break-word', wordBreak: 'break-word' }}>{text}</div>
          ),
        },
        {
          title: '支路名称',
          key: 'ecName',
          dataIndex: 'ecName',
          align: 'center',
          render: (text: any) => (
            <div style={{ width: 100, wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {text}
            </div>
          ),
        },
      ]
      const tables = data.map((ele: any) => {
        const dataChildren: any = []
        const { cgcTitle = [], tfName, regionGrids = [] } = ele
        regionGrids.forEach((el: any, ppindex: number) => {
          const { meterGrids = [], regionName } = el
          const list = meterGrids.map((e: any, pindex: number) => {
            const { emName, emNumber, ecName } = e
            const o: any = { regionName, emName, emNumber, ecName }
            cgcTitle.map((item: any, index: number) => {
              o[`${tfName}${item}`] = e.datasets[index]
            })
            return { ...o, rowKey: `${ppindex}-${pindex}`, rowSpan: pindex ? 0 : meterGrids.length }
          })
          dataChildren.push(...list)
        })
        return {
          data: dataChildren,
          columns: [
            {
              title: tfName,
              key: 'tfName',
              children: [
                {
                  title: '区域名称',
                  key: 'regionName',
                  dataIndex: 'regionName',
                  align: 'center',
                  render: (text: any, row: any, index: number) => {
                    return {
                      children: (
                        <div
                          style={{ width: 100, wordWrap: 'break-word', wordBreak: 'break-word' }}
                        >
                          {row.regionName}
                        </div>
                      ),
                      props: { rowSpan: dataChildren[index].rowSpan },
                    }
                  },
                },
                ...commons,
                ...cgcTitle.map((title: any) => ({
                  title: title,
                  dataIndex: `${tfName}${title}`,
                  key: `${tfName}${title}`,
                  width: 100,
                  render: (text: any) => (
                    <div style={{ width: 100, wordWrap: 'break-word', wordBreak: 'break-word' }}>
                      {text}
                    </div>
                  ),
                  // ellipsis: true,
                })),
              ],
            },
          ],
        }
      })
      setTables(tables)
    } catch (error) {
      message.error(error)
    } finally {
      setLoading(false)
    }
  }, [queryParams])
  const onCheck = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys)
    setQueryParams({ ...queryParams, regionIds: checkedKeys })
  }
  const onChangeDate = (date: any, dateString: any) => {
    setDefaultValue(date)
  }

  const onChangeInput = (e: any) => {
    setSearchValue(e.target.value)
  }
  const handleSearch = () => {
    if (searchValue) {
      setQueryParams({
        ...queryParams,
        ecName: searchValue,
        date: defaultValue.format('YYYY-MM-DD HH:mm:ss'),
      })
    } else {
      setQueryParams({
        ...omit(queryParams, ['ecName']),
        date: defaultValue.format('YYYY-MM-DD HH:mm:ss'),
      })
    }
  }
  const exportTable = async (event: any) => {
    setExportLoading(true)
    let str = `?date=${queryParams.date}`
    if (checkedKeys.length && queryParams.ecName) {
      str = `${str}&regionIds=${checkedKeys.join(',')}&ecName=${queryParams.ecName}`
    } else if (checkedKeys.length) {
      str = `${str}&regionIds=${checkedKeys.join(',')}`
    } else if (queryParams.ecName) {
      str = `${str}&ecName=${queryParams.ecName}`
    }
    await handleDownFile(event, `/energy-config/reportParams/export${str}`)
    setExportLoading(false)
  }
  const reSet = () => {
    const d = moment()
    setSearchValue('')
    setCheckedKeys([])
    setDefaultValue(d)
    setQueryParams({ date: d.format('YYYY-MM-DD HH:mm:ss') })
  }
  useEffect(() => {
    getList()
  }, [getList])
  useEffect(() => {
    getReportParams()
  }, [getReportParams])

  return (
    <Row style={{ height: '100%', overflow: 'hidden' }}>
      <Col style={{ width: 300, height: '100%' }}>
        <Row align="middle" style={{ padding: 16, backgroundColor: 'rgba(249, 249, 249, 1)' }}>
          区域选择
        </Row>
        <div style={{ padding: 12 }}>
          <TreeComponent
            selectable={false}
            placeholder="区域名称"
            checkable={true}
            isSearch={true}
            checkedKeys={checkedKeys}
            defaultExpandId={defaultExpandId}
            onCheck={onCheck}
            treeData={treeData}
          />
        </div>
      </Col>
      <Divider type="vertical" className={styles.auto_acquisition} />
      <Col
        style={{
          width: 'calc(100% - 306px)',
          padding: 12,
          height: '100%',
        }}
      >
        <Row>
          <Col>
            <Space>
              支路名称
              <Input
                value={searchValue}
                placeholder="请输入搜索内容"
                onChange={onChangeInput}
                allowClear
              />
              时间点选择
              <DatePicker
                onChange={onChangeDate}
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                allowClear={false}
                value={defaultValue}
              />
              <Button type="primary" onClick={handleSearch}>
                <SearchOutlined /> 查询
              </Button>
              <Button onClick={reSet}>
                <UndoOutlined />
                重置
              </Button>
            </Space>
          </Col>
        </Row>
        <Divider />
        <Row justify="space-between">
          <Col>电参量统计报表</Col>
          <Col>
            <Space>
              <span>抄表时间：{defaultValue.format('YYYY-MM-DD HH:mm:ss')}</span>
              <Button onClick={(event) => exportTable(event)} loading={exportLoading}>
                <UploadOutlined />
                导出
              </Button>

              <Button onClick={() => setVisiblePrint(true)} type="primary">
                <PrinterOutlined />
                打印
              </Button>
            </Space>
          </Col>
        </Row>

        <Row style={{ marginTop: 12, height: '100%' }} className={styles.specail_table}>
          <Col
            style={{
              width: '100%',
              overflow: 'auto',
              maxHeight: 'calc(100% - 140px)',
              height: 'fit-content',
            }}
            ref={componentRef}
          >
            {loading ? (
              <Row justify="center">
                <Spin />
              </Row>
            ) : tables.length ? (
              tables.map((ele, index) => {
                return (
                  <Table
                    key={index}
                    dataSource={ele.data}
                    size="small"
                    bordered
                    // scroll={{ x: 100, y: 250 }}
                    columns={ele.columns}
                    pagination={false}
                    rowKey="rowKey"
                  />
                )
              })
            ) : (
              <Row justify="center">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </Row>
            )}
          </Col>
        </Row>
      </Col>

      <Modal
        title="提示"
        visible={visiblePrint}
        width="40%"
        onOk={() => setVisiblePrint(false)}
        onCancel={() => setVisiblePrint(false)}
        okText={
          <ReactToPrint
            ctxParams={ctxParams}
            text="确认打印"
            ctxRef={componentRef}
            title={`电参量报表`}
          />
        }
      >
        <p style={{ fontSize: 18, fontWeight: 600 }}>
          为保障打印效果，系统默认打印纸张尺寸为：A4，其他尺寸清晰度偏低；
        </p>
        <p>{'(设置不符：可在打印预览页面点击 更多设置 --> 纸张尺寸 --> A4)'}</p>
      </Modal>
    </Row>
  )
}

export default ElectricEnergyReport
