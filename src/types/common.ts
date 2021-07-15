export type UserRole = 'user' | 'admin'

export interface IUser {
  userName: string
  userId: string
  role?: UserRole
}

export interface IChinaMapData {
  name: string
  value: Array<{ name: string; value: string }>
}

export enum IWeekStatus {
  Monday = '0',
  Tuesday = '1',
  Wednesday = '2',
  Thursday = '3',
  Friday = '4',
  Saturday = '5',
  Sunday = '6',
}

export const IWeekNameCN: { [T in IWeekStatus]: string } = {
  [IWeekStatus.Monday]: '星期一',
  [IWeekStatus.Tuesday]: '星期二',
  [IWeekStatus.Wednesday]: '星期三',
  [IWeekStatus.Thursday]: '星期四',
  [IWeekStatus.Friday]: '星期五',
  [IWeekStatus.Saturday]: '星期六',
  [IWeekStatus.Sunday]: '星期日',
}

export enum IAlarmLevel {
  General = 1,
  Important = 2,
  Serious = 3,
  NoData = 4,
}

export const IAlarmName: { [T in IAlarmLevel]: string } = {
  [IAlarmLevel.General]: '一般',
  [IAlarmLevel.Important]: '重要',
  [IAlarmLevel.Serious]: '紧急',
  [IAlarmLevel.NoData]: '暂无数据',
}

export enum ITarget {
  DEVICE = 'device',
  GATEWAY = 'gateway',
  INERRANT = 'inerrant',
}

export const ITargetName = {
  [ITarget.GATEWAY]: '网关',
  [ITarget.DEVICE]: '设备',
  [ITarget.INERRANT]: '数据',
}

export enum ITemplateAttrTag {
  READONLY = '1',
  SINGLEWRITEONLY = '2',
  READSW = '3',
  MYLTIWRITEONLY = '4',
  READMW = '5',
  RW = '7',
}

export const ITemplateAttrTagName: { [T in ITemplateAttrTag]: string } = {
  [ITemplateAttrTag.READONLY]: '只读',
  [ITemplateAttrTag.SINGLEWRITEONLY]: '只单写',
  [ITemplateAttrTag.READSW]: '读-单写',
  [ITemplateAttrTag.MYLTIWRITEONLY]: '只多写',
  [ITemplateAttrTag.READMW]: '读-多写',
  [ITemplateAttrTag.RW]: '读写',
}

export enum ITemplateAttrKey {
  READONLY = '只读',
  SINGLEWRITEONLY = '只单写',
  READSW = '读-单写',
  MYLTIWRITEONLY = '只多写',
  READMW = '读-多写',
  RW = '读写',
}

export const ITemplateAttrKeyName: { [T in ITemplateAttrKey]: string } = {
  [ITemplateAttrKey.READONLY]: '1',
  [ITemplateAttrKey.SINGLEWRITEONLY]: '2',
  [ITemplateAttrKey.READSW]: '3',
  [ITemplateAttrKey.MYLTIWRITEONLY]: '4',
  [ITemplateAttrKey.READMW]: '5',
  [ITemplateAttrKey.RW]: '7',
}

export const templateAttrTagNames = ['只读', '只单写', '读-单写', '只多写', '读-多写', '读写']

export const dataTypes = ['string', 'integer', 'long', 'float', 'boolean', 'short', 'double']

export enum IThingStatus {
  NORMAL = 1,
  EXCEPTION = 2,
  TIMEOUT = 3,
}

export const IThingStatusName: { [T in IThingStatus]: string } = {
  [IThingStatus.NORMAL]: '正常',
  [IThingStatus.EXCEPTION]: '异常',
  [IThingStatus.TIMEOUT]: '超时',
}

export const dataUnits = [
  '--',
  'm',
  'g',
  's',
  'A',
  '℃',
  'V',
  'Hz',
  'W',
  'Pa',
  'm2',
  'm3',
  'VA',
  'Var',
  '°',
  'Wh',
  'Vah',
  'Varh',
  '%',
  '℉',
  'rpm',
  'Ω',
]

export enum IEcnAuthStatus {
  INITIAL = 0,
  PASS = 1,
  NOTPASS = 2,
}

export const IEcnAuthStatusName: { [T in IEcnAuthStatus]: string } = {
  [IEcnAuthStatus.INITIAL]: '未认证',
  [IEcnAuthStatus.PASS]: '认证成功',
  [IEcnAuthStatus.NOTPASS]: '认证失败',
}

export enum IEcnStatus {
  OFFLINE = 0,
  ONLINE = 1,
}

export const IEcnStatusName: { [T in IEcnStatus]: string } = {
  [IEcnStatus.ONLINE]: '在线',
  [IEcnStatus.OFFLINE]: '离线',
}

