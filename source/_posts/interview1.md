---
title: 面试官问：请问在你的项目中如何使用的线程池
date: 2025年4月7日15:02:55
tags:
  - Java
  - 多线程
  - 线程池
categories:
  - 面试
  - JAVA
---

### 业务场景：金融交易处理系统

#### 场景描述
假设我们正在开发一个金融交易处理系统，系统需要处理大量的交易请求，例如股票交易、转账、支付等。每个交易请求需要执行一些短生命周期的任务，例如验证交易信息、计算交易金额、更新账户余额、通知用户等。由于交易请求的数量较大且每个任务的执行时间较短，使用 `CachedThreadPool` 可以有效地管理和复用线程，减少线程创建和销毁的开销，提高系统的性能和响应速度。

此外，为了确保每个交易请求的线程安全性和数据隔离性，我们将使用 `ThreadLocal` 来存储每个线程的上下文信息。为了同步多个任务的完成，我们将使用 `CountDownLatch` 来等待所有任务完成。

#### 代码实现

```java
package basic.multipleThread;

import java.util.concurrent.*;

public class FinancialTransactionSystem {
    private ExecutorService cachedThreadPool;
    private CountDownLatch latch;

    public FinancialTransactionSystem(int numberOfTasks) {
        // 创建一个可缓存的线程池
        this.cachedThreadPool = Executors.newCachedThreadPool();
        // 初始化 CountDownLatch
        this.latch = new CountDownLatch(numberOfTasks);
    }

    public void processTransaction(Transaction transaction) {
        // 提交交易验证任务
        cachedThreadPool.submit(new TransactionValidator(transaction, latch));

        // 提交交易计算金额任务
        cachedThreadPool.submit(new TransactionCalculator(transaction, latch));

        // 提交交易更新账户余额任务
        cachedThreadPool.submit(new TransactionUpdater(transaction, latch));

        // 提交交易通知用户任务
        cachedThreadPool.submit(new TransactionNotifier(transaction, latch));
    }

    public void shutdown() {
        try {
            // 等待所有任务完成
            latch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Main thread was interrupted: " + e.getMessage());
        } finally {
            // 关闭线程池
            cachedThreadPool.shutdown();
        }
    }

    public static void main(String[] args) {
        int numberOfTasks = 40; // 每个交易有4个任务
        FinancialTransactionSystem transactionSystem = new FinancialTransactionSystem(numberOfTasks);

        // 模拟处理多个交易
        for (int i = 1; i <= 10; i++) {
            Transaction transaction = new Transaction(i);
            transactionSystem.processTransaction(transaction);
        }

        // 关闭线程池
        transactionSystem.shutdown();
    }
}

// 交易类
class Transaction {
    private int transactionId;

    public Transaction(int transactionId) {
        this.transactionId = transactionId;
    }

    public int getTransactionId() {
        return transactionId;
    }
}

// 使用 ThreadLocal 存储每个线程的上下文信息
class TransactionContext {
    private static final ThreadLocal<String> transactionId = new ThreadLocal<>();

    public static void setTransactionId(String id) {
        transactionId.set(id);
    }

    public static String getTransactionId() {
        return transactionId.get();
    }

    public static void clearTransactionId() {
        transactionId.remove();
    }
}

// 交易验证任务
class TransactionValidator implements Runnable {
    private Transaction transaction;
    private CountDownLatch latch;

    public TransactionValidator(Transaction transaction, CountDownLatch latch) {
        this.transaction = transaction;
        this.latch = latch;
    }

    @Override
    public void run() {
        try {
            TransactionContext.setTransactionId(String.valueOf(transaction.getTransactionId()));
            System.out.println("TransactionValidator is running for transaction ID: " + TransactionContext.getTransactionId());
            // 模拟验证逻辑
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("TransactionValidator was interrupted: " + e.getMessage());
        } finally {
            TransactionContext.clearTransactionId();
            latch.countDown();
        }
    }
}

// 交易计算金额任务
class TransactionCalculator implements Runnable {
    private Transaction transaction;
    private CountDownLatch latch;

    public TransactionCalculator(Transaction transaction, CountDownLatch latch) {
        this.transaction = transaction;
        this.latch = latch;
    }

    @Override
    public void run() {
        try {
            TransactionContext.setTransactionId(String.valueOf(transaction.getTransactionId()));
            System.out.println("TransactionCalculator is running for transaction ID: " + TransactionContext.getTransactionId());
            // 模拟计算金额逻辑
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("TransactionCalculator was interrupted: " + e.getMessage());
        } finally {
            TransactionContext.clearTransactionId();
            latch.countDown();
        }
    }
}

// 交易更新账户余额任务
class TransactionUpdater implements Runnable {
    private Transaction transaction;
    private CountDownLatch latch;

    public TransactionUpdater(Transaction transaction, CountDownLatch latch) {
        this.transaction = transaction;
        this.latch = latch;
    }

    @Override
    public void run() {
        try {
            TransactionContext.setTransactionId(String.valueOf(transaction.getTransactionId()));
            System.out.println("TransactionUpdater is running for transaction ID: " + TransactionContext.getTransactionId());
            // 模拟更新账户余额逻辑
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("TransactionUpdater was interrupted: " + e.getMessage());
        } finally {
            TransactionContext.clearTransactionId();
            latch.countDown();
        }
    }
}

// 交易通知用户任务
class TransactionNotifier implements Runnable {
    private Transaction transaction;
    private CountDownLatch latch;

    public TransactionNotifier(Transaction transaction, CountDownLatch latch) {
        this.transaction = transaction;
        this.latch = latch;
    }

    @Override
    public void run() {
        try {
            TransactionContext.setTransactionId(String.valueOf(transaction.getTransactionId()));
            System.out.println("TransactionNotifier is running for transaction ID: " + TransactionContext.getTransactionId());
            // 模拟通知用户逻辑
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("TransactionNotifier was interrupted: " + e.getMessage());
        } finally {
            TransactionContext.clearTransactionId();
            latch.countDown();
        }
    }
}
```


