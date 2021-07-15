declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    AddRateComponent: string
    'operate-button': string
    transformer: string
    'view-modal': string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
