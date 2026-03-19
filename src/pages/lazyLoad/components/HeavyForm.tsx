import React from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Radio,
  Checkbox,
  Button,
  Space,
  Divider,
  Tag,
  message,
} from 'antd';
import { FormOutlined } from '@ant-design/icons';

const HeavyForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, unknown>) => {
    console.log('表单数据:', values);
    message.success('提交成功！');
  };

  return (
    <Card
      title={
        <span>
          <FormOutlined style={{ marginRight: 8, color: '#722ed1' }} />
          复杂表单组件（模拟重型组件）
        </span>
      }
      bordered={false}
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)' }}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 700 }}
        onFinish={onFinish}
        initialValues={{
          priority: 'medium',
          notify: true,
        }}
      >
        <Form.Item
          label="项目名称"
          name="name"
          rules={[{ required: true, message: '请输入项目名称' }]}
          style={{ marginBottom: 24 }}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>

        <Form.Item
          label="项目类型"
          name="type"
          rules={[{ required: true, message: '请选择项目类型' }]}
          style={{ marginBottom: 24 }}
        >
          <Select placeholder="请选择项目类型">
            <Select.Option value="web">Web 应用</Select.Option>
            <Select.Option value="mobile">移动应用</Select.Option>
            <Select.Option value="desktop">桌面应用</Select.Option>
            <Select.Option value="mini">小程序</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="截止日期"
          name="deadline"
          style={{ marginBottom: 24 }}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="预算" name="budget" style={{ marginBottom: 24 }}>
          <InputNumber
            style={{ width: '100%' }}
            prefix="¥"
            min={0}
            step={1000}
            placeholder="请输入项目预算"
          />
        </Form.Item>

        <Divider
          orientation="left"
          style={{ fontSize: 14, color: 'rgba(0,0,0,0.85)', fontWeight: 600 }}
        >
          高级设置
        </Divider>

        <Form.Item label="优先级" name="priority" style={{ marginBottom: 24 }}>
          <Radio.Group>
            <Radio value="low">低</Radio>
            <Radio value="medium">中</Radio>
            <Radio value="high">高</Radio>
            <Radio value="urgent">紧急</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="邮件通知"
          name="notify"
          valuePropName="checked"
          style={{ marginBottom: 24 }}
        >
          <Switch checkedChildren="开" unCheckedChildren="关" />
        </Form.Item>

        <Form.Item label="参与部门" name="departments" style={{ marginBottom: 24 }}>
          <Checkbox.Group>
            <Checkbox value="tech">技术部</Checkbox>
            <Checkbox value="product">产品部</Checkbox>
            <Checkbox value="design">设计部</Checkbox>
            <Checkbox value="ops">运营部</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
          style={{ marginBottom: 24 }}
        >
          <Input.TextArea
            rows={3}
            placeholder="请输入备注"
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 4, span: 16 }}
          style={{ marginTop: 32, marginBottom: 0 }}
        >
          <Space size={12}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <div style={{ marginTop: 24 }}>
        <Tag color="blue">React.lazy 加载</Tag>
        <Tag color="cyan">Suspense 包裹</Tag>
        <Tag color="volcano">表单验证</Tag>
      </div>
    </Card>
  );
};

export default HeavyForm;
