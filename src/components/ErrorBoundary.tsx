import { Button, Result } from "antd";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isVisibleErrInfo: boolean;
}

//错误边界，用来捕获react发生的错误，做降级UI处理，防止页面崩溃
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // 统一在constructor中初始化state
    this.state = {
      hasError: false,
      error: null,
      isVisibleErrInfo: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state 以便下次渲染可以显示降级 UI
    return {
      hasError: true,
      error,
      isVisibleErrInfo: false, // 添加这个属性
    };
  }

  //捕获错误日志
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  // 返回首页
  handleGoHome = () => {
    try {
      // 如果路由跳转失败，刷新页面
      window.location.href = "/";
    } catch (err) {
      // 如果路由跳转失败，刷新页面
      window.location.href = "/";
    }
  };

  // 刷新页面
  handleRefresh = () => {
    window.location.reload();
  };

  // 切换错误详情显示
  toggleErrorInfo = () => {
    this.setState({
      isVisibleErrInfo: !this.state.isVisibleErrInfo,
    });
  };

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Result
            status="500"
            title="500"
            subTitle="抱歉，应用程序中出现了问题。请尝试刷新页面或联系技术支持。"
            extra={[
              <Button key="home" type="primary" onClick={this.handleGoHome}>
                返回首页
              </Button>,
              <Button key="refresh" onClick={this.handleRefresh}>
                刷新页面
              </Button>,
              <Button key="detail" type="link" onClick={this.toggleErrorInfo}>
                {this.state.isVisibleErrInfo ? "隐藏错误详情" : "显示错误详情"}
              </Button>,
            ]}
          />

          {/* 根据isVisibleErrInfo控制错误详情的显示 */}
          {this.state.isVisibleErrInfo && this.state.error && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "left",
                padding: "16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "6px",
                border: "1px solid #d9d9d9",
              }}
            >
              <h4>错误详情：</h4>
              <p>
                <strong>错误信息:</strong> {this.state.error.message}
              </p>
              <div>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "12px",
                    maxHeight: "200px",
                    overflow: "auto",
                    backgroundColor: "#fff",
                    padding: "8px",
                    border: "1px solid #e8e8e8",
                    borderRadius: "4px",
                  }}
                >
                  {this.state.error.stack}
                </pre>
              </div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
