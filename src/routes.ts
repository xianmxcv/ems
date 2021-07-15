import Ammeter from './views/configuration/ammeter'
import Branch from './views/configuration/branch'
import Department from './views/configuration/department'
import EnergyConsumption from './views/configuration/energy_consumption'
import Region from './views/configuration/region'
import ReportConfig from './views/configuration/report_config'
import TimeSlot from './views/configuration/time_slot'
import Transformer from './views/configuration/transformer'
import Dashboard from './views/dashboard'
import BranchEnergy from './views/energy_consumption/branch'
import DeviceEnergy from './views/energy_consumption/device'
import SubitemEnergy from './views/energy_consumption/subitem'
import AutoAcquisition from './views/meter_reading/auto_acquisition'
import ManualInput from './views/meter_reading/manual_input'
import PowerMonitor from './views/monitor/power'
import TrafficStatusMonitor from './views/monitor/traffic_status'
import TransformerMonitor from './views/monitor/transformer'
import ElectricEnergyReport from './views/report_management/electric_energy_report'
import ElectricParameterReport from './views/report_management/electric_parameter_report'
import ElectricityBill from './views/report_management/electricity_bill'

export interface IRoute {
  name: string
  path: string
  component?: () => JSX.Element
  layout?: string
  more?: boolean
  icon?: any
  children?: IRoute[]
}

const routes: IRoute[] = [
  {
    path: '/main/homepage',
    name: '系统首页',
    icon: 'shouye',
    layout: '/main',
    children: [
      {
        path: '/main/homepage/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        component: Dashboard,
      },
    ],
  },
  {
    path: '/main/monitor',
    name: '实时监控',
    icon: 'shishijiankong',
    layout: '/main',
    children: [
      {
        path: '/main/monitor/power',
        name: '配电监测',
        icon: 'peidiangui',
        component: PowerMonitor,
      },
      {
        path: '/main/monitor/transformer',
        name: '变压器监测',
        icon: 'bianyaqi',
        component: TransformerMonitor,
      },
      {
        path: '/main/monitor/traffic_status',
        name: '通讯状态监测',
        icon: 'zuoce-tongxun',
        component: TrafficStatusMonitor,
      },
    ],
  },
  {
    path: '/main/report',
    name: '报表管理',
    icon: 'baobiaoguanli',
    layout: '/main',
    children: [
      {
        path: '/main/report/power',
        name: '电能报表',
        icon: 'diannengshishi',
        component: ElectricParameterReport,
      },
      {
        path: '/main/report/electric_parameter',
        name: '电参量报表',
        icon: 'canshu',
        component: ElectricEnergyReport,
      },
      {
        path: '/main/report/electric_charge',
        name: '电费清单',
        icon: 'qingdan',
        component: ElectricityBill,
      },
    ],
  },
  {
    path: '/main/energy_consumption',
    name: '能耗管理',
    icon: 'nengyuannenghaoguanli',
    layout: '/main',
    children: [
      {
        path: '/main/energy_consumption/device',
        name: '设备能耗',
        icon: 'shebei',
        component: DeviceEnergy,
      },
      {
        path: '/main/energy_consumption/branch',
        name: '支路能耗',
        icon: 'zhilushezhi',
        component: BranchEnergy,
      },
      {
        path: '/main/energy_consumption/discipline',
        name: '分项能耗',
        icon: 'fenxiangliebiao',
        component: SubitemEnergy,
      },
    ],
  },
  {
    path: '/main/meter_reading',
    name: '抄表管理',
    icon: 'chaobiaoguanli1',
    layout: '/main',
    children: [
      {
        path: '/main/meter_reading/auto_acquisition',
        name: '自动采集',
        icon: 'zidong',
        component: AutoAcquisition,
      },
      {
        path: '/main/meter_reading/manual_input',
        name: '手动录入',
        icon: 'shoudongbiaozhu',
        component: ManualInput,
      },
    ],
  },
  {
    path: '/main/configuration',
    name: '配置管理',
    icon: 'peizhiguanli',
    layout: '/main',
    children: [
      {
        path: '/main/configuration/branch',
        name: '支路信息维护',
        icon: 'zhilushezhi',
        component: Branch,
      },
      {
        path: '/main/configuration/region',
        name: '区域信息维护',
        icon: 'quyuxinxi',
        component: Region,
        // children: [
        //   {
        //     path: '/main/configuration/region/add',
        //     name: '新增',
        //     icon: DashboardOutlined,
        //     component: Notification,
        //   },
        // ],
      },
      {
        path: '/main/configuration/department',
        name: '部门信息维护',
        icon: 'bumenkaoqin',
        component: Department,
      },
      {
        path: '/main/configuration/transformer',
        name: '变压器信息维护',
        icon: 'bianyaqi',
        component: Transformer,
      },
      {
        path: '/main/configuration/energy_consumption',
        name: '重点耗能设备',
        icon: 'shebei',
        component: EnergyConsumption,
      },
      {
        path: '/main/configuration/ammeter',
        name: '表信息维护',
        icon: 'dianbiao',
        component: Ammeter,
      },
      {
        path: '/main/configuration/time_slot',
        name: '时间块维护',
        icon: 'shijian',
        component: TimeSlot,
      },
      {
        path: '/main/configuration/report_config',
        name: '报表设置',
        icon: 'shezhi',
        component: ReportConfig,
      },
    ],
  },
  {
    path: '/main/more',
    name: '...更多',
    icon: '',
    layout: '/main',
    more: true,
    children: [
      {
        path: '/main/more/other',
        name: '...更多',
        icon: '',
      },
    ],
  },
]

export default routes
