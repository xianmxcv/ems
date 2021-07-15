import { ITransformer } from '@/types/resType'
import { Card, Col, Row } from 'antd'
import React, { useContext } from 'react'
import { ParmasContext } from '..'
import styles from './index.module.less'

const paramsKeys = [
  {
    head: '负荷',
    params: ['变压器容量', '视在功率', '负荷率'],
  },
  {
    head: '功率',
    params: ['有功功率', '无功功率', '功率因数'],
  },
  {
    head: '电流',
    params: ['A相电流', 'B相电流', 'C相电流'],
  },
  {
    head: '电压',
    params: ['Uab线电压', 'Ubc线电压', 'Uca线电压'],
  },
]

const TransformerParams = ({ selected }: { selected?: ITransformer }) => {
  const params = useContext(ParmasContext)
  return (
    <div className={styles.container}>
      <div>
        变压器名称: <span className={styles.title}>{selected?.tfName}</span>
      </div>
      <Row style={{ width: '100%' }} className={styles.cardList} justify="space-around">
        {paramsKeys.map((item, index) => {
          return (
            <Card key={index} className={styles.card}>
              <Row className={styles.head} justify="center">
                {item.head}
              </Row>
              <div className={styles.cardContent}>
                {item.params.map((param, key) => {
                  return (
                    <Row key={key} align="middle" justify="start">
                      <Col className={styles.circle} />
                      <Col className={styles.label}>{param}：</Col>
                      <div className={styles.value}>
                        <div className={styles.ellipsis}>{params?.[param]}</div>
                      </div>
                    </Row>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </Row>
    </div>
  )
}

export default TransformerParams
