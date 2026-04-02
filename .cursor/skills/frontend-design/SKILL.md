---


---
name: frontend-design-antd
description: 创建符合 Ant Design 规范的企业级中后台界面。使用此技能构建专业、规范、高效的管理系统界面。遵循蚂蚁金服设计语言，确保一致性和可用性，同时通过美学设计提升用户体验。
license: Complete terms in LICENSE.txt
--------------------------------------

本技能指导创建符合 Ant Design 设计体系的企业级中后台界面，确保专业性、一致性和高可用性。实现真实可用的代码，严格遵循 Ant Design 设计原则和最佳实践，同时通过美学设计提升界面质感和信息传达效率。

用户提供前端需求：组件、页面、应用或界面。可能包括业务场景、用户角色或技术约束。

## 设计思维

在编码前，理解业务场景并遵循 Ant Design 设计原则：

- **业务场景**: 解决什么业务问题？面向哪类用户（运营、管理员、数据分析师等）？
- **信息架构**: 数据如何组织？操作流程是什么？如何降低认知负荷？
- **交互模式**: 使用标准的 Ant Design 交互模式（表单、表格、卡片、步骤条等）
- **响应式需求**: 是否需要适配不同屏幕尺寸？
- **性能考量**: 大数据量场景的优化（虚拟滚动、分页、懒加载）

**核心原则**: 遵循 Ant Design 的「自然」、「确定性」、「意义感」、「生长性」四大设计价值观。

然后实现符合以下标准的生产级代码：

- 使用 Ant Design 组件库（antd）
- 遵循企业级代码规范
- 保证可访问性和可维护性
- 界面清晰、操作高效
- 注重美学细节，提升用户体验

## Ant Design 设计规范

### 布局系统

- **栅格系统**: 使用 24 栅格系统（Row、Col）进行响应式布局
- **通用布局**:
  - 顶部导航 + 侧边栏（Layout.Header + Layout.Sider + Layout.Content）
  - 顶部导航 + 面包屑（适合扁平结构）
  - 侧边栏导航（适合多层级结构）
- **间距规范**: 使用 8 的倍数（8px、16px、24px、32px）作为标准间距
- **页面布局**:
  - 列表页：筛选区 + 操作区 + 表格区
  - 详情页：顶部信息卡 + 标签页 + 内容区
  - 表单页：步骤条/标签页 + 表单区 + 底部操作区

### 组件使用

**数据展示类**:

- **Table**: 企业级表格，支持排序、筛选、分页、固定列
- **Descriptions**: 描述列表，用于详情展示
- **Card**: 卡片容器，组织信息模块
- **Statistic**: 统计数值展示
- **Timeline**: 时间轴，展示流程或历史记录

**数据录入类**:

- **Form**: 表单，配合 Form.Item 使用，支持验证
- **Input/InputNumber/Select/DatePicker**: 标准输入组件
- **Upload**: 文件上传，支持拖拽、裁剪、列表展示
- **Cascader/TreeSelect**: 级联选择，适合层级数据

**反馈类**:

- **Modal**: 模态框，用于二次确认或复杂表单
- **Drawer**: 抽屉，用于侧边详情或编辑
- **Message/Notification**: 全局提示
- **Spin**: 加载状态

**导航类**:

- **Menu**: 菜单导航，支持多级和折叠
- **Breadcrumb**: 面包屑导航
- **Tabs**: 标签页切换
- **Steps**: 步骤条，引导流程

### 视觉规范

**色彩体系**:

- **主色**: #1890ff（拂晓蓝），用于主要操作、链接
- **成功**: #52c41a（极光绿）
- **警告**: #faad14（日暮黄）
- **错误**: #f5222d（薄暮红）
- **中性色**:
  - 标题 rgba(0, 0, 0, 0.85)
  - 正文 rgba(0, 0, 0, 0.65)
  - 次要信息 rgba(0, 0, 0, 0.45)
  - 禁用 rgba(0, 0, 0, 0.25)
  - 边框 #d9d9d9
  - 背景 #f0f2f5

**字体规范**:

- **字体家族**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei'
- **字号标准**:
  - 页面标题: 20px
  - 卡片标题: 16px
  - 正文: 14px
  - 辅助文字: 12px
- **行高**: 1.5715（22px for 14px font）

**圆角规范**:

- 默认圆角: 2px
- 卡片/模态框: 2px
- 按钮: 2px

**阴影规范**:

