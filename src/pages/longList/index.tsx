import React, { useState, useRef, useEffect } from 'react';
import './index.less';

/**
 * 虚拟列表组件
 * 核心原理：只渲染可视区域内的列表项，而不是渲染全部列表项
 * 适用场景：大数据量列表渲染优化
 */

interface VirtualListProps {
  // 列表项高度（固定高度）
  itemHeight: number;
  // 容器高度
  containerHeight: number;
  // 总数据源
  data: any[];
  // 缓冲区数量（上下各渲染几个额外项，防止滚动时白屏）
  bufferSize?: number;
}

const VirtualList: React.FC<VirtualListProps> = ({
  itemHeight,
  containerHeight,
  data,
  bufferSize = 5,
}) => {
  // ==================== 状态定义 ====================
  
  // 当前滚动位置（滚动条距离顶部的距离）
  const [scrollTop, setScrollTop] = useState(0);
  
  // 容器引用
  const containerRef = useRef<HTMLDivElement>(null);

  // ==================== 核心计算步骤 ====================

  /**
   * 步骤1: 计算可视区域可以显示多少个列表项
   * 公式: Math.ceil(容器高度 / 列表项高度)
   * 
   * 举例：容器高度600px，每项高度50px
   * 计算：Math.ceil(600 / 50) = 12
   * 结果：可视区域最多显示12个列表项
   */
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  console.log('📊 步骤1 - 可视区域可显示项数:', visibleCount);

  /**
   * 步骤2: 计算当前滚动位置对应的起始索引
   * 公式: Math.floor(当前滚动距离 / 列表项高度)
   * 
   * 举例：滚动了250px，每项高度50px
   * 计算：Math.floor(250 / 50) = 5
   * 结果：第5项应该是第一个可见的项（从0开始计数）
   * 
   * 减去缓冲区：startIndex - bufferSize
   * 目的：提前渲染上方几个项，防止快速向上滚动时出现白屏
   */
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
  console.log('📍 步骤2 - 起始索引（含缓冲）:', startIndex, {
    scrollTop,
    计算索引: Math.floor(scrollTop / itemHeight),
    减去缓冲区: bufferSize,
  });

  /**
   * 步骤3: 计算结束索引
   * 公式: 起始索引 + 可视区域数量 + 缓冲区数量
   * 
   * 举例：起始索引0，可视12项，缓冲5项
   * 计算：0 + 12 + 5 = 17
   * 结果：渲染第0项到第17项（共18项）
   * 
   * 取最小值：确保不超过数据总长度
   */
  const endIndex = Math.min(
    data.length,
    startIndex + visibleCount + bufferSize
  );
  console.log('📍 步骤3 - 结束索引（含缓冲）:', endIndex, {
    startIndex,
    visibleCount,
    bufferSize,
    总计: startIndex + visibleCount + bufferSize,
  });

  /**
   * 步骤4: 计算实际需要渲染的列表项
   * 使用 slice(起始索引, 结束索引) 截取数据
   * 
   * 举例：data有1000项，起始0，结束17
   * 计算：data.slice(0, 17)
   * 结果：只渲染18项而不是1000项，大大提升性能
   */
  const visibleData = data.slice(startIndex, endIndex);
  console.log('✂️ 步骤4 - 实际渲染数据:', {
    总数据量: data.length,
    渲染起始: startIndex,
    渲染结束: endIndex,
    渲染数量: visibleData.length,
  });

  /**
   * 步骤5: 计算列表总高度
   * 公式: 数据总量 × 列表项高度
   * 
   * 举例：1000条数据，每项50px
   * 计算：1000 × 50 = 50000px
   * 作用：撑开容器，形成正确的滚动条高度
   */
  const totalHeight = data.length * itemHeight;
  console.log('📏 步骤5 - 列表总高度:', totalHeight, {
    数据量: data.length,
    单项高度: itemHeight,
  });

  /**
   * 步骤6: 计算可视区域的偏移量（关键！）
   * 公式: 起始索引 × 列表项高度
   * 
   * 举例：起始索引5，每项高度50px
   * 计算：5 × 50 = 250px
   * 作用：通过 transform: translateY() 将可视区域移动到正确位置
   * 原理：即使只渲染了部分项，也要让它们显示在正确的位置上
   */
  const offsetY = startIndex * itemHeight;
  console.log('📐 步骤6 - 偏移量计算:', offsetY, {
    startIndex,
    itemHeight,
    说明: '将渲染内容向下偏移，模拟真实位置',
  });

  // ==================== 事件处理 ====================

  /**
   * 滚动事件处理
   * 核心逻辑：获取滚动距离，更新 scrollTop 状态
   * 触发时机：每次滚动都会重新计算可视区域
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    console.log('🔄 滚动事件触发 - 新的scrollTop:', scrollTop);
    setScrollTop(scrollTop);
  };

  // ==================== 渲染结构 ====================

  return (
    <div className="virtual-list-demo">
      <div className="info-panel">
        <h3>📊 虚拟列表计算信息面板</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">总数据量:</span>
            <span className="value">{data.length} 条</span>
          </div>
          <div className="info-item">
            <span className="label">单项高度:</span>
            <span className="value">{itemHeight} px</span>
          </div>
          <div className="info-item">
            <span className="label">容器高度:</span>
            <span className="value">{containerHeight} px</span>
          </div>
          <div className="info-item">
            <span className="label">当前滚动距离:</span>
            <span className="value highlight">{scrollTop.toFixed(0)} px</span>
          </div>
          <div className="info-item">
            <span className="label">可视区域项数:</span>
            <span className="value">{visibleCount} 项</span>
          </div>
          <div className="info-item">
            <span className="label">缓冲区大小:</span>
            <span className="value">{bufferSize} 项</span>
          </div>
          <div className="info-item">
            <span className="label">起始索引:</span>
            <span className="value highlight">{startIndex}</span>
          </div>
          <div className="info-item">
            <span className="label">结束索引:</span>
            <span className="value highlight">{endIndex}</span>
          </div>
          <div className="info-item">
            <span className="label">实际渲染项数:</span>
            <span className="value success">{visibleData.length} 项</span>
          </div>
          <div className="info-item">
            <span className="label">列表总高度:</span>
            <span className="value">{totalHeight} px</span>
          </div>
          <div className="info-item">
            <span className="label">当前偏移量:</span>
            <span className="value highlight">{offsetY} px</span>
          </div>
          <div className="info-item">
            <span className="label">性能提升:</span>
            <span className="value success">
              {((1 - visibleData.length / data.length) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* 虚拟列表容器 */}
      <div
        ref={containerRef}
        className="virtual-list-container"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* 
          占位元素：撑开滚动区域
          高度 = 总数据量 × 单项高度
          作用：让滚动条显示正确的比例和位置
        */}
        <div
          className="virtual-list-phantom"
          style={{ height: totalHeight }}
        />

        {/* 
          实际渲染区域：只渲染可视区域内的项
          transform: translateY(偏移量)
          作用：将渲染的项移动到正确的视觉位置
        */}
        <div
          className="virtual-list-content"
          style={{
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleData.map((item, index) => {
            // 实际索引 = 起始索引 + 当前相对索引
            const actualIndex = startIndex + index;
            return (
              <div
                key={actualIndex}
                className="virtual-list-item"
                style={{ height: itemHeight }}
              >
                <div className="item-index">#{actualIndex}</div>
                <div className="item-content">
                  <div className="item-title">{item.title}</div>
                  <div className="item-desc">{item.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 计算步骤说明 */}
      <div className="calculation-steps">
        <h3>🧮 虚拟列表核心计算步骤</h3>
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>计算可视区域项数</h4>
            <code>visibleCount = Math.ceil(容器高度 / 单项高度)</code>
            <p>结果: {visibleCount} 项</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>计算起始索引</h4>
            <code>startIndex = Math.floor(滚动距离 / 单项高度) - 缓冲区</code>
            <p>结果: {startIndex}</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>计算结束索引</h4>
            <code>endIndex = startIndex + visibleCount + 缓冲区</code>
            <p>结果: {endIndex}</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h4>截取可视数据</h4>
            <code>visibleData = data.slice(startIndex, endIndex)</code>
            <p>结果: 渲染 {visibleData.length} 项</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">5</div>
          <div className="step-content">
            <h4>计算列表总高度</h4>
            <code>totalHeight = 数据总量 × 单项高度</code>
            <p>结果: {totalHeight} px</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">6</div>
          <div className="step-content">
            <h4>计算偏移量</h4>
            <code>offsetY = startIndex × 单项高度</code>
            <p>结果: {offsetY} px</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 主页面组件 ====================

const LongListPage: React.FC = () => {
  // 生成测试数据
  const mockData = Array.from({ length: 10000 }, (_, index) => ({
    id: index,
    title: `列表项 ${index + 1}`,
    description: `这是第 ${index + 1} 条数据的描述信息，用于演示虚拟列表的滚动效果`,
  }));

  return (
    <div className="long-list-page">
      <div className="page-header">
        <h1>🚀 虚拟列表（Virtual List）完整实现</h1>
        <p className="page-desc">
          本页面展示了虚拟列表的完整实现和计算步骤，共 {mockData.length.toLocaleString()} 条数据，
          但只渲染可视区域内的项，大幅提升性能。
        </p>
      </div>

      <VirtualList
        data={mockData}
        itemHeight={80}
        containerHeight={300}
        bufferSize={5}
      />

      {/* 技术要点说明 */}
      <div className="tech-points">
        <h3>💡 技术要点</h3>
        <ul>
          <li>
            <strong>核心原理：</strong>
            只渲染可视区域内的DOM节点，非可视区域不渲染，大幅减少DOM数量
          </li>
          <li>
            <strong>滚动处理：</strong>
            监听滚动事件，动态计算当前应该渲染哪些项
          </li>
          <li>
            <strong>位置模拟：</strong>
            通过一个占位元素撑开高度，通过 transform 定位实际渲染的元素
          </li>
          <li>
            <strong>缓冲区机制：</strong>
            在可视区域上下额外渲染几项，防止快速滚动时出现白屏
          </li>
          <li>
            <strong>性能优化：</strong>
            10000条数据只渲染约20条，性能提升 99.8%
          </li>
          <li>
            <strong>适用场景：</strong>
            大数据量列表、表格、聊天记录、商品列表等
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LongListPage;
