import { Moment } from 'moment'
import {
  IelectricMeterType,
  IFirmwareType,
  ITemplateAttrTag,
  ITransformerType,
  IUpgradeStatus,
  IUpgradeType,
  IAttributeType,
  IThingStatus,
  IMeterType,
} from './common'

// api普通返回接口
export interface IResponse<T> {
  code: string
  mesg: string
  data: T
}

// api列表返回接口
export interface IPageResponse<T> {
  current: number
  size: number
  total: number
  records: T[]
}
export interface IPageDynamicResponse<T> {
  current: number
  size: number
  total: number
  data: T
}

export interface IResUseInfo {
  tenantId: string
  authorization: string
  id: string
  code: string
  wrongCnt: number
  mesg: string
  time: string
  message: string
  username: string
  name: string
  wrongCount: number
  userAccount: string
  tenantAdmin?: string
  logged: number
}

// 固件升级设备列表
export interface IResUserMenu {
  key: any
  createdBy: string
  createdTime: string
  deleted: string
  description: string
  id: string
  menuId: string
  menuKey: string
  menuName: string
  menuRoute: string
  menuSort: number
  menuType: number
  menuUrl: string
  parentId: string
  updatedBy: string
  updatedTime: string
  children: IResUserMenu[]
}

// 实例
export interface IThings {
  thingId: string
  thingName: string
}

export interface IVersions {
  versionId: string
  firmwareVersion: string
  firmwareType: IFirmwareType
}

export interface IPort {
  portId: string
  portName: string
}

export interface IVersionInfo {
  versionId: string
  firmwareVersion: string
  firmwareType: IFirmwareType
  fileName: string
  createdBy: string
  createdTime: string
  description: string
  promotionStatus: IUpgradeStatus
}

export interface IVersionDetail {
  fwType: IFirmwareType
  version: string
  supportedVer: string
  NotSupportedVer: string
  type: string
  description: string
}

export interface IUpgradeHistory {
  historyId: string
  thingName: string
  currentVersion: IVersions[]
  targetVersion: string
  targetVersionType: IFirmwareType
  operationType: IUpgradeType
  promotionStatus: IUpgradeStatus
  createdBy: string
  createdTime: string
  failureReason: string
  currentVersionName: string
}

export interface IResEnergyList {
  name: string
  item: string
  voltageRated: string
  inputPowerRated: string
}
export interface ITreeData {
  title: string
  key: string
  pid: string
  editCell?: boolean
  disabled?: boolean
  showAction?: boolean
  children?: ITreeData[]
  fullLinkKey?: string
  isShow?: boolean
}
export interface IReqEnergyDevice {
  edName: string
  tenantId: string
  edItem: string
  edVoltage: number
  edInputPower: number
  edInputElectric: number
  edMaxPower: number
  edMaxElectric: number
  ecId: string
  edRegion: string
  edRegionid: string
  edDepid: string
  edId: string
  ecDeviceList: Array<string>
}
export interface EcDeviceList {
  ecId: string
  edCircuit: string
  edrBeginTime?: string
  ecChainName?: string
}
export interface IResEnergyDevice {
  ecId: string
  edId: string
  edRegionid: string
  edDepid: string
  edName: string
  edItem: string
  edVoltage: number
  edInputPower: number
  edInputElectric: number
  edMaxPower: number
  edMaxElectric: number
  edRegion?: string
  edDep?: string
  rchainName?: string
  ecChainName?: string
}
export interface IregionCircuitConditions {
  erId: string
  ecName: string
  ecId: string
  regionId: string
  regionName: string
  rchainName: string
  ecChainName: string
}
export interface IEtrList {
  ecId: string
  ecName: string
  etrBeginTime: string
  etrEndTime: string
  updatedBy: string
  ecChainName: string
}
export interface ITransformer {
  tfId?: string
  tfCode: string
  tfName: string
  tfType: ITransformerType
  tfTypeName: string
  tfCapacity: number
  tfOnceVolts: string
  tfSecondVolts: string
  tfVoltageLevel: number
  tfPowerUnit: string
  tfLowvolElectric: number
  tfDesc: string
  ecID: string
  ecName: string
  ecBeginTime?: string
  etrList: IEtrList[]
  ecId?: string
  emId?: string // 变压器上是否挂电表
}
export interface IReportConfig {
  manulId?: string
  manulBegintime: Moment
  manulEndtime: Moment
  manulState: boolean
  manulDesc: string
  updatedBy: number
  updatedTime: string
}
export interface IElectricMeter {
  emId?: string
  ecId: string
  ecnNameStr: string
  emCabinetCode: string
  emCabinetName: string
  emCode: string
  emDesc: string
  emManufacturer: string
  emModel: string
  emType: IelectricMeterType
  emName: string
  thingId: string
  ecChainName: string
  emMeterType: IMeterType
}
export interface IEcn {
  ecnName: string
  emName: string
  thingId: string
}
export interface IAttrInfo {
  attrDesc: string
  attrName: string
  attrType: ITemplateAttrTag
  attrUnit: number
  collectionInterval: string
  dataType: string
  defaultData: string
}
export interface IResTransformer {
  tfName: string
  tfCode: string
  tfSecondVolts: string
  tfCapacity: number
  tfLowvolElectric: number
  tfVoltageLevel: number
  tfDesc: string
  tfId: string
  tfOnceVolts: string
  tfType: string
  tfTypeName: string
  tfPowerUnit: string
  etrList: Array<any>
}
export interface IResNoWorkDay {
  nwdDay: string
  depName: string
  depId: string
  nwdId: string
}
export interface ElectricMeterAttrVO {
  attrDesc: string
  attrName: string
  attrType: ITemplateAttrTag
  attrUnit: number
  collectionInterval: number
  dataType: string
  defaultData: string
}
export interface IResElectricNameList {
  key: string
  title: string
  pid: string
  children?: IResElectricNameList[]
}

