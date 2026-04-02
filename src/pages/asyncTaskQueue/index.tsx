import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, InputNumber, Space, Tag, List, Statistic, Row, Col, message } from 'antd';
import { PlayCircleOutlined, ClearOutlined } from '@ant-design/icons';
import AsyncTaskQueue from '../../utils/asyncTaskQueue.js';
import './index.less';

type TaskStatus = 'pending' | 'running' | 'done' | 'error';

interface TaskRecord {
  id: number;
  status: TaskStatus;
  startTime?: number;
  duration?: number;
}

const AsyncTaskQueueTest: React.FC = () => {
  const [maxConcurrency, setMaxConcurrency] = useState(3);
  const [taskList, setTaskList] = useState<TaskRecord[]>([]);
  const queueRef = useRef<InstanceType<typeof AsyncTaskQueue> | null>(null);
  const nextIdRef = useRef(0);

  useEffect(() => {
    queueRef.current = new AsyncTaskQueue(maxConcurrency);
    return () => {
      queueRef.current = null;
    };
  }, [maxConcurrency]);

  const addTasks = (count: number) => {
    if (!queueRef.current) return;
    const baseDelay = 800;
    const newTasks: TaskRecord[] = Array.from({ length: count }, () => ({
      id: nextIdRef.current++,
      status: 'pending',
    }));
    setTaskList((prev) => [...prev, ...newTasks]);

    const taskFns = newTasks.map((task) => () => {
      const taskId = task.id;
      setTaskList((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: 'running', startTime: Date.now() } : t
        )
      );
      const delay = baseDelay + Math.random() * 1500;
      return new Promise<void>((resolve) => setTimeout(resolve, delay)).finally(() => {
        setTaskList((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;
            const start = t.startTime ?? Date.now();
            return {
              ...t,
              status: 'done',
              duration: Math.round((Date.now() - start) / 100) / 10,
            };
          })
        );
      });
    });

    queueRef.current.addTask(taskFns);
    message.success(`已添加 ${count} 个任务`);
  };

  const clearAll = () => {
    queueRef.current = new AsyncTaskQueue(maxConcurrency);
    setTaskList([]);
    message.info('已清空队列与记录');
  };

  const runningCount = taskList.filter((t) => t.status === 'running').length;
  const doneCount = taskList.filter((t) => t.status === 'done').length;
  const pendingCount = taskList.filter((t) => t.status === 'pending').length;

  const statusTag = (status: TaskStatus) => {
    const map = {
      pending: <Tag color="default">等待中</Tag>,
      running: <Tag color="processing">执行中</Tag>,
      done: <Tag color="success">已完成</Tag>,
      error: <Tag color="error">失败</Tag>,
    };
    return map[status];
  };

  return (
    <div className="async-task-queue-page">
      <Card title="异步任务队列测试 (AsyncTaskQueue)" className="config-card">
        <p className="desc">
          控制同时执行的异步任务数量，观察「等待中 → 执行中 → 已完成」的流转，同一时刻执行中的任务不会超过「最大并发数」。
        </p>
        <Row gutter={24} style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <span>最大并发数：</span>
              <InputNumber
                min={1}
                max={10}
                value={maxConcurrency}
                onChange={(v) => (v != null ? setMaxConcurrency(v) : undefined)}
              />
              <span className="hint">（修改后清空再添加任务生效）</span>
            </Space>
          </Col>
        </Row>
        <Space wrap>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => addTasks(5)}
          >
            添加 5 个任务
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => addTasks(10)}
          >
            添加 10 个任务
          </Button>
          <Button icon={<ClearOutlined />} onClick={clearAll}>
            清空
          </Button>
        </Space>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="等待中" value={pendingCount} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="执行中" value={runningCount} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="已完成" value={doneCount} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="最大并发" value={maxConcurrency} />
          </Card>
        </Col>
      </Row>

      <Card title="任务列表" size="small" className="task-list-card">
        <List
          dataSource={[...taskList].reverse()}
          renderItem={(item) => (
            <List.Item>
              <Space>
                {statusTag(item.status)}
                <span>任务 #{item.id}</span>
                {item.duration != null && (
                  <span className="duration">耗时 {item.duration}s</span>
                )}
              </Space>
            </List.Item>
          )}
          className="task-list"
          locale={{ emptyText: '暂无任务，请点击上方按钮添加' }}
        />
      </Card>
    </div>
  );
};

export default AsyncTaskQueueTest;
