---
title: 面试题
date: 2025年4月7日15:20:48
tags:
  - 面试
categories:
  - 面试
---
## 一、Spring Boot自动配置的核心过程：  

1. **启动触发**：通过`@EnableAutoConfiguration`启用自动配置。  
2. **加载配置类**：从`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`读取候选配置类。  
3. **条件过滤**：基于`@Conditional`系列注解（如`@ConditionalOnClass`、`@ConditionalOnMissingBean`）筛选有效配置。  
4. **应用配置**：按优先级顺序实例化符合条件的Bean，完成自动装配。  

整个过程遵循"约定优于配置"，减少手动设置，提升开发效率。

## 二、springboot打包成war的方式

将Spring Boot项目打包为WAR只需两步：

1) 修改`pom.xml`将打包方式改为`war`并添加`provided`范围的Tomcat依赖；
2) 让主类继承`SpringBootServletInitializer`并重写`configure`方法**。最后用`mvn package`命令生成WAR文件即可部署到外部容器。

## 三、springboot的核心注解
1. `@SpringBootApplication`：组合了`@Configuration`、`@EnableAutoConfiguration`和`@ComponentScan`三个注解，用于启动一个Spring Boot应用。

## 四、springboot的全局异常处理
Spring Boot 全局异常处理的核心实现方式：  

1. **`@ControllerAdvice` + `@ExceptionHandler`**  
   定义全局异常处理类，用 `@ControllerAdvice` 标注，内部方法用 `@ExceptionHandler` 捕获特定异常。  

2. **返回统一结构**  
   在处理方法中封装统一的错误响应（如错误码、错误信息）。  

3. **覆盖默认异常处理**  
   可覆盖 Spring Boot 默认的 `/error` 处理，实现自定义异常页面或 JSON 响应。  

示例代码：  
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        return ResponseEntity
            .status(500)
            .body(new ErrorResponse(500, e.getMessage()));
    }
}
```  
特点：**简单注解驱动**，**统一异常拦截**，**支持 REST 和页面**。


## 五、在 Spring Boot 中获取配置文件（`application.yml` 或 `application.properties`）中的配置有以下几种常用方式：

---

### 1. **`@Value` 注解直接注入**
```java
@Value("${配置键名}")
private String configValue;
```
**示例**：  
配置文件：
```properties
app.name=MyApp
```
代码获取：
```java
@Value("${app.name}")
private String appName;
```

---

### 2. **`@ConfigurationProperties` 绑定到对象**
适合分组获取多个配置项。  
**步骤**：  
1. 定义配置类：
```java
@ConfigurationProperties(prefix = "app") // 指定配置前缀
@Component // 或通过@EnableConfigurationProperties启用
public class AppConfig {
    private String name;
    private int version;
    // getter/setter
}
```
2. 配置文件：
```yaml
app:
  name: MyApp
  version: 1
```
3. 直接注入使用：
```java
@Autowired
private AppConfig appConfig;
```

---

### 3. **通过 `Environment` 对象动态获取**
```java
@Autowired
private Environment env;

String value = env.getProperty("配置键名");
```

---

### 4. **`@PropertySource` 读取自定义配置文件**
```java
@Configuration
@PropertySource("classpath:custom.properties")
public class CustomConfig {
    @Value("${custom.key}")
    private String customValue;
}
```


---

### 注意事项：
1. **优先级**：  
   Spring Boot 配置加载顺序为：命令行参数 > `application-{profile}.yml` > `application.yml` > 默认值。
2. **多环境配置**：  
   使用 `spring.profiles.active=dev` 指定环境（如 `application-dev.yml`）。
3. **类型安全**：  
   推荐使用 `@ConfigurationProperties` 避免硬编码和类型错误。

选择方式根据场景：  
- 简单值 → `@Value`  
- 分组配置 → `@ConfigurationProperties`  
- 动态获取 → `Environment`

## 六、Spring Boot 加载 **所有类型配置文件** 的顺序（**优先级从高到低**）：  

### **1. 外部配置（优先级最高）**
- **命令行参数**（`--key=value`，如 `java -jar app.jar --server.port=8081`）  
- **操作系统环境变量**（如 `export SERVER_PORT=8081`）  
- **Java 系统属性**（`-Dkey=value`，如 `-Dserver.port=8081`）  

### **2. 外部配置文件**
- **`config/` 目录下的配置文件**（按以下顺序）：  
  - 项目根目录下的 `/config/application.{properties|yml}`  
  - 项目根目录下的 `application.{properties|yml}`  
  - `classpath:/config/application.{properties|yml}`（`resources/config/`）  
  - `classpath:/application.{properties|yml}`（`resources/`）  

### **3. Profile 专属配置**
- **`application-{profile}.{properties|yml}`**（如 `application-dev.yml`）  
- 通过 `spring.profiles.active` 指定生效的 Profile（如 `dev`、`prod`）  

### **4. 默认配置（优先级最低）**
- **`@PropertySource` 指定的自定义文件**（如 `@PropertySource("classpath:custom.properties")`）  
- **Spring Boot 默认配置**（如 `SpringApplication.setDefaultProperties`）  

---

### **总结（加载顺序）**：
1. **命令行参数** > **环境变量** > **Java 系统属性**  
2. **外部 `/config/` 目录配置** > **外部根目录配置** > **`classpath:/config/`** > **`classpath:/`**  
3. **`application-{profile}.{properties|yml}`**（Profile 专属配置）  
4. **`@PropertySource` 自定义文件** > **Spring Boot 默认值**  

**关键点**：
- **相同配置，后加载的会覆盖先加载的**。  
- **`Profile` 机制允许不同环境使用不同配置**（如 `dev`、`test`、`prod`）。  
- **外部配置优先级 > JAR 包内部配置**，便于部署时动态调整。  

适用于：`properties`、`yml`、`yaml` 等所有 Spring Boot 支持的配置文件格式。


## 七、在 Spring Boot（特别是结合 Spring Cloud 时），**`bootstrap` 配置文件**的加载逻辑如下：  

1. **优先级最高**：比 `application` 文件更早加载，用于**系统级配置**（如加密信息、Consul/Nacos 配置中心连接参数）。  
2. **加载顺序**：  
   - 先加载 `bootstrap.yml/properties`（或 `bootstrap-{profile}.yml`）  
   - 再加载 `application.yml/properties`  
3. **典型场景**：配置中心的地址、加密密钥、Spring Cloud 相关配置（如 `spring.cloud.nacos.config`）。  
4. **默认关闭**：需依赖 `spring-cloud-starter-bootstrap`（旧版）或通过 `spring.config.use-legacy-processing=true` 启用（新版 Spring Cloud 2020+）。  

**一句话**：`bootstrap` 是“配置的配置”，先于 `application` 加载，适合**初始化关键基础设施**。