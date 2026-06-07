"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  ChevronDown,
  Bot,
  Check,
} from "lucide-react";

export interface ModelOption {
  value: string;
  label: string;
}

interface ChatInputProps {
  onSend: (message: string, model: string) => void;
  disabled: boolean;
  selectedModel: string;
  modelOptions: ModelOption[];
  onModelChange: (model: string) => void;
}

export default function ChatInput({
  onSend,
  disabled,
  selectedModel,
  modelOptions,
  onModelChange,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (!inputValue.trim() || disabled) return;
    onSend(inputValue.trim(), selectedModel);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const currentModelLabel =
    modelOptions.find((m) => m.value === selectedModel)?.label || "DeepSeek Chat";

  return (
    <div className="border-t border-gray-100 px-6 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-200 transition-all">
          <div className="px-4 pt-3 flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
              <Smile className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              <span>Data</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            rows={1}
            className="w-full px-4 py-2 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none"
            style={{ minHeight: "24px", maxHeight: "120px" }}
          />
          <div className="px-3 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Bot className="w-3 h-3" />
                  <span>{currentModelLabel}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {dropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px] z-10">
                    {modelOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onModelChange(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors ${
                          selectedModel === option.value
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        <span>{option.label}</span>
                        {selectedModel === option.value && (
                          <Check className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                disabled
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 border border-gray-100 rounded-md cursor-not-allowed"
                title="Tone 功能暂不可用"
              >
                <span>Tone</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Send</span>
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          AI 可能会产生不准确的信息，请核实重要信息。
        </p>
      </div>
    </div>
  );
}