- 一级阴影: 0 2px 8px rgba(0, 0, 0, 0.15)（卡片、下拉菜单）
- 二级阴影: 0 4px 12px rgba(0, 0, 0, 0.15)（模态框、抽屉）
- 三级阴影: 0 9px 28px rgba(0, 0, 0, 0.15)（Popover）

### 交互规范

**动效**:

- 使用 Ant Design 内置动效，保持一致性
- 页面切换: 淡入淡出，200-300ms
- 下拉展开: 滑动展开，300ms
- 模态框/抽屉: 缩放/滑入，300ms
- 避免过度动效，保持克制

**反馈**:

- 操作反馈: 所有操作必须有明确反馈（Message、Notification）
- 加载状态: 使用 Spin 或 Skeleton 显示加载
- 空状态: 使用 Empty 组件提供友好提示
- 错误处理: 表单验证、接口错误的清晰提示

**响应式**:

- 使用 Grid 组件适配不同屏幕
- 断点: xs(<576px), sm(≥576px), md(≥768px), lg(≥992px), xl(≥1200px), xxl(≥1600px)
- 移动端考虑触摸友好的操作区域

## 美学融合：提升信息可读性与界面质感

在遵循 Ant Design 规范的基础上，通过精细的美学设计提升界面品质感和用户体验。企业级应用不应该是冰冷的工具，而应该是优雅高效的工作伙伴。

### 排版美学：信息的呼吸感

**视觉层级的建立**:

```jsx
// 通过字号、字重、颜色建立清晰的信息层级
<div style={{
  fontSize: 20,
  fontWeight: 600,
  color: 'rgba(0, 0, 0, 0.85)',
  marginBottom: 8
}}>
  主标题 - 引导注意力
</div>
<div style={{
  fontSize: 14,
  color: 'rgba(0, 0, 0, 0.65)',
  lineHeight: 1.5715,
  marginBottom: 16
}}>
  正文内容 - 核心信息传达，使用合适的行高确保可读性
</div>
<div style={{
  fontSize: 12,
  color: 'rgba(0, 0, 0, 0.45)'
}}>
  辅助说明 - 次要信息
</div>
```

**文字排版原则**:

- **对齐一致性**: 左对齐为主，数字右对齐，保持视觉秩序
- **行长控制**: 每行 50-75 个字符（约 25-35 个汉字），提升阅读舒适度
- **段落间距**: 段落间距为行高的 1.5-2 倍，避免信息粘连
- **字重对比**: 使用 400（常规）和 600（加重）建立对比，避免使用过多字重
- **标点悬挂**: 中文标点在行首时适当缩进，保持边缘整齐

**表格排版优化**:

```jsx
// 优化表格可读性
<Table
  columns={[
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 180,
      // 使用等宽字体显示编号，提升对齐感
      render: (text) => <span style={{ fontFamily: 'Monaco, Consolas, monospace' }}>{text}</span>
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      align: 'right', // 数字右对齐
      render: (value) => (
        <span style={{ 
          fontFamily: 'DIN, Helvetica Neue, Arial',
          fontWeight: 600,
          color: value > 10000 ? '#f5222d' : 'rgba(0, 0, 0, 0.85)'
        }}>
          ¥{value.toLocaleString()}
        </span>
      )
    }
  ]}
  // 适当增加行高，避免拥挤
  rowClassName={() => 'custom-table-row'}
/>

<style>{`
  .custom-table-row td {
    padding: 16px !important;
  }
`}</style>
```

### 色彩美学：情感与信息的传递

**色彩层次系统**:

```jsx
// 基于 Ant Design 色板，建立更细腻的色彩层次
const colorSystem = {
  // 主色调 - 品牌感与重要操作
  primary: {
    default: '#1890ff',
    hover: '#40a9ff',
    active: '#096dd9',
    light: '#e6f7ff',     // 用于背景提示
    lighter: '#f0f9ff'    // 用于大面积背景
  },
  
  // 功能色 - 状态传达
  status: {
    success: '#52c41a',
    successBg: '#f6ffed',
    warning: '#faad14',
    warningBg: '#fffbe6',
    error: '#f5222d',
    errorBg: '#fff1f0',
    info: '#1890ff',
    infoBg: '#e6f7ff'
  },
  
  // 中性色 - 信息层级
  neutral: {
    title: 'rgba(0, 0, 0, 0.85)',      // 主标题
    primary: 'rgba(0, 0, 0, 0.65)',    // 正文
    secondary: 'rgba(0, 0, 0, 0.45)',  // 次要信息
    disabled: 'rgba(0, 0, 0, 0.25)',   // 禁用状态
    border: '#d9d9d9',                 // 边框
    divider: '#f0f0f0',                // 分割线
    background: '#fafafa',             // 背景
    container: '#ffffff'               // 容器背景
  }
};
```

