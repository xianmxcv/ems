declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    TableComponents: string
    actions: string
    divider: string
    ellipsis: string
    hide: string
    'operate-button': string
    region: string
    'site-tree-search-value': string
    tree: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
