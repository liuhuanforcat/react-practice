import Ajv from "ajv";
import { pageDSLSchema } from "./schema";
import type { PageDSL } from "./types";

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(pageDSLSchema);

export interface ValidationResult {
  valid: boolean;
  data?: PageDSL;
  errors?: string[];
}

/**
 * 从 LLM 原始字符串中提取 JSON
 * 处理模型可能附带的 markdown 代码块标记
 */
export function extractJSON(raw: string): string {
  let text = raw.trim();

  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  return text;
}

/**
 * 校验 DSL JSON 是否符合 PageDSL Schema
 */
export function validateDSL(raw: string): ValidationResult {
  const jsonStr = extractJSON(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    return {
      valid: false,
      errors: [`JSON 解析失败: ${jsonStr.slice(0, 120)}...`],
    };
  }

  const isValid = validate(parsed);

  if (isValid) {
    return { valid: true, data: parsed as PageDSL };
  }

  const errors = (validate.errors ?? []).map((err) => {
    const path = err.instancePath || "/";
    return `[${path}] ${err.message ?? "未知错误"}`;
  });

  return { valid: false, errors };
}
