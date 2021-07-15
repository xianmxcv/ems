import classNames from 'classnames'
import { omit } from 'lodash-es'
import React from 'react'
import './index.module.less'

export interface IconProps {
  type: string
  className?: string
  title?: string
  onClick?: React.MouseEventHandler<any>
  onMouseDown?: React.MouseEventHandler<any>
  onMouseOver?: React.MouseEventHandler<any>
  onMouseLeave?: React.MouseEventHandler<any>
  style?: React.CSSProperties
}

const IconFont = (props: IconProps) => {
  const { type, className = '' } = props
  const classString = classNames(
    {
      iconfont: true,
      [`icon-${type}`]: true,
    },
    className
  )
  return (
    <span className="anticon">
      <i {...omit(props, ['type'])} className={classString} />
    </span>
  )
}

export default IconFont
