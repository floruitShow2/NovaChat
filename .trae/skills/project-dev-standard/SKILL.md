---
name: 'project-dev-standard'
description: '项目研发规范主入口。自动规划开发流程，协调各子规范执行。适用于创建新组件/页面、编写代码、代码审查时确保遵循项目规范。'
---

# 项目研发规范

本文档是 NovaChat 项目的前端研发规范主入口，**自动规划开发流程**，协调各子规范执行。

---

## 自动规划流程

当用户提出开发需求时，**自动执行以下流程**：

```
用户需求 → 分析需求类型 → 确定相关子规范 → 规划执行顺序 → 逐个调用 → 执行开发
```

### 需求分类与子规范映射

| 需求类型          | 相关子规范                                   | 执行顺序  |
| ----------------- | -------------------------------------------- | --------- |
| 新建组件/页面     | 目录结构 → 类型声明 → 样式编码 → 测试 → 文档 | 1→2→3→4→5 |
| 代码重构/优化     | 类型声明 → 样式编码                          | 1→2       |
| 功能测试/Bug 修复 | 测试规范                                     | 1         |
| 文档编写/更新     | 文档编写规范                                 | 1         |
| 样式调整          | 样式编码规范                                 | 1         |
| 类型定义/修改     | 类型声明规范                                 | 1         |

### 规划输出格式

在执行前，**自动输出任务规划**：

```markdown
## 任务规划

**目标**：[简述需求]

**执行步骤**：

1. [子规范A] - [具体任务]
2. [子规范B] - [具体任务]
3. ...

**开始执行...**
```

---

## 通用规范

### 核心原则

1. **单一职责**：每个文件/组件只做一件事
2. **DRY 原则**：Don&apos;t Repeat Yourself，重复代码抽取为工具函数
3. **类型安全**：优先使用 TypeScript，避免 `any`
4. **样式优先 Tailwind**：优先使用 Tailwind CSS，Less 仅在必要时使用

### 代码风格

- 使用 ESM 模块系统（`import`/`export`）
- 组件使用 `function` 声明，非必要时不使用 `class`
- 异步操作使用 `async/await`
- 错误处理：同步用 `try/catch`，异步在 API 层统一处理

---

## 子规范索引

| 子规范       | 文件路径                               | 适用场景           |
| ------------ | -------------------------------------- | ------------------ |
| 目录结构规范 | `references/directory-standard.md`     | 新建组件/模块时    |
| 类型声明规范 | `references/types-standard.md`         | 定义接口、Props 时 |
| 样式编码规范 | `references/style-standard.md`         | 编写样式时         |
| 测试规范     | `references/testing-standard.md`       | 编写测试、调试时   |
| 文档编写规范 | `references/documentation-standard.md` | 编写/更新文档时    |

---

## 组件开发 Checklist

新建组件时，确保完成以下事项：

- [ ] **目录结构**：创建 `index.tsx`、`index.interface.ts`
- [ ] **类型定义**：Props/State 类型完整，无 `any`
- [ ] **样式规范**：使用 Tailwind + classNames，无重复样式类
- [ ] **状态处理**：加载/错误/空状态考虑完整
- [ ] **测试覆盖**：核心逻辑有单元测试
- [ ] **文档更新**：必要时更新相关文档

---

## 执行流程示例

**用户需求**：新建一个用户资料编辑组件

**自动规划输出**：

```markdown
## 任务规划

**目标**：新建用户资料编辑组件

**执行步骤**：

1. **目录结构规范** - 在 `src/components/` 下创建 `UserProfile/` 目录，包含 index.tsx、index.interface.ts
2. **类型声明规范** - 定义 `IUserProfileProps`、`IUserProfileData` 接口
3. **样式编码规范** - 使用 Tailwind + classNames 编写组件样式
4. **测试规范** - 编写单元测试覆盖基础交互
5. **文档规范** - 更新组件文档（如需要）

**开始执行...**
```

---

## 参考资料

- [目录结构规范](./references/directory-standard.md)
- [类型声明规范](./references/types-standard.md)
- [样式编码规范](./references/style-standard.md)
- [测试规范](./references/testing-standard.md)
- [文档编写规范](./references/documentation-standard.md)