export enum IEcnDispatchStatus {
  INITIAL = 0,
  SUCCESS = 1,
  FAILED = 2,
}

export const IEcnDispatchStatusName: { [T in IEcnDispatchStatus]: string } = {
  [IEcnDispatchStatus.INITIAL]: '未下发',
  [IEcnDispatchStatus.SUCCESS]: '下发成功',
  [IEcnDispatchStatus.FAILED]: '下发失败',
}

export enum IEcnActiveStatus {
  INITIAL = 0,
  SUCCESS = 1,
  FAILED = 2,
}

export const IEcnActiveStatusName: { [T in IEcnActiveStatus]: string } = {
  [IEcnActiveStatus.INITIAL]: '未激活',
  [IEcnActiveStatus.SUCCESS]: '激活成功',
  [IEcnActiveStatus.FAILED]: '激活失败',
}

export enum IEcnType {
  GATEWAY = 1,
  CONTROLLER = 2,
  SERVERS = 3,
  OTHER = 4,
}

export const IEcnTypeName: { [T in IEcnType]: string } = {
  [IEcnType.GATEWAY]: '边缘网关',
  [IEcnType.CONTROLLER]: '边缘控制器',
  [IEcnType.SERVERS]: '边缘服务器',
  [IEcnType.OTHER]: '其它',
}

export enum IEcnMonitorStatus {
  MEMRATIO = 'memRatio',
  CPURATIO = 'cpuRatio',
  DISKRATIO = 'diskRatio',
  CACHERATIO = 'cacheRatio',
  UPPERTRAFFIC = 'upperTraffic',
  DOWNTRAFFIC = 'downTraffic',
  TOTALTRAFFIC = 'totalTraffic',
}

export const IEcnMonitorStatusName: { [T in IEcnMonitorStatus]: string } = {
  [IEcnMonitorStatus.MEMRATIO]: '内存使用率',
  [IEcnMonitorStatus.CPURATIO]: 'CPU使用率',
  [IEcnMonitorStatus.DISKRATIO]: '磁盘使用率',
  [IEcnMonitorStatus.CACHERATIO]: '缓存使用率',
  [IEcnMonitorStatus.UPPERTRAFFIC]: '上行流量',
  [IEcnMonitorStatus.DOWNTRAFFIC]: '下行流量',
  [IEcnMonitorStatus.TOTALTRAFFIC]: '总流量',
}

export const Operators = ['==', '!=', '>', '<', '>=', '<=']

export enum ILogLevel {
  ERROR = 0,
  INFO = 1,
  DEBUG = 2,
}

export const ILogLevelName: { [T in ILogLevel]: string } = {
  [ILogLevel.ERROR]: '错误级',
  [ILogLevel.INFO]: '操作级',
  [ILogLevel.DEBUG]: '调试级',
}

export const TrafficUnits = ['KB', 'MB', 'GB', 'TB']

export enum IProtocol {
  MODBUSRTU = 1,
  // BACNET = 2,
  // DLT645 = 3,
  //PROFIDP = 101,
  //MODBUSUDP = 201,
  //MODBUSTCP = 202,
  //ProfiNet = 203,
  //OPCUA = 204,
}
export const IProtocolName: { [T in IProtocol]: string } = {
  [IProtocol.MODBUSRTU]: 'Modbus RTU',
  // [IProtocol.BACNET]: 'BacNET',
  // [IProtocol.DLT645]: 'DLT645',
  // [IProtocol.PROFIDP]: 'ProfiDP',
  // [IProtocol.MODBUSUDP]: 'MODBUS-UDP',
  // [IProtocol.MODBUSTCP]: 'MODBUS-TCP',
  // [IProtocol.PROFINET]: 'ProfiNet',
  // [IProtocol.OPCUA]: 'OPC-UA',
}

// export const IFaces = ['COM1', 'COM2', 'COM3', 'COM4', 'ETH1', 'ETH2']

export enum Interfaces {
  COM1 = 0,
  COM2 = 1,
  COM3 = 2,
  COM4 = 3,
}
export const InterfacesName: { [T in Interfaces]: string } = {
  [Interfaces.COM1]: 'COM1',
  [Interfaces.COM2]: 'COM2',
  [Interfaces.COM3]: 'COM3',
  [Interfaces.COM4]: 'COM4',
}

export const BaudRates = [4800, 9600, 19200, 38400, 57600, 115200]

export const IParitys = ['无校验', '奇校验', '偶校验']

export const DataBit = [7, 8]

export const StopBit = [0, 1, 2]

export enum ICollectStatus {
  SUCCESS = 1,
  FAILED = 2,
  UNUSED = 0,
}

