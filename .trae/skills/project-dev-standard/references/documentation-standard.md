# 文档编写规范

## 文档类型与位置

| 文档类型 | 位置                   | 说明                    |
| -------- | ---------------------- | ----------------------- |
| 项目总览 | `docs/README.md`       | 项目介绍、快速开始      |
| API 文档 | `docs/API.md`          | 接口定义、请求/响应示例 |
| 组件规范 | `docs/COMPONENT.md`    | 组件使用规范            |
| 架构文档 | `docs/ARCHITECTURE.md` | 系统架构、技术选型      |
| 变更记录 | `docs/CHANGELOG.md`    | 版本变更历史            |

## 目录结构

```
docs/
├── README.md           # 项目总览
├── API.md              # 接口文档
├── COMPONENT.md        # 组件规范
├── ARCHITECTURE.md     # 架构文档
└── CHANGELOG.md        # 变更记录
```

## API 文档规范

### 3.1 接口文档模板

````markdown
## 接口名称

**请求**

```json
{
  "field1": "string",
  "field2": 123
}
```
````

**响应**

```json
{
  "code": 0,
  "data": {
    "id": "string",
    "name": "string"
  },
  "message": "string"
}
```

**示例**

```typescript
const response = await fetch('/api/example', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ field1: 'value', field2: 123 }),
});
```

````

## CHANGELOG 规范

### 4.1 格式要求

遵循 [Keep a Changelog](https://keepachangelog.com/) 格式：

```markdown
## [版本号] - YYYY-MM-DD

### 新增
- 功能 A：描述及使用示例
- 功能 B：（简要说明）

### 修复
- 问题 A：问题描述及解决方案
- 问题 B：（简要说明）

### 变更
- 接口 A：变更说明及迁移指南
- 配置 B：（简要说明）

### 废弃
- 废弃功能说明

### 移除
- 已移除功能说明（未来破坏性变更）
````

### 4.2 版本号规范

遵循 [SemVer](https://semver.org/) 规范：

- **MAJOR.MINOR.PATCH**
- MAJOR：不兼容的 API 变更
- MINOR：向后兼容的功能新增
- PATCH：向后兼容的问题修复

## README 规范

### 5.1 必含内容

```markdown
# 项目名称

简短描述（1-2 句话）

## 特性

- 特性 1
- 特性 2

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装

\`\`\`bash
pnpm install
\`\`\`

### 开发

\`\`\`bash
pnpm dev
\`\`\`

## 相关文档

- [API 文档](./API.md)
- [组件规范](./COMPONENT.md)
```

## 更新时机

| 场景          | 文档类型          |
| ------------- | ----------------- |
| 新增功能模块  | README + API 文档 |
| API 接口变更  | API changelog     |
| 组件 API 变更 | 组件 README       |
| 架构调整      | 架构文档          |
| Bug 修复      | CHANGELOG         |
