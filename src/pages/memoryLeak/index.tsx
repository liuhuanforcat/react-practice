import { useState, useEffect, useRef } from 'react';
import { Button, Card, Space, Typography, Badge, Alert, Table, Tag, Statistic, Row, Col } from 'antd';
import { BugOutlined, CheckCircleOutlined, WarningOutlined, DashboardOutlined, SendOutlined } from '@ant-design/icons';
import usePerformanceMonitor from '../../hooks/usePerformanceMonitor';
import './index.less';

const { Title, Text } = Typography;

// 内存泄漏场景1：未清理的定时器
const LeakingTimerComponent = () => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      // 错误示例：定时器没有清理
      setInterval(() => {
        setCount(prev => prev + 1);
      }, 1000);
    }
  }, [isActive]);
  
  return (
    <Card title="场景1：未清理的定时器" size="small">
      <Space direction="vertical">
        <Text>计数器: {count}</Text>
        <Button 
          danger
          type="primary" 
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? '停止泄漏' : '开始泄漏'}
        </Button>
        <Text type="secondary" style={{ fontSize: 12 }}>
          每次点击开始都会创建新的定时器且不会清理
        </Text>
      </Space>
    </Card>
  );
};

// 内存泄漏场景2：未清理的事件监听器
const LeakingEventListenerComponent = () => {
  const [scrollCount, setScrollCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      const handleScroll = () => {
        setScrollCount(prev => prev + 1);
      };
      
      // 错误示例：没有移除事件监听器
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      window.addEventListener('mousemove', handleScroll);
    }
  }, [isActive]);
  
  return (
    <Card title="场景2：未清理的事件监听器" size="small">
      <Space direction="vertical">
        <Text>事件触发次数: {scrollCount}</Text>
        <Button 
          danger
          type="primary" 
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? '停止监听' : '开始监听泄漏'}
        </Button>
        <Text type="secondary" style={{ fontSize: 12 }}>
          监听器会一直存在，移动鼠标查看计数增加
        </Text>
      </Space>
    </Card>
  );
};

// 内存泄漏场景3：大量DOM节点不释放
const LeakingDOMComponent = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const createNodes = () => {
    const newNodes = [];
    for (let i = 0; i < 1000; i++) {
      newNodes.push({
        id: Date.now() + i,
        data: new Array(1000).fill('一些数据').join(',')
      });
    }
    // 错误示例：持续累加节点，从不清理
    setNodes(prev => [...prev, ...newNodes]);
  };
  
  return (
    <Card title="场景3：大量DOM节点累积" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text>当前节点数: {nodes.length}</Text>
        <Button danger type="primary" onClick={createNodes}>
          添加1000个节点（不清理）
        </Button>
        <div 
          ref={containerRef}
          style={{ 
            maxHeight: 200, 
            overflow: 'auto',
            border: '1px solid #d9d9d9',
            padding: 8
          }}
        >
          {nodes.map(node => (
            <div key={node.id} style={{ fontSize: 12 }}>
              节点 {node.id}
            </div>
          ))}
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          持续点击会累积大量DOM节点
        </Text>
      </Space>
    </Card>
  );
};

// 内存泄漏场景4：闭包引用大对象
const LeakingClosureComponent = () => {
  const [count, setCount] = useState(0);
  const bigDataRef = useRef<any[]>([]);
  
  const createClosure = () => {
    // 创建一个大对象
    const bigData = new Array(100000).fill(0).map((_, i) => ({
      id: i,
      data: 'some data'.repeat(100)
    }));
    
    bigDataRef.current.push(bigData);
    
    // 错误示例：闭包持续引用大对象
    setInterval(() => {
      console.log('闭包中的大对象长度:', bigData.length);
      setCount(prev => prev + 1);
    }, 2000);
  };
  
  return (
    <Card title="场景4：闭包引用大对象" size="small">
      <Space direction="vertical">
        <Text>已创建的大对象数量: {bigDataRef.current.length}</Text>
        <Text>定时器触发次数: {count}</Text>
        <Button danger type="primary" onClick={createClosure}>
          创建闭包泄漏
        </Button>
        <Text type="secondary" style={{ fontSize: 12 }}>
          每个闭包都会持有大对象引用，无法释放
        </Text>
      </Space>
    </Card>
  );
};

