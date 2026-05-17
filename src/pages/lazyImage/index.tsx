import { LazyImage } from '../../components/LazyImage';
import { Card, Space, Typography, Divider, Switch, Slider, Modal, Image } from 'antd';
import { useState } from 'react';

const { Title, Paragraph, Text } = Typography;

const RATIOS = [
  { w: 800, h: 600 },
  { w: 800, h: 450 },
  { w: 600, h: 800 },
  { w: 600, h: 600 },
  { w: 800, h: 533 },
];

interface ImageItem {
  id: number;
  src: string;
  thumb: string;
  alt: string;
}

function generateImages(count: number): ImageItem[] {
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const ratio = RATIOS[i % RATIOS.length];
    const tw = Math.round(ratio.w / 20);
    const th = Math.round(ratio.h / 20);
    return {
      id,
      src: `https://picsum.photos/seed/vg${id}/${ratio.w}/${ratio.h}`,
      thumb: `https://picsum.photos/seed/vg${id}/${tw}/${th}`,
      alt: `随机图片 ${id}`,
    };
  });
}

const TOTAL = 60;
const IMAGES = generateImages(TOTAL);

const LazyImageDemo: React.FC = () => {
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [rootMargin, setRootMargin] = useState(200);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');

  const handlePreview = (src: string) => {
    setPreviewSrc(src);
    setPreviewVisible(true);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={3}>图片懒加载 & 缩略图</Title>

      <Paragraph type="secondary">
        基于 Intersection Observer API 实现图片懒加载。图片进入视口前显示占位图标，
        加载中用缩略图提供模糊预览（blur-up），完整图加载后平滑过渡。
        点击图片可预览大图。打开 DevTools Network 面板观察请求时机。
      </Paragraph>

      <Divider />

      <Space size={24} wrap>
        <Space>
          <Text>缩略图模糊预览：</Text>
          <Switch checked={showThumbnail} onChange={setShowThumbnail} />
        </Space>
        <Space>
          <Text>预加载距离：{rootMargin}px</Text>
          <Slider
            style={{ width: 160 }}
            min={0}
            max={600}
            step={50}
            value={rootMargin}
            onChange={setRootMargin}
          />
        </Space>
        <Text type="secondary">共 {TOTAL} 张图片，滚动触发懒加载</Text>
      </Space>

      <Divider />

      <Title level={4}>图片网格</Title>
      <Paragraph type="secondary">
        缩略图仅 ~1KB，完整图 600-800px。缩略图放大后经 12px blur 形成柔和色块预览。
        点击任意图片可查看大图。
      </Paragraph>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {IMAGES.map((img) => (
          <Card
            key={img.id}
            size="small"
            hoverable
            onClick={() => handlePreview(img.src)}
            style={{ cursor: 'pointer' }}
          >
            <LazyImage
              src={img.src}
              thumbnail={showThumbnail ? img.thumb : undefined}
              alt={img.alt}
              height={200}
              rootMargin={`${rootMargin}px`}
            />
          </Card>
        ))}
      </div>

      <Divider />

      <Title level={4}>不同宽高比（固定尺寸）</Title>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <Text type="secondary">4:3</Text>
          <LazyImage
            src="https://picsum.photos/seed/ratio43/400/300"
            thumbnail={showThumbnail ? 'https://picsum.photos/seed/ratio43/20/15' : undefined}
            alt="4:3"
            width={320}
            height={240}
            rootMargin={`${rootMargin}px`}
            onClick={() => handlePreview('https://picsum.photos/seed/ratio43/400/300')}
          />
        </div>
        <div>
          <Text type="secondary">1:1</Text>
          <LazyImage
            src="https://picsum.photos/seed/ratio11/400/400"
            thumbnail={showThumbnail ? 'https://picsum.photos/seed/ratio11/20/20' : undefined}
            alt="1:1"
            width={240}
            height={240}
            rootMargin={`${rootMargin}px`}
            onClick={() => handlePreview('https://picsum.photos/seed/ratio11/400/400')}
          />
        </div>
        <div>
          <Text type="secondary">16:9</Text>
          <LazyImage
            src="https://picsum.photos/seed/ratio169/800/450"
            thumbnail={showThumbnail ? 'https://picsum.photos/seed/ratio169/40/23' : undefined}
            alt="16:9"
            width={400}
            height={225}
            rootMargin={`${rootMargin}px`}
            onClick={() => handlePreview('https://picsum.photos/seed/ratio169/800/450')}
          />
        </div>
        <div>
          <Text type="secondary">3:4 竖图</Text>
          <LazyImage
            src="https://picsum.photos/seed/ratio34/300/400"
            thumbnail={showThumbnail ? 'https://picsum.photos/seed/ratio34/15/20' : undefined}
            alt="3:4"
            width={180}
            height={240}
            rootMargin={`${rootMargin}px`}
            onClick={() => handlePreview('https://picsum.photos/seed/ratio34/300/400')}
          />
        </div>
      </div>

      <Divider />

      <Title level={4}>错误状态 & 点击重试</Title>
      <Paragraph type="secondary">模拟图片加载失败场景，点击错误区域可重新触发加载。</Paragraph>
      <LazyImage
        src="https://invalid.example.com/image.jpg"
        alt="加载失败的图片"
        width={400}
        height={200}
      />

      <Divider />

      <Title level={4}>自定义加载占位</Title>
      <Paragraph type="secondary">不传 thumbnail 默认显示骨架屏，也可通过 loadingComponent 自定义。</Paragraph>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <LazyImage
          src="https://picsum.photos/seed/custom1/600/400"
          thumbnail={showThumbnail ? 'https://picsum.photos/seed/custom1/30/20' : undefined}
          alt="默认骨架屏"
          width={400}
          height={200}
        />
        <LazyImage
          src="https://picsum.photos/seed/custom2/600/400"
          alt="自定义占位"
          width={400}
          height={200}
          loadingComponent={
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                zIndex: 2,
                fontSize: 14,
                color: '#1890ff',
              }}
            >
              正在加载图片...
            </div>
          }
        />
      </div>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="auto"
        centered
        styles={{ body: { padding: 0 } }}
      >
        <Image
          src={previewSrc}
          alt="预览"
          style={{ maxWidth: '80vw', maxHeight: '80vh' }}
          preview={false}
        />
      </Modal>
    </div>
  );
};

export default LazyImageDemo;
