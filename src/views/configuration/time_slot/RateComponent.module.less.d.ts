declare namespace RateComponentModuleLessNamespace {
  export interface IRateComponentModuleLess {
    other_button: string
  }
}

declare const RateComponentModuleLessModule: RateComponentModuleLessNamespace.IRateComponentModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RateComponentModuleLessNamespace.IRateComponentModuleLess
}

export = RateComponentModuleLessModule