**色彩使用原则**:

- **色彩克制**: 主色使用不超过页面 20%，避免视觉疲劳
- **情感传达**: 成功用绿色，警告用橙色，错误用红色，保持语义一致性
- **背景层次**: 使用 #ffffff（卡片）、#fafafa（页面）、#f0f2f5（整体背景）建立三层空间感
- **微妙渐变**: 在大面积背景使用极其微妙的渐变（2-3% 色差）增加质感

**色彩应用示例**:

```jsx
// 状态标签的精细化色彩设计
const StatusTag = ({ status }) => {
  const statusConfig = {
    success: { 
      bg: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
      color: '#52c41a',
      border: '#b7eb8f'
    },
    warning: { 
      bg: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)',
      color: '#faad14',
      border: '#ffe58f'
    },
    error: { 
      bg: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
      color: '#f5222d',
      border: '#ffa39e'
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 12px',
      background: config.bg,
      color: config.color,
      border: `1px solid ${config.border}`,
      borderRadius: 2,
      fontSize: 12,
      fontWeight: 500
    }}>
      {status}
    </span>
  );
};
```

**数据可视化色彩**:

```jsx
// 图表配色 - 使用和谐的色彩组合
const chartColors = {
  // 分类色板 - 用于饼图、柱状图等
  categorical: [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', 
    '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'
  ],
  
  // 渐进色板 - 用于热力图、渐变区域图
  sequential: {
    blue: ['#e6f7ff', '#bae7ff', '#91d5ff', '#69c0ff', '#40a9ff', '#1890ff', '#096dd9'],
    green: ['#f6ffed', '#d9f7be', '#b7eb8f', '#95de64', '#73d13d', '#52c41a', '#389e0d']
  }
};
```

### 间距美学：留白的艺术

**间距系统**:

```jsx
// 基于 8px 基准的间距体系
const spacing = {
  xs: 4,    // 极小间距 - 图标与文字
  sm: 8,    // 小间距 - 表单项内部、按钮组
  md: 16,   // 标准间距 - 卡片内边距、表单项之间
  lg: 24,   // 大间距 - 卡片之间、区块之间
  xl: 32,   // 超大间距 - 页面区域之间
  xxl: 48   // 极大间距 - 页面顶部、重要区块分隔
};
```

**留白原则**:

- **亲密性法则**: 相关元素距离近（8-16px），不相关元素距离远（24-48px）
- **呼吸空间**: 卡片内边距至少 24px，给内容留出呼吸空间
- **边界留白**: 页面边缘留白 24px，避免内容紧贴边缘
- **垂直节奏**: 使用一致的垂直间距（16px、24px、32px）建立韵律感

**间距应用示例**:

```jsx
// 优雅的卡片布局
<Card 
  style={{ 
    marginBottom: 24,
    padding: 0  // 重置默认padding
  }}
  bodyStyle={{
    padding: '24px 32px'  // 自定义内边距，增加宽松感
  }}
>
  {/* 标题区 */}
  <div style={{ marginBottom: 24 }}>
    <h3 style={{ 
      fontSize: 16, 
      fontWeight: 600,
      marginBottom: 8,
      color: 'rgba(0, 0, 0, 0.85)'
    }}>
      数据概览
    </h3>
    <p style={{ 
      fontSize: 14, 
      color: 'rgba(0, 0, 0, 0.45)',
      marginBottom: 0
    }}>
      最近 30 天的业务数据统计
    </p>
  </div>
  
  {/* 数据区 - 使用栅格控制间距 */}
  <Row gutter={[24, 16]}>
    <Col span={6}>
      <Statistic title="总销售额" value={112893} prefix="¥" />
    </Col>
    <Col span={6}>
      <Statistic title="订单数" value={1234} />
    </Col>
    <Col span={6}>
      <Statistic title="新增用户" value={567} />
    </Col>
    <Col span={6}>
      <Statistic title="转化率" value={25.8} suffix="%" />
    </Col>
  </Row>
</Card>

// 表单的韵律感
<Form
  layout="vertical"  // 垂直布局增加呼吸感
  style={{ maxWidth: 600 }}
>
  <Form.Item 
    label="项目名称" 
    name="name"
    style={{ marginBottom: 24 }}  // 增加表单项间距
  >
    <Input placeholder="请输入项目名称" />
  </Form.Item>
  
  <Form.Item 
    label="项目描述" 
    name="description"
    style={{ marginBottom: 24 }}
  >
    <Input.TextArea 
      rows={4} 
      placeholder="请输入项目描述"
      style={{ resize: 'none' }}  // 禁止拉伸，保持整洁
    />
  </Form.Item>
  
  {/* 操作按钮区 - 顶部留出更多空间 */}
  <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
    <Space size={12}>
      <Button type="primary" htmlType="submit">
        提交
      </Button>
      <Button>
        取消
      </Button>
    </Space>
  </Form.Item>
</Form>
```

