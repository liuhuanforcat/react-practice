import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type { TabsProps } from 'antd';
import { parseToDSL, type AgentResult } from '../../agents/dsl';

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

const DEFAULT_API_BASE = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4.1-mini';

const DslAgentPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [rawRequirement, setRawRequirement] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setError(null);
      setResult(null);
      const values = await form.validateFields();

      const requirement: string = values.requirement;
      setRawRequirement(requirement);

      const apiBase: string = values.apiBase || DEFAULT_API_BASE;
      const model: string = values.model || DEFAULT_MODEL;
      const apiKey: string = values.apiKey;
      const temperature: number | undefined = values.temperature;
      const maxRetries: number | undefined = values.maxRetries;

      if (!apiKey) {
        setError('请先填写 API Key，再进行生成。');
        return;
      }

      setLoading(true);

      const resp = await parseToDSL(requirement, {
        apiBase,
        apiKey,
        model,
        temperature,
        maxRetries,
      });

      setResult(resp);
    } catch (e) {
      if ((e as { errorFields?: unknown }).errorFields) {
        // 表单校验错误，直接返回
        return;
      }
      setError((e as Error).message || '生成 DSL 过程中出现异常');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setResult(null);
    setError(null);
    setRawRequirement('');
  };

  const items: TabsProps['items'] = [
    {
      key: 'dsl',
      label: '页面 DSL',
      children: result?.success && result.dsl ? (
        <Card size="small" bordered={false} style={{ background: '#fafafa' }}>
          <Paragraph
            code
            style={{
              maxHeight: 480,
              overflow: 'auto',
              whiteSpace: 'pre',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: 12,
            }}
          >
            {JSON.stringify(result.dsl, null, 2)}
          </Paragraph>
        </Card>
      ) : (
        <Text type="secondary">暂未生成 DSL。</Text>
      ),
    },
    {
      key: 'clarifications',
      label: '澄清建议',
      children: result?.clarifications && result.clarifications.length ? (
        <Space direction="vertical" style={{ width: '100%' }}>
          {result.clarifications.map((item, index) => (
            <Card key={index} size="small">
              <Paragraph style={{ marginBottom: 0 }}>{item}</Paragraph>
            </Card>
          ))}
        </Space>
      ) : (
        <Text type="secondary">当前没有需要额外澄清的问题。</Text>
      ),
    },
    {
      key: 'raw',
      label: '原始需求',
      children: rawRequirement ? (
        <Card size="small" bordered={false}>
          <Paragraph>{rawRequirement}</Paragraph>
        </Card>
      ) : (
        <Text type="secondary">还没有输入任何需求。</Text>
      ),
    },
    {
      key: 'errors',
      label: '校验错误',
      children:
        result && !result.success && result.errors && result.errors.length ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            {result.errors.map((err, index) => (
              <Alert
                key={index}
                type="error"
                showIcon
                message={`错误 ${index + 1}`}
                description={err}
              />
            ))}
          </Space>
        ) : (
          <Text type="secondary">暂无校验错误。</Text>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={10}>
          <Card
            title="Agent 页面 DSL 生成器"
            bordered={false}
            style={{ marginBottom: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                输入业务/产品需求，让 Agent 直接输出符合约定规范的 PageDSL，
                便于后续页面搭建与自动化生成。
              </Paragraph>
              <Tag color="blue">业务分析</Tag>
              <Tag color="green">DSL 规范</Tag>
              <Tag color="purple">Agent 助理</Tag>
            </Space>
          </Card>

          <Card title="需求与模型配置" bordered={false}>
            {error && (
              <Alert
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
                message="操作失败"
                description={error}
              />
            )}
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                apiBase: DEFAULT_API_BASE,
                model: DEFAULT_MODEL,
                temperature: 0.2,
                maxRetries: 2,
              }}
            >
              <Form.Item
                label="自然语言需求"
                name="requirement"
                rules={[{ required: true, message: '请描述你的页面业务需求' }]}
              >
                <TextArea
                  rows={8}
                  placeholder="例如：需要一个用于介绍 AI 平台的产品页，包含顶部 Banner、核心能力模块、典型应用场景和底部联系 CTA..."
                />
              </Form.Item>

              <Form.Item
                label="API Base"
                name="apiBase"
                tooltip="OpenAI / 兼容接口的 Base URL"
              >
                <Input placeholder={DEFAULT_API_BASE} />
              </Form.Item>

              <Form.Item
                label="模型名称"
                name="model"
                tooltip="如 gpt-4.1, gpt-4.1-mini 等"
              >
                <Input placeholder={DEFAULT_MODEL} />
              </Form.Item>

              <Form.Item
                label="API Key"
                name="apiKey"
                rules={[{ required: true, message: '请填写用于调用 Agent 的 API Key' }]}
              >
                <Input.Password placeholder="sk-..." />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Temperature"
                    name="temperature"
                    tooltip="数值越大越有创造力，越小越稳定"
                  >
                    <Input type="number" min={0} max={1} step={0.1} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="最大重试次数"
                    name="maxRetries"
                    tooltip="校验失败后让模型自动修正的最大次数"
                  >
                    <Input type="number" min={0} max={5} step={1} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 16 }}>
                <Space>
                  <Button type="primary" loading={loading} onClick={handleGenerate}>
                    生成 DSL
                  </Button>
                  <Button onClick={handleReset} disabled={loading}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={14}>
          <Card
            bordered={false}
            title={
              <Space align="center">
                <Title level={5} style={{ margin: 0 }}>
                  生成结果与审查
                </Title>
                {result && (
                  <Tag color={result.success ? 'success' : 'error'}>
                    {result.success ? '校验通过' : '校验失败'}
                  </Tag>
                )}
              </Space>
            }
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          >
            <Tabs items={items} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DslAgentPage;

