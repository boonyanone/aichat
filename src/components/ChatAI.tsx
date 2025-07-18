import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Image, 
  Mic, 
  History, 
  X, 
  Copy, 
  Share2, 
  Download,
  Save,
  ChevronDown,
  Bot,
  Zap,
  Brain,
  Globe,
  Sparkles,
  GraduationCap,
  Briefcase,
  Building,
  FlaskConical,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Star,
  Bookmark,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Menu,
  PanelRightOpen,
  PanelRightClose
  UserPlus,
  Video,
  Phone,
  Mail,
  Circle,
  Wifi,
  WifiOff,
  Crown,
  Shield,
  Eye,
  Settings,
  LogOut,
  Bell,
  BellOff,
  Link,
  Calendar,
  MapPin,
  Briefcase as BriefcaseIcon,
  GraduationCap as GradIcon,
  Building as BuildingIcon
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  aiModel?: string;
  cost?: number;
  sources?: Array<{
    title: string;
    url: string;
    relevance: number;
    credibility: number;
    snippet: string;
  }>;
  followUpQuestions?: string[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: 'owner' | 'admin' | 'member' | 'viewer';
  department?: string;
  position?: string;
  lastSeen?: Date;
  isInCurrentChat: boolean;
  provider: 'google' | 'microsoft' | 'local';
  timezone?: string;
  workingHours?: {
    start: string;
    end: string;
  };
}

interface ChatInvitation {
  id: string;
  fromUser: string;
  toUser: string;
  chatTitle: string;
  message?: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  aiModel: string;
  totalCost: number;
  lastUpdated: Date;
  messageCount: number;
  participants?: string[];
}

const aiModels = [
  { 
    id: 'gpt-4', 
    name: 'GPT-4', 
    icon: Bot, 
    color: 'text-green-600', 
    cost: 0.03, 
    description: 'ดีที่สุดสำหรับงานซับซ้อน',
    specialty: 'การเขียน, การวิเคราะห์'
  },
  { 
    id: 'claude', 
    name: 'Claude', 
    icon: Brain, 
    color: 'text-orange-600', 
    cost: 0.025, 
    description: 'เก่งการอ่านเอกสารยาว',
    specialty: 'การวิเคราะห์เอกสาร'
  },
  { 
    id: 'gemini', 
    name: 'Gemini', 
    icon: Sparkles, 
    color: 'text-blue-600', 
    cost: 0.02, 
    description: 'รวดเร็วและประหยัด',
    specialty: 'คำถามทั่วไป'
  },
  { 
    id: 'perplexity', 
    name: 'Perplexity', 
    icon: Globe, 
    color: 'text-purple-600', 
    cost: 0.035, 
    description: 'ค้นหาข้อมูลล่าสุด',
    specialty: 'ข้อมูลปัจจุบัน'
  },
  { 
    id: 'router', 
    name: 'AI Router', 
    icon: Zap, 
    color: 'text-yellow-600', 
    cost: 0.015, 
    description: 'เลือก AI ที่เหมาะสมอัตโนมัติ',
    specialty: 'ประหยัดสุด'
  }
];

