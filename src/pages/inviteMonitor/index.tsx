import React, { useState } from 'react';
import {
  Button,
  Modal,
  Table,
  Input,
  Avatar,
  Tag,
  Space,
  Badge,
  Form,
  Select,
  Row,
  Col,
  Card,
  Typography,
  Checkbox,
  message,
  Tooltip,
  Empty,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  VideoCameraOutlined,
  EyeOutlined,
  CloseOutlined,
  CheckOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Search } = Input;

interface MonitorSession {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'alarm';
  startTime: string;
  viewers: number;
}

interface UserItem {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  role: string;
  online: boolean;
}

const mockSessions: MonitorSession[] = [
  { id: '1', name: '主入口监控-A01', location: '大楼一层', status: 'online', startTime: '2026-03-13 08:00:00', viewers: 3 },
  { id: '2', name: '停车场监控-B02', location: '地下一层', status: 'online', startTime: '2026-03-13 08:00:00', viewers: 1 },
  { id: '3', name: '走廊监控-C03', location: '二楼走廊', status: 'alarm', startTime: '2026-03-13 08:00:00', viewers: 5 },
  { id: '4', name: '仓库监控-D04', location: '后仓储区', status: 'offline', startTime: '2026-03-13 06:30:00', viewers: 0 },
  { id: '5', name: '会议室监控-E05', location: '三楼会议室', status: 'online', startTime: '2026-03-13 09:00:00', viewers: 2 },
];

const mockUsers: UserItem[] = [
  { id: '1', name: '张伟', department: '安保部', role: '安保人员', online: true },
  { id: '2', name: '李娜', department: '运营部', role: '运营主管', online: true },
  { id: '3', name: '王强', department: '技术部', role: '系统管理员', online: false },
  { id: '4', name: '刘洋', department: '安保部', role: '安保队长', online: true },
  { id: '5', name: '陈静', department: '管理层', role: '副总监', online: true },
  { id: '6', name: '赵磊', department: '运营部', role: '运营专员', online: false },
  { id: '7', name: '孙敏', department: '技术部', role: '技术工程师', online: true },
  { id: '8', name: '周杰', department: '安保部', role: '安保人员', online: false },
];

const departmentColors: Record<string, string> = {
  安保部: 'blue',
  运营部: 'green',
  技术部: 'purple',
  管理层: 'red',
};

const avatarColors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];

const InviteMonitorPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSession, setCurrentSession] = useState<MonitorSession | null>(null);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>(undefined);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchName = user.name.includes(searchText) || user.department.includes(searchText) || user.role.includes(searchText);
    const matchDept = !departmentFilter || user.department === departmentFilter;
    return matchName && matchDept;
  });

  const openInviteModal = (session: MonitorSession) => {
    setCurrentSession(session);
    setSelectedUserIds([]);
    setSearchText('');
    setDepartmentFilter(undefined);
    setModalVisible(true);
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredUsers.map((u) => u.id);
    const allSelected = allIds.every((id) => selectedUserIds.includes(id));
    if (allSelected) {
      setSelectedUserIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedUserIds((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const handleInvite = async () => {
    if (selectedUserIds.length === 0) {
      message.warning('请至少选择一位用户');
      return;
    }
    setInviting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setInviting(false);
    setModalVisible(false);
    message.success(`已成功邀请 ${selectedUserIds.length} 位用户加入监控`);
  };

  const statusConfig = {
    online: { color: '#52c41a', text: '在线', badgeStatus: 'success' as const },
    offline: { color: '#d9d9d9', text: '离线', badgeStatus: 'default' as const },
    alarm: { color: '#f5222d', text: '告警', badgeStatus: 'error' as const },
  };

  const columns: ColumnsType<MonitorSession> = [
    {
      title: '监控点位',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space size={8}>
          <VideoCameraOutlined style={{ color: '#1890ff', fontSize: 16 }} />
          <Text strong style={{ color: 'rgba(0,0,0,0.85)' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      render: (text) => (
        <Space size={4}>
          <EnvironmentOutlined style={{ color: 'rgba(0,0,0,0.45)', fontSize: 13 }} />
          <Text style={{ color: 'rgba(0,0,0,0.65)' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: keyof typeof statusConfig) => {
        const cfg = statusConfig[status];
        return <Badge status={cfg.badgeStatus} text={cfg.text} />;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => (
        <Space size={4}>
          <ClockCircleOutlined style={{ color: 'rgba(0,0,0,0.45)', fontSize: 13 }} />
          <Text style={{ color: 'rgba(0,0,0,0.65)', fontSize: 13 }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '观看人数',
      dataIndex: 'viewers',
      key: 'viewers',
      width: 100,
      render: (count) => (
        <Space size={4}>
          <EyeOutlined style={{ color: count > 0 ? '#1890ff' : 'rgba(0,0,0,0.25)' }} />
          <Text style={{ color: count > 0 ? '#1890ff' : 'rgba(0,0,0,0.25)' }}>{count}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          disabled={record.status === 'offline'}
          onClick={() => openInviteModal(record)}
          style={{
            background: record.status === 'offline' ? undefined : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            border: 'none',
          }}
        >
          邀请监控
        </Button>
      ),
    },
  ];

  const allFilteredSelected =
    filteredUsers.length > 0 && filteredUsers.every((u) => selectedUserIds.includes(u.id));
  const someFilteredSelected =
    filteredUsers.some((u) => selectedUserIds.includes(u.id)) && !allFilteredSelected;

  const selectedUsers = mockUsers.filter((u) => selectedUserIds.includes(u.id));

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card
        bordered={false}
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)', borderRadius: 4 }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ marginBottom: 4, color: 'rgba(0,0,0,0.85)' }}>
            监控点位列表
          </Title>
          <Text style={{ color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>
            点击「邀请监控」可将指定用户加入对应监控画面
          </Text>
        </div>

        <Table
          columns={columns}
          dataSource={mockSessions}
          rowKey="id"
          pagination={false}
          size="middle"
          rowClassName={(record) =>
            record.status === 'alarm' ? 'alarm-row' : ''
          }
        />
      </Card>

      {/* 邀请监控弹窗 */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={680}
        footer={null}
        destroyOnClose
        styles={{
          header: { paddingBottom: 0 },
          body: { padding: 0 },
        }}
        title={
          <div style={{ paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(24,144,255,0.35)',
                }}
              >
                <TeamOutlined style={{ color: '#fff', fontSize: 18 }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)', lineHeight: 1.4 }}>
                  邀请监控
                </div>
                {currentSession && (
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>
                    <VideoCameraOutlined style={{ marginRight: 4 }} />
                    {currentSession.name} · {currentSession.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      >
        <div style={{ padding: '20px 24px 0' }}>
          {/* 搜索 & 筛选 */}
          <Row gutter={12} style={{ marginBottom: 16 }}>
            <Col flex="1">
              <Search
                placeholder="搜索姓名、部门或角色"
                prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col style={{ width: 150 }}>
              <Select
                placeholder="部门筛选"
                allowClear
                style={{ width: '100%' }}
                value={departmentFilter}
                onChange={setDepartmentFilter}
                options={['安保部', '运营部', '技术部', '管理层'].map((d) => ({
                  label: d,
                  value: d,
                }))}
              />
            </Col>
          </Row>

          {/* 全选 & 统计 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#fafafa',
              borderRadius: 4,
              border: '1px solid #f0f0f0',
              marginBottom: 12,
            }}
          >
            <Checkbox
              checked={allFilteredSelected}
              indeterminate={someFilteredSelected}
              onChange={handleSelectAll}
            >
              <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
                全选当前列表（{filteredUsers.length} 人）
              </Text>
            </Checkbox>
            <Text style={{ fontSize: 12, color: selectedUserIds.length > 0 ? '#1890ff' : 'rgba(0,0,0,0.35)' }}>
              已选 {selectedUserIds.length} 人
            </Text>
          </div>
        </div>

        {/* 用户列表 */}
        <div
          style={{
            maxHeight: 300,
            overflowY: 'auto',
            padding: '0 24px',
          }}
        >
          {filteredUsers.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="未找到匹配用户"
              style={{ padding: '32px 0' }}
            />
          ) : (
            filteredUsers.map((user, idx) => {
              const selected = selectedUserIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => handleUserToggle(user.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: 6,
                    marginBottom: 6,
                    cursor: 'pointer',
                    border: `1px solid ${selected ? '#91d5ff' : '#f0f0f0'}`,
                    background: selected
                      ? 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)'
                      : '#fff',
                    transition: 'all 0.2s',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ position: 'relative', marginRight: 12, flexShrink: 0 }}>
                    <Avatar
                      size={38}
                      style={{
                        background: avatarColors[idx % avatarColors.length],
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {user.name.slice(0, 1)}
                    </Avatar>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: user.online ? '#52c41a' : '#d9d9d9',
                        border: '2px solid #fff',
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <Text
                        strong
                        style={{
                          fontSize: 14,
                          color: 'rgba(0,0,0,0.85)',
                          maxWidth: 80,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.name}
                      </Text>
                      <Tag
                        color={departmentColors[user.department]}
                        style={{ fontSize: 11, padding: '0 6px', lineHeight: '18px', height: 18, margin: 0 }}
                      >
                        {user.department}
                      </Tag>
                    </div>
                    <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                      <UserOutlined style={{ marginRight: 4 }} />
                      {user.role}
                      <span style={{ margin: '0 8px', color: '#d9d9d9' }}>·</span>
                      <span style={{ color: user.online ? '#52c41a' : 'rgba(0,0,0,0.35)' }}>
                        {user.online ? '在线' : '离线'}
                      </span>
                    </Text>
                  </div>

                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: `2px solid ${selected ? '#1890ff' : '#d9d9d9'}`,
                      background: selected ? '#1890ff' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    {selected && <CheckOutlined style={{ color: '#fff', fontSize: 11 }} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 已选用户预览 */}
        {selectedUsers.length > 0 && (
          <>
            <Divider style={{ margin: '16px 24px', width: 'calc(100% - 48px)', minWidth: 'unset' }} />
            <div style={{ padding: '0 24px 16px' }}>
              <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 10 }}>
                已选用户
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedUsers.map((user, idx) => (
                  <Tooltip key={user.id} title={`${user.name} · ${user.department}`}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 8px 4px 4px',
                        background: '#f0f9ff',
                        border: '1px solid #91d5ff',
                        borderRadius: 20,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleUserToggle(user.id)}
                    >
                      <Avatar
                        size={20}
                        style={{ background: avatarColors[mockUsers.indexOf(user) % avatarColors.length], fontSize: 11 }}
                      >
                        {user.name.slice(0, 1)}
                      </Avatar>
                      <Text style={{ fontSize: 12, color: '#1890ff' }}>{user.name}</Text>
                      <CloseOutlined style={{ fontSize: 10, color: '#1890ff' }} />
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 底部操作区 */}
        <div
          style={{
            padding: '16px 24px',
            background: '#fafafa',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
            {selectedUserIds.length > 0
              ? `将邀请 ${selectedUserIds.length} 位用户加入实时监控`
              : '请从列表中选择要邀请的用户'}
          </Text>
          <Space size={12}>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button
              type="primary"
              loading={inviting}
              disabled={selectedUserIds.length === 0}
              onClick={handleInvite}
              style={{
                background:
                  selectedUserIds.length === 0
                    ? undefined
                    : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                boxShadow: selectedUserIds.length > 0 ? '0 2px 8px rgba(24,144,255,0.35)' : undefined,
              }}
            >
              确认邀请
            </Button>
          </Space>
        </div>
      </Modal>

      <style>{`
        .alarm-row td {
          background: #fff9f9 !important;
        }
        .alarm-row:hover td {
          background: #fff1f0 !important;
        }
      `}</style>
    </div>
  );
};

export default InviteMonitorPage;
