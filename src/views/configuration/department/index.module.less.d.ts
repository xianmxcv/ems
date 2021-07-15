declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    TableComponents: string
    actions: string
    container: string
    cumson_table: string
    divider: string
    ellipsis: string
    hide: string
    operate_button: string
    'site-tree-search-value': string
    tree: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
