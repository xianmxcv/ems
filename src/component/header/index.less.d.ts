declare namespace IndexLessNamespace {
  export interface IIndexLess {
    container: string
    content: string
    left: string
    menus: string
    meun_left: string
    meun_right: string
    time: string
    title: string
    weather: string
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess
}

export = IndexLessModule
