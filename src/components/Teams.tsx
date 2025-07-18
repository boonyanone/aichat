import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Settings,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  X,
  Send,
  Paperclip,
  Image,
  Mic,
  Phone,
  Video,
  Star,
  Clock,
  User,
  Crown,
  Shield,
  Eye,
  Edit3,
  Share2,
  Download,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Brain,
  Globe,
  Building,
  Mail,
  Calendar,
  Target,
  Award,
  TrendingUp,
  Activity,
  Bookmark,
  Flag,
  Hash,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  RefreshCw,
  Save,
  Upload,
  Link,
  Folder,
  FolderOpen,
  FileCheck,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Smile,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  PenTool,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  ImageIcon,
  LinkIcon,
  Trash2,
  Archive,
  Bell,
  BellOff
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'team_leader' | 'co_leader' | 'member';
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  joinDate: Date;
  lastActive: Date;
  hasPersonalAPI: boolean;
  personalQuotaRemaining: number;
  permissions: {
    canCreateDocuments: boolean;
    canEditSharedDocuments: boolean;
    canInviteMembers: boolean;
    canUseTeamAI: boolean;
  };
  contributionStats: {
    documentsCreated: number;
    documentsEdited: number;
    messagesPosted: number;
    aiQueriesUsed: number;
  };
}

interface SharedDocument {
  id: string;
  title: string;
  type: 'google_doc' | 'microsoft_word' | 'internal_doc';
  url?: string;
  content?: string;
  createdBy: string;
  createdDate: Date;
  lastModified: Date;
  lastModifiedBy: string;
  accessLevel: 'view' | 'comment' | 'edit';
  linkedChannels: string[];
  aiGenerated: boolean;
  aiModel?: string;
  aiCost?: number;
  status: 'draft' | 'review' | 'approved' | 'archived';
  collaborators: Array<{
    userId: string;
    permission: 'view' | 'comment' | 'edit';
    lastAccessed: Date;
  }>;
  comments: Array<{
    id: string;
    userId: string;
    content: string;
    timestamp: Date;
    resolved: boolean;
  }>;
  versions: Array<{
    id: string;
    version: number;
    createdBy: string;
    createdDate: Date;
    changes: string;
  }>;
}

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'project' | 'document' | 'ai_research';
  linkedDocuments: string[];
  memberCount: number;
  unreadCount: number;
  lastMessage?: {
    content: string;
    sender: string;
    timestamp: Date;
  };
  isPrivate: boolean;
  allowedMembers?: string[];
}

interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'ai_result' | 'document_share' | 'system';
  attachments?: Array<{
    type: 'file' | 'image' | 'document';
    name: string;
    url: string;
    size?: number;
  }>;
  aiContext?: {
    query: string;
    model: string;
    cost: number;
    result: string;
  };
  reactions: Array<{
    emoji: string;
    users: string[];
  }>;
  replies: ChatMessage[];
  isEdited: boolean;
  isPinned: boolean;
}

interface Team {
  id: string;
  name: string;
  description: string;
  createdDate: Date;
  members: TeamMember[];
  channels: ChatChannel[];
  sharedDocuments: SharedDocument[];
  settings: {
    allowPersonalAPI: boolean;
    autoShareAIResults: boolean;
    requireApprovalForDocuments: boolean;
    chatIntegration: {
      platform: 'google_chat' | 'microsoft_teams' | 'both' | 'internal';
      workspaceId?: string;
      channelMappings: Array<{
        internalChannelId: string;
        externalChannelId: string;
      }>;
    };
    aiUsagePolicy: {
      allowMembersToUseTeamAI: boolean;
      maxQueriesPerMemberPerDay: number;
      requireApprovalForExpensiveQueries: boolean;
    };
  };
  usage: {
    totalAIQueries: number;
    totalCost: number;
    documentsCreated: number;
    messagesPosted: number;
  };
}

