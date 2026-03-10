import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Descriptions, Empty, Layout, List, Modal, Row, Space, Tag, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { DescriptionsProps } from 'antd';

const { Title, Text } = Typography;

interface Company {
  id: number;
  name: string;
  industry: string;
  scale: string;
  status: '在营' | '注销' | '迁出' | '筹建';
  creditCode: string;
  legalPerson: string;
  contactPhone: string;
  registeredCapital: string;
  establishDate: string;
  address: string;
  tags: string[];
  description: string;
}

const STATUS_COLOR_MAP: Record<Company['status'], string> = {
  在营: 'success',
  注销: 'default',
  迁出: 'warning',
  筹建: 'processing',
};

const ALL_COMPANY_COUNT = 240;
const PAGE_SIZE = 30;

const INDUSTRIES = [
  '信息技术服务',
  '物流与供应链',
  '智能制造',
  '商业地产与物业',
  '互联网与软件',
  '跨境电商',
  '新能源',
  '在线教育',
  '文旅与会展',
];

const SCALES = ['50-99人', '100-499人', '200-499人', '300-999人', '500-1999人', '1000-5000人'];

const TAGS_POOL = [
  'SaaS',
  '云计算',
  'B2B',
  '冷链',
  '跨境电商',
  '仓储',
  '智能工厂',
  '工业互联网',
  '机器人',
  '大数据',
  '企业服务',
  '品牌出海',
  '供应链',
  '储能',
  '在线课堂',
  '企业培训',
  '文旅综合体',
  '展会运营',
  '活动策划',
];

function generateMockCompanies(count: number): Company[] {
  return Array.from({ length: count }, (_, index) => {
    const i = index + 1;
    const industry = INDUSTRIES[index % INDUSTRIES.length];
    const scale = SCALES[index % SCALES.length];
    const status: Company['status'] =
      i % 19 === 0 ? '迁出' : i % 13 === 0 ? '注销' : i % 11 === 0 ? '筹建' : '在营';

    const tags = TAGS_POOL.slice(index % TAGS_POOL.length, (index % TAGS_POOL.length) + 3);

    return {
      id: i,
      name: `示例企业 ${i.toString().padStart(3, '0')}`,
      industry,
      scale,
      status,
      creditCode: `91310101MA${(10000000 + i).toString()}`,
      legalPerson: `法人${i}`,
      contactPhone: `13${(800000000 + i).toString().slice(0, 9)}`,
      registeredCapital: `${(i % 20) + 1}000万人民币`,
      establishDate: `20${(10 + (i % 15)).toString().padStart(2, '0')}-${((i % 12) + 1)
        .toString()
        .padStart(2, '0')}-${((i % 28) + 1).toString().padStart(2, '0')}`,
      address: `上海市示例区示例路 ${i} 号示例产业园 ${((i % 8) + 1).toString()} 号楼`,
      tags,
      description: `这是第 ${i} 家示例企业，用于演示主从列表与详情联动场景。企业主要从事${industry}相关业务，人员规模约为${scale}，当前状态为${status}。`,
    };
  });
}

