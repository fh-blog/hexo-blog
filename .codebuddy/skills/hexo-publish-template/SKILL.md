# Hexo 发布模板

为 Hexo 博客快速生成新文章，自动创建 front-matter 和正文骨架，避免手动复制粘贴。

## 触发场景

用户说"新建文章"、"写一篇博客"、"创建文章"、"发布模板"等时触发。

## 工作流

1. **收集信息**：向用户询问以下内容（已有则跳过）：
   - 文章标题（必填）
   - 标签 tags（如：`Hexo, JavaScript`）
   - 分类 categories（如：`前端`，支持嵌套如 `前端 > JavaScript`）
   - 文章简介 description（一句话概括）
   - SEO 关键词 keywords（可选）

2. **生成日期**：使用当前日期，格式 `YYYY-MM-DD`（如 `2026-08-05`）。

3. **生成文件**：在 `source/_posts/` 下创建 `{date}-{title}.md`，内容包含 front-matter 和正文骨架。

4. **生成后提醒**：文章创建完成后，提示用户执行 `hexo g && hexo s` 进行本地预览。

## Front-matter 模板

```yaml
---
title: {标题}
date: {日期}
updated: {日期}
tags:
  - {标签1}
  - {标签2}
categories:
  - [{分类1}, {子分类}]
description: {一句话描述}
keywords:
  - {关键词1}
  - {关键词2}
---
```

**规则**：
- `date` / `updated` 只用日期（`YYYY-MM-DD`），不加时间。
- `categories` 嵌套用数组形式：`- [父分类, 子分类]`。
- 不使用 `cover`、`comments`、`top` 字段（landscape 主题不支持）。

## 正文骨架

```markdown
## 前言

{1-2 句引入}

<!-- more -->

## 正文

...

## 总结

...

---

*内容由 AI 生成，仅供参考。本文发布于 [码上学习](http://www.pfh.bbroot.com)，转载请注明出处。*
```

**规则**：
- `<!-- more -->` 必须紧跟前言之后，用于首页摘要截断。
- 尾部必须附带版权声明，**必须包含"内容由 AI 生成，仅供参考"**，不完整禁止发布。

## 图片引用

- 图片统一存放在 `source/images/` 目录。
- 正文中引用时使用 `/images/xxx.jpg`（绝对路径，从站点根目录开始）。
- 示例：`![描述](/images/example.jpg)`

## 代码块

- 项目使用 `highlight.js` 做语法高亮，已开启行号显示。
- 所有代码块必须标注语言标签，否则高亮失效。
- 示例：

  ````markdown
  ```javascript
  const greeting = 'Hello Hexo';
  console.log(greeting);
  ```
  ````

## 文件命名

格式：`source/_posts/{date}-{title}.md`

示例：`source/_posts/2026-08-05-我的新文章.md`
