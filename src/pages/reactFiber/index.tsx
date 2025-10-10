import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space, Divider, Alert, Progress, Typography, Row, Col, Tag, Timeline, Slider, Switch } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, ThunderboltOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './index.less';

const { Title, Text, Paragraph } = Typography;

// 模拟 Fiber 节点结构
interface FiberNode {
  type: string;
  key: string;
  child?: FiberNode;
  sibling?: FiberNode;
  return?: FiberNode;
  effectTag?: 'PLACEMENT' | 'UPDATE' | 'DELETION';
  props?: any;
  alternate?: FiberNode;
  stateNode?: any;
}

// 任务优先级
enum Priority {
  Immediate = 1,
  UserBlocking = 2,
  Normal = 3,
  Low = 4,
  Idle = 5,
}

interface Task {
  id: number;
  name: string;
  priority: Priority;
  duration: number;
  executed: boolean;
  progress: number;
}

const ReactFiber: React.FC = () => {
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string>('等待开始');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [enableTimeSlicing, setEnableTimeSlicing] = useState(true);
  const [frameTime, setFrameTime] = useState(16); // 每帧时间（毫秒）
  const [workLoopCount, setWorkLoopCount] = useState(0);
  const [fiberTreeDepth, setFiberTreeDepth] = useState(3);
  const animationFrameRef = useRef<number>();

  // 初始化任务列表
  useEffect(() => {
    resetTasks();
  }, []);

  const resetTasks = () => {
    const initialTasks: Task[] = [
      { id: 1, name: '用户输入响应', priority: Priority.Immediate, duration: 30, executed: false, progress: 0 },
      { id: 2, name: '动画更新', priority: Priority.UserBlocking, duration: 50, executed: false, progress: 0 },
      { id: 3, name: '数据获取', priority: Priority.Normal, duration: 100, executed: false, progress: 0 },
      { id: 4, name: '列表渲染', priority: Priority.Normal, duration: 200, executed: false, progress: 0 },
      { id: 5, name: '后台分析', priority: Priority.Low, duration: 150, executed: false, progress: 0 },
      { id: 6, name: '日志记录', priority: Priority.Idle, duration: 80, executed: false, progress: 0 },
    ];
    setTasks(initialTasks);
    setRenderProgress(0);
    setWorkLoopCount(0);
    setCurrentPhase('等待开始');
  };

  // 模拟 React 的工作循环（Work Loop）
  const startWorkLoop = () => {
    setIsRendering(true);
    setCurrentPhase('Render 阶段 - 协调（Reconciliation）');
    
    let taskIndex = 0;
    let elapsedTime = 0;
    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);

    const workLoop = () => {
      const startTime = performance.now();
      let shouldYield = false;

      // 时间切片：在一帧时间内尽可能多地执行任务
      while (taskIndex < sortedTasks.length && !shouldYield) {
        const task = sortedTasks[taskIndex];
        
        if (!task.executed) {
          // 模拟任务执行
          const taskProgress = Math.min(task.progress + 10, 100);
          task.progress = taskProgress;

          if (taskProgress >= 100) {
            task.executed = true;
            taskIndex++;
            setWorkLoopCount(prev => prev + 1);
          }

          // 更新任务状态
          setTasks([...tasks]);
        }

        // 检查是否需要让出控制权（时间切片）
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        
        if (enableTimeSlicing && elapsed >= frameTime) {
          shouldYield = true;
          setCurrentPhase(`时间切片 - 让出控制权 (${elapsed.toFixed(2)}ms)`);
        }
      }

      // 更新总体进度
      const completedTasks = sortedTasks.filter(t => t.executed).length;
      const progress = (completedTasks / sortedTasks.length) * 100;
      setRenderProgress(progress);

      // 如果还有未完成的任务，继续下一帧
      if (taskIndex < sortedTasks.length) {
        if (enableTimeSlicing) {
          // 使用 requestIdleCallback 或 requestAnimationFrame
          animationFrameRef.current = requestAnimationFrame(workLoop);
        } else {
          // 不启用时间切片，同步执行
          workLoop();
        }
      } else {
        // 所有任务完成，进入 Commit 阶段
        setCurrentPhase('Commit 阶段 - 提交更改到 DOM');
        setTimeout(() => {
          setCurrentPhase('完成！');
          setIsRendering(false);
        }, 500);
      }
    };

    workLoop();
  };

  const pauseWorkLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRendering(false);
    setCurrentPhase('已暂停');
  };

  // 生成 Fiber 树结构示例
  const generateFiberTree = (depth: number): FiberNode => {
    const createNode = (type: string, key: string, level: number): FiberNode => {
      const node: FiberNode = {
        type,
        key,
        props: { level }
      };

      if (level < depth) {
        // 创建子节点
        const child = createNode('div', `${key}-child`, level + 1);
        node.child = child;
        child.return = node;

        // 创建兄弟节点
        if (level < depth - 1) {
          const sibling = createNode('div', `${key}-sibling`, level + 1);
          node.sibling = sibling;
          sibling.return = node;
        }
      }

      return node;
    };

    return createNode('div', 'root', 0);
  };

  const fiberTree = generateFiberTree(fiberTreeDepth);

  // 渲染 Fiber 树的可视化
  const renderFiberNode = (node: FiberNode | undefined, level: number = 0): React.ReactNode => {
    if (!node) return null;

    return (
      <div key={node.key} style={{ marginLeft: level * 20 }}>
        <Tag color="blue" style={{ marginBottom: 8 }}>
          {node.type} ({node.key})
        </Tag>
        {node.child && renderFiberNode(node.child, level + 1)}
        {node.sibling && renderFiberNode(node.sibling, level)}
      </div>
    );
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.Immediate: return 'red';
      case Priority.UserBlocking: return 'orange';
      case Priority.Normal: return 'blue';
      case Priority.Low: return 'cyan';
      case Priority.Idle: return 'gray';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case Priority.Immediate: return '立即执行';
      case Priority.UserBlocking: return '用户阻塞';
      case Priority.Normal: return '普通';
      case Priority.Low: return '低优先级';
      case Priority.Idle: return '空闲';
    }
  };

  return (
    <div className="react-fiber-container">
      <Title level={2}>React Fiber 架构详解</Title>

      <Alert
        message="什么是 React Fiber？"
        description="Fiber 是 React 16 引入的新协调引擎，它能够将渲染工作分割成多个小任务，使得 React 可以在执行任务时暂停、终止或复用任务，从而实现更流畅的用户体验。"
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      {/* 核心概念 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="🎯 时间切片（Time Slicing）" bordered={false}>
            <Paragraph>
              将长任务分割成多个小任务，在浏览器空闲时执行，避免阻塞主线程。
            </Paragraph>
            <Tag color="green">requestIdleCallback</Tag>
            <Tag color="green">requestAnimationFrame</Tag>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="⚡ 优先级调度" bordered={false}>
            <Paragraph>
              根据任务的紧急程度分配不同的优先级，优先处理用户交互等高优先级任务。
            </Paragraph>
            <Tag color="red">Immediate</Tag>
            <Tag color="orange">UserBlocking</Tag>
            <Tag color="blue">Normal</Tag>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="🔄 可中断渲染" bordered={false}>
            <Paragraph>
              渲染过程可以被高优先级任务中断，完成后再继续执行未完成的低优先级任务。
            </Paragraph>
            <Tag color="purple">异步渲染</Tag>
            <Tag color="purple">增量渲染</Tag>
          </Card>
        </Col>
      </Row>

      {/* Fiber 工作循环演示 */}
      <Card title="Fiber 工作循环（Work Loop）演示" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Space>
              <Text strong>启用时间切片：</Text>
              <Switch 
                checked={enableTimeSlicing} 
                onChange={setEnableTimeSlicing}
                disabled={isRendering}
              />
            </Space>
          </Col>
          <Col span={12}>
            <Space>
              <Text strong>每帧时间：</Text>
              <Slider 
                style={{ width: 200 }} 
                min={5} 
                max={50} 
                value={frameTime}
                onChange={setFrameTime}
                disabled={isRendering}
              />
              <Text>{frameTime}ms</Text>
            </Space>
          </Col>
        </Row>

        <Divider />

        <div style={{ marginBottom: 16 }}>
          <Text strong>当前阶段：</Text>
          <Tag color={isRendering ? 'processing' : 'default'} style={{ marginLeft: 8 }}>
            {currentPhase}
          </Tag>
          <Tag color="cyan" style={{ marginLeft: 8 }}>
            工作循环次数：{workLoopCount}
          </Tag>
        </div>

        <Progress 
          percent={Math.round(renderProgress)} 
          status={isRendering ? 'active' : renderProgress === 100 ? 'success' : 'normal'}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />

        <Space style={{ marginTop: 16 }}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={startWorkLoop}
            disabled={isRendering}
          >
            开始渲染
          </Button>
          <Button
            icon={<PauseCircleOutlined />}
            onClick={pauseWorkLoop}
            disabled={!isRendering}
          >
            暂停
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={resetTasks}
            disabled={isRendering}
          >
            重置
          </Button>
        </Space>
      </Card>

      {/* 任务优先级调度 */}
      <Card title="任务优先级调度" style={{ marginTop: 24 }}>
        <Timeline>
          {tasks.map(task => (
            <Timeline.Item
              key={task.id}
              dot={task.executed ? <ThunderboltOutlined style={{ fontSize: '16px' }} /> : <ClockCircleOutlined />}
              color={task.executed ? 'green' : getPriorityColor(task.priority)}
            >
              <div>
                <Space>
                  <Text strong>{task.name}</Text>
                  <Tag color={getPriorityColor(task.priority)}>
                    {getPriorityLabel(task.priority)}
                  </Tag>
                  <Text type="secondary">{task.duration}ms</Text>
                </Space>
                <Progress 
                  percent={Math.round(task.progress)} 
                  size="small"
                  status={task.executed ? 'success' : 'active'}
                  showInfo={false}
                  style={{ width: 200, marginTop: 4 }}
                />
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Fiber 树结构 */}
      <Card title="Fiber 树结构" style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Text>树的深度：</Text>
            <Slider 
              style={{ width: 200 }} 
              min={1} 
              max={5} 
              value={fiberTreeDepth}
              onChange={setFiberTreeDepth}
            />
            <Text>{fiberTreeDepth}</Text>
          </Space>
        </div>
        <Divider />
        <div className="fiber-tree">
          {renderFiberNode(fiberTree)}
        </div>
        <Alert
          message="Fiber 节点关系"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li><Text code>child</Text>: 指向第一个子节点</li>
              <li><Text code>sibling</Text>: 指向下一个兄弟节点</li>
              <li><Text code>return</Text>: 指向父节点</li>
              <li><Text code>alternate</Text>: 指向另一棵树对应的节点（双缓冲）</li>
            </ul>
          }
          type="info"
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* Fiber 架构核心特性 */}
      <Card title="Fiber 架构核心特性" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card type="inner" title="双缓冲技术（Double Buffering）">
              <Paragraph>
                React 维护两棵 Fiber 树：
              </Paragraph>
              <ul>
                <li><Text code>current 树</Text>: 当前屏幕显示的内容</li>
                <li><Text code>workInProgress 树</Text>: 正在构建的新树</li>
              </ul>
              <Paragraph>
                通过 <Text code>alternate</Text> 属性连接，完成后交换指针，实现快速切换。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card type="inner" title="两个阶段">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Tag color="blue">Render 阶段（可中断）</Tag>
                  <Paragraph style={{ marginTop: 8 }}>
                    执行 Reconciliation 协调过程，找出需要更新的节点。
                    这个阶段是纯函数式的，可以被暂停和恢复。
                  </Paragraph>
                </div>
                <div>
                  <Tag color="orange">Commit 阶段（不可中断）</Tag>
                  <Paragraph style={{ marginTop: 8 }}>
                    将更改应用到 DOM，执行生命周期方法和副作用。
                    这个阶段必须同步完成，不能被中断。
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card type="inner" title="链表结构">
              <Paragraph>
                Fiber 使用链表而不是栈来存储任务：
              </Paragraph>
              <ul>
                <li>可以随时暂停和恢复遍历</li>
                <li>支持跳过某些节点</li>
                <li>便于实现优先级调度</li>
              </ul>
              <Text code>
                {'parent -> child -> sibling -> return'}
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card type="inner" title="Effect List（副作用链表）">
              <Paragraph>
                收集需要执行副作用的节点：
              </Paragraph>
              <ul>
                <li><Text code>PLACEMENT</Text>: 插入新节点</li>
                <li><Text code>UPDATE</Text>: 更新现有节点</li>
                <li><Text code>DELETION</Text>: 删除节点</li>
              </ul>
              <Paragraph>
                在 Commit 阶段按顺序执行这些副作用。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 代码示例 */}
      <Card title="Fiber 核心代码逻辑" style={{ marginTop: 24 }}>
        <pre className="code-block">
{`// Fiber 节点数据结构
interface Fiber {
  // 节点类型
  type: any;
  key: string | null;
  
  // 树形结构
  child: Fiber | null;
  sibling: Fiber | null;
  return: Fiber | null;
  
  // 双缓冲
  alternate: Fiber | null;
  
  // 副作用
  effectTag: 'PLACEMENT' | 'UPDATE' | 'DELETION' | null;
  nextEffect: Fiber | null;
  
  // 状态和属性
  memoizedState: any;
  memoizedProps: any;
  pendingProps: any;
  
  // 优先级
  lanes: Lanes;
  childLanes: Lanes;
}

// Work Loop 工作循环
function workLoop(deadline) {
  let shouldYield = false;
  
  while (nextUnitOfWork && !shouldYield) {
    // 执行一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    
    // 检查是否需要让出控制权
    shouldYield = deadline.timeRemaining() < 1;
  }
  
  // 如果还有工作，继续调度
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  } else if (pendingCommit) {
    // 进入 Commit 阶段
    commitRoot();
  }
}

// 执行工作单元
function performUnitOfWork(fiber: Fiber): Fiber | null {
  // 1. 开始工作（调用组件，获取 children）
  beginWork(fiber);
  
  // 2. 如果有子节点，返回子节点
  if (fiber.child) {
    return fiber.child;
  }
  
  // 3. 如果没有子节点，完成当前节点并查找兄弟节点
  let nextFiber = fiber;
  while (nextFiber) {
    completeWork(nextFiber);
    
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    
    nextFiber = nextFiber.return;
  }
  
  return null;
}

// 调度器（Scheduler）
function scheduleUpdateOnFiber(fiber: Fiber, lane: Lane) {
  // 标记更新
  const root = markUpdateLaneFromFiberToRoot(fiber, lane);
  
  // 确保 root 被调度
  ensureRootIsScheduled(root);
}

// 根据优先级调度
function ensureRootIsScheduled(root: FiberRoot) {
  const nextLanes = getNextLanes(root);
  const newCallbackPriority = getHighestPriorityLane(nextLanes);
  
  if (newCallbackPriority === SyncLane) {
    // 同步更新
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
  } else {
    // 异步更新
    const schedulerPriority = lanesToSchedulerPriority(newCallbackPriority);
    scheduleCallback(schedulerPriority, performConcurrentWorkOnRoot.bind(null, root));
  }
}`}
        </pre>
      </Card>

      {/* Fiber 带来的优势 */}
      <Card title="Fiber 架构的优势" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="advantage-item">
              <Title level={4}>🚀 性能提升</Title>
              <Paragraph>
                避免长时间阻塞主线程，保持 60fps 的流畅度，提升用户体验。
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="advantage-item">
              <Title level={4}>⚡ 更好的响应性</Title>
              <Paragraph>
                高优先级任务（如用户输入）可以打断低优先级任务，确保交互及时响应。
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="advantage-item">
              <Title level={4}>🎯 错误边界</Title>
              <Paragraph>
                更好的错误处理机制，可以捕获子组件的错误而不会导致整个应用崩溃。
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="advantage-item">
              <Title level={4}>🔄 并发模式</Title>
              <Paragraph>
                支持并发渲染，可以在后台准备多个版本的 UI，实现平滑的过渡。
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="advantage-item">
              <Title level={4}>📦 Suspense</Title>
              <Paragraph>
                支持异步组件和数据加载，提供更好的加载状态管理。
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="advantage-item">
              <Title level={4}>🎨 过渡动画</Title>
              <Paragraph>
                通过 useTransition 和 useDeferredValue 实现流畅的 UI 过渡。
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ReactFiber;

