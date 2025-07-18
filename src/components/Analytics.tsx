import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  MessageSquare, 
  FileText,
  Brain,
  Clock,
  CreditCard,
  Zap,
  Calendar,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  Activity,
  Globe,
  Building,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  Share2,
  Bookmark,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  PieChart,
  LineChart,
  BarChart,
  DollarSign,
  Percent,
  Hash,
  Timer,
  Cpu,
  Database,
  Network,
  Shield,
  Lightbulb,
  Palette,
  Code,
  Mic,
  Video,
  Image,
  Music,
  Map,
  Mail,
  Phone,
  Link,
  ExternalLink,
  Copy,
  Save,
  Upload,
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRequests: number;
    totalCost: number;
    totalUsers: number;
    totalDocuments: number;
    totalMeetings: number;
    avgResponseTime: number;
    successRate: number;
    costPerRequest: number;
  };
  trends: {
    requests: Array<{ date: string; value: number; }>;
    costs: Array<{ date: string; value: number; }>;
    users: Array<{ date: string; value: number; }>;
    models: Array<{ date: string; gpt4: number; claude: number; gemini: number; perplexity: number; }>;
  };
  modelUsage: Array<{
    name: string;
    requests: number;
    cost: number;
    percentage: number;
    avgResponseTime: number;
    successRate: number;
    color: string;
  }>;
  userActivity: Array<{
    name: string;
    department: string;
    requests: number;
    cost: number;
    favoriteModel: string;
    lastActive: Date;
  }>;
  categories: Array<{
    name: string;
    requests: number;
    cost: number;
    percentage: number;
    icon: React.ComponentType<any>;
    color: string;
  }>;
  timeDistribution: Array<{
    hour: number;
    requests: number;
    cost: number;
  }>;
  costBreakdown: {
    models: number;
    storage: number;
    processing: number;
    bandwidth: number;
  };
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'requests' | 'costs' | 'users'>('requests');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockData: AnalyticsData = {
    overview: {
      totalRequests: 15847,
      totalCost: 2847.50,
      totalUsers: 24,
      totalDocuments: 342,
      totalMeetings: 67,
      avgResponseTime: 2.3,
      successRate: 97.8,
      costPerRequest: 0.18
    },
    trends: {
      requests: [
        { date: '2024-01-01', value: 450 },
        { date: '2024-01-02', value: 520 },
        { date: '2024-01-03', value: 380 },
        { date: '2024-01-04', value: 680 },
        { date: '2024-01-05', value: 750 },
        { date: '2024-01-06', value: 620 },
        { date: '2024-01-07', value: 890 }
      ],
      costs: [
        { date: '2024-01-01', value: 85.50 },
        { date: '2024-01-02', value: 92.30 },
        { date: '2024-01-03', value: 78.20 },
        { date: '2024-01-04', value: 125.80 },
        { date: '2024-01-05', value: 145.60 },
        { date: '2024-01-06', value: 118.90 },
        { date: '2024-01-07', value: 167.40 }
      ],
      users: [
        { date: '2024-01-01', value: 18 },
        { date: '2024-01-02', value: 20 },
        { date: '2024-01-03', value: 19 },
        { date: '2024-01-04', value: 22 },
        { date: '2024-01-05', value: 24 },
        { date: '2024-01-06', value: 23 },
        { date: '2024-01-07', value: 24 }
      ],
      models: [
        { date: '2024-01-01', gpt4: 180, claude: 120, gemini: 100, perplexity: 50 },
        { date: '2024-01-02', gpt4: 200, claude: 140, gemini: 120, perplexity: 60 },
        { date: '2024-01-03', gpt4: 150, claude: 100, gemini: 90, perplexity: 40 },
        { date: '2024-01-04', gpt4: 280, claude: 180, gemini: 150, perplexity: 70 },
        { date: '2024-01-05', gpt4: 320, claude: 200, gemini: 170, perplexity: 60 },
        { date: '2024-01-06', gpt4: 250, claude: 160, gemini: 140, perplexity: 70 },
        { date: '2024-01-07', gpt4: 380, claude: 220, gemini: 200, perplexity: 90 }
      ]
    },
    modelUsage: [
      { name: 'GPT-4', requests: 6250, cost: 1245.80, percentage: 39.4, avgResponseTime: 3.2, successRate: 98.5, color: 'bg-green-500' },
      { name: 'Claude 3.5', requests: 4180, cost: 687.90, percentage: 26.4, avgResponseTime: 2.8, successRate: 99.2, color: 'bg-orange-500' },
      { name: 'Gemini Pro', requests: 3920, cost: 425.30, percentage: 24.7, avgResponseTime: 1.5, successRate: 96.8, color: 'bg-blue-500' },
      { name: 'Perplexity', requests: 1497, cost: 488.50, percentage: 9.5, avgResponseTime: 4.1, successRate: 94.2, color: 'bg-purple-500' }
    ],
    userActivity: [
      { name: 'คุณสมชาย วิทยากร', department: 'วิจัยและพัฒนา', requests: 2847, cost: 425.80, favoriteModel: 'GPT-4', lastActive: new Date() },
      { name: 'คุณปัทมา ธุรกิจ', department: 'การตลาด', requests: 2156, cost: 318.90, favoriteModel: 'Claude 3.5', lastActive: new Date(Date.now() - 3600000) },
      { name: 'คุณอนุชา นักศึกษา', department: 'วิจัย', requests: 1893, cost: 245.60, favoriteModel: 'Gemini Pro', lastActive: new Date(Date.now() - 7200000) },
      { name: 'คุณวิชัย เทคนิค', department: 'เทคโนโลยี', requests: 1654, cost: 287.30, favoriteModel: 'Claude 3.5', lastActive: new Date(Date.now() - 86400000) },
      { name: 'คุณสุดา วิเคราะห์', department: 'วิเคราะห์', requests: 1247, cost: 198.70, favoriteModel: 'Perplexity', lastActive: new Date(Date.now() - 172800000) }
    ],
    categories: [
      { name: 'การสนทนาทั่วไป', requests: 6250, cost: 892.40, percentage: 39.4, icon: MessageSquare, color: 'bg-blue-500' },
      { name: 'วิเคราะห์เอกสาร', requests: 4180, cost: 756.80, percentage: 26.4, icon: FileText, color: 'bg-green-500' },
      { name: 'การเขียนโค้ด', requests: 2890, cost: 445.60, percentage: 18.2, icon: Code, color: 'bg-purple-500' },
      { name: 'สรุปการประชุม', requests: 1654, cost: 387.90, percentage: 10.4, icon: Video, color: 'bg-orange-500' },
      { name: 'การค้นหาข้อมูล', requests: 873, cost: 364.80, percentage: 5.6, icon: Globe, color: 'bg-red-500' }
    ],
    timeDistribution: [
      { hour: 0, requests: 45, cost: 8.90 },
      { hour: 1, requests: 32, cost: 6.40 },
      { hour: 2, requests: 28, cost: 5.60 },
      { hour: 3, requests: 35, cost: 7.00 },
      { hour: 4, requests: 42, cost: 8.40 },
      { hour: 5, requests: 58, cost: 11.60 },
      { hour: 6, requests: 89, cost: 17.80 },
      { hour: 7, requests: 156, cost: 31.20 },
      { hour: 8, requests: 234, cost: 46.80 },
      { hour: 9, requests: 345, cost: 69.00 },
      { hour: 10, requests: 456, cost: 91.20 },
      { hour: 11, requests: 523, cost: 104.60 },
      { hour: 12, requests: 489, cost: 97.80 },
      { hour: 13, requests: 567, cost: 113.40 },
      { hour: 14, requests: 634, cost: 126.80 },
      { hour: 15, requests: 598, cost: 119.60 },
      { hour: 16, requests: 545, cost: 109.00 },
      { hour: 17, requests: 467, cost: 93.40 },
      { hour: 18, requests: 356, cost: 71.20 },
      { hour: 19, requests: 267, cost: 53.40 },
      { hour: 20, requests: 189, cost: 37.80 },
      { hour: 21, requests: 134, cost: 26.80 },
      { hour: 22, requests: 98, cost: 19.60 },
      { hour: 23, requests: 67, cost: 13.40 }
    ],
    costBreakdown: {
      models: 2156.80,
      storage: 245.60,
      processing: 318.90,
      bandwidth: 126.20
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return '7 วันที่แล้ว';
      case '30d': return '30 วันที่แล้ว';
      case '90d': return '3 เดือนที่แล้ว';
      case '1y': return '1 ปีที่แล้ว';
      default: return '30 วันที่แล้ว';
    }
  };

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('th-TH');
  };

  const getChangePercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const renderChart = (data: any[], type: 'line' | 'bar' = 'line') => {
    const maxValue = Math.max(...data.map(d => d.value || Math.max(d.gpt4 || 0, d.claude || 0, d.gemini || 0, d.perplexity || 0)));
    
    return (
      <div className="h-64 flex items-end space-x-2 p-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            {type === 'line' ? (
              <div className="w-full bg-blue-100 rounded-t relative" style={{ height: `${(item.value / maxValue) * 200}px` }}>
                <div className="absolute top-0 left-0 w-full bg-blue-500 rounded-t" style={{ height: '4px' }} />
              </div>
            ) : (
              <div className="w-full space-y-1">
                {item.gpt4 && (
                  <div className="bg-green-500 rounded" style={{ height: `${(item.gpt4 / maxValue) * 50}px` }} />
                )}
                {item.claude && (
                  <div className="bg-orange-500 rounded" style={{ height: `${(item.claude / maxValue) * 50}px` }} />
                )}
                {item.gemini && (
                  <div className="bg-blue-500 rounded" style={{ height: `${(item.gemini / maxValue) * 50}px` }} />
                )}
                {item.perplexity && (
                  <div className="bg-purple-500 rounded" style={{ height: `${(item.perplexity / maxValue) * 50}px` }} />
                )}
              </div>
            )}
            <span className="text-xs text-gray-500 mt-2">
              {new Date(item.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลดข้อมูลการวิเคราะห์...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">ไม่สามารถโหลดข้อมูลได้</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-7 w-7 mr-3 text-blue-600" />
              รายงานการใช้งาน
            </h1>
            <p className="text-gray-600 text-sm mt-1">วิเคราะห์และติดตามการใช้งาน AI ของคุณ</p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">7 วันที่แล้ว</option>
              <option value="30d">30 วันที่แล้ว</option>
              <option value="90d">3 เดือนที่แล้ว</option>
              <option value="1y">1 ปีที่แล้ว</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              ส่งออกรายงาน
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center text-sm font-medium text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +12.5%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(data.overview.totalRequests)}
            </h3>
            <p className="text-sm text-gray-600">คำขอทั้งหมด</p>
            <p className="text-xs text-gray-500 mt-2">{getTimeRangeLabel(timeRange)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center text-sm font-medium text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +8.3%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(data.overview.totalCost)}
            </h3>
            <p className="text-sm text-gray-600">ค่าใช้จ่ายรวม</p>
            <p className="text-xs text-gray-500 mt-2">{getTimeRangeLabel(timeRange)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center text-sm font-medium text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +15.2%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(data.overview.totalUsers)}
            </h3>
            <p className="text-sm text-gray-600">ผู้ใช้งานที่ใช้งาน</p>
            <p className="text-xs text-gray-500 mt-2">{getTimeRangeLabel(timeRange)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center text-sm font-medium text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +2.1%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {data.overview.successRate}%
            </h3>
            <p className="text-sm text-gray-600">อัตราความสำเร็จ</p>
            <p className="text-xs text-gray-500 mt-2">{getTimeRangeLabel(timeRange)}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trends Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">แนวโน้มการใช้งาน</h3>
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="requests">คำขอ</option>
                  <option value="costs">ค่าใช้จ่าย</option>
                  <option value="users">ผู้ใช้งาน</option>
                </select>
              </div>
            </div>
            {renderChart(data.trends[selectedMetric])}
          </div>

          {/* Model Usage Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">การใช้งานตาม AI Model</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            {renderChart(data.trends.models, 'bar')}
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">GPT-4</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="text-sm text-gray-600">Claude</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-600">Gemini</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <span className="text-sm text-gray-600">Perplexity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Model Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">ประสิทธิภาพ AI Models</h3>
            <div className="space-y-4">
              {data.modelUsage.map((model, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${model.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">{model.name}</p>
                      <p className="text-sm text-gray-600">{formatNumber(model.requests)} คำขอ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(model.cost)}</p>
                    <p className="text-sm text-gray-600">{model.successRate}% สำเร็จ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">ผู้ใช้งานอันดับต้น</h3>
            <div className="space-y-4">
              {data.userActivity.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatNumber(user.requests)}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(user.cost)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">หมวดหมู่การใช้งาน</h3>
            <div className="space-y-4">
              {data.categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`${category.color} p-2 rounded-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-600">{category.percentage}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatNumber(category.requests)}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(category.cost)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time Distribution & Cost Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Time Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">การกระจายตัวตามเวลา</h3>
            <div className="h-64 flex items-end space-x-1">
              {data.timeDistribution.map((item, index) => {
                const maxRequests = Math.max(...data.timeDistribution.map(d => d.requests));
                const height = (item.requests / maxRequests) * 200;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${height}px` }}
                      title={`${item.hour}:00 - ${item.requests} คำขอ - ${formatCurrency(item.cost)}`}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {item.hour.toString().padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              ช่วงเวลาที่ใช้งานมากที่สุด: 14:00-15:00 น.
            </p>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">การแบ่งค่าใช้จ่าย</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">AI Models</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(data.costBreakdown.models)}</p>
                  <p className="text-sm text-gray-600">75.7%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Storage</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(data.costBreakdown.storage)}</p>
                  <p className="text-sm text-gray-600">8.6%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cpu className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Processing</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(data.costBreakdown.processing)}</p>
                  <p className="text-sm text-gray-600">11.2%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Network className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-gray-900">Bandwidth</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(data.costBreakdown.bandwidth)}</p>
                  <p className="text-sm text-gray-600">4.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Lightbulb className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ข้อเสนอแนะจากการวิเคราะห์</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">ประหยัดค่าใช้จ่าย</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    ใช้ AI Router มากขึ้นเพื่อเลือกโมเดลที่เหมาะสมและประหยัดได้ถึง 23%
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">เพิ่มประสิทธิภาพ</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    ช่วงเวลา 14:00-15:00 น. มีการใช้งานสูงสุด ควรเตรียมทรัพยากรเพิ่มเติม
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">การใช้งานทีม</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    แผนก "วิจัยและพัฒนา" ใช้งานมากที่สุด ควรพิจารณาจัดอบรมเพิ่มเติม
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-800">คุณภาพ</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    อัตราความสำเร็จ 97.8% อยู่ในเกณฑ์ดีมาก แต่ยังสามารถปรับปรุงได้
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;