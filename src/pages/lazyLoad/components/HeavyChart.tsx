import React, { useEffect, useState } from 'react';
import { Card, Progress, Row, Col, Statistic, Tag } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

const fakeDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const chartData = [65, 59, 80, 81, 56, 55, 72, 68, 90, 78, 85, 92];
const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];

const HeavyChart: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fakeDelay(800).then(() => setReady(true));
  }, []);

  const maxVal = Math.max(...chartData);

  return (
    <Card
      title={
        <span>
          <LineChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          数据图表组件（模拟重型组件）
        </span>
      }
      bordered={false}
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)' }}
    >
      <Row gutter={[24, 16]} style={{ marginBottom: 32 }}>
        <Col span={6}>
          <Statistic
            title="总销售额"
            value={112893}
            prefix="¥"
            valueStyle={{
              fontFamily: 'DIN, Helvetica Neue, Arial',
              fontWeight: 600,
            }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="月环比"
            value={12.5}
            precision={1}
            valueStyle={{ color: '#52c41a' }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="日活用户"
            value={8846}
            valueStyle={{
              fontFamily: 'DIN, Helvetica Neue, Arial',
              fontWeight: 600,
            }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="跳出率"
            value={3.2}
            precision={1}
            valueStyle={{ color: '#f5222d' }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        </Col>
      </Row>

      {ready && (
        <div style={{ padding: '0 16px' }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'rgba(0,0,0,0.85)',
              marginBottom: 16,
            }}
          >
            月度销售趋势
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 8,
              height: 160,
            }}
          >
            {chartData.map((val, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: 'rgba(0,0,0,0.45)',
                    fontFamily: 'DIN, Helvetica Neue, Arial',
                  }}
                >
                  {val}
                </span>
                <div
                  style={{
                    width: '100%',
                    height: `${(val / maxVal) * 120}px`,
                    background:
                      i === chartData.length - 1
                        ? 'linear-gradient(180deg, #1890ff 0%, #69c0ff 100%)'
                        : 'linear-gradient(180deg, #91d5ff 0%, #bae7ff 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)',
                  }}
                />
                <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>
                  {months[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Tag color="blue">React.lazy 加载</Tag>
        <Tag color="green">按需导入</Tag>
        <Tag color="orange">独立 chunk</Tag>
      </div>
    </Card>
  );
};

export default HeavyChart;