const CompanyMasterDetail: React.FC = () => {
  const navigate = useNavigate();
  const [allCompanies] = useState<Company[]>(() => generateMockCompanies(ALL_COMPANY_COUNT));
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const companies = useMemo(
    () => allCompanies.slice(0, visibleCount),
    [allCompanies, visibleCount],
  );
  const [selectedId, setSelectedId] = useState<number | null>(
    () => allCompanies[0]?.id ?? null,
  );
  const [communicationVisible, setCommunicationVisible] = useState(false);

  const selectedCompany = useMemo(
    () => companies.find((item) => item.id === selectedId) ?? null,
    [companies, selectedId],
  );

  const descriptionItems: DescriptionsProps['items'] = useMemo(() => {
    if (!selectedCompany) return [];

    return [
      {
        key: 'name',
        label: '企业名称',
        children: (
          <Space direction="vertical" size={4}>
            <Space size={8}>
              <Text strong>{selectedCompany.name}</Text>
              <Tag color={STATUS_COLOR_MAP[selectedCompany.status]}>
                {selectedCompany.status}
              </Tag>
            </Space>
            <Text type="secondary">{selectedCompany.industry}</Text>
          </Space>
        ),
        span: 2,
      },
      {
        key: 'creditCode',
        label: '统一社会信用代码',
        children: <Text code>{selectedCompany.creditCode}</Text>,
      },
      {
        key: 'legalPerson',
        label: '法定代表人',
        children: selectedCompany.legalPerson,
      },
      {
        key: 'contactPhone',
        label: '联系方式',
        children: (
          <Space size={8}>
            <Text>{selectedCompany.contactPhone}</Text>
            <Button
              type="link"
              size="small"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(selectedCompany.contactPhone);
                  message.success('手机号已复制');
                } catch {
                  message.error('复制失败，请手动复制');
                }
              }}
            >
              复制
            </Button>
          </Space>
        ),
      },
      {
        key: 'registeredCapital',
        label: '注册资本',
        children: selectedCompany.registeredCapital,
      },
      {
        key: 'scale',
        label: '人员规模',
        children: selectedCompany.scale,
      },
      {
        key: 'establishDate',
        label: '成立日期',
        children: selectedCompany.establishDate,
      },
      {
        key: 'address',
        label: '注册地址',
        children: selectedCompany.address,
        span: 2,
      },
    ];
  }, [selectedCompany]);

  return (
    <Layout
      style={{
        padding: 24,
        minHeight: '100%',
        background: '#f0f2f5',
      }}
    >
      <Card
        bordered={false}
        style={{
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <div
              style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                企业列表
              </Title>
              <Space size={8}>
                <Text type="secondary">
                  共 {allCompanies.length} 家，已加载 {companies.length} 家
                </Text>
              </Space>
            </div>

            <Card
              size="small"
              bodyStyle={{ padding: 0 }}
              style={{ borderRadius: 4, overflow: 'hidden' }}
            >
              <div
                style={{ maxHeight: 540, overflow: 'auto' }}
                onScroll={(e) => {
                  const target = e.currentTarget;
                  if (
                    target.scrollTop + target.clientHeight >= target.scrollHeight - 40
                  ) {
                    setVisibleCount((prev) => {
                      if (prev >= allCompanies.length) return prev;
                      return Math.min(prev + PAGE_SIZE, allCompanies.length);
                    });
                  }
                }}
              >
                <List
                  itemLayout="vertical"
                  dataSource={companies}
                  split
                  pagination={false}
                  renderItem={(item) => {
                    const active = item.id === selectedId;
                    return (
                      <List.Item
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        style={{
                          cursor: 'pointer',
                          padding: '12px 16px',
                          background: active ? 'rgba(24, 144, 255, 0.06)' : undefined,
                          borderLeft: active ? '3px solid #1890ff' : '3px solid transparent',
                          transition: 'background 0.2s, border-color 0.2s',
                        }}
                      >
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <Space size={8} style={{ justifyContent: 'space-between' }}>
                            <Text strong ellipsis>
                              {item.name}
                            </Text>
                            <Tag
                              color={STATUS_COLOR_MAP[item.status]}
                              style={{ marginInlineEnd: 0 }}
                            >
                              {item.status}
                            </Tag>
                          </Space>
                          <Space size={8} wrap>
                            <Text type="secondary">{item.industry}</Text>
                            <Text type="secondary">·</Text>
                            <Text type="secondary">{item.scale}</Text>
                          </Space>
                          <Space size={4} wrap>
                            {item.tags.map((tag) => (
                              <Tag key={tag}>{tag}</Tag>
                            ))}
                          </Space>
                        </Space>
                      </List.Item>
                    );
                  }}
                />
              </div>
            </Card>
          </Col>

          <Col span={16}>
            <div
              style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  企业详情
                </Title>
                <Text type="secondary">
                  点击左侧企业可快速查看基础信息和经营概况
                </Text>
              </div>
              {selectedCompany && (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setCommunicationVisible(true);
                    }}
                  >
                    去沟通
                  </Button>
                </Space>
              )}
            </div>

            {!selectedCompany ? (
              <Card
                bordered={false}
                style={{
                  minHeight: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Empty description="请选择左侧企业查看详细信息" />
              </Card>
            ) : (
              <Space direction="vertical" size={16} style={{ display: 'flex' }}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: 4,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <Descriptions
                    column={2}
                    colon={false}
                    labelStyle={{ width: 120, color: 'rgba(0, 0, 0, 0.45)' }}
                    contentStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}
                    items={descriptionItems}
                  />
                </Card>

                <Card
                  title="企业概况"
                  bordered={false}
                  style={{
                    borderRadius: 4,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                  }}
                  headStyle={{
                    padding: '12px 16px',
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                  bodyStyle={{ padding: 16 }}
                >
                  <Text style={{ fontSize: 14, lineHeight: 1.7 }}>
                    {selectedCompany.description}
                  </Text>
                </Card>
              </Space>
            )}
          </Col>
        </Row>

        <Modal
          open={communicationVisible}
          title="沟通完成"
          onCancel={() => setCommunicationVisible(false)}
          footer={
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCommunicationVisible(false)}>
                留在本页
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setCommunicationVisible(false);
                  navigate(-1);
                }}
              >
                返回上一页
              </Button>
            </Space>
          }
        >
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            已完成与
            <Text strong>
              {selectedCompany?.name ?? '企业'}
            </Text>
            的外部联系沟通？如需继续查看其他企业信息，可选择「留在本页」。
          </Typography.Paragraph>
        </Modal>
      </Card>
    </Layout>
  );
};

export default CompanyMasterDetail;

