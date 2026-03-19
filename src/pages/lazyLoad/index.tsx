import React, { lazy, Suspense, useState, useCallback, useRef } from 'react';
import {
  Card,
  Typography,
  Button,
  Space,
  Spin,
  Alert,
  Tag,
  Tabs,
  Collapse,
  Divider,
  Row,
  Col,
  Skeleton,
  Timeline,
  Badge,
} from 'antd';
import {
  RocketOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  BugOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import ErrorBoundary from './components/ErrorBoundary';

const { Title, Paragraph, Text } = Typography;

const LazyChart = lazy(() => import('./components/HeavyChart'));
const LazyTable = lazy(() => import('./components/HeavyTable'));
const LazyForm = lazy(() => import('./components/HeavyForm'));
const LazyErrorComponent = lazy(() => import('./components/ErrorThrower'));

const LazyWithDelay = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) => {
      setTimeout(() => {
        resolve(import('./components/HeavyChart'));
      }, 2000);
    })
);

const LoadingFallback: React.FC<{ tip?: string }> = ({
  tip = '组件加载中...',
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
      gap: 16,
    }}
  >
    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
    <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14 }}>{tip}</span>
  </div>
);

const SkeletonFallback: React.FC = () => (
  <Card bordered={false}>
    <Skeleton active avatar paragraph={{ rows: 4 }} />
  </Card>
);

const codeExamples = {
  basic: `// 1. 基本用法：React.lazy + Suspense
import React, { lazy, Suspense } from 'react';

// lazy() 接受一个返回 Promise<{ default: Component }> 的函数
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    // Suspense 包裹懒加载组件，提供 fallback 加载状态
    <Suspense fallback={<Spin tip="加载中..." />}>
      <LazyComponent />
    </Suspense>
  );
}`,

  router: `// 2. 路由级懒加载（最常用场景）
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 每个页面都是独立的 lazy 组件
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`,

  errorBoundary: `// 3. ErrorBoundary 处理加载失败
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('组件加载失败:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>加载失败，请重试</div>;
    }
    return this.props.children;
  }
}

// 使用时套在 Suspense 外层
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>`,

  namedExport: `// 4. 处理命名导出 (named export)
// React.lazy 只支持 default export
// 如果组件使用 named export，需要中间模块转换

// 方法 1：中间模块
// MyComponent.ts (原始)
export const MyComponent = () => <div>Hello</div>;

// MyComponent.lazy.ts (中间模块)
export { MyComponent as default } from './MyComponent';

const Lazy = lazy(() => import('./MyComponent.lazy'));

// 方法 2：在 import 时转换
const Lazy = lazy(() =>
  import('./MyComponent').then(module => ({
    default: module.MyComponent
  }))
);`,

  preload: `// 5. 预加载策略
const LazyDashboard = lazy(() => import('./Dashboard'));

// 方法 1：鼠标悬停时预加载
function NavLink() {
  const preload = () => import('./Dashboard');
  
  return (
    <Link
      to="/dashboard"
      onMouseEnter={preload}  // hover 时就开始加载
      onFocus={preload}       // 键盘聚焦时也预加载
    >
      控制台
    </Link>
  );
}

// 方法 2：空闲时预加载
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    import('./Dashboard');
  });
}`,
};

