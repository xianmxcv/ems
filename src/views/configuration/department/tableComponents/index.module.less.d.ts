declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    'ant-badge-status': string
    calendar_noworkday: string
    calendar_workday: string
    day: string
    ellipsis: string
    events: string
    noworkday: string
    open_add_rate_1: string
    open_add_rate_2: string
    open_add_rate_3: string
    other_calendar: string
    other_picker_range: string
    right_border: string
    textBg: string
    workday: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
