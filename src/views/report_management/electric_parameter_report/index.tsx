import api from '@/service/api'
import { IReportTypeName, IReportType } from '@/types/common'
import { ITreeData } from '@/types/resType'
import { IResReport, IResReportHead } from '@/types/resType'
import { transformTree } from '@/utils/common'
import { handleDownFile } from '@/utils/downfile'
import { UploadOutlined, PrinterOutlined } from '@ant-design/icons'
import { Row, Col, Divider, Space, Button, Table, Modal } from 'antd'
import { message } from 'antd'
import { ColumnType } from 'antd/lib/table'
import {
  find,
  findIndex,
  flattenDeep,
  isEmpty,
  replace,
  toUpper,
  trimEnd,
  trimStart,
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
const ElectricParameterReport = () => {
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
  // A4 height 841.89 * 2 = 1683.78 A4 width 595.28 * 2 = 1190.56
  const [ctxParams, setCtxParams] = useState<any>({ width: 2600 })
  const [columns, setColumns] = useState<ColumnType<any>[]>([])
  const [exportLoading, setExportLoading] = useState(false)
  const [visiblePrint, setVisiblePrint] = useState(false)
  const componentRef = useRef<any>(null)
  const [reportTypeDic] = useState(IReportTypeName)
  const [configType, setConfigType] = useState<any[]>([])

  const getReport = useCallback(async () => {
    if (!queryParams.dateType) return
    setTabelData([])
    setLoading(true)
    // if (isEmpty(keyParams.unitIds)) return
    const common: any = {
      title: '支路名称',
      key: 'label',
      dataIndex: 'label',
      width: 100,
      align: 'center',
      // ellipsis: true,
      render: (_text: any, record: any, index: number) => {
        return <span>{replace(trimEnd(record.label || '--', ','), /,/g, '-')}</span>
      },
    }
    let headers: ColumnType<any>[] = []
    try {
      const { data }: IResData =
        keyParams.showKey === '1'
          ? await api.getReportCircuit({ ...queryParams, unitIds: keyParams.unitIds })
          : await api.getReportEnergy({ ...queryParams, unitIds: keyParams.unitIds })
      if (isEmpty(data)) return

      if (queryParams.dateType === 'DAY') {
        const { header = [], datasets = [] } = data
        const [{ label, headerSub = [] }] = header
        headers = [
          common,
          ...headerSub.map((title: any) => ({
            title: title,
            dataIndex: title,
            key: title,
            width: 100,
            ellipsis: true,
          })),
        ]
        const list = datasets.map((ele: any, index: number) => {
          const o: any = {}
          headerSub.forEach((el: any, Pindex: number) => {
            o[el] = ele.dataList[0][Pindex]
          })
          return { ...ele, ...o, rowKey: index }
        })
        setTabelData(list)
      } else if (queryParams.dateType === 'WEEK') {
        const { header = [], datasets = [] } = data
        headers = [
          common,
          ...header
            .map(({ headerSub, label }: IResReportHead, index: number) => ({
              title: label,
              key: label,
              children: [
                ...headerSub.map((title: any) => ({
                  title: title,
                  dataIndex: title === '合计' ? `${label}${title}` : title,
                  key: title === '合计' ? `${label}${title}` : title,
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
        ]
        const list = datasets.map((ele: any, index: number) => {
          const o: any = {}
          header.forEach(({ headerSub, label }: IResReportHead, Pindex: number) => {
            headerSub.forEach((el: any, Pindex1: number) => {
              o[el === '合计' ? `${label}${el}` : `${el}`] = ele.dataList[Pindex][Pindex1]
            })
          })
          return { ...ele, ...o, rowKey: index }
        })
        setTabelData(list)
      } else if (queryParams.dateType === 'MONTH') {
        const { header = [], datasets = [] } = data
        const [{ label, headerSub = [] }] = header
        headers = [
          common,
          ...headerSub.map((title: any) => ({
            title: title,
            dataIndex: title,
            key: title,
            width: 100,
            ellipsis: true,
          })),
        ]
        const list = datasets.map((ele: any, index: any) => {
          const o: any = {}
          headerSub.forEach((el: any, Pindex: any) => {
            o[el] = ele.dataList[0][Pindex]
          })
          return { ...ele, ...o, rowKey: index }
        })
        setTabelData(list)
      } else if (queryParams.dateType === 'QUARTER') {
        const { header = [], datasets = [] } = data
        headers = [
          common,
          ...header
            .map(({ headerSub, label }: IResReportHead, index: number) => ({
              title: label,
              key: label,
              children: [
                ...headerSub.map((title: any) => ({
                  title: title,
                  dataIndex: title === '合计' ? `${label}${title}` : title,
                  key: title === '合计' ? `${label}${title}` : title,
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
        ]
        const list = datasets.map((ele: any, index: number) => {
          const o: any = {}
          header.forEach(({ headerSub, label }: IResReportHead, Pindex: number) => {
            headerSub.forEach((el: any, Pindex1: number) => {
              o[el === '合计' ? `${label}${el}` : `${el}`] = ele.dataList[Pindex][Pindex1]
            })
          })
          return { ...ele, ...o, rowKey: index }
        })
        setTabelData(list)
      } else if (queryParams.dateType === 'YEAR') {
        const { header = [], datasets = [] } = data
        headers = [
          common,
          ...header.map(({ headerSub, label }: IResReportHead, index: number) => ({
            title: label,
            key: label,
            children: [
              ...headerSub.map((title) => ({
                title: title,
                dataIndex: title === '合计' ? `${label}${title}` : title,
                key: title === '合计' ? `${label}${title}` : title,
                width: 100,
                ellipsis: true,
              })),
            ],
          })),
        ]
        const list = datasets.map((ele: any, index: number) => {
          const o: any = {}
          header.forEach(({ headerSub, label }: IResReportHead, Pindex: number) => {
            headerSub.forEach((el: any, Pindex1: number) => {
              o[el === '合计' ? `${label}${el}` : `${el}`] = ele.dataList[Pindex][Pindex1]
            })
          })
          return { ...ele, ...o, rowKey: index }
        })
        setTabelData(list)
      }
      setColumns(headers)
      let width = 2600
      if (queryParams.dateType === 'DAY' || queryParams.dateType === 'MONTH') {
        width = headers.length * 100
      } else {
        width =
          flattenDeep(
            headers.map((ele: any) => {
              if (ele.children) {
                return ele.children
              } else {
                return [ele]
              }
            })
          ).length * 100
      }
      setCtxParams({ width })
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
      // setKeyParams({
      //   showKey: '1',
      //   unitIds: trimStart(treeIteratedData[index].fullLinkKey || '', ',')?.split(','),
      // })
      // setDefaultExpandId1(treeIteratedData[index].fullLinkKey || '')
      // } else {
      //   setCheckedKeys1([])
      // }
      setTreeData(data)
    } catch (error) {
      message.error(error)
    }
  }, [])
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
  const exportTable = async (event: any) => {
    setExportLoading(true)
    let str = `?date=${queryParams.date}&dateType=${queryParams.dateType}`
    if (keyParams.unitIds?.length) {
      str = `${str}&unitIds=${keyParams.unitIds.join(',')}`
    }
    await handleDownFile(
      event,
      `/energy-config/reportEnergy/${keyParams.showKey === '1' ? 'circuit' : 'device'}/export${str}`
    )
    setExportLoading(false)
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
          // showLine={{ showLeafIcon: false }}
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
            电能统计
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
            报
          </Col>
          <Col>
            <Space>
              单位：kWh
              <Button onClick={(event) => exportTable(event)} loading={exportLoading}>
                <UploadOutlined />
                导出
              </Button>
              {/* setVisiblePrint */}
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
          <Col style={{ width: '100%' }} ref={componentRef}>
            <Table
              loading={loading}
              dataSource={tableData}
              size="small"
              bordered
              scroll={{ x: 100, y: 'calc(100vh - 300px)' }}
              columns={columns}
              pagination={false}
              rowKey="rowKey"
            />
          </Col>
        </Row>
      </Col>
      <Modal
        title="提示"
        width="40%"
        visible={visiblePrint}
        onOk={() => setVisiblePrint(false)}
        onCancel={() => setVisiblePrint(false)}
        okText={
          <ReactToPrint
            ctxParams={ctxParams}
            text="确认打印"
            ctxRef={componentRef}
            title={`电能报表`}
          />
        }
      >
        <p style={{ fontWeight: 600 }}>
          为保障打印效果，系统默认打印纸张尺寸为：A4，其他尺寸清晰度偏低；
        </p>
        <p>{'(设置不符：可在打印预览页面点击 更多设置 --> 纸张尺寸 --> A4)'}</p>
      </Modal>
    </Row>
  )
}

export default ElectricParameterReport
