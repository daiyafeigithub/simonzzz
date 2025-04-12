---
title: Java 并发工具：CountDownLatch 与 CyclicBarrier 详解
date: 2025年1月8日14:10:11
tags:
  - 多线程
  - 教程
  - cycleBarrier
  - countDownLatch
categories:
  - 技术
---

---

# **Java 并发工具：CountDownLatch 与 CyclicBarrier 详解**

在多线程编程中，协调多个线程的执行顺序是一个常见的需求。`CountDownLatch` 和 `CyclicBarrier` 是 Java 并发包 `java.util.concurrent` 提供的两个同步工具类，它们可以帮助我们轻松实现线程间的协作。本文将通过实际例子详细讲解两者的原理、区别以及适用场景。

---

## **一、CountDownLatch 讲解**

### **1. CountDownLatch 的核心概念**
`CountDownLatch` 是一个同步工具类，允许一个或多个线程等待其他线程完成一系列操作后继续执行。它的核心是基于一个计数器：
- 初始值为指定的计数值（`count`）。
- 每次调用 `countDown()` 方法时，计数器减 1。
- 当计数器减到 0 时，所有等待的线程会被唤醒并继续执行。

**特点**：
- 计数器不可重置，只能使用一次。
- 主要用于“一个线程等待多个线程完成任务”的场景。

---

### **2. CountDownLatch 的典型应用场景**
假设我们有一个物流系统，主线程需要等待三个仓库分别完成货物准备后才能启动运输任务。这种场景非常适合使用 `CountDownLatch`。

---

### **3. 示例代码**
以下是一个完整的 `CountDownLatch` 使用示例：

```java
import java.util.concurrent.CountDownLatch;

public class LogisticsSystemWithCountDownLatch {

    public static void main(String[] args) {
        // 创建一个 CountDownLatch，初始计数为 3（代表 3 个仓库）
        CountDownLatch latch = new CountDownLatch(3);

        // 启动 3 个仓库线程
        for (int i = 1; i <= 3; i++) {
            new Thread(new WarehouseTask(i, latch)).start();
        }

        try {
            // 主线程等待所有仓库完成任务
            latch.await();
            System.out.println("所有仓库货物已准备完毕，开始运输！");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("主线程被中断: " + e.getMessage());
        }
    }

    // 仓库任务类
    static class WarehouseTask implements Runnable {
        private final int warehouseId;
        private final CountDownLatch latch;

        public WarehouseTask(int warehouseId, CountDownLatch latch) {
            this.warehouseId = warehouseId;
            this.latch = latch;
        }

        @Override
        public void run() {
            try {
                System.out.println("仓库 " + warehouseId + " 正在准备货物...");
                Thread.sleep((long) (Math.random() * 2000)); // 模拟准备时间
                System.out.println("仓库 " + warehouseId + " 已完成货物准备！");
                latch.countDown(); // 完成任务，计数器减 1
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("仓库 " + warehouseId + " 发生异常: " + e.getMessage());
            }
        }
    }
}
```

---

### **4. 输出示例**
运行上述代码后，可能得到如下输出（随机时间导致每次结果略有不同）：

```
仓库 1 正在准备货物...
仓库 2 正在准备货物...
仓库 3 正在准备货物...
仓库 3 已完成货物准备！
仓库 1 已完成货物准备！
仓库 2 已完成货物准备！
所有仓库货物已准备完毕，开始运输！
```

---

### **5. 核心方法**
- **`await()`**：让当前线程等待，直到计数器减到 0。
- **`countDown()`**：将计数器减 1。
- **不可重置**：一旦计数器减到 0，无法再次使用。

---

## **二、CyclicBarrier 讲解**

### **1. CyclicBarrier 的核心概念**
`CyclicBarrier` 是一个同步工具类，允许多个线程相互等待，直到所有线程都到达某个屏障点后再继续执行。它的核心是基于一个计数器：
- 初始值为参与线程的数量（`parties`）。
- 每次调用 `await()` 方法时，计数器减 1。
- 当计数器减到 0 时，所有等待的线程会被唤醒并继续执行。

**特点**：
- 计数器可以重置，支持多次同步。
- 可以设置屏障动作（Runnable），当所有线程到达屏障点时执行特定逻辑。

---

### **2. CyclicBarrier 的典型应用场景**
假设我们有一个物流系统，多个仓库需要同时完成货物装车后才能统一发车。这种场景非常适合使用 `CyclicBarrier`。

