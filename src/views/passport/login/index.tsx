import { actions } from '@/common/action'
import api from '@/service/api'
import { getCookie, setCookie } from '@/utils/common'
import { UserOutlined, KeyOutlined } from '@ant-design/icons'
import { Input, Form, Button, Layout, Row, Col, Tooltip, message } from 'antd'
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox'
import md5 from 'md5'
import React, { useState } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import styles from './index.module.less'

interface IDispatch {
  actions: typeof actions
}

const Login = (props: RouteComponentProps & IDispatch) => {
  const [form] = Form.useForm()
  const [verificationCode, setVerificationCode] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [cookieFlag, setCookieFlag] = useState(false)
  const [logged, setLogged] = useState(1) // 是否首次登陆 0是，1否

  const setRandomCode = useCallback(() => {
    const randomNum = window.crypto.getRandomValues(new Uint32Array(1))[0]
    const code = ((randomNum / Math.pow(10, randomNum.toString().length)) * 10)
      .toString(36)
      .substr(2)
      .slice(0, 4)
    setVerificationCode(code)
  }, [])

  useEffect(() => {
    setRandomCode()
  }, [setRandomCode])

  useEffect(() => {
    const cookie = getCookie()
    if (cookie) {
      try {
        const account = JSON.parse(cookie)
        form.setFieldsValue(account)
      } catch (err) {
        console.log()
      }
    }
  }, [form])

  const handleLogin = () => {
    form.validateFields().then(async (values) => {
      if (values.verificationCode !== verificationCode) {
        form.setFields([{ name: 'verificationCode', errors: ['验证码错误'] }])
        return
      }
      setLoading(true)
      const params = {
        userAccount: values.userAccount,
        password: md5(values.password + 'tamboo'),
      }
      try {
        console.log('login')
        const res = await api.login(params)
        if (res.data) {
          sessionStorage.setItem('Authorization', res.data.authorization)
          localStorage.setItem('Authorization', res.data.authorization)
          sessionStorage.setItem('userAccount', res.data.userAccount)
          sessionStorage.setItem('tenantId', res.data.tenantId)
          sessionStorage.setItem('userId', res.data.id)
          sessionStorage.setItem('username', res.data.username)
          sessionStorage.setItem('tenantAdmin', res.data.tenantAdmin + '')
          if (cookieFlag) {
            setCookie(JSON.stringify({ ...params, password: values.password }))
          }
          setLogged(res.data.logged)
          if (res.data.logged !== 0) {
            props.actions.getMenus('/main')
          }
        }
      } catch (err) {
        setRandomCode()
        if (typeof err === 'string') {
          message.error(err)
        }
      } finally {
        setLoading(false)
      }
    })
  }

  const checkboxChange = (e: CheckboxChangeEvent) => {
    setCookieFlag(e.target.checked)
  }

  const onCancel = () => {
    setLogged(1)
  }

  const handleUpdate = () => {
    form.validateFields().then(async (values) => {
      if (values.oldPassword === values.newPassword) {
        message.error('原始密码和新密码相同！')
        return
      }
      if (values.newPassword !== values.newPasswordAgain) {
        message.error('两次输入新密码不一致！')
        return
      }
      try {
        const params = {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          userAccount: sessionStorage.getItem('userAccount')!,
        }
        const res = await api.updatePassword(params)
        if (res) {
          message.success('修改成功')
          setLogged(1)
        }
      } catch (err) {
        message.error(err)
      }
    })
  }

  const onSubmit = () => {
    if (logged) {
      handleLogin()
    } else {
      handleUpdate()
    }
  }

  const loginForm = (
    <>
      <Form.Item
        name="userAccount"
        rules={[
          {
            pattern: /^[^\u4e00-\u9fa5]{0,}$/,
            message: '账户只能设置数字、字母、特殊字符',
          },
          { max: 30, message: '账号不能超出30个字符' },
          { required: true, message: '请输入账号' },
        ]}
      >
        <Input
          placeholder="请输入用户名称"
          prefix={<UserOutlined style={{ fontSize: 20, color: '#13c2c2' }} />}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            pattern: /^(?![^a-zA-Z]+$)(?!D+$)/,
            message: '密码含有数字、字母',
          },
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码不能小于8位' },
        ]}
      >
        <Input.Password
          placeholder="请输入登陆密码"
          prefix={<KeyOutlined style={{ fontSize: 20, color: '#13c2c2' }} />}
        />
      </Form.Item>
      <Row>
        <Form.Item
          name="verificationCode"
          rules={[{ required: true, message: '请输入验证码' }]}
          style={{ width: '65%' }}
        >
          <Input
            placeholder="请输入验证码"
            prefix={<KeyOutlined style={{ fontSize: 20, color: '#13c2c2' }} />}
          />
        </Form.Item>
        <Row className={styles.verificationCode} onClick={setRandomCode}>
          {verificationCode}
        </Row>
      </Row>
      <Row justify="space-between">
        <Col>
          <Checkbox onChange={checkboxChange}>记住密码</Checkbox>
        </Col>
        <Tooltip
          placement="top"
          title={
            <div style={{ fontSize: 12 }}>
              <div>请联系超管重置登录密码</div>
              <div>电话：000-000-000</div>
            </div>
          }
        >
          <Button type="text" style={{ color: '#13C2C2' }}>
            忘记密码？
          </Button>
        </Tooltip>
      </Row>
      <Form.Item style={{ textAlign: 'center', marginTop: 10 }}>
        <Button
          type="primary"
          htmlType="submit"
          className={styles.loginbtn}
          style={{ width: '100%' }}
          loading={loading}
        >
          登录
        </Button>
      </Form.Item>
    </>
  )

  const updatePasswordForm = (
    <>
      <Form.Item
        name="oldPassword"
        rules={[
          {
            pattern: /^(?![^a-zA-Z]+$)(?!D+$)/,
            message: '密码含有数字、字母',
          },
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码不能小于8位' },
        ]}
      >
        <Input.Password
          placeholder="请输入原密码"
          prefix={<KeyOutlined style={{ fontSize: 20, color: '#13c2c2' }} />}
        />
      </Form.Item>
      <Form.Item
        name="newPassword"
        rules={[
          {
            pattern: /^(?![^a-zA-Z]+$)(?!D+$)/,
            message: '密码含有数字、字母',
          },
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码不能小于8位' },
        ]}
      >
        <Input.Password
          placeholder="请输入新密码"
          prefix={<KeyOutlined style={{ fontSize: 20, color: '#13c2c2' }} />}
        />
      </Form.Item>
      <Form.Item
        name="newPasswordAgain"
        rules={[
          {
            pattern: /^(?![^a-zA-Z]+$)(?!D+$)/,
            message: '密码含有数字、字母',
          },
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码不能小于8位' },
        ]}
      >
        <Input.Password
          placeholder="请再次输入新密码"
          prefix={<KeyOutlined style={{ fontSize: 20, color: '#13c2c2' }} />}
        />
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button type="default" onClick={() => onCancel()}>
          取消
        </Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
          确定
        </Button>
      </div>
    </>
  )

  return (
    <Layout className={styles.login}>
      <Layout.Content>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.text}>
              <strong>能源管理系统</strong>
              <br />
              <span>Energy Management System</span>
            </div>
            <div className={styles.img1} />
          </div>
          <div className={styles.right}>
            {logged ? (
              <div className={styles.title}>
                <strong>用户登录 </strong>
                <span>USER LOGIN </span>
              </div>
            ) : (
              <div className={styles.title}>
                <span>初次登录，请修改密码！</span>
              </div>
            )}
            <Form form={form} onFinish={onSubmit} preserve={false} className={styles.form}>
              {logged ? loginForm : updatePasswordForm}
            </Form>
          </div>
        </div>
      </Layout.Content>
      <Layout.Footer className={styles.footer}>
        <span>Copyright © www.imresearch.com.cn</span>
        <br />
        <span>南京智能制造研究院有限公司</span>
      </Layout.Footer>
    </Layout>
  )
}

export default connect(null, (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
})(withRouter(Login))
