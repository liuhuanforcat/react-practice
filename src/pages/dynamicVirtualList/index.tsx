import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './index.less';

const OVERSCAN = 3;
const ESTIMATED_HEIGHT = 80;
const CONTAINER_HEIGHT = 500;

interface DataItem {
  id: number;
  title: string;
  content: string;
  avatar: string;
  tags: string[];
  likes: number;
}

const TAG_POOL = ['React', 'Vue', 'Angular', 'TypeScript', 'Node.js', 'CSS', 'Webpack', 'Vite', 'Docker', 'K8s', 'GraphQL', 'REST'];
const AVATAR_COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a18cd1'];

function generateMockData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => {
    const tagCount = Math.floor(Math.random() * 4) + 1;
    const shuffled = [...TAG_POOL].sort(() => Math.random() - 0.5);
    const lines = Math.floor(Math.random() * 3) + 1;
    const baseSentence = `这是第 ${i + 1} 条动态内容，展示了虚拟列表对不定高度元素的支持能力。`;

    return {
      id: i,
      title: `动态 #${i + 1}`,
      content: Array(lines).fill(baseSentence).join(''),
      avatar: AVATAR_COLORS[i % AVATAR_COLORS.length],
      tags: shuffled.slice(0, tagCount),
      likes: Math.floor(Math.random() * 500),
    };
  });
}

