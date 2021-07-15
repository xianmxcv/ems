declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    auto_acquisition: string
    auto_acquisition_col_1: string
    col_1: string
    col_2: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