const personas = [
  {
    id: 'student',
    name: 'นักเรียน/นักศึกษา',
    icon: GraduationCap,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    templates: [
      'อธิบายแนวคิดทางวิทยาศาสตร์ให้เข้าใจง่าย',
      'ช่วยทำการบ้านคณิตศาสตร์',
      'สรุปเนื้อหาบทเรียนประวัติศาสตร์'
    ]
  },
  {
    id: 'employee',
    name: 'พนักงาน',
    icon: Briefcase,
    color: 'bg-green-50 text-green-700 border-green-200',
    templates: [
      'เขียนอีเมลติดต่อลูกค้าอย่างมืออาชีพ',
      'วิเคราะห์ข้อมูลยอดขายประจำเดือน',
      'จัดทำแผนการทำงานรายสัปดาห์'
    ]
  },
  {
    id: 'government',
    name: 'ข้าราชการ',
    icon: Building,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    templates: [
      'ร่างหนังสือราชการตามระเบียบ',
      'วิเคราะห์นโยบายสาธารณะ',
      'จัดทำรายงานการประเมินโครงการ'
    ]
  },
  {
    id: 'researcher',
    name: 'นักวิจัย',
    icon: FlaskConical,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    templates: [
      'ค้นหาเอกสารวิชาการที่เกี่ยวข้อง',
      'วิเคราะห์ข้อมูลการวิจัยเชิงสถิติ',
      'เขียนบทคัดย่อของงานวิจัย'
    ]
  },
  {
    id: 'business',
    name: 'ธุรกิจ',
    icon: TrendingUp,
    color: 'bg-red-50 text-red-700 border-red-200',
    templates: [
      'วิเคราะห์คู่แข่งในตลาด',
      'จัดทำแผนธุรกิจสำหรับสตาร์ทอัพ',
      'คำนวณ ROI ของโครงการลงทุน'
    ]
  },
  {
    id: 'organization',
    name: 'หน่วยงาน/องค์กร',
    icon: Users,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    templates: [
      'วิเคราะห์นโยบายองค์กร',
      'จัดทำแผนกลยุทธ์ระยะยาว',
      'ประเมินความเสี่ยงองค์กร'
    ]
  },
  {
    id: 'general',
    name: 'ทั่วไป',
    icon: MessageSquare,
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    templates: [
      'คำถามทั่วไปเกี่ยวกับชีวิตประจำวัน',
      'ขอคำแนะนำในการตัดสินใจ',
      'แก้ปัญหาเบื้องต้น'
    ]
  }
];

