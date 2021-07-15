declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    actions: string
    container: string
    ellipsis: string
    hide: string
    'site-tree-search-value': string
    tree: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
