# 样式编码规范

## 技术选型优先级

1. **Tailwind CSS**（首选）- 内联工具类
2. **classNames + tailwind-merge** - 条件样式拼接
3. **CSS Modules / Less** - 仅在 Tailwind 无法实现复杂场景时使用

## 安装依赖

```bash
npm install classnames tailwind-merge
```

## 样式工具函数

创建 `utils/cn.ts` 统一处理类名合并：

```typescript
// utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 样式拆分规范

### 4.1 基础样式拆分

将复杂组件的样式拆分为逻辑单元：

```tsx
// ❌ 错误：样式堆砌在一行
<button className='flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed'>
  Submit
</button>;

// ✅ 正确：使用 tailwind-merge 拼接
import { cn } from '@/utils/cn';

const buttonBase =
  'flex items-center justify-between w-full px-4 py-3 text-sm rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed';
const buttonVariants = {
  default: 'text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300',
  primary: 'text-white bg-gray-900 hover:bg-gray-800',
};

<button className={cn(buttonBase, buttonVariants.default)}>Submit</button>;
```

### 4.2 状态变体样式

```tsx
interface ButtonProps {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const buttonVariants = {
  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
  variant: {
    default: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  },
  size: {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  },
};

<button
  className={cn(
    buttonVariants.base,
    buttonVariants.variant[variant || 'default'],
    buttonVariants.size[size || 'md']
  )}
>
  {children}
</button>;
```

## Less 使用场景

仅在以下情况使用 Less：

- 需要 CSS 变量（主题定制）
- 需要混合（mixins）复用样式逻辑
- 复杂嵌套选择器（Tailwind 无法实现）

```less
// index.module.less
@primary-color: #1677ff;
@border-radius: 8px;

.card-container {
  background: #fff;
  border-radius: @border-radius;
  padding: 16px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .card-title {
    color: @primary-color;
    font-weight: 500;
  }
}
```

## Tailwind 最佳实践

- 使用 `@apply` 抽取重复工具类（谨慎使用，避免破坏阅读性）
- 使用 `tailwind.config.js` 扩展主题
- 响应式设计：`md:`、`lg:` 前缀
- 暗色模式：`dark:` 前缀配合 `class` 或 `media` 策略
