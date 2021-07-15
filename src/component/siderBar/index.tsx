import { IRoute } from '@/routes'
import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import IconFont from '../icon'
import styles from './index.module.less'

interface IProps {
  siderMenuData: IRoute
}

const SiderBar = (props: IProps & RouteComponentProps) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    const { pathname } = props.location
    if (props.siderMenuData.children) {
      const selectedMenu = props.siderMenuData.children.find((menu) =>
        pathname.startsWith(menu.path)
      )
      if (selectedMenu) {
        setSelectedKeys([selectedMenu?.path])
      }
    }
  }, [props, props.siderMenuData.children])

  const getMenu = () => {
    if (!(props.siderMenuData && props.siderMenuData.children)) {
      return null
    }
    return props.siderMenuData.children.map((route) => {
      return (
        <Menu.Item
          key={route.path}
          icon={
            route.icon ? (
              <IconFont
                type={route.icon}
                style={{ fontSize: '18px', marginRight: '4px', marginLeft: '-10px' }}
              />
            ) : null
          }
        >
          <Link to={route.path}>{route.name}</Link>
        </Menu.Item>
      )
    })
  }

  const handleClick = ({ key }: any) => {
    setSelectedKeys([key])
  }

  return (
    <div className={styles.sider}>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        onClick={handleClick}
        className={styles.menu}
      >
        {getMenu()}
      </Menu>
    </div>
  )
}

export default withRouter(SiderBar)
