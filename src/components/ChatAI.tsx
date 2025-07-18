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

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  aiModel: string;
  totalCost: number;
  lastUpdated: Date;
  messageCount: number;
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
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState<{[key: string]: string}>({
    'gpt-4': '',
    'claude': '',
    'gemini': '',
    'perplexity': '',
    'router': ''
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const getApiKeyStatus = (modelId: string) => {
    return apiKeys[modelId] && apiKeys[modelId].length > 0;
  };

  const getApiKeyLink = (modelId: string) => {
    switch (modelId) {
      case 'gpt-4':
        return 'https://platform.openai.com/api-keys';
      case 'claude':
        return 'https://console.anthropic.com/';
      case 'gemini':
        return 'https://makersuite.google.com/app/apikey';
      case 'perplexity':
        return 'https://www.perplexity.ai/settings/api';
      default:
        return '#';
    }
  };

  const getApiKeyDescription = (modelId: string) => {
    switch (modelId) {
      case 'gpt-4':
        return 'ใช้ API Key จาก OpenAI Platform เพื่อเข้าถึง GPT-4 และ GPT-3.5 Turbo';
      case 'claude':
        return 'ใช้ API Key จาก Anthropic Console เพื่อเข้าถึง Claude 3.5 Sonnet';
      case 'gemini':
        return 'ใช้ API Key จาก Google AI Studio เพื่อเข้าถึง Gemini Pro';
      case 'perplexity':
        return 'ใช้ API Key จาก Perplexity เพื่อเข้าถึงการค้นหาแบบ Real-time';
      case 'router':
        return 'AI Router จะใช้ API Key ที่คุณตั้งค่าไว้เพื่อเลือก AI ที่เหมาะสมอัตโนมัติ';
      default:
        return '';
    }
  };

  const handleSaveApiKey = (modelId: string, apiKey: string) => {
    setApiKeys(prev => ({
      ...prev,
      [modelId]: apiKey
    }));
    // TODO: Save to localStorage or backend
    localStorage.setItem(`api_key_${modelId}`, apiKey);
  };

  const handleLoadApiKeys = () => {
    const keys: {[key: string]: string} = {};
    Object.keys(apiKeys).forEach(modelId => {
      const savedKey = localStorage.getItem(`api_key_${modelId}`);
      if (savedKey) {
        keys[modelId] = savedKey;
      }
    });
    setApiKeys(prev => ({ ...prev, ...keys }));
  };

  React.useEffect(() => {
    handleLoadApiKeys();
  }, []);
  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  const startNewChat = () => {
    setMessages([]);
    setSelectedPersona(personas[6]); // Reset to general
    setShowHistorySidebar(false);
  };

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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAIDropdown(!showAIDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-200"
                  >
                    <selectedAI.icon className={`w-4 h-4 ${selectedAI.color}`} />
                    <span className="font-medium">{selectedAI.name}</span>
                    {getApiKeyStatus(selectedAI.id) && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="API Key ตั้งค่าแล้ว" />
                    )}
                    <span className="text-gray-500">฿{selectedAI.cost.toFixed(3)}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => setShowApiSettings(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="ตั้งค่า API Keys"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {showAIDropdown && (
                  <div className="absolute bottom-full mb-2 left-0 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-10">
                    {aiModels.map((model) => {
                      const IconComponent = model.icon;
                      const hasApiKey = getApiKeyStatus(model.id);
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedAI(model);
                            setShowAIDropdown(false);
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors relative ${
                            selectedAI.id === model.id ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${model.color}`} />
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{model.name}</span>
                                {hasApiKey && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full" title="API Key ตั้งค่าแล้ว" />
                                )}
                              </div>
                              <span className="text-sm text-gray-500">฿{model.cost.toFixed(3)}</span>
                            </div>
                            <div className="text-sm text-gray-500">{model.description}</div>
                            <div className="text-xs text-gray-400">{model.specialty}</div>
                            {!hasApiKey && model.id !== 'router' && (
                              <div className="text-xs text-orange-600 mt-1">ต้องตั้งค่า API Key</div>
                            )}
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

      {/* API Settings Modal */}
      {showApiSettings && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowApiSettings(false)}
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">ตั้งค่า API Keys</h3>
                  <button
                    onClick={() => setShowApiSettings(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  ตั้งค่า API Key ของคุณเองเพื่อใช้งาน AI แต่ละตัวโดยตรง
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {aiModels.filter(model => model.id !== 'router').map((model) => {
                    const IconComponent = model.icon;
                    const hasApiKey = getApiKeyStatus(model.id);
                    const currentApiKey = apiKeys[model.id] || '';
                    
                    return (
                      <div key={model.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`${model.color} p-2 rounded-lg`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">{model.name}</h4>
                              {hasApiKey && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  ตั้งค่าแล้ว
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{getApiKeyDescription(model.id)}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              API Key
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="password"
                                value={currentApiKey}
                                onChange={(e) => setApiKeys(prev => ({
                                  ...prev,
                                  [model.id]: e.target.value
                                }))}
                                placeholder={`ใส่ ${model.name} API Key`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                              <button
                                onClick={() => handleSaveApiKey(model.id, currentApiKey)}
                                disabled={!currentApiKey.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                              >
                                บันทึก
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <a
                              href={getApiKeyLink(model.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>รับ API Key</span>
                            </a>
                            
                            {hasApiKey && (
                              <button
                                onClick={() => {
                                  setApiKeys(prev => ({ ...prev, [model.id]: '' }));
                                  localStorage.removeItem(`api_key_${model.id}`);
                                }}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                ลบ API Key
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* AI Router Info */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-yellow-500 p-2 rounded-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">AI Router</h4>
                        <p className="text-sm text-gray-600">
                          AI Router จะใช้ API Key ที่คุณตั้งค่าไว้เพื่อเลือก AI ที่เหมาะสมอัตโนมัติ
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>• หาก API Key หมด จะใช้เครดิตของระบบแทน</p>
                      <p>• ประหยัดค่าใช้จ่ายได้มากที่สุด</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>🔒 API Key จะถูกเก็บไว้ในเครื่องของคุณเท่านั้น</p>
                  </div>
                  <button
                    onClick={() => setShowApiSettings(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}