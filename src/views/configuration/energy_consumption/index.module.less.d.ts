declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    AddRateComponent: string
    cumson_table: string
    header: string
    headerRight: string
    operate_button: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
