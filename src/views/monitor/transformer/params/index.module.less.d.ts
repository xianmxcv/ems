declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    card: string
    cardContent: string
    cardList: string
    circle: string
    container: string
    ellipsis: string
    head: string
    label: string
    title: string
    value: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
