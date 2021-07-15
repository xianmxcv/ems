import {
  IFirmwareType,
  IUpgradeStatus,
  IUpgradeTimeStatus,
  IUpgradeType,
  IRateType,
  IelectricMeterType,
  IMeterType,
} from './common'

export interface IPageRequest {
  current: number
  size: number
}

export interface ILogin {
  userAccount: string
  password: string
}

export interface IUpdatePassword {
  userAccount: string
  newPassword: string
  oldPassword: string
}

export interface IQueryParams extends IPageRequest {
  inputName?: string
  operationType?: IUpgradeType
  promotionStatus?: IUpgradeStatus
}

export interface ICreateDev {
  assetThingId?: string
  thingId: string
  thingName: string
  versionList: Array<{ firewarmType: string; firewarmVersionId: string }>
}

export interface IReqUpgradeVersion {
  assetThingId: string
  firmwareType: IFirmwareType
}

export interface IUpgardeDev {
  operationType: IUpgradeType
  assetThingId: string
  thingId: string
  firmwareType?: IFirmwareType
  targetVersion?: string
  startType?: IUpgradeTimeStatus
  startTime?: string
  description?: string
  promtionPort?: string
  sequence: string
}
export interface IReqEnergyDevice {
  current?: number
  edName?: string
  size?: number
  tenantId?: string
  edItem?: string
  edVoltage?: number
  edInputPower?: number
  edInputElectric?: number
  edMaxPower?: number
  edMaxElectric?: number
  ecId?: string
  edRegionid?: string
  edDepid?: string
}
export interface IReqBranch {
  ecId?: string
  ecParent?: string
  ecName?: string
}
export interface IReqDepartment {
  depId?: string
  depParent?: string
  depName?: string
}
export interface IReqEnergyDeviceList extends IPageRequest {
  edName?: string
  tenantId?: string
  depIds?: string[]
  ecIds?: string[]
  regionIds?: string[]
  order?: number
}
export interface IReqTransformer extends IPageRequest {
  inputName?: string
  tenantId?: string
  ecIdList?: string[]
}
export interface IReqRegionAndCircuit {
  erId?: string
  ecId: string
  regionId: string
}
export interface IReqRegionAndCircuitPage {
  current: number
  ecName: string
  size: number
  regionIds: string[]
}
export interface IReqTransformerPage {
  current?: number
  inputName?: string
  size?: number
  begin?: string
  end?: string
  emMeterType?: IMeterType
  emType?: string[]
}
export interface IFormEnergyDevice {
  ecId?: string
  edId?: string
  edRegionid: string
  edDepid: string
  edName: string
  edItem: string
  edVoltage: number | null
  edInputPower: number | null
  edInputElectric: number | null
  edMaxPower: number | null
  edMaxElectric: number | null
}
export interface BaseRate {
  regionId: string
  cpAddress: string
  cpRateType: IRateType
  cpCost: number
  cpDesc: string
  cpStartDate: string
  cpEndDate: string
  cpBegintime: string
  cpEndtime: string
}
export interface BaseRateFrom {
  cpIds: string[]
  updateCostPeriodForms: BaseRate[]
}
export interface AddNoWorkDay {
  nwdDay: string
  depId: string
}
export interface GetNoWorkDay {
  date: string
  depIds?: string[]
}
export interface GetCostPeriod {
  regionName?: string
}
export interface ElectricMeterDetail extends IPageRequest {
  emId: string
  attrName?: string
}
export interface ElectricNameList {
  emName?: string
  emMeterType?: IMeterType
}
export interface IReqTransformDetailPage {
  current: number
  inputName?: string
  emId: string
  emName?: string
  attrName?: string
  size: number
  ecList?: string[]
}
export interface ElectricMeterHistory extends IPageRequest {
  emId: string
  ecList?: string
  inputName?: string
  emName?: string
  attrName?: string
}

export interface ElectricMeterDetailSingle {
  emId: string
  attrName?: string
}

export interface ElectricMeterRealtime {
  emId: string
  sequence?: string
}
export interface IReqAddElectricForm {
  ecId: string
  emCabinetCode: string
  emCabinetName: string
  emCode: string
  emModel: string
  emName: string
  emType: IelectricMeterType
  thingId: string
  ecnNameStr: string
  emDesc: string
  emManufacturer: string
}
export interface MrecQuery {
  mrecType: string
  mrecVal: number
  mrecUnit?: string
}

export interface IReqAddManualRecordForm {
  emId: string
  mrecTime: any
  recordList: MrecQuery[]
}
export interface IReqManualRecord {
  addElectricForm: IReqAddElectricForm
  addManualRecordForm: IReqAddManualRecordForm
}
export interface IReqManualRecordPage extends IPageRequest {
  mrecTimeEnd: IReqAddElectricForm
  mrecTimeStart: IReqAddManualRecordForm
}
export interface IReqDeviceComsumption {
  dateType?: string
  begin: string
  end: string
  compareType?: string
  ecId?: string
  current?: number
  size?: number
  unitIds?: string[]
}

export interface IReqTransformerTrend {
  emId?: string
  tenantId?: string
  timeStart?: string
  timeEnd?: string
  transformerId: string
}
export interface IReqReport {
  date: string
  dateType: string
  unitIds?: string[]
}
export interface IReqHomePage {
  ecId?: string
  queryDate?: string
  energyType?: string
}
export interface IReqDelRecord {
  emId: string
  mrecTime: string
}
