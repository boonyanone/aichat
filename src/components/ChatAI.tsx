import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Search, 
  Plus, 
  MessageSquare, 
  Clock, 
  Star,
  Trash2,
  Edit3,
  Pin,
  Bot,
  Zap,
  Brain,
  Globe,
  Users,
  Briefcase,
  GraduationCap,
  Building,
  FlaskConical,
  ChevronDown,
  Sparkles,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  aiModel?: string;
  cost?: number;
  sources?: Array<{
    title: string;
    url: string;
    relevance: number;
  }>;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  aiModel: string;
  cost: number;
  isPinned?: boolean;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  cost: number;
  description: string;
  icon: React.ReactNode;
  specialty: string;
}

interface Template {
  id: string;
  title: string;
  prompt: string;
  category: string;
}

const aiModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    cost: 0.03,
    description: 'ความสามารถรอบด้าน เหมาะสำหรับงานซับซ้อน',
    icon: <Bot className="w-4 h-4" />,
    specialty: 'การเขียน การวิเคราะห์'
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    provider: 'Anthropic',
    cost: 0.025,
    description: 'เก่งการอ่านเอกสาร และการวิเคราะห์',
    icon: <Brain className="w-4 h-4" />,
    specialty: 'การอ่านเอกสาร การวิจัย'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    cost: 0.02,
    description: 'เร็ว ประหยัด เหมาะสำหรับงานทั่วไป',
    icon: <Sparkles className="w-4 h-4" />,
    specialty: 'งานทั่วไป ความเร็ว'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    provider: 'Perplexity',
    cost: 0.015,
    description: 'ค้นหาข้อมูลล่าสุด พร้อมแหล่งอ้างอิง',
    icon: <Globe className="w-4 h-4" />,
    specialty: 'ค้นหาข้อมูล ข่าวสาร'
  },
  {
    id: 'ai-router',
    name: 'AI Router',
    provider: 'Smart',
    cost: 0.01,
    description: 'เลือก AI ที่เหมาะสมอัตโนมัติ ประหยัดสุด',
    icon: <Zap className="w-4 h-4" />,
    specialty: 'ประหยัด อัตโนมัติ'
  }
];

