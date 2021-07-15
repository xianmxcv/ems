declare namespace IndexModuleLessNamespace {
  export interface IIndexModuleLess {
    content: string
    footer: string
    form: string
    img1: string
    left: string
    login: string
    loginbtn: string
    right: string
    text: string
    title: string
    verificationCode: string
  }
}

declare const IndexModuleLessModule: IndexModuleLessNamespace.IIndexModuleLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleLessNamespace.IIndexModuleLess
}

export = IndexModuleLessModule
