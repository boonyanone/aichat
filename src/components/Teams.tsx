import React, { useState, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Crown, 
  Shield, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  BarChart3,
  FileText,
  MessageSquare,
  CreditCard,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Share2,
  Download,
  Upload,
  Star,
  Award,
  Target,
  TrendingUp,
  Activity,
  Zap,
  Brain,
  Globe,
  Building,
  GraduationCap,
  Briefcase,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  X,
  Send,
  Link,
  ExternalLink,
  Bookmark,
  Flag,
  Bell,
  BellOff,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  UserMinus,
  Loader,
  RefreshCw
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  joinDate: Date;
  lastActive: Date;
  department?: string;
  position?: string;
  phone?: string;
  permissions: {
    canInvite: boolean;
    canManageDocuments: boolean;
    canViewAnalytics: boolean;
    canManageBilling: boolean;
    canDeleteContent: boolean;
  };
  usage: {
    totalRequests: number;
    totalCost: number;
    favoriteModel: string;
    lastUsed: Date;
  };
}

interface Team {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  createdDate: Date;
  memberCount: number;
  plan: 'free' | 'pro' | 'enterprise';
  usage: {
    totalCredits: number;
    usedCredits: number;
    totalRequests: number;
    totalDocuments: number;
    totalMeetings: number;
  };
  settings: {
    allowInvites: boolean;
    requireApproval: boolean;
    defaultRole: 'member' | 'viewer';
    billingEmail: string;
  };
}

interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invitedBy: string;
  invitedDate: Date;
  status: 'pending' | 'accepted' | 'expired';
  expiryDate: Date;
}

