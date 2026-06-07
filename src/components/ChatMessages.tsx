"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
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
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%]">
          <div className="flex items-center gap-2 justify-end mb-1">
            <span className="text-xs text-gray-500">Me</span>
            <span className="text-xs text-gray-400">{message.timestamp}</span>
          </div>
          <div className="bg-gray-50 rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[80%]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <Bot className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-gray-700 font-medium">NovaChat</span>
          <span className="text-xs text-gray-400">{message.timestamp}</span>
        </div>
        <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap pl-7">
          {message.content}
        </div>
        <div className="flex items-center gap-1 mt-2 pl-7 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy(message.content, message.id)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="复制"
          >
            {copiedId === message.id ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatMessages({ messages, loading }: ChatMessagesProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const today = new Date().toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <Bot className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm">开始一个新的对话</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-center">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {today}
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className="group">
            <SingleMessage
              message={msg}
              onCopy={handleCopy}
              copiedId={copiedId}
            />
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-700 font-medium">
                  NovaChat
                </span>
              </div>
              <div className="pl-7 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
