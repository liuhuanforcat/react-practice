import React, { useState } from 'react';
import { Card, Button, Space, Divider, Typography, Alert } from 'antd';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const EventPropagationDemo: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [stopPropagation, setStopPropagation] = useState(false);
  const [preventDefault, setPreventDefault] = useState(false);
  const [todoItems, setTodoItems] = useState([
    { id: '1', text: '学习事件传播机制', completed: false },
    { id: '2', text: '理解 stopPropagation', completed: false },
    { id: '3', text: '掌握事件委托', completed: false },
  ]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // 捕获阶段处理函数
  const handleCapture = (phase: string, element: string) => (e: React.MouseEvent) => {
    addLog(`🟢 [捕获阶段] ${element} - ${phase}`);
  };

  // 冒泡阶段处理函数
  const handleBubble = (phase: string, element: string) => (e: React.MouseEvent) => {
    addLog(`🔵 [冒泡阶段] ${element} - ${phase}`);
    if (stopPropagation && element === '目标元素') {
      e.stopPropagation();
      addLog('🛑 事件传播已停止（stopPropagation）');
    }
  };

  // 目标元素点击处理
  const handleTargetClick = (e: React.MouseEvent) => {
    addLog(`🎯 [目标阶段] 目标元素被点击`);
    if (stopPropagation) {
      e.stopPropagation();
      addLog('🛑 事件传播已停止（stopPropagation）');
    }
    if (preventDefault) {
      e.preventDefault();
      addLog('🚫 默认行为已阻止（preventDefault）');
    }
  };

  // 链接点击处理（演示 preventDefault）
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    addLog('🔗 链接默认跳转行为已被阻止');
  };

  // 事件委托演示：处理动态列表点击
  const handleTodoListClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    const todoItem = target.closest('.todo-item') as HTMLElement;
    
    if (todoItem) {
      const id = todoItem.dataset.id;
      if (target.classList.contains('delete-btn')) {
        // 点击删除按钮
        setTodoItems((prev) => prev.filter((item) => item.id !== id));
        addLog(`🗑️ [事件委托] 删除了待办项 ${id}`);
      } else {
        // 点击待办项本身
        setTodoItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          )
        );
        addLog(`✅ [事件委托] 切换了待办项 ${id} 的状态`);
      }
    }
  };

  // 添加新待办项
  const handleAddTodo = () => {
    const newId = String(Date.now());
    setTodoItems((prev) => [
      ...prev,
      { id: newId, text: `新待办项 ${newId.slice(-4)}`, completed: false },
    ]);
    addLog(`➕ [事件委托] 添加了新待办项 ${newId}`);
  };

  return (
    <div className="event-propagation-demo">
      <Card>
        <Title level={2}>事件传播机制演示</Title>
        
        <Alert
          message="事件传播的三个阶段"
          description={
            <div>
              <p><strong>1. 捕获阶段（Capture Phase）</strong>：事件从 window 向下传播到目标元素</p>
              <p><strong>2. 目标阶段（Target Phase）</strong>：事件到达目标元素</p>
              <p><strong>3. 冒泡阶段（Bubble Phase）</strong>：事件从目标元素向上传播到 window</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 控制面板 */}
          <Card title="控制面板" size="small">
            <Space>
              <Button
                type={stopPropagation ? 'primary' : 'default'}
                onClick={() => setStopPropagation(!stopPropagation)}
              >
                {stopPropagation ? '✅ 已启用 stopPropagation' : '启用 stopPropagation'}
              </Button>
              <Button
                type={preventDefault ? 'primary' : 'default'}
                onClick={() => setPreventDefault(!preventDefault)}
              >
                {preventDefault ? '✅ 已启用 preventDefault' : '启用 preventDefault'}
              </Button>
              <Button onClick={clearLogs}>清空日志</Button>
            </Space>
          </Card>

          {/* 事件传播演示区域 */}
          <Card title="事件传播演示（点击内层蓝色区域）" size="small">
            <div
              className="outer-box"
              onClickCapture={handleCapture('外层容器', '外层容器')}
              onClick={handleBubble('外层容器', '外层容器')}
            >
              <Text type="secondary">外层容器（点击这里）</Text>
              <div
                className="middle-box"
                onClickCapture={handleCapture('中层容器', '中层容器')}
                onClick={handleBubble('中层容器', '中层容器')}
              >
                <Text type="secondary">中层容器（点击这里）</Text>
                <div
                  className="inner-box"
                  onClickCapture={handleCapture('目标元素', '目标元素')}
                  onClick={handleTargetClick}
                >
                  <Text strong>目标元素（点击这里）</Text>
                </div>
              </div>
            </div>
          </Card>

          {/* preventDefault 演示 */}
          <Card title="preventDefault 演示" size="small">
            <Paragraph>
              点击下面的链接，链接不会跳转（已阻止默认行为）：
            </Paragraph>
            <a
              href="https://www.baidu.com"
              onClick={handleLinkClick}
              style={{ color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }}
            >
              这是一个链接（点击不会跳转）
            </a>
          </Card>

          {/* 事件委托演示 */}
          <Card title="事件委托演示（动态列表）" size="small">
            <Paragraph>
              <Text strong>说明：</Text>使用事件委托处理动态列表，即使添加新项目也不需要重新绑定事件监听器。
              点击待办项切换完成状态，点击删除按钮删除项目。
            </Paragraph>
            <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
              <Button type="primary" onClick={handleAddTodo}>
                添加新待办项
              </Button>
              <ul
                onClick={handleTodoListClick}
                style={{
                  listStyle: 'none',
                  padding: 0,
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                {todoItems.map((item) => (
                  <li
                    key={item.id}
                    className="todo-item"
                    data-id={item.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: item.completed ? '#f6ffed' : '#fff',
                      textDecoration: item.completed ? 'line-through' : 'none',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#e6f7ff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = item.completed
                        ? '#f6ffed'
                        : '#fff';
                    }}
                  >
                    <span>{item.text}</span>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止触发父元素的点击事件
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      删除
                    </button>
                  </li>
                ))}
              </ul>
            </Space>
          </Card>

          {/* 日志显示区域 */}
          <Card title="事件日志" size="small">
            <div className="log-container">
              {logs.length === 0 ? (
                <Text type="secondary">暂无日志，请点击上面的元素...</Text>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="log-item">
                    {log}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* 详细说明文档 */}
          <Card title="📚 详细知识点说明" size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 1. 事件传播的三个阶段 */}
              <div>
                <Title level={4}>1. 事件传播的三个阶段（Event Propagation Phases）</Title>
                <Paragraph>
                  <Text strong>DOM 事件传播遵循 W3C 标准，分为三个阶段：</Text>
                </Paragraph>
                <div style={{ marginLeft: 20 }}>
                  <Paragraph>
                    <Text strong style={{ color: '#52c41a' }}>🟢 捕获阶段（Capture Phase）</Text>
                    <ul>
                      <li>事件从 <Text code>window</Text> 对象开始，沿着 DOM 树向下传播到目标元素</li>
                      <li>在 React 中使用 <Text code>onClickCapture</Text>、<Text code>onMouseDownCapture</Text> 等监听</li>
                      <li>在原生 JS 中使用 <Text code>addEventListener(event, handler, true)</Text>（第三个参数为 true）</li>
                      <li>这个阶段很少使用，主要用于需要在事件到达目标之前拦截的场景</li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    <Text strong style={{ color: '#1890ff' }}>🎯 目标阶段（Target Phase）</Text>
                    <ul>
                      <li>事件到达实际被触发的目标元素</li>
                      <li>如果目标元素注册了捕获和冒泡监听器，都会在这个阶段执行</li>
                      <li>执行顺序：先执行捕获监听器，再执行冒泡监听器</li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    <Text strong style={{ color: '#722ed1' }}>🔵 冒泡阶段（Bubble Phase）</Text>
                    <ul>
                      <li>事件从目标元素开始，沿着 DOM 树向上传播回 <Text code>window</Text> 对象</li>
                      <li>在 React 中使用 <Text code>onClick</Text>、<Text code>onMouseDown</Text> 等监听（默认）</li>
                      <li>在原生 JS 中使用 <Text code>addEventListener(event, handler, false)</Text> 或 <Text code>onclick</Text> 属性</li>
                      <li>这是最常用的阶段，大多数事件处理都在冒泡阶段进行</li>
                    </ul>
                  </Paragraph>
                </div>
                <Alert
                  message="传播路径示例"
                  description={
                    <div>
                      <Text>点击内层元素时，事件传播路径：</Text>
                      <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginTop: '8px' }}>
{`window (捕获)
  ↓
document (捕获)
  ↓
html (捕获)
  ↓
body (捕获)
  ↓
外层容器 (捕获)
  ↓
中层容器 (捕获)
  ↓
目标元素 (目标阶段)
  ↑
中层容器 (冒泡)
  ↑
body (冒泡)
  ↑
html (冒泡)
  ↑
document (冒泡)
  ↑
window (冒泡)`}
                      </pre>
                    </div>
                  }
                  type="info"
                  style={{ marginTop: 16 }}
                />
              </div>

              <Divider />

              {/* 2. stopPropagation */}
              <div>
                <Title level={4}>2. stopPropagation() - 阻止事件传播</Title>
                <Paragraph>
                  <Text code>e.stopPropagation()</Text> 用于阻止事件继续传播，但不会阻止当前元素上的其他监听器执行。
                </Paragraph>
                <div style={{ marginLeft: 20 }}>
                  <Paragraph>
                    <Text strong>作用机制：</Text>
                    <ul>
                      <li>在<Text strong>捕获阶段</Text>调用：阻止事件继续向下传播到子元素</li>
                      <li>在<Text strong>目标阶段</Text>调用：阻止事件进入冒泡阶段</li>
                      <li>在<Text strong>冒泡阶段</Text>调用：阻止事件继续向上传播到父元素</li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>使用场景：</Text>
                    <ul>
                      <li>防止点击内部元素触发外部元素的点击事件</li>
                      <li>实现模态框点击外部关闭，但点击内部不关闭</li>
                      <li>防止事件冒泡导致意外的副作用</li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>代码示例：</Text>
                    <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`// React 示例
const handleClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // 阻止事件冒泡
  console.log('点击了按钮');
};

// 原生 JS 示例
element.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('点击了元素');
});`}
                    </pre>
                  </Paragraph>
                  <Alert
                    message="注意"
                    description="stopPropagation() 不会阻止同一元素上的其他事件监听器执行，如果需要阻止所有监听器，需要使用 stopImmediatePropagation()"
                    type="warning"
                    style={{ marginTop: 12 }}
                  />
                </div>
              </div>

              <Divider />

              {/* 3. preventDefault */}
              <div>
                <Title level={4}>3. preventDefault() - 阻止默认行为</Title>
                <Paragraph>
                  <Text code>e.preventDefault()</Text> 用于阻止事件的默认行为，但<Text strong>不会阻止事件传播</Text>。
                </Paragraph>
                <div style={{ marginLeft: 20 }}>
                  <Paragraph>
                    <Text strong>常见默认行为：</Text>
                    <ul>
                      <li><Text code>&lt;a&gt;</Text> 标签：阻止页面跳转</li>
                      <li><Text code>&lt;form&gt;</Text> 标签：阻止表单提交</li>
                      <li><Text code>&lt;input type="submit"&gt;</Text>：阻止表单提交</li>
                      <li>右键菜单：阻止浏览器默认右键菜单</li>
                      <li>文本选择：阻止文本被选中</li>
                      <li>拖拽：阻止文件拖拽到浏览器时的默认行为</li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>代码示例：</Text>
                    <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`// 阻止链接跳转
<a href="/page" onClick={(e) => {
  e.preventDefault();
  // 执行自定义逻辑，如路由跳转
  navigate('/page');
}}>链接</a>

// 阻止表单提交
<form onSubmit={(e) => {
  e.preventDefault();
  // 执行自定义提交逻辑
  handleSubmit();
}}>

// 阻止右键菜单
<div onContextMenu={(e) => {
  e.preventDefault();
  // 显示自定义右键菜单
}}>`}
                    </pre>
                  </Paragraph>
                  <Alert
                    message="重要区别"
                    description={
                      <div>
                        <p><Text strong>preventDefault()</Text>：阻止默认行为，事件仍会传播</p>
                        <p><Text strong>stopPropagation()</Text>：阻止事件传播，默认行为仍会发生（除非同时调用 preventDefault）</p>
                      </div>
                    }
                    type="info"
                    style={{ marginTop: 12 }}
                  />
                </div>
              </div>

              <Divider />

              {/* 4. React 事件系统 */}
              <div>
                <Title level={4}>4. React 中的事件系统（SyntheticEvent）</Title>
                <Paragraph>
                  React 使用<Text strong>合成事件（SyntheticEvent）</Text>系统，这是对原生 DOM 事件的跨浏览器封装。
                </Paragraph>
                <div style={{ marginLeft: 20 }}>
                  <Paragraph>
                    <Text strong>核心特性：</Text>
                    <ul>
                      <li><Text strong>事件委托</Text>：React 17 之前，所有事件都委托到 <Text code>document</Text>；React 17+ 委托到应用的根容器（root）</li>
                      <li><Text strong>跨浏览器兼容</Text>：统一了不同浏览器的事件 API，提供一致的接口</li>
                      <li><Text strong>性能优化</Text>：减少了事件监听器的数量，提高性能</li>
                      <li><Text strong>自动清理</Text>：组件卸载时自动移除事件监听器</li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>合成事件 vs 原生事件：</Text>
                    <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`// React 合成事件
<button onClick={(e) => {
  // e 是 SyntheticEvent，不是原生 Event
  console.log(e.nativeEvent); // 访问原生事件
  e.stopPropagation(); // React 封装的方法
}}>点击</button>

// 原生事件
button.addEventListener('click', (e) => {
  // e 是原生 Event
  e.stopPropagation();
});`}
                    </pre>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>访问原生事件：</Text>
                    <ul>
                      <li>通过 <Text code>e.nativeEvent</Text> 访问底层原生事件对象</li>
                      <li>合成事件在事件处理函数执行后会被回收，不能异步访问</li>
                      <li>如需异步访问，使用 <Text code>e.persist()</Text> 或保存需要的值</li>
                    </ul>
                  </Paragraph>
                </div>
              </div>

              <Divider />

              {/* 5. 事件委托 */}
              <div>
                <Title level={4}>5. 事件委托（Event Delegation）</Title>
                <Paragraph>
                  事件委托是一种优化技术，将事件监听器绑定到父元素上，利用事件冒泡机制处理子元素的事件。
                </Paragraph>
                <div style={{ marginLeft: 20 }}>
                  <Paragraph>
                    <Text strong>优势：</Text>
                    <ul>
                      <li><Text strong>性能优化</Text>：减少事件监听器数量，特别是对于动态列表</li>
                      <li><Text strong>内存节省</Text>：不需要为每个子元素绑定监听器</li>
                      <li><Text strong>动态元素</Text>：新添加的子元素自动具有事件处理能力</li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>代码示例：</Text>
                    <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`// React 中事件委托示例
const List = () => {
  const handleClick = (e: React.MouseEvent) => {
    // 通过 e.target 判断点击的是哪个子元素
    if ((e.target as HTMLElement).tagName === 'LI') {
      const id = (e.target as HTMLElement).dataset.id;
      console.log('点击了列表项:', id);
    }
  };

  return (
    <ul onClick={handleClick}>
      <li data-id="1">项目 1</li>
      <li data-id="2">项目 2</li>
      <li data-id="3">项目 3</li>
    </ul>
  );
};

// 原生 JS 事件委托
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('点击了:', e.target.textContent);
  }
});`}
                    </pre>
                  </Paragraph>
                </div>
              </div>

              <Divider />

              {/* 6. 实际应用场景 */}
              <div>
                <Title level={4}>6. 实际应用场景</Title>
                <div style={{ marginLeft: 20 }}>
                  <Paragraph>
                    <Text strong>场景 1：模态框点击外部关闭</Text>
                    <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`const Modal = ({ onClose, children }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    // 如果点击的是背景层（不是内容区域），则关闭
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="backdrop" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};`}
                    </pre>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>场景 2：下拉菜单点击外部关闭</Text>
                    <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };
  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);`}
                    </pre>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>场景 3：动态列表项点击</Text>
                    <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`// 使用事件委托，即使列表项是动态添加的也能正常工作
