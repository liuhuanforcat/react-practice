const DSL_SPEC = `
你输出的 JSON 必须严格符合以下结构（PageDSL）:

{
  "version": "1.0",
  "meta": {
    "route": string,      // 路由路径，如 "/platform/xxx"
    "title": string,      // 页面标题
    "description": string,// SEO 描述
    "keywords": string[]  // 可选：SEO 关键词
  },
  "sections": [           // 页面区块数组（按页面从上到下排列）
    {
      "id": string,       // 区块唯一标识，如 "hero-banner"
      "type": "banner" | "features" | "scenarios" | "capabilities" | "architecture" | "products" | "cta" | "timeline" | "contact" | "download" | "custom",
      "heading": string,     // 可选：区块标题
      "subheading": string,  // 可选：区块副标题/描述
      "background": string,  // 可选：背景色/图
      "items": [             // 可选：内容卡片列表
        {
          "title": string,
          "description": string,
          "icon": string       // 可选：图标名/图片路径
        }
      ],
      "actions": [           // 可选：行动按钮
        {
          "label": string,
          "href": string,
          "variant": "primary" | "secondary" | "outline" | "ghost"
        }
      ]
    }
  ]
}
`.trim();

const FEW_SHOT_EXAMPLE = `
【示例】
用户需求：
"我们需要一个融合通信产品介绍页面，包含顶部横幅、四大核心功能介绍、三个应用场景、以及底部的行动引导。"

DSL 输出：
{
  "version": "1.0",
  "meta": {
    "route": "/platform/fusion",
    "title": "融合通信解决方案",
    "description": "全能数字融合通信平台，集音视频、即时消息、数据协作于一体",
    "keywords": ["融合通信", "音视频", "即时消息", "数据协作"]
  },
  "sections": [
    {
      "id": "fusion-banner",
      "type": "banner",
      "heading": "融合通信解决方案",
      "subheading": "打破信息孤岛，实现全场景互联互通",
      "background": "/images/fusion/banner-bg.jpg",
      "actions": [
        { "label": "立即体验", "href": "/download", "variant": "primary" },
        { "label": "了解详情", "href": "#features", "variant": "outline" }
      ]
    },
    {
      "id": "fusion-features",
      "type": "features",
      "heading": "核心功能",
      "subheading": "四大能力构建统一通信底座",
      "items": [
        { "title": "音视频通话", "description": "高清低延迟的实时音视频通话能力", "icon": "video" },
        { "title": "即时消息", "description": "支持文字、图片、文件等多类型消息", "icon": "message" },
        { "title": "数据协作", "description": "实时文档协同与屏幕共享", "icon": "share" },
        { "title": "多端互通", "description": "PC、移动、Web 全平台覆盖", "icon": "devices" }
      ]
    },
    {
      "id": "fusion-scenarios",
      "type": "scenarios",
      "heading": "应用场景",
      "items": [
        { "title": "企业办公", "description": "远程会议与跨部门协作" },
        { "title": "智慧政务", "description": "政务审批与联合指挥" },
        { "title": "应急管理", "description": "突发事件的快速响应与调度" }
      ]
    },
    {
      "id": "fusion-cta",
      "type": "cta",
      "heading": "开启您的融合通信之旅",
      "subheading": "联系我们获取专属解决方案",
      "actions": [
        { "label": "联系销售", "href": "/about#contact", "variant": "primary" },
        { "label": "免费试用", "href": "/download", "variant": "secondary" }
      ]
    }
  ]
}
`.trim();

/**
 * 构建系统 Prompt：让模型扮演"业务分析师 + DSL 生成器"
 */
export function buildSystemPrompt(): string {
  return [
    "你是一个专业的网站业务分析师。",
    "你的任务：根据用户的自然语言需求，生成一份结构化的页面 DSL（JSON 格式），用于描述网页的结构和内容。",
    "",
    "## DSL 规范",
    DSL_SPEC,
    "",
    "## 输出要求",
    "1. 只输出一个合法的 JSON 对象，不要包含 markdown 代码块标记、解释文字或注释。",
    "2. 区块的 id 使用 kebab-case，语义清晰（如 'hero-banner'、'core-features'）。",
    "3. 根据需求合理推断页面路由、标题、关键词。",
    "4. 如果需求不明确的部分，用合理默认值填充，不要留空。",
    "5. sections 数组按页面从上到下的阅读顺序排列。",
    "",
    FEW_SHOT_EXAMPLE,
  ].join("\n");
}

/**
 * 构建用户消息
 */
export function buildUserPrompt(requirement: string): string {
  return `请将以下需求转为页面 DSL：\n\n${requirement}`;
}

/**
 * 构建修正 Prompt：校验失败后让模型修正
 */
export function buildFixPrompt(
  originalDSL: string,
  errors: string[]
): string {
  return [
    "你之前生成的 DSL 存在以下校验错误：",
    errors.map((e, i) => `${i + 1}. ${e}`).join("\n"),
    "",
    "原始 DSL：",
    originalDSL,
    "",
    "请修正上述错误，只输出修正后的合法 JSON，不要包含任何解释文字。",
  ].join("\n");
}

/**
 * 构建审查 Prompt：检查 DSL 是否完整覆盖需求
 */
export function buildReviewPrompt(
  requirement: string,
  dsl: string
): string {
  return [
    "请对照原始需求，审查以下 DSL 是否完整覆盖了所有要点。",
    "",
    "## 原始需求",
    requirement,
    "",
    "## 当前 DSL",
    dsl,
    "",
    '## 输出要求',
    "如果 DSL 完全覆盖需求，回复：{\"complete\": true, \"issues\": []}",
    '如果有遗漏或歧义，回复：{"complete": false, "issues": ["问题1", "问题2"]}',
    "只输出 JSON，不要解释。",
  ].join("\n");
}
