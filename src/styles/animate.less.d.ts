declare namespace AnimateLessNamespace {
  export interface IAnimateLess {
    'faded-enter': string
    'faded-enter-active': string
    'faded-exit': string
    'faded-exit-active': string
  }
}

declare const AnimateLessModule: AnimateLessNamespace.IAnimateLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AnimateLessNamespace.IAnimateLess
}

export = AnimateLessModule
