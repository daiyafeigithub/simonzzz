---
title: 多线程面试题
date: 2025年4月7日15:20:48
tags:
  - Java
  - 多线程
  - 线程池
categories:
  - 面试
  - JAVA
---
---

### **一、基础知识**
1. **什么是线程？线程和进程的区别是什么？**  
   - **线程**是程序执行流的最小单位，一个进程可以包含多个线程。  
   - **区别**：  
     - 进程是资源分配的基本单位，线程是 CPU 调度的基本单位。  
     - 线程共享进程的内存空间，而进程有独立的内存空间。  
     - 线程间通信更容易，进程间通信需要 IPC（如管道、消息队列等）。

2. **Java 中如何创建线程？有几种方式？分别有什么优缺点？**  
   - **方式**：  
     1. 继承 `Thread` 类并重写 `run()` 方法。  
        ```java
        Thread t = new Thread(() -> System.out.println("Thread running"));
        t.start();
        ```
        **优点**：简单直接；**缺点**：由于 Java 不支持多继承，限制了类的扩展性。  
     2. 实现 `Runnable` 接口。  
        ```java
        Runnable task = () -> System.out.println("Runnable task");
        new Thread(task).start();
        ```
        **优点**：更灵活，支持多继承；**缺点**：无返回值和异常处理能力。  
     3. 使用 `Callable` 和 `Future`。  
        ```java
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<Integer> result = executor.submit(() -> 42);
        System.out.println(result.get());
        executor.shutdown();
        ```
        **优点**：支持返回值和异常处理；**缺点**：依赖线程池。

3. **`start()` 方法和 `run()` 方法的区别是什么？**  
   - `start()` 启动新线程并调用 `run()` 方法，而直接调用 `run()` 只是在当前线程中执行方法，不会启动新线程。

4. **线程的生命周期有哪些状态？请详细描述每个状态及其转换条件。**  
   - **状态**：  
     1. **New**：线程被创建但尚未启动。  
     2. **Runnable**：线程已启动，正在等待 CPU 时间片。  
     3. **Blocked/Waiting**：线程因等待锁或资源而阻塞。  
     4. **Timed Waiting**：线程处于等待状态，但设置了超时时间。  
     5. **Terminated**：线程执行完毕或被终止。

5. **什么是守护线程（Daemon Thread）？如何设置守护线程？**  
   - 守护线程是为其他线程提供服务的线程，当所有用户线程结束时，守护线程自动终止。  
   - 设置方法：`thread.setDaemon(true);`

6. **如何获取当前线程的引用？如何获取主线程的引用？**  
   - 获取当前线程：`Thread.currentThread();`  
   - 获取主线程：通过 `Thread.currentThread()` 在主线程中调用即可。

---

### **二、线程同步与并发控制**
7. **什么是线程安全？什么情况下会出现线程安全问题？**  
   - 线程安全是指多个线程访问共享资源时，程序能正确运行而不出现数据不一致的情况。  
   - 常见问题：竞态条件、死锁、活锁、饥饿。

8. **Java 中有哪些实现线程同步的方式？**  
   - `synchronized` 关键字：修饰方法或代码块，保证同一时刻只有一个线程访问。  
   - `ReentrantLock`：显式锁，支持公平锁、可中断锁等高级功能。  
   - `ReadWriteLock`：允许多个读线程同时访问，但写线程独占。

9. **`synchronized` 的锁机制是如何工作的？它有哪些使用场景？**  
   - 工作原理：基于对象头的 Monitor 锁机制，确保同一时刻只有一个线程持有锁。  
   - 场景：保护共享资源的访问，如计数器、缓存。

10. **`synchronized` 和 `ReentrantLock` 的区别是什么？在什么情况下选择使用它们？**  
    - 区别：  
      - `synchronized` 是隐式锁，语法简单；`ReentrantLock` 是显式锁，功能强大。  
      - `ReentrantLock` 支持公平锁、可中断锁、尝试锁等特性。  
    - 选择：优先使用 `synchronized`，除非需要 `ReentrantLock` 的高级功能。

11. **什么是死锁？如何避免死锁？**  
    - 死锁：多个线程互相等待对方释放资源，导致无法继续执行。  
    - 避免方法：  
      1. 按固定顺序获取锁。  
      2. 使用超时机制（如 `tryLock`）。  
      3. 避免嵌套锁。

