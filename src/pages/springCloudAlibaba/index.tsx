import React from 'react';
import InterviewLayout, { SectionItem } from '../javaBasics/InterviewLayout';

const sections: SectionItem[] = [
  /* ==================== 1. Nacos：服务注册与配置中心 ==================== */
  {
    title: 'Nacos —— 服务注册与配置中心',
    icon: '📡',
    qas: [
      {
        question: 'Nacos 是什么？解决了什么问题？',
        answer: [
          '作用：Nacos（Dynamic Naming and Configuration Service）是阿里开源的注册中心 + 配置中心二合一组件。',
          '作为注册中心：微服务启动时向 Nacos 注册自己的地址信息，消费者从 Nacos 拉取服务列表实现远程调用。支持 AP / CP 模式切换。',
          '作为配置中心：统一管理各微服务的配置，支持动态刷新（@RefreshScope），灰度发布，多环境（namespace + group + dataId）。',
          '解决的问题：① 服务发现——微服务实例动态变化（扩容/缩容），硬编码 IP 不可行；② 配置管理——几十个微服务的配置散落在各自 yml 中，修改需逐一重启；③ 替代 Eureka（停更）和 Spring Cloud Config + Bus 的组合方案，功能更强且维护活跃。',
        ],
        tags: ['注册中心', '配置中心', '高频'],
        difficulty: '中等',
      },
      {
        question: 'Nacos 注册中心的 AP 和 CP 模式有什么区别？',
        answer: [
          'AP 模式（默认，临时实例）：优先保证可用性。实例通过心跳维持注册，Nacos 节点之间异步复制数据。即使部分节点宕机，剩余节点仍可提供服务列表。Distro 协议实现。',
          'CP 模式（持久实例）：优先保证一致性。使用 Raft 协议，写操作需要半数以上节点确认才成功。节点宕机过多时服务不可用。',
          '临时实例（ephemeral=true）：客户端心跳维持，心跳超时自动摘除。适合 Spring Cloud 微服务。',
          '持久实例（ephemeral=false）：Nacos 主动健康检查，实例下线不会自动删除。适合 DNS、数据库等基础设施。',
          '解决的问题：不同业务对一致性和可用性的需求不同，Nacos 通过双模式让用户按场景选择，比 Eureka（纯 AP）和 ZooKeeper（纯 CP）更灵活。',
        ],
        tags: ['AP/CP', 'CAP'],
        difficulty: '困难',
      },
      {
        question: 'Nacos 配置中心的动态刷新原理？',
        answer: [
          '客户端使用长轮询（Long Polling）机制：客户端发送请求到 Nacos Server，如果配置没有变更，Server 会 hold 住请求（默认 30s），有变更则立即返回。',
          '对比短轮询：长轮询减少了无效请求次数，又能做到准实时感知配置变更（通常 1-2 秒内）。',
          '客户端收到变更后，通过 Spring Cloud 的 RefreshEvent 触发 @RefreshScope 标注 Bean 的重建，实现配置热更新。',
          '解决的问题：① 修改配置不用重启服务——数据库连接串、限流阈值、开关等热变更；② 配置版本管理——Nacos 自带历史版本和回滚能力；③ 灰度发布——通过 Beta 标签让配置只推送到部分实例。',
        ],
        tags: ['长轮询', '动态刷新'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 2. Sentinel：流量防护 ==================== */
  {
    title: 'Sentinel —— 流量防护与熔断降级',
    icon: '🛡️',
    qas: [
      {
        question: 'Sentinel 是什么？解决了什么问题？',
        answer: [
          '作用：Sentinel 是阿里开源的流量治理组件，以"流量"为切入点，覆盖流量控制、熔断降级、系统自适应保护、热点参数限流等核心场景。',
          '解决的问题：① 突发流量打爆服务（如秒杀、大促）→ 限流保护后端；② 下游服务故障导致级联雪崩 → 熔断降级快速失败；③ 系统整体负载过高 → 系统规则自适应保护。',
          '与 Hystrix 对比：Hystrix 已停更，基于线程池隔离（资源消耗大）；Sentinel 基于滑动窗口统计 + 信号量隔离，轻量级且实时性更好，还提供可视化控制台实时配置规则。',
        ],
        tags: ['流量控制', '高频'],
        difficulty: '中等',
      },
      {
        question: 'Sentinel 的限流算法有哪些？',
        answer: [
          '① 固定窗口计数器：简单但有临界突刺问题（两个窗口交界处可能通过 2 倍阈值的请求）。',
          '② 滑动窗口计数器（Sentinel 默认）：将时间窗口切分为更细的格子，统计更平滑，解决临界突刺。Sentinel 默认使用滑动窗口（LeapArray）。',
          '③ 漏桶算法（Leaky Bucket）：以恒定速率处理请求，超出的排队或丢弃。适合平滑流量，但不能应对合理的突发。',
          '④ 令牌桶算法（Token Bucket）：以恒定速率往桶中放令牌，请求需要获取令牌，桶满时多余令牌丢弃。允许一定程度的突发流量。Sentinel 的匀速排队模式基于漏桶思想。',
          '解决的问题：不同场景需要不同的流量整形策略——秒杀用快速失败，消息消费用匀速排队，API 网关用滑动窗口。',
        ],
        tags: ['限流算法', '高频'],
        difficulty: '困难',
      },
      {
        question: 'Sentinel 熔断降级的策略有哪些？',
        answer: [
          '① 慢调用比例（SLOW_REQUEST_RATIO）：当慢调用（RT > 阈值）的比例超过设定百分比时触发熔断。适合检测下游响应变慢的场景。',
          '② 异常比例（ERROR_RATIO）：当异常请求占比超过阈值时触发熔断。',
          '③ 异常数（ERROR_COUNT）：当异常请求数量超过阈值时触发熔断。',
          '熔断状态机：CLOSED（正常）→ OPEN（熔断，直接走降级逻辑）→ HALF-OPEN（探测恢复，放过少量请求试探）→ 成功则 CLOSED / 失败则 OPEN。',
          '降级处理：通过 @SentinelResource 的 blockHandler（被限流/熔断）和 fallback（业务异常）指定降级方法，返回兜底数据。',
          '解决的问题：服务 A 调用服务 B 超时 → 不熔断则 A 的线程被大量占用 → A 也不可用 → 级联雪崩。熔断机制快速切断不可用的依赖，保护系统整体稳定。',
        ],
        tags: ['熔断', '雪崩'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 3. Gateway：网关 ==================== */
  {
    title: 'Spring Cloud Gateway —— 微服务网关',
    icon: '🚪',
    qas: [
      {
        question: 'Spring Cloud Gateway 是什么？解决了什么问题？',
        answer: [
          '作用：Gateway 是 Spring Cloud 官方推出的 API 网关，基于 Spring WebFlux（Reactor Netty），全异步非阻塞，替代了 Zuul 1.x（同步阻塞）。',
          '核心功能：路由转发、负载均衡（整合 LoadBalancer）、限流、鉴权、日志、跨域、请求/响应改写。',
          '解决的问题：① 客户端不需要记住几十个微服务的地址，统一入口；② 通用逻辑（鉴权、限流、日志）在网关层统一处理，微服务只关注业务；③ 灰度发布——通过路由规则将部分流量导向新版本。',
        ],
        tags: ['网关', '高频'],
        difficulty: '中等',
      },
      {
        question: 'Gateway 的核心概念：Route、Predicate、Filter？',
        answer: [
          'Route（路由）：网关的基本构建单元，由 ID + 目标 URI + Predicate 集合 + Filter 集合组成。满足 Predicate 条件的请求会被转发到目标 URI。',
          'Predicate（断言/谓词）：匹配请求的条件。内置断言：Path（路径匹配）、Method（HTTP 方法）、Header、Query、Cookie、After/Before/Between（时间）、Weight（权重灰度）等。',
          'Filter（过滤器）：在请求转发前后执行逻辑。分为 GatewayFilter（作用于单个路由）和 GlobalFilter（作用于所有路由）。内置过滤器：AddRequestHeader、StripPrefix、Retry、CircuitBreaker 等。',
          '执行流程：请求 → Predicate 匹配路由 → pre Filter 链 → 转发到下游微服务 → post Filter 链 → 响应。',
          '解决的问题：通过声明式配置路由规则，无需硬编码，动态管理流量入口。配合 Nacos 可实现动态路由（从配置中心拉取路由表，热更新）。',
        ],
        tags: ['路由', '过滤器'],
        difficulty: '中等',
      },
      {
        question: 'Gateway 如何实现统一鉴权？',
        answer: [
          '方案：自定义 GlobalFilter，在请求到达下游服务前校验 Token。',
          '流程：① 从请求 Header 中获取 Authorization（JWT Token）；② 调用认证服务或本地解析 JWT 验证合法性和过期时间；③ 校验通过 → 将用户信息放入请求头传递给下游；校验失败 → 直接返回 401。',
          '白名单机制：登录接口、公开 API 等路径放行，不走鉴权逻辑。',
          '解决的问题：① 每个微服务都写一套鉴权逻辑 → 重复且难维护 → 网关统一入口鉴权一次即可；② 微服务内部调用可以信任（内网隔离），减少鉴权开销；③ 集中管理 Token 黑名单/刷新逻辑。',
        ],
        tags: ['鉴权', 'JWT', '实战'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 4. Seata：分布式事务 ==================== */
  {
    title: 'Seata —— 分布式事务',
    icon: '🔗',
    qas: [
      {
        question: 'Seata 是什么？解决了什么问题？',
        answer: [
          '作用：Seata 是阿里开源的分布式事务解决方案，提供 AT、TCC、Saga、XA 四种事务模式。',
          '核心问题：微服务架构下，一个业务操作涉及多个服务（如下单 = 扣库存 + 创建订单 + 扣余额），每个服务有自己的数据库，本地事务无法保证跨服务的数据一致性。',
          '三大角色：TC（Transaction Coordinator，事务协调器，Seata Server）、TM（Transaction Manager，事务管理器，发起方）、RM（Resource Manager，资源管理器，参与方）。',
          '流程：TM 开启全局事务 → 各 RM 执行本地事务并注册分支 → TM 提交/回滚全局事务 → TC 通知所有 RM 提交/回滚。',
        ],
        tags: ['分布式事务', '高频'],
        difficulty: '困难',
      },
      {
        question: 'Seata AT 模式的原理是什么？',
        answer: [
          '作用：AT（Auto Transaction）模式是 Seata 最常用的模式，对业务代码无侵入，基于"补偿"思想自动生成回滚 SQL。',
          '一阶段：拦截业务 SQL，在执行前记录 before image（修改前的数据快照），执行后记录 after image（修改后的数据快照），生成 undo_log 插入数据库，然后提交本地事务（不阻塞）。',
          '二阶段提交：全局事务成功 → 异步删除 undo_log，释放资源。',
          '二阶段回滚：全局事务失败 → 根据 undo_log 中的 before image 生成反向 SQL 回滚数据。回滚前会校验 after image 与当前数据是否一致（防止脏写）。',
          '解决的问题：① 业务代码无需手写补偿逻辑，只需加 @GlobalTransactional 注解；② 一阶段即提交本地事务，锁的持有时间短，性能远优于 XA；③ 适合大多数常规业务场景。',
        ],
        tags: ['AT 模式', '高频'],
        difficulty: '困难',
      },
      {
        question: 'Seata 四种模式如何选择？',
        answer: [
          'AT 模式（推荐默认）：无侵入，自动补偿。适合常规增删改场景，要求数据库支持本地事务（MySQL InnoDB）。不适合不支持 SQL 解析的场景。',
          'TCC 模式（Try-Confirm-Cancel）：业务侵入大，需要手写三个方法。性能最好，适合资金交易等对一致性要求极高的场景。需自行处理空回滚、幂等、悬挂问题。',
          'Saga 模式：长事务场景，每个参与者提供正向和补偿操作，通过状态机驱动。适合业务流程长、参与者多的场景（如旅游预订：机票+酒店+租车）。',
          'XA 模式：基于数据库 XA 协议，强一致性，两阶段提交期间锁资源。一致性最强但性能最差，适合对一致性要求极高且能接受性能损耗的场景。',
          '解决的问题：不同业务对一致性、性能、侵入性的要求不同，Seata 提供四种模式覆盖从"简单无侵入"到"强一致高性能"的完整需求谱。',
        ],
        tags: ['模式选择', 'TCC', 'Saga'],
        difficulty: '困难',
      },
    ],
  },

  /* ==================== 5. OpenFeign / Dubbo：服务调用 ==================== */
  {
    title: 'OpenFeign / Dubbo —— 服务调用',
    icon: '📞',
    qas: [
      {
        question: 'OpenFeign 是什么？解决了什么问题？',
        answer: [
          '作用：OpenFeign 是声明式的 HTTP 客户端，让微服务间的远程调用像调用本地方法一样简单。',
          '用法：定义接口 + @FeignClient(name = "order-service") + @GetMapping("/orders/{id}")，Spring Cloud 自动生成代理实现。',
          '内置整合：① 负载均衡（Spring Cloud LoadBalancer）；② 服务发现（从 Nacos 获取实例列表）；③ 熔断降级（整合 Sentinel fallback）。',
          '解决的问题：① 手动拼 URL + RestTemplate 调用 → 代码冗长、地址硬编码、容易出错；② 自动处理序列化/反序列化、超时重试、日志、压缩等通用逻辑；③ 接口即文档，调用方一目了然。',
        ],
        tags: ['Feign', '远程调用'],
        difficulty: '简单',
      },
      {
        question: 'OpenFeign 与 Dubbo 的区别？',
        answer: [
          '协议：Feign 基于 HTTP（RESTful），Dubbo 基于 TCP（自定义 Dubbo 协议 / Triple 协议），Dubbo 传输效率更高。',
          '调用方式：Feign 是声明式 HTTP 客户端，Dubbo 是完整的 RPC 框架（支持负载均衡、服务治理、流量管理）。',
          '序列化：Feign 通常用 JSON，可读性好但体积大；Dubbo 支持 Hessian2、Protobuf、Kryo 等二进制序列化，性能更优。',
          '适用场景：Feign 适合对外暴露 RESTful API 或异构系统（跨语言）调用；Dubbo 适合内部微服务之间的高性能调用。',
          'Spring Cloud Alibaba 生态中两者可以共存：对外 Gateway + Feign，对内 Dubbo。',
          '解决的问题：根据场景选择合适的通信方式——公司内部 Java 技术栈统一用 Dubbo 获得更好性能，跨语言或对外开放则用 Feign + HTTP。',
        ],
        tags: ['Dubbo', 'RPC', '高频'],
        difficulty: '中等',
      },
      {
        question: 'Dubbo 的服务调用流程是怎样的？',
        answer: [
          '① Provider 启动，向 Nacos/ZooKeeper 注册服务地址。',
          '② Consumer 启动，从注册中心订阅服务列表并缓存到本地。',
          '③ Consumer 调用时，通过负载均衡算法（Random/RoundRobin/LeastActive/ConsistentHash）选择一个 Provider。',
          '④ 通过 Netty 建立 TCP 长连接，将方法名、参数序列化后发送给 Provider。',
          '⑤ Provider 收到请求，反序列化后通过反射调用本地方法，将结果序列化返回。',
          '⑥ 注册中心推送变更（Provider 上下线），Consumer 实时更新本地缓存。即使注册中心宕机，Consumer 也能用缓存继续调用。',
          '解决的问题：屏蔽网络通信细节，让远程调用对开发者透明；自带负载均衡和容错（failover/failfast/failsafe）机制。',
        ],
        tags: ['Dubbo', '调用流程'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 6. 负载均衡与链路追踪 ==================== */
  {
    title: '负载均衡与链路追踪',
    icon: '🔄',
    qas: [
      {
        question: '客户端负载均衡与服务端负载均衡的区别？',
        answer: [
          '服务端负载均衡（Nginx / F5）：请求先到负载均衡器，由它选择后端实例转发。客户端不感知后端有多少实例。',
          '客户端负载均衡（Spring Cloud LoadBalancer / Ribbon）：客户端从注册中心拉取服务列表，在本地通过算法选择一个实例直接调用。',
          '常见算法：轮询（Round Robin）、随机（Random）、加权、最少活跃数（Least Active）、一致性哈希。',
          '解决的问题：微服务内部调用无需额外部署 Nginx，客户端直连 + 本地负载均衡即可。省去了一跳网络开销，且与服务发现天然结合。',
        ],
        tags: ['负载均衡'],
        difficulty: '简单',
      },
      {
        question: '分布式链路追踪是什么？SkyWalking 解决了什么问题？',
        answer: [
          '作用：在微服务架构中，一个请求可能经过 10+ 个服务，当出现延迟或异常时，需要追踪请求在各服务间的调用链路。',
          '核心概念：Trace（一次完整的请求链路）、Span（链路中的一个调用环节）、TraceId（全局唯一 ID 串联整条链路）、SpanId（标识具体环节）。',
          'SkyWalking 是 Apache 开源的 APM（Application Performance Management）系统，通过 Java Agent 字节码增强实现无侵入埋点，零代码修改。',
          '提供能力：服务拓扑图、调用链详情、各环节耗时、异常定位、JVM 指标监控、告警。',
          '解决的问题：① 微服务调用链复杂，出问题不知道是哪个环节慢 → 链路追踪精准定位；② 服务依赖关系不清楚 → 拓扑图自动生成；③ 手动加日志追踪 → 无侵入采集。',
        ],
        tags: ['链路追踪', 'SkyWalking'],
        difficulty: '中等',
      },
    ],
  },
];

const SpringCloudAlibabaPage: React.FC = () => (
  <InterviewLayout
    title="Spring Cloud Alibaba 面试题"
    description="覆盖 Nacos、Sentinel、Gateway、Seata、OpenFeign/Dubbo 五大核心组件及微服务治理。"
    sections={sections}
  />
);

export default SpringCloudAlibabaPage;
