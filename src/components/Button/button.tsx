/** @format */

import React, {FC} from 'react'
import {Button as AntButton} from 'antd'
import {ButtonProps} from 'antd/lib/button/index'

export interface BtnProps extends ButtonProps {
  status: number
}

const Button: FC<BtnProps> = props => {
  const {children, status} = props

  if (typeof status == 'string') {
    console.error('Warning: status can not be a string')
  }

  return (
    <div>
      <AntButton {...props}>{children && children}</AntButton>
    </div>
  )
}

export default Button
