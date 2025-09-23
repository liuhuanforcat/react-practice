import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import './index.less';

const ErrorBoundaryTest = () => {
  const [asyncError, setAsyncError] = useState(false);
  const [errorType, setErrorType] = useState<any | null>(null);
  const undefinedObj: any = undefined;

  // useEffect(() => {
  //   if (asyncError) {
  //     // 直接抛出错误，以便在渲染周期内被捕获
  //     throw new Error('异步错误测试');
  //   }
  // }, [asyncError]);

  useEffect(() => {
    if (errorType) {
      throw new Error(errorType);
    }
  }, [errorType]);

  const throwSyncError = () => {
   console.log(errorType?.type);
    
    // try {
    //   throw new Error('同步错误测试');
    // } catch (error) {
    //   console.error('Caught in event handler:', error);
    //   setErrorType('同步错误'); // 设置错误类型
    // }
  };

  const accessUndefined = () => {
    try {
      console.log(undefinedObj.property);
    } catch (error) {
      console.error('Caught in event handler:', error);
      setErrorType('访问undefined属性错误'); // 设置错误类型
    }
  };

  // 模拟接口500错误的测试
  const testApiError = async () => {
    try {
      // 模拟一个会返回500错误的接口
      const response = await fetch('/api/test-500', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      if (!response.ok) {
        throw new Error(`接口错误: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('接口响应:', data);
    } catch (error) {
      console.error('接口请求失败:', error);
      // 关键：将异步错误传递给错误边界
      setErrorType(`接口500错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 直接模拟网络错误
  const simulateNetworkError = () => {
    // 模拟网络请求失败
    Promise.reject(new Error('网络连接失败'))
      .catch(error => {
        console.error('网络错误:', error);
        // 将错误传递给错误边界
        setErrorType(`网络错误: ${error.message}`);
      });
  };

  return (
    <div className="error-boundary-test">
      <h1>错误边界测试页面</h1>
      <div>
        <button onClick={throwSyncError}>触发同步错误</button>
        <button onClick={() => setAsyncError(true)}>触发异步错误</button>
        <button onClick={accessUndefined}>访问undefined属性</button>
        <button onClick={testApiError}>测试接口500错误</button>
        <button onClick={simulateNetworkError}>模拟网络错误</button>
        {/* <div>{errorType.type||1}</div> */}
      </div>
    </div>
  );
};

export default function WrappedErrorBoundaryTest() {
  return (
    <ErrorBoundary>
    <ErrorBoundaryTest />
    </ErrorBoundary>
  );
};