const templateCategories = [
  {
    id: 'student',
    name: 'นักเรียน/นักศึกษา',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'bg-blue-500',
    templates: [
      { id: '1', title: 'อธิบายแนวคิดยาก', prompt: 'ช่วยอธิบายแนวคิด [หัวข้อ] ให้เข้าใจง่าย พร้อมยกตัวอย่าง', category: 'student' },
      { id: '2', title: 'สรุปเนื้อหาบทเรียน', prompt: 'ช่วยสรุปเนื้อหาเรื่อง [หัวข้อ] เป็นประเด็นสำคัญ', category: 'student' },
      { id: '3', title: 'เตรียมสอบ', prompt: 'ช่วยสร้างคำถามทบทวนสำหรับวิชา [ชื่อวิชา]', category: 'student' }
    ]
  },
  {
    id: 'employee',
    name: 'พนักงาน',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-green-500',
    templates: [
      { id: '4', title: 'เขียนอีเมลงาน', prompt: 'ช่วยเขียนอีเมลเรื่อง [หัวข้อ] ให้เป็นทางการและสุภาพ', category: 'employee' },
      { id: '5', title: 'สรุปการประชุม', prompt: 'ช่วยสรุปการประชุมจากบันทึกนี้: [ใส่บันทึก]', category: 'employee' },
      { id: '6', title: 'วิเคราะห์ปัญหา', prompt: 'ช่วยวิเคราะห์ปัญหา [อธิบายปัญหา] และเสนอแนวทางแก้ไข', category: 'employee' }
    ]
  },
  {
    id: 'government',
    name: 'ข้าราชการ',
    icon: <Building className="w-5 h-5" />,
    color: 'bg-purple-500',
    templates: [
      { id: '7', title: 'ร่างหนังสือราชการ', prompt: 'ช่วยร่างหนังสือราชการเรื่อง [หัวข้อ] ตามรูปแบบทางการ', category: 'government' },
      { id: '8', title: 'วิเคราะห์นโยบาย', prompt: 'ช่วยวิเคราะห์ผลกระทบของนโยบาย [ชื่อนโยบาย]', category: 'government' },
      { id: '9', title: 'สรุปกฎหมาย', prompt: 'ช่วยสรุปประเด็นสำคัญของ [ชื่อกฎหมาย/ระเบียบ]', category: 'government' }
    ]
  },
  {
    id: 'researcher',
    name: 'นักวิจัย',
    icon: <FlaskConical className="w-5 h-5" />,
    color: 'bg-orange-500',
    templates: [
      { id: '10', title: 'ทบทวนวรรณกรรม', prompt: 'ช่วยทบทวนวรรณกรรมเรื่อง [หัวข้อวิจัย] และสรุปช่องว่างงานวิจัย', category: 'researcher' },
      { id: '11', title: 'วิเคราะห์ข้อมูล', prompt: 'ช่วยวิเคราะห์ข้อมูลนี้และหาแนวโน้ม: [ใส่ข้อมูล]', category: 'researcher' },
      { id: '12', title: 'เขียน Abstract', prompt: 'ช่วยเขียน Abstract สำหรับงานวิจัยเรื่อง [หัวข้อ]', category: 'researcher' }
    ]
  },
  {
    id: 'business',
    name: 'ธุรกิจ',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'bg-red-500',
    templates: [
      { id: '13', title: 'วิเคราะห์ตลาด', prompt: 'ช่วยวิเคราะห์ตลาดสำหรับผลิตภัณฑ์ [ชื่อผลิตภัณฑ์]', category: 'business' },
      { id: '14', title: 'แผนการตลาด', prompt: 'ช่วยสร้างแผนการตลาดสำหรับ [ธุรกิจ/ผลิตภัณฑ์]', category: 'business' },
      { id: '15', title: 'วิเคราะห์คู่แข่ง', prompt: 'ช่วยวิเคราะห์จุดแข็ง-จุดอ่อนของคู่แข่งในธุรกิจ [ประเภทธุรกิจ]', category: 'business' }
    ]
  }
];

