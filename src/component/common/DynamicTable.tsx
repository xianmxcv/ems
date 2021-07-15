import { Table } from 'antd'
import React from 'react'

const data = {
  labels: ['区域名称', '电箱编号', '序号', '支路名称', 'Uab(KV)', 'Uab1(KV)'],
  datasets: [
    {
      name: '办公区1',
      code: 'A1',
      index: '1',
      zname: '办公楼二楼插座',
      'Uab(KV)': 0.0,
      'Uab1(KV)': 0.0,
      rowSpan: 3,
    },
    {
      name: '办公区1',
      code: 'A2',
      index: '1',
      zname: '办公楼二楼插座',
      'Uab(KV)': 0.0,
    },
    {
      name: '办公区1',
      code: 'A3',
      index: '1',
      zname: '办公楼二楼插座',
      'Uab(KV)': 0.0,
    },
    {
      name: '办公区2',
      code: 'A4',
      index: '1',
      zname: '办公楼二楼插座',
      'Uab(KV)': 0.0,
      rowSpan: 3,
    },
    {
      name: '办公区2',
      code: 'A5',
      index: '1',
      zname: '办公楼二楼插座',
      'Uab(KV)': 0.0,
    },
    {
      name: '办公区2',
      code: 'A6',
      index: '1',
      zname: '办公楼二楼插座',
      'Uab(KV)': 0.0,
    },
    {
      name: '办公区3',
      code: 'A7',
      index: '1',
      zname: '办公楼二楼插座',
      'Uab(KV)': 0.0,
      rowSpan: 2,
    },
    {
      name: '办公区3',
      code: 'A8',
      index: '1',
      zname: '办公楼二楼插座',
      'Uab(KV)': 0.0,
    },
  ],
}

const columns = data.labels.map((item, index) => {
  if (index === 0) {
    return {
      title: item,
      dataIndex: Object.entries(data.datasets[0])[index][0],
      render: (value: any, row: any, index: any) => {
        const obj = {
          children: value,
          props: {} as any,
        }
        if (row.rowSpan) {
          obj.props.rowSpan = row.rowSpan
        } else {
          obj.props.rowSpan = 0
        }
        return obj
      },
    }
  }
  return {
    title: item,
    dataIndex: Object.entries(data.datasets[0])[index][0],
  }
})

const DTable = () => {
  return <Table dataSource={data.datasets} bordered columns={columns} />
}

export default DTable
