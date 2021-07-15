import { Input, Tree } from 'antd'
import { TreeProps } from 'antd/lib/tree/index'
import { omit } from 'lodash-es'

import React, { useState, useCallback, useEffect } from 'react'

interface IProps extends TreeProps {
  isSearch?: boolean
  onSearch?: Function
}

const customTree = (props: IProps) => {
  const getParentKey = (value: React.Key, tree: any): any => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some((item: any) => (item.title || '').indexOf(value) > -1)) {
          parentKey = node.key
        } else if (getParentKey(value, node.children)) {
          parentKey = getParentKey(value, node.children)
        }
      }
    }
    return parentKey
  }
  const onChange = (e: any) => {
    const { treeData = [], onSearch = Function } = props
    const { value } = e.target
    const expandedKeys = treeData
      .map((item: any) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(value, treeData)
        } else if (item.children) {
          return getParentKey(value, treeData)
        }
        return null
      })
      .filter((item, i, self) => item && self.indexOf(item) === i)
    onSearch(expandedKeys)
  }
  return (
    <>
      {props.isSearch ? (
        <Input.Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
      ) : null}
      <Tree {...omit(props, ['isSearch'])} />
    </>
  )
}

export default customTree
