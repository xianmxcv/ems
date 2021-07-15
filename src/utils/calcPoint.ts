import changxianJson from '@/assets/topology/trafficStatus/changxian.json'
import peidianxiangJson from '@/assets/topology/trafficStatus/peidianxiang.json'
import shebeiJson from '@/assets/topology/trafficStatus/shebei.json'
import { IThingStatus, IThingStatusName } from '@/types/common'
import { IResTrafficInfo } from '@/types/resType'

const distanceX = 160 // 设备间距
let distanceY = 100 // 产线间距

export const DevStatusColor = {
  normal: '#42750e',
  exception: '#ff0000',
  timeout: '#ffffffa6',
}

export const calcPoint = (apiDatas: Array<IResTrafficInfo>) => {
  const maxLength = apiDatas
    .map((item) => item.meterList?.length)
    .sort()
    .splice(-1)[0]

  let pens: any[] = peidianxiangJson.pens.map((item: any) => {
    return {
      ...item,
      image: item.imageName && require(`@/assets/images/topology/${item.imageName}.svg`).default,
      to:
        item.id === 'downLine' && apiDatas.length > 4
          ? {
              ...item.to,
              y: 602 + (apiDatas.length - 5) * 100,
            }
          : item.to,
    }
  })

  let devicesIndex = 1
  apiDatas.forEach((data, index) => {
    if (!data.meterList) {
      return
    }
    const pen = changxianJson.pens.map((item: any, _index) => {
      if (item.name === 'line' && item.from && item.to) {
        const maxLine = item.from.x + maxLength * 180
        item = {
          ...item,
          from: {
            ...item.from,
            y: item.from.y + index * distanceY,
          },
          to: {
            ...item.to,
            y: item.to.y + index * distanceY,
            x: item.uuid === 'xLine' ? (maxLine > 1800 ? maxLine : 1800) : item.to.x,
          },
        }
      } else if (item.rect) {
        item = {
          ...item,
          rect: {
            ...item.rect,
            y: item.rect.y + index * distanceY,
            center: {
              ...item.rect.center,
              y: item.rect.center.y + index * distanceY,
            },
            ey: item.rect.ey + index * distanceY,
          },
          image:
            item.imageName && require(`@/assets/images/topology/${item.imageName}.svg`).default,
        }
      }
      return item.needUpdate === 'productionLineName'
        ? {
            ...item,
            text: data.label.length > 4 ? data.label.slice(0, 5) + '...' : data.label,
            title: data.label,
            id: `${item.id}00${index + 1}`,
          }
        : {
            ...item,
            id: `${item.id}00${index + 1}`,
          }
    })
    pens = [...pens, ...pen]

    data.meterList.forEach((child, _index) => {
      const pen = shebeiJson.pens.map((item) => {
        // 线条位置
        if (item.name === 'polyline' && item.from && item.to) {
          item = {
            ...item,
            from: {
              ...item.from,
              x: item.from.x + _index * distanceX,
              y: item.from.y + index * distanceY,
            },
            to: {
              ...item.to,
              x: item.to.x + _index * distanceX,
              y: item.to.y + index * distanceY,
            },
            controlPoints: item.controlPoints.map((point) => ({
              ...point,
              x: point.x + distanceX * _index,
              y: point.y + distanceY * index,
            })),
          }
          // 设置序号与名称位置，状态颜色，id
        } else if (item.rect) {
          item = {
            ...item,
            rect: {
              ...item.rect,
              x: item.rect.x + _index * distanceX,
              y: item.rect.y + index * distanceY,
              center: {
                ...item.rect.center,
                x: item.rect.center.x + _index * distanceX,
                y: item.rect.center.y + index * distanceY,
              },
              ex: item.rect.ex + _index * distanceX,
              ey: item.rect.ey + index * distanceY,
            },
            fillStyle:
              item.uuid === 'devicesIndex'
                ? child.status === IThingStatus.NORMAL
                  ? DevStatusColor.normal
                  : child.status === IThingStatus.EXCEPTION
                  ? DevStatusColor.exception
                  : DevStatusColor.timeout
                : item.fillStyle,
            id: item.uuid === 'devicesIndex' ? child.thingId : item.id,
          }
        }
        // 其它属性
        return {
          ...item,
          text:
            item.uuid === 'devicesIndex'
              ? `${devicesIndex++} `
              : item.uuid === 'devicesName'
              ? child.emName.length > 6
                ? child.emName.slice(0, 5) + '...'
                : child.emName
              : item.text,
          title:
            item.uuid === 'devicesIndex'
              ? IThingStatusName[child.status]
              : item.uuid === 'devicesName'
              ? child.emName
              : item.text,
        }
      })
      pens = [...pens, ...pen]
    })
  })
  return { ...peidianxiangJson, pens }
}
