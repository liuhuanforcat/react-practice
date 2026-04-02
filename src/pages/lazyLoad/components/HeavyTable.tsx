import React from 'react';
import { Card, Table, Tag, Space, Badge } from 'antd';
import type { TableProps } from 'antd';
import { TableOutlined } from '@ant-design/icons';

interface DataType {
  key: string;
  name: string;
  age: number;
  status: 'success' | 'processing' | 'error' | 'warning';
  department: string;
  salary: number;
}

const data: DataType[] = Array.from({ length: 20 }, (_, i) => ({
  key: String(i + 1),
  name: `员工${String.fromCharCode(65 + (i % 26))}${i + 1}`,
  age: 25 + (i % 20),
  status: (['success', 'processing', 'error', 'warning'] as const)[i % 4],
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4],
  salary: 8000 + i * 500,
}));

const statusMap: Record<string, { text: string; color: string }> = {
  success: { text: '在职', color: '#52c41a' },
  processing: { text: '试用期', color: '#1890ff' },
  error: { text: '已离职', color: '#f5222d' },
  warning: { text: '休假中', color: '#faad14' },
};

const columns: TableProps<DataType>['columns'] = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 80,
    render: (text) => (
      <span style={{ fontFamily: 'Monaco, Consolas, monospace' }}>{text}</span>
    ),
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 140,
    render: (text) => (
      <span style={{ fontWeight: 500, color: 'rgba(0,0,0,0.85)' }}>
        {text}
      </span>
    ),
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    align: 'right',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 120,
    filters: [
      { text: '技术部', value: '技术部' },
      { text: '产品部', value: '产品部' },
      { text: '设计部', value: '设计部' },
      { text: '运营部', value: '运营部' },
    ],
    onFilter: (value, record) => record.department === value,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (status: string) => {
      const config = statusMap[status];
      return <Badge color={config.color} text={config.text} />;
    },
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    width: 120,
    align: 'right',
    sorter: (a, b) => a.salary - b.salary,
    render: (val) => (
      <span
        style={{
          fontFamily: 'DIN, Helvetica Neue, Arial',
          fontWeight: 600,
          color: val >= 15000 ? '#f5222d' : 'rgba(0,0,0,0.85)',
        }}
      >
        ¥{val.toLocaleString()}
      </span>
    ),
  },
  {
    title: '操作',
    width: 160,
    render: () => (
      <Space size={8}>
        <a style={{ color: '#1890ff' }}>编辑</a>
        <a style={{ color: '#1890ff' }}>详情</a>
        <a style={{ color: '#f5222d' }}>删除</a>
      </Space>
    ),
  },
];

const HeavyTable: React.FC = () => {
  return (
    <Card
      title={
        <span>
          <TableOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          数据表格组件（模拟重型组件）
        </span>
      }
      bordered={false}
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)' }}
    >
      <Table<DataType>
        columns={columns}
        dataSource={data}
        size="middle"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
      <div style={{ marginTop: 16 }}>
        <Tag color="blue">React.lazy 加载</Tag>
        <Tag color="green">独立打包</Tag>
        <Tag color="purple">模拟大体积组件</Tag>
      </div>
    </Card>
  );
};

export default HeavyTable;
