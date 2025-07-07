"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { Bot, Send, Sparkles, Brain, Clock, History, Bookmark, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  category?: "wellness" | "productivity" | "mental" | "physical";
}

interface QuickPrompt {
  text: string;
  icon: React.ElementType;
  category: "wellness" | "productivity" | "mental" | "physical";
  color: string;
}

export default function AIAssistantPage() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([
    "How can I improve my focus?",
    "What's my stress level trend?",
    "Suggest a quick exercise break",
  ]);

  const quickPrompts: QuickPrompt[] = [
    {
      text: "How's my wellness today?",
      icon: Sparkles,
      category: "wellness",
      color: "emerald",
    },
    {
      text: "Suggest focus techniques",
      icon: Brain,
      category: "mental",
      color: "purple",
    },
    {
      text: "When's my next break?",
      icon: Clock,
      category: "productivity",
      color: "blue",
    },
    {
      text: "Physical exercise tips",
      icon: History,
      category: "physical",
      color: "rose",
    },
  ];

  // Initialize messages after component mount
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your wellness AI assistant. I can help you with wellness tracking, productivity tips, and health insights. How can I assist you today?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(input),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (input: string): string => {
    // Simple response generation based on keywords
    const lowercaseInput = input.toLowerCase();
    if (lowercaseInput.includes("wellness") || lowercaseInput.includes("health")) {
      return "Based on your recent metrics, your overall wellness score is good. Your stress levels are lower than last week, and your sleep quality has improved. Would you like specific insights about any aspect of your wellness?";
    } else if (lowercaseInput.includes("focus") || lowercaseInput.includes("productivity")) {
      return "Your peak focus hours are typically between 9 AM and 11 AM. I recommend using the Pomodoro technique during these hours. Would you like me to set up focus time blocks for you?";
    } else if (lowercaseInput.includes("break") || lowercaseInput.includes("rest")) {
      return "According to your work pattern, you're due for a break in 25 minutes. I suggest a 5-minute stretching session or a short walk. Would you like some guided break exercises?";
    } else if (lowercaseInput.includes("exercise") || lowercaseInput.includes("physical")) {
      return "Based on your activity levels today, I recommend a 10-minute desk workout. This can include shoulder rolls, desk push-ups, and chair squats. Would you like a detailed exercise plan?";
    }
    return "I understand you're interested in improving your wellness. Could you please specify which aspect you'd like to focus on: physical health, mental wellness, productivity, or stress management?";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: QuickPrompt) => {
    setInput(prompt.text);
    setSelectedCategory(prompt.category);
  };

  const handleSavePrompt = (prompt: string) => {
    if (!savedPrompts.includes(prompt)) {
      setSavedPrompts([...savedPrompts, prompt]);
    }
  };

  const handleRemoveSavedPrompt = (promptToRemove: string) => {
    setSavedPrompts(savedPrompts.filter(prompt => prompt !== promptToRemove));
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-6rem)]">
        {/* Sidebar */}
        <div className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 p-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Quick Prompts</h3>
            <div className="space-y-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handlePromptClick(prompt)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === prompt.category
                      ? `bg-${prompt.color}-500/20 text-${prompt.color}-500`
                      : "text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <prompt.icon className="w-4 h-4" />
                  <span className="text-sm truncate">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Saved Prompts</h3>
            <div className="space-y-2">
              {savedPrompts.map((prompt) => (
                <div
                  key={prompt}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <Bookmark className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-300 truncate flex-1">{prompt}</span>
                  <button
                    onClick={() => handleRemoveSavedPrompt(prompt)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Wellness Assistant</h2>
                <p className="text-sm text-gray-400">Helping you stay healthy and productive</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-white/5 text-gray-300"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-60">{message.timestamp}</span>
                    {message.sender === "user" && (
                      <button
                        onClick={() => handleSavePrompt(message.text)}
                        className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400">
                <Bot className="w-4 h-4 animate-pulse" />
                <span className="text-sm">AI is typing...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 text-white placeholder-gray-400 rounded-lg p-3 min-h-[2.5rem] max-h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 