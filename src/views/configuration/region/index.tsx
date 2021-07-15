import EditTree from '@/component/editTree'
import api from '@/service/api'
import { ITreeData } from '@/types/resType'
import { ExclamationCircleOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Input, message, Row, Spin, Tabs, Tooltip } from 'antd'
import { isObject } from 'lodash-es'
import React, { Key, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import BranchInfo from './tableComponents/branchInfo'
import KeyEnergyConsumingDeviceInfo from './tableComponents/keyEnergyConsumingDeviceInfo'
const { TabPane } = Tabs
const Region = () => {
  const [treeData, setTreeData] = useState<Array<ITreeData>>([])
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [regionIds, setRegionIds] = useState<string[]>([])
  const [isLoadingTree, setLoadingTree] = useState(true)
  const inputRef = useRef<any>(null)

  const getList = async () => {
    setLoadingTree(false)
    try {
      const { data = [] } = await api.getRegionList()
      setTreeData(data)
    } catch (error) {
      message.error(error)
    } finally {
      setLoadingTree(true)
    }
  }

  useEffect(() => {
    getList()
  }, [])

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
        const { key: regionId, title: regionName, pid: regionParent } = node
        res = await api.putRegion({ regionId, regionName, regionParent })
      } else if (type === 'add') {
        const { title: regionName } = node
        res = await api.postRegion({ regionParent: pid, regionName })
      } else if (type === 'del') {
        const { key: ecId } = node
        res = await api.delRegion(ecId as string)
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
    <Row className={styles.region}>
      <Col className={styles.tree}>
        <Row
          align="middle"
          justify="space-between"
          style={{ padding: 16, backgroundColor: 'rgba(249, 249, 249, 1)', marginBottom: 12 }}
        >
          <Col>区域结构管理</Col>
          <Col style={{ cursor: 'pointer', color: '#CCCCCC' }}>
            <Tooltip
              placement="bottom"
              title="此处为自定义区域编辑，后续统计完全与结构匹配，请根据实际部署谨慎填写！样例：南京分公司>厂区A>产线01"
            >
              <ExclamationCircleOutlined style={{ paddingRight: 8 }} />
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
      <Divider type="vertical" className={styles.divider} />
      <Col className={styles.TableComponents} style={{ padding: 12 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="支路信息" key="1">
            <BranchInfo regionIds={checkedKeys} />
          </TabPane>
          <TabPane tab="重点耗能设备信息" key="2">
            <KeyEnergyConsumingDeviceInfo regionIds={checkedKeys} />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}

export default Region
