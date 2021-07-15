import api from '@/service/api'
import { IReqRegionAndCircuit } from '@/types/reqType'
import { IregionCircuitConditions, ITreeData } from '@/types/resType'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Form, Button, Row, Space, Col, Divider, TreeSelect, Spin, message } from 'antd'
import React, { useEffect, useState } from 'react'
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
const tailLayout = {
  wrapperCol: { span: 24 },
}
interface IProps {
  regionCircuitConditions?: IregionCircuitConditions
  onCancel: () => void
  onOk: () => void
}
const AddBranchInfo = (props: IProps) => {
  const [form] = Form.useForm()
  const { validateFields, setFieldsValue } = form
  const [pageLoading, setPageLoading] = useState(false)
  const [regionTreeData, setRegionTreeData] = useState<ITreeData[]>([])
  const [branchTreeData, setBranchTreeData] = useState<ITreeData[]>([])
  const onFinish = (values: any) => {
    validateFields().then(() => {
      const save = async () => {
        try {
          let res
          setPageLoading(true)
          if (props.regionCircuitConditions?.erId) {
            let erId = props.regionCircuitConditions?.erId
            res = await api.putRegionCircuit({ ...(values as IReqRegionAndCircuit), erId })
          } else {
            res = await api.addRegionCircuit({ ...(values as IReqRegionAndCircuit) })
          }
          if (res) {
            props.onOk()
            message.success('保存成功')
          }
        } catch (err) {
          message.error(err)
        } finally {
          setPageLoading(false)
        }
      }
      save()
    })
  }
  useEffect(() => {
    const getRegionTreeData = async () => {
      const { data = [] } = await api.getRegionList()
      setRegionTreeData(data)
    }
    const getBranchTreeData = async () => {
      const { data = [] } = await api.getBranchList()
      setBranchTreeData(data)
    }
    getRegionTreeData()
    getBranchTreeData()
    if (props.regionCircuitConditions) {
      setFieldsValue({ ...props.regionCircuitConditions })
    }
  }, [props.regionCircuitConditions, setFieldsValue])
  const onReset = () => {
    props.onCancel()
  }
  return (
    <Spin spinning={pageLoading} style={{ padding: '0 20px' }}>
      <Row>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ width: '100%' }}
        >
          <Col span={24}>
            <Form.Item
              name="regionId"
              label="区域名称"
              rules={[{ required: true, message: '请选择区域名称' }]}
            >
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={regionTreeData}
                placeholder="请选择区域名称"
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="ecId"
              label="关联支路名称"
              rules={[{ required: true, message: '请选择关联支路名称' }]}
            >
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={branchTreeData}
                placeholder="请选择关联支路名称"
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col>
          <Divider style={{ margin: '8px 0px' }} />
          <Col span={24} style={{ textAlign: 'right' }}>
            <Form.Item {...tailLayout}>
              <Space>
                <Button htmlType="button" onClick={onReset} style={{ width: 100 }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" style={{ width: 100 }}>
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </Spin>
  )
}

export default AddBranchInfo
