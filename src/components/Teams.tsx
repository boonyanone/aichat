import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  UserPlus,
  Settings,
  MessageSquare,
  Video,
  Phone,
  Send,
  Paperclip,
  Smile,
  Hash,
  Bell,
  BellOff,
  Star,
  Pin,
  Edit3,
  Trash2,
  Copy,
  Share2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  Mail,
  Shield,
  Crown,
  User,
  Activity,
  TrendingUp,
  BarChart3,
  Zap,
  Brain,
  FileText,
  Image,
  Mic,
  Camera,
  Link,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  ChevronDown,
  ChevronRight,
  Dot
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  joinDate: Date;
  lastActive: Date;
  usage: {
    requests: number;
    cost: number;
    favoriteModel: string;
  };
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  reactions?: { emoji: string; users: string[]; }[];
  isEdited?: boolean;
  replyTo?: string;
}

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  memberCount: number;
  unreadCount: number;
  lastMessage?: ChatMessage;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invitedBy: string;
  invitedDate: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiryDate: Date;
}

const Teams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'members' | 'invitations' | 'usage' | 'settings'>('overview');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteRole, setNewInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');

  // Mock data
  const mockMembers: TeamMember[] = [
    {
      id: '1',
      name: 'คุณสมชาย วิทยากร',
      email: 'somchai@company.com',
      role: 'admin',
      status: 'online',
      joinDate: new Date('2024-01-01'),
      lastActive: new Date(),
      usage: { requests: 2847, cost: 425.80, favoriteModel: 'GPT-4' }
    },
    {
      id: '2',
      name: 'คุณปัทมา ธุรกิจ',
      email: 'patma@company.com',
      role: 'member',
      status: 'away',
      joinDate: new Date('2024-01-05'),
      lastActive: new Date(Date.now() - 3600000),
      usage: { requests: 2156, cost: 318.90, favoriteModel: 'Claude 3.5' }
    },
    {
      id: '3',
      name: 'คุณอนุชา นักศึกษา',
      email: 'anucha@university.ac.th',
      role: 'member',
      status: 'busy',
      joinDate: new Date('2024-01-10'),
      lastActive: new Date(Date.now() - 7200000),
      usage: { requests: 1893, cost: 245.60, favoriteModel: 'Gemini Pro' }
    },
    {
      id: '4',
      name: 'คุณวิชัย เทคนิค',
      email: 'wichai@company.com',
      role: 'member',
      status: 'offline',
      joinDate: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 86400000),
      usage: { requests: 1654, cost: 287.30, favoriteModel: 'Claude 3.5' }
    }
  ];

  const mockChannels: ChatChannel[] = [
    { id: 'general', name: 'ทั่วไป', description: 'การสนทนาทั่วไป', type: 'public', memberCount: 4, unreadCount: 2 },
    { id: 'ai-research', name: 'งานวิจัย-ai', description: 'หารือเกี่ยวกับงานวิจัย AI', type: 'public', memberCount: 3, unreadCount: 0 },
    { id: 'announcements', name: 'ประกาศ', description: 'ประกาศสำคัญ', type: 'public', memberCount: 4, unreadCount: 1 },
    { id: 'random', name: 'สุ่มสี่สุ่มห้า', description: 'พูดคุยเรื่องทั่วไป', type: 'public', memberCount: 4, unreadCount: 0 }
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      userId: '1',
      userName: 'คุณสมชาย',
      content: 'สวัสดีครับทุกคน! วันนี้เราจะมาหารือเกี่ยวกับการใช้ AI ในโปรเจกต์ใหม่',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: '2',
      userId: '2',
      userName: 'คุณปัทมา',
      content: 'สวัสดีค่ะ! ตื่นเต้นมากเลยค่ะ',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      reactions: [{ emoji: '👍', users: ['1', '3'] }]
    },
    {
      id: '3',
      userId: '3',
      userName: 'คุณอนุชา',
      content: 'ผมได้ทดลองใช้ GPT-4 กับงานวิจัยแล้ว ผลลัพธ์ดีมากครับ',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    }
  ];

  const mockInvitations: TeamInvitation[] = [
    {
      id: '1',
      email: 'newmember@company.com',
      role: 'member',
      invitedBy: 'คุณสมชาย',
      invitedDate: new Date(Date.now() - 86400000),
      status: 'pending',
      expiryDate: new Date(Date.now() + 6 * 86400000)
    },
    {
      id: '2',
      email: 'researcher@university.ac.th',
      role: 'member',
      invitedBy: 'คุณปัทมา',
      invitedDate: new Date(Date.now() - 172800000),
      status: 'accepted',
      expiryDate: new Date(Date.now() + 5 * 86400000)
    }
  ];

  useEffect(() => {
    setMembers(mockMembers);
    setChatChannels(mockChannels);
    setMessages(mockMessages);
    setInvitations(mockInvitations);
  }, []);

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
      case 'admin': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'member': return <User className="h-4 w-4 text-blue-600" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'ผู้ดูแล';
      case 'member': return 'สมาชิก';
      case 'viewer': return 'ผู้ดู';
      default: return 'ไม่ทราบ';
    }
  };

  const onlineMembers = members.filter(member => member.status === 'online');
  const totalUsage = members.reduce((sum, member) => sum + member.usage.requests, 0);
  const totalCost = members.reduce((sum, member) => sum + member.usage.cost, 0);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: '1', // Current user
      userName: 'คุณ',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleInviteMember = () => {
    if (!newInviteEmail.trim()) return;

    const invitation: TeamInvitation = {
      id: Date.now().toString(),
      email: newInviteEmail,
      role: newInviteRole,
      invitedBy: 'คุณ',
      invitedDate: new Date(),
      status: 'pending',
      expiryDate: new Date(Date.now() + 7 * 86400000)
    };

    setInvitations(prev => [...prev, invitation]);
    setNewInviteEmail('');
    setNewInviteRole('member');
    setShowInviteModal(false);
  };

  const getTabBadge = (tab: string) => {
    switch (tab) {
      case 'chat':
        const totalUnread = chatChannels.reduce((sum, channel) => sum + channel.unreadCount, 0);
        return totalUnread > 0 ? totalUnread : null;
      case 'invitations':
        const pendingInvites = invitations.filter(inv => inv.status === 'pending').length;
        return pendingInvites > 0 ? pendingInvites : null;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-7 w-7 mr-3 text-blue-600" />
              ทีมวิจัยและพัฒนา AI พร้อมช่องทางสื่อสารภายในทีม
            </h1>
            <p className="text-gray-600 text-sm mt-1">จัดการสมาชิกทีม แชร์ทรัพยากร และสื่อสารร่วมกัน</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              เชิญสมาชิก
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'ภาพรวม', icon: Activity },
            { id: 'chat', label: 'แชททีม', icon: MessageSquare },
            { id: 'members', label: 'สมาชิก', icon: Users },
            { id: 'invitations', label: 'คำเชิญ', icon: UserPlus },
            { id: 'usage', label: 'การใช้งาน', icon: BarChart3 },
            { id: 'settings', label: 'ตั้งค่า', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const badge = getTabBadge(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
                {badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">สมาชิกทั้งหมด</h3>
                    <p className="text-2xl font-bold text-blue-600">{members.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">ออนไลน์</h3>
                    <p className="text-2xl font-bold text-green-600">{onlineMembers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">คำขอรวม</h3>
                    <p className="text-2xl font-bold text-purple-600">{totalUsage.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">ค่าใช้จ่ายรวม</h3>
                    <p className="text-2xl font-bold text-orange-600">฿{totalCost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Online Members */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">สมาชิกที่ออนไลน์</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {onlineMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-green-700">{getStatusLabel(member.status)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">กิจกรรมล่าสุด</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900"><strong>คุณสมชาย</strong> ส่งข้อความในช่อง #ทั่วไป</p>
                    <p className="text-xs text-gray-500">5 นาทีที่แล้ว</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900"><strong>คุณปัทมา</strong> แชร์เอกสาร "แผนกลยุทธ์ 2025"</p>
                    <p className="text-xs text-gray-500">1 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <UserPlus className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900"><strong>คุณอนุชา</strong> เข้าร่วมทีม</p>
                    <p className="text-xs text-gray-500">2 วันที่แล้ว</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex">
            {/* Channel List */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">ช่องสนทนา</h3>
                <div className="space-y-1">
                  {chatChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        selectedChannel === channel.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4" />
                        <span className="text-sm font-medium">{channel.name}</span>
                      </div>
                      {channel.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Online Members in Chat */}
              <div className="flex-1 p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">สมาชิกออนไลน์ ({onlineMembers.length})</h4>
                <div className="space-y-2">
                  {onlineMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusColor(member.status)} rounded-full border border-white`} />
                      </div>
                      <span className="text-sm text-gray-700">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Hash className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {chatChannels.find(c => c.id === selectedChannel)?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {chatChannels.find(c => c.id === selectedChannel)?.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Video className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.userName}</span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                      {message.reactions && (
                        <div className="flex items-center space-x-2 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200"
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={`ส่งข้อความไปยัง #${chatChannels.find(c => c.id === selectedChannel)?.name}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Smile className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาสมาชิก..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members
                .filter(member => 
                  member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  member.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">บทบาท:</span>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(member.role)}
                          <span className="text-sm font-medium text-gray-900">{getRoleLabel(member.role)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">สถานะ:</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 ${getStatusColor(member.status)} rounded-full`} />
                          <span className="text-sm font-medium text-gray-900">{getStatusLabel(member.status)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">เข้าร่วมเมื่อ:</span>
                        <span className="text-sm text-gray-900">{member.joinDate.toLocaleDateString('th-TH')}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">ใช้งานล่าสุด:</span>
                        <span className="text-sm text-gray-900">
                          {member.lastActive.toLocaleDateString('th-TH')}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold text-blue-600">{member.usage.requests.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">คำขอ</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-green-600">฿{member.usage.cost.toFixed(2)}</p>
                            <p className="text-xs text-gray-600">ค่าใช้จ่าย</p>
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-xs text-gray-600">AI โปรด: <span className="font-medium">{member.usage.favoriteModel}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">คำเชิญสมาชิก</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invitation.email}</p>
                        <p className="text-sm text-gray-600">
                          เชิญโดย {invitation.invitedBy} • {getRoleLabel(invitation.role)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {invitation.invitedDate.toLocaleDateString('th-TH')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        invitation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        invitation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        invitation.status === 'declined' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invitation.status === 'pending' ? 'รอการตอบรับ' :
                         invitation.status === 'accepted' ? 'ยอมรับแล้ว' :
                         invitation.status === 'declined' ? 'ปฏิเสธ' : 'หมดอายุ'}
                      </span>
                      {invitation.status === 'pending' && (
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage by Member */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">การใช้งานตามสมาชิก</h3>
                <div className="space-y-4">
                  {members
                    .sort((a, b) => b.usage.requests - a.usage.requests)
                    .map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                            <span className="text-xs font-medium text-blue-600">#{index + 1}</span>
                          </div>
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.usage.favoriteModel}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{member.usage.requests.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">฿{member.usage.cost.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">การแบ่งค่าใช้จ่าย</h3>
                <div className="space-y-4">
                  {members.map((member) => {
                    const percentage = (member.usage.cost / totalCost) * 100;
                    return (
                      <div key={member.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{member.name}</span>
                          <span className="text-sm text-gray-600">฿{member.usage.cost.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6">
            <div className="max-w-2xl">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">การตั้งค่าทีม</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อทีม</label>
                    <input
                      type="text"
                      defaultValue="ทีมวิจัยและพัฒนา AI"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                    <textarea
                      rows={3}
                      defaultValue="ทีมสำหรับการวิจัยและพัฒนาเทคโนโลยี AI"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">การเชื่อมต่อแชท</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Google Chat</p>
                        <p className="text-sm text-gray-600">เชื่อมต่อกับ Google Chat Spaces</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      เชื่อมต่อ
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Video className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Microsoft Teams</p>
                        <p className="text-sm text-gray-600">เชื่อมต่อกับ Microsoft Teams</p>
                      </div>
                    </div>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      เชื่อมต่อ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">เชิญสมาชิกใหม่</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                <input
                  type="email"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  placeholder="example@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">บทบาท</label>
                <select
                  value={newInviteRole}
                  onChange={(e) => setNewInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="viewer">ผู้ดู</option>
                  <option value="member">สมาชิก</option>
                  <option value="admin">ผู้ดูแล</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleInviteMember}
                  disabled={!newInviteEmail.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ส่งคำเชิญ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;