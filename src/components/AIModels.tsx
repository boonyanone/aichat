import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Globe, 
  Bot, 
  Sparkles,
  TrendingUp,
  BarChart3,
  Settings,
  Info,
  CheckCircle,
  AlertCircle,
  Clock,
  CreditCard,
  Star,
  Award,
  Target,
  Activity,
  Cpu,
  Database,
  Network,
  Shield,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Share2,
  Download,
  Upload,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bookmark,
  Flag,
  MessageSquare,
  FileText,
  Image,
  Mic,
  Video,
  Code,
  Calculator,
  Lightbulb,
  Palette,
  Music,
  Camera,
  Map,
  Calendar,
  Mail,
  Phone,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Microscope,
  BookOpen,
  PenTool,
  Layers,
  Sliders,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  pricing: {
    input: number;
    output: number;
    unit: string;
  };
  capabilities: string[];
  strengths: string[];
  limitations: string[];
  maxTokens: number;
  languages: string[];
  status: 'active' | 'maintenance' | 'deprecated' | 'beta';
  usage: {
    requests: number;
    cost: number;
    avgResponseTime: number;
    successRate: number;
  };
  settings: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  isEnabled: boolean;
  isFavorite: boolean;
  category: 'general' | 'coding' | 'creative' | 'analysis' | 'search' | 'specialized';
}

interface ModelComparison {
  models: string[];
  criteria: string[];
}