### 质感提升技巧

**1. 微妙的投影与边框**:

```jsx
// 不同层级的卡片阴影
const elevationStyles = {
  // 平面 - 仅边框
  flat: {
    border: '1px solid #f0f0f0',
    boxShadow: 'none'
  },
  
  // 轻微抬起 - 用于普通卡片
  low: {
    border: '1px solid #f0f0f0',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)'
  },
  
  // 中度抬起 - 用于悬浮卡片
  medium: {
    border: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09), 0 4px 16px rgba(0, 0, 0, 0.06)'
  },
  
  // 高度抬起 - 用于模态框
  high: {
    border: 'none',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12), 0 9px 28px rgba(0, 0, 0, 0.08)'
  }
};

// 悬浮交互
<Card 
  style={{
    ...elevationStyles.low,
    transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = elevationStyles.medium.boxShadow;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = elevationStyles.low.boxShadow;
  }}
>
  内容
</Card>
```

**2. 精致的分割线**:

```jsx
// 多样化的分割方式
// 细线分割 - 轻量
<Divider style={{ margin: '24px 0', borderColor: '#f0f0f0' }} />

// 带文字分割 - 语义化
<Divider orientation="left" style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.45)' }}>
  基本信息
</Divider>

// 空间分割 - 使用背景色
<div style={{
  height: 8,
  background: '#fafafa',
  margin: '24px -24px'  // 负边距延伸到卡片边缘
}} />

// 渐变分割 - 高级感
<div style={{
  height: 1,
  background: 'linear-gradient(90deg, transparent 0%, #d9d9d9 50%, transparent 100%)',
  margin: '24px 0'
}} />
```

**3. 数据的视觉化强调**:

```jsx
// 关键数据的强调展示
<div style={{
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: 4
}}>
  <span style={{
    fontSize: 32,
    fontWeight: 600,
    fontFamily: 'DIN, Helvetica Neue, Arial',
    color: '#1890ff',
    lineHeight: 1
  }}>
    1,234
  </span>
  <span style={{
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.45)'
  }}>
    订单
  </span>
  <span style={{
    fontSize: 12,
    color: '#52c41a',
    marginLeft: 8
  }}>
    ↑ 12.5%
  </span>
</div>

// 进度条的精细设计
<div style={{
  width: '100%',
  height: 6,
  background: '#f0f0f0',
  borderRadius: 3,
  overflow: 'hidden',
  position: 'relative'
}}>
  <div style={{
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '68%',
    background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)',
    borderRadius: 3,
    transition: 'width 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)'
  }} />
</div>
```

**4. 图标与文字的和谐组合**:

```jsx
// 图标与文字的对齐
<Space size={8} align="center">
  <UserOutlined style={{ fontSize: 16, color: '#1890ff' }} />
  <span style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>
    管理员
  </span>
</Space>

// 图标按钮的精致设计
<button style={{
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: '1px solid #d9d9d9',
  borderRadius: 2,
  background: '#fff',
  cursor: 'pointer',
  transition: 'all 0.3s',
  ':hover': {
    borderColor: '#1890ff',
    color: '#1890ff'
  }
}}>
  <SettingOutlined style={{ fontSize: 16 }} />
</button>
```

**5. 加载与骨架屏的优雅过渡**:

```jsx
// 使用骨架屏保持布局稳定
{loading ? (
  <Card>
    <Skeleton 
      active 
      paragraph={{ rows: 4 }}
      title={{ width: '40%' }}
    />
  </Card>
) : (
  <Card>
    <h3>{data.title}</h3>
    <p>{data.content}</p>
  </Card>
)}

// 自定义加载动画
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 200,
  color: 'rgba(0, 0, 0, 0.25)'
}}>
  <Spin 
    indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
    tip="数据加载中..."
  />
</div>
```

