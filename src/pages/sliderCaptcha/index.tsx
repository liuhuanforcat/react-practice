import { useEffect, useRef } from 'react';
import SliderCaptcha from '../../components/SliderCaptcha';
import './index.less';

function SliderCaptchaPage() {
  const captchaRef = useRef<SliderCaptcha | null>(null);

  useEffect(() => {
    const captcha = new SliderCaptcha({
      container: document.body,
      title: '安全验证',
      description: '向右拖动滑块填充拼图',
      tolerance: 10,
      minTime: 300,
      maxTime: 10000,
      puzzleSize: 50,
      canvasWidth: 320,
      canvasHeight: 180,
      onSuccess: (data) => {
        console.log('验证成功:', data);
        // alert(`验证成功！耗时: ${data.duration}ms`);
        // captchaRef.current.refresh();
      },
      onError: (data) => {
        console.log('验证失败:', data);
      },
      onCancel: () => {
        console.log('用户取消验证');
      }
    });

    captchaRef.current = captcha;
    captcha.init().catch(err => {
      console.error('验证码初始化失败:', err);
    });

    return () => {
      if (captchaRef.current) {
        captchaRef.current.destroy();
      }
    };
  }, []);

  const handleShow = () => {
    console.log('点击显示验证码按钮', captchaRef.current);
    if (captchaRef.current) {
      captchaRef.current.show();
    } else {
      console.error('验证码实例未初始化');
    }
  };

  return (
    <div className="slider-captcha-page">
      <div className="page-header">
        <h1>滑块验证码组件演示</h1>
        <p>这是一个完全前端实现的滑块验证码组件，无需后端支持</p>
      </div>

      <div className="demo-section">
        <h2>功能演示</h2>
        <div className="button-group">
          <button className="demo-btn" onClick={handleShow}>
            显示验证码
          </button>
        </div>
        <div className="tips">
          <h3>使用说明：</h3>
          <ul>
            <li>点击"显示验证码"按钮打开验证弹窗</li>
            <li>拖动滑块将拼图块移动到正确位置</li>
            <li>验证时间需要在 300ms - 10000ms 之间</li>
            <li>位置误差需要在 10 像素以内</li>
            <li>可以点击刷新按钮重新生成拼图</li>
            <li>可以点击关闭按钮取消验证</li>
          </ul>
        </div>
      </div>

      <div className="config-section">
        <h2>配置选项</h2>
        <div className="config-list">
          <div className="config-item">
            <strong>tolerance:</strong> 容差范围（像素），默认 10
          </div>
          <div className="config-item">
            <strong>minTime:</strong> 最小验证时间（毫秒），默认 300
          </div>
          <div className="config-item">
            <strong>maxTime:</strong> 最大验证时间（毫秒），默认 10000
          </div>
          <div className="config-item">
            <strong>puzzleSize:</strong> 拼图块大小，默认 50
          </div>
          <div className="config-item">
            <strong>canvasWidth:</strong> 画布宽度，默认 320
          </div>
          <div className="config-item">
            <strong>canvasHeight:</strong> 画布高度，默认 180
          </div>
        </div>
      </div>
    </div>
  );
}

export default SliderCaptchaPage;
