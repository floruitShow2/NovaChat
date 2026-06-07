'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  loading: boolean;
}

function SingleMessage({
  message,
  onCopy,
  copiedId,
}: {
  message: ChatMessage;
  onCopy: (content: string, id: string) => void;
  copiedId: string | null;
}) {
  if (message.role === 'user') {
    return (
      <div className='flex justify-end'>
        <div className='max-w-[70%]'>
          <div className='flex items-center gap-2 justify-end mb-1'>
            <span className='text-xs text-gray-500'>Me</span>
            <span className='text-xs text-gray-400'>{message.timestamp}</span>
          </div>
          <div className='bg-gray-50 rounded-2xl rounded-tr-sm px-4 py-3'>
            <p className='text-sm text-gray-800 leading-relaxed whitespace-pre-wrap'>
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-start'>
      <div className='max-w-[80%]'>
        <div className='flex items-center gap-2 mb-1'>
          <div className='w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center'>
            <Bot className='w-3 h-3 text-white' />
          </div>
          <span className='text-xs text-gray-700 font-medium'>NovaChat</span>
          <span className='text-xs text-gray-400'>{message.timestamp}</span>
        </div>
        <div className='text-sm text-gray-800 leading-relaxed whitespace-pre-wrap pl-7'>
          {message.content}
        </div>
        <div className='flex items-center gap-1 mt-2 pl-7 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button
            onClick={() => onCopy(message.content, message.id)}
            className='p-1 text-gray-400 hover:text-gray-600 transition-colors'
            title='复制'
          >
            {copiedId === message.id ? (
              <Check className='w-3.5 h-3.5 text-green-500' />
            ) : (
              <Copy className='w-3.5 h-3.5' />
            )}
          </button>
          <button className='p-1 text-gray-400 hover:text-gray-600 transition-colors'>
            <ThumbsUp className='w-3.5 h-3.5' />
          </button>
          <button className='p-1 text-gray-400 hover:text-gray-600 transition-colors'>
            <ThumbsDown className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatMessages({ messages, loading }: ChatMessagesProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  const scrollToTop = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior,
      });
    }
  }, []);

  const scrollToPrevUserMessage = useCallback(() => {
    const userMessages = messages
      .map((msg, index) => ({ ...msg, index }))
      .filter((msg) => msg.role === 'user');

    if (userMessages.length === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const currentScrollTop = container.scrollTop;

    let targetIndex = -1;
    for (let i = userMessages.length - 1; i >= 0; i--) {
      const msgRef = messageRefs.current.get(userMessages[i].id);
      if (msgRef) {
        const offsetTop = msgRef.offsetTop;
        if (offsetTop < currentScrollTop - 50) {
          targetIndex = i;
          break;
        }
      }
    }

    if (targetIndex >= 0) {
      const targetMsg = messageRefs.current.get(userMessages[targetIndex].id);
      if (targetMsg) {
        targetMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (userMessages.length > 0) {
      const firstMsg = messageRefs.current.get(userMessages[0].id);
      if (firstMsg) {
        firstMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [messages]);

  const scrollToNextUserMessage = useCallback(() => {
    const userMessages = messages
      .map((msg, index) => ({ ...msg, index }))
      .filter((msg) => msg.role === 'user');

    if (userMessages.length === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const currentScrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;

    let targetIndex = -1;
    for (let i = 0; i < userMessages.length; i++) {
      const msgRef = messageRefs.current.get(userMessages[i].id);
      if (msgRef) {
        const offsetTop = msgRef.offsetTop;
        if (offsetTop > currentScrollTop + clientHeight - 50) {
          targetIndex = i;
          break;
        }
      }
    }

    if (targetIndex >= 0) {
      const targetMsg = messageRefs.current.get(userMessages[targetIndex].id);
      if (targetMsg) {
        targetMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (userMessages.length > 0) {
      const lastMsg = messageRefs.current.get(userMessages[userMessages.length - 1].id);
      if (lastMsg) {
        lastMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 || loading) {
      const timer = setTimeout(() => {
        scrollToBottom('smooth');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages.length, loading, scrollToBottom]);

  const today = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  if (messages.length === 0) {
    return (
      <div className='flex-1 overflow-y-auto px-6 py-6'>
        <div className='flex flex-col items-center justify-center h-full text-gray-400'>
          <Bot className='w-12 h-12 mb-4 opacity-30' />
          <p className='text-sm'>开始一个新的对话</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 relative' ref={scrollContainerRef}>
      <div className='max-w-3xl mx-auto space-y-6'>
        <div className='flex justify-center'>
          <span className='text-xs text-gray-400 uppercase tracking-wider'>{today}</span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className='group'
            ref={(el) => {
              if (el) {
                messageRefs.current.set(msg.id, el);
              }
            }}
          >
            <SingleMessage message={msg} onCopy={handleCopy} copiedId={copiedId} />
          </div>
        ))}

        {loading && (
          <div className='flex justify-start'>
            <div className='max-w-[80%]'>
              <div className='flex items-center gap-2 mb-1'>
                <div className='w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center'>
                  <Bot className='w-3 h-3 text-white' />
                </div>
                <span className='text-xs text-gray-700 font-medium'>NovaChat</span>
              </div>
              <div className='pl-7 flex items-center gap-1'>
                <div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' />
                <div
                  className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className='fixed bottom-24 right-6 flex flex-col gap-2 z-50'>
          <button
            onClick={() => scrollToTop()}
            className='w-9 h-9 bg-gray-800/70 text-white rounded-full shadow-lg hover:bg-gray-700 hover:scale-110 transition-all duration-200 flex items-center justify-center backdrop-blur-sm'
            aria-label='滚动到顶部'
            title='滚动到顶部'
          >
            <ChevronsUp className='w-4 h-4' />
          </button>
          <button
            onClick={scrollToPrevUserMessage}
            className='w-9 h-9 bg-gray-800/70 text-white rounded-full shadow-lg hover:bg-gray-700 hover:scale-110 transition-all duration-200 flex items-center justify-center backdrop-blur-sm'
            aria-label='上一条用户消息'
            title='上一条用户消息'
          >
            <ChevronUp className='w-4 h-4' />
          </button>
          <button
            onClick={scrollToNextUserMessage}
            className='w-9 h-9 bg-gray-800/70 text-white rounded-full shadow-lg hover:bg-gray-700 hover:scale-110 transition-all duration-200 flex items-center justify-center backdrop-blur-sm'
            aria-label='下一条用户消息'
            title='下一条用户消息'
          >
            <ChevronDown className='w-4 h-4' />
          </button>
          <button
            onClick={() => {
              scrollToBottom();
            }}
            className='w-9 h-9 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200 flex items-center justify-center'
            aria-label='滚动到底部'
            title='滚动到底部'
          >
            <ChevronsDown className='w-4 h-4' />
          </button>
        </div>
      )}
    </div>
  );
}
