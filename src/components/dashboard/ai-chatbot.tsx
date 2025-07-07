"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  AlertCircle,
  TrendingUp,
  Clock,
  Check,
  Activity,
  Bell,
  X,
  Send,
  User,
  Brain,
  Heart,
  Coffee,
  Zap,
  Calendar,
  Smile,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { sendChatbotMessage, getStoredToken, getStoredUser, isUserAuthenticated } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'success';
  isRead: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface QuickSuggestion {
  text: string;
  icon: React.ComponentType<any>;
  color: string;
}

const quickSuggestions = [
  {
    text: "How am I doing?",
    icon: Activity,
    color: "bg-blue-500/20 text-blue-500"
  },
  {
    text: "Stress tips",
    icon: Brain,
    color: "bg-purple-500/20 text-purple-500"
  },
  {
    text: "Quick break",
    icon: Clock,
    color: "bg-green-500/20 text-green-500"
  },
  {
    text: "Focus mode",
    icon: Zap,
    color: "bg-orange-500/20 text-orange-500"
  },
  {
    text: "Breathing exercises",
    icon: Heart,
    color: "bg-red-500/20 text-red-500"
  },
  {
    text: "Healthy snacks",
    icon: Coffee,
    color: "bg-yellow-500/20 text-yellow-500"
  },
  {
    text: "Posture tips",
    icon: Activity,
    color: "bg-cyan-500/20 text-cyan-500"
  },
  {
    text: "Energy boost",
    icon: Smile,
    color: "bg-pink-500/20 text-pink-500"
  }
];

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const initialMessage: Message = {
  id: generateId(),
  text: "Hello! 👋 I'm your AI wellness assistant. I can help you with:\n\n• Health insights and trends\n• Stress management tips\n• Focus and productivity advice\n• Break time reminders\n• Nutrition and exercise guidance\n• Sleep improvement strategies\n\nHow can I assist you today?",
  sender: 'bot',
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
};

const NOTIFICATION_INTERVALS = {
  BREAK_REMINDER: 30 * 60 * 1000, // 30 minutes
  WELLNESS_CHECK: 2 * 60 * 60 * 1000, // 2 hours
  WATER_REMINDER: 45 * 60 * 1000, // 45 minutes
  POSTURE_CHECK: 60 * 60 * 1000, // 1 hour
};

const NOTIFICATION_TYPES = {
  BREAK: {
    title: 'Time for a Break',
    descriptions: [
      'Take a short break to stretch and move around',
      'Stand up and take a quick walk',
      'Rest your eyes for a few minutes',
    ]
  },
  WELLNESS: {
    title: 'Wellness Check',
    descriptions: [
      'Time for your wellness assessment',
      'How are you feeling right now?',
      'Check in with your stress levels',
    ]
  },
  WATER: {
    title: 'Hydration Reminder',
    descriptions: [
      'Remember to stay hydrated',
      'Time to drink some water',
      'Take a water break',
    ]
  },
  POSTURE: {
    title: 'Posture Check',
    descriptions: [
      'Check your sitting posture',
      'Adjust your screen height if needed',
      'Relax your shoulders',
    ]
  },
};