### 美学检查清单

在完成界面设计后，使用以下清单检查美学细节：

**排版检查**:

- [ ] 信息层级是否清晰（标题、正文、辅助文字）？
- [ ] 字号、字重、颜色的对比是否合理？
- [ ] 行高是否适当（建议 1.5-1.8）？
- [ ] 段落间距是否舒适？
- [ ] 数字是否右对齐或使用等宽字体？

**色彩检查**:

- [ ] 主色使用是否克制（不超过 20%）？
- [ ] 功能色是否符合语义（成功/警告/错误）？
- [ ] 色彩对比度是否符合可访问性要求（至少 4.5:1）？
- [ ] 背景层次是否清晰（页面/卡片/内容）？
- [ ] 是否避免了过多的颜色（建议不超过 5 种）？

**间距检查**:

- [ ] 是否使用了一致的间距系统（8 的倍数）？
- [ ] 相关元素是否靠近，不相关元素是否分离？
- [ ] 卡片内边距是否充足（至少 24px）？
- [ ] 页面边缘是否有适当留白？
- [ ] 垂直间距是否有韵律感？

**质感检查**:

- [ ] 投影是否微妙且有层次？
- [ ] 边框颜色是否足够浅（避免过重）？
- [ ] 分割线是否清晰但不突兀？
- [ ] 交互状态是否有适当反馈？
- [ ] 过渡动画是否流畅（建议 0.3s）？

## 典型页面模式

**列表页**:

```jsx
<Card
  bordered={false}
  style={{
    borderRadius: 4,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
  }}
>
  {/* 筛选区 - 增加垂直间距 */}
  <Form layout="inline" style={{ marginBottom: 24 }}>
    <Form.Item label="状态" style={{ marginBottom: 16 }}>
      <Select style={{ width: 120 }} placeholder="请选择" />
    </Form.Item>
    <Form.Item label="日期" style={{ marginBottom: 16 }}>
      <RangePicker />
    </Form.Item>
    <Form.Item style={{ marginBottom: 16 }}>
      <Space size={12}>
        <Button type="primary">查询</Button>
        <Button>重置</Button>
      </Space>
    </Form.Item>
  </Form>
  
  {/* 操作区 - 使用分割线分隔 */}
  <div style={{ 
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: '1px solid #f0f0f0'
  }}>
    <Space size={12}>
      <Button type="primary" icon={<PlusOutlined />}>
        新建
      </Button>
      <Button icon={<UploadOutlined />}>
        批量导入
      </Button>
      <Button icon={<DownloadOutlined />}>
        导出
      </Button>
    </Space>
  </div>
  
  {/* 表格区 - 优化行高和边距 */}
  <Table
    columns={columns}
    dataSource={data}
    pagination={{ 
      pageSize: 10,
      showSizeChanger: true,
      showTotal: (total) => `共 ${total} 条`
    }}
    rowSelection={rowSelection}
    size="middle"  // 使用适中的行高
  />
</Card>
```

**表单页**:

```jsx
<Card 
  title="基本信息"
  bordered={false}
  style={{
    maxWidth: 800,
    margin: '0 auto',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
  }}
>
  <Form
    layout="horizontal"
    labelCol={{ span: 4 }}
    wrapperCol={{ span: 16 }}
    requiredMark={false}  // 使用自定义必填标记
  >
    <Form.Item 
      label={
        <span>
          <span style={{ color: '#f5222d', marginRight: 4 }}>*</span>
          项目名称
        </span>
      }
      name="name" 
      rules={[{ required: true }]}
      style={{ marginBottom: 24 }}
    >
      <Input placeholder="请输入项目名称" />
    </Form.Item>
  
    <Form.Item 
      label="项目描述" 
      name="description"
      style={{ marginBottom: 24 }}
    >
      <Input.TextArea 
        rows={4} 
        placeholder="请输入项目描述"
        showCount
        maxLength={200}
      />
    </Form.Item>
  
    {/* 分组标题 */}
    <Divider orientation="left" style={{ 
      fontSize: 14, 
      color: 'rgba(0, 0, 0, 0.85)',
      fontWeight: 600
    }}>
      高级设置
    </Divider>
  
    <Form.Item 
      label="项目类型" 
      name="type"
      style={{ marginBottom: 24 }}
    >
      <Select placeholder="请选择项目类型">
        <Select.Option value="web">Web 应用</Select.Option>
        <Select.Option value="mobile">移动应用</Select.Option>
      </Select>
    </Form.Item>
  
    {/* 操作按钮 - 顶部留白 */}
    <Form.Item 
      wrapperCol={{ offset: 4, span: 16 }}
      style={{ marginTop: 40, marginBottom: 0 }}
    >
      <Space size={12}>
        <Button type="primary" htmlType="submit" size="large">
          提交
        </Button>
        <Button size="large">
          取消
        </Button>
      </Space>
    </Form.Item>
  </Form>
</Card>
```