const AIModels: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'settings' | 'usage'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModelModal, setShowModelModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparison, setComparison] = useState<ModelComparison>({ models: [], criteria: [] });
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'usage' | 'performance'>('name');

  // Mock data
  const mockModels: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'โมเดล AI ที่ทรงพลังที่สุดสำหรับงานซับซ้อน การเขียน การวิเคราะห์ และการแก้ปัญหา',
      icon: Bot,
      color: 'bg-green-500',
      pricing: {
        input: 0.03,
        output: 0.06,
        unit: 'per 1K tokens'
      },
      capabilities: ['Text Generation', 'Code Generation', 'Analysis', 'Translation', 'Summarization'],
      strengths: ['ความแม่นยำสูง', 'เข้าใจบริบทได้ดี', 'การใช้เหตุผลที่ซับซ้อน'],
      limitations: ['ราคาแพง', 'ช้ากว่าโมเดลอื่น', 'ข้อมูลตัดออฟ'],
      maxTokens: 8192,
      languages: ['Thai', 'English', 'Chinese', 'Japanese', 'Korean'],
      status: 'active',
      usage: {
        requests: 1250,
        cost: 45.80,
        avgResponseTime: 3.2,
        successRate: 98.5
      },
      settings: {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      isEnabled: true,
      isFavorite: true,
      category: 'general'
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      description: 'โมเดลที่เก่งในการอ่านและวิเคราะห์เอกสารยาว มีความปลอดภัยสูง',
      icon: Brain,
      color: 'bg-orange-500',
      pricing: {
        input: 0.003,
        output: 0.015,
        unit: 'per 1K tokens'
      },
      capabilities: ['Document Analysis', 'Long Context', 'Safety', 'Reasoning', 'Code Review'],
      strengths: ['อ่านเอกสารยาวได้', 'ความปลอดภัยสูง', 'การวิเคราะห์ที่ละเอียด'],
      limitations: ['ช้าในงานเขียนโค้ด', 'จำกัดในการสร้างสรรค์', 'ราคาปานกลาง'],
      maxTokens: 200000,
      languages: ['Thai', 'English', 'French', 'German', 'Spanish'],
      status: 'active',
      usage: {
        requests: 890,
        cost: 28.50,
        avgResponseTime: 2.8,
        successRate: 99.2
      },
      settings: {
        temperature: 0.5,
        maxTokens: 4096,
        topP: 0.9,
        frequencyPenalty: 0.1,
        presencePenalty: 0.1
      },
      isEnabled: true,
      isFavorite: false,
      category: 'analysis'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'โมเดลที่รวดเร็วและประหยัด เหมาะสำหรับงานทั่วไปและการใช้งานจำนวนมาก',
      icon: Sparkles,
      color: 'bg-blue-500',
      pricing: {
        input: 0.0005,
        output: 0.0015,
        unit: 'per 1K tokens'
      },
      capabilities: ['Fast Response', 'Multimodal', 'Cost Effective', 'General Purpose'],
      strengths: ['ราคาถูก', 'ตอบเร็ว', 'รองรับหลายรูปแบบ'],
      limitations: ['คุณภาพต่ำกว่า GPT-4', 'จำกัดในงานซับซ้อน', 'ความแม่นยำปานกลาง'],
      maxTokens: 32768,
      languages: ['Thai', 'English', 'Japanese', 'Korean', 'Hindi'],
      status: 'active',
      usage: {
        requests: 2150,
        cost: 12.30,
        avgResponseTime: 1.5,
        successRate: 96.8
      },
      settings: {
        temperature: 0.8,
        maxTokens: 1024,
        topP: 0.95,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      isEnabled: true,
      isFavorite: false,
      category: 'general'
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      provider: 'Perplexity AI',
      description: 'โมเดลที่เชี่ยวชาญในการค้นหาและให้ข้อมูลล่าสุดจากอินเทอร์เน็ต',
      icon: Globe,
      color: 'bg-purple-500',
      pricing: {
        input: 0.002,
        output: 0.006,
        unit: 'per 1K tokens'
      },
      capabilities: ['Real-time Search', 'Current Information', 'Source Citation', 'Fact Checking'],
      strengths: ['ข้อมูลล่าสุด', 'อ้างอิงแหล่งที่มา', 'ตรวจสอบข้อเท็จจริง'],
      limitations: ['จำกัดในการสร้างสรรค์', 'ช้าเนื่องจากค้นหา', 'ราคาปานกลาง'],
      maxTokens: 4096,
      languages: ['Thai', 'English', 'Chinese', 'Japanese'],
      status: 'active',
      usage: {
        requests: 650,
        cost: 18.90,
        avgResponseTime: 4.1,
        successRate: 94.2
      },
      settings: {
        temperature: 0.3,
        maxTokens: 2048,
        topP: 0.8,
        frequencyPenalty: 0.2,
        presencePenalty: 0.1
      },
      isEnabled: true,
      isFavorite: false,
      category: 'search'
    },
    {
      id: 'ai-router',
      name: 'AI Router',
      provider: 'ThaiAI',
      description: 'ระบบอัจฉริยะที่เลือก AI Model ที่เหมาะสมที่สุดสำหรับแต่ละงานโดยอัตโนมัติ',
      icon: Zap,
      color: 'bg-yellow-500',
      pricing: {
        input: 0.001,
        output: 0.003,
        unit: 'per 1K tokens + model cost'
      },
      capabilities: ['Auto Selection', 'Cost Optimization', 'Performance Routing', 'Fallback'],
      strengths: ['ประหยัดสุด', 'เลือกอัตโนมัติ', 'ประสิทธิภาพดี'],
      limitations: ['ไม่สามารถควบคุมได้', 'อาจช้าในการเลือก', 'ขึ้นกับโมเดลอื่น'],
      maxTokens: 0,
      languages: ['All supported by underlying models'],
      status: 'active',
      usage: {
        requests: 3200,
        cost: 35.60,
        avgResponseTime: 2.1,
        successRate: 97.8
      },
      settings: {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 0.9,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      isEnabled: true,
      isFavorite: true,
      category: 'specialized'
    },
    {
      id: 'codellama',
      name: 'Code Llama',
      provider: 'Meta',
      description: 'โมเดลที่เชี่ยวชาญด้านการเขียนโค้ดและการแก้ไขปัญหาทางเทคนิค',
      icon: Code,
      color: 'bg-indigo-500',
      pricing: {
        input: 0.0015,
        output: 0.002,
        unit: 'per 1K tokens'
      },
      capabilities: ['Code Generation', 'Code Review', 'Debugging', 'Documentation'],
      strengths: ['เก่งเขียนโค้ด', 'ราคาถูก', 'รองรับหลายภาษา'],
      limitations: ['จำกัดในงานทั่วไป', 'ไม่เก่งภาษาไทย', 'คุณภาพแปรผัน'],
      maxTokens: 16384,
      languages: ['English', 'Python', 'JavaScript', 'Java', 'C++'],
      status: 'beta',
      usage: {
        requests: 420,
        cost: 8.50,
        avgResponseTime: 2.3,
        successRate: 92.1
      },
      settings: {
        temperature: 0.2,
        maxTokens: 4096,
        topP: 0.95,
        frequencyPenalty: 0.1,
        presencePenalty: 0.0
      },
      isEnabled: false,
      isFavorite: false,
      category: 'coding'
    }
  ];

  useEffect(() => {
    setModels(mockModels);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'deprecated':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'beta':
        return <FlaskConical className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'ใช้งานได้';
      case 'maintenance':
        return 'ปรับปรุง';
      case 'deprecated':
        return 'เลิกใช้';
      case 'beta':
        return 'ทดลอง';
      default:
        return 'ไม่ทราบ';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general':
        return <MessageSquare className="h-4 w-4" />;
      case 'coding':
        return <Code className="h-4 w-4" />;
      case 'creative':
        return <Palette className="h-4 w-4" />;
      case 'analysis':
        return <BarChart3 className="h-4 w-4" />;
      case 'search':
        return <Globe className="h-4 w-4" />;
      case 'specialized':
        return <Target className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general':
        return 'ทั่วไป';
      case 'coding':
        return 'เขียนโค้ด';
      case 'creative':
        return 'สร้างสรรค์';
      case 'analysis':
        return 'วิเคราะห์';
      case 'search':
        return 'ค้นหา';
      case 'specialized':
        return 'เฉพาะทาง';
      default:
        return 'อื่นๆ';
    }
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || model.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || model.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedModels = [...filteredModels].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'cost':
        return a.pricing.input - b.pricing.input;
      case 'usage':
        return b.usage.requests - a.usage.requests;
      case 'performance':
        return b.usage.successRate - a.usage.successRate;
      default:
        return 0;
    }
  });

  const toggleModelEnabled = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, isEnabled: !model.isEnabled } : model
    ));
  };

  const toggleModelFavorite = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, isFavorite: !model.isFavorite } : model
    ));
  };

  const updateModelSettings = (modelId: string, settings: Partial<AIModel['settings']>) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, settings: { ...model.settings, ...settings } } : model
    ));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Brain className="h-7 w-7 mr-3 text-blue-600" />
              โมเดล AI
            </h1>
            <p className="text-gray-600 text-sm mt-1">จัดการและเปรียบเทียบโมเดล AI ต่างๆ</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowComparisonModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              เปรียบเทียบ
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'ภาพรวม', icon: Eye },
            { id: 'comparison', label: 'เปรียบเทียบ', icon: BarChart3 },
            { id: 'settings', label: 'ตั้งค่า', icon: Settings },
            { id: 'usage', label: 'การใช้งาน', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div>
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาโมเดล AI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">หมวดหมู่ทั้งหมด</option>
                <option value="general">ทั่วไป</option>
                <option value="coding">เขียนโค้ด</option>
                <option value="creative">สร้างสรรค์</option>
                <option value="analysis">วิเคราะห์</option>
                <option value="search">ค้นหา</option>
                <option value="specialized">เฉพาะทาง</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="active">ใช้งานได้</option>
                <option value="beta">ทดลอง</option>
                <option value="maintenance">ปรับปรุง</option>
                <option value="deprecated">เลิกใช้</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">เรียงตามชื่อ</option>
                <option value="cost">เรียงตามราคา</option>
                <option value="usage">เรียงตามการใช้งาน</option>
                <option value="performance">เรียงตามประสิทธิภาพ</option>
              </select>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedModels.map((model) => {
                const Icon = model.icon;
                return (
                  <div
                    key={model.id}
                    className={`bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                      model.isEnabled ? 'border-gray-200 hover:border-blue-300' : 'border-gray-100 opacity-60'
                    }`}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModelModal(true);
                    }}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`${model.color} p-3 rounded-xl`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                            <p className="text-sm text-gray-600">{model.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleModelFavorite(model.id);
                            }}
                            className={`p-1 rounded-lg transition-colors ${
                              model.isFavorite ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Star className={`h-4 w-4 ${model.isFavorite ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleModelEnabled(model.id);
                            }}
                            className="p-1 rounded-lg transition-colors hover:bg-gray-100"
                          >
                            {model.isEnabled ? (
                              <ToggleRight className="h-5 w-5 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Status and Category */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(model.status)}
                          <span className="text-sm text-gray-600">{getStatusLabel(model.status)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(model.category)}
                          <span className="text-sm text-gray-600">{getCategoryLabel(model.category)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{model.description}</p>

                      {/* Pricing */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">ราคา Input:</span>
                          <span className="font-medium text-gray-900">฿{model.pricing.input.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">ราคา Output:</span>
                          <span className="font-medium text-gray-900">฿{model.pricing.output.toFixed(4)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{model.pricing.unit}</p>
                      </div>

                      {/* Usage Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">คำขอ</span>
                          </div>
                          <p className="text-lg font-bold text-blue-600">{model.usage.requests.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">ค่าใช้จ่าย</span>
                          </div>
                          <p className="text-lg font-bold text-green-600">฿{model.usage.cost.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">ความสำเร็จ:</span>
                          <span className="font-medium text-gray-900">{model.usage.successRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${model.usage.successRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">เปรียบเทียบโมเดล AI</h2>
              
              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">โมเดล</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">ผู้ให้บริการ</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">ราคา Input</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">ราคา Output</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Max Tokens</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">ความสำเร็จ</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">เวลาตอบ</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedModels.map((model) => {
                      const Icon = model.icon;
                      return (
                        <tr key={model.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className={`${model.color} p-2 rounded-lg`}>
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{model.name}</p>
                                <p className="text-sm text-gray-600">{getCategoryLabel(model.category)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{model.provider}</td>
                          <td className="py-4 px-4 text-gray-700">฿{model.pricing.input.toFixed(4)}</td>
                          <td className="py-4 px-4 text-gray-700">฿{model.pricing.output.toFixed(4)}</td>
                          <td className="py-4 px-4 text-gray-700">
                            {model.maxTokens > 0 ? model.maxTokens.toLocaleString() : 'ไม่จำกัด'}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${model.usage.successRate}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-700">{model.usage.successRate}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{model.usage.avgResponseTime}s</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(model.status)}
                              <span className="text-sm text-gray-700">{getStatusLabel(model.status)}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="space-y-6">
              {sortedModels.filter(model => model.isEnabled).map((model) => {
                const Icon = model.icon;
                return (
                  <div key={model.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`${model.color} p-3 rounded-xl`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                        <p className="text-sm text-gray-600">{model.provider}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Temperature */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Temperature ({model.settings.temperature})
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={model.settings.temperature}
                          onChange={(e) => updateModelSettings(model.id, { temperature: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>เป็นระเบียบ</span>
                          <span>สร้างสรรค์</span>
                        </div>
                      </div>

                      {/* Max Tokens */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                        <input
                          type="number"
                          min="1"
                          max={model.maxTokens || 8192}
                          value={model.settings.maxTokens}
                          onChange={(e) => updateModelSettings(model.id, { maxTokens: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Top P */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Top P ({model.settings.topP})
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={model.settings.topP}
                          onChange={(e) => updateModelSettings(model.id, { topP: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Frequency Penalty */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency Penalty ({model.settings.frequencyPenalty})
                        </label>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.1"
                          value={model.settings.frequencyPenalty}
                          onChange={(e) => updateModelSettings(model.id, { frequencyPenalty: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Presence Penalty */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Presence Penalty ({model.settings.presencePenalty})
                        </label>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.1"
                          value={model.settings.presencePenalty}
                          onChange={(e) => updateModelSettings(model.id, { presencePenalty: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        บันทึกการตั้งค่า
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div>
            {/* Usage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">คำขอทั้งหมด</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {models.reduce((sum, model) => sum + model.usage.requests, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">ค่าใช้จ่ายรวม</h3>
                    <p className="text-2xl font-bold text-green-600">
                      ฿{models.reduce((sum, model) => sum + model.usage.cost, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">เวลาตอบเฉลี่ย</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {(models.reduce((sum, model) => sum + model.usage.avgResponseTime, 0) / models.length).toFixed(1)}s
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">ความสำเร็จเฉลี่ย</h3>
                    <p className="text-2xl font-bold text-orange-600">
                      {(models.reduce((sum, model) => sum + model.usage.successRate, 0) / models.length).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage by Model */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">การใช้งานตามโมเดล</h3>
              <div className="space-y-4">
                {models
                  .sort((a, b) => b.usage.requests - a.usage.requests)
                  .map((model, index) => {
                    const Icon = model.icon;
                    const totalRequests = models.reduce((sum, m) => sum + m.usage.requests, 0);
                    const percentage = totalRequests > 0 ? (model.usage.requests / totalRequests) * 100 : 0;
                    
                    return (
                      <div key={model.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                          </div>
                          <div className={`${model.color} p-2 rounded-lg`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{model.name}</p>
                            <p className="text-sm text-gray-600">{model.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{model.usage.requests.toLocaleString()} คำขอ</p>
                            <p className="text-sm text-gray-600">฿{model.usage.cost.toFixed(2)}</p>
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${model.color.replace('bg-', 'bg-')}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 w-12 text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Detail Modal */}
      {showModelModal && selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`${selectedModel.color} p-3 rounded-xl`}>
                  <selectedModel.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedModel.name}</h3>
                  <p className="text-sm text-gray-600">{selectedModel.provider}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModelModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">คำอธิบาย</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedModel.description}</p>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">ความสามารถ</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModel.capabilities.map((capability, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strengths & Limitations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">จุดแข็ง</h4>
                    <ul className="space-y-2">
                      {selectedModel.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">ข้อจำกัด</h4>
                    <ul className="space-y-2">
                      {selectedModel.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">รายละเอียดทางเทคนิค</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Max Tokens</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedModel.maxTokens > 0 ? selectedModel.maxTokens.toLocaleString() : 'ไม่จำกัด'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">ภาษาที่รองรับ</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedModel.languages.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">สถานะ</p>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(selectedModel.status)}
                        <span className="text-sm font-semibold text-gray-900">{getStatusLabel(selectedModel.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">ภาษาที่รองรับ</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModel.languages.map((language, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleModelFavorite(selectedModel.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      selectedModel.isFavorite 
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Star className={`h-4 w-4 mr-2 ${selectedModel.isFavorite ? 'fill-current' : ''}`} />
                    {selectedModel.isFavorite ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowModelModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ปิด
                  </button>
                  <button
                    onClick={() => toggleModelEnabled(selectedModel.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedModel.isEnabled
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedModel.isEnabled ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModels;