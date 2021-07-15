import api from '@/service/api'
import { IResPowerTrend, ITransformer } from '@/types/resType'
import { DualAxes } from '@ant-design/charts'
import { message, Spin } from 'antd'
import moment from 'moment'
import { Moment } from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'
import React, { useContext, useEffect, useState } from 'react'
import { ParmasContext } from '..'

let interval: any
const num = 5

const RealTimePower = ({
  dates,
  selected,
}: {
  dates?: RangeValue<Moment>
  selected?: ITransformer
}) => {
  const [data, setData] = useState<Array<IResPowerTrend>>([])
  const [units, setUnits] = useState<{ aUnit: string; rUnit: string }>()

  const propParams: any = useContext(ParmasContext)

  useEffect(() => {
    const aUnit = propParams?.['有功功率']?.split(' ')[1] || ''
    const rUnit = propParams?.['无功功率']?.split(' ')[1] || ''
    setUnits({
      aUnit,
      rUnit,
    })
  }, [propParams])

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
          transformerId: selected?.tfId as string,
          timeStart: dates ? moment(dates[0]).startOf('date').format('YYYY-MM-DD') : undefined,
          timeEnd: dates ? moment(dates[1]).endOf('date').format('YYYY-MM-DD') : undefined,
        }
        const res = await api.getPowerTrend(params)
        if (res) {
          setData(res.data)
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
  }, [dates, propParams, selected?.tfId])

  const config: any = {
    data: [data, data],
    xField: 'collectDate',
    smooth: true,
    yField: ['activePower', 'reactivePower'],
    meta: {
      activePower: {
        alias: `有功功率(${units?.aUnit})`,
      },
      reactivePower: {
        alias: `无功功率(${units?.rUnit})`,
      },
    },
    animation: false,
    yAxis: {
      activePower: {
        tickCount: 5,
        min: 0,
        label: {
          formatter: (v: string) => ''.concat(v, ` ${units?.aUnit}`),
        },
      },
      reactivePower: {
        tickCount: 5,
        min: 0,
        label: {
          formatter: (v: string) => ''.concat(v, ` ${units?.rUnit}`),
        },
      },
    },
    xAxis: { tickCount: 6 },
    legend: { position: 'bottom', offsetY: 10 },
  }

  return (
    <div style={{ width: '100%' }}>
      <DualAxes {...config} />
    </div>
  )
}

export default RealTimePower