**详情页**:

```jsx
<>
  {/* 页头 - 增加视觉层次 */}
  <div style={{
    background: '#fff',
    padding: '24px 32px',
    marginBottom: 24,
    borderRadius: 2,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
  }}>
    <div style={{ marginBottom: 16 }}>
      <Space size={8}>
        <ArrowLeftOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
        <span style={{ fontSize: 20, fontWeight: 600 }}>订单详情</span>
      </Space>
    </div>
    <div style={{ 
      fontSize: 14, 
      color: 'rgba(0, 0, 0, 0.45)',
      marginBottom: 16
    }}>
      订单编号：#20230615001
    </div>
    <Space size={12}>
      <Button type="primary">审核通过</Button>
      <Button>驳回</Button>
      <Button icon={<DownloadOutlined />}>导出</Button>
    </Space>
  </div>
  
  {/* 基本信息卡片 */}
  <Card 
    title="基本信息" 
    bordered={false}
    style={{ 
      marginBottom: 24,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
    }}
  >
    <Descriptions column={2} colon={false}>
      <Descriptions.Item 
        label={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>订单号</span>}
      >
        <span style={{ fontFamily: 'Monaco, Consolas, monospace' }}>
          20230615001
        </span>
      </Descriptions.Item>
      <Descriptions.Item 
        label={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>状态</span>}
      >
        <Badge status="success" text="已完成" />
      </Descriptions.Item>
      <Descriptions.Item 
        label={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>创建时间</span>}
      >
        2023-06-15 14:30:00
      </Descriptions.Item>
      <Descriptions.Item 
        label={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>订单金额</span>}
      >
        <span style={{ 
          fontSize: 16, 
          fontWeight: 600,
          fontFamily: 'DIN, Helvetica Neue, Arial',
          color: '#f5222d'
        }}>
          ¥1,234.00
        </span>
      </Descriptions.Item>
    </Descriptions>
  </Card>
  
  {/* 订单明细 */}
  <Card 
    title="订单明细" 
    bordered={false}
    style={{ 
      marginBottom: 24,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
    }}
  >
    <Table 
      columns={columns} 
      dataSource={data} 
      pagination={false}
      size="middle"
    />
  </Card>
</>
```

## 代码质量要求

- **TypeScript**: 使用 TypeScript 增强类型安全
- **状态管理**: 合理使用 React Hooks (useState, useEffect, useMemo)
- **性能优化**: 避免不必要的渲染，使用 React.memo
- **代码组织**: 组件拆分合理，逻辑清晰
- **注释规范**: 关键业务逻辑添加注释
- **错误边界**: 处理异常情况，提供降级方案

## 可访问性

- 保证键盘可访问性
- 提供适当的 ARIA 标签
- 色彩对比度符合 WCAG 2.0 AA 标准（至少 4.5:1）
- 支持屏幕阅读器
- 焦点状态清晰可见

## 最佳实践

1. **保持一致性**: 同一系统内使用统一的交互模式和视觉风格
2. **减少认知负荷**: 信息分组清晰，操作流程符合直觉
3. **提供明确反馈**: 每个操作都要有清晰的结果反馈
4. **优雅降级**: 考虑网络异常、数据为空等边界情况
5. **移动优先**: 考虑响应式设计，适配不同设备
6. **性能为先**: 大数据量场景使用虚拟滚动、懒加载等优化手段
7. **注重细节**: 微妙的投影、合适的间距、精确的对齐能显著提升品质感
8. **渐进增强**: 基础功能优先，视觉美化其次，确保在各种环境下可用

记住：企业级中后台的核心是**效率、可靠性与美感的平衡**。界面应当清晰、规范、高效，同时通过精细的美学设计提升用户体验。遵循 Ant Design 规范的同时，注重排版、色彩、间距的细节打磨，让界面既专业又有温度。

---
