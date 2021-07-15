declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    ElectricityConsumption: string
    ElectricityConsumption_Card: string
    ElectricityConsumption_height: string
    ElectricityConsumption_height_33: string
    TableComponents: string
    actions: string
    'ant-table-body': string
    dashboard: string
    deviceInfo: string
    deviceInfoImg: string
    deviceInfoLabel: string
    deviceInfoValue: string
    deviceInfo_box: string
    deviceInfo_box_1: string
    deviceInfo_flex: string
    divider: string
    eleConsumptionItem: string
    ellipsis: string
    hide: string
    'operate-button': string
    'site-tree-search-value': string
    tree: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
