declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    TableComponents: string
    container: string
    cumson_table: string
    divider: string
    operate_button: string
    tree: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