const TodoList = () => {
  const handleItemClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const item = (e.target as HTMLElement).closest('.todo-item');
    if (item) {
      const id = item.dataset.id;
      toggleTodo(id);
    }
  };

  return (
    <ul onClick={handleItemClick}>
      {todos.map(todo => (
        <li key={todo.id} className="todo-item" data-id={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
};`}
                    </pre>
                  </Paragraph>
                </div>
              </div>

              <Divider />

              {/* 7. 常见问题和陷阱 */}
              <div>
                <Title level={4}>7. 常见问题和陷阱</Title>
                <div style={{ marginLeft: 20 }}>
                  <Paragraph>
                    <Text strong>问题 1：异步访问合成事件</Text>
                    <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`// ❌ 错误：异步访问事件对象
const handleClick = (e: React.MouseEvent) => {
  setTimeout(() => {
    console.log(e.target); // null 或 undefined
  }, 1000);
};

// ✅ 正确：保存需要的值
const handleClick = (e: React.MouseEvent) => {
  const target = e.target;
  setTimeout(() => {
    console.log(target);
  }, 1000);
};

// ✅ 或者使用 e.persist()
const handleClick = (e: React.MouseEvent) => {
  e.persist();
  setTimeout(() => {
    console.log(e.target);
  }, 1000);
};`}
                    </pre>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>问题 2：stopPropagation 和 preventDefault 的区别混淆</Text>
                    <ul>
                      <li><Text code>stopPropagation()</Text>：阻止事件传播，但不阻止默认行为</li>
                      <li><Text code>preventDefault()</Text>：阻止默认行为，但不阻止事件传播</li>
                      <li>两者可以同时使用，互不影响</li>
                    </ul>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>问题 3：事件委托中的 e.target vs e.currentTarget</Text>
                    <ul>
                      <li><Text code>e.target</Text>：实际触发事件的元素（可能是子元素）</li>
                      <li><Text code>e.currentTarget</Text>：绑定事件监听器的元素（总是当前元素）</li>
                    </ul>
                    <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto', marginTop: 8 }}>
{`<div onClick={(e) => {
  console.log(e.target);        // 可能是 <button> 或 <span>
  console.log(e.currentTarget); // 总是 <div>
}}>
  <button>按钮</button>
</div>`}
                    </pre>
                  </Paragraph>
                </div>
              </div>

              <Divider />

              {/* 8. 最佳实践 */}
              <div>
                <Title level={4}>8. 最佳实践</Title>
                <div style={{ marginLeft: 20 }}>
                  <Paragraph>
                    <ul>
                      <li>优先使用事件委托处理动态列表，减少内存占用</li>
                      <li>在需要阻止事件传播时，明确使用 <Text code>stopPropagation()</Text></li>
                      <li>在需要阻止默认行为时，明确使用 <Text code>preventDefault()</Text></li>
                      <li>避免在捕获阶段使用事件处理，除非有特殊需求</li>
                      <li>使用 <Text code>e.currentTarget</Text> 而不是 <Text code>e.target</Text> 来获取绑定事件的元素</li>
                      <li>在异步操作中，提前保存事件对象的属性值</li>
                      <li>清理事件监听器，避免内存泄漏（React 会自动处理，但原生 JS 需要手动清理）</li>
                    </ul>
                  </Paragraph>
                </div>
              </div>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default EventPropagationDemo;

