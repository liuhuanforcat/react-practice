import React from 'react';
import { Table, Spin, Alert } from 'antd';
import type { TableProps } from 'antd';
import { useRequest } from 'ahooks';
import { fetchDeviceList } from '../bigFile/service'; // 导入 fetchDeviceList

// 定义设备数据类型，与 service.ts 中的 DeviceType 保持一致
interface DeviceType {
  id: string;
  name: string;
  ip: string;
  // 根据实际接口返回的设备数据结构定义更多字段
}

const DeviceListPage: React.FC = () => {
  // 使用 useRequest 调用 fetchDeviceList 函数获取设备列表
  const { data, error, loading } = useRequest<DeviceType[], []>(fetchDeviceList);

  // 定义 Table 的列
  const columns: TableProps<DeviceType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    // 您可以根据实际的设备数据结构添加更多列
  ];

  if (loading) {
    return <Spin tip="正在加载投屏设备列表..."></Spin>;
  }

  if (error) {
    return <Alert message="加载投屏设备失败" description={error.message} type="error" showIcon />;
  }

  return (
    <div>
      <h1>投屏设备列表</h1>
      <Table<DeviceType> columns={columns} dataSource={data} rowKey="id" bordered />
    </div>
  );
};

export default DeviceListPage;