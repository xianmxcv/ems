import { ITreeData } from '@/types/resType'
import { getTreeIds } from '@/utils/common'
import { Col, Empty, Input, Row, Spin, Tree } from 'antd'
import { TreeProps } from 'antd/lib/tree/index'
import { filter, find, isEmpty, omit, trimStart } from 'lodash-es'
import React, { useState, useEffect } from 'react'
import styles from './index.module.less'

interface IProps extends TreeProps {
  isSearch?: boolean
  placeholder?: string
  onSearch?: Function
  defaultExpandId?: React.Key
}

const ShowTree = (props: IProps) => {
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [isPropsExpand, setIsPropsExpand] = useState(true)
  const [treeData, setTreeData] = useState<Array<ITreeData>>([])

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const getParentKey = (value: string, tree: ITreeData[] | undefined, strKeys: string): any => {
    tree?.map((item: ITreeData) => {
      if (item.title.indexOf(value) > -1 || find(props.checkedKeys, (el) => el === item.key)) {
        strKeys += item.fullLinkKey || ''
        item.isShow = true
        if (!isEmpty(item.children)) {
          const { strKeys: str, tree: children } = getParentKey(value, item.children, '')
          item.children = children
          if (str) {
            strKeys += str
            item.isShow = true
          }
        }
      } else if (!isEmpty(item.children)) {
        const { strKeys: str, tree: children } = getParentKey(value, item.children, '')
        item.children = children
        if (str) {
          strKeys += str
          item.isShow = true
        }
      }
    })
    return { strKeys, tree: filter(tree, (ele) => ele.isShow) }
  }
  const onChange = (value: any) => {
    const { treeData: treeData1 = [] } = props
    const treeData = JSON.parse(JSON.stringify(treeData1))
    if (!value) {
      setExpandedKeys([])
      setTreeData(treeData)
      return
    }
    let { strKeys, tree } = getParentKey(value, treeData, '')
    const keys = strKeys ? trimStart(strKeys?.toString(), ',').split(',') : []
    if (isEmpty(keys)) {
      setTreeData([])
    } else {
      setTreeData(tree)
    }
    setExpandedKeys(keys)
  }
  const onExpand = (e: any, info: any) => {
    const { node, expanded } = info
    const ids: string[] = []
    const keys = []
    if (!expanded) {
      ids.push(...getTreeIds(node?.children))
      e.map((item: React.Key) => {
        const index = find(ids, (ele) => ele === item)
        if (!index) {
          keys.push(item)
        }
      })
    } else {
      keys.push(...e)
    }
    setExpandedKeys(keys)
    setAutoExpandParent(false)
    setIsPropsExpand(false)
  }
  const loop = (data: ITreeData[]): any =>
    data.map((item: ITreeData) => {
      const title = (
        <Row wrap={false} style={{ width: '100%' }}>
          <Col
            title={`${item.title}${item.disabled ? '电表未启用' : ''}`}
            style={{
              maxWidth: '220px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{item.title}</span>
          </Col>
        </Row>
      )
      if (item.children) {
        return { title, key: item.key, children: loop(item.children), disabled: item.disabled }
      }
      return {
        title,
        key: item.key,
        disabled: item.disabled,
      }
    })
  useEffect(() => {
    isEmpty(props.treeData) ? null : setTreeData(JSON.parse(JSON.stringify(props.treeData)))
  }, [props.treeData])
  return (
    <>
      {props.isSearch ? (
        <Input.Search
          style={{ marginBottom: 8 }}
          placeholder={props?.placeholder}
          onSearch={onChange}
          allowClear
          className={styles.content_style}
        />
      ) : null}
      {treeData.length ? (
        <Tree
          {...omit(props, ['isSearch', 'treeData'])}
          treeData={loop(treeData)}
          autoExpandParent={autoExpandParent}
          {...(props.isSearch
            ? {
                onExpand,
                expandedKeys: [
                  ...(isPropsExpand
                    ? [...(trimStart(props.defaultExpandId?.toString(), ',').split(',') || [])]
                    : []),
                  ...expandedKeys,
                ],
              }
            : {})}
        />
      ) : (
        <Row align="middle" justify="center">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Row>
      )}
    </>
  )
}

export default ShowTree