export function AIChatbot() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages after component mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: generateId(),
        text: "Hello! I'm your AI wellness assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setIsClient(true);
    // Initialize notifications
    setNotifications([
      {
        id: generateId(),
        title: 'Wellness Check',
        description: 'Time for your daily wellness assessment',
        timestamp: new Date(),
        type: 'info',
        isRead: false
      },
      {
        id: generateId(),
        title: 'Break Reminder',
        description: 'Take a short break to stretch and move around',
        timestamp: new Date(),
        type: 'warning',
        isRead: false
      }
    ]);
    setShowNotificationBadge(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check and request notification permissions on mount
  useEffect(() => {
    if (!isClient) return; // Only run on client-side

    const checkNotificationPermission = async () => {
      try {
        if (!("Notification" in window)) {
          console.error("This browser does not support desktop notifications");
          return;
        }

        if (Notification.permission !== "granted") {
          const permission = await Notification.requestPermission();
          console.log("Notification permission status:", permission);
        }
      } catch (error) {
        console.error("Error checking notification permission:", error);
      }
    };

    checkNotificationPermission();

    // Set up notification intervals
    const intervals = Object.entries(NOTIFICATION_INTERVALS).map(([key, interval]) => {
      return setInterval(() => {
        const notificationType = NOTIFICATION_TYPES[key as keyof typeof NOTIFICATION_TYPES];
        const randomDescription = notificationType.descriptions[
          Math.floor(Math.random() * notificationType.descriptions.length)
        ];
        
        addNotification({
          title: notificationType.title,
          description: randomDescription,
          type: key === 'BREAK' ? 'warning' : 'info'
        });
      }, interval);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [isClient]);

  const showSystemNotification = async (title: string, body: string) => {
    if (!isClient) return;

    try {
      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          body,
          icon: "/logo.png",
          badge: "/logo.png",
          tag: "wellness-notification",
          requireInteraction: false,
          silent: false,
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    } catch (error) {
      console.error("Error showing system notification:", error);
    }
  };

  // Handle page visibility changes to manage notifications
  useEffect(() => {
    if (!isClient) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Store the time when the page becomes hidden
        localStorage.setItem('pageHiddenTime', Date.now().toString());
      } else {
        // Check if we need to send missed notifications
        const hiddenTime = localStorage.getItem('pageHiddenTime');
        if (hiddenTime) {
          const timeAway = Date.now() - parseInt(hiddenTime);
          
          // If away for more than 1 hour, send a wellness check
          if (timeAway > 60 * 60 * 1000) {
            addNotification({
              title: 'Welcome Back!',
              description: 'Hope you had a good break. How are you feeling?',
              type: 'info'
            });
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isClient]);

  const addNotification = async ({ title, description, type }: { title: string; description: string; type: 'info' | 'warning' | 'success' }) => {
    const newNotification: Notification = {
      id: generateId(),
      title,
      description,
      timestamp: new Date(),
      type,
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    setShowNotificationBadge(true);

    // Show system notification if on client side
    if (isClient) {
      await showSystemNotification(title, description);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      console.error('User not authenticated for chatbot API');
      setApiError('Authentication required. Please log in again.');
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsTyping(true);
    setApiError(null);

    try {
      console.log('Sending message to CamVitals chatbot API:', userInput);
      
      // Call the CamVitals chatbot API
      const response = await sendChatbotMessage(userInput, {
        timestamp: new Date().toISOString(),
        source: 'dashboard_chat'
      });

      console.log('Chatbot API response received:', response);

      // Extract the bot's response from the API
      let botResponseText = '';
      if (response && response.data && response.data.response) {
        botResponseText = response.data.response;
      } else if (response && response.response) {
        botResponseText = response.response;
      } else if (response && response.message) {
        botResponseText = response.message;
      } else if (typeof response === 'string') {
        botResponseText = response;
      } else {
        console.warn('Unexpected API response format:', response);
        botResponseText = "I received your message, but I'm having trouble processing it right now. Please try again.";
      }

      const botMessage: Message = {
        id: generateId(),
        text: botResponseText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages(prev => [...prev, botMessage]);

      // Add notification for important responses
      if (botResponseText.toLowerCase().includes('stress') || 
          botResponseText.toLowerCase().includes('break') || 
          botResponseText.toLowerCase().includes('wellness')) {
        addNotification({
          title: 'New Wellness Insight',
          description: 'Check out your latest wellness recommendations',
          type: 'info'
        });
      }

    } catch (error) {
      console.error('Chatbot API error:', error);
      
      // Show error message to user
      const errorMessage: Message = {
        id: generateId(),
        text: "I'm sorry, I'm having trouble connecting to my services right now. Please try again in a moment. If the problem persists, you can contact support.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages(prev => [...prev, errorMessage]);
      setApiError(error instanceof Error ? error.message : 'Failed to get response from AI assistant');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    const inputEvent = new Event("input", { bubbles: true });
    document.querySelector<HTMLTextAreaElement>(".chat-input")?.dispatchEvent(inputEvent);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    // Check if all notifications are read
    const allRead = notifications.every(notification => notification.isRead);
    if (allRead) {
      setShowNotificationBadge(false);
    }
  };

  // Don't render until after mount to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">AI Wellness Assistant</h2>
        <div className="flex items-center gap-4">
          {isClient && ( // Only render notification bell on client-side
            <div className="relative">
              <Bell 
                className={`w-5 h-5 ${showNotificationBadge ? 'text-primary animate-pulse' : 'text-gray-400'}`}
              />
              {showNotificationBadge && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isUserAuthenticated() ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm ${
              isUserAuthenticated() ? 'text-green-500' : 'text-red-500'
            }`}>
              {isUserAuthenticated() ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* API Error Display */}
      {apiError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="text-white font-medium">Connection Issue</h3>
              <p className="text-gray-400 text-sm">{apiError}</p>
            </div>
            <button 
              onClick={() => setApiError(null)}
              className="ml-auto text-red-500 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Panel */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-sm font-medium text-white mb-4">Recent Notifications</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {isClient && notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl transition-colors ${
                  notification.isRead ? 'bg-white/5' : 'bg-white/10'
                } hover:bg-white/15 cursor-pointer group`}
                onClick={() => markNotificationAsRead(notification.id)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-white">{notification.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {notification.timestamp.toLocaleTimeString()}
                        </span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                          notification.isRead 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-white/5 text-gray-400 group-hover:bg-white/10'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{notification.description}</p>
                    {!notification.isRead && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        New
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!isClient || notifications.length === 0) && (
              <div className="text-center text-gray-400 py-4">
                No new notifications
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl flex flex-col h-[calc(100vh-13rem)] min-h-[600px]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-primary'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <span className="text-xs opacity-50 mt-1 block">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 text-primary flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white/10 text-white rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>

          <div className="p-4 border-t border-white/10">
            {/* Quick Suggestions */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2">
                {quickSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg ${suggestion.color} transition-all duration-200 hover:scale-105 border border-white/5`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">
                        {suggestion.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isUserAuthenticated() 
                    ? "Type your message..." 
                    : "Please log in to chat with the AI assistant"
                }
                disabled={!isUserAuthenticated()}
                className="chat-input flex-1 bg-white/5 text-white placeholder-gray-400 rounded-lg p-3 min-h-[2.5rem] max-h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !isUserAuthenticated()}
                className="p-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 