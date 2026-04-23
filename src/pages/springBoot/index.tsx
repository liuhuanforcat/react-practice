import React from 'react';
import InterviewLayout, { SectionItem } from '../javaBasics/InterviewLayout';

const sections: SectionItem[] = [
  /* ==================== 1. 核心概念与自动配置 ==================== */
  {
    title: '核心概念与自动配置',
    icon: '🚀',
    qas: [
      {
        question: 'Spring Boot 是什么？它解决了什么问题？',
        answer: [
          '作用：Spring Boot 是基于 Spring 框架的快速开发脚手架，目标是"约定优于配置"，让开发者用最少的配置快速构建生产级 Spring 应用。',
          '解决的问题：① 传统 Spring 项目需要大量 XML 配置（数据源、事务、MVC 等），配置繁琐且容易出错；② 依赖管理混乱，版本冲突频繁；③ 部署需要外部 Tomcat 等容器。',
          'Spring Boot 通过自动配置、起步依赖（Starter）、内嵌容器三大核心机制，将项目搭建时间从"小时级"降低到"分钟级"。',
          '一句话总结：Spring Boot 让 Spring 开发从"配置地狱"变成了"开箱即用"。',
        ],
        tags: ['核心概念', '高频'],
        difficulty: '简单',
      },
      {
        question: 'Spring Boot 自动配置的原理是什么？',
        answer: [
          '作用：根据项目引入的依赖（classpath 中的 jar）自动推断并注册所需的 Bean，免去手动配置。',
          '核心注解 @SpringBootApplication = @SpringBootConfiguration + @EnableAutoConfiguration + @ComponentScan。',
          '@EnableAutoConfiguration 通过 @Import(AutoConfigurationImportSelector.class) 触发自动配置。',
          'AutoConfigurationImportSelector 会读取所有 jar 包下 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports（Spring Boot 3.x）或 META-INF/spring.factories（2.x）中列出的自动配置类。',
          '每个自动配置类通过 @ConditionalOnClass、@ConditionalOnMissingBean、@ConditionalOnProperty 等条件注解判断是否生效。',
          '解决的问题：开发者引入 spring-boot-starter-web 后，DispatcherServlet、Jackson、内嵌 Tomcat 等全部自动配置好，无需一行 XML。',
        ],
        tags: ['自动配置', '高频'],
        difficulty: '困难',
      },
      {
        question: 'Spring Boot Starter 是什么？如何自定义 Starter？',
        answer: [
          '作用：Starter 是一组预定义的依赖集合 + 自动配置，引入一个 Starter 即可获得某个功能所需的全部依赖和默认配置。',
          '例如 spring-boot-starter-web 自动引入 Spring MVC、Jackson、内嵌 Tomcat；spring-boot-starter-data-redis 自动引入 Lettuce 客户端和 RedisTemplate 配置。',
          '自定义 Starter 步骤：① 创建 autoconfigure 模块，编写 @Configuration 自动配置类 + @ConfigurationProperties 属性类；② 在 META-INF/spring/... 中注册自动配置类；③ 创建 starter 模块，仅做依赖聚合。',
          '解决的问题：封装公司内部中间件（如统一日志、分布式 ID 生成器），业务方只需引入一个 GAV 坐标即可使用。',
        ],
        tags: ['Starter', '实战'],
        difficulty: '中等',
      },
      {
        question: '@Conditional 系列注解有哪些？分别什么作用？',
        answer: [
          '@ConditionalOnClass / @ConditionalOnMissingClass：classpath 中是否存在某个类时生效。自动配置的核心判断条件。',
          '@ConditionalOnBean / @ConditionalOnMissingBean：容器中是否已存在某个 Bean 时生效。防止覆盖用户自定义配置。',
          '@ConditionalOnProperty：配置文件中某个属性值满足条件时生效。可用于功能开关。',
          '@ConditionalOnWebApplication / @ConditionalOnNotWebApplication：当前是否为 Web 环境。',
          '@ConditionalOnExpression：SpEL 表达式为 true 时生效。',
          '解决的问题：让自动配置具有"智能判断"能力，只在满足特定条件时才注册 Bean，实现灵活的按需加载。',
        ],
        tags: ['条件注解'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 2. Spring IOC 与 AOP ==================== */
  {
    title: 'Spring IOC 与 AOP',
    icon: '🏗️',
    qas: [
      {
        question: 'Spring IOC 容器是什么？解决了什么问题？',
        answer: [
          '作用：IOC（Inversion of Control，控制反转）是一种设计思想——将对象的创建和依赖关系的管理交给容器，而非由程序员手动 new 对象。',
          '核心容器：BeanFactory（懒加载，轻量）和 ApplicationContext（饿加载，功能更丰富，支持事件、国际化、AOP 等）。',
          'DI（Dependency Injection，依赖注入）是 IOC 的实现方式：① 构造器注入（推荐，不可变、可 final）；② Setter 注入；③ 字段注入（@Autowired，方便但不利于测试）。',
          '解决的问题：① 解耦——类不再硬编码依赖，便于替换和测试（Mock）；② 统一管理对象生命周期和作用域（singleton、prototype 等）；③ 便于实现 AOP、事务等横切关注点。',
        ],
        tags: ['IOC', 'DI', '高频'],
        difficulty: '中等',
      },
      {
        question: 'Bean 的生命周期是怎样的？',
        answer: [
          '完整生命周期：实例化 → 属性赋值 → Aware 接口回调 → BeanPostProcessor.postProcessBeforeInitialization → InitializingBean.afterPropertiesSet / @PostConstruct → 自定义 init-method → BeanPostProcessor.postProcessAfterInitialization → 使用 → DisposableBean.destroy / @PreDestroy → 自定义 destroy-method。',
          '作用：理解生命周期才能正确使用初始化回调、扩展点（BeanPostProcessor）以及优雅关闭资源。',
          'BeanPostProcessor 是 Spring 最强大的扩展点：AOP 代理、@Autowired 注入、@Value 解析、@Async 等都是通过它实现的。',
          '解决的问题：开发者可以在 Bean 的任意阶段插入自定义逻辑，如连接池初始化、缓存预热、资源释放等。',
        ],
        tags: ['Bean 生命周期', '高频'],
        difficulty: '困难',
      },
      {
        question: 'Spring AOP 是什么？解决了什么问题？',
        answer: [
          '作用：AOP（Aspect Oriented Programming，面向切面编程）将横切关注点（日志、事务、权限、监控）从业务逻辑中抽离，集中管理。',
          '核心概念：切面（Aspect）= 切点（Pointcut）+ 通知（Advice）。通知类型：@Before、@After、@AfterReturning、@AfterThrowing、@Around。',
          '实现原理：Spring AOP 基于动态代理。目标类实现接口 → JDK 动态代理；否则 → CGLIB 字节码代理。Spring Boot 2.x 默认统一使用 CGLIB。',
          '解决的问题：① 消除大量重复的横切代码（每个方法都写日志/事务）；② 业务代码保持纯净，职责单一；③ 开闭原则——不修改源码即可增强功能。',
          '典型应用：@Transactional 声明式事务、@Cacheable 缓存、@Async 异步、统一异常处理、接口耗时监控。',
        ],
        tags: ['AOP', '高频'],
        difficulty: '中等',
      },
      {
        question: '@Transactional 事务失效的常见场景有哪些？',
        answer: [
          '① 方法不是 public：Spring AOP 默认只代理 public 方法。',
          '② 自调用（this 调用）：同一个类中方法 A 调用方法 B，不经过代理对象，B 上的 @Transactional 不生效。解决：注入自身代理 / AopContext.currentProxy() / 抽到另一个 Service。',
          '③ 异常被吞：catch 了异常没有重新抛出，Spring 检测不到异常，不会回滚。',
          '④ rollbackFor 未指定：默认只回滚 RuntimeException 和 Error，受检异常不回滚。建议显式 @Transactional(rollbackFor = Exception.class)。',
          '⑤ 数据库引擎不支持事务：如 MySQL 的 MyISAM 引擎。',
          '⑥ propagation 设置不当：如 REQUIRES_NEW 会挂起外层事务，NOT_SUPPORTED 会以非事务方式运行。',
          '解决的问题：理解事务失效场景，才能写出真正可靠的业务代码，避免"以为有事务其实没有"的生产事故。',
        ],
        tags: ['事务', '高频'],
        difficulty: '困难',
      },
    ],
  },

  /* ==================== 3. Spring MVC 与 Web 开发 ==================== */
  {
    title: 'Spring MVC 与 Web 开发',
    icon: '🌐',
    qas: [
      {
        question: 'Spring MVC 的请求处理流程是什么？',
        answer: [
          '① 客户端发送请求到 DispatcherServlet（前端控制器，统一入口）。',
          '② DispatcherServlet 调用 HandlerMapping 查找匹配的 Handler（Controller 方法）。',
          '③ 通过 HandlerAdapter 适配并执行 Handler，返回 ModelAndView。',
          '④ DispatcherServlet 将 ModelAndView 交给 ViewResolver 解析为具体的 View。',
          '⑤ View 渲染后返回响应给客户端。（前后端分离场景下，直接返回 JSON，无需 ViewResolver）。',
          '解决的问题：统一的请求分发 + 处理 + 视图渲染流程，将 Web 层逻辑模块化，每个组件可独立扩展（如自定义参数解析器、消息转换器等）。',
        ],
        tags: ['MVC', '请求流程'],
        difficulty: '中等',
      },
      {
        question: '常用注解 @Controller、@RestController、@RequestMapping 等的区别？',
        answer: [
          '@Controller：标记为 Spring MVC 控制器，返回值默认是视图名。',
          '@RestController = @Controller + @ResponseBody：所有方法返回值直接序列化为 JSON/XML，适合 RESTful API。',
          '@RequestMapping：通用映射注解，支持所有 HTTP 方法。@GetMapping、@PostMapping、@PutMapping、@DeleteMapping 是其快捷方式。',
          '@RequestParam：绑定查询参数；@PathVariable：绑定 URL 路径变量；@RequestBody：反序列化请求体 JSON 为对象。',
          '@Valid / @Validated：参数校验，配合 JSR 303（@NotNull、@Size 等），校验失败自动返回 400。',
          '解决的问题：通过注解声明式地定义 API 路由、参数绑定、校验规则，减少手动解析请求参数的繁琐代码。',
        ],
        tags: ['注解', 'RESTful'],
        difficulty: '简单',
      },
      {
        question: '全局异常处理怎么做？',
        answer: [
          '@ControllerAdvice + @ExceptionHandler：统一捕获 Controller 抛出的异常，返回规范的错误响应。',
          '典型实现：定义一个 GlobalExceptionHandler 类，分别处理 BusinessException（自定义业务异常）、MethodArgumentNotValidException（参数校验异常）、Exception（兜底）。',
          '返回统一的 Result<T> 结构，包含 code、message、data，便于前端统一处理。',
          '解决的问题：① 消除每个 Controller 方法中重复的 try-catch；② 防止将堆栈信息暴露给前端（安全隐患）；③ 让所有 API 的错误响应格式一致。',
        ],
        tags: ['异常处理', '实战'],
        difficulty: '中等',
      },
      {
        question: '拦截器（Interceptor）与过滤器（Filter）的区别？',
        answer: [
          'Filter 是 Servlet 规范，作用在 DispatcherServlet 之前，可以处理所有请求（包括静态资源）。典型场景：字符编码、CORS、请求日志。',
          'Interceptor 是 Spring MVC 提供的，作用在 DispatcherServlet 之后、Handler 执行前后。可以获取到 Handler 信息、ModelAndView 等 Spring 上下文。',
          '执行顺序：Filter.doFilter → DispatcherServlet → Interceptor.preHandle → Handler → Interceptor.postHandle → View渲染 → Interceptor.afterCompletion → Filter 返回。',
          '解决的问题：Filter 解决 Servlet 层通用需求，Interceptor 解决 Spring MVC 层业务需求（如登录校验、权限检查、接口耗时统计）。两者配合覆盖不同粒度的请求处理。',
        ],
        tags: ['拦截器', '过滤器'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 4. Spring Boot 核心特性 ==================== */
  {
    title: 'Spring Boot 核心特性',
    icon: '⚙️',
    qas: [
      {
        question: 'Spring Boot 的配置文件加载优先级是什么？',
        answer: [
          '优先级从高到低：命令行参数 > java:comp/env JNDI > 系统属性 > 环境变量 > application-{profile}.yml > application.yml > @PropertySource > 默认属性。',
          '同名属性高优先级覆盖低优先级，不同属性互补合并。',
          'Profile 机制：通过 spring.profiles.active=dev/test/prod 激活不同环境配置，实现一套代码多环境部署。',
          '外部化配置支持：jar 包外的 config 目录 > jar 包外根目录 > jar 包内 config > jar 包内根目录。',
          '解决的问题：多环境隔离、敏感配置外置、运维无需改代码即可调整参数（如数据库连接、线程池大小）。',
        ],
        tags: ['配置', '多环境'],
        difficulty: '中等',
      },
      {
        question: 'Spring Boot Actuator 有什么作用？',
        answer: [
          '作用：提供生产级的监控和管理端点，让运维可以查看应用的健康状态、指标、配置等信息。',
          '核心端点：/actuator/health（健康检查，K8s 存活/就绪探针）、/actuator/metrics（JVM、HTTP、线程池等指标）、/actuator/info（应用信息）、/actuator/env（环境配置）。',
          '整合 Prometheus + Grafana：通过 micrometer-registry-prometheus 暴露 /actuator/prometheus 端点，Prometheus 定时拉取指标，Grafana 可视化展示。',
          '解决的问题：① 微服务运行状态不透明 → 健康检查 + 指标监控；② 线上排查困难 → 动态查看配置、Bean、日志级别；③ K8s 部署 → 提供标准化健康探针。',
        ],
        tags: ['监控', '运维'],
        difficulty: '中等',
      },
      {
        question: 'Spring Boot 内嵌容器是什么？如何选择？',
        answer: [
          '作用：Spring Boot 内嵌了 Servlet 容器（Tomcat / Jetty / Undertow），应用打成 jar 包即可独立运行，无需部署到外部容器。',
          'Tomcat（默认）：成熟稳定，社区庞大，适合大多数场景。',
          'Jetty：轻量级，长连接友好（WebSocket），适合 API 网关或长轮询场景。',
          'Undertow：高性能，非阻塞 IO，适合高并发场景，Wildfly 默认容器。',
          '切换方式：排除 spring-boot-starter-tomcat，引入 spring-boot-starter-jetty 或 spring-boot-starter-undertow。',
          '解决的问题：① 消除"本地开发用 IDEA 运行、线上部署到 Tomcat"的差异 → 开发运行环境一致；② 配合 Docker 化，一个 jar = 一个容器，简化部署流程。',
        ],
        tags: ['内嵌容器', '部署'],
        difficulty: '简单',
      },
      {
        question: 'Spring Boot 如何优雅停机？',
        answer: [
          '作用：停机时不粗暴断开连接，而是等待正在处理的请求完成后再关闭，避免数据丢失或用户请求失败。',
          '配置：server.shutdown=graceful（Spring Boot 2.3+），配合 spring.lifecycle.timeout-per-shutdown-phase=30s 设置等待超时。',
          '流程：收到 SIGTERM → 停止接受新请求 → 等待已有请求完成（最长等待超时时间）→ 销毁 Bean → 关闭 JVM。',
          '配合 K8s：terminationGracePeriodSeconds（默认 30s）需要 ≥ Spring Boot 的 shutdown timeout，并配合 preStop 钩子确保流量切换完成。',
          '解决的问题：微服务发版、缩容时避免请求中断、消息丢失、事务不完整等问题，保证用户无感知发布。',
        ],
        tags: ['优雅停机', 'K8s'],
        difficulty: '中等',
      },
    ],
  },
];

const SpringBootPage: React.FC = () => (
  <InterviewLayout
    title="Spring Boot 面试题"
    description="覆盖自动配置原理、IOC/AOP、Spring MVC、核心特性与生产实践。"
    sections={sections}
  />
);

export default SpringBootPage;
