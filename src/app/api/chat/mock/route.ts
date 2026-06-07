import { NextRequest, NextResponse } from 'next/server';

const MOCK_RESPONSES = [
  `您好！欢迎使用 NovaChat 模拟助手。我是一个专门用于测试流式响应效果的模拟 AI。

## 什么是流式响应？

流式响应是一种先进的技术，它允许服务器在生成完整响应之前就开始向客户端发送数据。

### 主要优点

1. **更快的响应**：用户可以更快地看到部分内容
2. **更好的体验**：实时看到模型的思考过程
3. **更低的内存压力**：服务器边生成边发送

## 代码示例

以下是一个 JavaScript 中的异步函数示例：

\`\`\`javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
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

# 使用示例
unsorted = [3, 6, 8, 10, 1, 2, 1]
sorted_arr = quicksort(unsorted)
print(sorted_arr)
\`\`\`

## TypeScript 示例

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(\`/api/users/\${userId}\`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}
\`\`\``,
  `这是另一个用于测试 Markdown 渲染效果的示例。

## 代码高亮测试

### 前端框架对比

#### React 组件

\`\`\`jsx
import { useState, useEffect } from 'react';

interface CounterProps {
  initialValue?: number;
}

export default function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(c => c - 1)}>
        Decrement
      </button>
    </div>
  );
}
\`\`\`

#### Go 语言示例

\`\`\`go
package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello World!")
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
\`\`\`

### 数据库查询

\`\`\`sql
SELECT 
    users.id,
    users.name,
    COUNT(orders.id) as order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.created_at > '2024-01-01'
GROUP BY users.id, users.name
HAVING COUNT(orders.id) > 5
ORDER BY order_count DESC
LIMIT 10;
\`\`\`

---

> **提示**：代码块支持一键复制功能，点击代码块右上角的复制按钮即可复制代码。
`,
];

function getRandomResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

export async function POST(request: NextRequest) {
  try {
    await request.json();

    const responseText = getRandomResponse();
    const fullResponse = responseText;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for (const char of fullResponse) {
          controller.enqueue(encoder.encode(char));
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch {
    return NextResponse.json({ error: '模拟接口出错' }, { status: 500 });
  }
}
