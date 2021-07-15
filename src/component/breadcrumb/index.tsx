import { IRoute } from '@/routes'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Divider, Row } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import styles from './index.module.less'

interface IProps {
  collapsed: boolean
  toggle: () => void
  siderMenuData: IRoute
}

const BreadcrumbBar = (props: IProps & RouteComponentProps) => {
  const [breadcrumbDatas, setBreadcrumbDatas] = useState<Array<{ text: string; url: string }>>([])

  useEffect(() => {
    const { pathname } = props.location
    let list: Array<{ text: string; url: string }> = []
    const getRouteName = (route: IRoute) => {
      list.push({ text: route.name, url: route.path })
      if (route.children) {
        const selectedRoute = route.children.find((item) => pathname.startsWith(item.path))
        if (selectedRoute) {
          getRouteName(selectedRoute)
        }
      }
    }

    if (props.siderMenuData.children) {
      getRouteName(props.siderMenuData)
    }
    setBreadcrumbDatas(list)
  }, [props.location, props.siderMenuData])

  return (
    <>
      <Row style={{ height: 50, background: '#fff' }} align="middle">
        <Col flex={props.collapsed ? '0 1 80px' : '0 1 240px'}>
          <Row align="middle" justify={props.collapsed ? 'center' : 'space-between'}>
            <Col flex="1 1 40px" style={{ textAlign: 'center' }}>
              {props.collapsed ? '' : props.siderMenuData.name}
            </Col>
            <Col onClick={props.toggle}>
              {props.collapsed ? (
                <MenuUnfoldOutlined className={styles.trigger} />
              ) : (
                <MenuFoldOutlined className={styles.trigger} />
              )}
            </Col>
          </Row>
        </Col>
        <Divider className={styles.divider} type="vertical" />
        <Col style={{ paddingLeft: 20 }}>
          <Breadcrumb>
            {breadcrumbDatas.map((item, index) => (
              <Breadcrumb.Item key={item.url}>
                {index ? <Link to={item.url}>{item.text}</Link> : item.text}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </Col>
      </Row>
    </>
  )
}

export default withRouter(BreadcrumbBar)
