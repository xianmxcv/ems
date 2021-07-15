import TreeComponent from '@/component/showTree'
import { ITreeData } from '@/types/resType'
import { Tabs } from 'antd'
import { TreeProps } from 'antd/lib/tree/index'
import { omit } from 'lodash-es'
import React from 'react'
const { TabPane } = Tabs
interface IProps extends TreeProps {
  isSearch?: boolean
  placeholder?: string
  onSearch?: Function
  onEmitValue?: Function
  dataTree?: ITreeData[]
  dataTree1?: ITreeData[]
  checkedKeys1?: React.Key[]
  checkedKeys2?: React.Key[]
  defaultExpandId1?: React.Key
  defaultExpandId2?: React.Key
}
const TreeTabs = (props: IProps) => {
  const callback = async (key: string) => {
    const { onEmitValue = Function } = props
    onEmitValue({ key })
  }

  return (
    <Tabs type="card" onChange={callback}>
      <TabPane tab="支路名称" key="1" style={{ height: '100%', padding: 12, paddingTop: 0 }}>
        <TreeComponent
          {...omit(props, ['checkedKeys1', 'checkedKeys2', 'defaultExpandId1', 'defaultExpandId2'])}
          placeholder="支路名称"
          checkedKeys={props.checkedKeys1}
          defaultExpandId={props.defaultExpandId1}
          treeData={props.dataTree}
        />
      </TabPane>
      <TabPane tab="重点能耗设备" key="2" style={{ height: '100%', padding: 12, paddingTop: 0 }}>
        <TreeComponent
          {...omit(props, ['checkedKeys1', 'checkedKeys2', 'defaultExpandId1', 'defaultExpandId2'])}
          placeholder="设备名称"
          treeData={props.dataTree1}
          checkedKeys={props.checkedKeys2}
          defaultExpandId={props.defaultExpandId2}
        />
      </TabPane>
    </Tabs>
  )
}

export default TreeTabs
