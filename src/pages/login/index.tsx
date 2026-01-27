import React, { useState } from 'react';
import { Button, Form, Input, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import './index.less';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    // 模拟登录请求
    setTimeout(() => {
      console.log('登录参数:', values);
      localStorage.setItem('token', 'your_token_here');
      message.success('登录成功');
      setLoading(false);
      navigate('/home');
    }, 400);
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-card-header">
          <Title level={3} className="login-title">
            系统登录
          </Title>
          <Text className="login-subtitle">
            请输入您的账号与密码
          </Text>
        </div>

        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          className="login-form"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined className="login-input-icon" />}
              placeholder="请输入用户名"
              size="large"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="login-input-icon" />}
              placeholder="请输入密码"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className="login-submit-item">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="login-submit-btn"
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text type="secondary">© 2025 企业管理系统</Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
