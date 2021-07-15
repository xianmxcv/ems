import { ITreeData } from '@/types/resType'
import { getTreeIds } from '@/utils/common'
import {
  PlusCircleOutlined,
  DeleteOutlined,
  ApartmentOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons'

import { Col, Input, message, Row, Tree, Tooltip, Modal, Spin, Space, Empty } from 'antd'
import { TreeProps } from 'antd/lib/tree/index'
import { find, findIndex, groupBy, isEmpty, isEqual, keys, omit } from 'lodash-es'
import React, { Key, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'

interface IProps extends TreeProps {
  isSearch?: boolean // 是否可搜索  目前编辑树没搜索这个功能
  isLimit?: boolean // 是否限制第一级不可编辑 true 为不可编辑
  onSearch?: Function
  onEmitValue?: Function // 向父组件传递当前编辑节点  和整个tree的数据源 格式{node, treeData , type:'edit' | 'add' | 'del' ， pid}
}

const EditTree = (props: IProps) => {
  const [treeData, setData] = useState<Array<ITreeData>>([])
  const [searchValue, setSearchValue] = useState('')
  const [editNodeKey, setEditNodeKey] = useState<string>()
  const [expandedKeys, setExpandedKeys] = useState<Key[]>()

  const inputRef = useRef<any>(null)

  useEffect(() => {
    setData(JSON.parse(JSON.stringify(props.treeData)))
  }, [props.treeData])

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }, [editNodeKey])

  const setTreeData = (tree: any) => {
    return new Promise((resolve) => {
      const { onEmitValue = Function } = props
      onEmitValue(tree).then((res: any) => {
        resolve(res.data)
      })
    })
  }
  const getParentKey = (key: any, tree: ITreeData[]): any => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some((item: ITreeData) => item.key === key)) {
          parentKey = node.key
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children)
        }
      }
    }
    return parentKey
  }
  const handleClick = (e: any, data: ITreeData) => {}
  const handleMouseOver = (e: any) => {
    const childrens = e.currentTarget.children
    if (childrens) {
      childrens[1].style.visibility = 'visible'

      const clientWidth = e.currentTarget.clientWidth
      if (clientWidth < 150) {
        // childrens[0].classList.add(styles.hide)
      }
    }
  }

  const handleMouseLeave = (e: any) => {
    const childrens = e.currentTarget.children
    if (childrens) {
      childrens[1].style.visibility = 'hidden'
      childrens[0].classList.remove(styles.hide)
    }
  }

  const updateTreeNodeEditState = (nodes: ITreeData[], key: string) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].key === key) {
        nodes[i].editCell = true

        return false
      }
      const children = nodes[i].children
      if (children) {
        updateTreeNodeEditState(children, key)
      }
    }
  }

  const updateTreeNodeValue = (nodes: ITreeData[], key: string, value: string) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].key === key) {
        nodes[i].title = value
        setEditNodeKey(undefined)
        return false
      }
      const children = nodes[i].children
      if (children) {
        updateTreeNodeValue(children, key, value)
      }
    }
  }
  const updateTreeNodeKey = (nodes: ITreeData[], key: string, value: string) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].key === 'addNode') {
        nodes[i].key = key
        setEditNodeKey(undefined)
        return nodes
      }
      const children = nodes[i].children
      if (children) {
        nodes[i].children = updateTreeNodeKey(children, key, value)
      }
    }
    return nodes
  }

  const handleClickEdit = (key: string, e: any) => {
    if (editNodeKey) {
      message.error('请完成上一次新增或编辑操作')
      inputRef.current?.focus()
      return
    }
    setEditNodeKey(key)
    e.stopPropagation()
    e.preventDefault()
  }

  const handleNodeChange = (e: any, node: ITreeData, data: ITreeData[]) => {
    // console.log(
    //   e,
    //   '(e) => handleNodeChange(e, item, data)}',
    //   e.currentTarget.parentNode.parentNode,
    //   e.currentTarget?.parentNode?.parentNode?.parentNode?.parentNode?.firstChild?.value
    // )
    const value = e.currentTarget?.parentNode?.parentNode?.firstChild?.value.replace(/,/g, '，')
    if (!value) {
      message.warn('节点名称不能为空')
      // const { key } = node
      inputRef.current?.focus()
      // if (key === 'addNode') {
      //   data.pop()
      // }
      // setEditNodeKey(undefined)
      return
    }
    if (value === node.title) {
      if (node.key === 'addNode') {
        // data.pop()
        // setEditNodeKey(undefined)
        inputRef.current?.focus()
      } else {
        setEditNodeKey(undefined)
      }
      return
    }

    const dataCopy = {
      // treeData: copyTreeData,
      node: { ...node, title: value },
      type: node.key === 'addNode' ? 'add' : 'edit',
      pid: node.pid,
    }
    setTreeData(dataCopy).then((data: any) => {
      if (node.key === 'addNode') {
        if (data) {
          const { key } = data
          node.title = value
          const copyTreeData = JSON.parse(JSON.stringify(treeData))
          const nodes = updateTreeNodeKey(copyTreeData, key, value)
          setData(nodes)
          setEditNodeKey(undefined)
        } else {
          inputRef.current?.focus()
        }
      } else {
        if (data) {
          node.title = value
          const copyTreeData = JSON.parse(JSON.stringify(treeData))
          const nodes = updateTreeNodeKey(copyTreeData, node.key, value)
          setData(nodes)
          setEditNodeKey(undefined)
        } else {
          inputRef.current?.focus()
        }
      }
    })
    e.stopPropagation()
    e.preventDefault()
  }
  const handleNodeClose = (e: any, node: ITreeData, data: ITreeData[]) => {
    const { key } = node
    if (key === 'addNode') {
      data.pop()
    }
    setEditNodeKey(undefined)
    e.stopPropagation()
    e.preventDefault()
  }
  const handleClickInput = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    return false
  }

  const addChildNode = (key: string, item: ITreeData, e: any) => {
    if (editNodeKey) {
      message.error('请完成上一次新增或编辑操作')
      inputRef.current?.focus()
      return
    }
    setExpandedKeys(Array.from(new Set([...(expandedKeys || []), key])))
    const { children = [] } = item
    const o = { key: 'addNode', title: '', pid: key, children: [] }
    children.push(o)
    const copyTreeData = JSON.parse(JSON.stringify(treeData))
    setData(copyTreeData)
    setTimeout(() => {
      setEditNodeKey('addNode')
    }, 300)
    e.stopPropagation()
    e.preventDefault()
  }

  const addNode = (key: string, data: ITreeData[], e: any) => {
    if (editNodeKey) {
      message.error('请完成上一次新增或编辑操作')
      inputRef.current?.focus()
      return
    }
    const o = { key: 'addNode', title: '', pid: key, children: [] }
    data.push(o)
    setEditNodeKey('addNode')
    const copyTreeData = JSON.parse(JSON.stringify(treeData))
    setData(copyTreeData)
    e.stopPropagation()
    e.preventDefault()
  }

  const deleteNode = (key: string, data: ITreeData[], e: any) => {
    Modal.confirm({
      title: '是否确定删除数据？',
      icon: <ExclamationCircleOutlined />,
      content: '是否确定删除数据？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const index = findIndex(data, { key })
        const [o] = data.splice(index, 1)
        const copyTreeData = JSON.parse(JSON.stringify(treeData))
        const dataCopy = { treeData: copyTreeData, node: o, type: 'del' }
        setTreeData(dataCopy).then((el: any) => {
          setData(copyTreeData)
        })
      },
      onCancel() {},
    })
    e.stopPropagation()
    e.preventDefault()
  }
  const onExpand = (expandedKeys: any, info: any) => {
    const { node, expanded } = info
    const ids: string[] = []
    const keys = []
    if (!expanded) {
      ids.push(...getTreeIds(node?.children))
      expandedKeys.map((item: string) => {
        const index = find(ids, (ele) => ele === item)
        if (!index) {
          keys.push(item)
        }
      })
    } else {
      keys.push(...expandedKeys)
    }

    // console.log(keys, 'keyskeyskeys')
    // console.log(ids, 'idsidsids')
    // console.log(expanded, 'expanded')
    // console.log(node)
    // console.log(info, 'info')
    // console.log(expandedKeys, 'expandedKeys')
    setExpandedKeys(keys)
  }

  const loop = (data: ITreeData[]): any =>
    data.map((item: ITreeData) => {
      const index = item.title.indexOf(searchValue)
      const beforeStr = item.title.substr(0, index)
      const afterStr = item.title.substr(index + searchValue.length)

      const title =
        item.key === editNodeKey && (props.isLimit || item.pid !== '-1') ? (
          <Row style={{ width: '100%', display: 'flex' }}>
            <Input
              onClick={(e) => handleClickInput(e)}
              defaultValue={item.title}
              onKeyUp={(e: any) => {
                e.target.value = e.target.value.replace(/,/g, '，')
                return e.target.value
              }}
              size="small"
              ref={inputRef}
              // allowClear
              // onBlur={(e) => inputRef?.current.focus()}
              // onBlur={(e) => handleNodeChange(e, item, data)}
              // onPressEnter={(e) => handleNodeChange(e, item, data)}
              style={{ flex: 1 }}
            />
            <Row
              onClick={(e) => handleClickInput(e)}
              style={{
                width: '60px',
                height: 28,
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <CloseOutlined
                onClick={(e) => handleNodeClose(e, item, data)}
                style={{ width: 30, lineHeight: '28px' }}
              />
              <CheckOutlined
                style={{ color: '#00acc1', width: 30, lineHeight: '28px' }}
                onClick={(e) => handleNodeChange(e, item, data)}
              />
            </Row>
          </Row>
        ) : (
          <Row
            onClick={(e) => handleClick(e, item)}
            onMouseOver={(e) => handleMouseOver(e)}
            onMouseLeave={(e) => handleMouseLeave(e)}
            wrap={false}
            style={{ width: '100%' }}
          >
            <Col className={styles.ellipsis} title={item.title}>
              {index > -1 ? (
                <span>
                  {beforeStr}
                  <span className={styles['site-tree-search-value']}>{searchValue}</span>
                  {afterStr}
                </span>
              ) : (
                <>
                  <span>{item.title}</span>
                </>
              )}
            </Col>
            <Col
              className={styles.actions}
              style={{ width: 110, visibility: 'hidden' }}
              onClick={(e) => handleClickInput(e)}
            >
              <ApartmentOutlined
                onClick={(e) => addChildNode(item.key, item, e)}
                title="添加子节点"
                style={{ margin: '0 10px 0  0' }}
              />
              {props.isLimit || item.pid !== '-1' ? (
                <>
                  <PlusCircleOutlined
                    onClick={(e) => addNode(item.pid, data, e)}
                    title="添加同级节点"
                    style={{ margin: '0 10px 0  0' }}
                  />
                  {treeData.length > 1 || item.pid !== '-1' ? (
                    <DeleteOutlined
                      onClick={(e) => deleteNode(item.key, data, e)}
                      title="删除节点"
                      style={{ margin: '0 10px 0  0' }}
                    />
                  ) : null}
                  <EditOutlined onClick={(e) => handleClickEdit(item.key, e)} title="编辑节点" />
                </>
              ) : null}
            </Col>
          </Row>
        )

      if (item.children) {
        return {
          title,
          key: item.key,
          disabled: item.key === 'addNode',
          children: loop(item.children),
        }
      }

      return {
        title,
        disabled: item.key === 'addNode',
        key: item.key,
      }
    })

  return (
    <>
      {treeData.length ? (
        <Tree
          {...omit(props, ['treeData'])}
          treeData={loop(treeData)}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
        />
      ) : (
        <Row align="middle" justify="center">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Row>
      )}
    </>
  )
}

export default EditTree
