import React from 'react';
import InterviewLayout, { SectionItem } from '../javaBasics/InterviewLayout';

const sections: SectionItem[] = [
  /* ==================== 1. 基础概念 ==================== */
  {
    title: '基础概念与架构',
    icon: '📨',
    qas: [
      {
        question: 'Kafka 是什么？解决了什么问题？',
        answer: [
          '作用：Apache Kafka 是一个分布式流处理平台和消息队列，具有高吞吐、低延迟、高可用、水平可扩展的特点。',
          '核心能力：① 消息队列（发布/订阅模型）；② 流处理（Kafka Streams / ksqlDB）；③ 数据管道（Connect）；④ 事件存储。',
          '解决的问题：',
          '① 系统解耦——订单系统创建订单后需要通知库存、积分、物流等多个系统，直接调用则强耦合。通过 Kafka 发消息，各系统独立消费。',
          '② 流量削峰——秒杀场景下瞬间百万请求，数据库扛不住。请求先写入 Kafka，消费者按自己的能力匀速消费。',
          '③ 异步处理——用户注册后发邮件、发短信等非核心操作异步处理，提升主流程响应速度。',
          '④ 日志收集——ELK 架构中 Kafka 作为缓冲层，承接大量日志写入，避免直接打到 Elasticsearch。',
        ],
        tags: ['基础', '高频'],
        difficulty: '简单',
      },
      {
        question: 'Kafka 的核心概念有哪些？',
        answer: [
          'Broker：Kafka 服务器实例。多个 Broker 组成集群。',
          'Topic：消息的逻辑分类，类似"频道"。生产者发送消息到 Topic，消费者订阅 Topic。',
          'Partition：Topic 的物理分区，一个 Topic 可以有多个 Partition 分布在不同 Broker 上，实现并行读写。Partition 内消息有序，Topic 全局不保证顺序。',
          'Offset：Partition 内每条消息的唯一递增编号，消费者通过 Offset 跟踪消费进度。',
          'Producer：消息生产者，将消息发送到指定 Topic 的某个 Partition。',
          'Consumer / Consumer Group：消息消费者。同一个 Consumer Group 内的消费者分摊消费 Partition（一个 Partition 只能被组内一个 Consumer 消费），实现负载均衡。不同 Group 各自独立消费全量消息。',
          'Replica：副本，每个 Partition 有 Leader 和若干 Follower。读写都走 Leader，Follower 异步或同步复制数据，Leader 宕机时 Follower 接替。',
        ],
        tags: ['核心概念', '高频'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 2. 生产者 ==================== */
  {
    title: '生产者（Producer）',
    icon: '📤',
    qas: [
      {
        question: 'Kafka Producer 的发送流程是什么？',
        answer: [
          '① 序列化：将 Key 和 Value 序列化为字节数组（JSON / Avro / Protobuf）。',
          '② 分区选择：有 Key → hash(Key) % partitionCount，保证同一 Key 的消息进同一分区（有序性）；无 Key → 粘性分区（Sticky Partitioner，批量发完再切分区，减少请求次数）。',
          '③ 缓冲区：消息先写入 RecordAccumulator 的批次缓冲区（buffer.memory 默认 32MB），按 Partition 分组攒批。',
          '④ Sender 线程：达到 batch.size（默认 16KB）或 linger.ms（等待时间）后，批量发送到 Broker。',
          '⑤ Broker 确认：根据 acks 配置返回确认。',
          '解决的问题：通过批量发送 + 异步化，在高吞吐和低延迟之间取得平衡。',
        ],
        tags: ['发送流程'],
        difficulty: '中等',
      },
      {
        question: 'acks 参数有哪些取值？如何保证消息不丢失？',
        answer: [
          'acks=0：Producer 发送后不等 Broker 确认。最快但可能丢消息（网络丢包、Broker 宕机）。',
          'acks=1（默认）：Leader 写入成功即返回。如果 Leader 写入后、Follower 复制前宕机，消息丢失。',
          'acks=all（-1）：Leader + 所有 ISR 副本都写入成功才返回。最安全但延迟最高。',
          '消息不丢的完整配置：acks=all + min.insync.replicas ≥ 2（ISR 中最少副本数）+ retries=MAX + enable.idempotence=true（幂等性，防止重试导致重复）。',
          '解决的问题：不同业务对"可靠性 vs 性能"的需求不同——日志可以容忍少量丢失（acks=1），金融交易必须零丢失（acks=all）。',
        ],
        tags: ['可靠性', '高频'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 3. 消费者 ==================== */
  {
    title: '消费者（Consumer）',
    icon: '📥',
    qas: [
      {
        question: 'Consumer Group 的消费机制是什么？Rebalance 是什么？',
        answer: [
          '核心规则：一个 Partition 在同一个 Consumer Group 内只能被一个 Consumer 消费。因此 Consumer 数量 > Partition 数量时，多余的 Consumer 闲置。',
          'Rebalance（再均衡）：当 Consumer 加入/退出 Group，或 Partition 数变化时，触发重新分配 Partition 给 Consumer 的过程。',
          'Rebalance 问题：① 过程中所有 Consumer 停止消费（STW）；② 频繁 Rebalance 导致消费延迟。',
          '常见触发原因：Consumer 处理超时未发心跳（session.timeout.ms）、Consumer 两次 poll 间隔过长（max.poll.interval.ms）。',
          '优化手段：① 合理设置超时参数；② 使用 CooperativeSticky 分配策略（增量 Rebalance，只迁移必要的 Partition）；③ 控制单次 poll 处理时间。',
          '解决的问题：Consumer Group 机制让多个消费者并行处理消息，提升消费吞吐量；Rebalance 保证消费者变化时 Partition 能被正确分配。',
        ],
        tags: ['Consumer Group', 'Rebalance', '高频'],
        difficulty: '困难',
      },
      {
        question: '如何保证消息不重复消费（幂等性）？',
        answer: [
          '为什么会重复：Consumer 消费消息后，提交 Offset 前宕机 → 重启后从上次提交的 Offset 开始消费 → 重复消费。',
          '根本思路：消费端做幂等处理，而非指望 Kafka 保证 Exactly Once。',
          '方案一：数据库唯一约束。如订单表以 orderId 为唯一键，重复插入直接报错忽略。',
          '方案二：Redis 去重。消费前用 SETNX msgId 判断是否已处理。',
          '方案三：业务状态判断。如订单已支付，再收到支付消息直接跳过。',
          'Kafka 事务（Exactly Once Semantics）：Producer 开启事务 + Consumer read_committed，配合 Kafka Streams 可实现端到端精确一次。但仅限 Kafka → Kafka 链路，涉及外部存储仍需业务幂等。',
          '解决的问题：分布式环境下"至少一次"投递无法避免重复，幂等设计保证重复消费不会产生错误数据。',
        ],
        tags: ['幂等', '重复消费', '高频'],
        difficulty: '困难',
      },
    ],
  },

  /* ==================== 4. 消息有序性与高可用 ==================== */
  {
    title: '消息有序性与高可用',
    icon: '📊',
    qas: [
      {
        question: 'Kafka 如何保证消息顺序？',
        answer: [
          'Partition 内有序：Kafka 只保证单个 Partition 内的消息有序。同一 Partition 的消息按 Offset 顺序消费。',
          '全局有序方案（代价极大）：Topic 只设 1 个 Partition，丧失并行能力，吞吐量大幅下降。',
          '业务有序方案（推荐）：将需要保证顺序的消息发送到同一个 Partition。通过指定相同的 Key（如 orderId），hash(Key) 保证路由到同一 Partition。',
          '消费端保序：单 Partition 单 Consumer 天然有序。如果消费端多线程处理，需要按 Key 路由到同一线程（如线程池 + ConcurrentHashMap<Key, Queue>）。',
          '解决的问题：如订单状态变更消息（创建→支付→发货→完成）必须按顺序消费，乱序会导致状态不一致。',
        ],
        tags: ['顺序消费', '高频'],
        difficulty: '中等',
      },
      {
        question: 'Kafka 如何保证高可用？ISR 机制是什么？',
        answer: [
          '副本机制：每个 Partition 有 1 个 Leader + N 个 Follower。Producer / Consumer 只与 Leader 交互，Follower 从 Leader 拉取数据同步。',
          'ISR（In-Sync Replica）：与 Leader 保持同步的副本集合。Follower 落后太多（超过 replica.lag.time.max.ms）会被踢出 ISR。',
          'Leader 选举：Leader 宕机时，从 ISR 中选举新 Leader。如果 ISR 为空且 unclean.leader.election.enable=true（默认 false），则允许非同步副本成为 Leader（可能丢数据）。',
          'min.insync.replicas：ISR 中最少副本数。配合 acks=all 使用，ISR 数量不足时 Producer 会收到 NotEnoughReplicas 异常，拒绝写入，防止数据丢失。',
          '解决的问题：分布式系统中节点故障是常态，副本 + ISR + 自动选举保证了 Kafka 在 Broker 宕机时仍可提供服务且数据不丢失。',
        ],
        tags: ['ISR', '高可用'],
        difficulty: '困难',
      },
      {
        question: '消息积压了怎么办？',
        answer: [
          '原因分析：① 消费速度跟不上生产速度；② 消费者处理逻辑太慢（如同步调接口、写数据库慢）；③ 消费者异常导致消费暂停。',
          '紧急处理：① 增加 Partition 数量 + 增加 Consumer 实例（水平扩容）；② 如果 Consumer 数已 = Partition 数，临时创建新 Topic（更多 Partition），用一个中转程序快速将积压消息转发过去，再用更多 Consumer 消费新 Topic。',
          '长期优化：① 提升单条消息处理速度（异步化、批量处理、减少 IO）；② 合理设置 Partition 数量（通常 = Consumer 数量的整数倍）；③ 监控告警（Consumer Lag 指标），积压初期就介入。',
          '解决的问题：消息积压导致数据延迟、业务不及时（如订单长时间未支付提醒、实时风控延迟），需要快速恢复消费速度。',
        ],
        tags: ['消息积压', '实战'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 5. 存储与性能 ==================== */
  {
    title: '存储机制与高性能原理',
    icon: '⚡',
    qas: [
      {
        question: 'Kafka 为什么吞吐量这么高？',
        answer: [
          '① 顺序写磁盘：消息追加写入 Segment 文件尾部，顺序 IO 速度接近内存，远快于随机写。',
          '② Page Cache：利用操作系统的页缓存，写入先到 Page Cache 再异步刷盘，读取时如果命中缓存则零磁盘 IO。',
          '③ 零拷贝（Zero Copy）：消费者读取数据时，使用 sendfile 系统调用直接将数据从 Page Cache 传输到网卡缓冲区，跳过用户态，减少 2 次数据拷贝和 2 次上下文切换。',
          '④ 批量处理：Producer 批量发送、Broker 批量写入、Consumer 批量拉取，摊薄每条消息的网络和磁盘开销。',
          '⑤ 分区并行：多 Partition 分布在多 Broker 上，实现读写并行。',
          '⑥ 消息压缩：支持 GZIP、Snappy、LZ4、ZSTD，减少网络传输和磁盘占用。',
          '这些优化叠加使 Kafka 单 Broker 可达百万级 TPS，集群可达数百万级。',
        ],
        tags: ['高性能', '零拷贝', '高频'],
        difficulty: '困难',
      },
      {
        question: 'Kafka 的存储结构是怎样的？',
        answer: [
          '每个 Partition 对应磁盘上一个目录（topicName-partitionId），目录内按 Segment 分段存储。',
          '每个 Segment 包含：① .log 文件（存储实际消息数据）；② .index 文件（稀疏索引，Offset → 物理位置）；③ .timeindex 文件（时间戳索引）。',
          '查找流程：① 根据目标 Offset 二分查找定位到 Segment（文件名就是起始 Offset）；② 在 .index 中二分查找定位到最近的索引项；③ 从该位置顺序扫描 .log 找到精确 Offset。',
          'Log Retention：消息保留策略。按时间（log.retention.hours=168，默认 7 天）或按大小（log.retention.bytes）删除过期 Segment。',
          'Log Compaction：保留每个 Key 的最新 Value，清除历史值。适合维护"最新状态"的场景（如用户配置变更）。',
          '解决的问题：海量消息需要高效存储和快速检索，分段 + 稀疏索引 + 二分查找在磁盘上实现了 O(logN) 的查找效率。',
        ],
        tags: ['存储结构', 'Segment'],
        difficulty: '困难',
      },
    ],
  },
];

const KafkaInterviewPage: React.FC = () => (
  <InterviewLayout
    title="Kafka 面试题"
    description="覆盖核心概念、生产者与消费者、消息可靠性、有序性、高可用、高性能原理与存储机制。"
    sections={sections}
  />
);

export default KafkaInterviewPage;