---

### **3. 示例代码**
以下是一个完整的 `CyclicBarrier` 使用示例：

```java
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class LogisticsSystemWithCyclicBarrier {

    // 定义仓库数量
    private static final int WAREHOUSE_COUNT = 3;

    public static void main(String[] args) {
        // 创建一个 CyclicBarrier，指定参与线程数，并设置屏障动作
        CyclicBarrier cyclicBarrier = new CyclicBarrier(WAREHOUSE_COUNT, () -> {
            System.out.println("所有仓库货物已装车，开始统一发车！");
        });

        // 启动每个仓库的线程
        for (int i = 1; i <= WAREHOUSE_COUNT; i++) {
            new Thread(new WarehouseTask(i, cyclicBarrier)).start();
        }
    }

    // 仓库任务类
    static class WarehouseTask implements Runnable {
        private final int warehouseId;
        private final CyclicBarrier cyclicBarrier;

        public WarehouseTask(int warehouseId, CyclicBarrier cyclicBarrier) {
            this.warehouseId = warehouseId;
            this.cyclicBarrier = cyclicBarrier;
        }

        @Override
        public void run() {
            try {
                // 1. 准备货物
                System.out.println("仓库 " + warehouseId + " 正在准备货物...");
                Thread.sleep((long) (Math.random() * 2000)); // 模拟准备时间

                // 2. 装车
                System.out.println("仓库 " + warehouseId + " 正在装车...");
                Thread.sleep((long) (Math.random() * 2000)); // 模拟装车时间

                // 到达屏障点，等待其他仓库
                System.out.println("仓库 " + warehouseId + " 已完成装车，等待其他仓库...");
                cyclicBarrier.await();

                // 3. 发车（屏障动作完成后，所有线程继续执行）
                System.out.println("仓库 " + warehouseId + " 的货物已发车！");
            } catch (InterruptedException | BrokenBarrierException e) {
                Thread.currentThread().interrupt();
                System.out.println("仓库 " + warehouseId + " 发生异常: " + e.getMessage());
            }
        }
    }
}
```

---

### **4. 输出示例**
运行上述代码后，可能得到如下输出：

```
仓库 1 正在准备货物...
仓库 2 正在准备货物...
仓库 3 正在准备货物...
仓库 1 正在装车...
仓库 3 正在装车...
仓库 2 正在装车...
仓库 1 已完成装车，等待其他仓库...
仓库 2 已完成装车，等待其他仓库...
仓库 3 已完成装车，等待其他仓库...
所有仓库货物已装车，开始统一发车！
仓库 1 的货物已发车！
仓库 2 的货物已发车！
仓库 3 的货物已发车！
```

---

### **5. 核心方法**
- **`await()`**：让当前线程等待，直到所有线程都到达屏障点。
- **屏障动作**：可以在构造函数中传入一个 `Runnable`，当所有线程到达屏障点时执行。
- **可重置**：计数器可以重新设置，支持多次同步。

---

## **三、CountDownLatch 与 CyclicBarrier 的对比**

| 特性                     | CountDownLatch                                      | CyclicBarrier                                        |
|--------------------------|----------------------------------------------------|------------------------------------------------------|
| **计数器重置**           | 不可重置，只能使用一次                             | 可以重置，支持多次同步                               |
| **线程角色**             | 一个或多个线程等待其他线程完成任务                 | 多个线程相互等待，直到所有线程都到达屏障点          |
| **屏障动作**             | 不支持                                            | 支持在所有线程到达屏障点后执行一个屏障动作          |
| **典型应用场景**         | 等待某些任务完成后才能继续执行                     | 需要多个线程协同完成任务后再继续执行                |
| **实现方式**             | 基于 AQS（AbstractQueuedSynchronizer）实现         | 基于 `ReentrantLock` 和 `Condition` 实现            |

---

## **四、总结**

- **CountDownLatch** 更适合“一个线程等待多个线程完成任务”的场景，例如主线程等待子线程完成初始化、任务分配等。
- **CyclicBarrier** 更适合“多个线程相互等待，直到所有线程都完成任务后再继续执行”的场景，例如多仓库协同工作、批量数据处理等。

通过本文的讲解和示例代码，相信你已经掌握了 `CountDownLatch` 和 `CyclicBarrier` 的使用方法及其适用场景。希望这些内容能帮助你在并发编程中更加得心应手！

--- 
