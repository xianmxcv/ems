import { PrinterOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import React, { useState } from 'react'
import Print from 'react-to-print'

interface ICtxRef {
  current: React.ReactInstance | null
}

interface IProps {
  ctxParams: any
  ctxRef: ICtxRef
  text: React.ReactNode
  title?: string
}
const ReactToPrint = (props: IProps) => {
  const [ctxA4, setCtxA4] = useState<any>({
    width: 595,
    height: 842,
  })
  return (
    <>
      <Print
        pageStyle={`
        @page { 
          size: auto;
          margin-bottom: 0; 
        }
        .scale {
          zoom: ${ctxA4.width / props.ctxParams.width};
        }
      `}
        documentTitle={props.title}
        bodyClass={`scale`}
        trigger={() => (
          <Space>
            <PrinterOutlined />
            {props.text || '打印'}
          </Space>
        )}
        content={(): React.ReactInstance | null => props.ctxRef.current}
      />
    </>
  )
}

export default ReactToPrint
