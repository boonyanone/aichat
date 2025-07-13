import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Search, 
  User, 
  Bot, 
  FileText, 
  ExternalLink, 
  Copy, 
  Share2, 
  Download, 
  Sparkles, 
  Brain, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Globe,
  BookOpen,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  Shield,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Star,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Filter,
  Settings,
  Lightbulb,
  Target,
  Award,
  TrendingUp,
  Eye,
  Link,
  Plus,
  X,
  Mic,
  Image,
  Paperclip,
  ArrowRight,
  Cpu,
  Wand2
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sources?: Source[];
  aiModel?: string;
  cost?: number;
  persona?: string;
  followUpQuestions?: string[];
}

interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  relevance: number;
  type: 'academic' | 'news' | 'government' | 'general';
}

const ChatAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('general');
  const [selectedAI, setSelectedAI] = useState('auto');
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personas = [
    { 
      id: 'general', 
      name: 'ทั่วไป', 
      icon: Users, 
      color: 'text-gray-600',
      description: 'การใช้งานทั่วไปและหลากหลาย'
    },
    { 
      id: 'student', 
      name: 'นักเรียน/นักศึกษา', 
      icon: GraduationCap, 
      color: 'text-blue-600',
      description: 'เหมาะสำหรับการเรียนรู้และทำงานวิจัย'
    },
    { 
      id: 'employee', 
      name: 'พนักงานบริษัท', 
      icon: Briefcase, 
      color: 'text-green-600',
      description: 'เน้นการวิเคราะห์ธุรกิจและประสิทธิภาพ'
    },
    { 
      id: 'government', 
      name: 'ข้าราชการ', 
      icon: Shield, 
      color: 'text-purple-600',
      description: 'มุ่งเน้นนโยบายและการบริการสาธารณะ'
    },
    { 
      id: 'organization', 
      name: 'องค์กร/หน่วยงาน', 
      icon: Building, 
      color: 'text-orange-600',
      description: 'เหมาะสำหรับการจัดการองค์กรขนาดใหญ่'
    }
  ];

  const aiModels = [
    {
      id: 'auto',
      name: 'AI Router',
      description: 'เลือกอัตโนมัติ',
      icon: Wand2,
      color: 'text-purple-600',
      cost: 'ประหยัดสุด'
    },
    {
      id: 'gpt4',
      name: 'GPT-4',
      description: 'วิเคราะห์ซับซ้อน',
      icon: Brain,
      color: 'text-green-600',
      cost: '฿0.8/คำถาม'
    },
    {
      id: 'claude',
      name: 'Claude 3.5',
      description: 'เขียนและสรุป',
      icon: FileText,
      color: 'text-blue-600',
      cost: '฿0.6/คำถาม'
    },
    {
      id: 'gemini',
      name: 'Gemini Pro',
      description: 'ความคิดสร้างสรรค์',
      icon: Sparkles,
      color: 'text-orange-600',
      cost: '฿0.4/คำถาม'
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      description: 'ค้นหาข้อมูล',
      icon: Search,
      color: 'text-teal-600',
      cost: '฿0.3/คำถาม'
    }
  ];

  const quickPrompts = [
    {
      category: 'วิจัยและการศึกษา',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      prompts: [
        'วิเคราะห์และสรุปงานวิจัยเกี่ยวกับ [หัวข้อ]',
        'เปรียบเทียบทฤษฎีต่างๆ เกี่ยวกับ [หัวข้อ]',
        'ค้นหาข้อมูลล่าสุดเกี่ยวกับ [หัวข้อ]'
      ]
    },
    {
      category: 'ธุรกิจและการตลาด',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-700 border-green-200',
      prompts: [
        'วิเคราะห์แนวโน้มตลาดในอุตสาหกรรม [ระบุ]',
        'สร้างกลยุทธ์การตลาดดิจิทัลสำหรับ [ธุรกิจ]',
        'วิเคราะห์ SWOT สำหรับ [บริษัท/โครงการ]'
      ]
    },
    {
      category: 'นโยบายและการบริหาร',
      icon: Shield,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      prompts: [
        'วิเคราะห์ผลกระทบของนโยบาย [ระบุ]',
        'เปรียบเทียบระบบการบริหารของประเทศต่างๆ',
        'ประเมินประสิทธิภาพของโครงการ [ระบุ]'
      ]
    }
  ];

  const mockSources: Source[] = [
    {
      id: '1',
      title: 'Artificial Intelligence in Education: A Comprehensive Review',
      url: 'https://example.com/ai-education-review',
      snippet: 'การศึกษาครอบคลุมเกี่ยวกับการใช้ปัญญาประดิษฐ์ในการศึกษา พบว่าสามารถเพิ่มประสิทธิภาพการเรียนรู้ได้ถึง 40%',
      domain: 'academic.edu',
      relevance: 95,
      type: 'academic'
    },
    {
      id: '2',
      title: 'Thailand Digital Education Policy 2024',
      url: 'https://example.com/thailand-digital-policy',
      snippet: 'นโยบายการศึกษาดิจิทัลของไทย มุ่งเน้นการใช้เทคโนโลยี AI เพื่อพัฒนาคุณภาพการศึกษา',
      domain: 'moe.go.th',
      relevance: 88,
      type: 'government'
    },
    {
      id: '3',
      title: 'AI Implementation in Thai Universities: Case Studies',
      url: 'https://example.com/ai-thai-universities',
      snippet: 'กรณีศึกษาการนำ AI มาใช้ในมหาวิทยาลัยไทย แสดงผลลัพธ์เชิงบวกในการเรียนการสอน',
      domain: 'researchgate.net',
      relevance: 82,
      type: 'academic'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      persona: selectedPersona
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `ตามที่คุณสอบถามเกี่ยวกับ "${inputValue}" ในฐานะ${personas.find(p => p.id === selectedPersona)?.name || 'ผู้ใช้ทั่วไป'}

จากการวิเคราะห์ข้อมูลจากแหล่งที่เชื่อถือได้หลายแหล่ง พบว่า:

**ประเด็นหลัก:**
1. **การพัฒนาเทคโนโลยี AI** มีความก้าวหน้าอย่างรวดเร็ว โดยเฉพาะในด้านการศึกษาและการวิจัย
2. **ผลกระทบต่อสังคมไทย** แสดงให้เห็นถึงโอกาสในการพัฒนาทักษะและความสามารถของคนไทย
3. **ข้อท้าทายที่สำคัญ** คือการเตรียมความพร้อมของบุคลากรและโครงสร้างพื้นฐาน

**คำแนะนำเชิงปฏิบัติ:**
- เริ่มต้นด้วยการศึกษาพื้นฐานและทำความเข้าใจเทคโนโลจี
- มุ่งเน้นการพัฒนาทักษะที่เสริมกับ AI แทนการแข่งขัน
- ติดตามแนวโน้มและการเปลี่ยนแปลงอย่างต่อเนื่อง

ข้อมูลนี้ได้มาจากการวิเคราะห์แหล่งข้อมูลที่เชื่อถือได้และเป็นปัจจุบัน`,
        timestamp: new Date(),
        sources: mockSources,
        aiModel: selectedAI === 'auto' ? 'Claude 3.5 Sonnet' : aiModels.find(ai => ai.id === selectedAI)?.name,
        cost: 0.45,
        followUpQuestions: [
          'มีตัวอย่างการใช้งาน AI ในการศึกษาไทยอย่างเป็นรูปธรรมหรือไม่?',
          'ควรเตรียมตัวอย่างไรสำหรับการเปลี่ยนแปลงนี้?',
          'มีนโยบายรัฐบาลใดที่เกี่ยวข้องกับการพัฒนา AI ในการศึกษา?'
        ]
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handlePromptSelect = (template: string) => {
    setInputValue(template);
  };

  const toggleSourceExpansion = (sourceId: string) => {
    setExpandedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <BookOpen className="h-4 w-4" />;
      case 'government': return <Shield className="h-4 w-4" />;
      case 'news': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSourceTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'text-blue-600 bg-blue-50';
      case 'government': return 'text-purple-600 bg-purple-50';
      case 'news': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const selectedPersonaData = personas.find(p => p.id === selectedPersona);
  const selectedAIData = aiModels.find(ai => ai.id === selectedAI);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Chat AI</h1>
              <p className="text-sm text-gray-500">ค้นหาและวิเคราะห์ข้อมูลด้วย AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="h-full flex flex-col">
              {/* Hero Section */}
              <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    ถามอะไรก็ได้กับ AI
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    ค้นหาข้อมูล วิเคราะห์เนื้อหา และรับคำแนะนำจาก AI ที่เหมาะสมกับบทบาทของคุณ
                  </p>

                  {/* Quick Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {quickPrompts.map((category, index) => {
                      const Icon = category.icon;
                      return (
                        <div key={index} className="text-left">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className={`p-2 rounded-lg border ${category.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <h3 className="font-medium text-gray-900">{category.category}</h3>
                          </div>
                          <div className="space-y-2">
                            {category.prompts.map((prompt, promptIndex) => (
                              <button
                                key={promptIndex}
                                onClick={() => handlePromptSelect(prompt)}
                                className="block w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
                              >
                                {prompt}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Link className="h-4 w-4 text-blue-500" />
                      <span>แหล่งอ้างอิงครบถ้วน</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>AI Router อัจฉริยะ</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>ตรวจสอบความถูกต้อง</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>แชร์ให้ทีมได้</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Messages List */
            <div className="px-6 py-4 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-4xl w-full ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                    <div className={`flex space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-purple-500 to-blue-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block p-4 rounded-2xl max-w-full ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          
                          {/* AI Message Metadata */}
                          {message.type === 'ai' && (
                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <Cpu className="h-3 w-3 mr-1" />
                                  {message.aiModel}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {message.timestamp.toLocaleTimeString('th-TH')}
                                </span>
                                <span className="flex items-center">
                                  <Star className="h-3 w-3 mr-1" />
                                  ฿{message.cost}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="p-1 hover:bg-gray-200 rounded">
                                  <Copy className="h-3 w-3" />
                                </button>
                                <button className="p-1 hover:bg-gray-200 rounded">
                                  <Share2 className="h-3 w-3" />
                                </button>
                                <button className="p-1 hover:bg-gray-200 rounded">
                                  <ThumbsUp className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium text-gray-700 flex items-center">
                              <Link className="h-4 w-4 mr-2" />
                              แหล่งอ้างอิง ({message.sources.length})
                            </h4>
                            <div className="grid gap-2">
                              {message.sources.map((source) => (
                                <div key={source.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <div className={`p-1 rounded ${getSourceTypeColor(source.type)}`}>
                                          {getSourceTypeIcon(source.type)}
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">{source.domain}</span>
                                        <div className="flex items-center">
                                          <div className="w-12 bg-gray-200 rounded-full h-1">
                                            <div 
                                              className="bg-green-500 h-1 rounded-full" 
                                              style={{ width: `${source.relevance}%` }}
                                            />
                                          </div>
                                          <span className="text-xs text-gray-500 ml-1">{source.relevance}%</span>
                                        </div>
                                      </div>
                                      <h5 className="text-sm font-medium text-gray-900 mb-1">{source.title}</h5>
                                      <p className="text-xs text-gray-600 mb-2">{source.snippet}</p>
                                      <button
                                        onClick={() => toggleSourceExpansion(source.id)}
                                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                                      >
                                        {expandedSources.includes(source.id) ? (
                                          <>ซ่อน <ChevronUp className="h-3 w-3 ml-1" /></>
                                        ) : (
                                          <>ดูเพิ่มเติม <ChevronDown className="h-3 w-3 ml-1" /></>
                                        )}
                                      </button>
                                    </div>
                                    <button className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                                      <ExternalLink className="h-4 w-4" />
                                    </button>
                                  </div>
                                  
                                  {expandedSources.includes(source.id) && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <p className="text-xs text-gray-600 mb-2">
                                        แหล่งข้อมูลนี้มีความเชื่อถือได้สูงและเป็นข้อมูลที่ทันสมัย 
                                        เหมาะสำหรับการอ้างอิงในงานวิชาการและการวิจัย
                                      </p>
                                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                                        <Eye className="h-3 w-3" />
                                        <span>ดูแล้ว 1,234 ครั้ง</span>
                                        <span>•</span>
                                        <span>อัปเดตล่าสุด: 2 วันที่แล้ว</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Follow-up Questions */}
                        {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Lightbulb className="h-4 w-4 mr-2" />
                              คำถามที่เกี่ยวข้อง
                            </h4>
                            <div className="space-y-2">
                              {message.followUpQuestions.map((question, index) => (
                                <button
                                  key={index}
                                  onClick={() => setInputValue(question)}
                                  className="block w-full text-left p-3 text-sm bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  {question}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Export Options */}
                        {message.type === 'ai' && (
                          <div className="mt-4 flex items-center space-x-2">
                            <button className="flex items-center px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                              <FileText className="h-3 w-3 mr-1" />
                              ส่งออกเป็น Word
                            </button>
                            <button className="flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                              <Share2 className="h-3 w-3 mr-1" />
                              แชร์ให้ทีม
                            </button>
                            <button className="flex items-center px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                              <Shield className="h-3 w-3 mr-1" />
                              ตรวจสอบด้วย Typhoon
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-gray-600">กำลังค้นหาและวิเคราะห์ข้อมูล...</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        ระบบกำลังเลือก AI ที่เหมาะสมสำหรับคำถามของคุณ
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
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="max-w-4xl mx-auto">
            {/* Input Container */}
            <div className="relative">
              {/* Top Controls */}
              <div className="flex items-center justify-between mb-3">
                {/* Persona Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    {selectedPersonaData && (
                      <>
                        <selectedPersonaData.icon className={`h-4 w-4 ${selectedPersonaData.color}`} />
                        <span className="text-gray-700">{selectedPersonaData.name}</span>
                      </>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {showPersonaDropdown && (
                    <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-64">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">เลือกบทบาทของคุณ</div>
                        {personas.map((persona) => {
                          const Icon = persona.icon;
                          return (
                            <button
                              key={persona.id}
                              onClick={() => {
                                setSelectedPersona(persona.id);
                                setShowPersonaDropdown(false);
                              }}
                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                                selectedPersona === persona.id ? 'bg-blue-50 border border-blue-200' : ''
                              }`}
                            >
                              <Icon className={`h-4 w-4 ${persona.color}`} />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{persona.name}</div>
                                <div className="text-xs text-gray-500">{persona.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Model Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowAIDropdown(!showAIDropdown)}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    {selectedAIData && (
                      <>
                        <selectedAIData.icon className={`h-4 w-4 ${selectedAIData.color}`} />
                        <span className="text-gray-700">{selectedAIData.name}</span>
                        <span className="text-xs text-gray-500">({selectedAIData.cost})</span>
                      </>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {showAIDropdown && (
                    <div className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-72">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">เลือก AI Model</div>
                        {aiModels.map((ai) => {
                          const Icon = ai.icon;
                          return (
                            <button
                              key={ai.id}
                              onClick={() => {
                                setSelectedAI(ai.id);
                                setShowAIDropdown(false);
                              }}
                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                                selectedAI === ai.id ? 'bg-blue-50 border border-blue-200' : ''
                              }`}
                            >
                              <Icon className={`h-4 w-4 ${ai.color}`} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900">{ai.name}</span>
                                  <span className="text-xs text-gray-500">{ai.cost}</span>
                                </div>
                                <div className="text-xs text-gray-500">{ai.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Input */}
              <div className="relative">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="ถามอะไรก็ได้..."
                      className="w-full px-4 py-3 pr-32 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                      rows={1}
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                    
                    {/* Input Actions */}
                    <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <Image className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-2 text-xs text-gray-500 text-center">
                ระบบจะเลือก AI ที่เหมาะสมและคิดค่าใช้จ่ายตามการใช้งานจริง
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;