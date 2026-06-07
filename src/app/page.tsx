'use client';

import { useState } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatMessages, { ChatMessage } from '../components/ChatMessages';
import ChatInput, { ModelOption } from '../components/ChatInput';

export const MODEL_OPTIONS: ModelOption[] = [
  { value: 'deepseek-chat', label: 'DeepSeek Chat' },
  { value: 'deepseek-reasoner', label: 'DeepSeek Reasoner' },
  { value: 'deepseek-coder', label: 'DeepSeek Coder' },
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('deepseek-chat');

  const handleSend = async (message: string, model: string) => {
    if (!message.trim() || loading) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          threadId,
          model,
        }),
      });

      const data = await response.json();

      if (data.threadId) {
        setThreadId(data.threadId);
      }

      const assistantNow = new Date();
      const assistantTimeStr = `${assistantNow.getHours().toString().padStart(2, '0')}:${assistantNow.getMinutes().toString().padStart(2, '0')}`;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || '抱歉，我无法回答这个问题。',
        timestamp: assistantTimeStr,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorNow = new Date();
      const errorTimeStr = `${errorNow.getHours().toString().padStart(2, '0')}:${errorNow.getMinutes().toString().padStart(2, '0')}`;
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `处理消息时发生错误: ${(error as Error).message}`,
        timestamp: errorTimeStr,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-screen bg-white'>
      <ChatHeader title='NovaChat' />
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput
        onSend={handleSend}
        disabled={loading}
        selectedModel={selectedModel}
        modelOptions={MODEL_OPTIONS}
        onModelChange={setSelectedModel}
      />
    </div>
  );
}
