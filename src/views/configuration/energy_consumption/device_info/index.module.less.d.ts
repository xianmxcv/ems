declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    other_ant_form_item_explain: string
    'view-modal': string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule