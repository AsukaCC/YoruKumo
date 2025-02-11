---
title: YoruKumo 主题介绍
date: 2024-01-01
categories:
  - 主题介绍
tags:
  - YoruKumo
  - Hexo
  - 主题介绍
---

## 关于 YoruKumo

YoruKumo 是一个简约优雅的 Hexo 主题，专注于内容展示，提供了良好的阅读体验。主题名称 "YoruKumo"（夜云）展现了简约与优雅的设计理念。

## 主要特性

- 🌓 自适应深色模式
- 📱 响应式设计
- 🔍 文章搜索功能
- 💬 评论系统支持
- 📊 文章阅读统计
- 🎨 代码高亮
- 📝 Markdown 增强

## 快速开始

### 安装主题

```bash
# 进入 Hexo 根目录
cd your-hexo-site

# 下载主题
git clone https://github.com/your-username/hexo-theme-yorukumo.git themes/YoruKumo
```

### 启用主题

修改 Hexo 根目录下的 `_config.yml`：

```yaml
theme: YoruKumo
```

### 主题配置

在 `_config.YoruKumo.yml` 中配置主题：

```yaml
# 网站基本信息
site:
  logo: /images/logo.png
  favicon: /images/favicon.ico

# 导航菜单
menu:
  Home: /
  Archives: /archives
  Categories: /categories
  Tags: /tags
  About: /about

# 关于页面配置
about:
  avatar: /images/avatar.jpg
  name: Your Name
  description: 个人简介
  # 社交链接
  email: your-email@example.com
  github: https://github.com/username
  linkedin: https://linkedin.com/in/username
  wechat: your-wechat-id
  qq: your-qq-number

# 主题功能配置
features:
  darkMode: true # 深色模式开关
  search: true # 搜索功能
  toc: true # 文章目录
  codeHighlight: true # 代码高亮
```

## 文章配置

在文章的 Front-matter 中可以设置以下参数：

```yaml
---
title: 文章标题
date: 2024-01-01
updated: 2024-01-02
categories:
  - 分类
tags:
  - 标签1
  - 标签2
cover: /images/cover.jpg # 文章封面图
description: 文章描述
toc: true # 是否显示目录
---
```

## 主题定制

### 自定义样式

你可以通过修改 `source/css/_custom/custom.styl` 来添加自定义样式：

```stylus
// 示例：自定义链接颜色
a
  color: #0366d6
  &:hover
    color: #0246a2
```

### 自定义页面

YoruKumo 主题支持自定义页面，你可以通过以下命令创建：

```bash
hexo new page custom-page
```

## 常见问题

1. **图片无法显示**

   - 确保图片路径正确
   - 检查 \_config.yml 中的 post_asset_folder 设置

2. **评论系统配置**
   - 支持 Gitalk、Valine 等评论系统
   - 在主题配置文件中填写相应配置信息

## 更新日志

### v1.0.0 (2024-01-01)

- 🎉 首次发布
- ✨ 基础功能实现
- 🌓 深色模式支持

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进主题。

## 许可证

YoruKumo 主题遵循 MIT 许可证。

---

希望你能享受使用 YoruKumo 主题的体验！如有任何问题，欢迎在 GitHub 上提出。
