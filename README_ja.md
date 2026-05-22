# Hexo テーマ YoruKumo (夜雲)

<p align="center">
  <a href="./README.md">简体中文</a> | <a href="./README_en.md">English</a> | <b>日本語</b>
</p>

YoruKumo（夜雲）は、ミニマリストやビジュアルデザインを重視する方のためのモダンな Hexo ブログテーマです。本テーマは **GSAP (GreenSock Animation Platform)** と **ScrollTrigger** を高度に統合し、ハイクオリティなマイクロインタラクションとダイナミックな読込アニメーションを提供します。また、美しいグラスモーフィズム（Glassmorphism）デザインシステムと、シームレスなシステム標準ダークモードを搭載しています。

---

## 主な機能

- 🌟 **GSAP アニメーションエンジン**: ファーストビュー要素の staggered（時間差）入場アニメーションを完全に統合し、従来の CSS を超えるスムーズな遷移を実現。
- 👁️ **ScrollTrigger フェードイン**: ページをスクロールする際、以降の記事カードやコンポーネントが滑らかにフェードインし、わずかに浮き上がります。
- ⛰️ **パララックススクロール**: トップのヘッダーバナー画像は、超スムーズな視差（Parallax）立体スクロールをサポート。
- 🪄 **ホバーインタラクション**: 記事カードやタグをホバーすると、GSAP の制御により、立体的なリフトアップ（Y軸移動）、シャドウ展開、背景色遷移がスムーズにトリガーされます。
- 🍃 **洗練されたグラスモーフィズム**: ナビゲーションバーは美しい極上すりガラスフィルターを搭載し、極めて高いレイヤーの質感を表現。
- 🌗 **シームレスな自動ダークモード**: システムのテーマ設定に自動追従し、滑らかなカラー遷移カーブでライト／ダークテーマを切り替えます。
- ✒️ **美しい日本語タイポグラフィ**: 高い評価を得ている「霞鹜文楷 (LXGW WenKai)」Webフォントをプリセットし、極上の読書体験を提供。
- ⏱️ **稼働時間フッター**: 秒単位まで正確に計算するブログ稼働時間カウンターを内蔵。
- 🌐 **多言語（ローカライズ）対応**: 日本語、英語、簡体字中国語をネイティブサポート。

---

## クイックスタート

### 1. インストール

1. 本テーマをご自身の Hexo プロジェクトの `themes/YoruKumo` フォルダにクローン（またはダウンロードして展開）します：
   ```bash
   git clone https://github.com/CreativityUnlimited/hexo-theme-YoruKumo.git themes/YoruKumo
   ```
2. テーマフォルダ内にある `_source` ディレクトリ（存在する場合）をご自身の Hexo ルートディレクトリ下の `source` フォルダにコピーし、初期ページの准备をします。
3. Hexo ルートディレクトリの主設定文件 `_config.yml` を編集します：
   ```yaml
   theme: YoruKumo
   ```

### 2. テーマの個別設定

テーマのアップデート時の設定衝突を防ぐため、Hexo ルートディレクトリにローカル設定オーバーライドファイルを作成することを強くお勧めします：

1. ブログのルートディレクトリに `_config.YoruKumo.yml` という新規ファイルを作成します。
2. テーマフォルダ内にある `_config.yml` の内容をこのファイルにコピーし、個別設定を編集します。

---

## 設定ファイル（_config.YoruKumo.yml）パラメータ説明

以下は `_config.YoruKumo.yml` 内の主要な設定項目です：

### 1. GSAP アニメーション制御 (`gsap`)

パフォーマンスと美しさを両立させるため、アニメーション機能を個別に有効化・無効化・微調整できます：

| パラメータ名 | 型 | デフォルト値 | 作用説明 |
| :--- | :--- | :--- | :--- |
| `enable` | Boolean | `true` | 全局で GSAP アニメーションを有効化。無効時はシンプルな原生 CSS 効果に自動フォールバック |
| `entrance_stagger` | Number | `0.08` | ファーストビューのカードやメニュー要素が入場する時間差間隔（秒単位） |
| `scroll_trigger` | Boolean | `true` | スクロールでビューポートに入った時のみフェードインアニメーションをトリガー |
| `parallax` | Boolean | `true` | トップバナー画像のパララックス（視差）効果の有効化 |
| `hover_effect` | Boolean | `true` | 記事カード等のホバー时における立体リフトアップとシャドウ拡散の有効化 |

```yaml
# GSAP アニメーションの設定例
gsap:
  enable: true
  entrance_stagger: 0.08
  scroll_trigger: true
  parallax: true
  hover_effect: true
```

### 2. ウェブサイトの基本情報

```yaml
favicon: /images/favicon.ico   # サイトのファビコン
logo:                          # カスタムロゴ画像のパス（空欄の場合はタイトルテキストを表示）
title: YoruKumo                # サイトのタイトル名
```

### 3. プロフィール（自己紹介）＆ソーシャルメディア

プロフィールページに表示される自己紹介とソーシャルリンクを設定できます：

```yaml
about:
  name: 'Plutavian'
  description: 'Moyu（のんびり）大好き'
  avatar: /images/avatar.jpg   # アバター画像のパス
  email: 'plutavian@gmail.com'
  wechat: 'wechat_id'
  qq: 'qq_number'
  github: 'https://github.com/asukacc'
  linkedin: 'https://www.linkedin.com'
```

### 4. フッターブログ稼働時間

`footer` 設定の `since` に日付を指定すると、フッターにサイトが稼働してからの経過時間が自動計算されて表示されます：

```yaml
footer:
  since: 2025-01-01
  authorLink: https://github.com/asukacc
```

### 5. 多言語（ローカライズ）対応 (`language`)

YoruKumo は多言語対応（i18n）をネイティブでサポートしており、ページヘッダー、ナビゲーションメニュー、フッター時間単位、D3.js インタラクティブチャートのツールチップ等を自動翻訳します。

Hexo ルートディレクトリの `_config.yml` 内の `language` キーを変更するだけで切り替えられます：

```yaml
# 簡体字中国語
language: zh-CN

# 英語
language: en

# 日本語
language: ja
```

---

## ブラウザ互換性とプログレッシブエンハンスメント

本テーマは**プログレッシブエンハンスメント（Progressive Enhancement）**の思想に基づき構築されています。ブラウザ側で JavaScript が無効化されている場合や、ネットワーク遅延等により GSAP CDN の読み込みが失敗した場合でも：
1. ページのルート要素（HTML）に自動的に `no-gsap` クラスがインジェクションされます。
2. レイアウトは自動的にピュア CSS モードへと上品にフォールバックし、ブログ記事の快適な読みやすさと基本的なホバー効果を完全に維持します。
