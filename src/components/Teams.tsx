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
  Dot,
  Folder,
  FolderOpen,
  BookOpen,
  Target,
  Award,
  Key,
  Globe,
  Building
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'leader' | 'member';
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  joinDate: Date;
  lastActive: Date;
  hasOwnAPI: boolean;
  apiQuotaRemaining?: number;
  permissions: string[];
}

interface SharedDocument {
  id: string;
  title: string;
  type: 'research' | 'report' | 'analysis' | 'summary';
  sharedBy: string;
  sharedDate: Date;
  lastModified: Date;
  summary: string;
  tags: string[];
  accessLevel: 'view' | 'comment' | 'edit';
  viewCount: number;
  commentCount: number;
}

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'project' | 'document';
  linkedDocuments?: string[];
  memberCount: number;
  unreadCount: number;
  lastMessage?: {
    user: string;
    content: string;
    timestamp: Date;
  };
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'document_link';
  linkedDocument?: string;
  reactions?: { emoji: string; users: string[]; }[];
}

interface TeamInvitation {
  id: string;
  email: string;
  role: 'member';
  invitedBy: string;
  invitedDate: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiryDate: Date;
  message?: string;
}

const Teams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'documents' | 'members' | 'invitations' | 'settings'>('workspace');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteMessage, setNewInviteMessage] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<SharedDocument | null>(null);

  // Mock data
  const mockMembers: TeamMember[] = [
    {
      id: '1',
      name: 'นาย A (หัวหน้าทีม)',
      email: 'leader@company.com',
      role: 'leader',
      status: 'online',
      joinDate: new Date('2024-01-01'),
      lastActive: new Date(),
      hasOwnAPI: true,
      permissions: ['manage_team', 'advanced_search', 'share_documents', 'manage_budget']
    },
    {
      id: '2',
      name: 'คุณปัทมา นักวิเคราะห์',
      email: 'patma@company.com',
      role: 'member',
      status: 'online',
      joinDate: new Date('2024-01-05'),
      lastActive: new Date(Date.now() - 1800000),
      hasOwnAPI: true,
      apiQuotaRemaining: 150,
      permissions: ['view_documents', 'comment', 'basic_search']
    },
    {
      id: '3',
      name: 'คุณอนุชา นักวิจัย',
      email: 'anucha@university.ac.th',
      role: 'member',
      status: 'away',
      joinDate: new Date('2024-01-10'),
      lastActive: new Date(Date.now() - 3600000),
      hasOwnAPI: false,
      permissions: ['view_documents', 'comment']
    },
    {
      id: '4',
      name: 'คุณวิชัย เทคนิค',
      email: 'wichai@company.com',
      role: 'member',
      status: 'busy',
      joinDate: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 7200000),
      hasOwnAPI: true,
      apiQuotaRemaining: 0,
      permissions: ['view_documents', 'comment', 'basic_search']
    }
  ];

  const mockSharedDocuments: SharedDocument[] = [
    {
      id: '1',
      title: 'รายงานการวิจัย AI in Healthcare 2024',
      type: 'research',
      sharedBy: 'นาย A',
      sharedDate: new Date('2024-01-15T10:30:00'),
      lastModified: new Date('2024-01-15T14:20:00'),
      summary: 'การวิจัยเกี่ยวกับการใช้ AI ในระบบสุขภาพ พบว่าสามารถเพิ่มประสิทธิภาพการวินิจฉัยได้ 35%',
      tags: ['AI', 'Healthcare', 'Research', '2024'],
      accessLevel: 'comment',
      viewCount: 12,
      commentCount: 5
    },
    {
      id: '2',
      title: 'สรุปข้อมูลตลาด AI ในประเทศไทย',
      type: 'analysis',
      sharedBy: 'นาย A',
      sharedDate: new Date('2024-01-14T09:15:00'),
      lastModified: new Date('2024-01-14T16:45:00'),
      summary: 'การวิเคราะห์ตลาด AI ในไทย แนวโน้มการเติบโต และโอกาสทางธุรกิจ',
      tags: ['Market', 'Thailand', 'AI', 'Business'],
      accessLevel: 'view',
      viewCount: 8,
      commentCount: 3
    },
    {
      id: '3',
      title: 'แผนการพัฒนา AI Strategy Q2 2024',
      type: 'report',
      sharedBy: 'คุณปัทมา',
      sharedDate: new Date('2024-01-13T11:00:00'),
      lastModified: new Date('2024-01-13T15:30:00'),
      summary: 'แผนกลยุทธ์การพัฒนา AI สำหรับไตรมาส 2 ปี 2024',
      tags: ['Strategy', 'Q2', 'Planning', 'AI'],
      accessLevel: 'edit',
      viewCount: 15,
      commentCount: 8
    }
  ];

  const mockChannels: ChatChannel[] = [
    { 
      id: 'general', 
      name: 'ทั่วไป', 
      description: 'การสนทนาทั่วไปของทีม', 
      type: 'general', 
      memberCount: 4, 
      unreadCount: 2,
      lastMessage: {
        user: 'นาย A',
        content: 'ได้ข้อมูลใหม่เกี่ยวกับ AI in Healthcare แล้ว',
        timestamp: new Date(Date.now() - 300000)
      }
    },
    { 
      id: 'research-project', 
      name: 'โปรเจกต์วิจัย', 
      description: 'หารือเกี่ยวกับโปรเจกต์วิจัยหลัก', 
      type: 'project', 
      linkedDocuments: ['1', '3'],
      memberCount: 4, 
      unreadCount: 0,
      lastMessage: {
        user: 'คุณอนุชา',
        content: 'ผมอ่านรายงานแล้ว มีคำถามเพิ่มเติม',
        timestamp: new Date(Date.now() - 1800000)
      }
    },
    { 
      id: 'market-analysis', 
      name: 'วิเคราะห์ตลาด', 
      description: 'พูดคุยเกี่ยวกับการวิเคราะห์ตลาด', 
      type: 'document', 
      linkedDocuments: ['2'],
      memberCount: 3, 
      unreadCount: 1,
      lastMessage: {
        user: 'คุณวิชัย',
        content: 'ข้อมูลตลาดไทยน่าสนใจมาก',
        timestamp: new Date(Date.now() - 3600000)
      }
    }
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      userId: '1',
      userName: 'นาย A',
      content: 'ได้ข้อมูลการวิจัย AI in Healthcare มาแล้ว ได้แชร์เอกสารให้ทุกคนดูแล้ว',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    },
    {
      id: '2',
      userId: '2',
      userName: 'คุณปัทมา',
      content: 'ขอบคุณค่ะ กำลังอ่านอยู่ ข้อมูลน่าสนใจมาก',
      timestamp: new Date(Date.now() - 1500000),
      type: 'text',
      reactions: [{ emoji: '👍', users: ['1', '3'] }]
    },
    {
      id: '3',
      userId: '3',
      userName: 'คุณอนุชา',
      content: 'ผมมีคำถามเกี่ยวกับส่วนการวิเคราะห์ข้อมูล สามารถขอข้อมูลเพิ่มเติมได้ไหมครับ?',
      timestamp: new Date(Date.now() - 900000),
      type: 'text'
    },
    {
      id: '4',
      userId: '1',
      userName: 'นาย A',
      content: 'ได้เลยครับ ผมจะหาข้อมูลเพิ่มเติมให้',
      timestamp: new Date(Date.now() - 600000),
      type: 'text'
    }
  ];

  const mockInvitations: TeamInvitation[] = [
    {
      id: '1',
      email: 'newresearcher@university.ac.th',
      role: 'member',
      invitedBy: 'นาย A',
      invitedDate: new Date(Date.now() - 86400000),
      status: 'pending',
      expiryDate: new Date(Date.now() + 6 * 86400000),
      message: 'เชิญเข้าร่วมทีมวิจัย AI'
    }
  ];

  useEffect(() => {
    setMembers(mockMembers);
    setSharedDocuments(mockSharedDocuments);
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
      case 'leader': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'member': return <User className="h-4 w-4 text-blue-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'leader': return 'หัวหน้าทีม';
      case 'member': return 'สมาชิก';
      default: return 'ไม่ทราบ';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'research': return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'report': return <BarChart3 className="h-4 w-4 text-green-600" />;
      case 'analysis': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'summary': return <FileText className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'research': return 'งานวิจัย';
      case 'report': return 'รายงาน';
      case 'analysis': return 'การวิเคราะห์';
      case 'summary': return 'สรุป';
      default: return 'เอกสาร';
    }
  };

  const onlineMembers = members.filter(member => member.status === 'online');
  const leaderMember = members.find(member => member.role === 'leader');

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
      role: 'member',
      invitedBy: 'คุณ',
      invitedDate: new Date(),
      status: 'pending',
      expiryDate: new Date(Date.now() + 7 * 86400000),
      message: newInviteMessage
    };

    setInvitations(prev => [...prev, invitation]);
    setNewInviteEmail('');
    setNewInviteMessage('');
    setShowInviteModal(false);
  };

  const getTabBadge = (tab: string) => {
    switch (tab) {
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
              ทีมงานและพื้นที่ทำงานร่วมกัน
            </h1>
            <p className="text-gray-600 text-sm mt-1">จัดการทีม แชร์เอกสาร และสื่อสารผ่าน Google Chat/Microsoft Teams</p>
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
            { id: 'workspace', label: 'พื้นที่ทำงาน', icon: Activity },
            { id: 'documents', label: 'เอกสารแชร์', icon: FileText },
            { id: 'members', label: 'สมาชิก', icon: Users },
            { id: 'invitations', label: 'คำเชิญ', icon: UserPlus },
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
        {activeTab === 'workspace' && (
          <div className="h-full flex">
            {/* Chat Channels Sidebar */}
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

              {/* Online Members */}
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{member.name}</p>
                        {member.role === 'leader' && (
                          <p className="text-xs text-yellow-600">หัวหน้าทีม</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Team Leader Info */}
                {leaderMember && (
                  <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">หัวหน้าทีม</span>
                    </div>
                    <p className="text-xs text-yellow-700">{leaderMember.name}</p>
                    <p className="text-xs text-yellow-600 mt-1">รับผิดชอบค่าใช้จ่ายและการค้นหาขั้นสูง</p>
                  </div>
                )}
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

                {/* Linked Documents */}
                {chatChannels.find(c => c.id === selectedChannel)?.linkedDocuments && (
                  <div className="mt-3 flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">เอกสารที่เกี่ยวข้อง:</span>
                    <div className="flex space-x-2">
                      {chatChannels.find(c => c.id === selectedChannel)?.linkedDocuments?.map((docId) => {
                        const doc = sharedDocuments.find(d => d.id === docId);
                        return doc ? (
                          <button
                            key={docId}
                            onClick={() => setSelectedDocument(doc)}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 transition-colors"
                          >
                            {doc.title.substring(0, 20)}...
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
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

        {activeTab === 'documents' && (
          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาเอกสารที่แชร์..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Shared Documents */}
            <div className="space-y-4">
              {sharedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getDocumentTypeIcon(doc.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{doc.title}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {getDocumentTypeLabel(doc.type)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            แชร์โดย {doc.sharedBy}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {doc.sharedDate.toLocaleDateString('th-TH')}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {doc.viewCount} ครั้ง
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {doc.commentCount} ความคิดเห็น
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{doc.summary}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {doc.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            doc.accessLevel === 'edit' ? 'bg-green-100 text-green-800' :
                            doc.accessLevel === 'comment' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {doc.accessLevel === 'edit' ? 'แก้ไขได้' :
                             doc.accessLevel === 'comment' ? 'แสดงความคิดเห็นได้' : 'ดูได้อย่างเดียว'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="p-6">
            {/* Team Leader Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">หัวหน้าทีม</h3>
              {leaderMember && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="h-8 w-8 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(leaderMember.status)} rounded-full border-2 border-white`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900">{leaderMember.name}</h4>
                      <p className="text-gray-600">{leaderMember.email}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          เข้าร่วม {leaderMember.joinDate.toLocaleDateString('th-TH')}
                        </span>
                        <span className="flex items-center">
                          <Activity className="h-4 w-4 mr-1" />
                          {getStatusLabel(leaderMember.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                        หัวหน้าทีม
                      </div>
                      <p className="text-xs text-gray-600">รับผิดชอบค่าใช้จ่าย</p>
                      <p className="text-xs text-gray-600">การค้นหาขั้นสูง</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Team Members */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">สมาชิกทีม</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.filter(member => member.role !== 'leader').map((member) => (
                  <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">สถานะ:</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 ${getStatusColor(member.status)} rounded-full`} />
                          <span className="text-sm font-medium text-gray-900">{getStatusLabel(member.status)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">API ส่วนตัว:</span>
                        <div className="flex items-center space-x-1">
                          {member.hasOwnAPI ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">มี</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-600">ไม่มี</span>
                            </>
                          )}
                        </div>
                      </div>

                      {member.hasOwnAPI && member.apiQuotaRemaining !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">โควต้าคงเหลือ:</span>
                          <span className={`text-sm font-medium ${
                            member.apiQuotaRemaining > 50 ? 'text-green-600' :
                            member.apiQuotaRemaining > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {member.apiQuotaRemaining} คำขอ
                          </span>
                        </div>
                      )}

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

                      {/* Permissions */}
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">สิทธิ์การใช้งาน:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions.map((permission, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {permission === 'view_documents' ? 'ดูเอกสาร' :
                               permission === 'comment' ? 'แสดงความคิดเห็น' :
                               permission === 'basic_search' ? 'ค้นหาพื้นฐาน' : permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200">
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
                        {invitation.message && (
                          <p className="text-xs text-gray-600 mt-1">"{invitation.message}"</p>
                        )}
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

        {activeTab === 'settings' && (
          <div className="p-6">
            <div className="max-w-2xl space-y-6">
              {/* Team Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">การตั้งค่าทีม</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อทีม</label>
                    <input
                      type="text"
                      defaultValue="ทีมงานและพื้นที่ทำงานร่วมกัน"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                    <textarea
                      rows={3}
                      defaultValue="ทีมสำหรับการทำงานร่วมกันและแชร์ข้อมูลการวิจัย"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Chat Integration */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                        <Building className="h-5 w-5 text-purple-600" />
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

              {/* Team Permissions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">สิทธิ์ของทีม</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">สมาชิกสามารถเชิญคนอื่นได้</p>
                      <p className="text-sm text-gray-600">อนุญาตให้สมาชิกเชิญคนอื่นเข้าทีม</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">แชร์เอกสารอัตโนมัติ</p>
                      <p className="text-sm text-gray-600">เอกสารใหม่จะถูกแชร์ให้ทีมโดยอัตโนมัติ</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความเชิญ (ไม่บังคับ)</label>
                <textarea
                  value={newInviteMessage}
                  onChange={(e) => setNewInviteMessage(e.target.value)}
                  placeholder="เชิญเข้าร่วมทีมเพื่อทำงานร่วมกัน..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <Info className="h-4 w-4 inline mr-1" />
                  สมาชิกใหม่จะได้รับสิทธิ์ในการดูเอกสารและแสดงความคิดเห็น
                </p>
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

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-4/5 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getDocumentTypeIcon(selectedDocument.type)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.title}</h3>
                  <p className="text-sm text-gray-600">แชร์โดย {selectedDocument.sharedBy}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">สรุปเอกสาร</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedDocument.summary}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">ประเภท:</span>
                    <span className="ml-2 font-medium">{getDocumentTypeLabel(selectedDocument.type)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">สิทธิ์:</span>
                    <span className="ml-2 font-medium">
                      {selectedDocument.accessLevel === 'edit' ? 'แก้ไขได้' :
                       selectedDocument.accessLevel === 'comment' ? 'แสดงความคิดเห็นได้' : 'ดูได้อย่างเดียว'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">ดู:</span>
                    <span className="ml-2 font-medium">{selectedDocument.viewCount} ครั้ง</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ความคิดเห็น:</span>
                    <span className="ml-2 font-medium">{selectedDocument.commentCount} ข้อ</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">แท็ก</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    เปิดเอกสาร
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    แสดงความคิดเห็น
                  </button>
                </div>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Share2 className="h-4 w-4 mr-2" />
                  แชร์
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