const Teams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'invitations' | 'usage' | 'settings'>('members');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockTeam: Team = {
    id: '1',
    name: 'ทีมวิจัยและพัฒนา AI',
    description: 'ทีมงานที่ทำงานด้านการวิจัยและพัฒนาเทคโนโลยี AI สำหรับองค์กร',
    createdDate: new Date('2024-01-01'),
    memberCount: 8,
    plan: 'pro',
    usage: {
      totalCredits: 50000,
      usedCredits: 32500,
      totalRequests: 2847,
      totalDocuments: 156,
      totalMeetings: 23
    },
    settings: {
      allowInvites: true,
      requireApproval: false,
      defaultRole: 'member',
      billingEmail: 'admin@company.com'
    }
  };

  const mockMembers: TeamMember[] = [
    {
      id: '1',
      name: 'คุณสมชาย วิทยากร',
      email: 'somchai@company.com',
      role: 'owner',
      status: 'active',
      joinDate: new Date('2024-01-01'),
      lastActive: new Date(),
      department: 'วิจัยและพัฒนา',
      position: 'หัวหน้าทีม',
      phone: '081-234-5678',
      permissions: {
        canInvite: true,
        canManageDocuments: true,
        canViewAnalytics: true,
        canManageBilling: true,
        canDeleteContent: true
      },
      usage: {
        totalRequests: 856,
        totalCost: 127.50,
        favoriteModel: 'GPT-4',
        lastUsed: new Date()
      }
    },
    {
      id: '2',
      name: 'คุณปัทมา ธุรกิจ',
      email: 'patma@company.com',
      role: 'admin',
      status: 'active',
      joinDate: new Date('2024-01-05'),
      lastActive: new Date(Date.now() - 3600000),
      department: 'การตลาด',
      position: 'ผู้จัดการโครงการ',
      phone: '082-345-6789',
      permissions: {
        canInvite: true,
        canManageDocuments: true,
        canViewAnalytics: true,
        canManageBilling: false,
        canDeleteContent: false
      },
      usage: {
        totalRequests: 642,
        totalCost: 89.25,
        favoriteModel: 'Claude 3.5',
        lastUsed: new Date(Date.now() - 3600000)
      }
    },
    {
      id: '3',
      name: 'คุณอนุชา นักศึกษา',
      email: 'anucha@university.ac.th',
      role: 'member',
      status: 'active',
      joinDate: new Date('2024-01-10'),
      lastActive: new Date(Date.now() - 7200000),
      department: 'วิจัย',
      position: 'นักศึกษาปริญญาโท',
      permissions: {
        canInvite: false,
        canManageDocuments: true,
        canViewAnalytics: false,
        canManageBilling: false,
        canDeleteContent: false
      },
      usage: {
        totalRequests: 423,
        totalCost: 45.80,
        favoriteModel: 'Gemini Pro',
        lastUsed: new Date(Date.now() - 7200000)
      }
    },
    {
      id: '4',
      name: 'คุณวิชัย เทคนิค',
      email: 'wichai@company.com',
      role: 'member',
      status: 'active',
      joinDate: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 86400000),
      department: 'เทคโนโลยี',
      position: 'นักพัฒนาระบบ',
      permissions: {
        canInvite: false,
        canManageDocuments: true,
        canViewAnalytics: false,
        canManageBilling: false,
        canDeleteContent: false
      },
      usage: {
        totalRequests: 298,
        totalCost: 38.90,
        favoriteModel: 'Claude 3.5',
        lastUsed: new Date(Date.now() - 86400000)
      }
    },
    {
      id: '5',
      name: 'คุณสุดา วิเคราะห์',
      email: 'suda@company.com',
      role: 'viewer',
      status: 'pending',
      joinDate: new Date('2024-01-20'),
      lastActive: new Date(Date.now() - 172800000),
      department: 'วิเคราะห์',
      position: 'นักวิเคราะห์ข้อมูล',
      permissions: {
        canInvite: false,
        canManageDocuments: false,
        canViewAnalytics: false,
        canManageBilling: false,
        canDeleteContent: false
      },
      usage: {
        totalRequests: 156,
        totalCost: 18.75,
        favoriteModel: 'Perplexity',
        lastUsed: new Date(Date.now() - 172800000)
      }
    }
  ];

  const mockInvitations: Invitation[] = [
    {
      id: '1',
      email: 'newmember@company.com',
      role: 'member',
      invitedBy: 'คุณสมชาย วิทยากร',
      invitedDate: new Date(Date.now() - 86400000),
      status: 'pending',
      expiryDate: new Date(Date.now() + 6 * 86400000)
    },
    {
      id: '2',
      email: 'analyst@company.com',
      role: 'viewer',
      invitedBy: 'คุณปัทมา ธุรกิจ',
      invitedDate: new Date(Date.now() - 172800000),
      status: 'pending',
      expiryDate: new Date(Date.now() + 5 * 86400000)
    }
  ];

  React.useEffect(() => {
    setCurrentTeam(mockTeam);
    setMembers(mockMembers);
    setInvitations(mockInvitations);
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'member':
        return <User className="h-4 w-4 text-green-500" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'เจ้าของ';
      case 'admin':
        return 'ผู้ดูแล';
      case 'member':
        return 'สมาชิก';
      case 'viewer':
        return 'ผู้ดู';
      default:
        return 'ไม่ระบุ';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'ใช้งานอยู่';
      case 'pending':
        return 'รอการยืนยัน';
      case 'inactive':
        return 'ไม่ใช้งาน';
      default:
        return 'ไม่ระบุ';
    }
  };

  const formatLastActive = (date: Date) => {
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

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newInvitation: Invitation = {
        id: Date.now().toString(),
        email: inviteEmail,
        role: inviteRole,
        invitedBy: 'คุณสมชาย วิทยากร',
        invitedDate: new Date(),
        status: 'pending',
        expiryDate: new Date(Date.now() + 7 * 86400000)
      };
      
      setInvitations(prev => [...prev, newInvitation]);
      setInviteEmail('');
      setInviteRole('member');
      setInviteMessage('');
      setShowInviteModal(false);
      setIsLoading(false);
    }, 1500);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'ฟรี';
      case 'pro':
        return 'โปร';
      case 'enterprise':
        return 'องค์กร';
      default:
        return 'ไม่ระบุ';
    }
  };

  if (!currentTeam) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลดข้อมูลทีม...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentTeam.name}</h1>
              <p className="text-gray-600 text-sm">{currentTeam.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(currentTeam.plan)}`}>
              แพ็คเกจ {getPlanLabel(currentTeam.plan)}
            </span>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              เชิญสมาชิก
            </button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">สมาชิก</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{currentTeam.memberCount}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">คำขอ</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{currentTeam.usage.totalRequests.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-600">เอกสาร</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{currentTeam.usage.totalDocuments}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-600">ประชุม</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{currentTeam.usage.totalMeetings}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-600">เครดิต</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {(currentTeam.usage.totalCredits - currentTeam.usage.usedCredits).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'members', label: 'สมาชิก', icon: Users },
            { id: 'invitations', label: 'คำเชิญ', icon: Mail },
            { id: 'usage', label: 'การใช้งาน', icon: BarChart3 },
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
                {tab.id === 'invitations' && invitations.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {invitations.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'members' && (
          <div>
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาสมาชิก..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">บทบาททั้งหมด</option>
                <option value="owner">เจ้าของ</option>
                <option value="admin">ผู้ดูแล</option>
                <option value="member">สมาชิก</option>
                <option value="viewer">ผู้ดู</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="active">ใช้งานอยู่</option>
                <option value="pending">รอการยืนยัน</option>
                <option value="inactive">ไม่ใช้งาน</option>
              </select>
            </div>

            {/* Members List */}
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          {getRoleIcon(member.role)}
                          <span className="text-sm text-gray-600">{getRoleLabel(member.role)}</span>
                          {getStatusIcon(member.status)}
                          <span className="text-sm text-gray-600">{getStatusLabel(member.status)}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {member.email}
                            </div>
                            {member.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                {member.phone}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              {member.department} - {member.position}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              เข้าร่วม: {member.joinDate.toLocaleDateString('th-TH')}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              ใช้งานล่าสุด: {formatLastActive(member.lastActive)}
                            </div>
                            <div className="flex items-center">
                              <Brain className="h-4 w-4 mr-2" />
                              AI ที่ใช้บ่อย: {member.usage.favoriteModel}
                            </div>
                          </div>
                        </div>

                        {/* Usage Stats */}
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-800">คำขอ</span>
                            </div>
                            <p className="text-lg font-semibold text-blue-900">{member.usage.totalRequests.toLocaleString()}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-800">ค่าใช้จ่าย</span>
                            </div>
                            <p className="text-lg font-semibold text-green-900">฿{member.usage.totalCost.toFixed(2)}</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Activity className="h-4 w-4 text-purple-600" />
                              <span className="text-sm text-purple-800">ประสิทธิภาพ</span>
                            </div>
                            <p className="text-lg font-semibold text-purple-900">
                              {member.usage.totalRequests > 0 ? (member.usage.totalCost / member.usage.totalRequests * 100).toFixed(1) : '0'}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowMemberModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'invitations' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">คำเชิญที่รอการตอบรับ</h2>
              
              {invitations.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีคำเชิญที่รอการตอบรับ</h3>
                  <p className="text-gray-600 mb-6">เชิญสมาชิกใหม่เข้าร่วมทีมของคุณ</p>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    เชิญสมาชิกใหม่
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="bg-white rounded-xl border border-gray-200 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Mail className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{invitation.email}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>บทบาท: {getRoleLabel(invitation.role)}</span>
                              <span>เชิญโดย: {invitation.invitedBy}</span>
                              <span>วันที่เชิญ: {invitation.invitedDate.toLocaleDateString('th-TH')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            invitation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            invitation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {invitation.status === 'pending' ? 'รอการตอบรับ' :
                             invitation.status === 'accepted' ? 'ยอมรับแล้ว' : 'หมดอายุ'}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">การใช้งานของทีม</h2>
            
            {/* Usage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">เครดิตคงเหลือ</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {(currentTeam.usage.totalCredits - currentTeam.usage.usedCredits).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentTeam.usage.totalCredits - currentTeam.usage.usedCredits) / currentTeam.usage.totalCredits) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  ใช้ไป {currentTeam.usage.usedCredits.toLocaleString()} จาก {currentTeam.usage.totalCredits.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">คำขอทั้งหมด</h3>
                    <p className="text-2xl font-bold text-green-600">{currentTeam.usage.totalRequests.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">เดือนนี้</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">เอกสารที่วิเคราะห์</h3>
                    <p className="text-2xl font-bold text-purple-600">{currentTeam.usage.totalDocuments}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">เดือนนี้</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">การประชุม</h3>
                    <p className="text-2xl font-bold text-orange-600">{currentTeam.usage.totalMeetings}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">เดือนนี้</p>
              </div>
            </div>

            {/* Top Users */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">สมาชิกที่ใช้งานมากที่สุด</h3>
              <div className="space-y-4">
                {members
                  .sort((a, b) => b.usage.totalRequests - a.usage.totalRequests)
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                          <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{member.usage.totalRequests.toLocaleString()} คำขอ</p>
                        <p className="text-sm text-gray-600">฿{member.usage.totalCost.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">ตั้งค่าทีม</h2>
            
            <div className="space-y-6">
              {/* Team Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลทีม</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อทีม</label>
                    <input
                      type="text"
                      value={currentTeam.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                    <textarea
                      value={currentTeam.description}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Invitation Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">การตั้งค่าคำเชิญ</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">อนุญาตให้สมาชิกเชิญคนอื่น</p>
                      <p className="text-sm text-gray-600">สมาชิกสามารถเชิญคนอื่นเข้าร่วมทีมได้</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">ต้องการการอนุมัติ</p>
                      <p className="text-sm text-gray-600">คำเชิญต้องได้รับการอนุมัติจากผู้ดูแล</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">บทบาทเริ่มต้น</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="viewer">ผู้ดู</option>
                      <option value="member">สมาชิก</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Billing Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">การตั้งค่าการเรียกเก็บเงิน</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">อีเมลสำหรับใบเสร็จ</label>
                    <input
                      type="email"
                      value={currentTeam.settings.billingEmail}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">แพ็คเกจปัจจุบัน: {getPlanLabel(currentTeam.plan)}</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      คุณสามารถอัปเกรดหรือดาวน์เกรดแพ็คเกจได้ตามความต้องการ
                    </p>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      จัดการแพ็คเกจ
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl border border-red-200 p-6">
                <h3 className="text-lg font-medium text-red-900 mb-4">โซนอันตราย</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">ลบทีม</p>
                      <p className="text-sm text-red-700">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      ลบทีม
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  บันทึกการเปลี่ยนแปลง
                </button>
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
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="example@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">บทบาท</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="viewer">ผู้ดู - ดูข้อมูลได้อย่างเดียว</option>
                  <option value="member">สมาชิก - ใช้งานฟีเจอร์พื้นฐานได้</option>
                  <option value="admin">ผู้ดูแล - จัดการทีมและสมาชิกได้</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ (ไม่บังคับ)</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="เขียนข้อความเชิญ..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleInviteMember}
                  disabled={!inviteEmail.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      กำลังส่ง...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      ส่งคำเชิญ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedMember.name}</h3>
                  <p className="text-sm text-gray-600">{selectedMember.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMemberModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลพื้นฐาน</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">บทบาท</label>
                      <select
                        value={selectedMember.role}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="viewer">ผู้ดู</option>
                        <option value="member">สมาชิก</option>
                        <option value="admin">ผู้ดูแล</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                      <select
                        value={selectedMember.status}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">ใช้งานอยู่</option>
                        <option value="inactive">ไม่ใช้งาน</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">สิทธิ์การใช้งาน</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedMember.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          {key === 'canInvite' ? 'เชิญสมาชิกใหม่' :
                           key === 'canManageDocuments' ? 'จัดการเอกสาร' :
                           key === 'canViewAnalytics' ? 'ดูรายงานการใช้งาน' :
                           key === 'canManageBilling' ? 'จัดการการเรียกเก็บเงิน' :
                           key === 'canDeleteContent' ? 'ลบเนื้อหา' : key}
                        </span>
                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Statistics */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">สstatistics การใช้งาน</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">คำขอทั้งหมด</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{selectedMember.usage.totalRequests.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">ค่าใช้จ่าย</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">฿{selectedMember.usage.totalCost.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between">
                <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <UserMinus className="h-4 w-4 mr-2" />
                  ลบออกจากทีม
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowMemberModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    บันทึกการเปลี่ยนแปลง
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;