export const ICollectStatusName: { [T in ICollectStatus]: string } = {
  [ICollectStatus.SUCCESS]: '采集成功',
  [ICollectStatus.FAILED]: '采集失败',
  [ICollectStatus.UNUSED]: '未采集',
}

export enum IUpgradeTimeStatus {
  IMMEDIATELY = 1,
  TIMING = 2,
}

export const IUpgradeTimeStatusName: { [T in IUpgradeTimeStatus]: string } = {
  [IUpgradeTimeStatus.IMMEDIATELY]: '立即启用',
  [IUpgradeTimeStatus.TIMING]: '定时启用',
}

export enum IRTStatus {
  COILSTATUS = 0,
  INPUTSTATUS = 1,
  HOLDING = 2,
  INPUT = 3,
}

export const IRTStatusName: { [T in IRTStatus]: string } = {
  [IRTStatus.COILSTATUS]: '线圈状态寄存器',
  [IRTStatus.INPUTSTATUS]: '离散状态寄存器',
  [IRTStatus.HOLDING]: '保持寄存器',
  [IRTStatus.INPUT]: '输入寄存器',
}

export enum IDataFormatStatus {
  UNIT16 = 3,
  BITUNIT8 = 8,
}

export const IDataFormatStatusName: { [T in IDataFormatStatus]: string } = {
  [IDataFormatStatus.UNIT16]: 'Uint16(1)',
  [IDataFormatStatus.BITUNIT8]: 'BIT_IN_UINT8(1/2)',
}

export const UnitMultipliers = ['milli', 'cent', 'deci', '--', 'hecto', 'kilo', 'Mega', 'Giga']

//固件升级
export enum IUpgradeTaskStatus {
  INITIAL = 0,
  WAITING = 1,
  UPGRADING = 2,
  SUCCESS = 3,
  FAILED = 4,
}

export const IUpgradeTaskStatusName: { [T in IUpgradeTaskStatus]: string } = {
  [IUpgradeTaskStatus.INITIAL]: '待升级',
  [IUpgradeTaskStatus.WAITING]: '待升级',
  [IUpgradeTaskStatus.UPGRADING]: '升级中',
  [IUpgradeTaskStatus.SUCCESS]: '升级完成',
  [IUpgradeTaskStatus.FAILED]: '升级失败',
}

//固件升级
export enum IUpgradeStatus {
  INITIAL = 0,
  WAITING = 1,
  UPGRADING = 2,
  SUCCESS = 3,
  FAILED = 4,
}

export const IUpgradeStatusName: { [T in IUpgradeStatus]: string } = {
  [IUpgradeStatus.INITIAL]: '待升级',
  [IUpgradeStatus.WAITING]: '待升级',
  [IUpgradeStatus.UPGRADING]: '升级中',
  [IUpgradeStatus.SUCCESS]: '升级成功',
  [IUpgradeStatus.FAILED]: '升级失败',
}

export enum IFirmwareType {
  APPL = 1,
  BOOT = 2,
  OTHER = 3,
}
export const IFirmwareTypeName: { [T in IFirmwareType]: string } = {
  [IFirmwareType.APPL]: 'APPL',
  [IFirmwareType.BOOT]: 'BOOT',
  [IFirmwareType.OTHER]: '其它',
}

//分组类型
export enum IGroupType {
  SUMPACKAGE = 0,
  SUBPACKAGE = 1,
  OTHER = 2,
}

export const IGroupTypeName: { [T in IGroupType]: string } = {
  [IGroupType.SUMPACKAGE]: '总包',
  [IGroupType.SUBPACKAGE]: '分包',
  [IGroupType.OTHER]: '其它',
}

export enum ICmdType {
  ISSUED = 1,
  ACTIVE = 2,
  DEACTIVE = 3,
  ROLLBACK = 4,
}

export const ICmdTypeName: { [T in ICmdType]: string } = {
  [ICmdType.ISSUED]: '下发配置',
  [ICmdType.ACTIVE]: '激活配置',
  [ICmdType.DEACTIVE]: '去激活配置',
  [ICmdType.ROLLBACK]: '回滚配置',
}

export enum IViewMode {
  Thumb = '1',
  List = '2',
}

export const IViewModeName: { [T in IViewMode]: string } = {
  [IViewMode.Thumb]: '缩略图',
  [IViewMode.List]: '列表',
}

export enum IUpgradeType {
  MANUAL = '2',
  AUTO = '1',
}

export const IUpgradeTypeName: { [T in IUpgradeType]: string } = {
  [IUpgradeType.MANUAL]: '手动',
  [IUpgradeType.AUTO]: '自动',
}
export enum ITransformerType {
  DRY = 'DRY',
  OIL = 'OIL',
  SINGLE = 'SINGLE',
  TRIPHASE = 'TRIPHASE',
}