export default function ChatAI() {
  const [selectedAI, setSelectedAI] = useState<AIModel>(aiModels[4]); // Default to AI Router
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'วิเคราะห์ข้อมูลการขาย Q3',
      lastMessage: 'ข้อมูลการขายในไตรมาส 3 แสดงให้เห็นว่า...',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      aiModel: 'GPT-4',
      cost: 0.15,
      isPinned: true
    },
    {
      id: '2',
      title: 'สรุปเอกสารงานวิจัย',
      lastMessage: 'งานวิจัยนี้มีจุดประสงค์เพื่อศึกษา...',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      aiModel: 'Claude 3',
      cost: 0.08
    },
    {
      id: '3',
      title: 'แผนการตลาดปี 2024',
      lastMessage: 'แผนการตลาดสำหรับปี 2024 ควรเน้น...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      aiModel: 'Gemini Pro',
      cost: 0.12
    }
  ]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `ขอบคุณสำหรับคำถาม "${message}" ฉันจะช่วยวิเคราะห์และตอบคำถามนี้ให้คุณ...`,
        sender: 'ai',
        timestamp: new Date(),
        aiModel: selectedAI.name,
        cost: selectedAI.cost,
        sources: [
          { title: 'Wikipedia', url: 'https://wikipedia.org', relevance: 95 },
          { title: 'Research Paper', url: 'https://example.com', relevance: 88 }
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const useTemplate = (template: Template) => {
    setMessage(template.prompt);
    setSelectedCategory(null);
    textareaRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'เมื่อสักครู่';
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${Math.floor(hours / 24)} วันที่แล้ว`;
  };

  const groupChatHistory = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups = {
      today: chatHistory.filter(chat => chat.timestamp >= today),
      yesterday: chatHistory.filter(chat => chat.timestamp >= yesterday && chat.timestamp < today),
      thisWeek: chatHistory.filter(chat => chat.timestamp >= weekAgo && chat.timestamp < yesterday),
      older: chatHistory.filter(chat => chat.timestamp < weekAgo)
    };

    return groups;
  };

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchHistory.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar - Chat History */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">ประวัติการสนทนา</h2>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search History */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ค้นหาการสนทนา..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(groupChatHistory()).map(([period, chats]) => {
            if (chats.length === 0) return null;
            
            const periodLabels = {
              today: 'วันนี้',
              yesterday: 'เมื่อวาน',
              thisWeek: 'สัปดาห์นี้',
              older: 'เก่ากว่านี้'
            };

            return (
              <div key={period} className="p-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  {periodLabels[period as keyof typeof periodLabels]}
                </h3>
                <div className="space-y-2">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                        selectedChat === chat.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {chat.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {chat.title}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                            {chat.lastMessage}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{chat.aiModel}</span>
                            <span>${chat.cost.toFixed(3)}</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-4xl w-full">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  AI หลายค่าย ราคาเป็นธรรม
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  สนทนากับ AI ที่เหมาะกับคุณ
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  เลือกใช้ AI จากหลายค่าย จ่ายเฉพาะที่ใช้จริง พร้อม Template ที่ออกแบบมาเฉพาะกลุ่ม
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI หลายค่าย</h3>
                  <p className="text-sm text-gray-600">GPT-4, Claude, Gemini, Perplexity ในที่เดียว</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">จ่ายตามใช้</h3>
                  <p className="text-sm text-gray-600">ไม่มีค่าธรรมเนียมรายเดือน โปร่งใสทุกการคิดเงิน</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Template ตามกลุ่ม</h3>
                  <p className="text-sm text-gray-600">คำถามที่ออกแบบมาเฉพาะอาชีพ</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Router</h3>
                  <p className="text-sm text-gray-600">เลือก AI ที่เหมาะสมอัตโนมัติ ประหยัดสุด</p>
                </div>
              </div>

              {/* Template Categories */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  เริ่มต้นด้วย Template ที่เหมาะกับคุณ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {templateCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedCategory === category.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                        {React.cloneElement(category.icon, { className: 'w-6 h-6 text-white' })}
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template List */}
              {selectedCategory && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Template สำหรับ{templateCategories.find(c => c.id === selectedCategory)?.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templateCategories
                      .find(c => c.id === selectedCategory)
                      ?.templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => useTemplate(template)}
                          className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                        >
                          <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-700">
                            {template.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {template.prompt}
                          </p>
                          <div className="flex items-center justify-end mt-3">
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200'
                    } rounded-2xl p-4 shadow-sm`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <Bot className="w-4 h-4" />
                        <span>{msg.aiModel}</span>
                        <span>•</span>
                        <span>${msg.cost?.toFixed(3)}</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    
                    {msg.sources && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">แหล่งอ้างอิง</h4>
                        <div className="space-y-2">
                          {msg.sources.map((source, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                              >
                                {source.title}
                              </a>
                              <span className="text-gray-400 ml-2">{source.relevance}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Bot className="w-4 h-4" />
                      <span>{selectedAI.name} กำลังคิด...</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="max-w-4xl mx-auto">
            {/* AI Model Selector */}
            <div className="mb-4">
              <div className="relative inline-block">
                <select
                  value={selectedAI.id}
                  onChange={(e) => setSelectedAI(aiModels.find(ai => ai.id === e.target.value) || aiModels[0])}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {aiModels.map((ai) => (
                    <option key={ai.id} value={ai.id}>
                      {ai.name} - ${ai.cost}/ข้อความ - {ai.specialty}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Input Box */}
            <div className="relative">
              <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 p-4">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="พิมพ์ข้อความหา AI..."
                  className="flex-1 bg-transparent border-none outline-none resize-none min-h-[24px] max-h-32 text-gray-900 placeholder-gray-500"
                  rows={1}
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              {/* Cost Estimate */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>ประมาณการค่าใช้จ่าย: ${selectedAI.cost.toFixed(3)}</span>
                <span>Enter เพื่อส่ง • Shift+Enter เพื่อขึ้นบรรทัดใหม่</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}