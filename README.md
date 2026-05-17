# Hermes Agent 学习指南

一个基于 Web 的交互式学习平台，帮助开发者从整体到细节地学习 [Hermes Agent](https://github.com/NousResearch/hermes-agent) 项目。

## 内容结构

- **项目概述** - 什么是 Hermes Agent，核心特性，快速入门
- **架构全景** - 入口点，核心循环，依赖链
- **核心子系统** - Tool 系统、Provider 适配器、CLI 命令、Gateway、Skills、Memory、闭环学习
- **扩展机制** - 添加 Tool、Skill、Platform
- **参考文档** - 命令索引、工具索引、配置参考

## 技术栈

- 纯静态 HTML/CSS/JS（无需构建）
- Mermaid.js（架构图）
- Prism.js（代码高亮）

## 使用方法

直接在浏览器中打开 `index.html`，或使用本地服务器：

```bash
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 学习路径

建议按顺序学习：
1. 项目概述 → 了解 Hermes Agent 是什么
2. 架构全景 → 理解整体架构
3. 核心子系统 → 深入各模块
4. 扩展机制 → 学会扩展开发
5. 参考文档 → 查阅具体内容

## License

MIT