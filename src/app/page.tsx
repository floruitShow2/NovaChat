"use client";

import { useState } from "react";
import { XProvider, Bubble, Sender } from "@ant-design/x";
import { Card, Typography, Avatar, Spin } from "antd";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是你的 AI 助手。有什么我可以帮助你的吗？",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue.trim() }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "抱歉，我无法回答这个问题。",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，发生了错误，请稍后再试。",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <XProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card
          className="h-screen !rounded-none !border-0"
          styles={{
            body: {
              height: "100%",
              padding: 0,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <div className="bg-white shadow-sm p-4 flex items-center justify-center">
            <Title level={4} className="!mb-0">
              AI Agent 对话
            </Title>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-3`}
              >
                {msg.role === "assistant" && (
                  <Avatar icon={<RobotOutlined />} className="bg-blue-500" />
                )}
                <Bubble
                  content={msg.content}
                  className={
                    msg.role === "user" ? "!bg-blue-500 !text-white" : ""
                  }
                  style={
                    msg.role === "user"
                      ? { backgroundColor: "#1677ff", color: "#fff" }
                      : {}
                  }
                />
                {msg.role === "user" && (
                  <Avatar icon={<UserOutlined />} className="bg-green-500" />
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-start gap-3">
                <Avatar icon={<RobotOutlined />} className="bg-blue-500" />
                <Bubble content={<Spin size="small" />} />
              </div>
            )}
          </div>

          <div className="bg-white border-t p-4">
            <Sender
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSend}
              disabled={loading}
              placeholder="输入消息..."
              className="shadow-sm"
            />
          </div>
        </Card>
      </div>
    </XProvider>
  );
}
