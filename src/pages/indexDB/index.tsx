import React, { useEffect, useRef, useState } from 'react';
import useIndexedDB from '../../hooks/useIndexedDB';
import { Button, Col, Divider, Form, Input, Row, Space, Table, TableColumnsType } from 'antd';
import './index.less'
import AddEditForm from './AddEditForm';
import { useMount } from 'ahooks';

function Index() {  // 组件名建议大写开头
  const { openLoading, addItem, getAllItems } = useIndexedDB("test", "test", 1);
  const formRef = useRef<any>(null);

  const [dataSource, setDataSource] = useState<any>([]);
  const handleAddItem = async () => {
    formRef.current.openModal();
    loadTableData();
  }

  // 加载数据到表格
  const loadTableData = async () => {
    const items = await getAllItems(); // 从 IndexedDB 获取数据
    setDataSource(items); // 设置到 dataSource 状态
  };

  useMount(() => {
    loadTableData(); // 在组件挂载时加载数据
  });
  const handleGetAllItems = async () => {
    const items = await getAllItems();
    console.log("获取所有数据", items);
  }
  const columns: TableColumnsType = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '手机号',
      dataIndex: 'phone',

    },
    {
      title: '状态',
      dataIndex: 'chinese',
    },
  ];
  return (
    <div className='redis-indexDb-container'>
      <Form name="form_item_path" layout="horizontal">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Form.Item
              name="name"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="account"
              label="账号"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input placeholder="请输入账号" />
            </Form.Item>
          </Col>

          <Col span={6} style={{ textAlign: 'right' }}>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleAddItem}>新增数据</Button>
                <Button onClick={handleGetAllItems}>获取数据</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        showSorterTooltip={{ target: 'sorter-icon' }}
      />
      <AddEditForm ref={formRef} /> {/* 使用 ref 引用 AddEditForm 组件 */}
    </div>
  );
}

export default Index;