12. **什么是线程间的通信？如何实现线程间的通信？**  
    - 线程间通信：通过共享变量或消息传递协调线程行为。  
    - 实现方式：  
      - `wait()`、`notify()` 和 `notifyAll()`。  
      - `Condition` 接口。

13. **什么是活锁和饥饿？它们与死锁有什么区别？**  
    - 活锁：线程不断尝试操作，但始终失败。  
    - 饥饿：某些线程长期得不到资源。  
    - 区别：死锁是线程互相等待，活锁是线程不断尝试，饥饿是资源分配不均。

---

### **三、高级并发工具**
14. **Java 并发包（`java.util.concurrent`）提供了哪些核心工具类？**  
    - 线程池：`ExecutorService`、`ThreadPoolExecutor`。  
    - 同步工具：`CountDownLatch`、`CyclicBarrier`、`Semaphore`。  
    - 并发集合：`ConcurrentHashMap`、`CopyOnWriteArrayList`。

15. **如何使用线程池？线程池有哪些核心参数？如何配置一个合适的线程池？**  
    - 核心参数：  
      - 核心线程数（`corePoolSize`）  
      - 最大线程数（`maximumPoolSize`）  
      - 队列容量（`workQueue`）  
      - 空闲线程存活时间（`keepAliveTime`）  
    - 配置：根据任务类型（CPU 密集型、IO 密集型）调整线程数。

16. **`Future` 和 `CompletableFuture` 的区别是什么？如何使用它们处理异步任务？**  
    - `Future`：只支持简单的异步结果获取。  
    - `CompletableFuture`：支持链式调用和组合操作。  
    - 示例：  
      ```java
      CompletableFuture.supplyAsync(() -> "Hello")
                       .thenApply(s -> s + " World")
                       .thenAccept(System.out::println);
      ```

17. **什么是 Fork/Join 框架？它的适用场景是什么？**  
    - 适用场景：递归分治问题，如排序、搜索。

18. **`Atomic` 类的作用是什么？常见的 `Atomic` 类有哪些？**  
    - 提供原子操作，避免锁开销。  
    - 常见类：`AtomicInteger`、`AtomicLong`、`AtomicReference`。

19. **`ConcurrentHashMap` 和普通 `HashMap` 的区别是什么？它是如何实现线程安全的？**  
    - 区别：`ConcurrentHashMap` 支持并发访问，而 `HashMap` 不支持。  
    - 实现：分段锁（Segment Lock）或 CAS 操作。

20. **`CopyOnWriteArrayList` 是什么？它的适用场景和缺点是什么？**  
    - 场景：读多写少的场景。  
    - 缺点：写操作代价高，占用更多内存。

---

### **四、并发编程中的常见问题**
21. **什么是可见性、原子性和有序性？如何保证它们？**  
    - **可见性**：通过 `volatile` 或锁保证。  
    - **原子性**：通过 `synchronized` 或 `Atomic` 类保证。  
    - **有序性**：通过 `volatile` 或 `happens-before` 规则保证。

22. **`volatile` 关键字的作用是什么？它能解决哪些问题？**  
    - 作用：保证变量的可见性和禁止指令重排序。  
    - 解决问题：避免多线程环境下变量不可见或重排序导致的问题。

23. **双重检查锁定（Double-Checked Locking）是什么？为什么需要使用 `volatile` 修饰单例对象？**  
    - 防止指令重排序导致的半初始化问题。

24. **什么是伪共享（False Sharing）？如何避免伪共享？**  
    - 避免方法：通过填充字节（Padding）让变量分布在不同缓存行。

25. **如何优雅地停止一个线程？有哪些方法可以实现？**  
    - 方法：  
      1. 使用标志位。  
      2. 使用 `interrupt()` 方法。

26. **线程中断的三种方式是什么？如何正确处理中断？**  
    - 方式：  
      1. 调用 `interrupt()`。  
      2. 检查 `isInterrupted()`。  
      3. 捕获 `InterruptedException`。

---

### **五、实际应用场景**
27. **如何设计一个生产者-消费者模型？有哪些实现方式？**  
    - 实现：使用 `BlockingQueue` 或 `synchronized` + `wait/notify`。

28. **如何实现一个线程安全的单例模式？有哪些方法？**  
    - 方法：  
      1. 饿汉式。  
      2. 懒汉式 + `synchronized`。  
      3. 双重检查锁定 + `volatile`。  
      4. 静态内部类。  
      5. 枚举。

---

（剩余问题的答案略，可以根据需要继续补充。）