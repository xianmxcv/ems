import {
  IReqBranch,
  IReqDepartment,
  IReqEnergyDeviceList,
  IReqRegionAndCircuit,
  IReqRegionAndCircuitPage,
  IReqTransformerPage,
  ILogin,
  IFormEnergyDevice,
  AddNoWorkDay,
  GetNoWorkDay,
  BaseRate,
  BaseRateFrom,
  GetCostPeriod,
  ElectricNameList,
  IReqTransformDetailPage,
  ElectricMeterHistory,
  ElectricMeterDetailSingle,
  ElectricMeterRealtime,
  IReqManualRecordPage,
  IReqAddManualRecordForm,
  IReqDeviceComsumption,
  IReqReport,
  IReqTransformerTrend,
  IReqDelRecord,
  IUpdatePassword,
} from '@/types/reqType'
import {
  IPageResponse,
  ITreeData,
  IResponse,
  IregionCircuitConditions,
  ITransformer,
  IReportConfig,
  IElectricMeter,
  IEcn,
  IAttrInfo,
  IResUseInfo,
  IResEnergyDevice,
  IResNoWorkDay,
  ElectricMeterAttrVO,
  IResElectricNameList,
  IResIElectricMeter,
  IResIElectricMeterPage,
  IResUserMenu,
  IDeviceConsumptionChart,
  IResIElectricMeterPageHistory,
  IDeviceConsumptionChartSort,
  IResDeviceConsumptionPage,
  IPageDynamicResponse,
  IResTrafficInfo,
  IRegionInfo,
  IResReport,
  IResHomeBranchConsumption,
  ITransformerParams,
  IResPowerTrend,
  IResElectricTrend,
  IResHomeEnergyConsumptionStatic,
  IResHomeCountDevice,
  IResHomeCountItem,
  IResHomeEnergyConsumption,
  EcDeviceList,
  IResHomeEnergyUsage,
  IResMeterList,
} from '@/types/resType'
import axios, { AxiosPromise } from 'axios'
import { commonConfig, downloadConfig } from './api.config'

