# 图片懒加载 & 缩略图 技术文档

## 概述

`LazyImage` 组件实现了**视口懒加载** + **缩略图模糊预览（blur-up）** 的图片加载优化方案。图片仅在即将进入视口时才开始加载，同时用低分辨率缩略图提供即时的模糊预览，完整图片加载后平滑过渡。

## 核心技术

### Intersection Observer API

```tsx
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setIsInView(true);   // 触发图片加载
      observer.disconnect(); // 加载一次后立即断开，释放内存
    }
  },
  { rootMargin, threshold }
);
```

- **rootMargin**: 默认 `200px`，在图片距离视口 200px 时提前触发加载，用户滚动到位置时图片已就绪
- **threshold**: 默认 `0.01`，1% 可见即触发
- **disconnect**: 图片进入视口后立即断开 observer，避免内存泄漏

### 为什么不用原生 `loading="lazy"`

| 特性 | `loading="lazy"` | Intersection Observer |
|------|------------------|-----------------------|
| 加载时机 | 浏览器决定，无法控制距离 | 可精确控制 `rootMargin` |
| 加载状态 | 无回调 | 可跟踪 loading/loaded/error |
| 缩略图切换 | 无法介入 | 可在加载完成后切换 class |
| 兼容性 | Chrome 77+ | 所有现代浏览器 + polyfill |

原生 `loading="lazy"` 是一个简单的属性，无法满足"加载中显示缩略图、加载完淡入过渡"的需求。

## 状态机

```
idle ──[进入视口]──> loading ──[Image.onload]──> loaded
                       │
                       └──[Image.onerror]──> error ──[点击重试]──> idle
```

- **idle**: 图片未进入视口，显示占位图标，不发起任何网络请求
- **loading**: 已进入视口，开始加载。有缩略图则显示模糊缩略图，无缩略图则显示骨架屏 shimmer 动画
- **loaded**: 加载成功，完整图片 opacity 0→1 淡入，缩略图 opacity→0 淡出
- **error**: 加载失败，显示错误提示，点击重试回到 idle 重新触发

## 缩略图 Blur-up 方案

### 原理

借鉴 Medium 的图片加载体验：

1. 后端/构建时生成极低分辨率缩略图（如 40×30px，约 1KB）
2. 缩略图放大到容器尺寸后做 `filter: blur(12px)` + `scale(1.1)`，消除马赛克感，形成柔和色块
3. 完整图（800×600px）加载完成后 `opacity 0→1` 淡入覆盖

### CSS 层级设计

```
z-index: 4  __error        （错误提示，可点击）
z-index: 3  __img          （完整图片，loaded 时 opacity: 1）
z-index: 2  __thumbnail    （缩略图，loaded 时 opacity: 0 淡出）
z-index: 2  __skeleton     （骨架屏，无缩略图时显示）
z-index: 1  __pending      （未进入视口的占位图标）
```

### 过渡时序

```
进入视口 ─┬─ 缩略图立即渲染，小文件快速加载完成 → 模糊色块可见
          └─ 完整图开始加载（较大文件）

完整图加载完成 → img.onload 触发
  ├─ setStatus('loaded')
  ├─ __img--loaded: opacity 0→1  （0.4s ease，完整图淡入）
  └─ __thumbnail--hidden: opacity 1→0  （0.4s ease，缩略图淡出）
```

两个 transition 同时执行，在视觉上形成平滑的"模糊→清晰"过渡。

### 为什么缩略图也要懒加载

缩略图虽然只有 ~1KB，但列表中有几十张图片时，首屏同时发起几十个缩略图请求也不合理。组件中的缩略图同样受 `isInView` 控制，只有进入视口后才开始加载。

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | **必填** | 完整图片地址 |
| `thumbnail` | `string` | — | 低分辨率缩略图地址，不传则不启用 blur-up |
| `alt` | `string` | **必填** | 图片描述（无障碍） |
| `width` | `number \| string` | — | 容器宽度 |
| `height` | `number \| string` | — | 容器高度 |
| `className` | `string` | `''` | 外层 class |
| `style` | `CSSProperties` | — | 外层样式 |
| `rootMargin` | `string` | `'200px'` | 提前触发的距离，同 IntersectionObserver |
| `threshold` | `number` | `0.01` | 可见比例阈值 |
| `loadingComponent` | `ReactNode` | 骨架屏 | 自定义加载占位 |
| `errorComponent` | `ReactNode` | 错误+重试 | 自定义错误占位 |
| `onLoad` | `() => void` | — | 加载成功回调 |
| `onError` | `() => void` | — | 加载失败回调 |

### 三个自定义点

