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
  Link
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
  const [selectedPersona, setSelectedPersona] = useState('');
  const [showPersonaSelector, setShowPersonaSelector] = useState(true);
  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personas = [
    { 
      id: 'student', 
      name: 'นักเรียน/นักศึกษา', 
      icon: GraduationCap, 
      color: 'bg-blue-500',
      description: 'เหมาะสำหรับการเรียนรู้และทำงานวิจัย'
    },
    { 
      id: 'employee', 
      name: 'พนักงานบริษัท', 
      icon: Briefcase, 
      color: 'bg-green-500',
      description: 'เน้นการวิเคราะห์ธุรกิจและประสิทธิภาพ'
    },
    { 
      id: 'government', 
      name: 'ข้าราชการ', 
      icon: Shield, 
      color: 'bg-purple-500',
      description: 'มุ่งเน้นนโยบายและการบริการสาธารณะ'
    },
    { 
      id: 'organization', 
      name: 'องค์กร/หน่วยงาน', 
      icon: Building, 
      color: 'bg-orange-500',
      description: 'เหมาะสำหรับการจัดการองค์กรขนาดใหญ่'
    },
    { 
      id: 'general', 
      name: 'ทั่วไป', 
      icon: Users, 
      color: 'bg-gray-500',
      description: 'การใช้งานทั่วไปและหลากหลาย'
    }
  ];

  const promptTemplates = [
    {
      category: 'วิจัยและการศึกษา',
      templates: [
        'วิเคราะห์และสรุปงานวิจัยเกี่ยวกับ [หัวข้อ] พร้อมแหล่งอ้างอิงที่น่าเชื่อถือ',
        'เปรียบเทียบทฤษฎีต่างๆ เกี่ยวกับ [หัวข้อ] และให้ตัวอย่างการประยุกต์ใช้',
        'ค้นหาข้อมูลล่าสุดเกี่ยวกับ [หัวข้อ] จากแหล่งวิชาการที่เชื่อถือได้'
      ]
    },
    {
      category: 'ธุรกิจและการตลาด',
      templates: [
        'วิเคราะห์แนวโน้มตลาดและคู่แข่งในอุตสาหกรรม [ระบุอุตสาหกรรม]',
        'สร้างกลยุทธ์การตลาดดิจิทัลสำหรับ [ประเภทธุรกิจ]',
        'วิเคราะห์ SWOT และให้คำแนะนำเชิงกลยุทธ์สำหรับ [บริษัท/โครงการ]'
      ]
    },
    {
      category: 'นโยบายและการบริหาร',
      templates: [
        'วิเคราะห์ผลกระทบของนโยบาย [ระบุนโยบาย] ต่อสังคมไทย',
        'เปรียบเทียบระบบการบริหารจัดการของประเทศต่างๆ ในเรื่อง [หัวข้อ]',
        'ประเมินประสิทธิภาพของโครงการ [ระบุโครงการ] และข้อเสนอแนะ'
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
    setShowPersonaSelector(false);

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
- เริ่มต้นด้วยการศึกษาพื้นฐานและทำความเข้าใจเทคโนโลジี
- มุ่งเน้นการพัฒนาทักษะที่เสริมกับ AI แทนการแข่งขัน
- ติดตามแนวโน้มและการเปลี่ยนแปลงอย่างต่อเนื่อง

ข้อมูลนี้ได้มาจากการวิเคราะห์แหล่งข้อมูลที่เชื่อถือได้และเป็นปัจจุบัน`,
        timestamp: new Date(),
        sources: mockSources,
        aiModel: 'Claude 3.5 Sonnet',
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
    setSelectedPromptTemplate(template);
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

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Brain className="h-7 w-7 mr-3 text-blue-600" />
              Chat AI
            </h1>
            <p className="text-gray-600 text-sm mt-1">ค้นหาและวิเคราะห์ข้อมูลด้วย AI หลายค่าย</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">เริ่มต้นการสนทนากับ AI</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  ค้นหาข้อมูล วิเคราะห์เนื้อหา และรับคำแนะนำจาก AI ที่เหมาะสมกับบทบาทของคุณ
                </p>

                {/* Persona Selector */}
                {showPersonaSelector && (
                  <div className="max-w-4xl mx-auto mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">เลือกบทบาทของคุณ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {personas.map((persona) => {
                        const Icon = persona.icon;
                        return (
                          <button
                            key={persona.id}
                            onClick={() => setSelectedPersona(persona.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              selectedPersona === persona.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`${persona.color} p-2 rounded-lg`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <span className="font-medium text-gray-900">{persona.name}</span>
                            </div>
                            <p className="text-sm text-gray-600">{persona.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Prompt Templates */}
                {selectedPersona && (
                  <div className="max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">เทมเพลตคำถามแนะนำ</h3>
                    <div className="space-y-4">
                      {promptTemplates.map((category, index) => (
                        <div key={index} className="text-left">
                          <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                            <Target className="h-4 w-4 mr-2 text-blue-600" />
                            {category.category}
                          </h4>
                          <div className="grid gap-2">
                            {category.templates.map((template, templateIndex) => (
                              <button
                                key={templateIndex}
                                onClick={() => handlePromptSelect(template)}
                                className="p-3 text-sm text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                              >
                                {template}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                      <div className={`inline-block p-4 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        
                        {/* AI Message Metadata */}
                        {message.type === 'ai' && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Zap className="h-3 w-3 mr-1" />
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
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Copy className="h-3 w-3" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Share2 className="h-3 w-3" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
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
                              <div key={source.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
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
                  <div className="bg-white border border-gray-200 rounded-2xl p-4">
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

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="max-w-4xl mx-auto">
              {selectedPersona && (
                <div className="mb-3 flex items-center space-x-2">
                  <div className={`${personas.find(p => p.id === selectedPersona)?.color} p-1 rounded`}>
                    {React.createElement(personas.find(p => p.id === selectedPersona)?.icon || Users, { 
                      className: "h-4 w-4 text-white" 
                    })}
                  </div>
                  <span className="text-sm text-gray-600">
                    ถามในฐานะ: {personas.find(p => p.id === selectedPersona)?.name}
                  </span>
                  <button 
                    onClick={() => setSelectedPersona('')}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    เปลี่ยน
                  </button>
                </div>
              )}
              
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
                    placeholder={selectedPersona ? "พิมพ์คำถามของคุณ..." : "เลือกบทบาทก่อนเริ่มสนทนา"}
                    disabled={!selectedPersona}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    rows={3}
                  />
                  <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {inputValue.length}/2000
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || !selectedPersona || isLoading}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                ระบบจะเลือก AI ที่เหมาะสมและคิดค่าใช้จ่ายตามการใช้งานจริง
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - AI Models & Tips */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* AI Router Status */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                AI Router
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                ระบบจะเลือก AI ที่เหมาะสมกับคำถามของคุณโดยอัตโนมัติ
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>GPT-4</span>
                  <span className="text-green-600">เหมาะสำหรับการวิเคราะห์</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Claude 3.5</span>
                  <span className="text-blue-600">เหมาะสำหรับการเขียน</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Perplexity</span>
                  <span className="text-purple-600">เหมาะสำหรับการค้นหา</span>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">สถิติการใช้งานวันนี้</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">คำถามที่ถาม</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">เครดิตที่ใช้</span>
                  <span className="font-medium text-orange-600">฿2.45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ประหยัดได้</span>
                  <span className="font-medium text-green-600">฿1.20</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                เทคนิคการใช้งาน
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    💡 ระบุบริบทให้ชัดเจนจะได้คำตอบที่แม่นยำมากขึ้น
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    🎯 ใช้เทมเพลตคำถามเพื่อประหยัดเวลาและเครดิต
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    📚 ตรวจสอบแหล่งอ้างอิงก่อนนำไปใช้งาน
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">การดำเนินการด่วน</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-3 text-blue-600" />
                    <span className="text-sm">สร้างรายงานใหม่</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-3 text-green-600" />
                    <span className="text-sm">เชิญทีมเข้าร่วม</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-3 text-purple-600" />
                    <span className="text-sm">ดาวน์โหลดประวัติ</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;