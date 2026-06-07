import { NextRequest, NextResponse } from 'next/server';

const MOCK_RESPONSES = [
  '您好！欢迎使用 NovaChat 模拟助手。我是一个专门用于测试流式响应效果的模拟 AI。下面我将展示一段较长的文本，以便您可以清晰地看到流式返回的效果。\n\n流式响应是一种先进的技术，它允许服务器在生成完整响应之前就开始向客户端发送数据。这种方式有很多优点：首先，用户可以更快地看到部分内容，不必等待整个响应完成；其次，对于处理大量数据或需要较长计算时间的请求，流式响应可以提供更好的用户体验；最后，它可以显著减少感知延迟，让用户感觉系统响应更快。\n\n在实际的 AI 对话系统中，流式响应尤为重要。当 AI 模型生成回答时，它通常是逐词或逐句生成的。通过流式传输，用户可以实时看到模型的思考过程，而不是等待整个回答生成完毕。这种交互方式更加自然，也更符合人类之间对话的习惯。\n\n除了提升用户体验外，流式响应还有助于降低服务器的内存压力。因为服务器不需要在内存中保存完整的响应，而是可以边生成边发送。这对于处理大量并发请求的系统来说尤为重要。\n\n现在您应该能够清楚地看到文本是如何逐字显示出来的。这种效果就是流式响应的魅力所在。如果您有任何问题或需要进一步的演示，请随时告诉我！',
  '这是另一个用于测试流式效果的长文本示例。在这个例子中，我们将探讨人工智能的发展历程。人工智能的概念最早可以追溯到20世纪50年代，当时计算机科学家开始探索让机器模拟人类智能的可能性。\n\n随着时间的推移，AI 技术经历了多次繁荣和衰退。在过去的几十年里，机器学习、深度学习和神经网络等技术取得了突破性进展。特别是近年来，大型语言模型的出现彻底改变了我们与计算机交互的方式。\n\n今天，AI 已经广泛应用于各个领域，从自动驾驶汽车到智能助手，从医疗诊断到金融分析。它正在深刻地改变着我们的生活和工作方式。\n\n通过流式响应，您可以实时看到这段文本的生成过程，就像在观看 AI 模型思考和写作一样。这种实时反馈大大增强了用户体验，让对话更加生动和自然。\n\n感谢您使用 NovaChat 模拟系统！希望这个演示能够帮助您更好地理解流式响应的工作原理和优势。',
];

function getRandomResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const responseText = getRandomResponse();
    const fullResponse = `您说: "${message}"\n\n模拟助手: ${responseText}`;

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