```
无缩略图时          有缩略图时           错误时
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  shimmer     │    │  模糊缩略图  │    │  ⚠ 点击重试  │
│  骨架屏动画  │    │  blur 12px  │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
     ↑                   ↑                  ↑
  loadingComponent   默认行为          errorComponent
  (可覆盖)          (无配置项)         (可覆盖)
```

## 使用示例

### 基础用法

```tsx
<LazyImage
  src="https://example.com/photo.jpg"
  thumbnail="https://example.com/photo_thumb.jpg"
  alt="风景照片"
  width={400}
  height={300}
/>
```

### 调整预加载距离

```tsx
{/* 图片进入视口前 500px 就开始加载，适合快速滚动的场景 */}
<LazyImage
  src="..."
  thumbnail="..."
  alt="..."
  rootMargin="500px"
/>
```

### 网格场景

```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
  {images.map(img => (
    <LazyImage
      key={img.id}
      src={img.src}
      thumbnail={img.thumb}
      alt={img.alt}
      height={220}
    />
  ))}
</div>
```

### 自定义占位和错误

```tsx
<LazyImage
  src="..."
  alt="..."
  loadingComponent={<MySpinner />}
  errorComponent={<MyErrorCard onRetry={...} />}
  onLoad={() => console.log('loaded')}
/>
```

## 性能考量

### 请求时机

| 阶段 | 缩略图请求 | 完整图请求 | 说明 |
|------|-----------|-----------|------|
| 页面加载 | ❌ | ❌ | 不发起任何图片请求 |
| 距视口 200px | ✅ | ✅ | observer 触发，两者同时开始加载 |
| 加载中 | 已完成 | 进行中 | 缩略图 ~1KB 几乎瞬间完成 |
| 加载完成 | 隐藏 | 显示 | 完整图淡入覆盖 |

### 取消请求

组件在 `useEffect` 清理函数中将 `img.onload` / `img.onerror` 置 `null`，结合 observer 的 `disconnect()`，避免组件卸载后的无效回调。

### 图片尺寸

缩略图建议尺寸：对应完整图的 **5%** 边长（如 800×600 → 40×30），经 blur 处理后仍有良好的视觉效果，文件大小约 1-2KB。

## 浏览器兼容性

`IntersectionObserver` 支持所有现代浏览器：

- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 15+

如需支持 IE，可使用 [polyfill](https://github.com/GoogleChromeLabs/intersection-observer)。

## 与虚拟滚动配合

懒加载只解决"何时请求图片"，不减少 DOM 节点数。当图片量大（数百张）时，需要配合**虚拟滚动**只渲染可视区域的 DOM。

### 职责分工

| 技术 | 解决的问题 | 手段 |
|------|-----------|------|
| 虚拟滚动 | DOM 节点过多 | 只渲染可视区 + 缓冲区的节点 |
| 懒加载 | 不必要的网络请求 | 节点渲染后，等进入视口才发请求 |
| 缩略图 | 加载中的白屏 | 先显示 1KB 模糊预览 |

两者是**正交的优化**：虚拟滚动管「渲染什么」，懒加载管「何时请求」。

### 配合方式

```
滚动 → 新节点挂载（虚拟滚动）→ LazyImage 检测进入视口（懒加载）→ 发起请求
```

不是所有的虚拟 DOM 节点一开始就在视口内 —— 虚拟滚动的缓冲区在视口上方和下方，缓冲区的图片挂载后可能还没进入视口。LazyImage 的 IntersectionObserver 作为第二层保障，确保只有真正可见的图片才发起请求。

### 实现参考

```tsx
function useVirtualGrid(itemCount, columnCount, rowHeight, overscan = 2) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  // 计算可见行范围
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    Math.ceil(itemCount / columnCount),
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan,
  );

  // 展开为可见图片的索引列表
  const visibleIndices = [];
  for (let row = startRow; row < endRow; row++) {
    for (let col = 0; col < columnCount; col++) {
      const idx = row * columnCount + col;
      if (idx < itemCount) visibleIndices.push(idx);
    }
  }

  return { visibleIndices, totalHeight, offsetY: startRow * rowHeight, ... };
}
```

```tsx
<div style={{ height: 600, overflow: 'auto' }} onScroll={onScroll}>
  <div style={{ height: totalHeight, position: 'relative' }}>
    <div style={{ position: 'absolute', top: offsetY }}>
      {visibleIndices.map(i => (
        <LazyImage key={i} src={images[i].src} thumbnail={images[i].thumb} />
      ))}
    </div>
  </div>
</div>
```

关键点：
- 容器固定高度 `600px` + `overflow: auto` 产生独立滚动上下文
- `totalHeight` 撑起滚动条（所有行 × 行高）
- `offsetY` 用 `position: absolute; top` 将可见行定位到正确位置
- `ResizeObserver` 监听容器宽度变化，动态调整列数
- `overscan = 2` 在视口上下各多渲染 2 行作为滚动缓冲
