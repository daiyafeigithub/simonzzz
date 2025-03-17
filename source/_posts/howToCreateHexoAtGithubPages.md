---
title: 怎么在github pages部署自己的hexo项目
date: 2025年1月8日17:29:19
tags:
---

在 GitHub Pages 上部署 Hexo 项目是一个常见的需求，Hexo 是一个基于 Node.js 的静态博客生成器，而 GitHub Pages 是一个免费的静态网站托管服务。以下是详细的步骤，帮助你完成 Hexo 项目的部署。

---

### 1. 准备工作
确保你已经完成以下准备工作：
- 安装 Node.js 和 npm。
- 安装 Git。
- 创建一个 GitHub 仓库（如果还没有）。

---

### 2. 安装 Hexo
如果你还没有安装 Hexo，可以通过以下命令安装：

```bash
npm install -g hexo-cli
```

---

### 3. 初始化 Hexo 项目
在本地初始化一个 Hexo 项目：

```bash
hexo init my-blog
cd my-blog
npm install
```

- `my-blog` 是你的项目文件夹名称，可以根据需要修改。

---

### 4. 配置 Hexo
在 Hexo 项目的根目录下，编辑 `_config.yml` 文件，设置以下内容：

#### 配置部署信息
找到 `deploy` 部分，修改为以下内容：

```yaml
deploy:
  type: git
  repo: https://github.com/username/username.github.io.git
  branch: main
```

- `repo`：你的 GitHub 仓库地址。如果仓库名是 `username.github.io`，GitHub Pages 会自动部署到根目录。
- `branch`：部署分支，通常为 `main` 或 `gh-pages`。

#### 配置 URL 和根目录
找到 `url` 和 `root` 部分，根据你的仓库名称设置：

- 如果仓库名是 `username.github.io`：
  ```yaml
  url: https://username.github.io
  root: /
  ```

- 如果仓库名是其他名称（如 `my-blog`）：
  ```yaml
  url: https://username.github.io/my-blog
  root: /my-blog/
  ```

---

### 5. 安装 Hexo 部署插件
Hexo 需要一个插件来支持 Git 部署。安装 `hexo-deployer-git`：

```bash
npm install hexo-deployer-git --save
```

---

### 6. 生成静态文件并部署
在项目根目录下运行以下命令：

```bash
hexo clean
hexo generate
hexo deploy
```

- `hexo clean`：清理缓存和旧文件。
- `hexo generate`：生成静态文件到 `public` 目录。
- `hexo deploy`：将生成的静态文件部署到 GitHub 仓库。

---

### 7. 配置 GitHub Pages
1. 打开 GitHub 仓库，进入 `Settings -> Pages`。
2. 在 `Source` 部分，选择部署分支（如 `main` 或 `gh-pages`）。
3. 确保 `Custom domain` 为空（除非你使用了自定义域名）。
4. 点击 `Save` 保存设置。

---

### 8. 访问你的 GitHub Pages
部署完成后，访问以下 URL 查看你的网站：
- 如果仓库名是 `username.github.io`，访问 `https://username.github.io`。
- 如果仓库名是其他名称（如 `my-blog`），访问 `https://username.github.io/my-blog`。

---

### 9. 自动部署（可选）
如果你希望每次推送代码时自动部署，可以使用 GitHub Actions。

#### 创建 GitHub Actions 工作流
在项目根目录下创建 `.github/workflows/deploy.yml` 文件，内容如下：

```yaml
name: Deploy Hexo to GitHub Pages

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install Hexo and dependencies
        run: |
          npm install -g hexo-cli
          npm install

      - name: Generate static files
        run: |
          hexo clean
          hexo generate

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

- 这个工作流会在每次推送到 `main` 分支时自动生成静态文件并部署到 `gh-pages` 分支。

---

### 10. 常见问题

#### 页面没有样式
- 检查 `_config.yml` 中的 `url` 和 `root` 配置是否正确。
- 确保资源文件路径正确，可以通过浏览器开发者工具查看是否有资源加载失败。

#### 部署失败
- 检查 GitHub 仓库的 `Settings -> Pages`，确保部署分支正确。
- 确保 `hexo-deployer-git` 插件已安装。

#### 自定义域名
- 如果你使用了自定义域名，在 `source` 目录下创建 `CNAME` 文件，内容为你的域名。例如：
  ```
  example.com
  ```

---

### 总结
通过以上步骤，你可以将 Hexo 项目成功部署到 GitHub Pages。如果需要自动部署，可以使用 GitHub Actions 实现持续集成。如果有任何问题，可以参考 Hexo 和 GitHub Pages 的官方文档，或查看 GitHub 仓库的构建日志。