axios.interceptors.request.use(
  function (config) {
    config.headers = {
      Authorization: sessionStorage.getItem('Authorization'),
      menuSource: 3,
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    return new Promise((resolve, reject) => {
      resolve(response)
    })
  },
  (error) => {
    return new Promise((resolve, reject) => {
      if (error.response && error.response.data) {
        reject(error.response.mesg + '\n' + error.response.data)
      } else {
        reject(error.message)
      }
    })
  }
)

const api = {
  //导出文件
  downloadFile: (url: string): AxiosPromise<any> => axios.get(url, downloadConfig),
  downloadFilePost: (url: string, params: any): AxiosPromise<any> =>
    axios.post(url, params, downloadConfig),
  getUserMenu: (): AxiosPromise<IResUserMenu[]> =>
    axios.get('/organization/menu/user-menu', commonConfig),
  // 登陆
  login: (params: ILogin): AxiosPromise<IResUseInfo> =>
    axios.post('/organization/user/login', params, commonConfig),
  logOut: (): AxiosPromise<IResponse<boolean>> => axios.get('/organization/user/logout'),
  // 修改密码
  updatePassword: (params: IUpdatePassword): AxiosPromise<IResUseInfo> =>
    axios.put('/organization/user/password', params, commonConfig),
  // 支路信息维护列表
  getBranchList: (): AxiosPromise<ITreeData[]> => axios.get('/energy-config/circuit', commonConfig),
  // 支路树能耗管理信息维护列表
  getBranchEnergyConsumptionList: (): AxiosPromise<ITreeData[]> =>
    axios.get('/energy-config/reportCircuit/tree', commonConfig),
  // 支路信息维护
  putBranch: (params: IReqBranch): AxiosPromise<null> =>
    axios.put('/energy-config/circuit', params, commonConfig),
  // 支路信息维护
  postBranch: (params: IReqBranch): AxiosPromise<null> =>
    axios.post('/energy-config/circuit', params, commonConfig),
  // 支路信息维护
  delBranch: (params: IReqBranch): AxiosPromise<null> =>
    axios.delete(`/energy-config/circuit/${params.ecId}`, commonConfig),
  // 部门信息维护
  getDepartmentList: (): AxiosPromise<ITreeData[]> =>
    axios.get('/energy-config/department', commonConfig),
  // 部门信息维护
  putDepartment: (params: IReqDepartment): AxiosPromise<null> =>
    axios.put('/energy-config/department', params, commonConfig),
  // 部门信息维护
  postDepartment: (params: IReqDepartment): AxiosPromise<null> =>
    axios.post('/energy-config/department', params, commonConfig),
  // 部门信息维护 department
  delDepartment: (params: string): AxiosPromise<null> =>
    axios.delete(`/energy-config/department/${params}`, commonConfig),
  // 重点耗能设备列表
  postEnergyDeviceList: (
    params: IReqEnergyDeviceList
  ): AxiosPromise<IPageResponse<IResEnergyDevice>> =>
    axios.post(`/energy-config/energy-device/conditions`, params, commonConfig),
  // 新增重点耗能设备
  postEnergyDevice: (params: IFormEnergyDevice): AxiosPromise<null> =>
    axios.post(`/energy-config/energy-device`, params, commonConfig),
  // 获取区域信息树
  getRegionList: (params?: any): AxiosPromise<ITreeData[]> => {
    let type = ''
    if (params) {
      type = `?type=${params}`
    } else {
      type = `?type=0`
    }
    return axios.get(`/energy-config/region${type}`, commonConfig)
  },
  // 修改区域信息树
  putRegion: (params: any): AxiosPromise<IResponse<any>> =>
    axios.put('/energy-config/region', params, commonConfig),
  // 新增区域信息树
  postRegion: (params: any): AxiosPromise<IResponse<any>> =>
    axios.post('/energy-config/region', params, commonConfig),
  // 删除区域信息树
  delRegion: (params: string): AxiosPromise<IResponse<any>> =>
    axios.delete(`/energy-config/region/${params}`, commonConfig),
  //根据条件查询区域与支路关系列表（分页）
  getRegionCircuitConditions: (
    params: IReqRegionAndCircuitPage
  ): AxiosPromise<IPageResponse<IregionCircuitConditions>> =>
    axios.post('/energy-config/region/circuit/conditions', params, commonConfig),
  //新增区域与支路关系
  addRegionCircuit: (params: IReqRegionAndCircuit): AxiosPromise<IResponse<any>> =>
    axios.post(`/energy-config/region/circuit`, params, commonConfig),
  //修改区域与支路关系
  putRegionCircuit: (params: IReqRegionAndCircuit): AxiosPromise<IResponse<any>> =>
    axios.put(`/energy-config/region/circuit`, params, commonConfig),
  // 删除区域信息树
  delRegionCircuit: (params: string): AxiosPromise<null> =>
    axios.delete(`/energy-config/region/circuit/${params}`, commonConfig),
  // 编辑重点耗能设备
  putEnergyDevice: (params: IFormEnergyDevice): AxiosPromise<IResponse<any>> =>
    axios.put(`/energy-config/energy-device`, params, commonConfig),
  // 删除重点耗能设备
  delEnergyDevice: (params: string): AxiosPromise<IResponse<any>> =>
    axios.delete(`/energy-config/energy-device?ids=${params}`, commonConfig),
  // 查询指定重点耗能设备
  getEnergyDeviceDetail: (params: string): AxiosPromise<EcDeviceList[]> =>
    axios.get(`/energy-config/energy-device/${params}`, commonConfig),
  // 根据区域ID获取支路树
  getBranch: (params: any): AxiosPromise<any> =>
    axios.get(`/energy-config/circuit/${params.regionId}`, commonConfig),
  // 根据区域ID获取部门树
  getDepartment: (params: any): AxiosPromise<any> =>
    axios.get(`/energy-config/department/${params.regionId}`, commonConfig),
  //分页查询变压器信息
  getTransformerList: (params: IReqTransformerPage): AxiosPromise<IPageResponse<ITransformer>> =>
    axios.post(`/energy-config/transformer/page`, params, commonConfig),
  //分页查询变压器信息
  getTfList: (inputName?: string): AxiosPromise<Array<ITransformer>> =>
    axios.get(`/energy-config/transformer/tfName`, commonConfig),
  //新增变压器信息
  addTransformer: (params: ITransformer): AxiosPromise<null> =>
    axios.post(`/energy-config/transformer/add`, params, commonConfig),
  //修改变压器信息
  editTransformer: (params: ITransformer): AxiosPromise<null> =>
    axios.put(`/energy-config/transformer/update`, params, commonConfig),
  //变压器信息详情查看
  getTransformerInfo: (params: string): AxiosPromise<ITransformer> =>
    axios.get(`/energy-config/transformer/info/${params}`, commonConfig),
  //删除变压器信息
  delTransformerInfo: (params: string): AxiosPromise<null> =>
    axios.delete(`/energy-config/transformer/delete/${params}`, commonConfig),
  //报表配置分页
  getReportConfigPage: (params: IReqTransformerPage): AxiosPromise<IPageResponse<IReportConfig>> =>
    axios.post(`/energy-config/meterReadConfig/manul/page`, params, commonConfig),
  //新增报表配置
  addReportConfig: (params: IReportConfig): AxiosPromise<null> =>
    axios.post(`/energy-config/meterReadConfig/manul/add`, params, commonConfig),
  //修改报表配置
  editReportConfig: (params: IReportConfig): AxiosPromise<null> =>
    axios.put(`/energy-config/meterReadConfig/manul/update`, params, commonConfig),
  //修改报表配置开启状态
  editReportConfigStatus: (params: IReportConfig): AxiosPromise<null> =>
    axios.put(`/energy-config/meterReadConfig/manul/switch`, params, commonConfig),
  //删除报表配置
  deleteReportConfig: (params: string): AxiosPromise<null> =>
    axios.delete(`/energy-config/meterReadConfig/manul/${params}`, commonConfig),
  //查询电表列表（分页）
  getElectricMeterPage: (
    params: IReqTransformerPage
  ): AxiosPromise<IPageResponse<IElectricMeter>> =>
    axios.post(`/energy-config/electric-meter/page`, params, commonConfig),
  getReportConfigTypes: (): AxiosPromise<any> =>
    axios.get(`/energy-config/meterReadConfig/types`, commonConfig),
  editReportConfigTypes: (params: any): AxiosPromise<null> =>
    axios.put(`/energy-config/meterReadConfig/types`, params, commonConfig),
  //新增电表
  addElectricMeter: (params: IElectricMeter): AxiosPromise<null> =>
    axios.post(`/energy-config/electric-meter`, params, commonConfig),
  //新增电表
  editElectricMeter: (params: IElectricMeter): AxiosPromise<null> =>
    axios.put(`/energy-config/electric-meter`, params, commonConfig),
  //查询当前用户所在租户的电表名称列表
  getEmNameList: (): AxiosPromise<Array<IEcn>> =>
    axios.get(`/energy-config/electric-meter/emNameList`, commonConfig),
  //删除电表
  delElectricMeter: (params: string): AxiosPromise<null> =>
    axios.delete(`/energy-config/electric-meter/${params}`, commonConfig),
  //查询电表详情
  getElectricMeterInfo: (params: string): AxiosPromise<IAttrInfo[]> =>
    axios.get(
      `/energy-config/electric-meter?emId=${params.split('-')[0]}&attrName=${params.split('-')[1]}`,
      commonConfig
    ),
  // 查询时间维护信息列表（分页）
  postCostPeriod: (params: GetCostPeriod): AxiosPromise<any> =>
    axios.post(`/energy-config/cost-period/conditions`, params, commonConfig),
  // 根据区域ID判断是否已经存在费率
  getCostPeriodRegionId: (regionId: string): AxiosPromise<any> =>
    axios.get(`/energy-config/cost-period/${regionId}`, commonConfig),
  // 批量删除多个时间维护信息
  delCostPeriod: (params: string): AxiosPromise<null> =>
    axios.delete(`/energy-config/cost-period?ids=${params}`, commonConfig),
  // 新增时间维护信息列表
  addCostPeriod: (params: BaseRate[]): AxiosPromise<null> =>
    axios.post(`/energy-config/cost-period`, params, commonConfig),
  // bianji时间维护信息列表
  putCostPeriod: (params: BaseRateFrom): AxiosPromise<null> =>
    axios.put(`/energy-config/cost-period`, params, commonConfig),
  // 新增非工作日信息
  addNoWork: (params: AddNoWorkDay): AxiosPromise<null> =>
    axios.post(`/energy-config/no-work`, params, commonConfig),
  // 获取非工作日信息
  postNoWork: (params: GetNoWorkDay): AxiosPromise<IResNoWorkDay[]> =>
    axios.post(`/energy-config/no-work/list`, params, commonConfig),
  // 删除非工作日信息
  delNoWork: (params: string): AxiosPromise<any> =>
    axios.delete(`/energy-config/no-work?id=${params}`, commonConfig),
  // 查询电能分项
  getEnergyItem: (): AxiosPromise<any> =>
    axios.get(`/energy-config/energy-device/item`, commonConfig),
  // 查询电表列表
  getElectricMeterList: (
    params: IReqTransformerPage
  ): AxiosPromise<IPageResponse<IElectricMeter>> =>
    axios.post(`/energy-config/electric-meter/page`, params, commonConfig),
  // 查询指定电表参数详情
  getElectricMeterDetail: (
    params: IReqTransformDetailPage
  ): AxiosPromise<IPageResponse<ElectricMeterAttrVO>> =>
    axios.post(`/energy-config/electric-meter/attrList`, params, commonConfig),
  // 查询当前用户所在租户的在ems系统中电表名称列表
  getElectricNameList: (params: ElectricNameList): AxiosPromise<IResElectricNameList[]> => {
    let qs = ''
    if (params.emName) {
      qs = `?emName=${params.emName}`
    }
    return axios.get(`/energy-config/electric-meter/nameList${qs}`, commonConfig)
  },
  getMeterList: (params: ElectricNameList): AxiosPromise<IResMeterList[]> =>
    axios.post('/energy-config/electric-meter/meter-type/list', params, commonConfig),
  // 【抄表管理】分页查询历史数据
  getElectricMeterHistory: (params: ElectricMeterHistory): AxiosPromise<IPageResponse<any>> =>
    axios.post(`/energy-config/electric-meter/history`, params, commonConfig),
  // 查询指定电表参数详情
  getElectricMeterDetailSingle: (
    params: ElectricMeterDetailSingle
  ): AxiosPromise<IResIElectricMeter> =>
    axios.get(`/energy-config/electric-meter/${params.emId}`, commonConfig),
  // 【抄表管理】 保存用户想要查询电表实时数据的条件
  postElectricMeterRealtime: (params: ElectricMeterRealtime): AxiosPromise<IPageResponse<any>> =>
    axios.post(`/energy-config/electric-meter/realtime`, params, commonConfig),
  // 手动录入
  postManualRecord: (
    params: IReqAddManualRecordForm
  ): AxiosPromise<IPageResponse<IResIElectricMeterPageHistory>> =>
    axios.post(`/energy-config/manual_record`, params, commonConfig),
  // 查询手动抄表记录（分页）
  postManualRecordPage: (
    params: IReqManualRecordPage
  ): AxiosPromise<IPageResponse<IResIElectricMeterPage>> =>
    axios.post(`/energy-config/manual_record/page`, params, commonConfig),
  // 【能耗管理】设备与支路树结构
  getReportDeviceTree: (): AxiosPromise<ITreeData[]> =>
    axios.get('/energy-config/reportDevice/tree', commonConfig),
  //【能耗管理】获取设备能耗统计图表
  getDeviceConsumptionChart: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IDeviceConsumptionChart> =>
    axios.post('/energy-config/reportDevice/charts', params, commonConfig),
  //【能耗管理】获取设备能耗统计图表
  getDeviceConsumptionChartSort: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IDeviceConsumptionChartSort> =>
    axios.post('/energy-config/reportDevice/charts/sort', params, commonConfig),
  //【能耗管理】获取设备能耗费率时段统计
  getDeviceConsumptionCostChart: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IDeviceConsumptionChartSort> =>
    axios.post('/energy-config/reportDevice/charts/cost', params, commonConfig),
  //【能耗管理】设备能耗统计(分页)
  getDeviceConsumptionPage: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IPageDynamicResponse<IResDeviceConsumptionPage>> =>
    axios.post('/energy-config/reportDevice/page', params, commonConfig),

  //【能耗管理】获取支路能耗统计图表
  getBranchConsumptionChart: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IDeviceConsumptionChart> =>
    axios.post('/energy-config/reportCircuit/charts', params, commonConfig),
  //【能耗管理】获取支路能耗统计图表
  getBranchConsumptionChartSort: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IDeviceConsumptionChartSort> =>
    axios.post('/energy-config/reportCircuit/charts/sort', params, commonConfig),
  //【能耗管理】获取支路能耗费率时段统计
  getBranchConsumptionCostChart: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IDeviceConsumptionChartSort> =>
    axios.post('/energy-config/reportCircuit/charts/cost', params, commonConfig),
  //【能耗管理】设备支路统计(分页)
  getBranchConsumptionPage: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IPageDynamicResponse<IResDeviceConsumptionPage>> =>
    axios.post('/energy-config/reportCircuit/page', params, commonConfig),

  // 【能耗管理】设备与支路树结构
  getReportItemTree: (): AxiosPromise<ITreeData[]> =>
    axios.get('/energy-config/reportItem/tree', commonConfig),
  //【能耗管理】获取设备能耗统计图表
  getItemConsumptionChart: (params: IReqDeviceComsumption): AxiosPromise<IDeviceConsumptionChart> =>
    axios.post('/energy-config/reportItem/charts', params, commonConfig),
  //【能耗管理】获取设备能耗统计图表
  getItemConsumptionChartSort: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IDeviceConsumptionChartSort> =>
    axios.post('/energy-config/reportItem/charts/sort', params, commonConfig),
  //【能耗管理】获取设备能耗费率时段统计
  getItemConsumptionCostChart: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IDeviceConsumptionChartSort> =>
    axios.post('/energy-config/reportItem/charts/cost', params, commonConfig),
  //【能耗管理】设备能耗统计(分页)
  getItemConsumptionPage: (
    params: IReqDeviceComsumption
  ): AxiosPromise<IPageDynamicResponse<IResDeviceConsumptionPage>> =>
    axios.post('/energy-config/reportItem/page', params, commonConfig),
  // 电能报表 设备日
  getReportEnergy: (params: IReqReport): AxiosPromise<IResReport> =>
    axios.post('/energy-config/reportEnergy/device', params, commonConfig),

  // 实时监控
  // 通讯状态监控
  getTrafficStatusData: (
    regionId?: string,
    sequence?: string
  ): AxiosPromise<Array<IResTrafficInfo>> =>
    axios.get(`/energy-config/communication-monitor/${regionId}/${sequence}`, commonConfig),
  // 区域信息
  getRegionData: (): AxiosPromise<Array<IRegionInfo>> =>
    axios.get('/energy-config/communication-monitor', commonConfig),

  // 变压器监测-变压器参数信息
  getTransformerParams: (id: string): AxiosPromise<Array<ITransformerParams>> =>
    axios.post(`/energy-config/transformer/listAttr`, { transformerId: id }, commonConfig),
  // 实时查看变压器电流趋势
  getElectricTrend: (params: IReqTransformerTrend): AxiosPromise<IResElectricTrend[]> =>
    axios.post(`/energy-config/transformer/electricityStatistics`, params, commonConfig),
  // 实时查看变压器功率趋势
  getPowerTrend: (params: IReqTransformerTrend): AxiosPromise<IResPowerTrend[]> =>
    axios.post(`/energy-config/transformer/powerStatistics`, params, commonConfig),

  getReportCircuit: (params: IReqReport): AxiosPromise<IResReport> =>
    axios.post('/energy-config/reportEnergy/circuit', params, commonConfig),
  // 支路报表 设备日
  getReportCostCircuit: (params: IReqReport): AxiosPromise<IResReport> =>
    axios.post('/energy-config/reportCost/circuit', params, commonConfig),
  // 能耗设备报表
  getReportCostDevice: (params: IReqReport): AxiosPromise<IResReport> =>
    axios.post('/energy-config/reportCost/device', params, commonConfig),
  // 能耗设备 tree
  getReporDeviceTree: (): AxiosPromise<ITreeData[]> =>
    axios.get('/energy-config/reportDevice/tree', commonConfig),
  // 支路报表 tree
  getReportCircuitTree: (): AxiosPromise<ITreeData[]> =>
    axios.get('/energy-config/reportCircuit/tree', commonConfig),
  /**
   * 首页
   */
  //获取首页支路耗损TOP5
  getHomeBranchConsumption: (dateType: number): AxiosPromise<IResHomeBranchConsumption[]> =>
    axios.get(`/energy-config/home-page/consume/${dateType}`, commonConfig),
  //dashboard中用能情况
  getHomeEnergyConsumptionStatic: (
    dateType: string
  ): AxiosPromise<IResHomeEnergyConsumptionStatic[]> =>
    axios.get(`/energy-config/home-page/countEnergy?dateType=${dateType}`, commonConfig),
  //dashboard中设备情况
  getHomeDeviceInfo: (params: string): AxiosPromise<IResHomeCountDevice> =>
    axios.get(
      `/energy-config/home-page/countDevice?ecId=${params.split('!')[0]}&queryDate=${
        params.split('!')[1]
      }`,
      commonConfig
    ),
  //dashboard中分项用能占比
  getHomeCountItem: (dateType: string): AxiosPromise<IResHomeCountItem[]> =>
    axios.get(`/energy-config/home-page/countItem?dateType=${dateType}`, commonConfig),
  //dashboard中用电情况
  getHomeEnergyConsumption: (): AxiosPromise<IResHomeEnergyConsumption> =>
    axios.get(`/energy-config/home-page/countUsageElectric`, commonConfig),
  // dashboard中水电气分项用能情况
  getHomeEnergyUsage: (dateType: string): AxiosPromise<Array<IResHomeEnergyUsage>> =>
    axios.get(`/energy-config/home-page/energyusage/${dateType}`, commonConfig),
  // 电参量报表
  getReportParams: (params: any): AxiosPromise<any> =>
    axios.post('/energy-config/reportParams', params, commonConfig),
  // 删除抄表记录
  delManualRecord: (params: IReqDelRecord): AxiosPromise<any> =>
    axios.delete(`/energy-config/manual_record/${params.emId}/${params.mrecTime}`, commonConfig),
}

export default api
