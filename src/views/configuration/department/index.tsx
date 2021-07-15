import EditTree from '@/component/editTree'
import api from '@/service/api'
import { ITreeData } from '@/types/resType'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Col, Divider, Row, Tooltip, message, Spin } from 'antd'
import { isObject } from 'lodash-es'
import React, { Key, useCallback, useEffect, useState } from 'react'
import styles from './index.module.less'
import TableComponents from './tableComponents'

const Department = () => {
  const [treeData, setTreeData] = useState<Array<ITreeData>>([])
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [isLoadingTree, setLoadingTree] = useState(true)
  const getList = useCallback(async () => {
    setLoadingTree(false)
    try {
      const { data = [] } = await api.getDepartmentList()
      setTreeData(data)
    } catch (error) {
      message.error(error)
    } finally {
      setLoadingTree(true)
    }
  }, [])
  useEffect(() => {
    getList()
  }, [getList])
  const onExpand = (expandedKeys: Key[]) => {
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }
  const onCheck = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys)
  }
  const onEmitValue = async (data: any) => {
    const { node, type, pid } = data
    let res: any = { data: '' }
    try {
      if (type === 'edit') {
        const { key: depId, title: depName, pid: depParent } = node
        res = await api.putDepartment({ depId, depName, depParent })
      } else if (type === 'add') {
        const { title: depName } = node
        res = await api.postDepartment({ depParent: pid, depName })
      } else if (type === 'del') {
        const { key: depId } = node
        res = await api.delDepartment(depId)
      }
      message.success(isObject(res.data) ? '新增成功' : res.data)
      // await getList()
    } catch (err) {
      res = err
      message.error(err)
    }
    return res
  }

  return (
    <Row className={`${styles.container} ${styles.cumson_table}`}>
      <Col className={styles.tree}>
        <Row
          align="middle"
          justify="space-between"
          style={{ padding: 16, backgroundColor: 'rgba(249, 249, 249, 1)', marginBottom: 12 }}
        >
          <Col>部门结构管理</Col>
          <Col style={{ cursor: 'pointer', color: '#CCCCCC' }}>
            <Tooltip
              placement="bottomRight"
              title="此处为自定义部门编辑，后续统计完全与结构匹配，请根据实际部署谨慎填写！样例：分公司>部门"
            >
              <ExclamationCircleOutlined style={{ paddingRight: 8 }} />
              说明
            </Tooltip>
          </Col>
        </Row>
        {isLoadingTree ? (
          <EditTree
            checkable
            selectable={false}
            // showLine={{ showLeafIcon: false }}
            checkedKeys={checkedKeys}
            onExpand={onExpand}
            onCheck={onCheck}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            onEmitValue={onEmitValue}
            blockNode
          />
        ) : (
          <Row align="middle" justify="center">
            <Spin />
          </Row>
        )}
      </Col>
      <Divider type="vertical" className={styles.divider} style={{ margin: 0 }} />
      <Col className={styles.TableComponents}>
        <TableComponents checkedKeys={checkedKeys} />
      </Col>
    </Row>
  )
}

export default Department
