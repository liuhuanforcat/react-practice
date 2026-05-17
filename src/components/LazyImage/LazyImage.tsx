import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import './LazyImage.less';

export interface LazyImageProps {
  src: string;
  thumbnail?: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  rootMargin?: string;
  threshold?: number;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

const LazyImage: React.FC<LazyImageProps> = ({
  src,            // 完整图片地址
  thumbnail,      // 低分辨率缩略图，不传则不启用 blur-up
  alt,            // 图片描述（无障碍）
  width,          // 容器宽度
  height,         // 容器高度
  className = '', // 外层自定义 class
  style,          // 外层自定义样式
  rootMargin = '200px', // IntersectionObserver 预加载距离
  threshold = 0.01,     // 可见比例阈值，1% 可见即触发
  loadingComponent,     // 自定义加载占位，默认骨架屏 shimmer
  errorComponent,       // 自定义错误占位，默认显示重试提示
  onClick,        // 点击回调，自动添加 cursor: pointer
  onLoad,         // 图片加载成功回调
  onError,        // 图片加载失败回调
}) => {
  const [status, setStatus] = useState<ImageStatus>('idle');
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const handleLoad = useCallback(() => {
    setStatus('loaded');
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setStatus('error');
    onError?.();
  }, [onError]);

  useEffect(() => {
    if (!isInView) return;

    setStatus('loading');
    const img = new Image();
    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isInView, src, handleLoad, handleError]);

  const containerStyle: React.CSSProperties = {
    width,
    height,
    cursor: onClick ? 'pointer' : undefined,
    ...style,
  };

  const renderPlaceholder = () => {
    if (loadingComponent) return loadingComponent;
    return (
      <div className="lazy-image__skeleton">
        <div className="lazy-image__shimmer" />
      </div>
    );
  };

  const renderError = () => {
    if (errorComponent) return errorComponent;
    return (
      <div className="lazy-image__error" onClick={() => { setStatus('idle'); setIsInView(true); }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 9v4M12 17h.01" />
          <rect x="3" y="3" width="18" height="18" rx="3" />
        </svg>
        <span>加载失败，点击重试</span>
      </div>
    );
  };

  return (
    <div
      ref={imgRef}
      className={`lazy-image ${className}`}
      style={containerStyle}
      onClick={onClick}
    >
      {/* 未进入视口：占位图标 */}
      {!isInView && (
        <div className="lazy-image__pending">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
      )}

      {/* 加载中 & 无缩略图：骨架屏 */}
      {isInView && status === 'loading' && !thumbnail && renderPlaceholder()}

      {/* 加载失败：错误提示 */}
      {isInView && status === 'error' && renderError()}

      {/* 缩略图：进入视口后加载，完整图加载完毕后淡出 */}
      {isInView && thumbnail && (
        <img
          className={`lazy-image__thumbnail ${status === 'loaded' ? 'lazy-image__thumbnail--hidden' : ''}`}
          src={thumbnail}
          alt=""
          aria-hidden="true"
        />
      )}

      {/* 完整图片：进入视口后加载，加载完毕后淡入 */}
      {isInView && (
        <img
          className={`lazy-image__img ${status === 'loaded' ? 'lazy-image__img--loaded' : ''}`}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default LazyImage;
