# Hexo Theme YoruKumo (Night Cloud)

<p align="center">
  <a href="./README.md">简体中文</a> | <b>English</b> | <a href="./README_ja.md">日本語</a>
</p>

YoruKumo is a modern Hexo blog theme designed for minimalists and visual experience pursuers. This theme deeply integrates **GSAP (GreenSock Animation Platform)** and **ScrollTrigger** to bring high-quality micro-interactions and dynamic loading animations. It also features an elegant Glassmorphism design system and a seamless system-level dark mode.

---

## Core Features

- 🌟 **GSAP Animation Engine**: Fully integrated first-screen element staggered entry animations, providing fluid transitions beyond traditional CSS.
- 👁️ **ScrollTrigger Fade-in**: As you scroll the page, subsequent article cards and modules will smoothly fade in and float up slightly.
- ⛰️ **Banner Parallax Scrolling**: The top banner image supports ultra-smooth parallax perspective scrolling.
- 🪄 **Micro-hover Interactions**: Hovering over article cards and tags triggers smooth GSAP-controlled vertical offsets, shadow depth animations, and background color shifts.
- 🍃 **Stunning Glassmorphism**: The navigation bar features a premium frosted glass filter, offering exceptional layout depth.
- 🌗 **Seamless Dark Mode**: Automatically adapts to system dark/light preferences with fluid color transition curves.
- ✒️ **Typography Optimization**: Built-in support for the acclaimed "LXGW WenKai" font, maximizing reading comfort.
- ⏱️ **Site Runtime Footer**: Features a built-in runtime accumulator precise to the second.
- 🌐 **Multilingual Localization**: Native support for English, Simplified Chinese, and Japanese.

---

## Quick Start

### 1. Installation

1. Clone (or download and extract) this theme into your Hexo project's `themes/YoruKumo` folder:
   ```bash
   git clone https://github.com/CreativityUnlimited/hexo-theme-YoruKumo.git themes/YoruKumo
   ```
2. Copy the `_source` directory (if present in the theme folder) to the `source` folder under your Hexo root directory to prepare initial pages.
3. Modify the main configuration file `_config.yml` in your Hexo root directory:
   ```yaml
   theme: YoruKumo
   ```

### 2. Theme Configuration

To prevent configuration conflicts during theme updates, it is highly recommended to create a local override config file at your Hexo root:

1. Create a new file named `_config.YoruKumo.yml` in your blog's root directory.
2. Copy the contents of the theme's `_config.yml` to this newly created file and customize your personalized configurations here.

---

## Configuration File Options

Below are the key configurations and parameters in `_config.YoruKumo.yml`:

### 1. GSAP Animation Control (`gsap`)

You can enable, disable, or fine-tune animation features to achieve the perfect balance of performance and aesthetics:

| Param Name         | Type    | Default | Description                                                                                |
| :----------------- | :------ | :------ | :----------------------------------------------------------------------------------------- |
| `enable`           | Boolean | `true`  | Globally enable GSAP animations. If false, it gracefully downgrades to simple CSS effects. |
| `entrance_stagger` | Number  | `0.08`  | Staggered interval delay for first-screen cards/navigation items entering (seconds).       |
| `scroll_trigger`   | Boolean | `true`  | Trigger element fade-ins only when they scroll into the viewport.                          |
| `parallax`         | Boolean | `true`  | Enable parallax scrolling effect on the top banner or hero image.                          |
| `hover_effect`     | Boolean | `true`  | Enable interactive vertical offset and shadow expansion on card hovering.                  |

```yaml
# GSAP Animations Configuration Example
gsap:
  enable: true
  entrance_stagger: 0.08
  scroll_trigger: true
  parallax: true
  hover_effect: true
```

### 2. Website Basic Information

```yaml
favicon: /images/favicon.ico # Site favicon path
logo: # Custom logo image path (leave empty to display text title)
title: YoruKumo # Site title text
```

### 3. Social Networks & Profile

You can customize your contact info and social links displayed on the profile page:

```yaml
about:
  name: "Plutavian"
  description: "Moyu Enthusiast"
  avatar: /images/avatar.jpg # Avatar image path
  email: "plutavian@gmail.com"
  wechat: "wechat_id"
  qq: "qq_number"
  github: "https://github.com/asukacc"
  linkedin: "https://www.linkedin.com"
```

### 4. Site Runtime Footer

Specify a start date `since` under the `footer` settings, and the footer will dynamically render how long your site has been live:

```yaml
footer:
  since: 2025-01-01
  authorLink: https://github.com/asukacc
```

### 5. Multilingual Localization Support (`language`)

YoruKumo has first-class multilingual localization capabilities, translating page headers, navigation menus, footer runtime units, and D3.js interactive diagrams automatically.

Change the `language` key in your Hexo root `_config.yml` to switch between:

```yaml
# Simplified Chinese
language: zh-CN

# English
language: en

# Japanese
language: ja
```

---

## Compatibility & Progressive Enhancement

The theme integrates **Progressive Enhancement** logic. If the browser blocks JavaScript or fails to retrieve the GSAP library from CDNs:

1. The theme automatically injects a `no-gsap` class into the root HTML element.
2. The layouts automatically adapt to a clean CSS layout, preserving article readability and simple card hover effects.
