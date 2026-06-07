# 功能测试规范

## 测试策略

### 1.1 测试分层

| 层级     | 测试内容           | 工具                           |
| -------- | ------------------ | ------------------------------ |
| 单元测试 | 组件逻辑、工具函数 | Vitest + React Testing Library |
| 集成测试 | 组件交互、API 调用 | Vitest + MSW                   |
| E2E 测试 | 完整用户流程       | Playwright                     |

### 1.2 测试覆盖率目标

- 核心业务逻辑：80%+
- 组件 Props/State 处理：90%+
- 边界条件和异常场景：70%+

## 单元测试规范

### 2.1 组件测试

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatInput from "./index";

describe("ChatInput", () => {
  it("should disable send button when input is empty", () => {
    render(<ChatInput disabled={false} onSend={vi.fn()} selectedModel="deepseek-chat" />);
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("should call onSend with correct args when submitting", async () => {
    const mockOnSend = vi.fn();
    render(<ChatInput disabled={false} onSend={mockOnSend} selectedModel="deepseek-chat" />);

    fireEvent.change(screen.getByPlaceholderText(/输入消息/), { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(mockOnSend).toHaveBeenCalledWith("Hello", "deepseek-chat");
  });

  it("should clear input after sending", async () => {
    const mockOnSend = vi.fn();
    render(<ChatInput disabled={false} onSend={mockOnSend} selectedModel="deepseek-chat" />);

    fireEvent.change(screen.getByPlaceholderText(/输入消息/), { target: { value: "Test" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByPlaceholderText(/输入消息/)).toHaveValue("");
  });
});
```

### 2.2 工具函数测试

```typescript
import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    expect(cn('base-class', isActive && 'active-class')).toBe('base-class active-class');
  });

  it('should override Tailwind classes with tailwind-merge', () => {
    expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500');
  });
});
```

## 边界测试

```typescript
describe("ChatInput - Boundary Tests", () => {
  it("should handle empty string", () => {
    const mockOnSend = vi.fn();
    render(<ChatInput disabled={false} onSend={mockOnSend} selectedModel="deepseek-chat" />);
    fireEvent.change(screen.getByPlaceholderText(/输入消息/), { target: { value: "" } });
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("should handle whitespace-only input", async () => {
    const mockOnSend = vi.fn();
    render(<ChatInput disabled={false} onSend={mockOnSend} selectedModel="deepseek-chat" />);
    fireEvent.change(screen.getByPlaceholderText(/输入消息/), { target: { value: "   " } });
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("should handle long text input", async () => {
    const mockOnSend = vi.fn();
    render(<ChatInput disabled={false} onSend={mockOnSend} selectedModel="deepseek-chat" />);
    const longText = "a".repeat(10000);
    fireEvent.change(screen.getByPlaceholderText(/输入消息/), { target: { value: longText } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(mockOnSend).toHaveBeenCalledWith(longText, "deepseek-chat");
  });
});
```

## 异常测试

```typescript
describe("ChatInput - Error Handling", () => {
  it("should show error message when API fails", async () => {
    server.use(
      rest.post("/api/chat", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Server error" }));
      })
    );

    render(<ChatInput disabled={false} onSend={vi.fn()} selectedModel="deepseek-chat" />);
    // ... 测试错误处理
  });
});
```

## 自测清单

完成功能开发后，按以下清单自测：

- [ ] **功能测试**：核心业务流程跑通
- [ ] **边界测试**：空数据、最大长度、特殊字符
- [ ] **异常测试**：网络错误、API 402/500 等错误处理
- [ ] **样式测试**：响应式布局、亮暗主题
- [ ] **交互测试**：加载状态、禁用状态、动画效果
