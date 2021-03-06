import api from '@/service/api'
import { ITransformerTypeName } from '@/types/common'
import { ITransformer, ITreeData } from '@/types/resType'
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Space,
  Col,
  Divider,
  TreeSelect,
  message,
  Spin,
  DatePicker,
} from 'antd'
import React, { useEffect, useState } from 'react'
const { TextArea } = Input
const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
}
const tailLayout = {
  wrapperCol: { span: 24 },
}
interface IProps {
  tfInfo?: ITransformer
  onCancel: () => void
  onOk: () => void
}
const AddTransformer = (props: IProps) => {
  const [form] = Form.useForm()
  const { validateFields, setFieldsValue } = form
  const [pageLoading, setPageLoading] = useState(false)
  const [transformerType] = useState(Object.entries(ITransformerTypeName))
  const [branchTreeData, setBranchTreeData] = useState<ITreeData[]>([])
  const [ecId, setEcId] = useState<string>('')
  const [timeVisible, setTimeVisible] = useState<boolean>(false)
  useEffect(() => {
    const getBranchTreeData = async () => {
      const { data = [] } = await api.getBranchList()
      setBranchTreeData(data)
    }
    getBranchTreeData()
    if (props.tfInfo) {
      setFieldsValue({
        ...props.tfInfo,
        ecId: props.tfInfo.etrList
          ? props.tfInfo.etrList.length > 0
            ? props.tfInfo.etrList[0].ecId
            : undefined
          : '',
      })
      setEcId(
        props.tfInfo.etrList.length > 0 && props.tfInfo.etrList ? props.tfInfo.etrList[0].ecId : ''
      )
    }
  }, [props.tfInfo, setFieldsValue])

  const changeTreeSelect = (value: any, label: any, extra: any) => {
    if (value === undefined) {
      value = ''
    }
    if (value !== ecId) {
      setTimeVisible(true)
    } else {
      setTimeVisible(false)
    }
  }
  const onFinish = (values: any) => {
    validateFields().then(() => {
      const save = async () => {
        try {
          let res
          setPageLoading(true)
          if (props.tfInfo) {
            res = await api.editTransformer({
              ...(values as ITransformer),
              tfDesc: values.tfDesc ? values.tfDesc.replace(/\n/g, '').substring(0, 199) : '',
              tfId: props.tfInfo.tfId,
              ecId: values.ecId || '',
            })
          } else {
            res = await api.addTransformer({
              ...(values as ITransformer),
              tfDesc: values.tfDesc ? values.tfDesc.replace(/\n/g, '').substring(0, 199) : '',
              ecId: values.ecId || '',
            })
          }
          if (res) {
            props.onOk()
            message.success('????????????')
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
              name="tfName"
              label="???????????????"
              rules={[{ required: true, message: '????????????????????????' }]}
            >
              <Input maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="tfType"
              label="???????????????"
              rules={[{ required: true, message: '????????????????????????' }]}
            >
              <Select>
                {transformerType.map((item, index) => (
                  <Select.Option key={item[0]} value={item[0]}>
                    {item[1]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="tfCapacity"
              label="???????????????"
              rules={[
                { required: true, message: '????????????????????????' },
                {
                  pattern: /^[1-9]\d*$/,
                  message: '??????????????????',
                },
              ]}
            >
              <Input suffix="KVA" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="tfOnceVolts"
              label="???????????????"
              rules={[
                { required: true, message: '????????????????????????' },
                {
                  pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/,
                  message: '???????????????,????????????2?????????',
                },
              ]}
            >
              <Input suffix="KV" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="tfSecondVolts"
              label="???????????????"
              rules={[
                { required: true, message: '????????????????????????' },
                {
                  pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/,
                  message: '???????????????,????????????2?????????',
                },
              ]}
            >
              <Input suffix="KV" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="tfLowvolElectric"
              label="?????????????????????"
              rules={[
                { required: true, message: '??????????????????????????????' },
                {
                  pattern: /^[1-9]\d*$/,
                  message: '??????????????????',
                },
              ]}
            >
              <Input suffix="A" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="ecId" label="??????????????????">
              <TreeSelect
                allowClear
                onChange={changeTreeSelect}
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={branchTreeData}
                placeholder="???????????????????????????"
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col>
          {timeVisible && (
            <Col span={24}>
              <Form.Item
                name="ecBeginTime"
                label="????????????"
                rules={[{ required: true, message: '?????????????????????' }]}
              >
                <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              name="tfPowerUnit"
              label="????????????"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Input maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="??????" name="tfDesc">
              <TextArea showCount maxLength={200} />
            </Form.Item>
          </Col>
          <Divider style={{ margin: '8px 0px' }} />
          <Col span={24} style={{ textAlign: 'right' }}>
            <Form.Item {...tailLayout}>
              <Space>
                <Button htmlType="button" onClick={onReset} style={{ width: 100 }}>
                  ??????
                </Button>
                <Button type="primary" htmlType="submit" style={{ width: 100 }}>
                  ??????
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </Spin>
  )
}

export default AddTransformer