const Teams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'documents' | 'members' | 'settings'>('workspace');
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [selectedDocument, setSelectedDocument] = useState<SharedDocument | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showCreateDocModal, setShowCreateDocModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock data
  const mockTeam: Team = {
    id: '1',
    name: 'ทีมวิจัยและพัฒนา AI',
    description: 'ทีมสำหรับการวิจัยและพัฒนาเทคโนโลยี AI เพื่อการทำงานร่วมกันอย่างมีประสิทธิภาพ',
    createdDate: new Date('2024-01-01'),
    members: [
      {
        id: '1',
        name: 'นาย A (หัวหน้าทีม)',
        email: 'team.leader@company.com',
        role: 'team_leader',
        status: 'online',
        joinDate: new Date('2024-01-01'),
        lastActive: new Date(),
        hasPersonalAPI: true,
        personalQuotaRemaining: 0, // ไม่จำกัด
        permissions: {
          canCreateDocuments: true,
          canEditSharedDocuments: true,
          canInviteMembers: true,
          canUseTeamAI: true
        },
        contributionStats: {
          documentsCreated: 15,
          documentsEdited: 28,
          messagesPosted: 156,
          aiQueriesUsed: 89
        }
      },
      {
        id: '2',
        name: 'คุณสมชาย นักวิจัย',
        email: 'somchai@company.com',
        role: 'member',
        status: 'online',
        joinDate: new Date('2024-01-05'),
        lastActive: new Date(Date.now() - 300000),
        hasPersonalAPI: true,
        personalQuotaRemaining: 45,
        permissions: {
          canCreateDocuments: true,
          canEditSharedDocuments: true,
          canInviteMembers: false,
          canUseTeamAI: true
        },
        contributionStats: {
          documentsCreated: 8,
          documentsEdited: 12,
          messagesPosted: 89,
          aiQueriesUsed: 34
        }
      },
      {
        id: '3',
        name: 'คุณปัทมา นักวิเคราะห์',
        email: 'patma@company.com',
        role: 'member',
        status: 'away',
        joinDate: new Date('2024-01-08'),
        lastActive: new Date(Date.now() - 1800000),
        hasPersonalAPI: false,
        personalQuotaRemaining: 0,
        permissions: {
          canCreateDocuments: false,
          canEditSharedDocuments: true,
          canInviteMembers: false,
          canUseTeamAI: false
        },
        contributionStats: {
          documentsCreated: 3,
          documentsEdited: 18,
          messagesPosted: 67,
          aiQueriesUsed: 0
        }
      },
      {
        id: '4',
        name: 'คุณอนุชา ผู้ช่วยวิจัย',
        email: 'anucha@company.com',
        role: 'member',
        status: 'busy',
        joinDate: new Date('2024-01-12'),
        lastActive: new Date(Date.now() - 600000),
        hasPersonalAPI: true,
        personalQuotaRemaining: 12,
        permissions: {
          canCreateDocuments: true,
          canEditSharedDocuments: true,
          canInviteMembers: false,
          canUseTeamAI: true
        },
        contributionStats: {
          documentsCreated: 5,
          documentsEdited: 9,
          messagesPosted: 45,
          aiQueriesUsed: 23
        }
      }
    ],
    channels: [
      {
        id: 'general',
        name: 'ทั่วไป',
        description: 'ช่องสำหรับการสนทนาทั่วไป',
        type: 'general',
        linkedDocuments: [],
        memberCount: 4,
        unreadCount: 3,
        lastMessage: {
          content: 'ผลการวิเคราะห์ออกมาแล้วครับ ดูในเอกสาร "รายงานการวิจัย AI Q1"',
          sender: 'นาย A',
          timestamp: new Date(Date.now() - 300000)
        },
        isPrivate: false
      },
      {
        id: 'ai-research',
        name: 'วิจัย AI',
        description: 'ช่องสำหรับหารือเรื่องการวิจัย AI',
        type: 'ai_research',
        linkedDocuments: ['doc1', 'doc2'],
        memberCount: 3,
        unreadCount: 1,
        lastMessage: {
          content: 'ข้อมูลที่ได้จาก GPT-4 น่าสนใจมาก ลองดูในเอกสารครับ',
          sender: 'คุณสมชาย',
          timestamp: new Date(Date.now() - 1800000)
        },
        isPrivate: false
      },
      {
        id: 'documents',
        name: 'เอกสารร่วม',
        description: 'ช่องสำหรับหารือเกี่ยวกับเอกสารที่แชร์',
        type: 'document',
        linkedDocuments: ['doc1', 'doc2', 'doc3'],
        memberCount: 4,
        unreadCount: 0,
        isPrivate: false
      }
    ],
    sharedDocuments: [
      {
        id: 'doc1',
        title: 'รายงานการวิจัย AI Q1 2024',
        type: 'google_doc',
        url: 'https://docs.google.com/document/d/example1',
        createdBy: '1',
        createdDate: new Date('2024-01-15'),
        lastModified: new Date('2024-01-16'),
        lastModifiedBy: '2',
        accessLevel: 'edit',
        linkedChannels: ['ai-research', 'documents'],
        aiGenerated: true,
        aiModel: 'GPT-4',
        aiCost: 2.45,
        status: 'approved',
        collaborators: [
          { userId: '1', permission: 'edit', lastAccessed: new Date() },
          { userId: '2', permission: 'edit', lastAccessed: new Date(Date.now() - 300000) },
          { userId: '3', permission: 'comment', lastAccessed: new Date(Date.now() - 1800000) },
          { userId: '4', permission: 'view', lastAccessed: new Date(Date.now() - 3600000) }
        ],
        comments: [
          {
            id: 'c1',
            userId: '2',
            content: 'ข้อมูลในส่วนที่ 3 น่าสนใจมาก ควรขยายความเพิ่มเติม',
            timestamp: new Date(Date.now() - 7200000),
            resolved: false
          }
        ],
        versions: [
          {
            id: 'v1',
            version: 1,
            createdBy: '1',
            createdDate: new Date('2024-01-15'),
            changes: 'สร้างเอกสารเริ่มต้น'
          },
          {
            id: 'v2',
            version: 2,
            createdBy: '2',
            createdDate: new Date('2024-01-16'),
            changes: 'เพิ่มข้อมูลการวิเคราะห์'
          }
        ]
      },
      {
        id: 'doc2',
        title: 'แผนการพัฒนา AI Tools',
        type: 'microsoft_word',
        url: 'https://office.com/document/example2',
        createdBy: '1',
        createdDate: new Date('2024-01-10'),
        lastModified: new Date('2024-01-14'),
        lastModifiedBy: '4',
        accessLevel: 'comment',
        linkedChannels: ['ai-research'],
        aiGenerated: false,
        status: 'review',
        collaborators: [
          { userId: '1', permission: 'edit', lastAccessed: new Date(Date.now() - 86400000) },
          { userId: '4', permission: 'edit', lastAccessed: new Date(Date.now() - 3600000) }
        ],
        comments: [],
        versions: []
      },
      {
        id: 'doc3',
        title: 'สรุปผลการทดสอบ AI Models',
        type: 'internal_doc',
        content: 'เนื้อหาเอกสารภายใน...',
        createdBy: '2',
        createdDate: new Date('2024-01-12'),
        lastModified: new Date('2024-01-13'),
        lastModifiedBy: '2',
        accessLevel: 'view',
        linkedChannels: ['documents'],
        aiGenerated: true,
        aiModel: 'Claude 3.5',
        aiCost: 1.23,
        status: 'draft',
        collaborators: [
          { userId: '2', permission: 'edit', lastAccessed: new Date() }
        ],
        comments: [],
        versions: []
      }
    ],
    settings: {
      allowPersonalAPI: true,
      autoShareAIResults: true,
      requireApprovalForDocuments: false,
      chatIntegration: {
        platform: 'google_chat',
        workspaceId: 'workspace123',
        channelMappings: []
      },
      aiUsagePolicy: {
        allowMembersToUseTeamAI: true,
        maxQueriesPerMemberPerDay: 50,
        requireApprovalForExpensiveQueries: true
      }
    },
    usage: {
      totalAIQueries: 146,
      totalCost: 28.45,
      documentsCreated: 31,
      messagesPosted: 357
    }
  };

  const [team] = useState<Team>(mockTeam);

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      channelId: 'general',
      senderId: '1',
      content: 'สวัสดีครับทุกคน วันนี้เราจะเริ่มโปรเจกต์วิจัย AI ใหม่',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      reactions: [
        { emoji: '👍', users: ['2', '3'] },
        { emoji: '🎉', users: ['4'] }
      ],
      replies: [],
      isEdited: false,
      isPinned: true
    },
    {
      id: '2',
      channelId: 'general',
      senderId: '2',
      content: 'ผมได้ทำการค้นหาข้อมูลเบื้องต้นแล้ว ผลลัพธ์น่าสนใจมาก',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      reactions: [],
      replies: [],
      isEdited: false,
      isPinned: false
    },
    {
      id: '3',
      channelId: 'general',
      senderId: '1',
      content: 'ผลการวิเคราะห์ออกมาแล้วครับ ดูในเอกสาร "รายงานการวิจัย AI Q1"',
      timestamp: new Date(Date.now() - 300000),
      type: 'document_share',
      attachments: [
        {
          type: 'document',
          name: 'รายงานการวิจัย AI Q1 2024',
          url: 'doc1'
        }
      ],
      reactions: [
        { emoji: '📄', users: ['2', '3', '4'] }
      ],
      replies: [],
      isEdited: false,
      isPinned: false
    }
  ];

  useEffect(() => {
    setChatMessages(mockMessages.filter(msg => msg.channelId === selectedChannel));
  }, [selectedChannel]);

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
      case 'team_leader': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'co_leader': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'team_leader': return 'หัวหน้าทีม';
      case 'co_leader': return 'รองหัวหน้าทีม';
      case 'member': return 'สมาชิก';
      default: return 'ไม่ทราบ';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'google_doc': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'microsoft_word': return <FileText className="h-4 w-4 text-blue-800" />;
      case 'internal_doc': return <FileText className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'ร่าง';
      case 'review': return 'รอตรวจสอบ';
      case 'approved': return 'อนุมัติแล้ว';
      case 'archived': return 'เก็บถาวร';
      default: return 'ไม่ทราบ';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      channelId: selectedChannel,
      senderId: '1', // Current user
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      reactions: [],
      replies: [],
      isEdited: false,
      isPinned: false
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onlineMembers = team.members.filter(member => member.status === 'online');
  const selectedChannelData = team.channels.find(ch => ch.id === selectedChannel);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-7 w-7 mr-3 text-blue-600" />
              {team.name}
            </h1>
            <p className="text-gray-600 text-sm mt-1">{team.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">
                {onlineMembers.length} คนออนไลน์
              </span>
            </div>
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
            { id: 'workspace', label: 'พื้นที่ทำงาน', icon: MessageSquare },
            { id: 'documents', label: 'เอกสารร่วม', icon: FileText },
            { id: 'members', label: 'สมาชิก', icon: Users },
            { id: 'settings', label: 'ตั้งค่า', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'workspace' && (
          <div className="h-full flex">
            {/* Channels Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">ช่องสนทนา</h3>
                <div className="space-y-1">
                  {team.channels.map((channel) => (
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
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Online Members */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">สมาชิกออนไลน์</h3>
                <div className="space-y-2">
                  {onlineMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                        <p className="text-xs text-gray-500">{getRoleLabel(member.role)}</p>
                      </div>
                      {member.role === 'team_leader' && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
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
                    <Hash className="h-5 w-5 text-gray-500" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedChannelData?.name}</h2>
                      <p className="text-sm text-gray-600">{selectedChannelData?.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Linked Documents */}
                {selectedChannelData?.linkedDocuments && selectedChannelData.linkedDocuments.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">เอกสารที่เชื่อมโยง</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedChannelData.linkedDocuments.map((docId) => {
                        const doc = team.sharedDocuments.find(d => d.id === docId);
                        return doc ? (
                          <button
                            key={docId}
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentModal(true);
                            }}
                            className="text-xs bg-white text-blue-700 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                          >
                            {doc.title}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((message) => {
                  const sender = team.members.find(m => m.id === message.senderId);
                  return (
                    <div key={message.id} className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        {sender && (
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(sender.status)} rounded-full border-2 border-white`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{sender?.name}</span>
                          {sender?.role === 'team_leader' && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString('th-TH', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.isPinned && (
                            <Flag className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-700 mb-2">{message.content}</div>
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="space-y-2 mb-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border">
                                {getDocumentTypeIcon(attachment.type)}
                                <span className="text-sm text-gray-700">{attachment.name}</span>
                                <button className="text-blue-600 hover:text-blue-700 text-sm">
                                  เปิด
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reactions */}
                        {message.reactions.length > 0 && (
                          <div className="flex items-center space-x-1 mb-2">
                            {message.reactions.map((reaction, index) => (
                              <button
                                key={index}
                                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                <span className="text-sm">{reaction.emoji}</span>
                                <span className="text-xs text-gray-600">{reaction.users.length}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Image className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Mic className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`ส่งข้อความไปยัง #${selectedChannelData?.name}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={1}
                    />
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              {/* Documents Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">เอกสารร่วม</h2>
                  <p className="text-gray-600 text-sm mt-1">เอกสารที่แชร์ภายในทีมและเชื่อมโยงกับช่องสนทนา</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาเอกสาร..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowCreateDocModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    สร้างเอกสาร
                  </button>
                </div>
              </div>

              {/* Document Integration Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900">Google Docs</h3>
                      <p className="text-sm text-blue-700">แก้ไขร่วมกันแบบ Real-time</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    เชื่อมต่อ Google Docs
                  </button>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-indigo-500 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-indigo-900">Microsoft Word</h3>
                      <p className="text-sm text-indigo-700">ใช้งาน Office 365</p>
                    </div>
                  </div>
                  <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                    เชื่อมต่อ Office 365
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-gray-500 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">เอกสารภายใน</h3>
                      <p className="text-sm text-gray-700">สร้างและแก้ไขในระบบ</p>
                    </div>
                  </div>
                  <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    สร้างเอกสารใหม่
                  </button>
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-4">
                {team.sharedDocuments
                  .filter(doc => 
                    searchQuery === '' || 
                    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((doc) => {
                    const creator = team.members.find(m => m.id === doc.createdBy);
                    const lastEditor = team.members.find(m => m.id === doc.lastModifiedBy);
                    
                    return (
                      <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="flex-shrink-0">
                              {getDocumentTypeIcon(doc.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-medium text-gray-900 truncate">{doc.title}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDocumentStatusColor(doc.status)}`}>
                                  {getDocumentStatusLabel(doc.status)}
                                </span>
                                {doc.aiGenerated && (
                                  <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                    <Brain className="h-3 w-3" />
                                    <span>AI Generated</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  สร้างโดย {creator?.name}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {doc.lastModified.toLocaleDateString('th-TH')}
                                </span>
                                <span className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {doc.collaborators.length} คนร่วมงาน
                                </span>
                                {doc.comments.length > 0 && (
                                  <span className="flex items-center">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {doc.comments.length} ความคิดเห็น
                                  </span>
                                )}
                              </div>

                              {/* Linked Channels */}
                              {doc.linkedChannels.length > 0 && (
                                <div className="flex items-center space-x-2 mb-3">
                                  <span className="text-sm text-gray-600">เชื่อมโยงกับ:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {doc.linkedChannels.map((channelId) => {
                                      const channel = team.channels.find(ch => ch.id === channelId);
                                      return channel ? (
                                        <span key={channelId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                          #{channel.name}
                                        </span>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* AI Info */}
                              {doc.aiGenerated && doc.aiModel && (
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Brain className="h-3 w-3 mr-1" />
                                    {doc.aiModel}
                                  </span>
                                  {doc.aiCost && (
                                    <span>ค่าใช้จ่าย: ฿{doc.aiCost.toFixed(2)}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowDocumentModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {doc.url && (
                              <button
                                onClick={() => window.open(doc.url, '_blank')}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            )}
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {team.members.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                            {getRoleIcon(member.role)}
                          </div>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              member.status === 'online' ? 'bg-green-100 text-green-800' :
                              member.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                              member.status === 'busy' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {getStatusLabel(member.status)}
                            </span>
                            <span className="text-xs text-gray-500">{getRoleLabel(member.role)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Member Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">เอกสาร</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600">
                          {member.contributionStats.documentsCreated}
                        </p>
                        <p className="text-xs text-blue-700">สร้าง / {member.contributionStats.documentsEdited} แก้ไข</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">ข้อความ</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          {member.contributionStats.messagesPosted}
                        </p>
                      </div>
                    </div>

                    {/* API Status */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">API ส่วนตัว:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          member.hasPersonalAPI ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {member.hasPersonalAPI ? 'มี' : 'ไม่มี'}
                        </span>
                      </div>
                      
                      {member.hasPersonalAPI && member.role !== 'team_leader' && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">โควต้าคงเหลือ:</span>
                          <span className={`text-sm font-medium ${
                            member.personalQuotaRemaining > 20 ? 'text-green-600' :
                            member.personalQuotaRemaining > 5 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {member.personalQuotaRemaining} คำขอ
                          </span>
                        </div>
                      )}

                      {member.role === 'team_leader' && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">สิทธิพิเศษ:</span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            ไม่จำกัดโควต้า
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">AI ที่ใช้:</span>
                        <span className="text-sm text-gray-600">
                          {member.contributionStats.aiQueriesUsed} คำขอ
                        </span>
                      </div>
                    </div>

                    {/* Member Actions */}
                    <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                      <button className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                        ส่งข้อความ
                      </button>
                      {member.role !== 'team_leader' && (
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
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
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Team Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">การตั้งค่าทีม</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">อนุญาตให้สมาชิกใช้ API ส่วนตัว</span>
                      <p className="text-xs text-gray-500">สมาชิกสามารถใช้ API Key ของตัวเองได้</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">แชร์ผลลัพธ์ AI อัตโนมัติ</span>
                      <p className="text-xs text-gray-500">ผลลัพธ์จาก AI จะถูกแชร์ให้ทีมโดยอัตโนมัติ</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Integration */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">การเชื่อมต่อแชท</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">แพลตฟอร์มแชท</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="google_chat">Google Chat</option>
                      <option value="microsoft_teams">Microsoft Teams</option>
                      <option value="both">ทั้งคู่</option>
                      <option value="internal">ระบบภายในเท่านั้น</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workspace ID</label>
                    <input
                      type="text"
                      placeholder="ระบุ Workspace ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    เชื่อมต่อ
                  </button>
                </div>
              </div>

              {/* AI Usage Policy */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">นโยบายการใช้ AI</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนคำขอสูงสุดต่อวัน (ต่อคน)</label>
                    <input
                      type="number"
                      defaultValue={50}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">ต้องอนุมัติสำหรับคำขอที่มีค่าใช้จ่ายสูง</span>
                      <p className="text-xs text-gray-500">คำขอที่มีค่าใช้จ่ายเกิน ฿1 ต้องได้รับอนุมัติ</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Usage Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปการใช้งานทีม</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">AI Queries</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{team.usage.totalAIQueries}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">เอกสาร</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{team.usage.documentsCreated}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">ข้อความ</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{team.usage.messagesPosted}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">สมาชิก</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{team.members.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getDocumentTypeIcon(selectedDocument.type)}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedDocument.title}</h3>
                  <p className="text-sm text-gray-600">
                    สร้างโดย {team.members.find(m => m.id === selectedDocument.createdBy)?.name} • 
                    {selectedDocument.createdDate.toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Document Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">สถานะ</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDocumentStatusColor(selectedDocument.status)}`}>
                      {getDocumentStatusLabel(selectedDocument.status)}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">ผู้ร่วมงาน</p>
                    <p className="font-semibold text-gray-900">{selectedDocument.collaborators.length} คน</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">ความคิดเห็น</p>
                    <p className="font-semibold text-gray-900">{selectedDocument.comments.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">เวอร์ชัน</p>
                    <p className="font-semibold text-gray-900">{selectedDocument.versions.length}</p>
                  </div>
                </div>

                {/* AI Info */}
                {selectedDocument.aiGenerated && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="text-sm font-medium text-purple-900 mb-2">ข้อมูล AI</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-purple-700">AI Model</p>
                        <p className="font-semibold text-purple-900">{selectedDocument.aiModel}</p>
                      </div>
                      <div>
                        <p className="text-purple-700">ค่าใช้จ่าย</p>
                        <p className="font-semibold text-purple-900">฿{selectedDocument.aiCost?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                {selectedDocument.type === 'internal_doc' && selectedDocument.content && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">เนื้อหา</h4>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {selectedDocument.content}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {selectedDocument.comments.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">ความคิดเห็น</h4>
                    <div className="space-y-3">
                      {selectedDocument.comments.map((comment) => {
                        const commenter = team.members.find(m => m.id === comment.userId);
                        return (
                          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900">{commenter?.name}</span>
                              <span className="text-xs text-gray-500">
                                {comment.timestamp.toLocaleDateString('th-TH')}
                              </span>
                              {!comment.resolved && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  รอแก้ไข
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  {selectedDocument.url && (
                    <button
                      onClick={() => window.open(selectedDocument.url, '_blank')}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      เปิดเอกสาร
                    </button>
                  )}
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="h-4 w-4 mr-2" />
                    แชร์
                  </button>
                </div>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ปิด
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