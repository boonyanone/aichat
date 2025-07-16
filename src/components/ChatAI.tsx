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
  Globe,
  Brain,
  Zap,
  CheckCircle
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
  { 
    id: 'gpt-4', 
    name: 'GPT-4', 
    provider: 'OpenAI', 
    cost: 0.03, 
    color: 'bg-green-500',
    logo: '🤖'
  },
  { 
    id: 'claude-3', 
    name: 'Claude 3.5 Sonnet', 
    provider: 'Anthropic', 
    cost: 0.025, 
    color: 'bg-orange-500',
    logo: '🧠'
  },
  { 
    id: 'gemini-pro', 
    name: 'Gemini Pro', 
    provider: 'Google', 
    cost: 0.02, 
    color: 'bg-blue-500',
    logo: '💎'
  },
  { 
    id: 'perplexity', 
    name: 'Perplexity', 
    provider: 'Perplexity AI', 
    cost: 0.015, 
    color: 'bg-purple-500',
    logo: '🔍'
  },
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
    <div className="flex h-screen bg-gray-900">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with AI Selector and History */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              {/* AI Selector */}
              <div className="relative">
                <select
                  value={selectedAI.id}
                  onChange={(e) => setSelectedAI(aiModels.find(ai => ai.id === e.target.value) || aiModels[0])}
                  className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {aiModels.map((ai) => (
                    <option key={ai.id} value={ai.id} className="bg-gray-700">
                      {ai.logo} {ai.name} - ฿{ai.cost}/ข้อความ
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
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
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
              /* Welcome Screen */
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                      ถามอะไรก็ได้กับ AI
                    </h1>
                    <p className="text-gray-400 text-sm">
                      เลือก AI ที่เหมาะกับงานของคุณ
                    </p>
                  </div>

                  {/* AI Provider Selection */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">เลือก AI Provider:</h3>
                    {aiModels.map((ai) => (
                      <button
                        key={ai.id}
                        onClick={() => setSelectedAI(ai)}
                        className={`w-full p-3 rounded-lg border transition-all ${
                          selectedAI.id === ai.id
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{ai.logo}</span>
                            <div className="text-left">
                              <p className="font-medium">{ai.name}</p>
                              <p className="text-xs opacity-75">{ai.provider}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">฿{ai.cost}</p>
                            <p className="text-xs opacity-75">ต่อข้อความ</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Quick Start Tips */}
                  <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-300">เริ่มต้นใช้งาน</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      พิมพ์คำถามในช่องด้านล่าง หรือลองถามเรื่องที่สนใจ
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl ${message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 border border-gray-700 text-gray-100'} rounded-2xl p-4 shadow-sm`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {!message.isUser && message.sources && (
                        <div className="mt-4 space-y-3">
                          <h4 className="font-semibold text-gray-300 text-sm">แหล่งข้อมูลอ้างอิง:</h4>
                          {message.sources.map((source, index) => (
                            <div key={index} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                              <div className="flex items-start justify-between mb-2">
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                                >
                                  <span>{source.title}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCredibilityColor(source.credibility)}`}>
                                  {getCredibilityLabel(source.credibility)}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm mb-2">{source.snippet}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <span>ความเกี่ยวข้อง:</span>
                                  <div className="w-16 bg-gray-600 rounded-full h-1.5">
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
                          <h4 className="font-semibold text-gray-300 text-sm mb-3">คำถามต่อเนื่อง:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {message.followUpQuestions.map((question, index) => (
                              <button
                                key={index}
                                onClick={() => handleFollowUpClick(question)}
                                className="text-left p-3 text-sm text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {!message.isUser && (
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-600">
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <div className={`w-2 h-2 rounded-full ${selectedAI.color}`}></div>
                            <span>{message.aiModel}</span>
                            <span>•</span>
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                              <Share className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
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
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span className="text-gray-300">กำลังคิด...</span>
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
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 p-4 shadow-lg z-30">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-800 rounded-2xl border border-gray-600 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ถามอะไรก็ได้กับ AI..."
                className="w-full px-4 py-3 pr-32 border-0 rounded-2xl resize-none focus:outline-none focus:ring-0 max-h-32 bg-gray-800 text-white placeholder-gray-400"
                rows={1}
                style={{ minHeight: '48px' }}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
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
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 shadow-xl z-50 lg:relative lg:shadow-none border-l border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">ประวัติการแชท</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 text-gray-400 hover:text-gray-300 transition-colors lg:hidden"
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
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {searchHistory ? (
                <div className="space-y-2">
                  {filteredHistory.map((chat) => (
                    <div key={chat.id} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors border border-gray-600">
                      <h3 className="font-medium text-white text-sm mb-1">{chat.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
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
                        <h3 className="text-sm font-medium text-gray-400 mb-3">
                          {periodLabels[period as keyof typeof periodLabels]}
                        </h3>
                        <div className="space-y-2">
                          {chats.map((chat) => (
                            <div key={chat.id} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors border border-gray-600">
                              <h4 className="font-medium text-white text-sm mb-2">{chat.title}</h4>
                              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${aiModels.find(ai => ai.id === chat.aiModel)?.color || 'bg-gray-400'}`}></div>
                                  <span>{aiModels.find(ai => ai.id === chat.aiModel)?.name}</span>
                                </div>
                                <span>฿{chat.cost.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-400">
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