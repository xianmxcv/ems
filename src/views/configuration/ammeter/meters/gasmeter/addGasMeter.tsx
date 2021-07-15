import api from '@/service/api'
import { IelectricMeterTypeName, IGasMeterTypeName, IMeterType } from '@/types/common'
import { IEcn, IElectricMeter } from '@/types/resType'
import { Form, Input, Button, Select, Row, Space, Col, Divider, message, Spin } from 'antd'
import React, { useEffect, useState } from 'react'

interface IProps {
  emInfo?: IElectricMeter
  onCancel: () => void
  onOk: () => void
}
const { TextArea } = Input
const { Option } = Select
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
const tailLayout = {
  wrapperCol: { span: 24 },
}
const AddGasMeter = (props: IProps) => {
  const [form] = Form.useForm()
  const { validateFields, setFieldsValue } = form
  const [pageLoading, setPageLoading] = useState(false)
  const [emType] = useState(Object.entries(IGasMeterTypeName))
  const [thingList, setThingList] = useState<IEcn[]>([])
  const [ecnNameStr, setEcnNameStr] = useState<string>('')

  useEffect(() => {
    const getEmNameList = async () => {
      const { data = [] } = await api.getEmNameList()
      setThingList(data)
    }
    getEmNameList()
    if (props.emInfo) {
      setFieldsValue({
        ...props.emInfo,
        emName: props.emInfo.thingId ? [props.emInfo.thingId] : [props.emInfo.emName],
      })
      setEcnNameStr(props.emInfo.ecnNameStr)
    }
  }, [setFieldsValue, props.emInfo])
  function handleChange(value: any) {
    if (value.length > 0) {
      let flag = false
      thingList.map((item) => {
        if (value[value.length - 1] === item.thingId) {
          flag = true
          setEcnNameStr(item.ecnName)
        }
      })
      if (!flag) {
        setEcnNameStr('')
      }
      setFieldsValue({ emName: [value[value.length - 1]] })
    } else {
      setFieldsValue({ emName: [] })
      setEcnNameStr('')
    }
  }
  const onFinish = (values: any) => {
    validateFields().then(() => {
      const save = async () => {
        try {
          let emName: string = ''
          let thingId: string = ''
          emName = values.emName[0]
          let flag: boolean = false
          thingList.map((item) => {
            if (item.thingId === emName) {
              flag = true
              thingId = item.thingId
              emName = item.emName
            }
          })
          if (!flag) {
            emName = values.emName.join(',')
            thingId = ''
          }
          let res
          setPageLoading(true)
          if (props.emInfo) {
            res = await api.editElectricMeter({
              ...(values as IElectricMeter),
              emId: props.emInfo.emId,
              emName,
              thingId,
              emDesc: values.emDesc ? values.emDesc.replace(/\n/g, '').substring(0, 199) : '',
              ecnNameStr,
              emMeterType: IMeterType.GASMETER,
            })
          } else {
            res = await api.addElectricMeter({
              ...(values as IElectricMeter),
              emName,
              thingId,
              emDesc: values.emDesc ? values.emDesc.replace(/\n/g, '').substring(0, 199) : '',
              ecnNameStr,
              emMeterType: IMeterType.GASMETER,
            })
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
            <Form.Item name="emName" label="燃气表名称" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="请输入关键字搜索"
                mode="tags"
                onChange={handleChange}
                maxTagCount={1}
                filterOption={(input: string, option: any) =>
                  (option.children || '').indexOf(input) >= 0
                }
              >
                {thingList.map((thing) => (
                  <Option key={thing.thingId} value={thing.thingId}>
                    {thing.emName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="emCode" label="编码" rules={[{ required: true }]}>
              <Input maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="emType" label="类型" rules={[{ required: true }]}>
              <Select>
                {emType.map((item, index) => (
                  <Select.Option key={item[0]} value={item[0]}>
                    {item[1]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="emModel" label="型号" rules={[{ required: true }]}>
              <Input maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="emManufacturer" label="生产厂家">
              <Input maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="备注" name="emDesc">
              <TextArea showCount maxLength={200} />
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

export default AddGasMeter