const DynamicVirtualList: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [data] = useState(() => generateMockData(5000));
  const [measuredHeights, setMeasuredHeights] = useState<Record<number, number>>({});
  const [scrollTop, setScrollTop] = useState(0);

  const getHeight = useCallback(
    (index: number) => measuredHeights[index] ?? ESTIMATED_HEIGHT,
    [measuredHeights]
  );

  const itemMetrics = useMemo(() => {
    const offsets: number[] = [];
    let offset = 0;
    for (let i = 0; i < data.length; i++) {
      offsets.push(offset);
      offset += getHeight(i);
    }
    const totalHeight = offset;
    return { offsets, totalHeight };
  }, [data.length, getHeight]);

  const findStartIndex = useCallback(
    (scrollTop: number) => {
      const { offsets } = itemMetrics;
      let low = 0;
      let high = data.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (offsets[mid] <= scrollTop) low = mid + 1;
        else high = mid - 1;
      }
      return Math.max(0, high);
    },
    [itemMetrics, data.length]
  );

  const startIndex = Math.max(0, findStartIndex(scrollTop) - OVERSCAN);

  const endIndex = useMemo(() => {
    const { offsets } = itemMetrics;
    let idx = startIndex;
    while (idx < data.length - 1 && offsets[idx] < scrollTop + CONTAINER_HEIGHT) {
      idx++;
    }
    return Math.min(data.length - 1, idx + OVERSCAN);
  }, [startIndex, scrollTop, itemMetrics, data.length]);

  const visibleItems = data.slice(startIndex, endIndex + 1);
  const measuredCount = Object.keys(measuredHeights).length;

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const updates: Record<number, number> = {};
      let hasUpdate = false;

      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        const index = Number(el.dataset.index);
        if (isNaN(index)) continue;

        const height = entry.borderBoxSize?.[0]?.blockSize ?? el.getBoundingClientRect().height;
        if (height > 0 && measuredHeights[index] !== height) {
          updates[index] = height;
          hasUpdate = true;
        }
      }

      if (hasUpdate) {
        setMeasuredHeights((prev) => ({ ...prev, ...updates }));
      }
    });

    itemRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const safeIndex = Math.max(0, Math.min(index, data.length - 1));
      const offset = itemMetrics.offsets[safeIndex] ?? 0;
      containerRef.current?.scrollTo({ top: offset, behavior: 'smooth' });
    },
    [data.length, itemMetrics.offsets]
  );

  const [jumpIndex, setJumpIndex] = useState('');

  return (
    <div className="dv-page">
      <div className="dv-header">
        <h1>动态高度虚拟列表</h1>
        <p className="dv-subtitle">
          原生实现，支持不定高度、ResizeObserver 自动测量、二分查找定位，共 {data.length.toLocaleString()} 条数据
        </p>
      </div>

      <div className="dv-toolbar">
        <div className="dv-stats">
          <div className="dv-stat">
            <span className="dv-stat-label">总数据</span>
            <span className="dv-stat-value">{data.length.toLocaleString()}</span>
          </div>
          <div className="dv-stat">
            <span className="dv-stat-label">渲染数</span>
            <span className="dv-stat-value accent">{visibleItems.length}</span>
          </div>
          <div className="dv-stat">
            <span className="dv-stat-label">已测量</span>
            <span className="dv-stat-value">{measuredCount}</span>
          </div>
          <div className="dv-stat">
            <span className="dv-stat-label">总高度</span>
            <span className="dv-stat-value">{(itemMetrics.totalHeight / 1000).toFixed(1)}k px</span>
          </div>
          <div className="dv-stat">
            <span className="dv-stat-label">区间</span>
            <span className="dv-stat-value accent">{startIndex} - {endIndex}</span>
          </div>
        </div>
        <div className="dv-jump">
          <input
            type="number"
            min={0}
            max={data.length - 1}
            placeholder={`跳转 0~${data.length - 1}`}
            value={jumpIndex}
            onChange={(e) => setJumpIndex(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && jumpIndex !== '') {
                scrollToIndex(Number(jumpIndex));
              }
            }}
          />
          <button onClick={() => jumpIndex !== '' && scrollToIndex(Number(jumpIndex))}>
            跳转
          </button>
          <button onClick={() => scrollToIndex(0)}>回顶部</button>
          <button onClick={() => scrollToIndex(data.length - 1)}>到底部</button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="dv-container"
        style={{ height: CONTAINER_HEIGHT }}
        onScroll={handleScroll}
      >
        <div style={{ height: itemMetrics.totalHeight, position: 'relative' }}>
          {visibleItems.map((item, i) => {
            const index = startIndex + i;
            return (
              <div
                key={item.id}
                data-index={index}
                ref={(el) => {
                  if (el) itemRefs.current.set(index, el);
                  else itemRefs.current.delete(index);
                }}
                className="dv-item"
                style={{
                  position: 'absolute',
                  top: itemMetrics.offsets[index],
                  left: 0,
                  right: 0,
                }}
              >
                <div className="dv-item-avatar" style={{ background: item.avatar }}>
                  {item.title.slice(-3)}
                </div>
                <div className="dv-item-body">
                  <div className="dv-item-header">
                    <span className="dv-item-title">{item.title}</span>
                    <span className="dv-item-likes">{item.likes}</span>
                  </div>
                  <div className="dv-item-content">{item.content}</div>
                  <div className="dv-item-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="dv-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dv-principles">
        <h3>实现原理</h3>
        <div className="dv-principle-grid">
          <div className="dv-principle">
            <div className="dv-principle-icon">1</div>
            <div>
              <h4>ResizeObserver 自动测量</h4>
              <p>每个列表项渲染后，通过 ResizeObserver 自动测量真实高度并记录，无需预设固定高度</p>
            </div>
          </div>
          <div className="dv-principle">
            <div className="dv-principle-icon">2</div>
            <div>
              <h4>累加偏移表</h4>
              <p>根据所有项的高度（已测量用真实值，未测量用估算值）累加生成每项的 top 偏移量，用于 absolute 定位</p>
            </div>
          </div>
          <div className="dv-principle">
            <div className="dv-principle-icon">3</div>
            <div>
              <h4>二分查找定位</h4>
              <p>监听滚动事件获取 scrollTop，通过二分查找在偏移表中快速定位当前可视区域的 startIndex</p>
            </div>
          </div>
          <div className="dv-principle">
            <div className="dv-principle-icon">4</div>
            <div>
              <h4>Overscan 缓冲区</h4>
              <p>在可视区域上下各多渲染 {OVERSCAN} 项，避免快速滚动时出现白屏闪烁</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicVirtualList;
