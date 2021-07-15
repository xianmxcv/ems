import itemImage from '@/assets/images/transformer.svg'
import disabledItemImage from '@/assets/images/transformer_disabled.svg'
import selectedItemImage from '@/assets/images/transformer_selected.svg'
import api from '@/service/api'
import { ITransformer } from '@/types/resType'
import { Divider, Input, message, Row, Tooltip } from 'antd'
import { Image } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './index.module.less'

const TransformerList = ({
  onSelected,
  list,
}: {
  onSelected: (params: ITransformer) => void
  list: ITransformer[]
}) => {
  const [selected, setSelected] = useState<ITransformer>()

  useEffect(() => {
    const findData = list.find((item) => item.emId)
    setSelected(findData)
  }, [list])

  const handleSelected = (item: ITransformer) => {
    if (item.emId) {
      setSelected(item)
      onSelected(item)
    }
  }

  return (
    <div className={styles.list}>
      <div className={styles.listContent}>
        {list.map((item) => (
          <Tooltip title={item.emId ? '' : `${item.tfName} 无关联电表`} key={item.tfId}>
            <Row
              className={`${styles.item} ${
                item.tfId === selected?.tfId ? styles.selected : undefined
              } ${item.emId ? undefined : styles.disabled} `}
              onClick={() => handleSelected(item)}
            >
              <Image
                width={100}
                height={100}
                preview={false}
                src={
                  item.emId
                    ? item.tfId === selected?.tfId
                      ? selectedItemImage
                      : itemImage
                    : disabledItemImage
                }
              />
              <div className={styles.name}>{item.tfName}</div>
            </Row>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export default TransformerList
