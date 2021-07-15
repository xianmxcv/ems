import api from '@/service/api'
import { dataUnits } from '@/types/common'
import { ITransformer } from '@/types/resType'
import { Col, Divider, Input, message, Row, Spin } from 'antd'
import React, { createContext, useState, useEffect } from 'react'
import styles from './index.module.less'
import TransformerList from './list'
import TransformerParams from './params'
import TransformerTrend from './trend'

let interval: any
const num = 5

export const ParmasContext = createContext(null)

const TransformerMonitor = () => {
  const [selected, setSelected] = useState<ITransformer>()
  const [inputName, setInputName] = useState<string>()
  const [transformerList, setTransformerList] = useState<Array<ITransformer>>([])
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<any>()

  useEffect(() => {
    const getTransformerList = async () => {
      try {
        setLoading(true)
        const res = await api.getTfList(inputName)
        if (res && res.data) {
          setTransformerList(res.data)
          const findData = res.data.find((item) => item.emId)
          setSelected(findData)
        }
      } catch (err) {
        message.error(err)
      } finally {
        setLoading(false)
      }
    }
    getTransformerList()
  }, [inputName])

  useEffect(() => {
    if (!selected) {
      return
    }
    if (interval) {
      clearInterval(interval)
    }
    const getParamsData = async () => {
      try {
        const res = await api.getTransformerParams(selected.tfId as string)
        if (res) {
          const params: any = {}
          res.data.forEach((item) => {
            if (item.attrValue) {
              if (item.attrName === '变压器容量') {
                params[item.attrName] = `${item.attrValue} KVA`
              } else if (item.attrName === '负荷率') {
                params[item.attrName] = `${item.attrValue} %`
              } else {
                params[item.attrName] = `${item.attrValue} ${dataUnits[item.attrUnit]}`
              }
            } else {
              params[item.attrName] = '-'
            }
          })

          setParams(params)
        }
      } catch (err) {
        message.error(err)
      }
    }
    getParamsData()
    interval = setInterval(() => {
      getParamsData()
    }, num * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [selected])

  const handleInputSearch = (value: string) => {
    setInputName(value?.trim())
  }

  const handleSelected = async (item: ITransformer) => {
    setSelected(item)
  }

  return (
    <ParmasContext.Provider value={params}>
      <Row className={styles.container} wrap={false}>
        <Spin spinning={loading}>
          <Col className={styles.list}>
            <div>变压器列表</div>
            <Divider />
            <Input.Search style={{ width: '100%' }} allowClear onSearch={handleInputSearch} />
            <TransformerList onSelected={handleSelected} list={transformerList} />
          </Col>
        </Spin>
        <Divider className={styles.layout_divider} type="vertical" />
        <Col style={{ width: 'calc(81.5% - 22px)' }}>
          <TransformerParams selected={selected} />
          <Divider className={styles.divider} />
          <TransformerTrend selected={selected} />
        </Col>
      </Row>
    </ParmasContext.Provider>
  )
}

export default TransformerMonitor
