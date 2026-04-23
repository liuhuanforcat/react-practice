import React, { useMemo, useState } from 'react';
import { Badge, Card, Collapse, Input, List, Space, Tag, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export type Difficulty = '简单' | '中等' | '困难';

export interface QaItem {
  question: string;
  answer: string[];
  tags?: string[];
  difficulty?: Difficulty;
}

export interface SectionItem {
  title: string;
  icon: string;
  qas: QaItem[];
}

const difficultyColor: Record<Difficulty, string> = {
  简单: 'green',
  中等: 'orange',
  困难: 'red',
};

interface InterviewLayoutProps {
  title: string;
  description: string;
  sections: SectionItem[];
}

const InterviewLayout: React.FC<InterviewLayoutProps> = ({ title: pageTitle, description, sections }) => {
  const [keyword, setKeyword] = useState('');

  const filteredSections = useMemo(() => {
    if (!keyword.trim()) return sections;
    const kw = keyword.toLowerCase();
    return sections
      .map((section) => ({
        ...section,
        qas: section.qas.filter(
          (qa) =>
            qa.question.toLowerCase().includes(kw) ||
            qa.answer.some((a) => a.toLowerCase().includes(kw)) ||
            qa.tags?.some((t) => t.toLowerCase().includes(kw)),
        ),
      }))
      .filter((section) => section.qas.length > 0);
  }, [keyword, sections]);

  const totalCount = sections.reduce((sum, s) => sum + s.qas.length, 0);

  return (
    <Card>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>{pageTitle}</Title>
          <Paragraph type="secondary" style={{ marginBottom: 12 }}>
            共 {sections.length} 大章节、{totalCount} 道高频面试题 —— {description}
          </Paragraph>
          <Input
            placeholder="输入关键词搜索题目、答案或标签..."
            prefix={<SearchOutlined />}
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ maxWidth: 480 }}
          />
        </div>

        {filteredSections.length === 0 ? (
          <Paragraph type="secondary">没有匹配的题目，请换个关键词试试。</Paragraph>
        ) : (
          <Collapse
            defaultActiveKey={[sections[0]?.title]}
            items={filteredSections.map((section) => ({
              key: section.title,
              label: (
                <span>
                  {section.icon}&nbsp;&nbsp;{section.title}
                  <Badge
                    count={section.qas.length}
                    style={{ backgroundColor: '#1677ff', marginLeft: 8 }}
                  />
                </span>
              ),
              children: (
                <List
                  itemLayout="vertical"
                  dataSource={section.qas}
                  renderItem={(qa, idx) => (
                    <List.Item
                      style={{
                        padding: '16px 0',
                        borderBottom: idx < section.qas.length - 1 ? '1px dashed #f0f0f0' : 'none',
                      }}
                    >
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Space align="center">
                          <Text strong style={{ fontSize: 15 }}>
                            Q{idx + 1}. {qa.question}
                          </Text>
                          {qa.difficulty && (
                            <Tag color={difficultyColor[qa.difficulty]}>{qa.difficulty}</Tag>
                          )}
                        </Space>
                        <div style={{ paddingLeft: 8 }}>
                          {qa.answer.map((line, i) => (
                            <Paragraph
                              key={i}
                              style={{ marginBottom: i === qa.answer.length - 1 ? 0 : 4, color: '#333' }}
                            >
                              {line}
                            </Paragraph>
                          ))}
                        </div>
                        <Space wrap>
                          {qa.tags?.map((tag) => (
                            <Tag
                              key={tag}
                              color={tag === '高频' ? 'red' : 'blue'}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setKeyword(tag)}
                            >
                              {tag}
                            </Tag>
                          ))}
                        </Space>
                      </Space>
                    </List.Item>
                  )}
                />
              ),
            }))}
          />
        )}
      </Space>
    </Card>
  );
};

export default InterviewLayout;
