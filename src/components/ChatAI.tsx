import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  History, 
  Bot, 
  User, 
  Paperclip, 
  Mic, 
  Image as ImageIcon,
  Zap,
  Brain,
  Globe,
  Sparkles,
  Clock,
  CreditCard,
  Star,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Settings,
  X,
  FileText,
  Users,
  Share2,
  Download,
  Bookmark,
  GraduationCap,
  Briefcase,
  Building,
  FlaskConical,
  BarChart3
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  aiModel?: string;
  cost?: number;
  sources?: Source[];
  followUpQuestions?: string[];
  isLoading?: boolean;
}

interface Source {
  title: string;
  url: string;
  relevance: number;
  credibility: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
  persona: string;
  totalCost: number;
}

const ChatAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('ai-router');
  const [selectedPersona, setSelectedPersona] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const personas = [
    { id: 'student', label: 'นักเรียน/นักศึกษา', icon: GraduationCap, description: 'การเรียน วิจัย การบ้าน' },
    { id: 'employee', label: 'พนักงาน', icon: Briefcase, description: 'งานออฟฟิศ โปรเจกต์' },
    { id: 'government', label: 'ข้าราชการ', icon: Building, description: 'หนังสือราชการ นโยบาย' },
    { id: 'researcher', label: 'นักวิจัย', icon: FlaskConical, description: 'วิจัย วิเคราะห์ข้อมูล' },
    { id: 'business', label: 'ธุรกิจ', icon: BarChart3, description: 'กลยุทธ์ การตลาด' },
    { id: 'organization', label: 'องค์กร', icon: Users, description: 'บริหารจัดการ ทีมงาน' },
    { id: 'general', label: 'ทั่วไป', icon: MessageSquare, description: 'คำถามทั่วไป' }
  ];

  const aiModels = [
    { 
      id: 'ai-router', 
      name: 'AI Router', 
      description: 'เลือก AI ที่เหมาะสมอัตโนมัติ', 
      icon: '🔀', 
      logo: Zap,
      cost: 'ประหยัดสุด',
      bestFor: 'งานทั่วไป ประหยัดต้นทุน'
    },
    { 
      id: 'gpt-4', 
      name: 'GPT-4', 
      description: 'AI ที่ทรงพลังที่สุด', 
      icon: '🟢', 
      logo: Brain,
      cost: '฿0.03/1K tokens',
      bestFor: 'งานซับซ้อน การวิเคราะห์ลึก'
    },
    { 
      id: 'claude', 
      name: 'Claude 3.5', 
      description: 'เก่งการอ่านและวิเคราะห์', 
      icon: '🟠', 
      logo: Bot,
      cost: '฿0.003/1K tokens',
      bestFor: 'เอกสารยาว การวิเคราะห์'
    },
    { 
      id: 'gemini', 
      name: 'Gemini Pro', 
      description: 'รวดเร็วและประหยัด', 
      icon: '🔵', 
      logo: Sparkles,
      cost: '฿0.0005/1K tokens',
      bestFor: 'งานทั่วไป ตอบเร็ว'
    },
    { 
      id: 'perplexity', 
      name: 'Perplexity', 
      description: 'ค้นหาข้อมูลล่าสุด', 
      icon: '🟣', 
      logo: Globe,
      cost: '฿0.002/1K tokens',
      bestFor: 'ข้อมูลล่าสุด การค้นหา'
    }
  ];

  const templateQuestions = {
    student: [
      "ช่วยอธิบายแนวคิดนี้ให้เข้าใจง่ายขึ้น",
      "สรุปเนื้อหาบทเรียนนี้ให้หน่อย",
      "ช่วยตรวจการบ้านและให้คำแนะนำ",
      "แนะนำแหล่งข้อมูลเพิ่มเติมสำหรับหัวข้อนี้"
    ],
    employee: [
      "ช่วยเขียนอีเมลติดต่อลูกค้า",
      "สรุปรายงานการประชุมให้หน่อย",
      "วิเคราะห์ข้อมูลและให้ข้อเสนอแนะ",
      "ช่วยวางแผนโครงการใหม่"
    ],
    government: [
      "ร่างหนังสือราชการตามระเบียบ",
      "ตรวจสอบความถูกต้องของเอกสาร",
      "สรุปนโยบายและระเบียบใหม่",
      "วิเคราะห์ผลกระทบของนโยบาย"
    ],
    researcher: [
      "ช่วยวิเคราะห์ข้อมูลวิจัย",
      "สรุปเอกสารวิชาการ",
      "ตรวจสอบวิธีการวิจัย",
      "แนะนำแหล่งข้อมูลวิชาการ"
    ],
    business: [
      "วิเคราะห์ตลาดและคู่แข่ง",
      "ช่วยวางแผนกลยุทธ์ธุรกิจ",
      "สรุปรายงานทางการเงิน",
      "ประเมินความเสี่ยงทางธุรกิจ"
    ],
    organization: [
      "วิเคราะห์ประสิทธิภาพองค์กร",
      "ช่วยวางแผนการพัฒนาบุคลากร",
      "สรุปนโยบายและแนวทางปฏิบัติ",
      "ประเมินผลการดำเนินงาน"
    ],
    general: [
      "ตอบคำถามทั่วไป",
      "ช่วยแก้ปัญหาต่างๆ",
      "ให้คำแนะนำและข้อเสนอแนะ",
      "อธิบายเรื่องที่ซับซ้อนให้เข้าใจง่าย"
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'นี่คือตัวอย่างการตอบกลับจาก AI ซึ่งจะถูกแทนที่ด้วยการเรียก API จริงในอนาคต',
        timestamp: new Date(),
        aiModel: selectedAI === 'ai-router' ? 'GPT-4 (เลือกโดย AI Router)' : aiModels.find(m => m.id === selectedAI)?.name,
        cost: 0.05,
        sources: [
          { title: 'Wikipedia', url: 'https://wikipedia.org', relevance: 95, credibility: 90 },
          { title: 'Research Paper', url: 'https://example.com', relevance: 88, credibility: 95 }
        ],
        followUpQuestions: [
          'คุณต้องการทราบรายละเอียดเพิ่มเติมหรือไม่?',
          'มีคำถามอื่นที่เกี่ยวข้องไหม?',
          'ต้องการให้อธิบายในมุมมองอื่นไหม?'
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

  const startNewChat = () => {
    setMessages([]);
    setCurrentSession(null);
    setSelectedPersona('');
  };

  const handleTemplateClick = (template: string) => {
    setInputMessage(template);
    inputRef.current?.focus();
  };

  const shareToDocuments = (messageContent: string) => {
    alert('แชร์ไปยังเอกสารเรียบร้อย!');
  };

  const shareToTeam = (messageContent: string) => {
    alert('แชร์ไปยังทีมเรียบร้อย!');
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Chat AI</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors ${
                  showHistory ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <History className="h-5 w-5" />
              </button>
              <button
                onClick={startNewChat}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                แชทใหม่
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="max-w-4xl mx-auto">
              {/* Persona Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">คุณคือใคร?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {personas.map(persona => {
                    const Icon = persona.icon;
                    return (
                      <button
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                          selectedPersona === persona.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700 hover:bg-blue-50 shadow-sm'
                        }`}
                      >
                        <div className="text-center">
                          <Icon className="h-8 w-8 mx-auto mb-2 text-current" />
                          <div className="text-sm font-medium mb-1">{persona.label}</div>
                          <div className="text-xs text-gray-500 leading-tight">{persona.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Template Questions */}
              {selectedPersona && templateQuestions[selectedPersona as keyof typeof templateQuestions] && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                    คำถามแนะนำสำหรับ{personas.find(p => p.id === selectedPersona)?.label}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templateQuestions[selectedPersona as keyof typeof templateQuestions].map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleTemplateClick(template)}
                        className="p-4 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-gray-700 hover:text-blue-700 shadow-sm hover:shadow-lg group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                            <MessageSquare className="h-3 w-3 text-blue-600" />
                          </div>
                          <div className="text-sm leading-relaxed font-medium">{template}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      
                      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        {message.type === 'ai' && (
                          <div className="mt-3 space-y-3">
                            {/* AI Info */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Brain className="h-3 w-3 mr-1" />
                                {message.aiModel}
                              </span>
                              <span className="flex items-center">
                                <CreditCard className="h-3 w-3 mr-1" />
                                ฿{message.cost?.toFixed(3)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {message.timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {/* Sources */}
                            {message.sources && message.sources.length > 0 && (
                              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                  <Globe className="h-4 w-4 mr-2" />
                                  แหล่งอ้างอิง
                                </h4>
                                <div className="space-y-2">
                                  {message.sources.map((source, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                                      <div className="flex items-center justify-between">
                                        <a 
                                          href={source.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-sm text-gray-700 hover:text-gray-900 font-medium flex items-center group"
                                        >
                                          <Globe className="h-3 w-3 mr-2 text-gray-500" />
                                          {source.title}
                                          <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                        </a>
                                        <div className="flex items-center space-x-3">
                                          <div className="text-xs text-gray-600">
                                            <span className="font-medium">เกี่ยวข้อง: {source.relevance}%</span>
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            <span className="font-medium">น่าเชื่อถือ: {source.credibility}%</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Follow-up Questions */}
                            {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-700">คำถามต่อเนื่อง:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {message.followUpQuestions.map((question, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setInputMessage(question)}
                                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                    >
                                      {question}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                <Copy className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors">
                                <Star className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => shareToDocuments(message.content)}
                                className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                                title="แชร์ไปยังเอกสาร"
                              >
                                <FileText className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => shareToTeam(message.content)}
                                className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                                title="แชร์ไปยังทีม"
                              >
                                <Users className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                                <Share2 className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                                <Bookmark className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            {/* AI Model Selector - Beautiful Grid */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">เลือก AI Model:</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {aiModels.map(model => {
                  const Logo = model.logo;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedAI(model.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                        selectedAI === model.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700 hover:bg-blue-50 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{model.icon}</span>
                          <Logo className="h-4 w-4" />
                        </div>
                        <div className="text-sm font-semibold mb-1">{model.name}</div>
                        <div className="text-xs text-gray-500 mb-1">{model.cost}</div>
                        <div className="text-xs text-gray-400 leading-tight">{model.bestFor}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input */}
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="พิมพ์คำถามของคุณ..."
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
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">ประวัติการสนทนา</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center py-8 text-gray-500">
              <History className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">ยังไม่มีประวัติการสนทนา</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAI;