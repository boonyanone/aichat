import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Image, 
  Mic, 
  History, 
  Search, 
  Copy, 
  Share, 
  Bookmark,
  ExternalLink,
  ChevronRight,
  X,
  Clock,
  MessageSquare,
  DollarSign,
  User,
  Briefcase,
  Building,
  GraduationCap,
  Search as SearchIcon,
  Globe
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  aiModel?: string;
  sources?: Source[];
  followUpQuestions?: string[];
}

interface Source {
  title: string;
  url: string;
  snippet: string;
  credibility: number;
  relevance: number;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  aiModel: string;
  cost: number;
  timestamp: Date;
}

const aiModels = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', cost: 0.03, color: 'bg-green-500' },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', cost: 0.025, color: 'bg-orange-500' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', cost: 0.02, color: 'bg-blue-500' },
  { id: 'perplexity', name: 'Perplexity', provider: 'Perplexity AI', cost: 0.015, color: 'bg-purple-500' },
];

const personas = [
  {
    id: 'student',
    name: 'นักเรียน/นักศึกษา',
    icon: GraduationCap,
    color: 'bg-blue-500',
    templates: [
      'อธิบายแนวคิดนี้ให้เข้าใจง่าย',
      'ช่วยทำการบ้านเรื่อง...',
      'สรุปเนื้อหาบทเรียน'
    ]
  },
  {
    id: 'employee',
    name: 'พนักงาน',
    icon: User,
    color: 'bg-green-500',
    templates: [
      'เขียนอีเมลทางการ',
      'วิเคราะห์ข้อมูลการขาย',
      'จัดทำรายงานประจำเดือน'
    ]
  },
  {
    id: 'government',
    name: 'ข้าราชการ',
    icon: Building,
    color: 'bg-purple-500',
    templates: [
      'ร่างหนังสือราชการ',
      'วิเคราะห์นโยบายสาธารณะ',
      'จัดทำแผนงานโครงการ'
    ]
  },
  {
    id: 'researcher',
    name: 'นักวิจัย',
    icon: SearchIcon,
    color: 'bg-indigo-500',
    templates: [
      'ค้นหาเอกสารอ้างอิง',
      'วิเคราะห์ข้อมูลวิจัย',
      'เขียน Abstract'
    ]
  },
  {
    id: 'business',
    name: 'ธุรกิจ',
    icon: Briefcase,
    color: 'bg-orange-500',
    templates: [
      'วิเคราะห์ตลาด',
      'จัดทำแผนธุรกิจ',
      'คำนวณ ROI'
    ]
  },
  {
    id: 'organization',
    name: 'หน่วยงาน/องค์กร',
    icon: Building,
    color: 'bg-red-500',
    templates: [
      'วิเคราะห์นโยบายองค์กร',
      'จัดทำแผนกลยุทธ์',
      'ประเมินความเสี่ยง'
    ]
  },
  {
    id: 'general',
    name: 'ทั่วไป',
    icon: Globe,
    color: 'bg-gray-500',
    templates: [
      'คำถามทั่วไป',
      'ขอคำแนะนำ',
      'แก้ปัญหาเบื้องต้น'
    ]
  }
];

const mockSources: Source[] = [
  {
    title: "Wikipedia - Artificial Intelligence",
    url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
    snippet: "Artificial intelligence (AI) is intelligence demonstrated by machines...",
    credibility: 85,
    relevance: 92
  },
  {
    title: "MIT Technology Review",
    url: "https://www.technologyreview.com/ai",
    snippet: "Latest developments in AI research and applications...",
    credibility: 95,
    relevance: 88
  },
  {
    title: "Stanford AI Research",
    url: "https://ai.stanford.edu",
    snippet: "Stanford's artificial intelligence research focuses on...",
    credibility: 98,
    relevance: 85
  }
];

const mockFollowUpQuestions = [
  "AI มีผลกระทบต่ออนาคตของงานอย่างไร?",
  "เทคโนโลยี Machine Learning ทำงานอย่างไร?",
  "ความแตกต่างระหว่าง AI, ML และ Deep Learning คืออะไร?",
  "AI สามารถช่วยแก้ปัญหาสิ่งแวดล้อมได้อย่างไร?"
];

