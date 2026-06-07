# 类型声明规范

## 命名规则

### 2.1 接口命名

- 使用 `I` 前缀或 `Props`/`State`/`Options` 后缀
- 枚举使用 PascalCase，成员使用 UPPER_SNAKE_CASE 或 camelCase

```typescript
// ✅ 正确示例
interface IChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface IChatInputProps {
  onSend: (message: string, model: string) => void;
  disabled: boolean;
}

enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
}

// ✅ as const 对象（轻量级枚举替代）
const MODEL_OPTIONS = [
  { value: 'deepseek-chat', label: 'DeepSeek Chat' },
  { value: 'deepseek-reasoner', label: 'DeepSeek Reasoner' },
] as const;
```

### 2.2 禁止使用 any

- 用 `unknown` 替代，辅以类型守卫
- 业务类型尽量具体化

```typescript
// ❌ 避免
function handleError(error: any) {
  console.log(error.message);
}

// ✅ 正确
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

## 文件组织

### 3.1 接口文件位置

类型声明统一放在 `index.interface.ts`：

```typescript
// index.interface.ts
export interface IUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface IChatState {
  messages: IUser[];
  loading: boolean;
}
```

```tsx
// index.tsx
import { IUser, IChatState } from './index.interface';
```

### 3.2 全局类型

全局共享的类型放在 `src/types/` 目录：

```
src/types/
├── global.d.ts      # 全局类型声明
├── api.d.ts         # API 相关类型
└── theme.d.ts       # 主题相关类型
```

## 导出规范

- 使用命名导出 `export interface IChatMessage`
- 避免默认导出类型
- 相关的 interface 可以放在同一个文件
