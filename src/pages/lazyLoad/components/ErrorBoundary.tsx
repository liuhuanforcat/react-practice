import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Result, Button, Typography } from 'antd';
import { BugOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Result
          icon={<BugOutlined style={{ color: '#f5222d' }} />}
          title="组件加载失败"
          subTitle="ErrorBoundary 成功捕获了错误，页面不会崩溃"
          extra={
            <Button type="primary" onClick={this.handleReset}>
              重试
            </Button>
          }
        >
          <Paragraph>
            <Text strong style={{ fontSize: 14 }}>
              错误信息：
            </Text>
          </Paragraph>
          <Paragraph>
            <code
              style={{
                padding: '8px 16px',
                background: '#fff1f0',
                border: '1px solid #ffa39e',
                borderRadius: 4,
                display: 'block',
                color: '#f5222d',
                fontSize: 13,
                fontFamily: 'Monaco, Consolas, monospace',
              }}
            >
              {this.state.error?.message}
            </code>
          </Paragraph>
        </Result>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
