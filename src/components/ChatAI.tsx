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
  X
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
    { id: 'student', label: 'นักเรียน/นักศึกษา', icon: '🎓' },
    { id: 'employee', label: 'พนักงาน', icon: '💼' },
    { id: 'government', label: 'ข้าราชการ', icon: '🏛️' },
    { id: 'researcher', label: 'นักวิจัย', icon: '🔬' },
    { id: 'business', label: 'ธุรกิจ', icon: '📈' },
    { id: 'organization', label: 'หน่วยงาน/องค์กร', icon: '🏢' },
    { id: 'general', label: 'ทั่วไป', icon: '👤' }
  ];

  const aiModels = [
    { id: 'ai-router', name: 'AI Router', description: 'เลือกอัตโนมัติ', icon: Zap, color: 'text-yellow-600', cost: 'ประหยัดสุด' },
    { id: 'gpt-4', name: 'GPT-4', description: 'ทรงพลังที่สุด', icon: Brain, color: 'text-green-600', cost: '฿0.03/1K tokens' },
    { id: 'claude', name: 'Claude 3.5', description: 'เก่งวิเคราะห์', icon: Bot, color: 'text-orange-600', cost: '฿0.003/1K tokens' },
    { id: 'gemini', name: 'Gemini Pro', description: 'รวดเร็วประหยัด', icon: Sparkles, color: 'text-blue-600', cost: '฿0.0005/1K tokens' },
    { id: 'perplexity', name: 'Perplexity', description: 'ค้นหาข้อมูลล่าสุด', icon: Globe, color: 'text-purple-600', cost: '฿0.002/1K tokens' }
  ];

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
              {/* Welcome Screen */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">สวัสดี! ผมคือ ThaiAI</h2>
                <p className="text-gray-600">เลือกบทบาทของคุณเพื่อเริ่มการสนทนาที่เหมาะสม</p>
              </div>

              {/* Persona Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">คุณคือใคร?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {personas.map(persona => (
                    <button
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona.id)}
                      className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        selectedPersona === persona.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-2xl mb-2">{persona.icon}</div>
                      <div className="text-sm font-medium">{persona.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Model Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">เลือก AI ที่ต้องการ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiModels.map(model => {
                    const Icon = model.icon;
                    return (
                      <button
                        key={model.id}
                        onClick={() => setSelectedAI(model.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedAI === model.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className={`h-6 w-6 ${model.color}`} />
                          <div>
                            <h4 className="font-semibold text-gray-900">{model.name}</h4>
                            <p className="text-sm text-gray-600">{model.description}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{model.cost}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
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
                            : 'bg-white border border-gray-200 text-gray-900'
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
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-700">แหล่งอ้างอิง:</h4>
                                <div className="space-y-1">
                                  {message.sources.map((source, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                        {source.title}
                                      </a>
                                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                                        <span>เกี่ยวข้อง: {source.relevance}%</span>
                                        <span>น่าเชื่อถือ: {source.credibility}%</span>
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
                    <div className="bg-white border border-gray-200 rounded-2xl p-4">
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
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="พิมพ์ข้อความของคุณ..."
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