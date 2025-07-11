import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Settings, 
  Crown, 
  Shield, 
  User, 
  Eye,
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Video, 
  BarChart3,
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Plus, 
  X, 
  Save, 
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
  Lock, 
  Unlock, 
  UserCheck, 
  UserX, 
  UserMinus,
  ChevronDown,
  ChevronUp,
  Building,
  Briefcase,
  GraduationCap,
  RefreshCw,
  Bell,
  BellOff,
  Lightbulb,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  avatar?: string;
  position: string;
  department: string;
  joinDate: Date;
  lastActive: Date;
  credits: {
    used: number;
    limit: number;
  };
  usage: {
    documents: number;
    meetings: number;
    chats: number;
    reports: number;
  };
  permissions: {
    documents: 'none' | 'read' | 'write' | 'admin';
    meetings: 'none' | 'read' | 'write' | 'admin';
    chat: 'none' | 'read' | 'write' | 'admin';
    reports: 'none' | 'read' | 'write' | 'admin';
    settings: 'none' | 'read' | 'write' | 'admin';
    billing: 'none' | 'read' | 'write' | 'admin';
    members: 'none' | 'read' | 'write' | 'admin';
    analytics: 'none' | 'read' | 'write' | 'admin';
    templates: 'none' | 'read' | 'write' | 'admin';
  };
}

interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
}

interface TeamSettings {
  name: string;
  description: string;
  type: 'company' | 'department' | 'project' | 'other';
  allowInvitations: boolean;
  requireApproval: boolean;
  sharedCredits: boolean;
  dataRetention: number; // days
  defaultRole: 'member' | 'viewer';
}

