import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';

const MODELS: Record<string, string> = {
  'deepseek-chat': 'deepseek-chat',
  'deepseek-reasoner': 'deepseek-reasoner',
  'deepseek-coder': 'deepseek-coder',
};

function getModel(modelName: string = 'deepseek-chat') {
  const model = MODELS[modelName] || 'deepseek-chat';
  return new ChatOpenAI({
    model,
    temperature: 0.7,
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
      baseURL: 'https://api.deepseek.com/v1',
    },
  });
}

const agents: Map<string, ReturnType<typeof createReactAgent>> = new Map();

async function getAgent(modelName: string = 'deepseek-chat') {
  if (!agents.has(modelName)) {
    const model = getModel(modelName);
    const checkpointer = new MemorySaver();
    const agent = createReactAgent({
      llm: model,
      tools: [],
      checkpointSaver: checkpointer,
    });
    agents.set(modelName, agent);
  }
  return agents.get(modelName)!;
}

export async function POST(request: NextRequest) {
  try {
    const { message, threadId, model } = await request.json();

    if (!message) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 });
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'DeepSeek API key 未设置' }, { status: 500 });
    }

    const agent = await getAgent(model);
    const thread_id = threadId || `thread-${Date.now()}`;

    const response = await agent.invoke(
      { messages: [{ role: 'user', content: message }] },
      { configurable: { thread_id } }
    );

    const lastMessage = response.messages[response.messages.length - 1];
    const content =
      typeof lastMessage.content === 'string'
        ? lastMessage.content
        : JSON.stringify(lastMessage.content);

    return NextResponse.json({ response: content, threadId: thread_id });
  } catch (error) {
    console.error('Chat error:', error);
    const message = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json({ error: `处理消息时发生错误: ${message}` }, { status: 500 });
  }
}