export interface IResMeterList {
  emName: string
  emId: string
  emCode: string
}

export interface IResIElectricMeter {
  createdBy: string
  createdTime: string
  ecChainName: string
  ecId: string
  ecnNameStr: string
  emCabinetCode: string
  emCabinetName: string
  emCode: string
  emDesc: string
  emId: string
  emManufacturer: string
  emModel: string
  emName: string
  emType: IelectricMeterType
  thingId: string
  updatedBy: string
  regionName: string
}
export interface IResIElectricMeterPage {
  emId: string
  emName: string
  mrecTime: string
  aepi: string
  bepi: string
  cepi: string
  ep: string
  epe: string
  epi: string
  eq: string
  eqe: string
  eqi: string
  pFlow: string
  rFlow: string
}
export interface IChartData {
  label: string
  values: number[]
  toCoals: number[]
}
export interface IDeviceConsumptionChart {
  labels: string[]
  datasets: IChartData[]
}
export interface IResIElectricMeterPageHistory {
  attrId: string
  attrName: string
  collectDate: string
  ecnName: string
  ruleName: string
  thingId: string
  thingName: string
  unit: number
  unitMultiplier: string
  value: string
  attrType: IAttributeType
}
export interface IChartDataSort {
  label: string
  value: number
}
export interface IDeviceConsumptionChartSort {
  labels: string[]
  datasets: IChartDataSort[]
}
export interface IResIElectricMeterRealTime {
  attrId: string
  attrName: string
  date: string
  ecnName: string
  ruleName: string
  thingId: string
  thingName: string
  unit: number
  unitMultiplier: string
  value: string
  collectDate: number
  attrType: IAttributeType
}
export interface IResDeviceConsumptionPage {
  labels: string[]
  dataLabels: string[]
  datasets: IChartData[]
  rates?: {
    label: string
    values: string[]
  }
}

export interface IResTrafficDevInfo {
  emId: string
  emName: string
  thingId: string
  status: IThingStatus
}

export interface IResTrafficInfo {
  value: string
  label: string
  meterList: Array<IResTrafficDevInfo>
}

export interface IRegionInfo {
  value: string
  label: string
  children: Array<IRegionInfo>
}
export interface IResReportHead {
  label: string
  headerSub: string[]
}
export interface IResReportCtx {
  dataList: any[]
  label: string
}
export interface IResReport {
  datasets: IResReportCtx[]
  header: IResReportHead[]
}
export interface IResHomeBranchConsumption {
  ecName: string
  ecConsume: number
  nextEcConsume: number
  consumeDiff: number
}
export interface ITransformerParams {
  attrId: string
  attrName: string
  attrValue: string
  attrUnit: number
}
export interface IResHomeEnergyConsumptionStatic {
  areaProportion: string
  regionName: string
  sumEpi: string
}
export interface IResHomeCountDevice {
  deviceCount: number
  ecnCount: number
  emCount: number
  tfCount: number
}
export interface IResHomeCountItem {
  icode: string
  iname: string
  sumEpi: number
}

export interface IResPowerTrend {
  activePower: number
  reactivePower: number
  collectDate: string
}

export interface IResElectricTrend {
  acurrent: number
  bcurrent: number
  ccurrent: number
  collectDate: string
}
export interface IResHomeEnergy {
  collectDate: string
  lastSumEpi: number
  sumEpi: number
}
export interface IResHomeEnergyConsumption {
  currentList: IResHomeEnergy[]
  currentMonth: number
  lastList: IResHomeEnergy[]
  lastMonth: number
  sequential: string
}

export interface IResHomeEnergyUsage {
  name: string
  amount: number
  unit: string
}