const Teams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'permissions' | 'usage' | 'invitations' | 'settings'>('overview');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberDetail, setShowMemberDetail] = useState<string | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [teamSettings, setTeamSettings] = useState<TeamSettings>({
    name: 'ทีม ThaiAI',
    description: 'ทีมพัฒนาและใช้งาน AI สำหรับองค์กร',
    type: 'company',
    allowInvitations: true,
    requireApproval: false,
    sharedCredits: true,
    dataRetention: 90,
    defaultRole: 'member'
  });

  // Mock data
  const mockMembers: TeamMember[] = [
    {
      id: '1',
      name: 'คุณสมชาย วิทยากร',
      email: 'somchai@company.com',
      role: 'owner',
      status: 'active',
      position: 'ผู้อำนวยการ',
      department: 'บริหาร',
      joinDate: new Date('2024-01-01'),
      lastActive: new Date(),
      credits: { used: 2450, limit: 10000 },
      usage: { documents: 45, meetings: 12, chats: 89, reports: 23 },
      permissions: {
        documents: 'admin',
        meetings: 'admin',
        chat: 'admin',
        reports: 'admin',
        settings: 'admin',
        billing: 'admin',
        members: 'admin',
        analytics: 'admin',
        templates: 'admin'
      }
    },
    {
      id: '2',
      name: 'คุณปัทมา ธุรกิจ',
      email: 'patma@company.com',
      role: 'admin',
      status: 'active',
      position: 'ผู้จัดการโครงการ',
      department: 'IT',
      joinDate: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      credits: { used: 1890, limit: 5000 },
      usage: { documents: 32, meetings: 8, chats: 67, reports: 15 },
      permissions: {
        documents: 'admin',
        meetings: 'admin',
        chat: 'write',
        reports: 'write',
        settings: 'read',
        billing: 'read',
        members: 'write',
        analytics: 'read',
        templates: 'write'
      }
    },
    {
      id: '3',
      name: 'คุณอนุชา นักวิจัย',
      email: 'anucha@company.com',
      role: 'member',
      status: 'active',
      position: 'นักวิจัย',
      department: 'R&D',
      joinDate: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      credits: { used: 1234, limit: 3000 },
      usage: { documents: 28, meetings: 5, chats: 45, reports: 12 },
      permissions: {
        documents: 'write',
        meetings: 'write',
        chat: 'write',
        reports: 'read',
        settings: 'none',
        billing: 'none',
        members: 'read',
        analytics: 'none',
        templates: 'read'
      }
    },
    {
      id: '4',
      name: 'คุณสุดา การตลาด',
      email: 'suda@company.com',
      role: 'member',
      status: 'inactive',
      position: 'นักการตลาด',
      department: 'การตลาด',
      joinDate: new Date('2024-02-15'),
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      credits: { used: 567, limit: 2000 },
      usage: { documents: 15, meetings: 2, chats: 23, reports: 5 },
      permissions: {
        documents: 'read',
        meetings: 'read',
        chat: 'write',
        reports: 'none',
        settings: 'none',
        billing: 'none',
        members: 'read',
        analytics: 'none',
        templates: 'read'
      }
    },
    {
      id: '5',
      name: 'คุณวิชัย เทคโนโลยี',
      email: 'wichai@company.com',
      role: 'viewer',
      status: 'pending',
      position: 'นักพัฒนา',
      department: 'IT',
      joinDate: new Date('2024-03-01'),
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      credits: { used: 123, limit: 1000 },
      usage: { documents: 5, meetings: 1, chats: 12, reports: 2 },
      permissions: {
        documents: 'read',
        meetings: 'read',
        chat: 'read',
        reports: 'none',
        settings: 'none',
        billing: 'none',
        members: 'read',
        analytics: 'none',
        templates: 'read'
      }
    }
  ];

  const mockInvitations: TeamInvitation[] = [
    {
      id: '1',
      email: 'newmember@company.com',
      role: 'member',
      invitedBy: 'คุณสมชาย วิทยากร',
      invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'pending',
      message: 'ยินดีต้อนรับเข้าสู่ทีม ThaiAI'
    },
    {
      id: '2',
      email: 'consultant@external.com',
      role: 'viewer',
      invitedBy: 'คุณปัทมา ธุรกิจ',
      invitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'pending'
    }
  ];

  useEffect(() => {
    setMembers(mockMembers);
    setInvitations(mockInvitations);
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin': return <Shield className="h-4 w-4 text-purple-600" />;
      case 'member': return <User className="h-4 w-4 text-blue-600" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'เจ้าของ';
      case 'admin': return 'ผู้ดูแล';
      case 'member': return 'สมาชิก';
      case 'viewer': return 'ผู้ดู';
      default: return 'ไม่ระบุ';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'ใช้งาน';
      case 'inactive': return 'ไม่ใช้งาน';
      case 'pending': return 'รอดำเนินการ';
      case 'suspended': return 'ระงับ';
      default: return 'ไม่ระบุ';
    }
  };

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case 'admin': return 'ผู้ดูแล';
      case 'write': return 'เขียน';
      case 'read': return 'อ่าน';
      case 'none': return 'ไม่มี';
      default: return 'ไม่ระบุ';
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'write': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'none': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  const teamStats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    totalCreditsUsed: members.reduce((sum, m) => sum + m.credits.used, 0),
    totalCreditsLimit: members.reduce((sum, m) => sum + m.credits.limit, 0)
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-7 w-7 mr-3 text-blue-600" />
              ทีม
            </h1>
            <p className="text-gray-600 text-sm mt-1">จัดการสมาชิกทีมและสิทธิ์การเข้าถึง</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              เชิญสมาชิก
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'ภาพรวม', icon: BarChart3 },
            { id: 'members', label: 'สมาชิก', icon: Users },
            { id: 'permissions', label: 'สิทธิ์การเข้าถึง', icon: Shield },
            { id: 'usage', label: 'การใช้งาน', icon: Activity },
            { id: 'invitations', label: 'คำเชิญ', icon: Mail },
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
        {activeTab === 'overview' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">สมาชิกทั้งหมด</p>
                      <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">สมาชิกที่ใช้งาน</p>
                      <p className="text-2xl font-bold text-gray-900">{teamStats.activeMembers}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">เครดิตที่ใช้</p>
                      <p className="text-2xl font-bold text-gray-900">{teamStats.totalCreditsUsed.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <CreditCard className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">เครดิตคงเหลือ</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(teamStats.totalCreditsLimit - teamStats.totalCreditsUsed).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Activity Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">การใช้งานรายเดือน</h3>
                  <div className="space-y-4">
                    {['เอกสาร', 'ประชุม', 'แชท', 'รายงาน'].map((category, index) => {
                      const values = [120, 85, 200, 45];
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`${colors[index]} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${(values[index] / 250) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8">{values[index]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">สมาชิกตามแผนก</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'IT', count: 2, color: 'bg-blue-500' },
                      { name: 'บริหาร', count: 1, color: 'bg-purple-500' },
                      { name: 'R&D', count: 1, color: 'bg-green-500' },
                      { name: 'การตลาด', count: 1, color: 'bg-orange-500' }
                    ].map((dept) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                          <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{dept.count} คน</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">กิจกรรมล่าสุด</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    { action: 'เข้าร่วมทีม', user: 'คุณวิชัย เทคโนโลยี', time: '2 ชั่วโมงที่แล้ว', icon: UserPlus, color: 'text-green-600' },
                    { action: 'ใช้งาน Chat AI', user: 'คุณอนุชา นักวิจัย', time: '4 ชั่วโมงที่แล้ว', icon: MessageSquare, color: 'text-blue-600' },
                    { action: 'อัปโหลดเอกสาร', user: 'คุณปัทมา ธุรกิจ', time: '6 ชั่วโมงที่แล้ว', icon: FileText, color: 'text-purple-600' },
                    { action: 'สร้างรายงาน', user: 'คุณสมชาย วิทยากร', time: '1 วันที่แล้ว', icon: BarChart3, color: 'text-orange-600' }
                  ].map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gray-100`}>
                            <Icon className={`h-4 w-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.user} {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="h-full flex flex-col">
            {/* Filters */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาสมาชิก..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                  <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">บทบาททั้งหมด</option>
                    <option value="owner">เจ้าของ</option>
                    <option value="admin">ผู้ดูแล</option>
                    <option value="member">สมาชิก</option>
                    <option value="viewer">ผู้ดู</option>
                  </select>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="active">ใช้งาน</option>
                    <option value="inactive">ไม่ใช้งาน</option>
                    <option value="pending">รอดำเนินการ</option>
                    <option value="suspended">ระงับ</option>
                  </select>
                </div>

                {selectedMembers.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">เลือก {selectedMembers.length} คน</span>
                    <button 
                      onClick={() => setShowBulkActions(!showBulkActions)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      การดำเนินการ
                    </button>
                  </div>
                )}
              </div>

              {/* Bulk Actions */}
              {showBulkActions && selectedMembers.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <button className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                      เปิดใช้งาน
                    </button>
                    <button className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors">
                      ปิดใช้งาน
                    </button>
                    <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
                      เปลี่ยนบทบาท
                    </button>
                    <button className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                      ลบออกจากทีม
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Select All */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      เลือกทั้งหมด ({filteredMembers.length} คน)
                    </span>
                  </label>
                </div>

                {/* Member Cards */}
                {filteredMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(member.role)}
                              <span className="text-sm font-medium text-gray-600">{getRoleLabel(member.role)}</span>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                              {getStatusLabel(member.status)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium">อีเมล:</span> {member.email}
                            </div>
                            <div>
                              <span className="font-medium">ตำแหน่ง:</span> {member.position}
                            </div>
                            <div>
                              <span className="font-medium">แผนก:</span> {member.department}
                            </div>
                            <div>
                              <span className="font-medium">เข้าร่วม:</span> {member.joinDate.toLocaleDateString('th-TH')}
                            </div>
                          </div>

                          {/* Usage Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                              <div className="text-lg font-semibold text-blue-900">{member.usage.documents}</div>
                              <div className="text-xs text-blue-600">เอกสาร</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <Video className="h-5 w-5 text-green-600 mx-auto mb-1" />
                              <div className="text-lg font-semibold text-green-900">{member.usage.meetings}</div>
                              <div className="text-xs text-green-600">ประชุม</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <MessageSquare className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                              <div className="text-lg font-semibold text-purple-900">{member.usage.chats}</div>
                              <div className="text-xs text-purple-600">แชท</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <BarChart3 className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                              <div className="text-lg font-semibold text-orange-900">{member.usage.reports}</div>
                              <div className="text-xs text-orange-600">รายงาน</div>
                            </div>
                          </div>

                          {/* Credits */}
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">เครดิต</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                  {member.credits.used.toLocaleString()} / {member.credits.limit.toLocaleString()}
                                </div>
                                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(member.credits.used / member.credits.limit) * 100}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {Math.round((member.credits.used / member.credits.limit) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setShowMemberDetail(member.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Edit3 className="h-4 w-4" />
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
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">ตารางสิทธิ์การเข้าถึง</h3>
                  <p className="text-sm text-gray-600 mt-1">จัดการสิทธิ์การเข้าถึงฟีเจอร์ต่างๆ สำหรับแต่ละบทบาท</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ฟีเจอร์
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          เจ้าของ
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ผู้ดูแล
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สมาชิก
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ผู้ดู
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { name: 'เอกสาร', icon: FileText, permissions: ['admin', 'admin', 'write', 'read'] },
                        { name: 'ประชุม', icon: Video, permissions: ['admin', 'admin', 'write', 'read'] },
                        { name: 'แชท AI', icon: MessageSquare, permissions: ['admin', 'write', 'write', 'read'] },
                        { name: 'รายงาน', icon: BarChart3, permissions: ['admin', 'write', 'read', 'none'] },
                        { name: 'ตั้งค่า', icon: Settings, permissions: ['admin', 'read', 'none', 'none'] },
                        { name: 'การเงิน', icon: CreditCard, permissions: ['admin', 'read', 'none', 'none'] },
                        { name: 'สมาชิก', icon: Users, permissions: ['admin', 'write', 'read', 'read'] },
                        { name: 'การวิเคราะห์', icon: TrendingUp, permissions: ['admin', 'read', 'none', 'none'] },
                        { name: 'เทมเพลต', icon: Star, permissions: ['admin', 'write', 'read', 'read'] }
                      ].map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Icon className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                              </div>
                            </td>
                            {feature.permissions.map((permission, permIndex) => (
                              <td key={permIndex} className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPermissionColor(permission)}`}>
                                  {getPermissionLabel(permission)}
                                </span>
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      <span className="text-gray-600">ผู้ดูแล - สามารถจัดการและควบคุมได้เต็มที่</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-gray-600">เขียน - สามารถสร้างและแก้ไขได้</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-gray-600">อ่าน - สามารถดูได้เท่านั้น</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full" />
                      <span className="text-gray-600">ไม่มี - ไม่สามารถเข้าถึงได้</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Usage Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">เอกสารทั้งหมด</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {members.reduce((sum, m) => sum + m.usage.documents, 0)}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ประชุมทั้งหมด</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {members.reduce((sum, m) => sum + m.usage.meetings, 0)}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Video className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">แชททั้งหมด</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {members.reduce((sum, m) => sum + m.usage.chats, 0)}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">รายงานทั้งหมด</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {members.reduce((sum, m) => sum + m.usage.reports, 0)}
                      </p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Member Usage Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">การใช้งานรายบุคคล</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สมาชิก
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          เครดิต
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          เอกสาร
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ประชุม
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          แชท
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          รายงาน
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ใช้งานล่าสุด
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {members.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {member.credits.used.toLocaleString()}
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-1 mx-auto mt-1">
                              <div 
                                className="bg-blue-500 h-1 rounded-full"
                                style={{ width: `${(member.credits.used / member.credits.limit) * 100}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                            {member.usage.documents}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                            {member.usage.meetings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                            {member.usage.chats}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                            {member.usage.reports}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            {member.lastActive.toLocaleDateString('th-TH')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Pending Invitations */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">คำเชิญที่รอดำเนินการ</h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      {invitations.filter(inv => inv.status === 'pending').length} คำเชิญ
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {invitations.filter(inv => inv.status === 'pending').map((invitation) => (
                    <div key={invitation.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Mail className="h-5 w-5 text-blue-600" />
                            <span className="text-lg font-medium text-gray-900">{invitation.email}</span>
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(invitation.role)}
                              <span className="text-sm font-medium text-gray-600">{getRoleLabel(invitation.role)}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">เชิญโดย:</span> {invitation.invitedBy}
                            </div>
                            <div>
                              <span className="font-medium">วันที่เชิญ:</span> {invitation.invitedAt.toLocaleDateString('th-TH')}
                            </div>
                            <div>
                              <span className="font-medium">หมดอายุ:</span> {invitation.expiresAt.toLocaleDateString('th-TH')}
                            </div>
                          </div>
                          {invitation.message && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">{invitation.message}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                            ส่งใหม่
                          </button>
                          <button className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invitation History */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">ประวัติคำเชิญ</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{invitation.email}</div>
                            <div className="text-sm text-gray-500">
                              เชิญโดย {invitation.invitedBy} • {invitation.invitedAt.toLocaleDateString('th-TH')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(invitation.role)}
                            <span className="text-sm text-gray-600">{getRoleLabel(invitation.role)}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            invitation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            invitation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            invitation.status === 'declined' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {invitation.status === 'pending' ? 'รอดำเนินการ' :
                             invitation.status === 'accepted' ? 'ยอมรับ' :
                             invitation.status === 'declined' ? 'ปฏิเสธ' : 'หมดอายุ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Team Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">ข้อมูลทีม</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อทีม</label>
                    <input
                      type="text"
                      value={teamSettings.name}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                    <textarea
                      value={teamSettings.description}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ประเภททีม</label>
                    <select
                      value={teamSettings.type}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="company">บริษัท</option>
                      <option value="department">แผนก</option>
                      <option value="project">โครงการ</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Access Control */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">การควบคุมการเข้าถึง</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">อนุญาตให้สมาชิกเชิญคนอื่น</h4>
                      <p className="text-sm text-gray-500">สมาชิกสามารถเชิญคนอื่นเข้าร่วมทีมได้</p>
                    </div>
                    <button 
                      onClick={() => setTeamSettings(prev => ({ ...prev, allowInvitations: !prev.allowInvitations }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        teamSettings.allowInvitations ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        teamSettings.allowInvitations ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">ต้องการการอนุมัติ</h4>
                      <p className="text-sm text-gray-500">คำเชิญต้องได้รับการอนุมัติจากผู้ดูแล</p>
                    </div>
                    <button 
                      onClick={() => setTeamSettings(prev => ({ ...prev, requireApproval: !prev.requireApproval }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        teamSettings.requireApproval ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        teamSettings.requireApproval ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">แชร์เครดิต</h4>
                      <p className="text-sm text-gray-500">สมาชิกใช้เครดิตร่วมกันจากพูลเดียว</p>
                    </div>
                    <button 
                      onClick={() => setTeamSettings(prev => ({ ...prev, sharedCredits: !prev.sharedCredits }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        teamSettings.sharedCredits ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        teamSettings.sharedCredits ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">บทบาทเริ่มต้น</label>
                    <select
                      value={teamSettings.defaultRole}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, defaultRole: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="member">สมาชิก</option>
                      <option value="viewer">ผู้ดู</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ระยะเวลาเก็บข้อมูล (วัน)</label>
                    <input
                      type="number"
                      value={teamSettings.dataRetention}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">ข้อมูลจะถูกลบอัตโนมัติหลังจากระยะเวลาที่กำหนด</p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl shadow-sm border border-red-200">
                <div className="p-6 border-b border-red-200">
                  <h3 className="text-lg font-semibold text-red-900">โซนอันตราย</h3>
                  <p className="text-sm text-red-600 mt-1">การดำเนินการเหล่านี้ไม่สามารถย้อนกลับได้</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-red-900">ลบทีม</h4>
                      <p className="text-sm text-red-600">ลบทีมและข้อมูลทั้งหมดอย่างถาวร</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      ลบทีม
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">เชิญสมาชิกใหม่</h3>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                <input
                  type="email"
                  placeholder="example@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">บทบาท</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="member">สมาชิก</option>
                  <option value="admin">ผู้ดูแล</option>
                  <option value="viewer">ผู้ดู</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ (ไม่บังคับ)</label>
                <textarea
                  placeholder="ยินดีต้อนรับเข้าสู่ทีม..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                ส่งคำเชิญ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {showMemberDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const member = members.find(m => m.id === showMemberDetail);
              if (!member) return null;
              
              return (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">รายละเอียดสมาชิก</h3>
                      <button 
                        onClick={() => setShowMemberDetail(null)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Member Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-gray-600">{member.position} • {member.department}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleIcon(member.role)}
                          <span className="text-sm font-medium text-gray-600">{getRoleLabel(member.role)}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                            {getStatusLabel(member.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                        <p className="text-sm text-gray-900">{member.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เข้าร่วม</label>
                        <p className="text-sm text-gray-900">{member.joinDate.toLocaleDateString('th-TH')}</p>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">สถิติการใช้งาน</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                          <div className="text-lg font-semibold text-blue-900">{member.usage.documents}</div>
                          <div className="text-xs text-blue-600">เอกสาร</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <Video className="h-5 w-5 text-green-600 mx-auto mb-1" />
                          <div className="text-lg font-semibold text-green-900">{member.usage.meetings}</div>
                          <div className="text-xs text-green-600">ประชุม</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                          <div className="text-lg font-semibold text-purple-900">{member.usage.chats}</div>
                          <div className="text-xs text-purple-600">แชท</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                          <div className="text-lg font-semibold text-orange-900">{member.usage.reports}</div>
                          <div className="text-xs text-orange-600">รายงาน</div>
                        </div>
                      </div>
                    </div>

                    {/* Credits */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">เครดิต</h5>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">ใช้แล้ว</span>
                          <span className="text-sm font-medium text-gray-900">
                            {member.credits.used.toLocaleString()} / {member.credits.limit.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(member.credits.used / member.credits.limit) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round((member.credits.used / member.credits.limit) * 100)}% ของขีดจำกัด
                        </div>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">สิทธิ์การเข้าถึง</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(member.permissions).map(([key, permission]) => (
                          <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700 capitalize">{key}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPermissionColor(permission)}`}>
                              {getPermissionLabel(permission)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      ส่งข้อความ
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      จัดการสิทธิ์
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;