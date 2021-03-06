import api from '@/service/api'
import { IReportConfig } from '@/types/resType'
import { Button, Col, Form, Row, DatePicker, Space, Spin, Divider, Switch, message } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}
interface IProps {
  configInfo?: IReportConfig
  onCancel: () => void
  onOk: () => void
}
const { RangePicker } = DatePicker
const AddConfig = (props: IProps) => {
  const [form] = Form.useForm()
  const { validateFields, setFieldsValue } = form
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  useEffect(() => {
    if (props.configInfo) {
      setFieldsValue({
        ...props.configInfo,
        manulTime: [moment(props.configInfo.manulBegintime), moment(props.configInfo.manulEndtime)],
      })
    }
  }, [props.configInfo, setFieldsValue])
  const onFinish = (values: any) => {
    validateFields().then(() => {
      const save = async () => {
        try {
          let res
          setPageLoading(true)
          if (props.configInfo) {
            res = await api.editReportConfig({
              ...(values as IReportConfig),
              manulDesc: values.manulDesc
                ? values.manulDesc.replace(/\n/g, '').substring(0, 199)
                : '',
              manulId: props.configInfo.manulId,
              manulBegintime: moment(values.manulTime[0]),
              manulEndtime: moment(values.manulTime[1]),
            })
          } else {
            res = await api.addReportConfig({
              ...(values as IReportConfig),
              manulDesc: values.manulDesc
                ? values.manulDesc.replace(/\n/g, '').substring(0, 199)
                : '',
              manulBegintime: moment(values.manulTime[0]),
              manulEndtime: moment(values.manulTime[1]),
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
              label="?????????????????????"
              name="manulTime"
              rules={[{ required: true, message: '????????????????????????' }]}
            >
              <RangePicker showTime format={'YYYY-MM-DD HH:mm:ss'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="????????????????????????"
              name="manulState"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="??????" name="manulDesc">
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

export default AddConfig
