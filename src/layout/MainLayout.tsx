import BreadcrumbBar from '@/component/breadcrumb'
import PageHeader from '@/component/header'
import SiderBar from '@/component/siderBar'
import { AppState } from '@/redux/reducers'
import routes, { IRoute } from '@/routes'
import { IResUserMenu } from '@/types/resType'
import { Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import styles from './index.module.less'

const { Content, Sider, Header } = Layout

interface IStateProps {
  menuData: IResUserMenu[]
}

const MainLayout = (props: RouteComponentProps & IStateProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const [siderMenuData, setSiderMenuData] = useState<IRoute>(routes[0])
  const [defaultActiveKey, setDefaultActiveKey] = useState<string>('')

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    if (!props.menuData.length) {
      return
    }
    const { pathname } = props.location
    const route = routes.find((item) => pathname.startsWith(item.path))
    if (route) {
      setDefaultActiveKey(route.path)
      let routeCopy: IRoute = Object.assign({}, route)
      const sideMenuChild = props.menuData.find((item) => item.menuUrl === route.path)?.children
      let childRoute: IRoute[] = Object.assign([], route?.children)
      let arr: IRoute[] = []
      sideMenuChild?.map((item) => {
        childRoute.map((element) => {
          if (item.menuUrl === element.path) {
            arr.push(element)
          }
        })
      })
      routeCopy.children = arr
      setSiderRoute(routeCopy)
    }
  }, [props.location, props.menuData])

  const switchRoutes = () => {
    const getRoutes = (route: IRoute) => {
      if (route.children) {
        return (
          <Switch>
            {route.children.map((item) => (
              <Route key={item.path} path={item.path} component={item.component}>
                {getRoutes(item)}
              </Route>
            ))}
          </Switch>
        )
      }
      return null
    }
    return (
      <Switch>
        {routes.map((prop, key) => {
          if (prop.layout === '/main') {
            return (
              <Route path={prop.path} key={key}>
                {getRoutes(prop)}
              </Route>
            )
          }
          return null
        })}
        <Redirect from="/main" to="/main/homepage/dashboard" />
      </Switch>
    )
  }

  const setSiderRoute = (route: IRoute) => {
    setSiderMenuData(route)
  }
  return (
    <Layout className={styles.layout} style={{ height: '100%' }}>
      <Header className={styles.header}>
        <PageHeader
          setSiderRoute={setSiderRoute}
          defaultActiveKey={defaultActiveKey}
          menus={props.menuData}
        />
      </Header>
      <div>
        <BreadcrumbBar collapsed={collapsed} toggle={toggle} siderMenuData={siderMenuData} />
      </div>
      <Layout className={styles.mainContent}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className={collapsed ? styles.collapsed : styles.sider}
        >
          <SiderBar siderMenuData={siderMenuData} />
        </Sider>
        <Content className={styles.content}>{switchRoutes()}</Content>
      </Layout>
    </Layout>
  )
}

export default connect((state: AppState) => {
  return {
    menuData: state.common.menus,
  }
})(MainLayout)
