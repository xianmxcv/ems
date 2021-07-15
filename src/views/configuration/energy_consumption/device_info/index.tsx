import api from '@/service/api'
import { ITreeData } from '@/types/resType'
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Space,
  message,
  TreeSelect,
  DatePicker,
  Divider,
} from 'antd'
import { Store } from 'antd/lib/form/interface'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { IFormEnergyDeviceDetail, IFormEnergyDevice, deepHandler } from '../index'
import styles from './index.module.less'

interface IProps {
  title: string
  initialValues: IFormEnergyDeviceDetail
  regionList: ITreeData[]
  itemList: any[]
  addDevice: () => void
  Cancel: () => void
}

const { Option } = Select
const DeviceInfo = (props: IProps) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  }
  const [device] = Form.useForm()
  const { setFieldsValue } = device
  const [branchList, setBranchList] = useState<Array<ITreeData>>([])
  const [departmentList, setDepartmentList] = useState<Array<ITreeData>>([])
  const [timeStatus, setTimeStatus] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const onCancel = () => {
    props.Cancel()
  }
  const { validateFields, getFieldsValue } = device
  const addDevice = () => {
    validateFields().then(async (values: Store) => {
      setLoading(true)
      const { ecId, edDepid, edRegionid, edName, edItem, edrBeginTime } = values
      const query: IFormEnergyDevice = {
        ecId: ecId || '',
        edDepid: edDepid || '',
        edRegionid: edRegionid || '',
        edName,
        edItem,
        edVoltage: Number(values.edVoltage),
        edInputPower: Number(values.edInputPower),
        edInputElectric: Number(values.edInputElectric),
        edMaxPower: Number(values.edMaxPower),
        edMaxElectric: Number(values.edMaxElectric),
        edrBeginTime: edrBeginTime ? moment(edrBeginTime.format('YYYY-MM-DD HH:mm:ss')) : null,
      }
      try {
        let res = null
        if (props.title === '编辑设备信息') {
          res = await api.putEnergyDevice({ ...query, edId: props.initialValues.edId })
        } else {
          res = await api.postEnergyDevice(query)
        }
        props.addDevice()
        message.success(res.data)
      } catch (error) {
        message.error(error)
      } finally {
        setLoading(false)
      }
    })
  }
  const getBranch = async (params: any) => {
    try {
      const { data = [] } = await api.getBranch(params)
      setBranchList(deepHandler(data))
    } catch (error) {
      setBranchList([])
      message.error(error)
    }
  }
  const getDepartment = async (params: any) => {
    try {
      const { data = [] } = await api.getDepartment(params)
      setDepartmentList(deepHandler(data))
    } catch (error) {
      setDepartmentList([])
      message.error(error)
    }
  }

  const onChangeRegion = async (value: any) => {
    setFieldsValue({ edDepid: '', ecId: '' })
    if (props.title === '编辑设备信息') {
      if (!props.initialValues.ecId) {
        setTimeStatus(false)
      } else {
        setTimeStatus(true)
      }
    }
    if (value) {
      getBranch({ regionId: value })
      getDepartment({ regionId: value })
    }
  }
  const onValuesChange = () => {
    if (props.title === '编辑设备信息') {
      const initVal = getFieldsValue()

      if (!initVal.ecId && !props.initialValues.ecId) {
        setTimeStatus(false)
      } else if (initVal.ecId === props.initialValues.ecId) {
        setTimeStatus(false)
      } else {
        setTimeStatus(true)
      }
    }
  }

  useEffect(() => {
    const regionId = props.initialValues.edRegionid
    if (regionId) {
      getBranch({ regionId })
      getDepartment({ regionId })
    }
  }, [props.initialValues])

  return (
    <>
      <Form
        {...layout}
        form={device}
        initialValues={JSON.parse(JSON.stringify(props.initialValues))}
        onValuesChange={onValuesChange}
        className={styles.other_ant_form_item_explain}
      >
        <Form.Item
          name="edName"
          label="设备名称"
          rules={[{ required: true, message: '设备名称必填' }]}
        >
          <Input maxLength={30} />
        </Form.Item>
        <Form.Item
          name="edItem"
          label="所属分项"
          rules={[{ required: true, message: '所属分项必填' }]}
        >
          <Select>
            {props.itemList.map((item) => (
              <Option key={item.icode} value={item.icode}>
                {item.iname}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="edVoltage"
          label="额定电压"
          rules={[
            { required: true, message: '额定电压必填' },
            {
              pattern: /^[1-9]\d*$/,
              message: '请输入正整数',
            },
          ]}
        >
          <Input suffix="V" min={0} maxLength={10} />
        </Form.Item>
        <Form.Item
          name="edInputPower"
          label="额定输入功率"
          rules={[
            { required: true, message: '额定输入功率必填' },
            {
              pattern: /^[1-9]\d*$/,
              message: '请输入正整数',
            },
          ]}
        >
          <Input suffix="W" min={0} maxLength={10} />
        </Form.Item>
        <Form.Item
          name="edInputElectric"
          label="额定输入电流"
          rules={[
            { required: true, message: '额定输入电流必填' },
            {
              pattern: /^[1-9]\d*$/,
              message: '请输入正数',
            },
          ]}
        >
          <Input suffix="A" min={0} maxLength={10} />
        </Form.Item>
        <Form.Item
          name="edMaxPower"
          label="最大输入功率"
          rules={[
            { required: true, message: '最大输入功率必填' },
            {
              pattern: /^[1-9]\d*$/,
              message: '请输入正数',
            },
          ]}
        >
          <Input suffix="W" min={0} maxLength={10} />
        </Form.Item>
        <Form.Item
          name="edMaxElectric"
          label="最大输入电流"
          rules={[
            { required: true, message: '最大输入电流必填' },
            {
              pattern: /^[1-9]\d*$/,
              message: '请输入正数',
            },
          ]}
        >
          <Input suffix="A" min={0} maxLength={10} />
        </Form.Item>
        <Form.Item
          name="edRegionid"
          label="所属区域"
          // rules={[{ required: true, message: '所属区域必填' }]}
        >
          <TreeSelect
            allowClear
            treeData={props.regionList}
            // onSelect={onChangeRegion}
            onChange={onChangeRegion}
          />
        </Form.Item>
        <Form.Item
          name="ecId"
          label="上级支路名称"
          // rules={[{ required: true, message: '上级支路名称必填' }]}
        >
          <TreeSelect allowClear treeData={branchList} />
        </Form.Item>
        {props.title === '编辑设备信息' && timeStatus ? (
          <Form.Item
            name="edrBeginTime"
            label="变更时间"
            rules={[{ required: true, message: '变更时间必填' }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            />
          </Form.Item>
        ) : null}
        <Form.Item
          name="edDepid"
          label="能耗部门"
          // rules={[{ required: true, message: '能耗部门必填' }]}
        >
          <TreeSelect treeData={departmentList} allowClear />
        </Form.Item>
      </Form>
      <Divider style={{ margin: '8px 0px' }} />
      <Row style={{ flexDirection: 'row-reverse' }}>
        <Space align="end">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={addDevice} loading={loading}>
            确定
          </Button>
        </Space>
      </Row>
    </>
  )
}

export default DeviceInfo
