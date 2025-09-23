import { Button, Result } from 'antd';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // 更新 state 以便下次渲染可以显示降级 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 可以将错误日志上报给服务器
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // 这里可以将错误信息发送到服务器或记录到日志文件中
    // fetch('/log', { method: 'POST', body: JSON.stringify({ error, errorInfo }) });
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>发生错误</h1>
          <p>很抱歉，应用程序中出现了问题。请尝试刷新页面或联系支持。</p>
          <p>错误信息: {this.state.error?.message}</p>
          <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {this.state.error?.stack}
          </pre>
          <div>
            <Button onClick={() => window.history.back()}>返回上一级</Button>
          </div>
          <Result
				status="404"
				title="404"
				subTitle="抱歉，您访问的页面不存在"
				extra={
					<Button type="primary" >
						返回首页
					</Button>
				}
			/>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