const LazyLoadPage: React.FC = () => {
  const [showChart, setShowChart] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDelayed, setShowDelayed] = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  const loadTimesRef = useRef<Record<string, number>>({});
  const [loadTimes, setLoadTimes] = useState<Record<string, number>>({});

  const trackLoad = useCallback((name: string) => {
    if (!loadTimesRef.current[name]) {
      loadTimesRef.current[name] = performance.now();
    }
  }, []);

  const onComponentLoaded = useCallback((name: string) => {
    const start = loadTimesRef.current[name];
    if (start) {
      const duration = Math.round(performance.now() - start);
      setLoadTimes((prev) => ({ ...prev, [name]: duration }));
    }
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          <RocketOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          React 组件懒加载详解
        </Title>
        <Paragraph style={{ color: 'rgba(0,0,0,0.65)', fontSize: 14 }}>
          懒加载（Lazy Loading）是一种按需加载的优化策略。通过{' '}
          <Text code>React.lazy</Text> 和 <Text code>Suspense</Text>，
          可以将组件代码拆分成独立的 chunk，仅在需要时才下载和渲染，
          显著减少首屏加载时间。
        </Paragraph>
      </div>

      {/* 核心概念 */}
      <Card
        bordered={false}
        style={{
          marginBottom: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Title level={4} style={{ marginBottom: 24 }}>
          <ThunderboltOutlined
            style={{ marginRight: 8, color: '#faad14' }}
          />
          核心概念
        </Title>

        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card
              size="small"
              style={{
                background: '#e6f7ff',
                borderColor: '#91d5ff',
                height: '100%',
              }}
            >
              <div
                style={{ fontWeight: 600, marginBottom: 8, color: '#096dd9' }}
              >
                React.lazy()
              </div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
                接受一个函数，该函数需返回一个{' '}
                <Text code>{'Promise<{default: Component}>'}</Text>。
                通常配合动态 <Text code>import()</Text> 使用，Webpack/Vite
                会自动将其拆分为独立 chunk。
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              size="small"
              style={{
                background: '#f6ffed',
                borderColor: '#b7eb8f',
                height: '100%',
              }}
            >
              <div
                style={{ fontWeight: 600, marginBottom: 8, color: '#389e0d' }}
              >
                {'<Suspense>'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
                包裹懒加载组件，在组件代码下载期间显示{' '}
                <Text code>fallback</Text>{' '}
                指定的加载状态（如 Spin、Skeleton）。支持嵌套，可为不同区域设置不同的
                fallback。
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              size="small"
              style={{
                background: '#fff1f0',
                borderColor: '#ffa39e',
                height: '100%',
              }}
            >
              <div
                style={{ fontWeight: 600, marginBottom: 8, color: '#cf1322' }}
              >
                ErrorBoundary
              </div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
                懒加载可能因网络问题失败。用 ErrorBoundary
                包裹懒加载组件，可以捕获加载错误并显示降级 UI，避免整个页面崩溃。
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 工作原理 */}
      <Card
        bordered={false}
        style={{
          marginBottom: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Title level={4} style={{ marginBottom: 24 }}>
          <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          工作原理
        </Title>
        <Timeline
          items={[
            {
              color: '#1890ff',
              dot: <CodeOutlined style={{ fontSize: 16 }} />,
              children: (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    1. 代码分割 (Code Splitting)
                  </div>
                  <div style={{ color: 'rgba(0,0,0,0.65)' }}>
                    Vite/Webpack 遇到 <Text code>import()</Text>{' '}
                    动态导入语法时，会将目标模块拆分为独立的 JS 文件（chunk），
                    不会包含在主包中。
                  </div>
                </div>
              ),
            },
            {
              color: '#faad14',
              dot: <ClockCircleOutlined style={{ fontSize: 16 }} />,
              children: (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    2. 延迟加载 (Deferred Loading)
                  </div>
                  <div style={{ color: 'rgba(0,0,0,0.65)' }}>
                    懒组件首次渲染时，React 发起网络请求下载对应 chunk。在
                    chunk 下载完成前，Suspense 显示 fallback UI。
                  </div>
                </div>
              ),
            },
            {
              color: '#52c41a',
              dot: <CheckCircleOutlined style={{ fontSize: 16 }} />,
              children: (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    3. 渲染组件 (Render)
                  </div>
                  <div style={{ color: 'rgba(0,0,0,0.65)' }}>
                    chunk 下载并解析完成后，React 用真实组件替换 fallback。
                    后续再次渲染时无需重新下载（已缓存在内存中）。
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* 代码示例 */}
      <Card
        bordered={false}
        style={{
          marginBottom: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Title level={4} style={{ marginBottom: 24 }}>
          <CodeOutlined style={{ marginRight: 8, color: '#722ed1' }} />
          代码示例
        </Title>
        <Tabs
          items={[
            {
              key: 'basic',
              label: '基本用法',
              children: (
                <pre
                  style={{
                    background: '#fafafa',
                    padding: 16,
                    borderRadius: 4,
                    border: '1px solid #f0f0f0',
                    overflow: 'auto',
                    fontSize: 13,
                    lineHeight: 1.6,
                    fontFamily: 'Monaco, Consolas, monospace',
                  }}
                >
                  {codeExamples.basic}
                </pre>
              ),
            },
            {
              key: 'router',
              label: '路由级懒加载',
              children: (
                <pre
                  style={{
                    background: '#fafafa',
                    padding: 16,
                    borderRadius: 4,
                    border: '1px solid #f0f0f0',
                    overflow: 'auto',
                    fontSize: 13,
                    lineHeight: 1.6,
                    fontFamily: 'Monaco, Consolas, monospace',
                  }}
                >
                  {codeExamples.router}
                </pre>
              ),
            },
            {
              key: 'error',
              label: 'ErrorBoundary',
              children: (
                <pre
                  style={{
                    background: '#fafafa',
                    padding: 16,
                    borderRadius: 4,
                    border: '1px solid #f0f0f0',
                    overflow: 'auto',
                    fontSize: 13,
                    lineHeight: 1.6,
                    fontFamily: 'Monaco, Consolas, monospace',
                  }}
                >
                  {codeExamples.errorBoundary}
                </pre>
              ),
            },
            {
              key: 'named',
              label: '命名导出',
              children: (
                <pre
                  style={{
                    background: '#fafafa',
                    padding: 16,
                    borderRadius: 4,
                    border: '1px solid #f0f0f0',
                    overflow: 'auto',
                    fontSize: 13,
                    lineHeight: 1.6,
                    fontFamily: 'Monaco, Consolas, monospace',
                  }}
                >
                  {codeExamples.namedExport}
                </pre>
              ),
            },
            {
              key: 'preload',
              label: '预加载策略',
              children: (
                <pre
                  style={{
                    background: '#fafafa',
                    padding: 16,
                    borderRadius: 4,
                    border: '1px solid #f0f0f0',
                    overflow: 'auto',
                    fontSize: 13,
                    lineHeight: 1.6,
                    fontFamily: 'Monaco, Consolas, monospace',
                  }}
                >
                  {codeExamples.preload}
                </pre>
              ),
            },
          ]}
        />
      </Card>

      {/* 交互演示 */}
      <Card
        bordered={false}
        style={{
          marginBottom: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Title level={4} style={{ marginBottom: 8 }}>
          <ExperimentOutlined style={{ marginRight: 8, color: '#eb2f96' }} />
          交互演示
        </Title>
        <Paragraph
          style={{ color: 'rgba(0,0,0,0.45)', fontSize: 13, marginBottom: 24 }}
        >
          点击按钮加载组件，打开浏览器 DevTools → Network 面板可以看到独立的
          chunk 文件被按需下载
        </Paragraph>

        <Space wrap size={12} style={{ marginBottom: 24 }}>
          <Badge
            count={loadTimes['chart'] ? `${loadTimes['chart']}ms` : 0}
            style={{ backgroundColor: '#52c41a' }}
          >
            <Button
              type="primary"
              icon={<RocketOutlined />}
              onClick={() => {
                trackLoad('chart');
                setShowChart(true);
              }}
              disabled={showChart}
            >
              {showChart ? '图表已加载' : '加载图表组件'}
            </Button>
          </Badge>

          <Badge
            count={loadTimes['table'] ? `${loadTimes['table']}ms` : 0}
            style={{ backgroundColor: '#52c41a' }}
          >
            <Button
              icon={<RocketOutlined />}
              onClick={() => {
                trackLoad('table');
                setShowTable(true);
              }}
              disabled={showTable}
              style={{
                borderColor: '#52c41a',
                color: showTable ? undefined : '#52c41a',
              }}
            >
              {showTable ? '表格已加载' : '加载表格组件'}
            </Button>
          </Badge>

          <Badge
            count={loadTimes['form'] ? `${loadTimes['form']}ms` : 0}
            style={{ backgroundColor: '#52c41a' }}
          >
            <Button
              icon={<RocketOutlined />}
              onClick={() => {
                trackLoad('form');
                setShowForm(true);
              }}
              disabled={showForm}
              style={{
                borderColor: '#722ed1',
                color: showForm ? undefined : '#722ed1',
              }}
            >
              {showForm ? '表单已加载' : '加载表单组件'}
            </Button>
          </Badge>

          <Button
            danger
            icon={<BugOutlined />}
            onClick={() => {
              setShowError(true);
              setErrorKey((k) => k + 1);
            }}
          >
            加载错误组件
          </Button>

          <Button
            icon={<ClockCircleOutlined />}
            onClick={() => setShowDelayed(true)}
            disabled={showDelayed}
            style={{
              borderColor: '#faad14',
              color: showDelayed ? undefined : '#faad14',
            }}
          >
            {showDelayed ? '延迟组件已加载' : '加载延迟 2s 组件'}
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setShowChart(false);
              setShowTable(false);
              setShowForm(false);
              setShowError(false);
              setShowDelayed(false);
              setLoadTimes({});
              loadTimesRef.current = {};
            }}
          >
            重置全部
          </Button>
        </Space>

        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          {/* 图表组件 */}
          {showChart && (
            <ErrorBoundary>
              <Suspense
                fallback={<LoadingFallback tip="正在加载图表组件..." />}
              >
                <LazyLoadWrapper name="chart" onLoaded={onComponentLoaded}>
                  <LazyChart />
                </LazyLoadWrapper>
              </Suspense>
            </ErrorBoundary>
          )}

          {/* 表格组件 */}
          {showTable && (
            <ErrorBoundary>
              <Suspense fallback={<SkeletonFallback />}>
                <LazyLoadWrapper name="table" onLoaded={onComponentLoaded}>
                  <LazyTable />
                </LazyLoadWrapper>
              </Suspense>
            </ErrorBoundary>
          )}

          {/* 表单组件 */}
          {showForm && (
            <ErrorBoundary>
              <Suspense
                fallback={<LoadingFallback tip="正在加载表单组件..." />}
              >
                <LazyLoadWrapper name="form" onLoaded={onComponentLoaded}>
                  <LazyForm />
                </LazyLoadWrapper>
              </Suspense>
            </ErrorBoundary>
          )}

          {/* 错误组件 */}
          {showError && (
            <ErrorBoundary
              key={errorKey}
              onReset={() => setShowError(false)}
            >
              <Suspense fallback={<LoadingFallback tip="正在加载..." />}>
                <LazyErrorComponent />
              </Suspense>
            </ErrorBoundary>
          )}

          {/* 延迟加载组件 */}
          {showDelayed && (
            <ErrorBoundary>
              <Suspense
                fallback={
                  <LoadingFallback tip="人为延迟 2 秒加载中，模拟慢网络..." />
                }
              >
                <LazyWithDelay />
              </Suspense>
            </ErrorBoundary>
          )}

          {!showChart &&
            !showTable &&
            !showForm &&
            !showError &&
            !showDelayed && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 0',
                  color: 'rgba(0,0,0,0.25)',
                }}
              >
                <RocketOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div style={{ fontSize: 14 }}>
                  点击上方按钮加载组件，观察懒加载效果
                </div>
              </div>
            )}
        </Space>
      </Card>

      {/* 最佳实践 */}
      <Card
        bordered={false}
        style={{
          marginBottom: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Title level={4} style={{ marginBottom: 24 }}>
          <CheckCircleOutlined
            style={{ marginRight: 8, color: '#52c41a' }}
          />
          最佳实践
        </Title>
        <Collapse
          bordered={false}
          style={{ background: '#fafafa' }}
          items={[
            {
              key: '1',
              label: (
                <span style={{ fontWeight: 500 }}>
                  路由级别拆分（推荐）
                </span>
              ),
              children: (
                <div>
                  <Paragraph>
                    在路由层面使用 <Text code>React.lazy</Text>{' '}
                    是最自然的拆分点。每个路由页面独立打包，用户访问时才下载。
                  </Paragraph>
                  <Alert
                    type="success"
                    showIcon
                    message="项目中的路由配置（routers.ts）目前直接 import 了所有页面，建议改为 lazy 导入以优化首屏加载速度。"
                    style={{ marginBottom: 0 }}
                  />
                </div>
              ),
            },
            {
              key: '2',
              label: (
                <span style={{ fontWeight: 500 }}>
                  合理选择拆分粒度
                </span>
              ),
              children: (
                <Paragraph>
                  不是所有组件都适合懒加载。只有体积较大、非首屏必需的组件才值得拆分。
                  过度拆分会导致过多的网络请求，反而降低性能。一般建议：
                  <ul>
                    <li>
                      <Text strong>路由页面</Text>：几乎都应该懒加载
                    </li>
                    <li>
                      <Text strong>大型弹窗/抽屉内容</Text>：用户不一定会打开
                    </li>
                    <li>
                      <Text strong>图表/编辑器等重型库</Text>：体积大，按需加载收益高
                    </li>
                    <li>
                      <Text strong>小型通用组件</Text>：不建议懒加载，反而增加开销
                    </li>
                  </ul>
                </Paragraph>
              ),
            },
            {
              key: '3',
              label: (
                <span style={{ fontWeight: 500 }}>
                  优雅的加载状态
                </span>
              ),
              children: (
                <Paragraph>
                  使用 <Text code>Skeleton</Text>（骨架屏）代替简单的 Spin，
                  可以让页面切换更平滑。骨架屏的形状应与目标内容的布局保持一致，
                  避免「跳跃感」。
                </Paragraph>
              ),
            },
            {
              key: '4',
              label: (
                <span style={{ fontWeight: 500 }}>
                  预加载策略
                </span>
              ),
              children: (
                <Paragraph>
                  <ul>
                    <li>
                      <Text strong>Hover 预加载</Text>：鼠标悬停在导航链接上时触发{' '}
                      <Text code>import()</Text>
                    </li>
                    <li>
                      <Text strong>空闲预加载</Text>：使用{' '}
                      <Text code>requestIdleCallback</Text>{' '}
                      在浏览器空闲时预加载高概率访问的页面
                    </li>
                    <li>
                      <Text strong>可见性预加载</Text>：使用{' '}
                      <Text code>IntersectionObserver</Text>{' '}
                      在元素即将进入视口时预加载
                    </li>
                  </ul>
                </Paragraph>
              ),
            },
            {
              key: '5',
              label: (
                <span style={{ fontWeight: 500 }}>
                  错误处理
                </span>
              ),
              children: (
                <Paragraph>
                  网络问题可能导致 chunk 下载失败。务必使用 ErrorBoundary
                  捕获错误并提供重试机制。生产环境还应考虑 chunk hash
                  变化导致的 404（部署更新后旧版本 chunk 不存在），
                  可通过监听加载错误自动刷新页面。
                </Paragraph>
              ),
            },
          ]}
        />
      </Card>

      {/* 对比说明 */}
      <Card
        bordered={false}
        style={{
          marginBottom: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Title level={4} style={{ marginBottom: 24 }}>
          懒加载 vs 直接导入
        </Title>
        <Row gutter={24}>
          <Col span={12}>
            <Card
              size="small"
              title={
                <span>
                  <Tag color="red">直接导入</Tag> import Component from '...'
                </span>
              }
              style={{ borderColor: '#ffa39e' }}
            >
              <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 2.2 }}>
                <li>所有组件打包进主 bundle</li>
                <li>首屏加载全部代码</li>
                <li>首屏体积大，加载慢</li>
                <li>不需要 Suspense 和 ErrorBoundary</li>
                <li>代码简单，无额外复杂度</li>
              </ul>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              size="small"
              title={
                <span>
                  <Tag color="green">懒加载</Tag> lazy(() =&gt; import('...'))
                </span>
              }
              style={{ borderColor: '#b7eb8f' }}
            >
              <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 2.2 }}>
                <li>组件拆分为独立 chunk</li>
                <li>按需下载，首屏仅加载必要代码</li>
                <li>首屏体积小，加载快</li>
                <li>需要 Suspense 提供加载状态</li>
                <li>建议 ErrorBoundary 处理加载失败</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>

      <Divider />
      <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.25)', paddingBottom: 24 }}>
        本页面自身也是通过 React.lazy 懒加载的 —— 查看路由配置验证
      </div>
    </div>
  );
};

const LazyLoadWrapper: React.FC<{
  name: string;
  onLoaded: (name: string) => void;
  children: React.ReactNode;
}> = ({ name, onLoaded, children }) => {
  const calledRef = useRef(false);
  if (!calledRef.current) {
    calledRef.current = true;
    requestAnimationFrame(() => onLoaded(name));
  }
  return <>{children}</>;
};

export default LazyLoadPage;
