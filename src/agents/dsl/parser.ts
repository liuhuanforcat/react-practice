import OpenAI from "openai";
import type { AgentConfig, AgentResult, PageDSL } from "./types";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildFixPrompt,
  buildReviewPrompt,
} from "./prompts";
import { extractJSON, validateDSL } from "./validator";

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

/**
 * 调用 LLM 的底层方法
 */
async function callLLM(
  client: OpenAI,
  model: string,
  messages: ChatMessage[],
  temperature: number
): Promise<string> {
  const resp = await client.chat.completions.create({
    model,
    messages,
    temperature,
    response_format: { type: "json_object" },
  });

  return resp.choices[0]?.message?.content ?? "";
}

/**
 * 核心流程：自然语言需求 → PageDSL
 *
 * 1. 发送系统 Prompt + 用户需求 → 模型生成 DSL
 * 2. 校验 DSL；失败则带错误信息让模型修正（最多 maxRetries 次）
 * 3. 审查 DSL 完整性，返回可能需要澄清的问题
 */
export async function parseToDSL(
  requirement: string,
  config: AgentConfig
): Promise<AgentResult> {
  const {
    apiBase,
    apiKey,
    model,
    temperature = 0.2,
    maxRetries = 2,
  } = config;

  // 前端环境下使用 OpenAI SDK，需要显式开启 dangerouslyAllowBrowser
  // 注意：这会在浏览器中使用 API Key，仅适用于本地调试或已采取其他安全措施的场景。
  const client = new OpenAI({
    baseURL: apiBase,
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const messages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt() },
    { role: "user", content: buildUserPrompt(requirement) },
  ];

  // ── Step 1: 首次生成 ──
  let rawOutput = await callLLM(client, model, messages, temperature);
  let validation = validateDSL(rawOutput);

  // ── Step 2: 失败则修正 ──
  let retries = 0;
  while (!validation.valid && retries < maxRetries) {
    retries++;
    const fixMsg: ChatMessage = {
      role: "user",
      content: buildFixPrompt(
        extractJSON(rawOutput),
        validation.errors ?? []
      ),
    };
    messages.push({ role: "assistant", content: rawOutput }, fixMsg);

    rawOutput = await callLLM(client, model, messages, temperature);
    validation = validateDSL(rawOutput);
  }

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  const dsl = validation.data as PageDSL;

  // ── Step 3: 完整性审查 ──
  const clarifications = await reviewDSL(
    client,
    model,
    requirement,
    dsl,
    temperature
  );

  return {
    success: true,
    dsl,
    clarifications: clarifications.length > 0 ? clarifications : undefined,
  };
}

/**
 * 审查 DSL 是否完整覆盖需求
 */
async function reviewDSL(
  client: OpenAI,
  model: string,
  requirement: string,
  dsl: PageDSL,
  temperature: number
): Promise<string[]> {
  try {
    const reviewOutput = await callLLM(
      client,
      model,
      [
        {
          role: "system",
          content: "你是一个严谨的需求审查员，只输出 JSON。",
        },
        {
          role: "user",
          content: buildReviewPrompt(requirement, JSON.stringify(dsl, null, 2)),
        },
      ],
      temperature
    );

    const parsed = JSON.parse(extractJSON(reviewOutput));

    if (parsed.complete === false && Array.isArray(parsed.issues)) {
      return parsed.issues as string[];
    }
  } catch {
    // 审查失败不阻塞主流程
  }

  return [];
}
