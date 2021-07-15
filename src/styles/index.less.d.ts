declare namespace IndexLessNamespace {
  export interface IIndexLess {
    container: string
    page: string
    'page-enter': string
    'page-enter-active': string
    'page-exit': string
    'page-exit-active': string
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess
}

export = IndexLessModule
