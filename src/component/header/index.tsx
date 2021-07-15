import authSvg from '@/assets/images/auth.svg'
import HomeIcon from '@/assets/images/home.svg'
import { actions } from '@/common/action'
import routes, { IRoute } from '@/routes'
import api from '@/service/api'
import { IResUserMenu } from '@/types/resType'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Divider, Menu, message, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import IconFont from '../icon'
import styles from './index.module.less'

interface IProps {
  setSiderRoute: (route: IRoute) => void
  menus: IResUserMenu[]
  collapsed?: boolean
  defaultActiveKey: string
}

interface IPropsDispatch {
  actions: {
    logout: typeof actions.logout
  }
}

const PageHeader = (props: IProps & RouteComponentProps & IPropsDispatch) => {
  const [activeKey, setActiveKey] = useState<string>('')
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    setActiveKey(props.defaultActiveKey)
    if (props.menus) {
      const authMeun = props.menus.find((item) => item.menuName === '权限管理')
      setShowAuth(!!authMeun)
    }
  }, [props.defaultActiveKey, props.menus])

  const gotoAuthSystem = () => {
    window.open('http://' + window.location.host + '/auth/#/authManage')
  }

  const getHeaderMenu = () => {
    const menus = props.menus.map((route, index) => {
      let menuArr = routes.filter((item) => {
        return item.path === route.menuUrl
      })
      let menuItem = menuArr.length > 0 ? menuArr[0] : null
      if (route.menuName === '权限管理') {
        return null
      }
      return (
        <Menu.Item
          key={route.menuUrl}
          title={route.menuName}
          icon={
            menuItem ? (
              <IconFont type={menuItem.icon} style={{ fontSize: '18px', marginRight: '4px' }} />
            ) : null
          }
        >
          <Link to={route.children![0]?.menuUrl}>{route.menuName}</Link>
        </Menu.Item>
      )
    })
    return menus
  }

  const logout = async () => {
    try {
      const res = await api.logOut()
      if (res.data.data) {
        props.actions.logout()
      }
    } catch (err) {
      message.error(err)
    }
  }

  const handleClick = ({ key }: any) => {
    setActiveKey(key)
    const route = routes.find((item) => item.path === key)
    let routeCopy: IRoute = Object.assign({}, route)
    const sideMenuChild = props.menus.find((item) => item.menuUrl === key)?.children
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
    routeCopy && props.setSiderRoute(routeCopy)
  }

  return (
    <Row className={styles.header}>
      <Row>
        <Row style={{ padding: '0 1.5rem' }} align="middle">
          <img src={HomeIcon} height="2.25rem" alt="" />
          <span className={styles.title}>ECA-EMS</span>
        </Row>
        <Row align="middle" style={{ lineHeight: '2.5rem' }}>
          <Menu onClick={handleClick} selectedKeys={[activeKey]} mode="horizontal">
            {getHeaderMenu()}
          </Menu>
        </Row>
      </Row>
      <Row justify="end" align="middle">
        {showAuth ? (
          <Row
            justify="end"
            align="middle"
            title="前往权限管理系统"
            style={{ cursor: 'pointer' }}
            onClick={gotoAuthSystem}
          >
            <Button
              type="primary"
              className={styles.authButton}
              icon={<img style={{ marginRight: 10 }} src={authSvg} height={20} alt="" />}
            >
              权限管理
            </Button>
          </Row>
        ) : null}
        <Divider type="vertical" />
        <Row justify="end" align="middle" style={{ cursor: 'pointer' }} onClick={logout}>
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
          <span style={{ marginLeft: 10, fontSize: 14 }}>退出</span>
        </Row>
      </Row>
    </Row>
  )
}

export default connect(null, (dispatch) => {
  return {
    actions: bindActionCreators({ logout: actions.logout }, dispatch),
  }
})(withRouter(PageHeader))
