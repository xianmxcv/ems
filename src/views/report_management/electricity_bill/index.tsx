import api from '@/service/api'
import { IReportTypeName, IReportType } from '@/types/common'
import { ITreeData, IResReport, IResReportHead } from '@/types/resType'
import { transformTree } from '@/utils/common'
import { handleDownFile } from '@/utils/downfile'
import { UploadOutlined, PrinterOutlined } from '@ant-design/icons'
import { Row, Col, Divider, Space, Button, Table, message, Modal } from 'antd'
import { ColumnType } from 'antd/lib/table'
import {
  filter,
  find,
  findIndex,
  flattenDeep,
  includes,
  isEmpty,
  replace,
  toUpper,
  trimEnd,
} from 'lodash-es'
import moment from 'moment'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import ReactToPrint from '../common/ReactToPrint'
import Header from '../common/header'
import TreeTabs from '../common/index'
import styles from './index.module.less'

interface IQueryParams {
  dateType: string
  date: string
}

interface IKeyParams {
  unitIds?: any[]
  showKey?: any
}

interface IResData {
  data: IResReport
}

const ElectricityBill = () => {
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState<ITreeData[]>([])
  const [treeData1, setTreeData1] = useState<ITreeData[]>([])
  const [checkedKeys1, setCheckedKeys1] = useState<React.Key[]>([])
  const [checkedKeys2, setCheckedKeys2] = useState<React.Key[]>([])
  const [defaultExpandId1, setDefaultExpandId1] = useState<React.Key>('')
  const [defaultExpandId2, setDefaultExpandId2] = useState<React.Key>('')
  const [tableData, setTabelData] = useState<any[]>([])
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    dateType: '',
    date: moment().format('YYYY-MM-DD'),
  })
  const [keyParams, setKeyParams] = useState<IKeyParams>({ showKey: '1' })
  const [columns, setColumns] = useState<ColumnType<any>[]>([])
  const [columns1, setColumns1] = useState<ColumnType<any>[]>([])
  const [ctxParams, setCtxParams] = useState<any>({ width: 2600 })
  const [exportLoading, setExportLoading] = useState(false)
  const [visiblePrint, setVisiblePrint] = useState(false)
  const [reportTypeDic] = useState(IReportTypeName)
  const [configType, setConfigType] = useState<any[]>([])

  const componentRef = useRef<any>(null)
  const getReport = useCallback(async () => {
    if (!queryParams.dateType) return
    setLoading(true)
    setTabelData([])
    // if (isEmpty(keyParams.unitIds)) return
    const common: any = {
      title: '区域名称',
      key: 'label',
      dataIndex: 'label',
      width: 100,
      align: 'center',
      // ellipsis: true,
      render: (_text: any, record: any, index: number) => {
        return <span>{replace(trimEnd(record.label || '--', ','), /,/g, '-')}</span>
      },
    }
    try {
      const { data }: IResData =
        keyParams.showKey === '1'
          ? await api.getReportCostCircuit({ ...queryParams, unitIds: keyParams.unitIds })
          : await api.getReportCostDevice({ ...queryParams, unitIds: keyParams.unitIds })
      if (isEmpty(data)) return

      const { header = [], datasets = [] } = data
      const headers: ColumnType<any>[] = [
        common,
        ...(queryParams.dateType === 'DAY'
          ? header.map(({ headerSub, label }: IResReportHead) => ({
              title: label,
              key: label,
              children: [
                ...headerSub.map((title: any) => ({
                  title: title,
                  dataIndex: `${label}${title}`,
                  key: `${label}${title}`,
                  width: 90,
                  ellipsis: true,
                })),
              ],
            }))
          : [
              ...header
                .map(({ headerSub, label }: IResReportHead) => ({
                  title: label,
                  key: label,
                  children: [
                    ...headerSub.map((title: any) => ({
                      title: title,
                      dataIndex: `${label}${title}`,
                      key: `${label}${title}`,
                      width: 100,
                      ellipsis: true,
                    })),
                  ],
                }))
                .splice(0, header.length - 1),
              {
                title: '合计',
                key: '合计合计',
                dataIndex: '合计合计',
                width: 100,
                align: 'center',
              },
            ]),
      ]
      if (queryParams.dateType === 'YEAR') {
        const headers1 = headers.map((el: any) => {
          const hs = filter(el.children, (ele: any) => includes(ele.title, '合计'))
          return isEmpty(hs) ? el : { ...el, children: hs }
        })
        setColumns1(headers1)
        const width =
          flattenDeep(
            headers1.map((ele: any) => {
              if (ele.children) {
                return ele.children
              } else {
                return [ele]
              }
            })
          ).length * 100
        setCtxParams({ width })
      }
      const list = datasets.map((ele: any, index: any) => {
        const o: any = {}
        header.forEach(({ headerSub, label }: IResReportHead, Pindex: number) => {
          headerSub.forEach((el: any, Pindex1: any) => {
            o[`${label}${el}`] = ele.dataList[Pindex][Pindex1]
          })
        })
        return { ...ele, ...o, rowKey: index }
      })
      setTabelData(list)

      setColumns(headers)
    } catch (error) {
      message.error(error)
    } finally {
      setLoading(false)
    }
  }, [keyParams, queryParams])

  const onCheck = (checkedKeys: any) => {
    setKeyParams({ ...keyParams, unitIds: checkedKeys })
    keyParams.showKey === '1' ? setCheckedKeys1(checkedKeys) : setCheckedKeys2(checkedKeys)
  }
  // getElectricNameList

  const onEmitValue = (value: any) => {
    if (value.key === '1') {
      setKeyParams({ showKey: value.key, unitIds: checkedKeys1 })
    } else {
      getReporDeviceTree().then((keys) => {
        setKeyParams({ showKey: value.key, unitIds: keys })
      })
    }
  }
  const onEmitHeaderValue = (value: any) => {
    if (value.reset) {
      if (keyParams.showKey === '1') {
        setCheckedKeys1([])
      } else {
        setCheckedKeys2([])
      }
      setKeyParams({ ...keyParams, unitIds: [] })
      setQueryParams({ ...queryParams, dateType: configType[0]?.value || 'DAY' })
      return
    }
    setQueryParams({ ...queryParams, ...value })
  }
  const getList = useCallback(async () => {
    try {
      const { data = [] } = await api.getReportCircuitTree()
      transformTree(data)
      // let treeIteratedData = transformTree(data)
      // let index = findIndex(treeIteratedData, ['disabled', false])
      // if (index >= 0) {
      // setCheckedKeys1([treeIteratedData[index].key])
      // setDefaultExpandId1(treeIteratedData[index].fullLinkKey || '')
      // } else {
      //   setCheckedKeys1([])
      // }
      setTreeData(data)
    } catch (error) {
      message.error(error)
    }
  }, [])
  const exportTable = async (event: any) => {
    setExportLoading(true)
    let str = `?date=${queryParams.date}&dateType=${queryParams.dateType}`
    if (keyParams.unitIds?.length) {
      str = `${str}&unitIds=${keyParams.unitIds.join(',')}`
    }
    await handleDownFile(
      event,
      `/energy-config/reportCost/${keyParams.showKey === '1' ? 'circuit' : 'device'}/export${str}`
    )
    setExportLoading(false)
  }
  const getReporDeviceTree = async () => {
    if (treeData1.length) return checkedKeys2
    try {
      const { data = [] } = await api.getReporDeviceTree()
      transformTree(data)
      // let treeIteratedData = transformTree(data)
      // let index = findIndex(treeIteratedData, ['disabled', false])
      // if (index >= 0) {
      // setCheckedKeys2([treeIteratedData[index].key])
      // setDefaultExpandId2(treeIteratedData[index].fullLinkKey || '')
      // setTreeData1(data)
      // return treeIteratedData[index].key
      // } else {
      //   setTreeData1(data)
      //   setCheckedKeys2([])
      // }
      setTreeData1(data)
      return []
    } catch (error) {
      message.error(error)
      return []
    }
  }
  const getReportConfigTypes = useCallback(async () => {
    try {
      const res = await api.getReportConfigTypes()
      if (res.data) {
        const list: any[] = []
        Object.entries(reportTypeDic).map((ele) => {
          const o: IReportType = find(res.data.mrcTypeList, (el) => el === ele[0])
          if (o) {
            list.push({
              label: reportTypeDic[o].slice(0, 1),
              value: toUpper(o),
            })
          }
        })
        if (!isEmpty(list)) {
          const [{ value }] = list
          setQueryParams({
            dateType: value,
            date: moment().format('YYYY-MM-DD'),
          })
        } else {
          setQueryParams({
            dateType: 'DAY',
            date: moment().format('YYYY-MM-DD'),
          })
        }
        setConfigType(list)
      }
    } catch (err) {
      message.error(err)
    }
  }, [reportTypeDic])

  useEffect(() => {
    getReportConfigTypes()
  }, [getReportConfigTypes])
  useEffect(() => {
    getList()
  }, [getList])
  useEffect(() => {
    getReport()
  }, [getReport])

  return (
    <Row style={{ height: '100%' }}>
      <Col style={{ width: 305, height: '100%', overflow: 'auto' }}>
        <TreeTabs
          placeholder=""
          isSearch={true}
          checkable={true}
          selectable={false}
          // checkStrictly={true}
          checkedKeys1={checkedKeys1}
          checkedKeys2={checkedKeys2}
          defaultExpandId1={defaultExpandId1}
          defaultExpandId2={defaultExpandId2}
          onCheck={onCheck}
          onEmitValue={onEmitValue}
          dataTree={treeData}
          dataTree1={treeData1}
        />
      </Col>
      <Divider type="vertical" className={styles.auto_acquisition} />
      <Col style={{ width: 'calc(100% - 311px)', padding: 12, overflowY: 'auto', height: '100%' }}>
        <Row>
          <Col>
            <Header
              onEmitValue={onEmitHeaderValue}
              configType={configType}
              status={queryParams.dateType}
            />
          </Col>
        </Row>
        <Row style={{ height: 60 }} justify="space-between" align="middle">
          <Col>
            电费
            {queryParams.dateType === 'DAY'
              ? '日'
              : queryParams.dateType === 'WEEK'
              ? '周'
              : queryParams.dateType === 'MONTH'
              ? '月'
              : queryParams.dateType === 'QUARTER'
              ? '季'
              : queryParams.dateType === 'YEAR'
              ? '年'
              : '日'}
            清单
          </Col>
          <Col>
            <Space>
              {queryParams.dateType === 'DAY' ? null : '单位：元'}
              <Button onClick={(event) => exportTable(event)} loading={exportLoading}>
                <UploadOutlined />
                导出
              </Button>
              {queryParams.dateType === 'YEAR' ? (
                <Button onClick={() => setVisiblePrint(true)} type="primary">
                  <PrinterOutlined />
                  打印
                </Button>
              ) : null}
            </Space>
          </Col>
        </Row>
        <Row>
          <Col style={{ width: '100%' }}>
            <Table
              loading={loading}
              dataSource={tableData}
              size="small"
              bordered
              scroll={{ x: 100, y: 'calc(100vh - 350px)' }}
              columns={columns}
              pagination={false}
              rowKey="rowKey"
            />
          </Col>
        </Row>
        <Row>
          <Col
            style={{ width: '100%', position: 'absolute', zIndex: -11, top: 0, left: 0 }}
            ref={componentRef}
          >
            <Table
              loading={loading}
              dataSource={tableData}
              size="small"
              bordered
              scroll={{ x: 100 }}
              columns={columns1}
              pagination={false}
              rowKey="rowKey"
            />
          </Col>
        </Row>
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
              title={`电费清单`}
            />
          }
        >
          <p style={{ fontWeight: 600 }}>
            为保障打印效果，系统默认打印纸张尺寸为：A4，其他尺寸清晰度偏低；
          </p>
          <p>{'(设置不符：可在打印预览页面点击 更多设置 --> 纸张尺寸 --> A4)'}</p>
        </Modal>
      </Col>
    </Row>
  )
}

export default ElectricityBill
