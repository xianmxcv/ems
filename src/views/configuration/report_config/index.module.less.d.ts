declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    configItem: string
    'operate-button': string
    reportConfig: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