### 详细过程

1. **创建线程池和 CountDownLatch**：
   ```java
   this.cachedThreadPool = Executors.newCachedThreadPool();
   this.latch = new CountDownLatch(numberOfTasks);
   ```

   这行代码创建了一个可缓存的线程池，并初始化了一个 `CountDownLatch`，用于等待所有任务完成。

2. **提交任务**：
   ```java
   cachedThreadPool.submit(new TransactionValidator(transaction, latch));
   cachedThreadPool.submit(new TransactionCalculator(transaction, latch));
   cachedThreadPool.submit(new TransactionUpdater(transaction, latch));
   cachedThreadPool.submit(new TransactionNotifier(transaction, latch));
   ```

   这里提交了四种不同类型的线程任务：`TransactionValidator`（验证交易信息）、`TransactionCalculator`（计算交易金额）、`TransactionUpdater`（更新账户余额）和 `TransactionNotifier`（通知用户）。每个任务都实现了 `Runnable` 接口，并传递了 `CountDownLatch` 实例。

3. **任务执行**：
   - `TransactionValidator`：验证交易信息。
   - `TransactionCalculator`：计算交易金额。
   - `TransactionUpdater`：更新账户余额。
   - `TransactionNotifier`：通知用户交易状态。

4. **使用 `ThreadLocal`**：
   ```java
   TransactionContext.setTransactionId(String.valueOf(transaction.getTransactionId()));
   System.out.println("TransactionValidator is running for transaction ID: " + TransactionContext.getTransactionId());
   ```

   在每个任务的 `run` 方法中，使用 `ThreadLocal` 存储和获取当前线程的交易 ID，确保每个线程的上下文信息独立且安全。

5. **使用 `CountDownLatch`**：
   ```java
   latch.countDown();
   ```

   在每个任务的 `finally` 块中调用 `latch.countDown()`，表示一个任务已完成。在 `main` 方法中调用 `latch.await()`，等待所有任务完成。

6. **关闭线程池**：
   ```java
   cachedThreadPool.shutdown();
   ```

   在 `finally` 块中调用 `shutdown()` 方法，确保线程池在任务完成后被正确关闭，释放资源。

### 总结

通过上述示例，展示了如何在金融交易处理系统中使用 `CachedThreadPool` 来处理大量短生命周期的任务，并结合 `ThreadLocal` 和 `CountDownLatch` 来确保线程安全性和任务同步。具体优化点包括：

- **线程池管理**：使用 `CachedThreadPool` 管理线程，减少线程创建和销毁的开销。
- **线程安全**：使用 `ThreadLocal` 存储每个线程的上下文信息，确保数据隔离。
- **任务同步**：使用 `CountDownLatch` 等待所有任务完成，确保主线程在所有任务完成后才继续执行。

这种设计有助于确保金融系统的稳定性和高效性，特别是在高并发的情况下。