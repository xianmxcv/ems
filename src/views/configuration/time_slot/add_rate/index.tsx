import api from '@/service/api'
import { IRateTypeName } from '@/types/common'
import { BaseRate } from '@/types/reqType'
import { ITreeData } from '@/types/resType'
import { region } from '@/utils/region'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
  DatePicker,
  Cascader,
  TreeSelect,
  InputNumber,
  message,
  Divider,
} from 'antd'
import { Store } from 'antd/lib/form/interface'
import { orderBy, reduce } from 'lodash-es'
import React, { useState, useEffect } from 'react'
import { InitDevice } from '../RateComponent'
import styles from '../index.module.less'
interface ITimeRate {
  regionId?: string
  cpAddress?: string
  cpDesc?: string
  itemList?: any[]
  actives?: any
  regionName?: string
}
interface IProps {
  title: string
  initialValues: ITimeRate
  regionList: ITreeData[]
  options?: BaseRate[]
  AddRate: () => void
  Cancel: () => void
}

const options: any = {
  cpRateType: '',
  cpCost: '',
  cpAllTime: [],
}
const options1: any = {
  cpAllDate: [],
  cpDesc: '',
  itemList_1: [
    {
      cpRateType: '',
      cpCost: undefined,
      cpAllTime: [],
      disableEndTime: 0,
    },
  ],
}
const { Option } = Select
const AddRate = (props: IProps) => {
  const [regionName, setRegionName] = useState<string>('')
  const [activeNumber, setActiveNumber] = useState<any>(InitDevice)
  const [timeRate] = Form.useForm()
  const { validateFields, setFieldsValue, getFieldsValue } = timeRate
  const [loading, setLoading] = useState<boolean>(false)

  const onCancel = () => {
    props.Cancel()
  }
  const AddRate = () => {
    validateFields().then(async (values: Store) => {
      const { itemList = [], regionId, cpAddress = [] } = values
      const querys: BaseRate[] = []
      let subStatus = true
      const days = itemList.map((item: any) => {
        const { itemList_1, cpDesc, cpAllDate } = item
        const [cpStartDate, cpEndDate] = cpAllDate
        const times = itemList_1.map((itme_1: any) => {
          const { cpRateType, cpCost, cpBegintime, cpEndtime } = itme_1
          querys.push({
            regionId,
            cpAddress: `${cpAddress.join(',')}||${
              regionName ? regionName : props.initialValues.regionName
            }`,
            cpRateType,
            cpCost,
            cpDesc: cpDesc ? cpDesc.replace(/\n/g, '').substring(0, 199) : '',
            cpBegintime,
            cpEndtime,
            cpStartDate: cpStartDate.clone().format(),
            cpEndDate: cpEndDate.clone().format(),
          })
          return {
            cpBegintime,
            cpEndtime: cpEndtime,
          }
        })
        const orderByTimes = orderBy(times, ['cpBegintime'], ['asc'])
        if (orderByTimes.length === 1) {
          if (orderByTimes[0].cpBegintime !== 0) {
            subStatus = false
          }
          if (orderByTimes[0].cpEndtime !== 24) {
            subStatus = false
          }
        } else {
          orderByTimes.forEach((ele, index) => {
            const { cpBegintime, cpEndtime } = ele
            if (!index) {
              if (cpBegintime !== 0) {
                subStatus = false
              }
            } else {
              if (index + 1 < orderByTimes.length) {
                if (cpEndtime !== orderByTimes[index + 1].cpBegintime) {
                  subStatus = false
                }
              } else if (cpEndtime !== 24) {
                subStatus = false
              }
            }
          })
        }
        return {
          cpStartDate: cpStartDate.clone().format('YYYY-MM'),
          cpEndDate: cpEndDate.clone().add(1, 'months').format('YYYY-MM'),
        }
      })
      if (!subStatus) {
        message.error('时间格式有交叉或者断填')
        return
      }
      const orderByDays = orderBy(days, ['cpStartDate'], ['asc'])
      orderByDays.forEach((ele, index) => {
        const { cpEndDate } = ele
        if (index + 1 < orderByDays.length) {
          if (cpEndDate !== orderByDays[index + 1].cpStartDate) {
            subStatus = false
          }
        }
      })
      if (!subStatus) {
        message.error('日期格式有交叉或者断填')
        return
      }
      setLoading(true)
      try {
        if (props.title === '编辑设备信息') {
          const cpIds = props.initialValues.actives.map((ele: any) => ele.cpId)
          await api.putCostPeriod({ updateCostPeriodForms: querys, cpIds })
        } else {
          await api.addCostPeriod(querys)
        }
        props.AddRate()
      } catch (error) {
        message.error(error)
      } finally {
        setLoading(false)
      }
    })
  }
  const onChange = (value: any, selectedOptions: any) => {
    // selectedOptions
    const ids = reduce(
      selectedOptions,
      (id, el) => {
        if (id) {
          return (id += `-${el.label}`)
        } else {
          return el.label
        }
      },
      ''
    )
    setRegionName(ids)
  }

  const addVoltageRated = (add: Function, index: number) => {
    add(options1)
    changeActiveNumber()
  }
  const delVoltageRated = (remove: Function, index: number) => {
    remove(index)
    changeActiveNumber()
  }
  const addRatedType = (add: Function, index: number) => {
    add(options)
    changeActiveNumber()
  }
  const delRatedType = (remove: Function, index: number, pIndex: number) => {
    remove(index)
    changeActiveNumber()
  }
  const onFirstChange = (value: any, pIndex: number, index: number) => {
    const list = getFieldsValue()
    const { itemList } = list
    const activeList = itemList[pIndex].itemList_1[index]
    activeList.disableEndTime = value
    activeNumber.itemList[pIndex].itemList_1[index].disableEndTime = value
    setActiveNumber(JSON.parse(JSON.stringify(list)))
  }
  const changeActiveNumber = () => {
    const list = getFieldsValue()
    setActiveNumber(JSON.parse(JSON.stringify(list)))
  }
  const onSelectTreeSelect = async (value: string) => {
    if (value === props.initialValues.regionId) return
    try {
      await api.getCostPeriodRegionId(value)
    } catch (error) {
      setFieldsValue({ regionId: null })
      message.error(error)
    }
  }

  useEffect(() => {
    setActiveNumber(props.initialValues)
  }, [props.initialValues])

  const ItemList = (props: any) => {
    const { field, pIndex } = props
    return (
      <>
        <Form.List name={[field.name, 'itemList_1']}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((innerField, index) => {
                  return (
                    <React.Fragment key={innerField.key}>
                      <Form.Item style={{ margin: 0 }}>
                        <Row
                          align="middle"
                          key={innerField.key}
                          style={{ height: 56, flexWrap: 'nowrap' }}
                        >
                          <Col className={styles.open_add_rate_1}>
                            <Form.Item
                              key={innerField.key}
                              name={[innerField.name, 'cpRateType']}
                              fieldKey={[innerField.key, 'cpRateType']}
                              label="费率类型"
                              rules={[{ required: true, message: '费率类型必填' }]}
                            >
                              <Select>
                                {Object.entries(IRateTypeName).map((ele, key) => (
                                  <Option key={key} value={ele[0]}>
                                    {ele[1]}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className={styles.open_add_rate_2}>
                            <Form.Item
                              key={innerField.key}
                              name={[innerField.name, 'cpAllTime']}
                              fieldKey={[innerField.key, 'cpAllTime']}
                            >
                              <Space>
                                <Form.Item
                                  key={innerField.key}
                                  name={[innerField.name, 'cpBegintime']}
                                  fieldKey={[innerField.key, 'cpBegintime']}
                                  label="时间点范围"
                                  rules={[{ required: true, message: '时间点范围必填' }]}
                                >
                                  <Select
                                    value={innerField.name}
                                    style={{ width: 80 }}
                                    onChange={(value) => onFirstChange(value, pIndex, index)}
                                  >
                                    {Array(25)
                                      .fill(0)
                                      .map((province, key) => (
                                        <Option
                                          key={key}
                                          value={key}
                                          disabled={key === 24 ? true : false}
                                        >
                                          {key}
                                        </Option>
                                      ))}
                                  </Select>
                                </Form.Item>
                                至
                                <Form.Item
                                  key={innerField.key}
                                  name={[innerField.name, 'cpEndtime']}
                                  fieldKey={[innerField.key, 'cpEndtime']}
                                  rules={[{ required: true, message: '时间点范围必填' }]}
                                >
                                  <Select style={{ width: 80 }}>
                                    {Array(25)
                                      .fill(0)
                                      .map((province, key) => (
                                        <Option
                                          key={key}
                                          value={key}
                                          disabled={
                                            key === 0
                                              ? true
                                              : key >
                                                activeNumber?.itemList[pIndex]?.itemList_1[index]
                                                  ?.disableEndTime
                                              ? false
                                              : true
                                          }
                                        >
                                          {key}
                                        </Option>
                                      ))}
                                  </Select>
                                </Form.Item>
                              </Space>
                            </Form.Item>
                          </Col>
                          <Col className={styles.open_add_rate_3}>
                            <Form.Item
                              key={innerField.key}
                              name={[innerField.name, 'cpCost']}
                              fieldKey={[innerField.key, 'cpCost']}
                              label="电费"
                              rules={[{ required: true, message: '电费必填' }]}
                            >
                              <InputNumber type="number" max={99} min={0} precision={4} />
                            </Form.Item>
                          </Col>
                          <Col style={{ lineHeight: '56px', width: 120 }}>
                            元/度
                            <Space style={{ marginLeft: 12, color: 'rgba(19, 194, 194, 1)' }}>
                              <PlusCircleOutlined
                                style={{ fontSize: 18 }}
                                onClick={() => addRatedType(add, fields.length)}
                              />
                              {fields.length > 1 ? (
                                <DeleteOutlined
                                  style={{ fontSize: 18 }}
                                  onClick={() => delRatedType(remove, index, pIndex)}
                                />
                              ) : null}
                            </Space>
                          </Col>
                        </Row>
                      </Form.Item>
                    </React.Fragment>
                  )
                })}
              </>
            )
          }}
        </Form.List>
      </>
    )
  }

  return (
    <div style={{ maxHeight: '100%' }}>
      <Row justify="center">
        <div className={styles.textBg}>
          <Row>
            <Col style={{ fontSize: 18, fontWeight: 600 }}>注意：</Col>
            <Col>
              <p>1.同一区域下的周期段不能交叉或断填；</p>
              <p>2.同区域下同一周期段的费率时段不能交叉或断填；</p>
            </Col>
          </Row>
        </div>
      </Row>
      <Form
        form={timeRate}
        initialValues={props.initialValues}
        className={styles.other_picker_range}
      >
        <Form.Item
          name="regionId"
          label="一级区域名称"
          rules={[{ required: true, message: '一级区域名称必填' }]}
          style={{ marginTop: 20, width: 410 }}
        >
          <TreeSelect treeData={props.regionList} onSelect={onSelectTreeSelect} />
        </Form.Item>
        <Form.Item
          name="cpAddress"
          label="地址"
          rules={[{ required: true, message: '地址必填' }]}
          style={{ marginTop: 20 }}
        >
          <Cascader
            options={region}
            onChange={onChange}
            fieldNames={{
              label: 'label',
              value: 'value',
              children: 'children',
            }}
          />
        </Form.Item>
        <Form.List name="itemList">
          {(fields, { add, remove }) =>
            fields.map((field, index) => (
              <React.Fragment key={field.key}>
                <div style={{ backgroundColor: 'rgb(250, 250, 250)' }}>
                  <Form.Item name={[field.name, 'cpAllDate']} style={{ margin: 0, height: 56 }}>
                    <Row align="bottom" style={{ height: 56 }}>
                      <Col>
                        <Form.Item
                          name={[field.name, 'cpAllDate']}
                          label="周期段"
                          rules={[{ required: true, message: '周期段必填' }]}
                          style={{ margin: 0 }}
                        >
                          <DatePicker.RangePicker
                            picker="month"
                            format="YYYY-MM"
                            placeholder={['开始月', '结束月']}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Space style={{ marginLeft: 12, color: 'rgba(19, 194, 194, 1)' }}>
                          <PlusCircleOutlined
                            style={{ fontSize: 18 }}
                            onClick={() => addVoltageRated(add, index)}
                          />
                          {fields.length > 1 ? (
                            <DeleteOutlined
                              style={{ fontSize: 18 }}
                              onClick={() => delVoltageRated(remove, index)}
                            />
                          ) : null}
                        </Space>
                      </Col>
                    </Row>
                  </Form.Item>
                  <ItemList
                    form={timeRate}
                    fieldsList={fields}
                    field={field}
                    removeBase={remove}
                    pIndex={index}
                  />
                  <Form.Item
                    name={[field.name, 'cpDesc']}
                    label="备注"
                    style={{ width: 410, margin: '24px 0' }}
                  >
                    <Input.TextArea showCount maxLength={200} />
                  </Form.Item>
                </div>
              </React.Fragment>
            ))
          }
        </Form.List>
      </Form>

      <Row
        style={{
          flexDirection: 'row-reverse',
          position: 'absolute',
          bottom: '-80px',
          right: 0,
          backgroundColor: '#fff',
          width: '100%',
          padding: '24px 48px',
        }}
      >
        <Divider style={{ margin: '8px 0px' }} />
        <Space align="end">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={AddRate} loading={loading}>
            确定
          </Button>
        </Space>
      </Row>
    </div>
  )
}

export default AddRate