// 内存泄漏场景5：未清理的异步请求
const LeakingAsyncComponent = () => {
  const [data, setData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = () => {
    setIsLoading(true);
    
    // 错误示例：组件卸载后仍然执行setState
    setTimeout(() => {
      setData(prev => [...prev, `数据 ${Date.now()}`]);
      setIsLoading(false);
    }, 3000);
  };
  
  return (
    <Card title="场景5：未取消的异步请求" size="small">
      <Space direction="vertical">
        <Text>已加载数据条数: {data.length}</Text>
        <Button 
          danger
          type="primary" 
          onClick={fetchData}
          loading={isLoading}
        >
          发起异步请求
        </Button>
        <Text type="secondary" style={{ fontSize: 12 }}>
          快速切换页面会导致组件卸载后仍执行setState
        </Text>
      </Space>
    </Card>
  );
};

// 内存泄漏场景6：全局变量累积
let globalCache: any[] = [];

const LeakingGlobalComponent = () => {
  const [cacheSize, setCacheSize] = useState(0);
  
  const addToGlobal = () => {
    const data = new Array(10000).fill('数据').map((_, i) => ({
      id: i,
      value: Math.random()
    }));
    
    // 错误示例：往全局变量不断添加数据
    globalCache.push(data);
    setCacheSize(globalCache.length);
  };
  
  return (
    <Card title="场景6：全局变量累积" size="small">
      <Space direction="vertical">
        <Text>全局缓存大小: {cacheSize}</Text>
        <Button danger type="primary" onClick={addToGlobal}>
          添加到全局变量
        </Button>
        <Text type="secondary" style={{ fontSize: 12 }}>
          全局变量不会被垃圾回收
        </Text>
      </Space>
    </Card>
  );
};

// 正确示例：带清理的定时器
const CorrectTimerComponent = () => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isActive) {
      // 正确示例：保存定时器引用并清理
      timer = setInterval(() => {
        setCount(prev => prev + 1);
      }, 1000);
    }
    
    // 清理函数
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isActive]);
  
  return (
    <Card 
      title="✅ 正确示例：带清理的定时器" 
      size="small"
      style={{ borderColor: '#52c41a' }}
    >
      <Space direction="vertical">
        <Text>计数器: {count}</Text>
        <Button 
          type="primary"
          style={{ backgroundColor: '#52c41a' }}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? '停止' : '开始'}
        </Button>
        <Text type="success" style={{ fontSize: 12 }}>
          定时器会在组件卸载或状态改变时正确清理
        </Text>
      </Space>
    </Card>
  );
};

// 主组件
const MemoryLeakTest = () => {
  const [showLeakingComponents, setShowLeakingComponents] = useState(false);
  const [showCorrectExample, setShowCorrectExample] = useState(false);
  
  return (
    <div className="memory-leak-container">
      <div className="header">
        <Title level={2}>
          <BugOutlined /> 内存泄漏测试页面
        </Title>
        <Alert
          message="警告"
          description="此页面包含故意设计的内存泄漏场景，用于学习和测试。请在浏览器开发者工具的Performance/Memory标签中监控内存使用情况。"
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 20 }}
        />
      </div>
      
      <div className="instructions">
        <Card title="如何使用" size="small">
          <ol>
            <li>打开浏览器开发者工具（F12）</li>
            <li>切换到 Performance 或 Memory 标签</li>
            <li>点击"开始录制"或"Take snapshot"</li>
            <li>触发下面的内存泄漏场景</li>
            <li>观察内存使用情况的变化</li>
            <li>多次执行操作，查看内存是否持续增长</li>
          </ol>
        </Card>
      </div>
      
      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 20 }}>
        <Card title="内存泄漏场景展示" size="small">
          <Space style={{ marginBottom: 16 }}>
            <Button 
              danger
              type="primary"
              onClick={() => setShowLeakingComponents(!showLeakingComponents)}
            >
              {showLeakingComponents ? '隐藏泄漏场景' : '显示泄漏场景'}
            </Button>
            <Badge status="error" text="谨慎操作" />
          </Space>
          
          {showLeakingComponents && (
            <div className="leak-scenarios">
              <div className="scenario-grid">
                <LeakingTimerComponent />
                <LeakingEventListenerComponent />
                <LeakingDOMComponent />
                <LeakingClosureComponent />
                <LeakingAsyncComponent />
                <LeakingGlobalComponent />
              </div>
            </div>
          )}
        </Card>
        
        <Card title="正确实现示例" size="small">
          <Space style={{ marginBottom: 16 }}>
            <Button 
              type="primary"
              style={{ backgroundColor: '#52c41a' }}
              onClick={() => setShowCorrectExample(!showCorrectExample)}
            >
              {showCorrectExample ? '隐藏正确示例' : '显示正确示例'}
            </Button>
            <Badge status="success" text="安全使用" />
          </Space>
          
          {showCorrectExample && (
            <div className="correct-examples">
              <CorrectTimerComponent />
            </div>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default MemoryLeakTest;

