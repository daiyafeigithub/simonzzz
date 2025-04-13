---
title: 编程题：多线程任务处理
---
---

### **题目 1: 批量任务处理系统**

#### **背景描述**
某电商平台需要定期生成一份销售报告。生成报告的过程分为以下几个步骤：
1. 系统会从数据库中提取一批订单数据（假设共有 5 笔订单）。
2. 每笔订单需要单独计算其销售额和利润（这些计算过程可以并行进行，每笔订单的计算时间随机，范围为 1~3 秒）。
3. 只有当所有订单的计算完成后，系统才能汇总结果并生成最终的销售报告。

#### **具体要求**
1. 设计一个程序模拟上述流程，确保所有订单的计算任务都能正确完成。
2. 在所有订单计算完成后，系统应打印一条消息，例如 `"Sales report generated successfully!"`。
3. 确保程序能够高效运行，避免资源浪费或任务遗漏。

#### **提示**
- 考虑如何让主程序知道所有订单的计算任务已经完成。
- 需要注意并发环境下的数据一致性问题。

#### **示例输出**
```
Processing order 1...
Processing order 2...
Processing order 3...
Processing order 4...
Processing order 5...
Order 1 processed.
Order 3 processed.
Order 2 processed.
Order 5 processed.
Order 4 processed.
Sales report generated successfully!
```

---

### **题目 2: 多阶段科研实验模拟**

#### **背景描述**
某科研团队正在进行一项多阶段的实验研究。实验分为三个阶段，每个阶段都需要多名研究人员协作完成。具体规则如下：
1. 每个研究人员需要依次完成三个阶段的任务（每个阶段的任务耗时随机，范围为 1~2 秒）。
2. 在每个阶段结束时，所有研究人员必须等待其他成员完成当前阶段的任务后，才能进入下一个阶段。
3. 实验结束后，每个研究人员需要提交自己的实验结果。

#### **具体要求**
1. 假设有 4 名研究人员参与实验。
2. 模拟整个实验过程，确保所有研究人员按照规则完成任务。
3. 在每个阶段结束时，打印一条消息，例如 `"Phase X completed by all researchers"`。
4. 实验结束后，每位研究人员打印一条消息，例如 `"Researcher-X has submitted the results"`。

#### **提示**
- 考虑如何确保研究人员在每个阶段都能同步协作。
- 注意避免某些研究人员提前进入下一阶段的情况。

#### **示例输出**
```
Researcher 1 is working on Phase 1...
Researcher 2 is working on Phase 1...
Researcher 3 is working on Phase 1...
Researcher 4 is working on Phase 1...
Phase 1 completed by all researchers
Researcher 1 is working on Phase 2...
Researcher 2 is working on Phase 2...
Researcher 3 is working on Phase 2...
Researcher 4 is working on Phase 2...
Phase 2 completed by all researchers
Researcher 1 is working on Phase 3...
Researcher 2 is working on Phase 3...
Researcher 3 is working on Phase 3...
Researcher 4 is working on Phase 3...
Phase 3 completed by all researchers
Researcher 1 has submitted the results
Researcher 2 has submitted the results
Researcher 3 has submitted the results
Researcher 4 has submitted the results
```

---

### **总结**
这两个题目分别模拟了批量任务处理和多阶段协作的实际业务场景，用户可以根据需求自行选择合适的同步机制（如 `CountDownLatch` 或 `CyclicBarrier`）。这种设计方式更贴近实际项目开发中的需求分析与解决方案设计流程，有助于培养用户解决实际问题的能力。