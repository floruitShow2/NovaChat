'use client';

import { useState } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatMessages, { ChatMessage } from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import { MODEL_OPTIONS } from '../data/modelOptions';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('deepseek-chat');

  const handleSend = async (message: string, _model: string) => {
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
      const response = await fetch('/api/chat/mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      });

      const assistantNow = new Date();
      const assistantTimeStr = `${assistantNow.getHours().toString().padStart(2, '0')}:${assistantNow.getMinutes().toString().padStart(2, '0')}`;

      const assistantMessageId = (Date.now() + 1).toString();

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let firstChunk = true;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          if (firstChunk) {
            setMessages((prev) => [
              ...prev,
              {
                id: assistantMessageId,
                role: 'assistant' as const,
                content: chunk,
                timestamp: assistantTimeStr,
              },
            ]);
            setLoading(false);
            firstChunk = false;
          } else {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg
              )
            );
          }
        }
      } else {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant' as const,
            content: data.response || '抱歉，我无法回答这个问题。',
            timestamp: assistantTimeStr,
          },
        ]);
        setLoading(false);
      }
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
