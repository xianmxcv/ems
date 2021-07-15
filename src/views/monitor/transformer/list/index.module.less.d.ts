declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    disabled: string
    item: string
    list: string
    listContent: string
    name: string
    selected: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
