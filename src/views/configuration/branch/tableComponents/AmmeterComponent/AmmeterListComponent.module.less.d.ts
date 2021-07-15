declare namespace AmmeterListComponentModuleLessNamespace {
  export interface IAmmeterListComponentModuleLess {
    other_button: string
  }
}

declare const AmmeterListComponentModuleLessModule: AmmeterListComponentModuleLessNamespace.IAmmeterListComponentModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AmmeterListComponentModuleLessNamespace.IAmmeterListComponentModuleLess
}

export = AmmeterListComponentModuleLessModule
