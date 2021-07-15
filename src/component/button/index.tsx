import { Button } from 'antd'
import { ButtonProps } from 'antd/lib/button/index'
import React from 'react'
import './index.module.less'
interface BaseButtonProps extends ButtonProps {
  othertype?: string //目前支持参数  success danger
}

const ButtonComponent = (props: BaseButtonProps) => {
  const { othertype } = props

  return (
    <Button {...props} className={othertype ? `other_${othertype}` : ''}>
      {props?.children}
    </Button>
  )
}

export default ButtonComponent
