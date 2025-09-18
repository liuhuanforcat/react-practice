import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useInfiniteScroll } from 'ahooks';
import './index.less';

// 数据类型定义
interface ListItem {
  id: number;
  name: string;
  description: string;
  category: string;
  timestamp: string;
  status: string;
  avatar?: string;
}

// 自定义 Hook：无限滚动（基于容器计算）
const useCustomInfiniteScroll = (
  fetchMore: () => Promise<void>, 
  hasNextPage: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [scrollDebug, setScrollDebug] = useState({ 
    containerTop: 0, 
    containerBottom: 0, 
    windowHeight: 0, 
    distance: 0,
    scrollTop: 0
  });
  const fetchingRef = useRef(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    if (fetchingRef.current || !hasNextPage || !containerRef.current) return;

    // 获取容器信息
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 计算容器相对于视窗的位置
    const containerTop = rect.top;
    const containerBottom = rect.bottom;
    
    // 计算距离底部的距离（容器底部到视窗底部的距离）
    const distanceFromBottom = containerBottom - windowHeight;
    
    // 更新调试信息
    setScrollDebug({
      containerTop: Math.round(containerTop),
      containerBottom: Math.round(containerBottom),
      windowHeight: Math.round(windowHeight),
      distance: Math.round(distanceFromBottom),
      scrollTop: Math.round(scrollTop)
    });
    
    // 当容器底部接近视窗底部时触发加载（距离小于300px）
    if (distanceFromBottom < 300 && !isFetching) {
      console.log('🎯 触发无限滚动加载（基于容器）:', { 
        containerTop,
        containerBottom,
        windowHeight,
        distanceFromBottom,
        scrollTop,
        hasNextPage,
        isFetching 
      });
      
      fetchingRef.current = true;
      setIsFetching(true);
    }
  }, [hasNextPage, isFetching, containerRef]);

  // 滚动事件监听
  useEffect(() => {
    console.log('📌 添加滚动监听器（基于容器）');
    
    const handleScrollEvent = () => {
      handleScroll();
    };

    // 立即检查一次
    handleScroll();
    
    window.addEventListener('scroll', handleScrollEvent, { passive: true });
    
    return () => {
      console.log('🗑️ 移除滚动监听器');
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;
    
    const fetchData = async () => {
      try {
        console.log('开始加载更多数据...');
        await fetchMore();
        console.log('数据加载完成');
      } catch (error) {
        console.error('加载更多数据失败:', error);
      } finally {
        setIsFetching(false);
        fetchingRef.current = false;
      }
    };
    
    fetchData();
  }, [isFetching, fetchMore]);

  return { isFetching, scrollDebug };
};

// 使用 ahooks 的 useInfiniteScroll
const useAhooksInfiniteScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [scrollDebug, setScrollDebug] = useState({ 
    containerTop: 0, 
    containerBottom: 0, 
    windowHeight: 0, 
    distance: 0,
    scrollTop: 0
  });

  // 使用 ahooks 的 useInfiniteScroll
  const { data, loading, loadingMore, loadMore, noMore } = useInfiniteScroll(
    async (currentData) => {
      console.log('🚀 ahooks 触发数据加载，当前数据量:', currentData?.length || 0);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      const pageSize = 20;
      const currentPage = Math.floor((currentData?.length || 0) / pageSize);
      const start = currentPage * pageSize;
      
      // 模拟数据
      const newItems = Array.from({ length: pageSize }, (_, i) => ({
        id: start + i,
        name: `用户 ${start + i + 1}`,
        description: `这是第 ${start + i + 1} 位用户的详细信息，包含了个人简介和相关数据`,
        category: ['前端开发', '后端开发', '产品经理', 'UI设计师', '数据分析师'][Math.floor(Math.random() * 5)],
        timestamp: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
        status: Math.random() > 0.3 ? '在线' : '离线',
        avatar: generateAvatar(start + i)
      }));

      // 模拟最多10000条数据（500页）
      const isLastPage = currentPage >= 499;
      
      console.log(`✅ 加载第 ${currentPage + 1} 页数据，共 ${newItems.length} 条，是否最后一页: ${isLastPage}`);
      
      return {
        list: newItems,
        noMore: isLastPage
      };
    },
    {
      target: containerRef,
      threshold: 300, // 距离底部300px时触发
      isNoMore: (data) => data?.noMore || false,
    }
  );

  // 滚动调试信息
  useEffect(() => {
    if (!containerRef.current) return;

    const updateScrollDebug = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      setScrollDebug({
        containerTop: Math.round(rect.top),
        containerBottom: Math.round(rect.bottom),
        windowHeight: Math.round(windowHeight),
        distance: Math.round(rect.bottom - windowHeight),
        scrollTop: Math.round(scrollTop)
      });
    };

    const handleScroll = () => updateScrollDebug();
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollDebug(); // 立即更新一次

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);

  return { 
    data: data?.list || [], 
    loading, 
    isFetching: loadingMore, 
    scrollDebug,
    hasNextPage: !noMore,
    loadMore,
    totalLoaded: data?.list?.length || 0
  };
};

