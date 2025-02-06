---
title: 如何在vue+springboot项目中使用https
date: 2025年1月8日14:10:11
tags:
  - deepseek
  - 教程
categories:
  - 技术
---

在 Vue + Spring Boot 项目中使用 HTTPS，需要分别在 Vue 前端和 Spring Boot 后端进行配置。以下是具体步骤：

### 1. 生成 SSL 证书
首先，你需要一个 SSL 证书。可以使用自签名证书进行测试，或从受信任的证书颁发机构（CA）获取正式证书。

#### 自签名证书生成
使用 OpenSSL 生成自签名证书：

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

这将生成 `key.pem`（私钥）和 `cert.pem`（证书）文件。

### 2. 配置 Spring Boot 使用 HTTPS

#### 将证书放入 Spring Boot 项目
将生成的 `key.pem` 和 `cert.pem` 文件放入 `src/main/resources` 目录。

#### 修改 `application.properties`
在 `application.properties` 中添加以下配置：

```properties
server.port=8443
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=your_password
server.ssl.key-password=your_password
```

将 `key.pem` 和 `cert.pem` 转换为 PKCS12 格式：

```bash
openssl pkcs12 -export -in cert.pem -inkey key.pem -out keystore.p12 -name tomcat -CAfile cert.pem -caname root
```

将生成的 `keystore.p12` 放入 `src/main/resources` 目录。

### 3. 配置 Vue 使用 HTTPS

#### 修改 Vue 开发服务器配置
在 `vue.config.js` 中配置开发服务器使用 HTTPS：

```javascript
const fs = require('fs');
const path = require('path');

module.exports = {
  devServer: {
    port: 8080,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true,
      },
    },
  },
};
```

将 `key.pem` 和 `cert.pem` 放入 Vue 项目根目录。

### 4. 部署配置

#### 前端部署
将 Vue 项目打包并部署到支持 HTTPS 的服务器（如 Nginx 或 Apache）。

#### 后端部署
将 Spring Boot 项目打包为 JAR 或 WAR 文件，并部署到支持 HTTPS 的服务器。

### 5. 测试
启动 Spring Boot 和 Vue 项目，分别通过 `https://localhost:8443` 和 `https://localhost:8080` 访问，确保 HTTPS 正常工作。

### 6. 其他注意事项
- **证书有效期**：自签名证书仅用于测试，生产环境应使用受信任的 CA 证书。
- **混合内容**：确保前端资源（如 JS、CSS）通过 HTTPS 加载，避免混合内容问题。
- **CORS**：如果前后端分离部署，配置正确的 CORS 策略。

通过这些步骤，你的 Vue + Spring Boot 项目将能够使用 HTTPS 进行安全通信。