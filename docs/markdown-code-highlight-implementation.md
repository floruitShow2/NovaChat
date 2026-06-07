# Markdown 代码块高亮与复制功能实现方案

## 一、问题描述

在前端应用中，如何处理 Markdown 中的代码块高亮，并支持代码的一键复制功能？具体需求包括：

1. **代码高亮**：对 Markdown 中的代码块进行语法高亮显示
2. **一键复制**：用户可以一键复制代码块内容到剪贴板
3. **多语言支持**：支持多种编程语言的语法高亮

---

## 二、解题思路

### 2.1 技术选型分析

| 功能需求      | 推荐方案                        | 备选方案            | 选型理由                      |
| ------------- | ------------------------------- | ------------------- | ----------------------------- |
| Markdown 解析 | react-markdown                  | marked, markdown-it | 支持插件系统，易于扩展        |
| GFM 支持      | remark-gfm                      | 内置                | GitHub Flavored Markdown 支持 |
| 代码高亮      | rehype-highlight + highlight.js | Prism.js            | 配置简单，语言支持丰富        |
| 复制功能      | navigator.clipboard API         | Clipboard.js        | 原生API，无需额外依赖         |

### 2.2 核心技术栈

```
┌─────────────────────────────────────────────────────────────┐
│                    Markdown 渲染流程                        │
├─────────────────────────────────────────────────────────────┤
│  输入 Markdown 文本                                          │
│         ↓                                                  │
│  react-markdown (解析 Markdown)                              │
│         ↓                                                  │
│  remark-gfm (支持 GFM 语法)                                  │
│         ↓                                                  │
│  rehype-highlight (代码高亮处理)                              │
│         ↓                                                  │
│  highlight.js (语法高亮渲染)                                  │
│         ↓                                                  │
│  自定义组件 (复制按钮 + 样式)                                  │
│         ↓                                                  │
│  输出渲染后的 HTML                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、实现方案

### 3.1 依赖安装

```bash
npm install react-markdown remark-gfm rehype-highlight highlight.js @types/highlight.js
```

**依赖说明**：

| 依赖包           | 版本    | 功能说明                      |
| ---------------- | ------- | ----------------------------- |
| react-markdown   | ^9.0.1  | Markdown 解析核心库           |
| remark-gfm       | ^4.0.0  | GitHub Flavored Markdown 支持 |
| rehype-highlight | ^7.0.0  | 代码块高亮插件                |
| highlight.js     | ^11.9.0 | 语法高亮引擎                  |

### 3.2 核心组件实现

#### 3.2.1 MarkdownRenderer 组件

```typescript
// src/components/MarkdownRenderer.tsx
import { useState, useMemo, Children, isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';
```

**组件功能**：

- 使用 `react-markdown` 解析 Markdown 文本
- 通过 `remark-gfm` 支持表格、任务列表等 GFM 特性
- 通过 `rehype-highlight` 自动为代码块添加语法高亮
- 自定义 `pre` 组件实现代码块包装和复制功能

#### 3.2.2 代码块处理逻辑

**关键要点**：`rehype-highlight` 会将语言类名（如 `language-javascript`）添加到 `<code>` 标签上，而非 `<pre>` 标签。因此需要从 `pre` 的子元素中提取语言信息。

```typescript
interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // 从 className 中提取语言名称
  const language = className?.replace('language-', '') || 'text';

  // 正确提取代码文本内容（处理 React 元素对象）
  const codeText = useMemo(() => {
    let text = '';
    Children.forEach(children, (child) => {
      if (typeof child === 'string') {
        text += child;
      } else if (isValidElement(child) && typeof child.props?.children === 'string') {
        text += child.props.children;
      }
    });
    return text;
  }, [children]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3">
      <div className="flex items-center justify-between mb-2 px-4">
        <span className="text-xs font-medium text-gray-500 tracking-wide">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-500" />
              <span className="text-green-500">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-900 rounded-lg overflow-x-auto p-4">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
```

#### 3.2.3 pre 组件配置

```typescript
pre({ children }) {
  // 从 pre 的子元素中找到 code 标签，获取语言类名
  const codeChild = Children.toArray(children).find(
    (child) => isValidElement(child) && (child as React.ReactElement).type === 'code'
  ) as React.ReactElement<{ className?: string }> | undefined;

  const codeClassName = codeChild?.props?.className;

  return <CodeBlock className={codeClassName}>{children}</CodeBlock>;
},
```

### 3.3 样式配置

```css
/* src/app/globals.css */
@import 'highlight.js/styles/github-dark.css';

.prose pre {
  margin: 0;
  padding: 1rem;
}

.prose code {
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
}

.prose pre code {
  font-size: 0.875rem;
  line-height: 1.6;
}

/* 代码块滚动条样式 */
.prose pre::-webkit-scrollbar {
  height: 8px;
}

.prose pre::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.prose pre::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}
```

### 3.4 Mock 接口改造

修改 mock 接口返回包含代码块的 Markdown 格式文本：

```typescript
// src/app/api/chat/mock/route.ts
const MOCK_RESPONSES = [
  `## JavaScript 示例

\`\`\`javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

## Python 示例

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
\`\`\``,
  // ... 更多响应
];
```

---

## 四、不同编程语言的语法支持

### 4.1 highlight.js 语言支持

highlight.js 支持 **190+ 种编程语言**，常用语言包括：

| 语言类别 | 支持语言                                                      |
| -------- | ------------------------------------------------------------- |
| 前端     | JavaScript, TypeScript, JSX, TSX, HTML, CSS, SCSS, Vue, React |
| 后端     | Python, Java, Go, Node.js, Ruby, PHP, C#, C++, Rust, Go       |
| 数据库   | SQL, PostgreSQL, MySQL, MongoDB                               |
| 配置文件 | JSON, YAML, XML, TOML                                         |
| 其他     | Markdown, Shell, Dockerfile, GraphQL                          |

### 4.2 语言标识规范

Markdown 代码块的语言标识需符合 highlight.js 规范：

````markdown
```javascript
// JavaScript 代码
```

```python
# Python 代码
```

```typescript
// TypeScript 代码
```

```sql
-- SQL 查询
```

```go
// Go 代码
```

```jsx
// JSX 组件
```
````

### 4.3 自定义语言支持

如需支持非常用语言，可手动注册：

```typescript
import hljs from 'highlight.js/lib/core';
import customLang from 'highlight.js/lib/languages/custom';

hljs.registerLanguage('custom', customLang);
```

---

## 五、架构设计

### 5.1 组件结构

```
ChatMessages (消息容器)
    └── SingleMessage (单条消息)
            └── MarkdownRenderer (Markdown渲染)
                    └── CodeBlock (代码块处理)
                            ├── 语言标签显示
                            ├── 复制按钮
                            └── highlight.js 高亮
```

### 5.2 数据流

```
用户消息 → mock接口 → Markdown文本 → react-markdown解析 → rehype-highlight处理 → 代码高亮输出
                                                                                    ↓
                                                                           用户点击复制 → Clipboard API → 复制成功提示
```

### 5.3 关键设计要点

| 设计点       | 实现方式                                                    |
| ------------ | ----------------------------------------------------------- |
| 语言类名提取 | 从 `pre` 的 `code` 子元素中获取 `className` 属性            |
| 代码文本提取 | 使用 `Children.forEach` 遍历子元素，正确处理 React 元素对象 |
| 复制状态反馈 | 通过 `useState` 管理复制状态，2秒后自动重置                 |
| 悬停交互     | 使用 Tailwind 的 `group` 和 `group-hover` 实现复制按钮显隐  |
| 响应式设计   | 代码块支持横向滚动，适应移动端                              |
| 流式响应兼容 | 使用 `react-markdown` 支持增量渲染                          |

---

## 六、测试验证

### 6.1 功能测试清单

| 测试项        | 预期结果                                               |
| ------------- | ------------------------------------------------------ |
| Markdown 渲染 | 标题、列表、引用、表格等正确渲染                       |
| 代码高亮      | 不同语言代码正确着色                                   |
| 语言标签      | 正确显示代码块的编程语言名称                           |
| 复制功能      | 点击复制按钮后代码正确复制到剪贴板                     |
| 复制状态      | 复制后显示"已复制"提示，2秒后恢复                      |
| 流式响应      | 代码块在流式返回过程中正确逐步渲染                     |
| 多语言支持    | JavaScript、Python、TypeScript、Go、SQL 等语言正常高亮 |

### 6.2 测试用例

```markdown
## 测试用例

### 代码高亮测试

\`\`\`javascript
console.log('Hello World');
\`\`\`

\`\`\`python
def hello():
print("Hello Python")
\`\`\`

\`\`\`sql
SELECT \* FROM users WHERE id = 1;
\`\`\`

### 行内代码

`npm install react-markdown`

### 表格测试

| 语言       | 类型 | 状态 |
| ---------- | ---- | ---- |
| JavaScript | 前端 | 支持 |
| Python     | 后端 | 支持 |
```

---

## 七、性能优化建议

### 7.1 按需加载语言包

highlight.js 默认包含所有语言，可按需加载以减小打包体积：

```typescript
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('typescript', typescript);
```

### 7.2 服务端渲染优化

对于 Next.js 应用，可使用 `rehype-highlight` 在服务端完成代码高亮，减少客户端计算压力。

### 7.3 缓存策略

对相同代码块的高亮结果进行缓存，避免重复计算。

---

## 八、常见问题与解决方案

### 8.1 语言标签显示为 "text"

**问题**：代码块的语言标签始终显示为 "text"，无法正确识别编程语言。

**原因**：`rehype-highlight` 将语言类名添加到 `<code>` 标签而非 `<pre>` 标签。

**解决方案**：从 `pre` 的子元素中找到 `code` 标签，获取其 `className` 属性。

```typescript
const codeChild = Children.toArray(children).find(
  (child) => isValidElement(child) && (child as React.ReactElement).type === 'code'
);
const codeClassName = codeChild?.props?.className;
```

### 8.2 复制功能返回 "[Object Object]"

**问题**：复制功能复制的内容是 "[Object Object]" 而非实际代码。

**原因**：直接使用 `String(children)` 将 React 元素对象转换为字符串。

**解决方案**：使用 `Children.forEach` 遍历子元素，正确提取文本内容。

```typescript
const codeText = useMemo(() => {
  let text = '';
  Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      text += child;
    } else if (isValidElement(child) && typeof child.props?.children === 'string') {
      text += child.props.children;
    }
  });
  return text;
}, [children]);
```

---

## 九、总结

| 维度         | 实现情况                          |
| ------------ | --------------------------------- |
| 代码高亮     | ✅ 使用 highlight.js 实现         |
| 语言标签     | ✅ 正确显示编程语言名称           |
| 一键复制     | ✅ 使用 Clipboard API 实现        |
| 多语言支持   | ✅ 支持 190+ 种编程语言           |
| 流式响应兼容 | ✅ react-markdown 支持增量渲染    |
| 样式美观     | ✅ 使用 github-dark 主题          |
| 交互体验     | ✅ 悬停显示复制按钮，复制成功提示 |

**核心实现路径**：

1. 安装依赖 → 2. 创建 MarkdownRenderer 组件 → 3. 自定义 pre 组件提取语言信息 → 4. 实现 CodeBlock 组件处理复制 → 5. 配置样式 → 6. 修改 mock 接口返回 Markdown 格式文本
