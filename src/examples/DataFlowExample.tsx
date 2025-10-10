import React, { useState } from 'react';
import { Button, Card, Input, Space } from 'antd';

// 单向数据流完整示例

// 1. 祖父组件 - 数据源头
const GrandParent = () => {
  const [globalData, setGlobalData] = useState({
    user: { name: '张三', age: 25 },
    settings: { theme: 'light', language: 'zh' }
  });

  // 数据更新方法
  const updateUser = (newUserData: any) => {
    setGlobalData(prev => ({
      ...prev,
      user: { ...prev.user, ...newUserData }
    }));
  };

  const updateSettings = (newSettings: any) => {
    setGlobalData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  return (
    <Card title="祖父组件 - 数据源头" style={{ margin: '16px' }}>
      <p>全局状态: {JSON.stringify(globalData)}</p>
      
      {/* 数据向下流动到父组件 */}
      <Parent 
        userData={globalData.user}
        settings={globalData.settings}
        onUserUpdate={updateUser}
        onSettingsUpdate={updateSettings}
      />
    </Card>
  );
};

// 2. 父组件 - 中间层
const Parent = ({ userData, settings, onUserUpdate, onSettingsUpdate }: any) => {
  const [localState, setLocalState] = useState('父组件本地状态');

  return (
    <Card title="父组件 - 中间层" style={{ margin: '16px' }}>
      <p>接收到的用户数据: {JSON.stringify(userData)}</p>
      <p>本地状态: {localState}</p>
      
      {/* 继续向下传递数据 */}
      <Child 
        user={userData}
        theme={settings.theme}
        localData={localState}
        onUserChange={onUserUpdate}
        onLocalChange={setLocalState}
      />
    </Card>
  );
};

// 3. 子组件 - 最终消费者
const Child = ({ user, theme, localData, onUserChange, onLocalChange }: any) => {
  const [inputValue, setInputValue] = useState('');

  // 子组件通过回调通知上级组件
  const handleUserNameChange = () => {
    if (inputValue.trim()) {
      onUserChange({ name: inputValue });  // 通过回调向上通知
      setInputValue('');
    }
  };

  const handleLocalChange = () => {
    onLocalChange('子组件修改了父组件的本地状态');
  };

  return (
    <Card title="子组件 - 数据消费者" style={{ margin: '16px' }}>
      <div style={{ background: theme === 'light' ? '#fff' : '#333', padding: '16px' }}>
        <p>用户: {user.name}, 年龄: {user.age}</p>
        <p>主题: {theme}</p>
        <p>父组件数据: {localData}</p>
        
        <Space direction="vertical">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入新用户名"
          />
          <Button onClick={handleUserNameChange}>
            更新用户名（通知祖父组件）
          </Button>
          <Button onClick={handleLocalChange}>
            修改父组件状态
          </Button>
        </Space>
      </div>
    </Card>
  );
};

// 数据流向图示组件
const DataFlowDiagram = () => {
  return (
    <Card title="React单向数据流示意图" style={{ margin: '16px' }}>
      <div style={{ textAlign: 'center', fontSize: '16px' }}>
        <div>📊 祖父组件（数据源）</div>
        <div style={{ margin: '8px 0' }}>↓ props</div>
        <div>🔄 父组件（中转层）</div>
        <div style={{ margin: '8px 0' }}>↓ props</div>
        <div>🎯 子组件（消费者）</div>
        <div style={{ margin: '16px 0', color: '#1890ff' }}>
          <strong>数据流向：单向向下</strong>
        </div>
        <div style={{ margin: '8px 0' }}>↑ callbacks</div>
        <div>📢 事件通知：通过回调向上</div>
      </div>
    </Card>
  );
};

// 主导出组件
const DataFlowExample = () => {
  return (
    <div>
      <DataFlowDiagram />
      <GrandParent />
    </div>
  );
};

export default DataFlowExample;