const mockChatHistory: ChatHistory[] = [
  {
    id: '1',
    title: 'วิเคราะห์ตลาดหุ้นไทย',
    messages: [],
    aiModel: 'GPT-4',
    totalCost: 0.15,
    lastUpdated: new Date(),
    messageCount: 8
  },
  {
    id: '2',
    title: 'เขียนรายงานการประชุม',
    messages: [],
    aiModel: 'Claude',
    totalCost: 0.08,
    lastUpdated: new Date(Date.now() - 86400000),
    messageCount: 5
  },
  {
    id: '3',
    title: 'แปลเอกสารภาษาอังกฤษ',
    messages: [],
    aiModel: 'Gemini',
    totalCost: 0.05,
    lastUpdated: new Date(Date.now() - 172800000),
    messageCount: 3
  },
  {
    id: '4',
    title: 'สรุปบทความวิจัย AI',
    messages: [],
    aiModel: 'Claude',
    totalCost: 0.12,
    lastUpdated: new Date(Date.now() - 259200000),
    messageCount: 6
  },
  {
    id: '5',
    title: 'เขียนโค้ด Python',
    messages: [],
    aiModel: 'GPT-4',
    totalCost: 0.18,
    lastUpdated: new Date(Date.now() - 345600000),
    messageCount: 10
  }
];

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedAI, setSelectedAI] = useState(aiModels[4]); // AI Router as default
  const [selectedPersona, setSelectedPersona] = useState(personas[6]); // General as default
  const [isLoading, setIsLoading] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(mockChatHistory);
  const [searchHistory, setSearchHistory] = useState('');
  const [showTeamSidebar, setShowTeamSidebar] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [chatInvitations, setChatInvitations] = useState<ChatInvitation[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [inviteMessage, setInviteMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock team members data
  const mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'คุณสมชาย วิทยากร',
      email: 'somchai@company.com',
      status: 'online',
      role: 'owner',
      department: 'วิจัยและพัฒนา',
      position: 'หัวหน้าทีม',
      isInCurrentChat: false,
      provider: 'google',
      timezone: 'Asia/Bangkok',
      workingHours: { start: '09:00', end: '18:00' }
    },
    {
      id: '2',
      name: 'คุณปัทมา ธุรกิจ',
      email: 'patma@company.com',
      status: 'online',
      role: 'admin',
      department: 'การตลาด',
      position: 'ผู้จัดการโครงการ',
      isInCurrentChat: true,
      provider: 'microsoft',
      lastSeen: new Date(Date.now() - 300000),
      workingHours: { start: '08:30', end: '17:30' }
    },
    {
      id: '3',
      name: 'คุณอนุชา นักศึกษา',
      email: 'anucha@university.ac.th',
      status: 'away',
      role: 'member',
      department: 'วิจัย',
      position: 'นักศึกษาปริญญาโท',
      isInCurrentChat: false,
      provider: 'google',
      lastSeen: new Date(Date.now() - 1800000),
      workingHours: { start: '10:00', end: '16:00' }
    },
    {
      id: '4',
      name: 'คุณวิชัย เทคนิค',
      email: 'wichai@company.com',
      status: 'busy',
      role: 'member',
      department: 'เทคโนโลยี',
      position: 'นักพัฒนาระบบ',
      isInCurrentChat: false,
      provider: 'microsoft',
      lastSeen: new Date(Date.now() - 600000),
      workingHours: { start: '09:00', end: '18:00' }
    },
    {
      id: '5',
      name: 'คุณสุดา วิเคราะห์',
      email: 'suda@company.com',
      status: 'offline',
      role: 'viewer',
      department: 'วิเคราะห์',
      position: 'นักวิเคราะห์ข้อมูล',
      isInCurrentChat: false,
      provider: 'google',
      lastSeen: new Date(Date.now() - 7200000),
      workingHours: { start: '08:00', end: '17:00' }
    }
  ];

  const mockInvitations: ChatInvitation[] = [
    {
      id: '1',
      fromUser: 'คุณปัทมา ธุรกิจ',
      toUser: 'คุณสมชาย วิทยากร',
      chatTitle: 'วิเคราะห์ตลาดหุ้นไทย',
      message: 'มาช่วยวิเคราะห์ข้อมูลตลาดหุ้นด้วยกันครับ',
      timestamp: new Date(Date.now() - 300000),
      status: 'pending'
    }
  ];

  useEffect(() => {
    setTeamMembers(mockTeamMembers);
    setChatInvitations(mockInvitations);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `ตอบคำถาม: "${inputValue}" โดยใช้ ${selectedAI.name}

นี่คือคำตอบที่ครอบคลุมและมีประโยชน์สำหรับคำถามของคุณ ซึ่งได้รับการวิเคราะห์และประมวลผลโดย AI ที่เหมาะสมที่สุด

**จุดสำคัญ:**
• ข้อมูลที่ถูกต้องและเป็นปัจจุบัน
• การวิเคราะห์เชิงลึกจากแหล่งข้อมูลที่น่าเชื่อถือ
• คำแนะนำที่เป็นประโยชน์และนำไปใช้ได้จริง

**สรุป:**
คำตอบนี้ได้รับการปรับแต่งให้เหมาะสมกับบทบาท "${selectedPersona.name}" และใช้ความสามารถของ ${selectedAI.name} ในการให้คำตอบที่มีคุณภาพสูง`,
        isUser: false,
        timestamp: new Date(),
        aiModel: selectedAI.name,
        cost: selectedAI.cost,
        sources: [
          { 
            title: 'Wikipedia - ข้อมูลพื้นฐาน', 
            url: 'https://th.wikipedia.org', 
            relevance: 95,
            credibility: 88,
            snippet: 'ข้อมูลพื้นฐานที่ครอบคลุมและได้รับการตรวจสอบจากชุมชน'
          },
          { 
            title: 'งานวิจัยวิชาการ - Journal', 
            url: 'https://academic-journal.com', 
            relevance: 92,
            credibility: 95,
            snippet: 'งานวิจัยที่ผ่านการตรวจสอบโดยผู้เชี่ยวชาญ (Peer Review)'
          },
          { 
            title: 'ข่าวสารล่าสุด - News Portal', 
            url: 'https://news-portal.com', 
            relevance: 85,
            credibility: 78,
            snippet: 'ข้อมูลข่าวสารที่เป็นปัจจุบันและมีการอัปเดตสม่ำเสมอ'
          }
        ],
        followUpQuestions: [
          'ขยายความเพิ่มเติมเกี่ยวกับหัวข้อนี้',
          'มีตัวอย่างการใช้งานจริงหรือไม่?',
          'แนวโน้มในอนาคตจะเป็นอย่างไร?',
          'มีข้อควรระวังหรือข้อจำกัดอะไรบ้าง?'
        ]
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTemplateClick = (template: string) => {
    setInputValue(template);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFollowUpClick = (question: string) => {
    setInputValue(question);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getCredibilityColor = (credibility: number) => {
    if (credibility >= 90) return 'text-green-600 bg-green-50';
    if (credibility >= 80) return 'text-blue-600 bg-blue-50';
    if (credibility >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCredibilityLabel = (credibility: number) => {
    if (credibility >= 90) return 'น่าเชื่อถือมาก';
    if (credibility >= 80) return 'น่าเชื่อถือ';
    if (credibility >= 70) return 'น่าเชื่อถือปานกลาง';
    return 'ควรตรวจสอบเพิ่มเติม';
  };

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  const startNewChat = () => {
    setMessages([]);
    setSelectedPersona(personas[6]); // Reset to general
    setShowHistorySidebar(false);
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
      case 'member': return <Users className="h-3 w-3 text-green-500" />;
      case 'viewer': return <Eye className="h-3 w-3 text-gray-500" />;
      default: return null;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return '🔵'; // Google
      case 'microsoft': return '🟦'; // Microsoft
      case 'local': return '⚪'; // Local
      default: return '⚪';
    }
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return date.toLocaleDateString('th-TH');
  };

  const handleInviteToChat = () => {
    if (selectedMembers.length === 0) return;
    
    // Simulate sending invitations
    const newInvitations = selectedMembers.map(memberId => ({
      id: Date.now().toString() + memberId,
      fromUser: 'คุณ',
      toUser: teamMembers.find(m => m.id === memberId)?.name || '',
      chatTitle: messages.length > 0 ? 'การสนทนา AI' : 'แชทใหม่',
      message: inviteMessage,
      timestamp: new Date(),
      status: 'pending' as const
    }));
    
    setChatInvitations(prev => [...prev, ...newInvitations]);
    setSelectedMembers([]);
    setInviteMessage('');
    setShowInviteModal(false);
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const onlineMembers = teamMembers.filter(m => m.status === 'online' || m.status === 'away');
  const currentChatParticipants = teamMembers.filter(m => m.isInCurrentChat);

  return (
    <div className="h-full flex bg-gray-50 relative">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="h-7 w-7 mr-3 text-blue-600" />
                Chat AI
              </h1>
              <p className="text-gray-600 text-sm mt-1">สนทนากับ AI หลายโมเดลในที่เดียว</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={startNewChat}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                แชทใหม่
              </button>
              <button
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showHistorySidebar 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <History className="h-4 w-4 mr-2" />
                ประวัติ
              </button>
              <button
                onClick={() => setShowTeamSidebar(!showTeamSidebar)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showTeamSidebar 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                ทีม ({onlineMembers.length})
              </button>
            </div>
          </div>

          {/* Current Chat Participants */}
          {currentChatParticipants.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">กำลังร่วมแชท ({currentChatParticipants.length + 1})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">คุณ</span>
                  </div>
                </div>
                {currentChatParticipants.map((member) => (
                  <div key={member.id} className="flex items-center space-x-1">
                    <div className="relative">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{member.name.charAt(2)}</span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="h-3 w-3 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome Screen */}
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="max-w-4xl w-full">
                {/* Team Collaboration Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-8 border border-blue-200">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">ทำงานร่วมกันกับทีม</h3>
                      <p className="text-gray-700 mb-3">
                        เชิญสมาชิกในทีมมาร่วมสนทนากับ AI ได้แบบเรียลไทม์ ดูสถานะออนไลน์ผ่าน Google/Microsoft
                      </p>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setShowInviteModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          เชิญเข้าร่วมแชท
                        </button>
                        <button
                          onClick={() => setShowTeamSidebar(true)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          ดูทีม ({onlineMembers.length} ออนไลน์)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                  showHistorySidebar 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <History className="h-4 w-4 mr-2" />
                ประวัติ
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="max-w-4xl w-full">
                {/* Persona Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">เลือกบทบาทของคุณ</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {personas.map((persona) => {
                      const IconComponent = persona.icon;
                      return (
                        <button
                          key={persona.id}
                          onClick={() => setSelectedPersona(persona)}
                          className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                            selectedPersona.id === persona.id
                              ? persona.color
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <IconComponent className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-xs font-medium text-center">{persona.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Templates */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    เทมเพลตสำหรับ {selectedPersona.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedPersona.templates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleTemplateClick(template)}
                        className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
                      >
                        <div className="text-sm text-gray-700 group-hover:text-blue-700">
                          {template}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl w-full ${message.isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-sm`}>
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500">
                        <Bot className="w-4 h-4" />
                        <span>{message.aiModel}</span>
                        {message.cost && (
                          <>
                            <span>•</span>
                            <span>฿{message.cost.toFixed(3)}</span>
                          </>
                        )}
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    
                    {/* Sources */}
                    {message.sources && (
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <ExternalLink className="w-4 h-4" />
                          <span>แหล่งข้อมูลอ้างอิง</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {message.sources.map((source, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">{source.title}</h4>
                                  <p className="text-xs text-gray-500 truncate">{source.url}</p>
                                </div>
                                <div className="flex items-center space-x-2 ml-2">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCredibilityColor(source.credibility)}`}>
                                    {getCredibilityLabel(source.credibility)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">{source.snippet}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">ความเกี่ยวข้อง:</span>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${source.relevance}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500">{source.relevance}%</span>
                                  </div>
                                </div>
                                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                                  <ExternalLink className="w-3 h-3" />
                                  <span>เปิด</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Follow-up Questions */}
                    {message.followUpQuestions && (
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <MessageSquare className="w-4 h-4" />
                          <span>คำถามต่อเนื่อง</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {message.followUpQuestions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleFollowUpClick(question)}
                              className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 hover:border-blue-300 transition-all group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800 group-hover:text-blue-900">{question}</span>
                                <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {!message.isUser && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(message.content)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>คัดลอก</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Share2 className="w-3 h-3" />
                            <span>แชร์</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bookmark className="w-3 h-3" />
                            <span>บุ๊กมาร์ก</span>
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-3 h-3" />
                            <span>ดาวน์โหลด</span>
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-3xl w-full">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500">กำลังค้นหาและวิเคราะห์ข้อมูล...</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto p-6">
            {/* AI Selector */}
            <div className="mb-4">
              <div className="relative">
                <button
                  onClick={() => setShowAIDropdown(!showAIDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-200"
                >
                  <selectedAI.icon className={`w-4 h-4 ${selectedAI.color}`} />
                  <span className="font-medium">{selectedAI.name}</span>
                  <span className="text-gray-500">฿{selectedAI.cost.toFixed(3)}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showAIDropdown && (
                  <div className="absolute bottom-full mb-2 left-0 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-10">
                    {aiModels.map((model) => {
                      const IconComponent = model.icon;
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedAI(model);
                            setShowAIDropdown(false);
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                            selectedAI.id === model.id ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${model.color}`} />
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{model.name}</span>
                              <span className="text-sm text-gray-500">฿{model.cost.toFixed(3)}</span>
                            </div>
                            <div className="text-sm text-gray-500">{model.description}</div>
                            <div className="text-xs text-gray-400">{model.specialty}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Input Box */}
            <div className="relative">
              <div className="flex items-end space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Image className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="ถามอะไรก็ได้กับ AI..."
                  className="flex-1 bg-transparent border-none outline-none resize-none min-h-[24px] max-h-32 text-gray-900 placeholder-gray-500"
                  rows={1}
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Sidebar - Left Side */}
      {showTeamSidebar && (
        <>
          {/* Overlay for mobile */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowTeamSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">ทีมของคุณ</h3>
                <button
                  onClick={() => setShowTeamSidebar(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {onlineMembers.length} คนออนไลน์จาก {teamMembers.length} คน
              </p>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => setShowInviteModal(true)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                เชิญเข้าร่วมแชท
              </button>
            </div>

            {/* Online Members */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">ออนไลน์ ({onlineMembers.length})</h4>
                <div className="space-y-2">
                  {onlineMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        member.isInCurrentChat 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-sm text-white font-medium">{member.name.charAt(2)}</span>
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                            {getRoleIcon(member.role)}
                            <span className="text-xs">{getProviderIcon(member.provider)}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{member.position}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              member.status === 'online' ? 'bg-green-100 text-green-800' :
                              member.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                              member.status === 'busy' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {getStatusLabel(member.status)}
                            </span>
                            {member.isInCurrentChat && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                ในแชท
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {!member.isInCurrentChat && (
                        <div className="flex items-center space-x-2 mt-3">
                          <button className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs">
                            เชิญเข้าแชท
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                            <MessageSquare className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline Members */}
              <div className="p-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  ออฟไลน์ ({teamMembers.filter(m => m.status === 'offline').length})
                </h4>
                <div className="space-y-2">
                  {teamMembers.filter(m => m.status === 'offline').map((member) => (
                    <div key={member.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200 opacity-75">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">{member.name.charAt(2)}</span>
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{member.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {member.lastSeen ? formatLastSeen(member.lastSeen) : 'ไม่ทราบ'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Invitations */}
            {chatInvitations.filter(inv => inv.status === 'pending').length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">คำเชิญที่รอการตอบรับ</h4>
                <div className="space-y-2">
                  {chatInvitations.filter(inv => inv.status === 'pending').map((invitation) => (
                    <div key={invitation.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{invitation.toUser}</p>
                          <p className="text-xs text-gray-600">{invitation.chatTitle}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* History Sidebar - Right Side */}
      {showHistorySidebar && (
        <>
          {/* Overlay for mobile */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowHistorySidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 z-50 flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">ประวัติการสนทนา</h3>
                <button
                  onClick={() => setShowHistorySidebar(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  placeholder="ค้นหาประวัติ..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-sm"
                />
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredHistory.map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-700 line-clamp-2">
                      {chat.title}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span>{chat.aiModel}</span>
                        <span>•</span>
                        <span>{chat.messageCount} ข้อความ</span>
                      </div>
                      <span>฿{chat.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{chat.lastUpdated.toLocaleDateString('th-TH')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">เชิญเข้าร่วมแชท</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">เลือกสมาชิกที่ต้องการเชิญ</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {teamMembers.filter(m => !m.isInCurrentChat).map((member) => (
                      <div
                        key={member.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedMembers.includes(member.id)
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleMemberSelection(member.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-medium">{member.name.charAt(2)}</span>
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900">{member.name}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                member.status === 'online' ? 'bg-green-100 text-green-800' :
                                member.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                                member.status === 'busy' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {getStatusLabel(member.status)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{member.position}</p>
                          </div>
                          {selectedMembers.includes(member.id) && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความเชิญ (ไม่บังคับ)</label>
                  <textarea
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="เขียนข้อความเชิญ..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleInviteToChat}
                  disabled={selectedMembers.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  ส่งคำเชิญ ({selectedMembers.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}