import api from '@/service/api'
import { ITransformer } from '@/types/resType'
import { Line } from '@ant-design/charts'
import { message, Spin } from 'antd'
import moment from 'moment'
import { Moment } from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'
import React, { useContext, useEffect, useState } from 'react'
import { ParmasContext } from '..'

let interval: any
const num = 5

const RealTimeElectric = ({
  dates,
  selected,
}: {
  dates?: RangeValue<Moment>
  selected?: ITransformer
}) => {
  const [data, setData] = useState<Array<{ label: string; date: string; value: number }>>([])

  useEffect(() => {
    if (!selected?.tfId) {
      return
    }

    if (interval) {
      clearInterval(interval)
    }

    const fetch = async () => {
      try {
        const params = {
          transformerId: selected?.tfId,
          timeStart: dates ? moment(dates[0]).startOf('date').format('YYYY-MM-DD') : undefined,
          timeEnd: dates ? moment(dates[1]).endOf('date').format('YYYY-MM-DD') : undefined,
        }
        const res = await api.getElectricTrend(params as any)
        if (res) {
          const datalist: Array<{ label: string; date: string; value: number }> = []
          res.data.forEach((item) => {
            datalist.push({
              label: 'A相电流(A)',
              value: item.acurrent,
              date: item.collectDate,
            })
            datalist.push({
              label: 'B相电流(A)',
              value: item.bcurrent,
              date: item.collectDate,
            })
            datalist.push({
              label: 'C相电流(A)',
              value: item.ccurrent,
              date: item.collectDate,
            })
          })
          setData(datalist)
        }
      } catch (err) {
        message.error(err)
      }
    }
    fetch()

    interval = setInterval(() => {
      fetch()
    }, num * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [dates, selected?.tfId])

  const config: any = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'label',
    smooth: true,
    color: ['#5AD8A6', '#5B8FF9', '#FAA219'],
    legend: { position: 'bottom', offsetY: 10 },
    yAxis: {
      label: {
        formatter: function formatter(v: string) {
          return ''.concat(v, ' A')
        },
      },
    },
    xAxis: { tickCount: 6 },
    animation: false,
  }

  return (
    <div style={{ width: '100%' }}>
      <Line {...config} />
    </div>
  )
}

export default RealTimeElectric
