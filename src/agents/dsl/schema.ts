import type { JSONSchemaType } from "ajv";
import type { PageDSL } from "./types";

/**
 * PageDSL 的 JSON Schema，用于 ajv 校验 LLM 输出合法性。
 * 同时也可以作为 function-calling 的 parameters schema 传给模型。
 */
export const pageDSLSchema: JSONSchemaType<PageDSL> = {
  type: "object",
  required: ["version", "meta", "sections"],
  additionalProperties: false,
  properties: {
    version: { type: "string", const: "1.0" },

    meta: {
      type: "object",
      required: ["route", "title", "description"],
      additionalProperties: false,
      properties: {
        route: { type: "string", minLength: 1 },
        title: { type: "string", minLength: 1 },
        description: { type: "string" },
        keywords: {
          type: "array",
          items: { type: "string" },
          nullable: true,
        },
      },
    },

    sections: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["id", "type"],
        additionalProperties: false,
        properties: {
          id: { type: "string", minLength: 1 },
          type: {
            type: "string",
            enum: [
              "banner",
              "features",
              "scenarios",
              "capabilities",
              "architecture",
              "products",
              "cta",
              "timeline",
              "contact",
              "download",
              "custom",
            ],
          },
          heading: { type: "string", nullable: true },
          subheading: { type: "string", nullable: true },
          background: { type: "string", nullable: true },
          items: {
            type: "array",
            nullable: true,
            items: {
              type: "object",
              required: ["title", "description"],
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                icon: { type: "string", nullable: true },
                extra: {
                  type: "object",
                  nullable: true,
                  required: [] as never[],
                  additionalProperties: { type: "string" },
                },
              },
            },
          },
          actions: {
            type: "array",
            nullable: true,
            items: {
              type: "object",
              required: ["label", "href"],
              additionalProperties: false,
              properties: {
                label: { type: "string" },
                href: { type: "string" },
                variant: {
                  type: "string",
                  enum: ["primary", "secondary", "outline", "ghost"],
                  nullable: true,
                },
              },
            },
          },
          props: {
            type: "object",
            nullable: true,
            required: [] as never[],
            additionalProperties: true,
          },
        },
      },
    },
  },
};