export const ITransformerTypeName: { [T in ITransformerType]: string } = {
  [ITransformerType.DRY]: '干式变压器',
  [ITransformerType.OIL]: '油浸式变压器',
  [ITransformerType.SINGLE]: '单相变压器',
  [ITransformerType.TRIPHASE]: '三相变压器',
}

export enum IVoltageLevel {
  V220 = 220,
  V380 = 380,
}

export const IVoltageLevelName: { [T in IVoltageLevel]: string } = {
  [IVoltageLevel.V220]: '220V',
  [IVoltageLevel.V380]: '380V',
}

export enum IelectricMeterType {
  TYPE1 = 1,
  TYPE2 = 2,
  TYPE3 = 3,
}
export const IelectricMeterTypeName: { [T in IelectricMeterType]: string } = {
  [IelectricMeterType.TYPE1]: '三相三线制',
  [IelectricMeterType.TYPE2]: '单相制',
  [IelectricMeterType.TYPE3]: '三相四线制',
}

export enum IWaterMeterType {
  TYPE1 = 1,
  TYPE2 = 2,
  TYPE3 = 3,
  TYPE4 = 4,
  TYPE5 = 5,
}
export const IWaterMeterTypeName: { [T in IWaterMeterType]: string } = {
  [IWaterMeterType.TYPE1]: '旋翼式液封水表',
  [IWaterMeterType.TYPE2]: '立式水表',
  [IWaterMeterType.TYPE3]: '水平螺翼式水表',
  [IWaterMeterType.TYPE4]: '远传水表',
  [IWaterMeterType.TYPE5]: '其他',
}

export enum IGasMeterType {
  TYPE1 = 1,
  TYPE2 = 2,
  TYPE3 = 3,
  TYPE4 = 4,
  TYPE5 = 5,
}
export const IGasMeterTypeName: { [T in IGasMeterType]: string } = {
  [IGasMeterType.TYPE1]: 'IC卡智能燃气表',
  [IGasMeterType.TYPE2]: '有线远传燃气表',
  [IGasMeterType.TYPE3]: '无线远传燃气表',
  [IGasMeterType.TYPE4]: '物联网膜式燃气表',
  [IGasMeterType.TYPE5]: '其他',
}

export enum IReportType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}
export const IReportTypeName: { [T in IReportType]: string } = {
  [IReportType.DAY]: '日报',
  [IReportType.WEEK]: '周报',
  [IReportType.MONTH]: '月报',
  [IReportType.QUARTER]: '季报',
  [IReportType.YEAR]: '年报',
}
export enum IRateType {
  TIP = 'tip',
  HIGHT = 'high',
  FLAT = 'flat',
  LOW = 'low',
}
export const IRateTypeName: { [T in IRateType]: string } = {
  [IRateType.TIP]: '尖',
  [IRateType.HIGHT]: '峰',
  [IRateType.FLAT]: '平',
  [IRateType.LOW]: '谷',
}
export enum IAttributeType {
  ELCREF = '1',
  ELCEGY = '2',
}
export const IAttributeTypeName: { [T in IAttributeType]: string } = {
  [IAttributeType.ELCREF]: '电参数',
  [IAttributeType.ELCEGY]: '电能',
}

export enum IPowerType {
  ACTIVE = 'activePower',
  REACTIVE = 'reactivePower',
}
export const IPowerTypeName: { [T in IPowerType]: string } = {
  [IPowerType.ACTIVE]: '有功功率',
  [IPowerType.REACTIVE]: '无功功率',
}

export enum IElectricType {
  ACURRENT = 'acurrent',
  BCURRENT = 'bcurrent',
  CCURRENT = 'ccurrent',
}
export const IElectricTypeName: { [T in IElectricType]: string } = {
  [IElectricType.ACURRENT]: 'A相电流',
  [IElectricType.BCURRENT]: 'B相电流',
  [IElectricType.CCURRENT]: 'C相电流',
}

export enum INodePlatformType {
  ECN = 1,
  ECM = 2,
  EMS = 3,
}

export const INodePlatformTypeName: { [T in INodePlatformType]: string } = {
  [INodePlatformType.ECN]: 'ECN',
  [INodePlatformType.ECM]: 'ECM',
  [INodePlatformType.EMS]: 'EMS',
}

export enum IMeterType {
  AMMETER = 0,
  WATERMETER = 1,
  GASMETER = 2,
}

export const IMeterTypeName: { [T in IMeterType]: string } = {
  [IMeterType.AMMETER]: '电表',
  [IMeterType.WATERMETER]: '水表',
  [IMeterType.GASMETER]: '燃气表',
}
