---
title: 2025年4月10日12:45:26 答案
---
以下是针对艾梦秋简历和面试题的参考答案框架，结合其技术栈和项目经验设计：

---

### **一、技术基础考察**
1. **Java核心**  
   - **ConcurrentHashMap线程安全原理**：  
     JDK7通过分段锁（Segment）实现，JDK8改用CAS+synchronized优化，仅锁链表头节点。Hashtable则对整个哈希表加锁，ConcurrentHashMap并发度更高。  
   - **Stream分组统计示例**：  
     ```java
     Map<String, Long> userCountByCity = userList.stream()
         .collect(Collectors.groupingBy(User::getCity, Collectors.counting()));
     ```

2. **JVM与优化**  
   - **内存分代与GC触发**：  
     堆分为新生代（Eden/S0/S1）和老年代。Minor GC触发条件：Eden区满；Full GC触发条件：老年代满、System.gc()调用或Metaspace空间不足。  
   - **内存泄漏定位**：  
     使用MAT分析堆转储（Heap Dump），通过支配树（Dominator Tree）查看大对象引用链，如缓存未清理导致的泄漏。

3. **数据库与优化**  
   - **最左匹配原则**：  
     索引`(a,b,c)`可命中`WHERE a=1 AND b=2`，但无法命中`WHERE b=2`。  
   - **分库分表跨库查询**：  
     在福建移动项目中，通过ShardingSphere的**绑定表策略**关联主表与子表分片，避免跨库JOIN。

---

### **二、框架与中间件**
1. **Spring生态**  
   - **自动配置原理**：  
     `@EnableAutoConfiguration`通过`META-INF/spring.factories`加载配置类，条件注解（`@ConditionalOnClass`等）按需生效。  
   - **Sentinel熔断策略**：  
     配置异常比例阈值（如异常/总请求 >50%），结合滑动窗口统计，在`FlowRule`中设置`grade=RuleConstant.FLOW_GRADE_EXCEPTION_RATIO`。

2. **分布式与微服务**  
   - **Seata AT模式两阶段提交**：  
     1. **准备阶段**：拦截SQL生成undo log，分支事务注册到TC。  
     2. **提交/回滚**：全局事务协调器（TC）通知分支事务提交或根据undo log回滚。  
   - **RabbitMQ可靠性投递**：  
     生产端开启确认机制（ConfirmCallback），消费端手动ACK+死信队列兜底。重复消费通过数据库唯一索引或Redis幂等表解决。

---

### **三、场景题参考答案**
#### **场景1：分布式事务冲突**  
1. **Seata AT模式解决方案**：  
   - 在资源状态更新前，Seata通过全局锁（SELECT FOR UPDATE）防止并发修改。  
   - 分支事务执行SQL时生成undo log，TC协调全局提交或回滚。  
2. **消息补偿机制**：  
   - 在RabbitMQ中设置死信队列，对消费失败的消息重试3次，最终通过Job服务补偿事务。

#### **场景2：突发流量保护**  
1. **Redis分布式锁重建热点Key**：  
   ```lua
   -- Lua脚本实现原子操作
   if redis.call("exists", KEYS[1]) == 0 then
     redis.call("set", KEYS[1], ARGV[1])
     return 1
   else
     return 0
   end
   ```
2. **Sentinel熔断策略**：  
   配置降级规则，当响应时间>500ms且错误率>50%时触发熔断，返回缓存兜底数据。

---

### **四、项目深度追问**
1. **福建移动项目拓扑算法**：  
   - 采用邻接表存储光缆连接关系，DFS/BFS遍历计算级联影响范围，结合Redis缓存预计算结果。  
2. **分库分表迁移方案**：  
   - 通过Canal监听MySQL Binlog，将旧数据异步同步到新分片，双写期间通过影子表标记数据版本。

---

### **五、综合能力**
1. **设计模式应用**：  
   - 工厂模式示例：Spring中`BeanFactory`通过反射创建Bean实例，实现对象创建与使用的解耦。  
2. **技术方案分歧处理**：  
   - 通过压测数据对比（如JMH基准测试）证明方案优劣，或提出折中方案（如异步化改造）。

---

### **关键点呼应简历**
- **性能优化**：在福建移动项目中，通过Redis缓存GIS坐标数据，响应时间从800ms降至150ms。  
- **分布式事务**：结合Seata和消息队列，事务成功率提升至99.98%。  
- **分库分表**：ShardingSphere按月分片+ES多条件查询，支撑亿级数据量。

---

以上答案需根据候选人实际回答动态调整追问深度，重点验证其技术方案的落地性与业务理解。