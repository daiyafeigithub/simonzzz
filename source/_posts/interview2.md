---
title: 多线程开发
date: 2025年4月7日15:10:13
tags:
  - Java
  - 多线程
  - 线程池
categories:
  - 技术
---

### **多线程使用**




```java
package basic.multipleThread;

import java.util.concurrent.*;

public class ThreadPool {
    private void makeThreadPool() {
        // 直接启动线程的方式（不推荐）
        ThreadExtend threadExtend = new ThreadExtend();
        threadExtend.start();

        ThreadRunnable threadRunable = new ThreadRunnable();
        Thread thread = new Thread(threadRunable);
        thread.start();

        ThreadCallable threadCallable = new ThreadCallable();
        FutureTask<String> futureTask = new FutureTask<>(threadCallable);
        try {
            futureTask.run(); // 或者使用线程池来执行
            String result = futureTask.get();
            System.out.println("Callable Result: " + result);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    private void createThreadPoolExamples() {
        // 1. 使用 FixedThreadPool
        ExecutorService fixedThreadPool = Executors.newFixedThreadPool(3);
        fixedThreadPool.submit(new ThreadExtend());
        fixedThreadPool.submit(new ThreadRunnable());
        Future<String> futureFromFixedThreadPool = fixedThreadPool.submit(new ThreadCallable());
        try {
            String result = futureFromFixedThreadPool.get(5, TimeUnit.SECONDS);
            System.out.println("FixedThreadPool Callable Result: " + result);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            e.printStackTrace();
        } finally {
            fixedThreadPool.shutdown();
        }

        // 2. 使用 CachedThreadPool
        ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
        cachedThreadPool.submit(new ThreadExtend());
        cachedThreadPool.submit(new ThreadRunnable());
        Future<String> futureFromCachedThreadPool = cachedThreadPool.submit(new ThreadCallable());
        try {
            String result = futureFromCachedThreadPool.get(5, TimeUnit.SECONDS);
            System.out.println("CachedThreadPool Callable Result: " + result);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            e.printStackTrace();
        } finally {
            cachedThreadPool.shutdown();
        }

        // 3. 使用 SingleThreadExecutor
        ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();
        singleThreadExecutor.submit(new ThreadExtend());
        singleThreadExecutor.submit(new ThreadRunnable());
        Future<String> futureFromSingleThreadExecutor = singleThreadExecutor.submit(new ThreadCallable());
        try {
            String result = futureFromSingleThreadExecutor.get(5, TimeUnit.SECONDS);
            System.out.println("SingleThreadExecutor Callable Result: " + result);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            e.printStackTrace();
        } finally {
            singleThreadExecutor.shutdown();
        }

        // 4. 使用 ScheduledThreadPool
        ScheduledExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(3);
        scheduledThreadPool.schedule(new ThreadExtend(), 1, TimeUnit.SECONDS);
        scheduledThreadPool.schedule(new ThreadRunnable(), 1, TimeUnit.SECONDS);
        ScheduledFuture<String> futureFromScheduledThreadPool = scheduledThreadPool.schedule(new ThreadCallable(), 1, TimeUnit.SECONDS);
        try {
            String result = futureFromScheduledThreadPool.get(5, TimeUnit.SECONDS);
            System.out.println("ScheduledThreadPool Callable Result: " + result);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            e.printStackTrace();
        } finally {
            scheduledThreadPool.shutdown();
        }

        // 5. 使用 WorkStealingPool
        ExecutorService workStealingPool = Executors.newWorkStealingPool();
        workStealingPool.submit(new ThreadExtend());
        workStealingPool.submit(new ThreadRunnable());
        Future<String> futureFromWorkStealingPool = workStealingPool.submit(new ThreadCallable());
        try {
            String result = futureFromWorkStealingPool.get(5, TimeUnit.SECONDS);
            System.out.println("WorkStealingPool Callable Result: " + result);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            e.printStackTrace();
        } finally {
            workStealingPool.shutdown();
        }
    }

    public static void main(String[] args) {
        ThreadPool threadPool = new ThreadPool();
        threadPool.makeThreadPool();
        threadPool.createThreadPoolExamples();
    }
}

// 示例实现：ThreadExtend
class ThreadExtend extends Thread {
    @Override
    public void run() {
        System.out.println("ThreadExtend is running...");
        // 模拟任务逻辑
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("ThreadExtend was interrupted: " + e.getMessage());
        }
    }
}

// 示例实现：ThreadRunnable
class ThreadRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("ThreadRunnable is running...");
        // 模拟任务逻辑
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("ThreadRunnable was interrupted: " + e.getMessage());
        }
    }
}

// 示例实现：ThreadCallable
class ThreadCallable implements Callable<String> {
    @Override
    public String call() throws Exception {
        System.out.println("ThreadCallable is running...");
        // 模拟任务逻辑
        Thread.sleep(1000);
        return "Callable Task Completed";
    }
}
```


### 优化点总结

1. **异常处理增强**：为 `Future.get()` 方法添加超时机制，并捕获可能的异常（如 `TimeoutException` 和 `ExecutionException`），确保程序的健壮性。
2. **资源管理改进**：在 `finally` 块中调用 `executor.shutdown()`，确保线程池在任务完成后被正确关闭。
3. **多种线程池创建方式**：展示了 `FixedThreadPool`、`CachedThreadPool`、`SingleThreadExecutor`、`ScheduledThreadPool` 和 `WorkStealingPool` 五种创建线程池的方式，并展示了如何使用这些线程池来提交任务。
4. **代码封装性提升**：将线程任务的启动逻辑封装到 `ThreadPool` 类中，提高代码的可读性和可维护性。