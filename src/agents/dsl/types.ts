// ─── 页面 DSL 类型定义 ───

/** 页面级元数据 */
export interface PageMeta {
  /** 路由路径，如 "/platform/fusion" */
  route: string;
  /** 页面标题 */
  title: string;
  /** SEO description */
  description: string;
  /** 页面关键词 */
  keywords?: string[];
}

/** 区块类型枚举 */
export type SectionType =
  | "banner"
  | "features"
  | "scenarios"
  | "capabilities"
  | "architecture"
  | "products"
  | "cta"
  | "timeline"
  | "contact"
  | "download"
  | "custom";

/** 单个内容项（特性卡片 / 场景卡片 / 能力项等） */
export interface ContentItem {
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 图标名或图片路径 */
  icon?: string;
  /** 附加属性（键值对） */
  extra?: Record<string, string>;
}

/** 页面区块定义 */
export interface SectionDSL {
  /** 区块唯一标识，如 "hero-banner" */
  id: string;
  /** 区块类型 */
  type: SectionType;
  /** 区块标题 */
  heading?: string;
  /** 区块副标题 / 描述 */
  subheading?: string;
  /** 背景图 / 背景色 */
  background?: string;
  /** 内容项列表 */
  items?: ContentItem[];
  /** 行动按钮 */
  actions?: ActionDSL[];
  /** 区块级自定义属性 */
  props?: Record<string, unknown>;
}

/** 行动按钮 */
export interface ActionDSL {
  label: string;
  /** 跳转链接或锚点 */
  href: string;
  /** 按钮样式变体 */
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

/** 页面 DSL 根节点 */
export interface PageDSL {
  /** DSL 版本 */
  version: "1.0";
  /** 页面元数据 */
  meta: PageMeta;
  /** 页面包含的区块（有序） */
  sections: SectionDSL[];
}

// ─── Agent 运行时类型 ───

/** Agent 返回的结果 */
export interface AgentResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的 DSL（成功时） */
  dsl?: PageDSL;
  /** 校验错误（失败时） */
  errors?: string[];
  /** 需要用户确认/澄清的问题 */
  clarifications?: string[];
}

/** Agent 配置 */
export interface AgentConfig {
  /** OpenAI 兼容接口的 base URL */
  apiBase: string;
  /** API Key */
  apiKey: string;
  /** 模型名称 */
  model: string;
  /** 温度参数 */
  temperature?: number;
  /** 最大重试（校验失败后让模型修正） */
  maxRetries?: number;
}
