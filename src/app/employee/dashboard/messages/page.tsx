"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { Search, Bell, Mail, Star, Archive, Trash2, Send, Filter, MoreVertical, X, Reply, ChevronLeft } from "lucide-react";
import { useUser } from "@/lib/context/user-context";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  content: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
}

export default function MessagesPage() {
  const { userEmail } = useUser();
  const [selectedFilter, setSelectedFilter] = useState<string>("inbox");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  // Sample messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Dr. Sarah Johnson",
      subject: "Your Latest Health Report",
      preview: "I've reviewed your recent vitals data and everything looks good. Your heart rate variability has improved significantly...",
      content: `Dear John,

I've reviewed your recent vitals data and I'm pleased to inform you that everything looks good. Your heart rate variability has improved significantly over the past month, which indicates better stress management and recovery.

Key findings:
- Heart Rate Variability: 85ms (↑20% from last month)
- Resting Heart Rate: 65 bpm (optimal range)
- Stress Levels: Consistently low
- Sleep Quality: Improved by 15%

Keep up with your current wellness routine, it's clearly working well for you. I'd recommend continuing with your morning meditation sessions as they seem to have a positive impact on your daily stress levels.

Best regards,
Dr. Sarah Johnson`,
      timestamp: "10:30 AM",
      read: false,
      starred: true,
    },
    {
      id: "2",
      sender: "Wellness Team",
      subject: "New Breathing Exercise Available",
      preview: "We've added a new guided breathing exercise to help reduce stress levels. Try it out and let us know what you think...",
      content: `Hi John,

We're excited to introduce a new guided breathing exercise designed specifically for stress reduction during work hours. This new exercise, called "Quick Calm", can be completed in just 3 minutes and is perfect for busy schedules.

Features:
- 3-minute duration
- Scientifically optimized breathing pattern
- Calming background sounds
- Progress tracking
- Stress reduction metrics

You can find this new exercise in your wellness dashboard under the "Breathing Exercises" section. Give it a try and let us know your thoughts!

Best regards,
The Wellness Team`,
      timestamp: "Yesterday",
      read: true,
      starred: false,
    },
    {
      id: "3",
      sender: "System Notification",
      subject: "Weekly Wellness Summary",
      preview: "Your weekly wellness report is now available. Click here to view your progress and insights from the past week...",
      content: `Weekly Wellness Summary
Period: Aug 14 - Aug 20

Overall Wellness Score: 85/100 (↑5 points)

Highlights:
1. Physical Activity
   - Daily steps goal achieved: 6/7 days
   - Active minutes: 280 (target: 250)

2. Mental Wellness
   - Stress level: Low
   - Focus score: 82/100
   - Meditation sessions: 5

3. Sleep Quality
   - Average sleep duration: 7.5 hours
   - Sleep quality score: 88/100

4. Recommendations
   - Consider adding an evening walk to your routine
   - Try the new breathing exercises
   - Maintain your consistent sleep schedule

View detailed report in your dashboard.`,
      timestamp: "2 days ago",
      read: true,
      starred: true,
    },
    {
      id: "4",
      sender: "HR Department",
      subject: "Wellness Program Update",
      preview: "We're excited to announce new features in our wellness program. Starting next month, you'll have access to...",
      content: `Dear Team Member,

We're thrilled to announce several exciting updates to our corporate wellness program. Starting next month, you'll have access to:

1. Virtual Fitness Classes
   - Live yoga sessions
   - HIIT workouts
   - Mindfulness meditation

2. Enhanced Health Tracking
   - New wearable device integration
   - Improved analytics dashboard
   - Personalized health insights

3. Wellness Rewards Program
   - Points for healthy activities
   - Monthly wellness challenges
   - Redemption for health-related products

Stay tuned for more details in our upcoming wellness workshop.

Best regards,
HR Department`,
      timestamp: "3 days ago",
      read: true,
      starred: false,
    },
    {
      id: "5",
      sender: "AI Health Assistant",
      subject: "Personalized Health Tips",
      preview: "Based on your recent activity patterns, here are some personalized recommendations to improve your wellness...",
      content: `Hi John,

Based on your recent activity patterns, I've generated some personalized recommendations:

1. Peak Performance Times
   - Your focus is highest between 9 AM and 11 AM
   - Schedule important tasks during these hours
   - Take short breaks every 90 minutes

2. Stress Management
   - Your stress levels peak around 2 PM
   - Recommended: 5-minute breathing exercise after lunch
   - Consider a short walk during this time

3. Sleep Optimization
   - Optimal bedtime: 10:30 PM
   - Reduce screen time after 9 PM
   - Maintain room temperature at 68°F

Let me know if you'd like more detailed insights on any of these areas.

Best regards,
Your AI Health Assistant`,
      timestamp: "4 days ago",
      read: true,
      starred: false,
    },
  ]);

  const filters = [
    { id: "inbox", label: "Inbox", icon: Mail },
    { id: "starred", label: "Starred", icon: Star },
    { id: "archived", label: "Archived", icon: Archive },
    { id: "sent", label: "Sent", icon: Send },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  const toggleStar = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const handleMessageClick = (message: Message) => {
    markAsRead(message.id);
    setSelectedMessage(message);
    setShowReplyBox(false);
  };

  const handleReply = () => {
    if (!replyContent.trim()) return;
    
    // Here you would typically send the reply to your backend
    console.log(`Replying to ${selectedMessage?.sender}:`, replyContent);
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Clear reply box and hide it
    setReplyContent("");
    setShowReplyBox(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (selectedFilter) {
      case "starred":
        return message.starred && matchesSearch;
      case "inbox":
      default:
        return matchesSearch;
    }
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
              Reply sent successfully!
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="space-y-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === filter.id
                      ? "bg-primary text-white"
                      : "hover:bg-white/5 text-gray-300"
                  }`}
                >
                  <filter.icon className="w-5 h-5" />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Message List and Detail View */}
            <div className="md:col-span-3 space-y-2">
              {selectedMessage ? (
                <div className="bg-white/5 rounded-lg p-6">
                  {/* Message Detail Header */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="flex items-center gap-2 text-gray-400 hover:text-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Back to Inbox</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleStar(selectedMessage.id)}
                        className={`p-1 rounded-full transition-colors ${
                          selectedMessage.starred ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
                        }`}
                      >
                        <Star className="w-5 h-5" fill={selectedMessage.starred ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => setShowReplyBox(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Reply className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">{selectedMessage.subject}</h2>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>From: {selectedMessage.sender}</span>
                      <span>{selectedMessage.timestamp}</span>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-300">{selectedMessage.content}</pre>
                    </div>
                  </div>

                  {/* Reply Box */}
                  {showReplyBox && (
                    <div className="mt-6 border-t border-white/10 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium">Reply to {selectedMessage.sender}</h3>
                          <p className="text-sm text-gray-400">From: {userEmail}</p>
                        </div>
                        <button
                          onClick={() => setShowReplyBox(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full h-40 bg-white/5 border border-white/10 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                      />
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={handleReply}
                          disabled={!replyContent.trim()}
                          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send Reply</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Message List */
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`group flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors ${
                      message.read ? "bg-white/5" : "bg-white/10"
                    } hover:bg-white/15`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(message.id);
                      }}
                      className={`p-1 rounded-full transition-colors ${
                        message.starred ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
                      }`}
                    >
                      <Star className="w-5 h-5" fill={message.starred ? "currentColor" : "none"} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium ${message.read ? "text-gray-300" : "text-white"}`}>
                          {message.sender}
                        </h3>
                        <span className="text-sm text-gray-400">{message.timestamp}</span>
                      </div>
                      <h4 className={`text-sm mb-1 ${message.read ? "text-gray-400" : "text-white"}`}>
                        {message.subject}
                      </h4>
                      <p className="text-sm text-gray-400 truncate">{message.preview}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 