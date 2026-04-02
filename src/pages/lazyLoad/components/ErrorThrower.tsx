import React from 'react';
import { Card, Result, Tag } from 'antd';
import { BugOutlined } from '@ant-design/icons';

const ErrorThrower: React.FC = () => {
  throw new Error('这是一个模拟的组件加载错误！用于演示 ErrorBoundary 如何捕获懒加载失败。');

  return (
    <Card>
      <Result icon={<BugOutlined />} title="这行代码不会被执行" />
    </Card>
  );
};

export default ErrorThrower;
