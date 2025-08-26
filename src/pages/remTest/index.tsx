import React from 'react';
import './index.less';

const RemTest: React.FC = () => {
  return (
    <div className="rem-test-page">
      <div className="container">
        <h1 className="title">PostCSS PxToRem 测试页面</h1>
        
        <div className="test-section">
          <h2>字体大小测试</h2>
          <p className="text-small">这是小字体 (14px)</p>
          <p className="text-normal">这是正常字体 (16px)</p>
          <p className="text-large">这是大字体 (18px)</p>
          <p className="text-xl">这是超大字体 (24px)</p>
        </div>

        <div className="test-section">
          <h2>间距测试</h2>
          <div className="spacing-demo">
            <div className="box small">小盒子 (100px × 100px)</div>
            <div className="box medium">中盒子 (200px × 200px)</div>
            <div className="box large">大盒子 (300px × 300px)</div>
          </div>
        </div>

        <div className="test-section">
          <h2>按钮测试</h2>
          <div className="button-demo">
            <button className="btn btn-small">小按钮</button>
            <button className="btn btn-medium">中按钮</button>
            <button className="btn btn-large">大按钮</button>
          </div>
        </div>

        <div className="test-section">
          <h2>说明</h2>
          <div className="info">
            <p>• 所有px单位都会被postcss-pxtorem自动转换为rem</p>
            <p>• 基准字体大小：16px</p>
            <p>• 转换公式：rem = px / 16</p>
            <p>• 使用.ignore类可以避免转换</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemTest;
