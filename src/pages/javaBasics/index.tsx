import React, { useMemo, useState } from 'react';
import { Card, Collapse, Input, List, Space, Tag, Typography, Badge } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

type Difficulty = '简单' | '中等' | '困难';

interface QaItem {
  question: string;
  answer: string[];
  tags?: string[];
  difficulty?: Difficulty;
}

interface SectionItem {
  title: string;
  icon: string;
  qas: QaItem[];
}

const difficultyColor: Record<Difficulty, string> = {
  简单: 'green',
  中等: 'orange',
  困难: 'red',
};

const sections: SectionItem[] = [
  /* ==================== 1. 面向对象与语言基础 ==================== */
  {
    title: '面向对象与语言基础',
    icon: '☕',
    qas: [
      {
        question: 'JDK、JRE、JVM 三者的关系是什么？',
        answer: [
          'JDK（Java Development Kit）是完整的 Java 开发工具包，包含 JRE、编译器 javac、调试器 jdb、打包工具 jar 等。',
          'JRE（Java Runtime Environment）是 Java 运行环境，包含 JVM 和核心类库（rt.jar 等），能运行已编译的 .class 文件。',
          'JVM（Java Virtual Machine）是 Java 虚拟机，负责将字节码解释/编译为机器码执行，并管理内存与垃圾回收。',
          '三者关系：JDK ⊃ JRE ⊃ JVM。开发时需要 JDK，部署运行只需 JRE，JVM 是最底层的执行引擎。',
        ],
        tags: ['JVM', '基础概念'],
        difficulty: '简单',
      },
      {
        question: 'Java 的基本数据类型有哪些？各占多少字节？',
        answer: [
          'byte（1 字节，-128 ~ 127）、short（2 字节）、int（4 字节）、long（8 字节）。',
          'float（4 字节，单精度）、double（8 字节，双精度）。',
          'char（2 字节，Unicode 字符）、boolean（JVM 规范未明确字节数，通常 1 字节）。',
          '自动装箱对应包装类：Integer、Long、Double 等。Integer 缓存池默认 -128 ~ 127，在此范围 valueOf 返回缓存对象。',
        ],
        tags: ['数据类型'],
        difficulty: '简单',
      },
      {
        question: '重载（Overload）和重写（Override）的区别？',
        answer: [
          '重载发生在同一个类中，要求方法名相同、参数列表不同（类型/数量/顺序），与返回值无关。',
          '重写发生在子类继承父类时，方法签名（名称+参数）必须一致。',
          '重写约束：返回类型必须兼容（可协变）；访问权限不能比父类更严格；不能抛出比父类更宽的受检异常。',
          '重载是编译期多态（静态分派），重写是运行期多态（动态分派，通过虚方法表实现）。',
          '@Override 注解建议必须加，编译器会帮助检查是否真正构成重写。',
        ],
        tags: ['OOP', '多态'],
        difficulty: '简单',
      },
      {
        question: '== 与 equals() 的区别？为什么重写 equals 必须重写 hashCode？',
        answer: [
          '== 对基本类型比较的是值，对引用类型比较的是内存地址（是否是同一个对象）。',
          'equals() 继承自 Object，默认实现就是 ==；String、Integer 等类已重写为内容比较。',
          'hashCode 契约：两个对象 equals 为 true，则 hashCode 必须相同；hashCode 相同不代表 equals 为 true。',
          '如果只重写 equals 不重写 hashCode，在 HashMap/HashSet 中会出现"逻辑相等的对象"被放入不同桶，导致查找失败。',
          '实践建议：使用 Objects.hash() 或 IDE 自动生成保持一致性。',
        ],
        tags: ['Object', '集合'],
        difficulty: '中等',
      },
      {
        question: '接口（interface）与抽象类（abstract class）有何区别？',
        answer: [
          '抽象类可以有构造方法、成员变量、具体方法；接口（JDK8 前）只能有常量和抽象方法。',
          'JDK8 起接口支持 default 方法和 static 方法；JDK9 起支持 private 方法。',
          '类只能单继承抽象类，但可以实现多个接口。',
          '设计层面：抽象类表达 "is-a" 关系（如 Animal），接口表达 "has-a/can-do" 能力（如 Serializable、Comparable）。',
          '当需要共享代码逻辑时用抽象类，当需要定义规范/能力契约时用接口。',
        ],
        tags: ['OOP', '设计'],
        difficulty: '中等',
      },
      {
        question: 'final、finally、finalize 的区别？',
        answer: [
          'final 是修饰符：修饰类不可继承，修饰方法不可重写，修饰变量不可重新赋值（引用不可变，对象内容可变）。',
          'finally 是异常处理关键字，无论是否发生异常都会执行，常用于资源释放。唯一不执行的情况：JVM 退出（System.exit）。',
          'finalize 是 Object 的方法，GC 回收对象前调用。JDK9 已标记 @Deprecated，不推荐使用，应改用 try-with-resources 或 Cleaner。',
        ],
        tags: ['关键字'],
        difficulty: '简单',
      },
      {
        question: '深拷贝与浅拷贝的区别？',
        answer: [
          '浅拷贝：创建新对象，但内部引用类型字段仍指向原对象的同一块内存。Object.clone() 默认就是浅拷贝。',
          '深拷贝：递归复制所有引用类型字段，使新旧对象完全独立。',
          '实现深拷贝的常见方式：① 手动递归 clone；② 序列化/反序列化（如 JSON、ObjectOutputStream）；③ 第三方工具如 Apache BeanUtils.cloneBean。',
          '实际开发中推荐使用序列化方式，简单且不容易遗漏字段。',
        ],
        tags: ['Object', '内存'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 2. String 与常用类 ==================== */
  {
    title: 'String 与常用类',
    icon: '📝',
    qas: [
      {
        question: 'String 为什么是不可变的？有什么好处？',
        answer: [
          'String 类被 final 修饰不可继承，内部 char[]（JDK9+ 为 byte[]）也是 final 且私有的，没有对外暴露修改方法。',
          '不可变的好处：① 线程安全，天然可在多线程间共享；② 可以缓存 hashCode，HashMap 中作 key 性能更好；③ 字符串常量池复用。',
          '安全性：网络连接、文件路径、类加载等场景依赖 String 不变性保证安全。',
        ],
        tags: ['String', '不可变'],
        difficulty: '中等',
      },
      {
        question: 'String、StringBuilder、StringBuffer 的区别？',
        answer: [
          'String 不可变，每次拼接都会创建新对象，频繁拼接性能差。',
          'StringBuilder 可变，非线程安全，单线程下字符串拼接首选，性能最优。',
          'StringBuffer 可变，方法加了 synchronized，线程安全但性能略低于 StringBuilder。',
          '编译器优化：简单的 "a" + "b" 编译器会直接合并为 "ab"；循环内拼接编译器会自动使用 StringBuilder（但每次循环会 new 一个），所以循环内仍建议手动使用 StringBuilder。',
        ],
        tags: ['String', '性能'],
        difficulty: '简单',
      },
      {
        question: 'String s = new String("abc") 创建了几个对象？',
        answer: [
          '最多 2 个，最少 1 个。',
          '第一个：字符串常量池中的 "abc" 对象（如果常量池中已存在则不创建）。',
          '第二个：堆中通过 new 创建的 String 对象，其内部 value 指向常量池中 "abc" 的 char[]。',
          'intern() 方法可以手动将堆中的字符串放入常量池（如果池中已有则返回池中引用）。',
        ],
        tags: ['String', '内存'],
        difficulty: '中等',
      },
      {
        question: 'Object 类有哪些常用方法？',
        answer: [
          'equals(Object obj)：判断对象是否相等，默认比较地址。',
          'hashCode()：返回对象的哈希码，配合 equals 使用。',
          'toString()：返回对象的字符串表示，默认 "类名@十六进制hashCode"。',
          'clone()：浅拷贝对象，需实现 Cloneable 接口。',
          'getClass()：返回对象的运行时 Class 对象，是反射的入口。',
          'wait() / notify() / notifyAll()：线程间通信，必须在 synchronized 块中调用。',
          'finalize()：GC 回收前调用（已废弃）。',
        ],
        tags: ['Object'],
        difficulty: '简单',
      },
    ],
  },

  /* ==================== 3. 集合框架 ==================== */
  {
    title: '集合框架',
    icon: '📦',
    qas: [
      {
        question: 'Java 集合框架的整体结构是什么样的？',
        answer: [
          '两大顶层接口：Collection 和 Map。',
          'Collection 分支：List（有序可重复）→ ArrayList、LinkedList、Vector；Set（无序不重复）→ HashSet、LinkedHashSet、TreeSet；Queue → PriorityQueue、ArrayDeque。',
          'Map 分支：HashMap、LinkedHashMap、TreeMap、Hashtable、ConcurrentHashMap。',
          'Collections 是工具类，提供排序、查找、同步包装等静态方法；Collection 是接口。',
        ],
        tags: ['Collection', '架构'],
        difficulty: '简单',
      },
      {
        question: 'ArrayList 和 LinkedList 有何区别？',
        answer: [
          'ArrayList 底层是 Object[] 动态数组，默认初始容量 10，扩容为 1.5 倍。支持随机访问（实现 RandomAccess），get(i) 时间复杂度 O(1)。',
          'LinkedList 底层是双向链表（Node 结构），不支持随机访问，get(i) 需要遍历 O(n)。同时实现了 Deque 接口，可当栈和队列使用。',
          '尾部插入两者性能接近；中间插入 ArrayList 需要移动元素 O(n)，LinkedList 定位到节点后插入 O(1)，但定位本身也是 O(n)。',
          '内存方面：LinkedList 每个节点额外存储前后指针，内存开销更大，且缓存不友好。',
          '实际场景：绝大多数情况优先 ArrayList，LinkedList 仅在频繁头部插入/删除（如队列场景）有微弱优势。',
        ],
        tags: ['List', '数据结构'],
        difficulty: '中等',
      },
      {
        question: 'HashMap 的底层原理？JDK7 和 JDK8 有什么区别？',
        answer: [
          'JDK7：数组 + 链表。哈希冲突时用头插法插入链表。多线程扩容可能形成环形链表，导致死循环。',
          'JDK8：数组 + 链表 + 红黑树。哈希冲突时用尾插法。当链表长度 ≥ 8 且数组容量 ≥ 64 时，链表转红黑树（treeify）；节点数 ≤ 6 时退化回链表。',
          'hash 计算：key.hashCode() 高 16 位与低 16 位异或（扰动函数），再与 (n-1) 按位与确定桶索引，因此容量必须是 2 的幂。',
          '扩容机制：默认负载因子 0.75，当 size > capacity × loadFactor 时扩容为 2 倍。JDK8 扩容时利用高位 bit 判断元素在原位还是原位+旧容量。',
          '线程不安全：多线程 put 可能导致数据覆盖、size 不准确。并发场景应使用 ConcurrentHashMap。',
        ],
        tags: ['HashMap', '数据结构', '高频'],
        difficulty: '困难',
      },
      {
        question: 'ConcurrentHashMap 如何保证线程安全？JDK7 和 JDK8 的区别？',
        answer: [
          'JDK7：Segment 分段锁，每个 Segment 继承 ReentrantLock，默认 16 个段，最高支持 16 个线程并发写。',
          'JDK8：废弃 Segment，改用 CAS + synchronized 锁单个桶（Node）。粒度更细，并发度大幅提升。',
          'JDK8 中 put 流程：① 计算 hash，定位桶；② 桶为空则 CAS 写入；③ 桶不为空则 synchronized 锁住头节点，遍历链表/红黑树插入。',
          'size() 使用 baseCount + CounterCell[] 分散计数（类似 LongAdder），减少竞争。',
          '不允许 key 或 value 为 null（避免二义性：null 值无法区分"不存在"和"存的就是 null"）。',
        ],
        tags: ['并发', 'Map', '高频'],
        difficulty: '困难',
      },
      {
        question: 'HashSet 底层是怎么实现的？',
        answer: [
          'HashSet 内部持有一个 HashMap，所有 add 的元素作为 HashMap 的 key，value 统一用一个固定的 PRESENT 对象（new Object()）。',
          '去重逻辑依赖 HashMap 的 key 唯一性，即依赖 hashCode() + equals()。',
          'LinkedHashSet 继承 HashSet，内部用 LinkedHashMap 实现，维护插入顺序。',
          'TreeSet 基于 TreeMap（红黑树），元素有序，需要实现 Comparable 或传入 Comparator。',
        ],
        tags: ['Set', 'HashMap'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 4. 多线程与并发 ==================== */
  {
    title: '多线程与并发',
    icon: '⚡',
    qas: [
      {
        question: '创建线程有几种方式？',
        answer: [
          '① 继承 Thread 类，重写 run()。简单但不能再继承其他类。',
          '② 实现 Runnable 接口，传入 Thread 构造器。推荐方式，解耦任务与线程。',
          '③ 实现 Callable 接口 + FutureTask。可以有返回值和异常。',
          '④ 线程池 ExecutorService.submit()。生产环境首选，避免频繁创建销毁线程。',
          '本质上线程创建只有一种方式：new Thread()，其他都是任务定义方式的不同。',
        ],
        tags: ['线程', '基础'],
        difficulty: '简单',
      },
      {
        question: '线程的生命周期有哪些状态？',
        answer: [
          'NEW：线程对象已创建，尚未调用 start()。',
          'RUNNABLE：调用 start() 后进入就绪状态，等待 CPU 调度（包含 Running）。',
          'BLOCKED：等待获取 synchronized 监视器锁。',
          'WAITING：调用 wait()、join()、LockSupport.park() 后进入无限期等待。',
          'TIMED_WAITING：调用 sleep(ms)、wait(ms)、join(ms) 后进入有限期等待。',
          'TERMINATED：run() 方法执行完毕或抛出未捕获异常。',
        ],
        tags: ['线程', '生命周期'],
        difficulty: '中等',
      },
      {
        question: 'synchronized 的原理是什么？锁升级过程？',
        answer: [
          'synchronized 基于 JVM 内置的 Monitor（监视器锁）机制。字节码层面：方法用 ACC_SYNCHRONIZED 标志，代码块用 monitorenter/monitorexit 指令。',
          'JDK6 引入锁升级优化：无锁 → 偏向锁 → 轻量级锁 → 重量级锁。',
          '偏向锁：只有一个线程访问时，在 Mark Word 中记录线程 ID，后续该线程进入无需 CAS。',
          '轻量级锁：有竞争但不激烈时，通过 CAS 自旋尝试获取锁，避免阻塞。',
          '重量级锁：自旋失败，膨胀为重量级锁，线程被挂起（依赖操作系统 Mutex），涉及用户态/内核态切换。',
          '锁只能升级不能降级（偏向锁可以被批量撤销）。JDK15 默认关闭偏向锁。',
        ],
        tags: ['锁', '高频'],
        difficulty: '困难',
      },
      {
        question: 'volatile 关键字的作用和原理？',
        answer: [
          '可见性：volatile 变量的写操作会立即刷新到主内存，读操作会从主内存重新加载，保证多线程间可见。',
          '有序性：通过内存屏障（Memory Barrier）禁止指令重排序。写操作前插入 StoreStore 屏障，写操作后插入 StoreLoad 屏障。',
          '不保证原子性：i++ 操作（读-改-写）不是原子的，volatile 无法保证线程安全，需要用 AtomicInteger 或加锁。',
          '典型应用：① 状态标志位（如 volatile boolean running）；② DCL 单例中防止指令重排序。',
        ],
        tags: ['并发', '内存模型'],
        difficulty: '中等',
      },
      {
        question: '线程池的核心参数有哪些？执行流程是什么？',
        answer: [
          '七大参数：corePoolSize（核心线程数）、maximumPoolSize（最大线程数）、keepAliveTime（非核心线程空闲存活时间）、unit（时间单位）、workQueue（任务队列）、threadFactory（线程工厂）、handler（拒绝策略）。',
          '执行流程：① 提交任务，若核心线程未满 → 创建核心线程执行；② 核心线程满 → 放入工作队列；③ 队列满 → 创建非核心线程（不超过 maximumPoolSize）；④ 线程数已达最大且队列满 → 执行拒绝策略。',
          '四种拒绝策略：AbortPolicy（默认，抛 RejectedExecutionException）、CallerRunsPolicy（调用者线程执行）、DiscardPolicy（静默丢弃）、DiscardOldestPolicy（丢弃队列最早任务）。',
          '阿里规约建议不使用 Executors 快捷方法创建线程池（FixedThreadPool/SingleThread 队列无界可能 OOM，CachedThreadPool 线程数无界可能创建过多线程），应使用 ThreadPoolExecutor 手动指定参数。',
        ],
        tags: ['线程池', '高频'],
        difficulty: '困难',
      },
      {
        question: 'ThreadLocal 的原理？为什么会内存泄漏？',
        answer: [
          '每个 Thread 内部维护一个 ThreadLocalMap（以 ThreadLocal 为 key，存储线程本地变量）。',
          'ThreadLocalMap 的 key 是 ThreadLocal 的弱引用，value 是强引用。',
          '内存泄漏原因：当 ThreadLocal 对象被回收后，key 变为 null，但 value 仍被 Entry 强引用，无法被 GC，尤其在线程池中线程长期存活时尤为严重。',
          '解决方案：使用完毕后必须调用 ThreadLocal.remove()。实际开发中建议用 try-finally 包裹。',
        ],
        tags: ['并发', '内存泄漏'],
        difficulty: '困难',
      },
    ],
  },

  /* ==================== 5. JVM 内存模型 ==================== */
  {
    title: 'JVM 内存模型',
    icon: '🧠',
    qas: [
      {
        question: 'JVM 运行时数据区有哪些？各自存储什么？',
        answer: [
          '线程私有区域：',
          '① 程序计数器（PC Register）：记录当前线程执行的字节码行号，唯一不会 OOM 的区域。',
          '② 虚拟机栈（VM Stack）：每个方法调用创建一个栈帧（局部变量表、操作数栈、动态链接、方法出口）。栈深度超限抛 StackOverflowError，无法扩展时抛 OOM。',
          '③ 本地方法栈：为 native 方法服务，HotSpot 中与虚拟机栈合并。',
          '线程共享区域：',
          '④ 堆（Heap）：存放对象实例和数组，GC 的主要区域。分为新生代（Eden + S0 + S1）和老年代。',
          '⑤ 方法区 / 元空间（Metaspace）：存储类元信息、常量、静态变量、JIT 编译后的代码。JDK8 后由元空间（本地内存）取代永久代。',
        ],
        tags: ['内存模型', '高频'],
        difficulty: '中等',
      },
      {
        question: '对象的创建过程是怎样的？',
        answer: [
          '① 类加载检查：检查 new 指令的参数能否在常量池中定位到类的符号引用，并确认该类已被加载。',
          '② 分配内存：根据堆是否规整选择"指针碰撞"（Serial/ParNew 等带压缩的收集器）或"空闲列表"（CMS 等）。线程安全通过 CAS + 失败重试或 TLAB（Thread Local Allocation Buffer）保证。',
          '③ 初始化零值：将分配的内存空间清零（保证字段不赋值就能使用默认值）。',
          '④ 设置对象头：包括 Mark Word（哈希码、GC 分代年龄、锁状态）、类型指针、数组长度（如果是数组）。',
          '⑤ 执行 <init>：调用构造方法，按程序员意愿初始化。',
        ],
        tags: ['对象', 'JVM'],
        difficulty: '困难',
      },
      {
        question: '什么是 Java 内存模型（JMM）？',
        answer: [
          'JMM（Java Memory Model）定义了多线程读写共享变量的规范，屏蔽了硬件和操作系统的内存访问差异。',
          '核心概念：每个线程有自己的工作内存（CPU 缓存抽象），共享变量存储在主内存中。线程对变量的操作必须在工作内存中进行，然后刷新回主内存。',
          '三大特性：① 原子性（synchronized、Lock）；② 可见性（volatile、synchronized、final）；③ 有序性（volatile 禁止重排、happens-before 规则）。',
          'happens-before 八大规则：程序顺序规则、锁规则、volatile 规则、线程启动规则、线程终止规则、中断规则、终结器规则、传递性。',
        ],
        tags: ['JMM', '并发'],
        difficulty: '困难',
      },
      {
        question: '类加载过程是怎样的？双亲委派模型是什么？',
        answer: [
          '类加载过程：加载（Loading）→ 验证（Verification）→ 准备（Preparation）→ 解析（Resolution）→ 初始化（Initialization）。',
          '加载：通过类全限定名获取字节流 → 转化为方法区的运行时数据结构 → 生成 Class 对象。',
          '准备：为静态变量分配内存并设默认值（int=0，引用=null）；final static 常量直接赋值。',
          '初始化：执行 <clinit> 方法（静态变量赋值 + static 块），JVM 保证线程安全。',
          '双亲委派模型：类加载器收到请求先委托父加载器，只有父加载器无法完成时才自己加载。Bootstrap → Extension → Application → 自定义。',
          '目的：防止核心类被篡改（安全），避免类重复加载（唯一性）。可以通过重写 loadClass() 打破双亲委派（如 Tomcat、SPI、OSGi）。',
        ],
        tags: ['类加载', '高频'],
        difficulty: '困难',
      },
    ],
  },

  /* ==================== 6. 垃圾回收 ==================== */
  {
    title: '垃圾回收（GC）',
    icon: '♻️',
    qas: [
      {
        question: '如何判断对象是否可被回收？',
        answer: [
          '引用计数法：每个对象维护引用计数，为 0 时可回收。缺点：无法解决循环引用（A 引用 B，B 引用 A）。Java 未采用。',
          '可达性分析法（Java 采用）：从 GC Roots 出发，沿引用链遍历，不可达的对象即为可回收。',
          'GC Roots 包括：① 虚拟机栈中的局部变量引用；② 方法区中的静态变量引用；③ 方法区中的常量引用；④ 本地方法栈中 JNI 引用；⑤ 被 synchronized 持有的对象。',
          '不可达的对象不会立即回收，会先标记，若重写了 finalize() 且未执行过，会被放入 F-Queue 给最后一次"自救"机会。',
        ],
        tags: ['GC', '高频'],
        difficulty: '中等',
      },
      {
        question: 'Java 中的四种引用类型是什么？',
        answer: [
          '强引用（Strong）：最常见的引用类型（Object o = new Object()），只要强引用在，GC 绝不会回收。',
          '软引用（Soft）：SoftReference 包装，内存不足时才会被回收。适合做缓存。',
          '弱引用（Weak）：WeakReference 包装，下次 GC 就会回收。ThreadLocalMap 的 Entry.key 就是弱引用。',
          '虚引用（Phantom）：PhantomReference 包装，无法通过虚引用获取对象，唯一用途是在对象被回收时收到系统通知。必须配合 ReferenceQueue 使用。',
        ],
        tags: ['引用', 'GC'],
        difficulty: '中等',
      },
      {
        question: '常见的垃圾回收算法有哪些？',
        answer: [
          '标记-清除（Mark-Sweep）：先标记所有需要回收的对象，再统一清除。缺点：产生内存碎片，分配大对象时可能提前触发 GC。',
          '复制算法（Copying）：将内存分为两块，每次只用一块，GC 时将存活对象复制到另一块。新生代 Eden:S0:S1 = 8:1:1 就是基于此。缺点：可用内存减半。',
          '标记-整理（Mark-Compact）：标记存活对象后，将它们向一端移动，清理边界外内存。适合老年代，无碎片但移动对象开销大。',
          '分代收集：新生代用复制算法（对象朝生夕死，存活率低），老年代用标记-清除或标记-整理。',
        ],
        tags: ['GC 算法'],
        difficulty: '中等',
      },
      {
        question: '常见的垃圾回收器有哪些？G1 和 CMS 有何区别？',
        answer: [
          'Serial / Serial Old：单线程，简单高效，适合客户端小型应用。',
          'ParNew：Serial 的多线程版本，常与 CMS 搭配。',
          'Parallel Scavenge / Parallel Old：吞吐量优先（吞吐量 = 用户代码时间 / 总时间），适合后台计算任务。',
          'CMS（Concurrent Mark Sweep）：以最短停顿时间为目标。四个阶段：初始标记（STW）→ 并发标记 → 重新标记（STW）→ 并发清除。缺点：产生碎片、浮动垃圾、CPU 敏感。',
          'G1（Garbage First）：JDK9 默认。将堆划分为等大的 Region，逻辑上仍有新生代/老年代。可预测停顿时间（-XX:MaxGCPauseMillis），优先回收价值最大的 Region。',
          'ZGC / Shenandoah：JDK11+/JDK12+ 引入的低延迟收集器，停顿时间控制在 10ms 以内甚至亚毫秒级。',
        ],
        tags: ['GC 回收器', '高频'],
        difficulty: '困难',
      },
    ],
  },

  /* ==================== 7. 异常处理与 IO ==================== */
  {
    title: '异常处理与 IO',
    icon: '🔧',
    qas: [
      {
        question: 'Java 异常体系是什么样的？',
        answer: [
          '顶层父类：Throwable → 分为 Error 和 Exception。',
          'Error：JVM 无法处理的严重错误，如 OutOfMemoryError、StackOverflowError，程序不应捕获。',
          'Exception 分两类：',
          '① 受检异常（Checked）：编译期强制处理，如 IOException、SQLException。必须 try-catch 或 throws 声明。',
          '② 非受检异常（Unchecked / RuntimeException）：运行期异常，如 NullPointerException、IndexOutOfBoundsException、ClassCastException。可以不捕获。',
          '最佳实践：不要用异常控制流程；优先捕获具体异常而非 Exception；finally 中不要使用 return。',
        ],
        tags: ['异常'],
        difficulty: '简单',
      },
      {
        question: 'try-with-resources 是什么？',
        answer: [
          'JDK7 引入的语法糖，用于自动关闭实现了 AutoCloseable 接口的资源。',
          '语法：try (InputStream is = new FileInputStream("file")) { ... }，无需手动在 finally 中关闭。',
          '多个资源用分号隔开，关闭顺序是声明的逆序。',
          '如果 try 块和 close() 同时抛出异常，close() 的异常会被"抑制"（Suppressed），可通过 getSuppressed() 获取。',
          'JDK9 改进：如果资源是 effectively final 的，可以在 try 外声明，try 中直接引用。',
        ],
        tags: ['异常', 'IO'],
        difficulty: '中等',
      },
      {
        question: 'BIO、NIO、AIO 的区别？',
        answer: [
          'BIO（Blocking IO）：同步阻塞，一个连接一个线程。read/write 阻塞等待数据。适合连接数少且固定的场景。',
          'NIO（Non-blocking IO / New IO）：同步非阻塞，基于 Channel + Buffer + Selector。一个线程可以管理多个连接（多路复用）。适合连接数多但数据量小的场景（如聊天服务器）。',
          'AIO（Async IO / NIO.2）：异步非阻塞，基于回调/Future，OS 完成 IO 后通知应用。适合连接数多且数据量大的场景。',
          '实际应用中 NIO 使用最广泛（Netty 就是基于 NIO），AIO 在 Linux 上实现（epoll 模拟）不够成熟，应用较少。',
        ],
        tags: ['IO', 'Netty'],
        difficulty: '中等',
      },
    ],
  },

  /* ==================== 8. 反射、泛型与设计模式 ==================== */
  {
    title: '反射、泛型与设计模式',
    icon: '🔍',
    qas: [
      {
        question: '什么是反射？有什么应用场景？',
        answer: [
          '反射是在运行时获取类的信息（构造方法、字段、方法）并动态调用的能力。核心类：Class、Method、Field、Constructor。',
          '获取 Class 对象的三种方式：① Class.forName("全限定名")；② 类名.class；③ 对象.getClass()。',
          '应用场景：Spring IOC（通过反射创建 Bean）、MyBatis（动态代理 Mapper）、JUnit（反射调用测试方法）、Jackson/Gson（反射读写字段序列化）。',
          '缺点：性能开销（比直接调用慢）、破坏封装性（可访问 private）、安全风险。JDK9+ 模块化后反射访问受到更严格限制。',
        ],
        tags: ['反射', 'Spring'],
        difficulty: '中等',
      },
      {
        question: '泛型擦除是什么？有什么影响？',
        answer: [
          'Java 泛型是编译期检查，运行时会被"擦除"为原始类型（Raw Type）。例如 List<String> 和 List<Integer> 在运行时都是 List。',
          '影响：① 无法用 instanceof 判断泛型类型；② 不能 new T()（类型未知）；③ 不能创建泛型数组 new T[]。',
          '通过 TypeToken / ParameterizedType 可在运行时获取泛型信息（利用匿名子类保留了父类泛型签名）。',
          'PECS 原则：Producer Extends, Consumer Super。读取用 ? extends T，写入用 ? super T。',
        ],
        tags: ['泛型'],
        difficulty: '中等',
      },
      {
        question: '单例模式有几种写法？各有什么优缺点？',
        answer: [
          '① 饿汉式：类加载时创建实例（static final），线程安全，简单直接，但不支持延迟加载。',
          '② 懒汉式（synchronized）：首次调用时创建，线程安全，但每次 getInstance 都加锁，性能差。',
          '③ 双重检查锁（DCL）：两次 null 判断 + synchronized + volatile。兼顾延迟加载与性能。volatile 防止指令重排导致获取到未初始化的对象。',
          '④ 静态内部类：利用类加载机制保证线程安全，支持延迟加载，推荐写法。',
          '⑤ 枚举：Effective Java 推荐方式，天然线程安全、防止反射和反序列化破坏单例。',
          '防御手段：私有构造方法中判断实例是否已存在（防反射）；实现 readResolve() 方法（防反序列化）。',
        ],
        tags: ['设计模式', '高频'],
        difficulty: '中等',
      },
      {
        question: '代理模式：静态代理与动态代理的区别？',
        answer: [
          '静态代理：代理类在编译期确定，手动编写代理类实现与目标相同的接口。缺点：每个接口都要写一个代理类，维护成本高。',
          'JDK 动态代理：基于接口，运行时通过 Proxy.newProxyInstance() + InvocationHandler 动态生成代理类。目标类必须实现接口。',
          'CGLIB 动态代理：基于继承，通过 ASM 字节码框架在运行时生成目标类的子类。无需接口，但不能代理 final 类/方法。',
          'Spring AOP 默认策略：目标实现了接口 → JDK 动态代理；否则 → CGLIB。Spring Boot 2.x 默认统一使用 CGLIB。',
        ],
        tags: ['代理', 'Spring AOP'],
        difficulty: '中等',
      },
    ],
  },
];

const JavaBasicsPage: React.FC = () => {
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
  }, [keyword]);

  const totalCount = sections.reduce((sum, s) => sum + s.qas.length, 0);

  return (
    <Card>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Java 基础核心八股文
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 12 }}>
            共 {sections.length} 大章节、{totalCount} 道高频面试题 —— 覆盖语言基础、String、集合、并发、JVM、GC、IO、反射与设计模式。
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

export default JavaBasicsPage;
