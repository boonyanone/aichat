import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Users, 
  User, 
  Paperclip, 
  Mic, 
  Image as ImageIcon,
  Phone,
  Video,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  X,
  Circle,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  Building,
  GraduationCap,
  Briefcase,
  Crown,
  Shield,
  Eye,
  Bell,
  BellOff,
  UserPlus,
  Edit3,
  Trash2,
  Copy,
  Share2,
  Star,
  Flag,
  Archive,
  Pin,
  Smile,
  AtSign,
  Hash,
  Calendar,
  FileText,
  Link,
  ExternalLink,
  Download,
  Upload,
  Zap,
  Brain,
  Globe,
  Sparkles
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: 'owner' | 'admin' | 'member';
  department: string;
  position: string;
  provider: 'google' | 'microsoft';
  lastSeen: Date;
  workingHours: string;
  timezone: string;
  isTyping?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'system';
  isEdited?: boolean;
  reactions?: Reaction[];
  replyTo?: string;
  mentions?: string[];
  attachments?: Attachment[];
}

interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  isArchived: boolean;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
}

const TeamChat: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [showMemberList, setShowMemberList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [newChannelType, setNewChannelType] = useState<'public' | 'private'>('public');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Mock data
  const mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'คุณสมชาย วิทยากร',
      email: 'somchai@company.com',
      status: 'online',
      role: 'owner',
      department: 'วิจัยและพัฒนา',
      position: 'หัวหน้าทีม',
      provider: 'google',
      lastSeen: new Date(),
      workingHours: '09:00-18:00',
      timezone: 'Asia/Bangkok'
    },
    {
      id: '2',
      name: 'คุณปัทมา ธุรกิจ',
      email: 'patma@company.com',
      status: 'online',
      role: 'admin',
      department: 'การตลาด',
      position: 'ผู้จัดการโครงการ',
      provider: 'microsoft',
      lastSeen: new Date(Date.now() - 300000),
      workingHours: '08:30-17:30',
      timezone: 'Asia/Bangkok',
      isTyping: true
    },
    {
      id: '3',
      name: 'คุณอนุชา นักศึกษา',
      email: 'anucha@university.ac.th',
      status: 'away',
      role: 'member',
      department: 'วิจัย',
      position: 'นักศึกษาปริญญาโท',
      provider: 'google',
      lastSeen: new Date(Date.now() - 1800000),
      workingHours: '10:00-16:00',
      timezone: 'Asia/Bangkok'
    },
    {
      id: '4',
      name: 'คุณวิชัย เทคนิค',
      email: 'wichai@company.com',
      status: 'busy',
      role: 'member',
      department: 'เทคโนโลยี',
      position: 'นักพัฒนาระบบ',
      provider: 'microsoft',
      lastSeen: new Date(Date.now() - 600000),
      workingHours: '09:30-18:30',
      timezone: 'Asia/Bangkok'
    },
    {
      id: '5',
      name: 'คุณสุดา วิเคราะห์',
      email: 'suda@company.com',
      status: 'offline',
      role: 'member',
      department: 'วิเคราะห์',
      position: 'นักวิเคราะห์ข้อมูล',
      provider: 'google',
      lastSeen: new Date(Date.now() - 3600000),
      workingHours: '08:00-17:00',
      timezone: 'Asia/Bangkok'
    }
  ];

  const mockChannels: Channel[] = [
    {
      id: '1',
      name: 'ทั่วไป',
      description: 'ช่องทางสำหรับการสนทนาทั่วไป',
      type: 'public',
      members: ['1', '2', '3', '4', '5'],
      isArchived: false,
      unreadCount: 3,
      isMuted: false,
      isPinned: true,
      lastMessage: {
        id: '1',
        senderId: '2',
        senderName: 'คุณปัทมา',
        content: 'ประชุมวันพรุ่งนี้เลื่อนเป็น 14:00 น. นะครับ',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      }
    },
    {
      id: '2',
      name: 'โครงการ AI',
      description: 'อภิปรายเกี่ยวกับโครงการ AI',
      type: 'public',
      members: ['1', '2', '3'],
      isArchived: false,
      unreadCount: 0,
      isMuted: false,
      isPinned: false,
      lastMessage: {
        id: '2',
        senderId: '1',
        senderName: 'คุณสมชาย',
        content: 'ผลการทดสอบ AI Model ออกมาดีมากครับ',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text'
      }
    },
    {
      id: '3',
      name: 'การตลาด',
      description: 'ช่องทางสำหรับทีมการตลาด',
      type: 'private',
      members: ['2', '4'],
      isArchived: false,
      unreadCount: 1,
      isMuted: false,
      isPinned: false
    }
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: '1',
      senderName: 'คุณสมชาย วิทยากร',
      content: 'สวัสดีครับทุกคน วันนี้เราจะมาคุยเรื่องการใช้งาน ThaiAI กัน',
      timestamp: new Date(Date.now() - 7200000),
      type: 'text'
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'คุณปัทมา ธุรกิจ',
      content: 'สวัสดีค่ะ ตื่นเต้นมากเลยที่ได้ลองใช้ AI ใหม่ๆ',
      timestamp: new Date(Date.now() - 7000000),
      type: 'text',
      reactions: [
        { emoji: '👍', users: ['1', '3'], count: 2 },
        { emoji: '😊', users: ['1'], count: 1 }
      ]
    },
    {
      id: '3',
      senderId: '3',
      senderName: 'คุณอนุชา นักศึกษา',
      content: 'ผมลองใช้ AI วิเคราะห์เอกสารวิทยานิพนธ์แล้ว ช่วยได้มากเลยครับ',
      timestamp: new Date(Date.now() - 6800000),
      type: 'text'
    },
    {
      id: '4',
      senderId: '1',
      senderName: 'คุณสมชาย วิทยากร',
      content: 'ดีมากครับ! ใครมีคำถามเกี่ยวกับการใช้งานบ้างไหม?',
      timestamp: new Date(Date.now() - 6600000),
      type: 'text'
    },
    {
      id: '5',
      senderId: '4',
      senderName: 'คุณวิชัย เทคนิค',
      content: 'ผมอยากทราบเรื่องการเชื่อมต่อ API ครับ มีเอกสารไหม?',
      timestamp: new Date(Date.now() - 6400000),
      type: 'text'
    }
  ];

  useEffect(() => {
    setTeamMembers(mockTeamMembers);
    setChannels(mockChannels);
    setSelectedChannel(mockChannels[0]);
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedChannel) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: '1', // Current user
      senderName: 'คุณ',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Update channel's last message
    setChannels(prev => prev.map(channel => 
      channel.id === selectedChannel.id 
        ? { ...channel, lastMessage: newMessage }
        : channel
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'ออนไลน์';
      case 'away': return 'ไม่อยู่';
      case 'busy': return 'ไม่ว่าง';
      case 'offline': return 'ออฟไลน์';
      default: return 'ไม่ทราบ';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'admin': return <Shield className="h-3 w-3 text-blue-500" />;
      case 'member': return <User className="h-3 w-3 text-gray-500" />;
      default: return <User className="h-3 w-3 text-gray-500" />;
    }
  };

  const getProviderIcon = (provider: string) => {
    return provider === 'google' ? '🔵' : '🟦';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${days} วันที่แล้ว`;
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;

    const newChannel: Channel = {
      id: Date.now().toString(),
      name: newChannelName,
      description: newChannelDescription,
      type: newChannelType,
      members: selectedMembers,
      isArchived: false,
      unreadCount: 0,
      isMuted: false,
      isPinned: false
    };

    setChannels(prev => [...prev, newChannel]);
    setNewChannelName('');
    setNewChannelDescription('');
    setSelectedMembers([]);
    setShowCreateChannel(false);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const reactions = message.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes('1')) {
            // Remove reaction
            return {
              ...message,
              reactions: reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: r.users.filter(u => u !== '1'), count: r.count - 1 }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add reaction
            return {
              ...message,
              reactions: reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: [...r.users, '1'], count: r.count + 1 }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...message,
            reactions: [...reactions, { emoji, users: ['1'], count: 1 }]
          };
        }
      }
      return message;
    }));
  };

  const onlineMembers = teamMembers.filter(m => m.status === 'online');
  const awayMembers = teamMembers.filter(m => m.status === 'away' || m.status === 'busy');
  const offlineMembers = teamMembers.filter(m => m.status === 'offline');

  return (
    <div className="h-full flex bg-gray-50">
      {/* Channels Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Team Chat</h2>
            <button
              onClick={() => setShowCreateChannel(true)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาช่องทาง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Pinned Channels */}
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">ช่องทางที่ปักหมุด</h3>
            <div className="space-y-1">
              {channels.filter(c => c.isPinned).map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedChannel?.id === channel.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Hash className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{channel.name}</span>
                  </div>
                  {channel.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Public Channels */}
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">ช่องทางสาธารณะ</h3>
            <div className="space-y-1">
              {channels.filter(c => c.type === 'public' && !c.isPinned).map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedChannel?.id === channel.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Hash className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{channel.name}</span>
                  </div>
                  {channel.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Private Channels */}
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">ช่องทางส่วนตัว</h3>
            <div className="space-y-1">
              {channels.filter(c => c.type === 'private').map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedChannel?.id === channel.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Shield className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{channel.name}</span>
                  </div>
                  {channel.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {selectedChannel?.type === 'private' ? (
                  <Shield className="h-5 w-5 text-gray-600" />
                ) : (
                  <Hash className="h-5 w-5 text-gray-600" />
                )}
                <h1 className="text-xl font-semibold text-gray-900">
                  {selectedChannel?.name || 'เลือกช่องทาง'}
                </h1>
              </div>
              {selectedChannel?.description && (
                <span className="text-sm text-gray-500">• {selectedChannel.description}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Video className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowMemberList(!showMemberList)}
                className={`p-2 rounded-lg transition-colors ${
                  showMemberList ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedChannel ? (
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className="group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                      {message.senderName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.senderName}</span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.isEdited && (
                          <span className="text-xs text-gray-400">(แก้ไขแล้ว)</span>
                        )}
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              onClick={() => addReaction(message.id, reaction.emoji)}
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
                                reaction.users.includes('1') 
                                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.count}</span>
                            </button>
                          ))}
                          <button
                            onClick={() => addReaction(message.id, '👍')}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Smile className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Message Actions */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <Smile className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span>{typingUsers.join(', ')} กำลังพิมพ์...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">เลือกช่องทางเพื่อเริ่มสนทนา</h3>
                <p className="text-gray-600">เลือกช่องทางจากด้านซ้ายเพื่อดูข้อความและเริ่มสนทนา</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {selectedChannel && (
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`ส่งข้อความไปยัง #${selectedChannel.name}`}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Smile className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <AtSign className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members Sidebar */}
      {showMemberList && (
        <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">สมาชิก</h2>
              <button
                onClick={() => setShowMemberList(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Online Members */}
            {onlineMembers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  ออนไลน์ ({onlineMembers.length})
                </h3>
                <div className="space-y-2">
                  {onlineMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          {getRoleIcon(member.role)}
                          <span className="text-xs">{getProviderIcon(member.provider)}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{member.position}</p>
                        {member.isTyping && (
                          <p className="text-xs text-blue-600">กำลังพิมพ์...</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Away/Busy Members */}
            {awayMembers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  ไม่อยู่ ({awayMembers.length})
                </h3>
                <div className="space-y-2">
                  {awayMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors opacity-75">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-medium text-gray-700 truncate">{member.name}</p>
                          {getRoleIcon(member.role)}
                          <span className="text-xs">{getProviderIcon(member.provider)}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{getStatusLabel(member.status)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offline Members */}
            {offlineMembers.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  ออฟไลน์ ({offlineMembers.length})
                </h3>
                <div className="space-y-2">
                  {offlineMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors opacity-50">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-medium text-gray-600 truncate">{member.name}</p>
                          {getRoleIcon(member.role)}
                          <span className="text-xs">{getProviderIcon(member.provider)}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                          {formatTime(member.lastSeen)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">สร้างช่องทางใหม่</h3>
                <button
                  onClick={() => setShowCreateChannel(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อช่องทาง</label>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="ระบุชื่อช่องทาง"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                  <textarea
                    value={newChannelDescription}
                    onChange={(e) => setNewChannelDescription(e.target.value)}
                    placeholder="อธิบายวัตถุประสงค์ของช่องทาง"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="public"
                        checked={newChannelType === 'public'}
                        onChange={(e) => setNewChannelType(e.target.value as 'public')}
                        className="mr-2"
                      />
                      <Hash className="h-4 w-4 mr-2" />
                      <span className="text-sm">สาธารณะ - ทุกคนในทีมเข้าถึงได้</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="private"
                        checked={newChannelType === 'private'}
                        onChange={(e) => setNewChannelType(e.target.value as 'private')}
                        className="mr-2"
                      />
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="text-sm">ส่วนตัว - เฉพาะสมาชิกที่เชิญ</span>
                    </label>
                  </div>
                </div>

                {newChannelType === 'private' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เชิญสมาชิก</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {teamMembers.map(member => (
                        <label key={member.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMembers(prev => [...prev, member.id]);
                              } else {
                                setSelectedMembers(prev => prev.filter(id => id !== member.id));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{member.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateChannel(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleCreateChannel}
                  disabled={!newChannelName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  สร้างช่องทาง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamChat;