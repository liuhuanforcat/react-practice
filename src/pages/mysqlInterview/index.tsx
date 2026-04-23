import React from 'react';
import InterviewLayout, { SectionItem } from '../javaBasics/InterviewLayout';

const sections: SectionItem[] = [
  /* ==================== 1. 基础与存储引擎 ==================== */
  {
    title: '基础与存储引擎',
    icon: '🗃️',
    qas: [
      {
        question: 'MySQL 的架构分为哪几层？',
        answer: [
          '三层架构：',
          '① 连接层（Server 层上层）：负责客户端连接管理、身份认证、权限校验。每个连接分配一个线程（或线程池复用）。',
          '② Server 层：查询缓存（8.0 已移除）、SQL 解析器（语法分析生成 AST）、预处理器（语义检查）、优化器（选择执行计划、索引选择、JOIN 顺序）、执行器（调用存储引擎接口执行）。',
          '③ 存储引擎层：可插拔架构，负责数据的存储和提取。InnoDB（默认，支持事务/行锁/MVCC）、MyISAM（不支持事务，表锁，查询快）、Memory 等。',
          '解决的问题：分层架构让 SQL 解析/优化与数据存储解耦，支持多种存储引擎满足不同业务需求。',
        ],
        tags: ['架构'],
        difficulty: '中等',
      },
      {
        question: 'InnoDB 和 MyISAM 有何区别？为什么默认用 InnoDB？',
        answer: [
          'InnoDB：支持事务（ACID）、行级锁（并发高）、MVCC（多版本并发控制）、外键约束、崩溃恢复（redo log）。数据和索引存储在一起（聚簇索引）。',
          'MyISAM：不支持事务、表级锁（并发差）、不支持崩溃恢复。优点：全文索引（5.6 前 InnoDB 不支持）、压缩表占用空间小、count(*) 有优化（维护了行数变量）。',
          '为什么选 InnoDB：绝大多数业务需要事务保证数据一致性；行锁让并发读写性能远优于表锁；MVCC 实现了读不加锁，提升并发能力；崩溃恢复保证数据持久性。',
          '解决的问题：业务系统核心是数据一致性和并发能力，InnoDB 在这两方面全面优于 MyISAM，是现代 MySQL 应用的标准选择。',
        ],
        tags: ['InnoDB', 'MyISAM', '高频'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 2. 索引 ==================== */
  {
    title: '索引原理与优化',
    icon: '📇',
    qas: [
      {
        question: 'MySQL 索引的底层数据结构是什么？为什么用 B+ 树？',
        answer: [
          'InnoDB 使用 B+ 树作为索引结构。',
          'B+ 树特点：① 非叶子节点只存索引 Key，不存数据，单个节点可存更多 Key → 树更矮 → 磁盘 IO 次数更少（通常 3-4 层可存上千万数据）。② 叶子节点通过双向链表连接 → 范围查询高效（顺序遍历链表）。③ 所有数据都在叶子节点 → 查询路径长度一致，性能稳定。',
          '为什么不用其他结构：① Hash 索引不支持范围查询和排序；② 二叉搜索树可能退化为链表；③ AVL/红黑树树太高，磁盘 IO 多；④ B 树非叶子节点也存数据，扇出少树更高。',
          '解决的问题：数据库数据量大，必须存储在磁盘上。B+ 树最大限度减少磁盘 IO 次数（一次 IO 读取一个页 = 16KB = 一个节点），是磁盘存储场景下的最优索引结构。',
        ],
        tags: ['B+ 树', '高频'],
        difficulty: '困难',
      },
      {
        question: '聚簇索引和非聚簇索引（二级索引）的区别？什么是回表？',
        answer: [
          '聚簇索引（主键索引）：B+ 树的叶子节点直接存储完整的行数据。InnoDB 每张表有且仅有一个聚簇索引，优先使用主键，无主键则选唯一非空索引，否则生成隐藏的 ROW_ID。',
          '非聚簇索引（二级索引/辅助索引）：B+ 树的叶子节点存储的是主键值（而非完整行数据）。',
          '回表：通过二级索引查到主键值后，再到聚簇索引中查找完整行数据的过程。一次查询 = 查二级索引树 + 查聚簇索引树 = 两次 B+ 树查找。',
          '覆盖索引：如果查询的列全部包含在二级索引中，无需回表，直接返回。EXPLAIN 中显示 Using index。这是最重要的索引优化手段之一。',
          '解决的问题：理解回表才能做出正确的索引优化——建联合索引覆盖查询字段、避免 SELECT *、合理使用索引下推。',
        ],
        tags: ['聚簇索引', '回表', '高频'],
        difficulty: '困难',
      },
      {
        question: '联合索引和最左前缀原则是什么？',
        answer: [
          '联合索引：在多个列上建立一个 B+ 树索引，如 INDEX(a, b, c)。B+ 树先按 a 排序，a 相同按 b 排序，b 相同按 c 排序。',
          '最左前缀原则：查询条件必须从联合索引最左列开始匹配，才能使用索引。',
          '能走索引的情况：WHERE a=1；WHERE a=1 AND b=2；WHERE a=1 AND b=2 AND c=3；WHERE a=1 AND b>2（a 精确匹配 + b 范围查询，c 无法使用索引）。',
          '不能走索引：WHERE b=2（跳过了 a）；WHERE b=2 AND c=3（没有 a）。',
          '索引下推（Index Condition Pushdown, ICP）：MySQL 5.6+ 在索引遍历时，先用索引中包含的列做条件过滤，减少回表次数。EXPLAIN 中显示 Using index condition。',
          '解决的问题：合理设计联合索引可以用一个索引覆盖多种查询模式，减少索引数量和维护开销。原则：将区分度高的列放前面，范围查询的列放最后。',
        ],
        tags: ['联合索引', '最左前缀', '高频'],
        difficulty: '中等',
      },
      {
        question: '哪些情况会导致索引失效？',
        answer: [
          '① 对索引列使用函数或运算：WHERE YEAR(create_time) = 2024 → 改为范围查询。',
          '② 隐式类型转换：WHERE varchar_col = 123（字符串列传了数字）→ MySQL 会对列做隐式转换，索引失效。',
          '③ LIKE 以 % 开头：WHERE name LIKE "%abc" → 无法使用索引（最左前缀无法匹配）。LIKE "abc%" 可以。',
          '④ 使用 OR 且部分条件无索引：WHERE a=1 OR b=2（b 无索引则全表扫描）。',
          '⑤ 联合索引不满足最左前缀：跳过最左列。',
          '⑥ 优化器判断全表扫描更快：当查询结果集占比很高（如超过 30%）时，优化器可能选择全表扫描而非索引。',
          '⑦ NOT IN、!=、IS NOT NULL 在某些情况下会导致索引失效（取决于优化器判断）。',
          '解决的问题：写 SQL 时避免踩坑，确保索引能被正确使用。核心习惯：写完 SQL 先 EXPLAIN，确认 type 和 Extra 列。',
        ],
        tags: ['索引失效', '高频'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 3. 事务与锁 ==================== */
  {
    title: '事务与锁机制',
    icon: '🔐',
    qas: [
      {
        question: '事务的 ACID 特性及 InnoDB 如何保证？',
        answer: [
          'A（原子性）：事务是不可分割的最小执行单元，要么全部成功，要么全部回滚。InnoDB 通过 undo log 实现——记录修改前的数据，回滚时根据 undo log 恢复。',
          'C（一致性）：事务执行前后数据库从一个一致状态转到另一个一致状态（如转账前后总额不变）。这是事务的最终目标，由 AID 共同保证。',
          'I（隔离性）：并发事务之间互不干扰。InnoDB 通过 MVCC + 锁 实现。',
          'D（持久性）：事务提交后数据永久保存，即使系统崩溃也不丢失。InnoDB 通过 redo log 实现——先写 redo log（WAL, Write-Ahead Logging），再写数据页。崩溃恢复时重放 redo log。',
          '解决的问题：业务操作（转账、下单等）涉及多条 SQL，必须保证原子性和一致性，否则数据错乱造成资金损失等严重后果。',
        ],
        tags: ['ACID', '高频'],
        difficulty: '中等',
      },
      {
        question: '事务的隔离级别有哪些？MySQL 默认是哪个？',
        answer: [
          '读未提交（Read Uncommitted）：能读到其他事务未提交的数据（脏读）。几乎不使用。',
          '读已提交（Read Committed, RC）：只能读到已提交的数据。解决脏读，但存在不可重复读（同一事务内两次读取结果不同）。Oracle 默认级别。',
          '可重复读（Repeatable Read, RR）：MySQL InnoDB 默认级别。同一事务内多次读取结果一致。通过 MVCC（ReadView）实现。InnoDB 在 RR 级别下还通过 Next-Key Lock 解决了大部分幻读问题。',
          '串行化（Serializable）：事务串行执行，完全隔离。性能最差，几乎不使用。',
          '解决的问题：隔离级别越高安全性越好但并发性越差，选择合适的级别在"数据安全"与"系统性能"之间取得平衡。',
        ],
        tags: ['隔离级别', '高频'],
        difficulty: '中等',
      },
      {
        question: 'MVCC 是什么？如何实现？',
        answer: [
          '作用：MVCC（Multi-Version Concurrency Control，多版本并发控制）让读操作不加锁也能读到一致性快照，实现了"读不阻塞写，写不阻塞读"。',
          '实现基础：① 隐藏字段：每行数据有 trx_id（最后修改的事务 ID）和 roll_pointer（指向 undo log 的指针）；② undo log 版本链：每次修改都会在 undo log 中保存旧版本数据，形成链表。',
          'ReadView（一致性视图）：事务执行快照读（普通 SELECT）时生成，包含：m_ids（当前活跃事务 ID 列表）、min_trx_id、max_trx_id、creator_trx_id。',
          '可见性判断：沿 undo log 版本链查找，找到第一个 trx_id 满足可见性条件的版本返回。',
          'RC vs RR 的区别：RC 每次 SELECT 都生成新的 ReadView；RR 只在事务第一次 SELECT 时生成，后续复用 → 同一事务内读到的快照一致。',
          '解决的问题：不用 MVCC 时，读写必须加锁互斥，并发性能极差。MVCC 让读操作在不加锁的情况下也能保持隔离性，大幅提升并发性能。',
        ],
        tags: ['MVCC', '高频'],
        difficulty: '困难',
      },
      {
        question: 'InnoDB 的锁有哪些类型？',
        answer: [
          '按粒度：① 行级锁（Record Lock，锁定单行）；② 间隙锁（Gap Lock，锁定索引记录之间的间隙，防止幻读插入）；③ 临键锁（Next-Key Lock = Record Lock + Gap Lock，InnoDB RR 级别默认锁类型）；④ 表级锁（LOCK TABLES、元数据锁 MDL、意向锁 IS/IX）。',
          '按模式：共享锁（S 锁，读锁，SELECT ... LOCK IN SHARE MODE / FOR SHARE）、排他锁（X 锁，写锁，SELECT ... FOR UPDATE、INSERT/UPDATE/DELETE）。',
          '意向锁（IS/IX）：表级锁，表示事务"打算"对某些行加 S 或 X 锁。用于快速判断表锁与行锁是否冲突，避免逐行检查。',
          '死锁：两个事务互相等待对方持有的锁。InnoDB 通过 wait-for graph（等待图）检测死锁，自动回滚代价较小的事务。预防：固定加锁顺序、缩小事务范围、使用合理索引。',
          '解决的问题：并发事务同时修改同一行数据时需要互斥控制（如两人同时购买最后一件商品），锁机制保证数据一致性。',
        ],
        tags: ['锁', '死锁', '高频'],
        difficulty: '困难',
      },
    ],
  },

  /* ==================== 4. 日志系统 ==================== */
  {
    title: '日志系统',
    icon: '📋',
    qas: [
      {
        question: 'redo log、undo log、binlog 分别是什么？解决什么问题？',
        answer: [
          'redo log（重做日志）——InnoDB 引擎层：',
          '作用：保证事务持久性。记录"物理修改"（某个数据页的某个偏移量修改了什么），采用 WAL（Write-Ahead Logging）策略——先写 redo log，再异步写数据页。',
          '解决的问题：如果每次修改都直接写磁盘数据页（随机 IO，很慢），性能差。redo log 是顺序写入（快），崩溃后重放 redo log 恢复数据。',
          '',
          'undo log（回滚日志）——InnoDB 引擎层：',
          '作用：保证事务原子性 + 实现 MVCC。记录"修改前的数据"，回滚时据此还原。MVCC 中通过 undo log 版本链提供历史快照。',
          '',
          'binlog（归档日志）——Server 层：',
          '作用：记录所有 DDL 和 DML 语句的"逻辑日志"。用于主从复制（Slave 重放 Master 的 binlog）和数据恢复（基于时间点恢复）。',
          '格式：Statement（记录 SQL）、Row（记录行变更，推荐，数据一致性好）、Mixed（混合）。',
        ],
        tags: ['日志', '高频'],
        difficulty: '困难',
      },
      {
        question: '一条 UPDATE 语句的执行流程是什么？两阶段提交是什么？',
        answer: [
          '执行流程：① 执行器调用 InnoDB 读取目标行到 Buffer Pool；② 修改 Buffer Pool 中的数据页（脏页）；③ 写入 undo log（用于回滚）；④ 写入 redo log（prepare 状态）；⑤ 写入 binlog；⑥ 将 redo log 状态改为 commit。',
          '两阶段提交（2PC）：redo log 先 prepare → 写 binlog → redo log 再 commit。',
          '为什么需要两阶段提交：保证 redo log 和 binlog 的一致性。',
          '如果先写 redo log 再写 binlog：redo log 写成功但 binlog 写失败 → 主库有数据但从库没有 → 主从不一致。',
          '如果先写 binlog 再写 redo log：binlog 写成功但 redo log 写失败 → 主库崩溃恢复后没数据但从库有 → 主从不一致。',
          '两阶段提交保证了崩溃恢复时：redo log prepare + binlog 完整 → 提交；redo log prepare + binlog 不完整 → 回滚。',
          '解决的问题：保证主从数据一致性，这是 MySQL 主从架构和数据恢复的基石。',
        ],
        tags: ['两阶段提交', 'binlog', '高频'],
        difficulty: '困难',
      },
    ],
  },

  /* ==================== 5. SQL 优化 ==================== */
  {
    title: 'SQL 优化与实战',
    icon: '🚀',
    qas: [
      {
        question: 'EXPLAIN 怎么看？关键字段含义是什么？',
        answer: [
          'type（访问类型，从好到差）：system > const（主键/唯一索引等值）> eq_ref（JOIN 唯一索引）> ref（普通索引等值）> range（索引范围扫描）> index（全索引扫描）> ALL（全表扫描）。',
          'key：实际使用的索引名。NULL 表示未使用索引。',
          'rows：预估扫描行数，越小越好。',
          'Extra 关键值：Using index（覆盖索引，好）、Using index condition（索引下推）、Using where（Server 层过滤）、Using filesort（额外排序，需优化）、Using temporary（使用临时表，需优化）。',
          'possible_keys：可能使用的索引。如果不为空但 key 为 NULL，说明优化器判断全表扫描更快。',
          '解决的问题：EXPLAIN 是 SQL 优化的第一工具，通过它判断查询是否走了索引、扫描了多少行、有没有额外排序/临时表，定位性能瓶颈。',
        ],
        tags: ['EXPLAIN', '高频'],
        difficulty: '中等',
      },
      {
        question: '慢 SQL 如何排查和优化？',
        answer: [
          '发现：开启慢查询日志（slow_query_log=ON, long_query_time=1s），配合 pt-query-digest 分析 Top SQL。',
          '分析：EXPLAIN 查看执行计划 → 确认是否走索引、扫描行数、是否有 filesort/temporary。',
          '常见优化手段：',
          '① 加合适的索引：根据 WHERE、JOIN、ORDER BY、GROUP BY 条件建索引。联合索引覆盖高频查询。',
          '② 避免 SELECT *：只查需要的列，利用覆盖索引避免回表。',
          '③ 分页优化：深分页 LIMIT 100000, 10 需要扫描 100010 行。改为 WHERE id > last_id LIMIT 10（游标分页）或延迟关联（先查主键再 JOIN 原表）。',
          '④ JOIN 优化：小表驱动大表、被驱动表关联字段加索引、避免超过 3 表 JOIN。',
          '⑤ 子查询改 JOIN：子查询会产生临时表，改写为 JOIN 通常更快。',
          '解决的问题：慢 SQL 是数据库性能杀手，一条慢 SQL 可能拖垮整个数据库连接池，导致全站不可用。',
        ],
        tags: ['慢 SQL', '优化', '高频'],
        difficulty: '中等',
      },
      {
        question: '大表如何处理？分库分表方案是什么？',
        answer: [
          '单表优化（千万级以下）：合理索引、SQL 优化、读写分离。',
          '垂直分表：将大表中不常用的列拆分到扩展表中（如商品表拆分基本信息表 + 详情表），减少单行数据量，提升缓存命中率。',
          '垂直分库：按业务模块拆分数据库（订单库、用户库、商品库），降低单库压力，支持独立扩容。',
          '水平分表：将一张大表按某个维度（如 user_id % 8）拆分为多张结构相同的子表。解决单表数据量过大导致的索引效率下降和写入瓶颈。',
          '水平分库：在水平分表基础上，子表分布到不同数据库实例上，突破单库的连接数和 IO 上限。',
          '常用中间件：ShardingSphere（推荐，社区活跃）、MyCat。',
          '挑战：分布式事务、跨库 JOIN、全局 ID 生成（雪花算法）、数据迁移与扩容。',
          '解决的问题：单库单表无法承载亿级数据的读写需求 → 通过分库分表水平扩展数据库层的容量和性能。',
        ],
        tags: ['分库分表', '大表', '高频'],
        difficulty: '困难',
      },
    ],
  },

  /* ==================== 6. 主从复制 ==================== */
  {
    title: '主从复制与读写分离',
    icon: '🔄',
    qas: [
      {
        question: 'MySQL 主从复制的原理是什么？',
        answer: [
          '流程：① Master 执行写操作后将变更记录到 binlog；② Slave 的 IO 线程连接 Master，拉取 binlog 写入本地 relay log（中继日志）；③ Slave 的 SQL 线程读取 relay log 重放 SQL，完成数据同步。',
          '三种同步模式：',
          '异步复制（默认）：Master 写完 binlog 即返回客户端，不等 Slave 确认。最快但 Master 宕机可能丢数据。',
          '半同步复制：Master 等待至少一个 Slave 确认收到 binlog 后才返回。平衡性能和安全性。',
          '组复制（MGR）：基于 Paxos 协议的多主复制，强一致性，自动故障转移。',
          '解决的问题：① 单点故障 → 主从切换实现高可用；② 读性能瓶颈 → 读写分离，读请求分发到多个 Slave。',
        ],
        tags: ['主从复制', '高频'],
        difficulty: '中等',
      },
      {
        question: '主从延迟怎么办？如何保证读写分离下读到最新数据？',
        answer: [
          '延迟原因：① Slave 单线程重放（5.6 之前）或并行复制不充分；② Master 写入量大，Slave 跟不上；③ 大事务（如批量 UPDATE 百万行）；④ 网络延迟。',
          '解决方案：',
          '① 强制走主库：对"写后读"的场景，读操作也路由到 Master。如下单后立即查订单详情。',
          '② 延迟判断路由：查询前检查 Slave 延迟（SHOW SLAVE STATUS 的 Seconds_Behind_Master），延迟大则切到 Master。',
          '③ 半同步复制：保证至少一个 Slave 收到了最新 binlog。',
          '④ 等待 GTID：写操作返回 GTID，读操作指定 WAIT_FOR_EXECUTED_GTID_SET 等待 Slave 同步到该位点。',
          '⑤ 缓存兜底：写操作后将数据写入 Redis，短时间内读 Redis，过一会儿再读 Slave。',
          '解决的问题：读写分离场景下"写完立刻读"可能读到旧数据，导致用户"刚下的订单看不到"等体验问题。',
        ],
        tags: ['主从延迟', '读写分离'],
        difficulty: '中等',
      },
    ],
  },
];

const MySQLInterviewPage: React.FC = () => (
  <InterviewLayout
    title="MySQL 面试题"
    description="覆盖存储引擎、索引原理与优化、事务与锁、日志系统、SQL 优化、分库分表与主从复制。"
    sections={sections}
  />
);

export default MySQLInterviewPage;