// 生成随机头像
const generateAvatar = (id: number) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
  const color = colors[id % colors.length];
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="${color}"/>
      <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${String.fromCharCode(65 + (id % 26))}</text>
    </svg>
  `)}`;
};

// 自定义 Hook：数据管理
const useListData = () => {
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // 模拟 API 调用
  const fetchData = useCallback(async (page = 0, isFirstLoad = false) => {
    try {
      if (isFirstLoad) {
        setLoading(true);
        setData([]);
        setCurrentPage(0);
      }

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      const pageSize = 20;
      const start = page * pageSize;
      
      // 模拟数据
      const newItems = Array.from({ length: pageSize }, (_, i) => ({
        id: start + i,
        name: `用户 ${start + i + 1}`,
        description: `这是第 ${start + i + 1} 位用户的详细信息，包含了个人简介和相关数据`,
        category: ['前端开发', '后端开发', '产品经理', 'UI设计师', '数据分析师'][Math.floor(Math.random() * 5)],
        timestamp: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
        status: Math.random() > 0.3 ? '在线' : '离线',
        avatar: generateAvatar(start + i)
      }));

      // 模拟最多10000条数据（500页），适合大数据场景测试
      if (page >= 499) {
        setHasNextPage(false);
      }

      if (isFirstLoad) {
        setData(newItems);
      } else {
        setData(prevData => [...prevData, ...newItems]);
      }
      
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMore = useCallback(async () => {
    if (hasNextPage) {
      return await fetchData(currentPage + 1);
    }
  }, [currentPage, hasNextPage, fetchData]);

  const refresh = useCallback(() => {
    setHasNextPage(true);
    return fetchData(0, true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    hasNextPage,
    fetchMore,
    refresh,
    currentPage: currentPage + 1,
    totalLoaded: data.length
  };
};

// 主组件
const LongListPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 使用 ahooks 的 useInfiniteScroll
  const { 
    data, 
    loading, 
    isFetching, 
    scrollDebug,
    hasNextPage,
    loadMore,
    totalLoaded 
  } = useAhooksInfiniteScroll(containerRef);

  // 滚动到指定位置
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="long-list-container" ref={containerRef}>
      {/* 头部 */}
      <div className="header">
        <div className="header-content">
          <h1 className="title">
            <span className="icon">👥</span>
            用户列表
          </h1>
          <p className="subtitle">无限滚动加载，支持大量数据展示</p>
        </div>
        
        {/* 统计信息 */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{totalLoaded}</div>
            <div className="stat-label">已加载用户</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{Math.ceil(totalLoaded / 20)}</div>
            <div className="stat-label">当前页码</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{hasNextPage ? '加载中' : '完成'}</div>
            <div className="stat-label">加载状态</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="actions">
          <button 
            onClick={scrollToTop}
            className="btn btn-primary"
          >
            ⬆️ 返回顶部
          </button>
          <button 
            onClick={loadMore}
            disabled={!hasNextPage || isFetching}
            className="btn btn-test"
          >
            🧪 手动加载更多
          </button>
        </div>

        {/* 调试信息面板 */}
        <div className="debug-panel">
          <h4>滚动调试信息（ahooks useInfiniteScroll）</h4>
          <div className="debug-info">
            <span>容器顶部: {scrollDebug.containerTop}px</span>
            <span>容器底部: {scrollDebug.containerBottom}px</span>
            <span>视窗高度: {scrollDebug.windowHeight}px</span>
            <span>距离底部: {scrollDebug.distance}px</span>
            <span>页面滚动: {scrollDebug.scrollTop}px</span>
            <span>加载状态: {isFetching ? '加载中' : '等待中'}</span>
            <span>是否有更多: {hasNextPage ? '是' : '否'}</span>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="user-list">
        {data.map((item, index) => {
          const isNearEnd = index >= data.length - 5;
          
          return (
            <div 
              key={item.id}
              className={`user-card ${isNearEnd ? 'near-end' : ''}`}
            >
              <div className="user-avatar">
                <img src={item.avatar} alt={item.name} />
                <div className={`status-dot ${item.status === '在线' ? 'online' : 'offline'}`}></div>
              </div>
              
              <div className="user-info">
                <div className="user-header">
                  <h3 className="user-name">{item.name}</h3>
                  <span className={`status-badge ${item.status === '在线' ? 'online' : 'offline'}`}>
                    {item.status}
                  </span>
                  {isNearEnd && (
                    <span className="trigger-badge">即将加载</span>
                  )}
                </div>
                <p className="user-description">{item.description}</p>
                <div className="user-meta">
                  <span className="category">{item.category}</span>
                  <span className="timestamp">{item.timestamp}</span>
                </div>
              </div>
              
              <div className="user-id">#{item.id}</div>
            </div>
          );
        })}
      </div>

      {/* 加载状态 */}
      {isFetching && hasNextPage && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <span>正在加载更多用户...</span>
        </div>
      )}

      {/* 加载完成提示 */}
      {!hasNextPage && data.length > 0 && (
        <div className="load-complete">
          🎉 已加载全部 {totalLoaded} 位用户
        </div>
      )}

      {/* 回到顶部按钮 */}
      {data.length > 10 && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top"
          title="返回顶部"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default LongListPage;
