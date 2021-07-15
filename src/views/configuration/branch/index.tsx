import EditTree from '@/component/editTree'
import api from '@/service/api'
import { ITreeData } from '@/types/resType'
import { ExclamationCircleOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Col, Divider, message, Row, Tooltip, Button, Spin, Input } from 'antd'
import { isObject } from 'lodash-es'
import React, { Key, useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import TableComponents from './tableComponents'

const Branch = () => {
  const [treeData, setTreeData] = useState<Array<ITreeData>>([])
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [isLoadingTree, setLoadingTree] = useState(true)
  const inputRef = useRef<any>(null)

  const getList = useCallback(async () => {
    setLoadingTree(false)
    try {
      const { data = [] } = await api.getBranchList()
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
        const { key: ecId, title: ecName, pid: ecParent } = node
        res = await api.putBranch({ ecId, ecName, ecParent })
      } else if (type === 'add') {
        const { title: ecName } = node
        res = await api.postBranch({
          ecParent: pid,
          ecName,
        })
      } else if (type === 'del') {
        const { key: ecId } = node
        res = await api.delBranch({ ecId })
      }
      message.success(isObject(res.data) ? '新增成功' : res.data)
    } catch (err) {
      res = err
      message.error(err)
    }
    return res
  }

  return (
    <Row className={styles.container}>
      <Col className={styles.tree}>
        <Row
          align="middle"
          justify="space-between"
          style={{ padding: 16, backgroundColor: 'rgba(249, 249, 249, 1)', marginBottom: 12 }}
        >
          <Col>支路结构管理</Col>
          <Col style={{ cursor: 'pointer', color: '#CCCCCC' }}>
            <Tooltip
              placement="bottomRight"
              title="此处为自定义支路编辑，后续统计完全与结构匹配，请根据实际部署谨慎填写！样例：进线>支路01>支路02"
            >
              <ExclamationCircleOutlined style={{ paddingRight: 12 }} />
              说明
            </Tooltip>
          </Col>
        </Row>
        {treeData.length > 0 ? (
          <EditTree
            checkable
            checkedKeys={checkedKeys}
            onExpand={onExpand}
            selectable={false}
            onCheck={onCheck}
            // showLine={{ showLeafIcon: false }}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            onEmitValue={onEmitValue}
            blockNode
            isLimit={true}
          />
        ) : (
          <Row align="middle" justify="center">
            {isLoadingTree ? (
              // <Button
              //   style={{ cursor: 'pointer' }}
              //   type="text"
              //   onClick={() => onEmitValue({ node: { title: '请修改' }, pid: '-1', type: 'add' })}
              // >
              //   <PlusCircleOutlined />
              //   新增
              // </Button>

              <Row style={{ width: '100%', display: 'flex' }}>
                <Input
                  onKeyUp={(e: any) => {
                    e.target.value = e.target.value.replace(',', '，')
                    return e.target.value
                  }}
                  size="small"
                  ref={inputRef}
                  style={{ flex: 1 }}
                />
                <Row
                  style={{
                    width: '60px',
                    height: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <CloseOutlined style={{ width: 30, lineHeight: '28px' }} />
                  <CheckOutlined
                    style={{ color: '#00acc1', width: 30, lineHeight: '28px' }}
                    onClick={() => {
                      onEmitValue({
                        node: { title: inputRef?.current?.state?.value },
                        pid: '-1',
                        type: 'add',
                      })
                        .then((res) => {
                          setTreeData([...treeData, res.data])
                        })
                        .catch((err) => {
                          message.error(err)
                        })
                    }}
                  />
                </Row>
              </Row>
            ) : (
              <Spin />
            )}
          </Row>
        )}
      </Col>
      <Divider type="vertical" className={styles.divider} style={{ margin: 0 }} />
      <Col className={`${styles.TableComponents} ${styles.cumson_table}`}>
        <TableComponents checkedKeys={checkedKeys} />
      </Col>
    </Row>
  )
}

export default Branch