const mockChatHistory: ChatHistory[] = [
  {
    id: '1',
    title: 'การใช้ AI ในการศึกษา',
    messages: [],
    aiModel: 'gpt-4',
    cost: 0.15,
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '2',
    title: 'วิเคราะห์ข้อมูลการขาย',
    messages: [],
    aiModel: 'claude-3',
    cost: 0.08,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: '3',
    title: 'แผนการตลาดดิจิทัล',
    messages: [],
    aiModel: 'gemini-pro',
    cost: 0.12,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
];

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedAI, setSelectedAI] = useState(aiModels[0]);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
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
        content: `นี่คือคำตอบจาก ${selectedAI.name} สำหรับคำถาม: "${inputValue}"\n\nคำตอบนี้ได้รับการประมวลผลด้วย AI ที่ทันสมัย และมีการอ้างอิงจากแหล่งข้อมูลที่น่าเชื่อถือ ข้อมูลได้รับการตรวจสอบความถูกต้องและความเกี่ยวข้องแล้ว`,
        isUser: false,
        timestamp: new Date(),
        aiModel: selectedAI.name,
        sources: mockSources,
        followUpQuestions: mockFollowUpQuestions
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateClick = (template: string) => {
    setInputValue(template);
    setSelectedPersona(null);
    textareaRef.current?.focus();
  };

  const handleFollowUpClick = (question: string) => {
    setInputValue(question);
    textareaRef.current?.focus();
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

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${days} วันที่แล้ว`;
  };

  const groupChatHistory = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups = {
      today: [] as ChatHistory[],
      yesterday: [] as ChatHistory[],
      thisWeek: [] as ChatHistory[],
      older: [] as ChatHistory[]
    };

    mockChatHistory.forEach(chat => {
      const chatDate = new Date(chat.timestamp.getFullYear(), chat.timestamp.getMonth(), chat.timestamp.getDate());
      
      if (chatDate.getTime() === today.getTime()) {
        groups.today.push(chat);
      } else if (chatDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(chat);
      } else if (chatDate >= weekAgo) {
        groups.thisWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  };

  const filteredHistory = mockChatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* AI Router and History Button */}
        <div className="bg-gray-50 p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              {/* AI Selector */}
              <div className="relative">
                <select
                  value={selectedAI.id}
                  onChange={(e) => setSelectedAI(aiModels.find(ai => ai.id === e.target.value) || aiModels[0])}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {aiModels.map((ai) => (
                    <option key={ai.id} value={ai.id}>
                      {ai.name} - ฿{ai.cost}/ข้อความ
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>

              {/* History Button */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <History className="w-4 h-4" />
                <span>ประวัติ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              /* Templates */
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    ถามอะไรก็ได้กับ AI
                  </h1>
                  <p className="text-gray-600">
                    เลือก AI ที่เหมาะกับงานของคุณ จ่ายเฉพาะที่ใช้จริง
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personas.map((persona) => {
                    const Icon = persona.icon;
                    return (
                      <div
                        key={persona.id}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedPersona(selectedPersona === persona.id ? null : persona.id)}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`${persona.color} p-2 rounded-lg`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{persona.name}</h3>
                        </div>
                        
                        {selectedPersona === persona.id && (
                          <div className="space-y-2">
                            {persona.templates.map((template, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTemplateClick(template);
                                }}
                                className="w-full text-left p-3 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                {template}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl ${message.isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-4 shadow-sm`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {!message.isUser && message.sources && (
                        <div className="mt-4 space-y-3">
                          <h4 className="font-semibold text-gray-900 text-sm">แหล่งข้อมูลอ้างอิง:</h4>
                          {message.sources.map((source, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-start justify-between mb-2">
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                                >
                                  <span>{source.title}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCredibilityColor(source.credibility)}`}>
                                  {getCredibilityLabel(source.credibility)}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{source.snippet}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <span>ความเกี่ยวข้อง:</span>
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-blue-500 h-1.5 rounded-full" 
                                      style={{ width: `${source.relevance}%` }}
                                    ></div>
                                  </div>
                                  <span>{source.relevance}%</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!message.isUser && message.followUpQuestions && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 text-sm mb-3">คำถามต่อเนื่อง:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {message.followUpQuestions.map((question, index) => (
                              <button
                                key={index}
                                onClick={() => handleFollowUpClick(question)}
                                className="text-left p-3 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {!message.isUser && (
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <div className={`w-2 h-2 rounded-full ${selectedAI.color}`}></div>
                            <span>{message.aiModel}</span>
                            <span>•</span>
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                              <Share className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
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
                        <span className="text-gray-600">กำลังคิด...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg z-30">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ถามอะไรก็ได้กับ AI..."
                className="w-full px-4 py-3 pr-32 border-0 rounded-2xl resize-none focus:outline-none focus:ring-0 max-h-32"
                rows={1}
                style={{ minHeight: '48px' }}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowHistory(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:shadow-none">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">ประวัติการแชท</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหาการสนทนา..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {searchHistory ? (
                <div className="space-y-2">
                  {filteredHistory.map((chat) => (
                    <div key={chat.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{chat.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${aiModels.find(ai => ai.id === chat.aiModel)?.color || 'bg-gray-400'}`}></div>
                          <span>{aiModels.find(ai => ai.id === chat.aiModel)?.name}</span>
                        </div>
                        <span>฿{chat.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupChatHistory()).map(([period, chats]) => {
                    if (chats.length === 0) return null;
                    
                    const periodLabels = {
                      today: 'วันนี้',
                      yesterday: 'เมื่อวาน',
                      thisWeek: 'สัปดาห์นี้',
                      older: 'เก่ากว่านี้'
                    };

                    return (
                      <div key={period}>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                          {periodLabels[period as keyof typeof periodLabels]}
                        </h3>
                        <div className="space-y-2">
                          {chats.map((chat) => (
                            <div key={chat.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                              <h4 className="font-medium text-gray-900 text-sm mb-2">{chat.title}</h4>
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${aiModels.find(ai => ai.id === chat.aiModel)?.color || 'bg-gray-400'}`}></div>
                                  <span>{aiModels.find(ai => ai.id === chat.aiModel)?.name}</span>
                                </div>
                                <span>฿{chat.cost.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{chat.messages.length} ข้อความ</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTime(chat.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}