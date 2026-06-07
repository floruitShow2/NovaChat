# 目录结构规范

## 文件组织

每个功能模块采用以下文件组织方式：

| 文件                 | 用途     | 说明                                         |
| -------------------- | -------- | -------------------------------------------- |
| `index.tsx`          | 代码文件 | 组件逻辑、JSX 结构                           |
| `index.interface.ts` | 类型声明 | 接口、类型定义、Props 类型                   |
| `index.module.less`  | 样式文件 | **优先使用 Tailwind CSS**，非必要不使用 Less |

## 示例目录结构

```
src/components/ChatInput/
├── index.tsx           # 组件代码
├── index.interface.ts  # 类型声明
└── index.module.less   # 样式（尽量避免）

src/components/ChatMessages/
├── index.tsx
├── index.interface.ts
└── index.module.less  # 仅在 Tailwind 无法实现时使用
```

## 模块拆分原则

- **组件拆分**：一个组件一个目录，保持单一职责
- **共享组件**：`src/components/` 目录下按功能分类
- **工具函数**：`src/utils/` 目录下按功能分类
- **类型定义**：优先放在组件目录的 `index.interface.ts`，全局类型放 `src/types/`
