import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Image, 
  Mic, 
  Search, 
  History, 
  X, 
  Copy, 
  Share2, 
  FileText, 
  Download,
  Link,
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
  DollarSign
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
  }>;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  aiModel: string;
  totalCost: number;
  lastUpdated: Date;
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
    lastUpdated: new Date()
  },
  {
    id: '2',
    title: 'เขียนรายงานการประชุม',
    messages: [],
    aiModel: 'Claude',
    totalCost: 0.08,
    lastUpdated: new Date(Date.now() - 86400000)
  },
  {
    id: '3',
    title: 'แปลเอกสารภาษาอังกฤษ',
    messages: [],
    aiModel: 'Gemini',
    totalCost: 0.05,
    lastUpdated: new Date(Date.now() - 172800000)
  }
];

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedAI, setSelectedAI] = useState(aiModels[4]); // AI Router as default
  const [selectedPersona, setSelectedPersona] = useState(personas[6]); // General as default
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
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
        content: `ตอบคำถาม: "${inputValue}" โดยใช้ ${selectedAI.name}\n\nนี่คือคำตอบที่ครอบคลุมและมีประโยชน์สำหรับคำถามของคุณ ซึ่งได้รับการวิเคราะห์และประมวลผลโดย AI ที่เหมาะสมที่สุด\n\n**จุดสำคัญ:**\n• ข้อมูลที่ถูกต้องและเป็นปัจจุบัน\n• การวิเคราะห์เชิงลึก\n• คำแนะนำที่เป็นประโยชน์\n\n**สรุป:**\nคำตอบนี้ได้รับการปรับแต่งให้เหมาะสมกับบทบาท "${selectedPersona.name}" และใช้ความสามารถของ ${selectedAI.name} ในการให้คำตอบที่มีคุณภาพสูง`,
        isUser: false,
        timestamp: new Date(),
        aiModel: selectedAI.name,
        cost: selectedAI.cost,
        sources: selectedAI.id === 'perplexity' ? [
          { title: 'Wikipedia', url: 'https://wikipedia.org', relevance: 95 },
          { title: 'Academic Paper', url: 'https://example.com', relevance: 88 },
          { title: 'News Article', url: 'https://news.com', relevance: 82 }
        ] : undefined
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

  const handleExport = (type: 'word' | 'pdf' | 'link' | 'template') => {
    // Simulate export functionality
    alert(`ส่งออกเป็น ${type} สำเร็จ!`);
  };

  const handleShare = () => {
    // Simulate share functionality
    alert('แชร์ให้ทีมสำเร็จ!');
  };

  const filteredHistory = mockChatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  const groupedHistory = {
    today: filteredHistory.filter(chat => 
      new Date().toDateString() === chat.lastUpdated.toDateString()
    ),
    yesterday: filteredHistory.filter(chat => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toDateString() === chat.lastUpdated.toDateString();
    }),
    thisWeek: filteredHistory.filter(chat => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return chat.lastUpdated > weekAgo && 
             chat.lastUpdated.toDateString() !== new Date().toDateString() &&
             chat.lastUpdated.toDateString() !== new Date(Date.now() - 86400000).toDateString();
    }),
    older: filteredHistory.filter(chat => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return chat.lastUpdated <= weekAgo;
    })
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-gray-900">ThaiAI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>เครดิต: ฿25.50</span>
            </div>
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="text-sm">ประวัติ</span>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8">
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${message.isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-4 shadow-sm`}>
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-3 text-sm text-gray-500">
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
                    
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.sources && (
                      <div className="mt-4 space-y-2">
                        <div className="text-sm font-medium text-gray-700">แหล่งอ้างอิง:</div>
                        {message.sources.map((source, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{source.title}</div>
                              <div className="text-xs text-gray-500">{source.url}</div>
                            </div>
                            <div className="text-xs text-gray-500">{source.relevance}%</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => navigator.clipboard.writeText(message.content)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>คัดลอก</span>
                        </button>
                        <button
                          onClick={handleShare}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>แชร์</span>
                        </button>
                        <button
                          onClick={() => handleExport('word')}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Word</span>
                        </button>
                        <button
                          onClick={() => handleExport('pdf')}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => handleExport('link')}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Link className="w-3 h-3" />
                          <span>ลิงก์</span>
                        </button>
                        <button
                          onClick={() => handleExport('template')}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Save className="w-3 h-3" />
                          <span>Template</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500">กำลังคิด...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            {/* AI Selector */}
            <div className="mb-4">
              <div className="relative">
                <button
                  onClick={() => setShowAIDropdown(!showAIDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
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
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    <Image className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
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

      {/* History Sidebar */}
      {isHistoryOpen && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">ประวัติการสนทนา</h2>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                placeholder="ค้นหาการสนทนา..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.entries(groupedHistory).map(([period, chats]) => {
              if (chats.length === 0) return null;
              
              const periodLabels = {
                today: 'วันนี้',
                yesterday: 'เมื่อวาน',
                thisWeek: 'สัปดาห์นี้',
                older: 'เก่ากว่านี้'
              };
              
              return (
                <div key={period}>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {periodLabels[period as keyof typeof periodLabels]}
                  </h3>
                  <div className="space-y-2">
                    {chats.map((chat) => (
                      <button
                        key={chat.id}
                        className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-700">
                          {chat.title}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span>{chat.aiModel}</span>
                            <span>•</span>
                            <span>฿{chat.totalCost.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{chat.lastUpdated.toLocaleDateString('th-TH')}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}