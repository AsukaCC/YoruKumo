# Hexo 主题 YoruKumo (夜云)

<p align="center">
  <b>简体中文</b> | <a href="./README_en.md">English</a> | <a href="./README_ja.md">日本語</a>
</p>

YoruKumo 是一款专为极简主义者与视觉体验追求者设计的现代 Hexo 博客主题。本主题深度结合 **GSAP (GreenSock Animation Platform)** 与 **ScrollTrigger**，带来了高质感的微交互与动态加载动效，同时拥有优雅的毛玻璃设计系统（Glassmorphism）和完善的系统级暗黑模式。

---

## 核心特性

- 🌟 **GSAP 动力系统**：全面集成首屏元素 staggered（交错）进场动画，流畅性超越传统 CSS。
- 👁️ **ScrollTrigger 渐现**：滚动页面时，后续的文章卡片和模块将顺滑淡入并轻微上浮。
- ⛰️ **Banner 视差滚动**：顶部横幅大图支持超流畅的视差（Parallax）立体滚动。
- 🪄 **悬浮微交互**：文章卡片与标签悬停时，由 GSAP 控制卡片高度（Y轴偏移）、阴影深度和背景色变换。
- 🍃 **精美毛玻璃**：导航栏升级为磨砂玻璃滤镜效果（Glassmorphism），提供绝佳的图层质感。
- 🌗 **无缝双色模式**：默认跟随系统设定切换暗色 / 亮色主题，且能适应 GSAP 颜色过渡。
- ✒️ **定制中文排版**：预置了备受好评的 “霞鹜文楷 (LXGW WenKai)” 字体，带来极佳的阅读舒适度。
- ⏱️ **计时页脚**：内置可精确到秒的网站运行时间累加器。

---

## 快速开始

### 1. 安装与应用

1. 将本主题克隆（或下载解压）至 Hexo 根目录下的 `themes/YoruKumo` 文件夹中：
   ```bash
   git clone https://github.com/CreativityUnlimited/hexo-theme-YoruKumo.git themes/YoruKumo
   ```
2. 拷贝本主题目录下的 `_source` 目录（如果存在）到 Hexo 根目录的 `source` 下，以准备初始页面。
3. 修改 Hexo 根目录下的主配置文件 `_config.yml`：
   ```yaml
   theme: YoruKumo
   ```

### 2. 主题配置

为了便于版本更新时不冲突，推荐在 Hexo 根目录下创建本地覆盖配置文件：

1. 在博客根目录下新建 `_config.YoruKumo.yml` 文件。
2. 拷贝本主题下的 `_config.yml` 内容到该文件中，在此处修改您的个性化配置。

---

## 配置文件说明

以下是 `_config.YoruKumo.yml` 中新增及关键的配置项参数：

### 1. GSAP 动画控制 (`gsap`)

您可以通过配置 `gsap` 对象来启用、禁用或微调动画特性，以达到性能与美观的最佳平衡：

| 参数名 | 类型 | 默认值 | 作用说明 |
| :--- | :--- | :--- | :--- |
| `enable` | Boolean | `true` | 是否全局启用 GSAP 动画。关闭后将自动降级为原生 CSS 简单效果 |
| `entrance_stagger` | Number | `0.08` | 文章卡片/导航项首屏依次交错进入的时间间隔（单位：秒） |
| `scroll_trigger` | Boolean | `true` | 是否开启滚动到视口时才触发元素显现的效果 |
| `parallax` | Boolean | `true` | 顶部轮播图/大图背景是否启用滚动视差效果 |
| `hover_effect` | Boolean | `true` | 是否开启由 GSAP 托管的卡片悬浮（立体浮起、阴影扩散）交互 |

```yaml
# GSAP 动画配置示例
gsap:
  enable: true
  entrance_stagger: 0.08
  scroll_trigger: true
  parallax: true
  hover_effect: true
```

### 2. 网站基本信息

```yaml
favicon: /images/favicon.ico   # 站点 favicon
logo:                          # 自定义 Logo 图片路径（留空则显示 title 文本）
title: YoruKumo                # 站点文字标题
```

### 3. 社交与关于页面

关于页面的联系方式与社交链接可在配置中自由定制：

```yaml
about:
  name: 'Plutavian'
  description: '摸鱼爱好者'
  avatar: /images/avatar.jpg   # 头像路径
  email: 'plutavian@gmail.com'
  wechat: 'wechat_id'
  qq: 'qq_number'
  github: 'https://github.com/asukacc'
  linkedin: 'https://www.linkedin.com'
```

### 4. 运行时间页脚

在 `footer` 配置中指定 `since`，页脚就会显示出您的网站自该日期起已运行了多久：

```yaml
footer:
  since: 2025-01-01
  authorLink: https://github.com/asukacc
```

### 5. 多语言本地化支持 (`language`)

YoruKumo 完美支持国际化本地化，能够自动翻译页面标题、系统菜单、页脚运行时间单位、以及 D3.js 桑基图的全部交互文本。

在 Hexo 站点根目录下的 `_config.yml` 中修改 `language` 即可自由切换：

```yaml
# 简体中文
language: zh-CN

# 英文
language: en

# 日文
language: ja
```

---

## 浏览器兼容性与渐进增强

主题内置了**渐进增强（Progressive Enhancement）**逻辑。若浏览器禁用了 JavaScript，或由于网络原因未能加载 GSAP CDN：
1. 页面会自动向网页根节点注入 `no-gsap` 标识类。
2. 主题样式会自动切换至纯 CSS 优雅降级布局，保障博客内容的正常阅读与基本卡片 Hover 响应。
