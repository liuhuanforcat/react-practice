import React, { useEffect } from 'react';
import { Button, Form, Input, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './index.less';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;


const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // 获取路由跳转方法

  useEffect(() => {
    // 添加键盘光效监听
    const inputs = document.querySelectorAll('.tech-input input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('active');
      });
      input.addEventListener('blur', () => {
        input.parentElement?.classList.remove('active');
      });
    });
  }, []);

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    localStorage.setItem('token', 'your_token_here'); // 模拟登录成功，存储 token
    navigate('/home');
    // 这里添加登录逻辑
  };

  return (
    <div className="login-container">

      {/* 光效装饰元素 */}
      <div className="tech-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="line line-1"></div>
        <div className="line line-2"></div>
      </div>

      {/* 登录卡片 */}
      <Card className="login-card" hoverable>
        <div className="card-header">
          <Title level={3} className="tech-title">
            <span className="tech-text">SYSTEM</span>
            <span className="tech-highlight">LOGIN</span>
          </Title>
          <div className="tech-divider"></div>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          className="login-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <div className="tech-input">
              <Input
                prefix={<UserOutlined className="tech-icon" />}
                placeholder="用户名"
              />
              <div className="input-bottom-line"></div>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <div className="tech-input">
              <Input
                prefix={<LockOutlined className="tech-icon" />}
                type="password"
                placeholder="密码"
              />
              <div className="input-bottom-line"></div>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="tech-button"
            >
              登 录
              <span className="button-border button-border-top"></span>
              <span className="button-border button-border-right"></span>
              <span className="button-border button-border-bottom"></span>
              <span className="button-border button-border-left"></span>
            </Button>
          </Form.Item>
        </Form>

        <div className="tech-footer">
          <span>© 2023 TECH FUTURE SYSTEM</span>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;