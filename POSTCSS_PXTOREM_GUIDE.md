# PostCSS PxToRem 适配方案

## 概述

本项目使用 `postcss-pxtorem` 插件实现移动端适配，自动将px单位转换为rem单位。

## 配置说明

### 1. PostCSS配置 (postcss.config.js)

```javascript
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16, // 基准字体大小
      propList: ['*'], // 转换所有属性
      selectorBlackList: ['.ignore'], // 不转换的选择器
      minPixelValue: 1, // 最小转换数值
      mediaQuery: false, // 不转换媒体查询中的px
      exclude: /node_modules/i, // 排除node_modules
    },
  },
};
```

### 2. Rem适配样式 (src/rem.less)

```less
/* 基准字体大小 */
html {
  font-size: 16px;
}

/* 移动端适配 */
@media screen and (max-width: 375px) {
  html { font-size: 16px; }
}

@media screen and (min-width: 376px) and (max-width: 414px) {
  html { font-size: 17.6px; }
}

@media screen and (min-width: 415px) and (max-width: 768px) {
  html { font-size: 20.48px; }
}

@media screen and (min-width: 769px) {
  html { font-size: 24px; }
}
```

## 使用方法

### 1. 直接使用px单位

在CSS中直接写px，插件会自动转换为rem：

```less
.my-component {
  font-size: 16px;        // 转换为 1rem
  padding: 20px;          // 转换为 1.25rem
  margin: 10px 0;         // 转换为 0.625rem 0
  width: 200px;           // 转换为 12.5rem
  height: 100px;          // 转换为 6.25rem
}
```

### 2. 避免转换

使用 `.ignore` 类名可以避免转换：

```less
.ignore {
  font-size: 16px; // 不会被转换
}

.no-convert {
  width: 100px; // 不会被转换
}
```

### 3. 转换公式

- **转换公式**: `rem = px / rootValue`
- **基准值**: 16px = 1rem
- **示例**: 
  - 32px → 2rem
  - 24px → 1.5rem
  - 8px → 0.5rem

## 测试页面

访问 `/rem-test` 路由查看适配效果：

- 字体大小测试
- 间距和盒子尺寸测试
- 按钮测试
- 响应式布局演示

## 适配效果

| 屏幕宽度 | 根字体大小 | 1rem实际大小 |
|---------|-----------|-------------|
| ≤375px  | 16px      | 16px        |
| 376-414px | 17.6px   | 17.6px      |
| 415-768px | 20.48px  | 20.48px     |
| ≥769px  | 24px      | 24px        |

## 最佳实践

1. **设计稿基准**: 以375px宽度为基准设计稿
2. **单位使用**: 直接使用px单位，让插件自动转换
3. **避免转换**: 边框、阴影等细节使用 `.ignore` 类
4. **测试验证**: 在不同设备上测试适配效果

## 注意事项

1. 插件会自动转换所有px单位
2. 媒体查询中的px不会被转换
3. node_modules中的文件不会被转换
4. 使用 `.ignore` 类可以避免特定元素被转换
