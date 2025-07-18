import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  FileText,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Zap,
  Calendar,
  Download,
  Upload,
  Play,
  Pause,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  Lightbulb,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState<'requests' | 'costs' | 'users'>('requests');

  const stats = [
    { 
      title: 'การใช้งานวันนี้', 
      value: '247', 
      unit: 'คำขอ',
      change: '+12%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-blue-500',
      trend: [20, 45, 28, 80, 99, 43, 247]
    },
    { 
      title: 'สมาชิกทีม', 
      value: '12', 
      unit: 'คน',
      change: '+2',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500',
      trend: [8, 9, 10, 10, 11, 12, 12]
    },
    { 
      title: 'เอกสารที่วิเคราะห์', 
      value: '89', 
      unit: 'ไฟล์',
      change: '+24%',
      changeType: 'increase',
      icon: FileText,
      color: 'bg-purple-500',
      trend: [45, 52, 61, 70, 75, 82, 89]
    },
    { 
      title: 'เครดิตคงเหลือ', 
      value: '15,420', 
      unit: 'เครดิต',
      change: '-5%',
      changeType: 'decrease',
      icon: Brain,
      color: 'bg-orange-500',
      trend: [18000, 17500, 16800, 16200, 15800, 15600, 15420]
    }
  ];

  const aiModels = [
    { name: 'GPT-4', usage: 45, cost: 2.1, color: 'bg-green-500' },
    { name: 'Claude 3.5', usage: 32, cost: 1.8, color: 'bg-blue-500' },
    { name: 'Gemini Pro', usage: 18, cost: 0.9, color: 'bg-purple-500' },
    { name: 'Perplexity', usage: 5, cost: 0.3, color: 'bg-orange-500' }
  ];

  const recentActivities = [
    { 
      type: 'document', 
      title: 'วิเคราะห์เอกสารงานวิจัย "AI in Education"', 
      time: '5 นาทีที่แล้ว',
      status: 'completed',
      model: 'Claude 3.5 Sonnet',
      cost: 0.45,
      user: 'คุณสมชาย'
    },
    { 
      type: 'meeting', 
      title: 'สรุปการประชุมคณะกรรมการ Q4 2024', 
      time: '15 นาทีที่แล้ว',
      status: 'processing',
      model: 'GPT-4',
      cost: 0.82,
      user: 'คุณปัทมา'
    },
    { 
      type: 'chat', 
      title: 'สนทนาเรื่องกลยุทธ์การตลาดดิจิทัล', 
      time: '1 ชั่วโมงที่แล้ว',
      status: 'completed',
      model: 'Gemini Pro',
      cost: 0.23,
      user: 'คุณอนุชา'
    },
    { 
      type: 'research', 
      title: 'ค้นหาข้อมูลเกี่ยวกับ Blockchain Technology', 
      time: '2 ชั่วโมงที่แล้ว',
      status: 'completed',
      model: 'Perplexity',
      cost: 0.15,
      user: 'คุณวิชัย'
    },
    { 
      type: 'compliance', 
      title: 'ตรวจสอบรายงานวิจัยตามมาตรฐาน IEEE', 
      time: '3 ชั่วโมงที่แล้ว',
      status: 'completed',
      model: 'Claude 3.5',
      cost: 0.67,
      user: 'คุณสุดา'
    }
  ];

  const deviceStats = [
    { device: 'Desktop', percentage: 45, icon: Monitor, color: 'bg-blue-500' },
    { device: 'Mobile', percentage: 35, icon: Smartphone, color: 'bg-green-500' },
    { device: 'Tablet', percentage: 20, icon: Tablet, color: 'bg-purple-500' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'research':
        return <Globe className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">แดชบอร์ด</h1>
          <p className="text-gray-600">ภาพรวมการใช้งาน AI ของคุณ</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">วันนี้</option>
            <option value="7d">7 วันที่แล้ว</option>
            <option value="30d">30 วันที่แล้ว</option>
            <option value="90d">3 เดือนที่แล้ว</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            ส่งออกรายงาน
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? 
                    <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  }
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
                <span className="text-sm font-normal text-gray-500 ml-1">{stat.unit}</span>
              </h3>
              <p className="text-sm text-gray-600 mb-3">{stat.title}</p>
              
              {/* Mini Chart */}
              <div className="flex items-end space-x-1 h-8">
                {stat.trend.map((value, i) => (
                  <div 
                    key={i} 
                    className={`${stat.color} opacity-60 rounded-sm flex-1`}
                    style={{ height: `${(value / Math.max(...stat.trend)) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Models Usage */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">การใช้งาน AI Models</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {aiModels.map((model, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${model.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">{model.name}</p>
                      <p className="text-sm text-gray-500">{model.usage}% การใช้งาน</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">฿{model.cost}</p>
                    <p className="text-sm text-gray-500">วันนี้</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Usage Chart */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">ประสิทธิภาพการใช้งาน</h3>
                <span className="text-sm text-gray-600">เฉลี่ย 7 วัน</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">ประหยัดได้ 23% จากการเลือก AI ที่เหมาะสม</span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">การใช้งานตามอุปกรณ์</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {deviceStats.map((device, index) => {
                const Icon = device.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${device.color} p-2 rounded-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{device.device}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${device.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-8">{device.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Credit Status */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">เครดิตคงเหลือ</span>
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">15,420</span>
                <span className="text-sm text-gray-600">เครดิต</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '77%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-2">คาดว่าจะใช้ได้อีก 12 วัน</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">กิจกรรมล่าสุด</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              ดูทั้งหมด
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getActivityIcon(activity.type)}
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>ใช้ {activity.model}</span>
                      <span>•</span>
                      <span>โดย {activity.user}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">฿{activity.cost}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : activity.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.status === 'completed' ? 'เสร็จสิ้น' : 
                       activity.status === 'processing' ? 'กำลังดำเนินการ' : 'ล้มเหลว'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
          <MessageSquare className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">เริ่มแชทใหม่</h3>
          <p className="text-blue-100 text-sm mb-4">สนทนากับ AI เพื่อขอคำแนะนำ</p>
          <div className="flex items-center text-sm">
            <Play className="h-4 w-4 mr-2" />
            เริ่มเลย
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
          <Upload className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">อัปโหลดเอกสาร</h3>
          <p className="text-purple-100 text-sm mb-4">วิเคราะห์และสรุปเอกสาร</p>
          <div className="flex items-center text-sm">
            <FileText className="h-4 w-4 mr-2" />
            เลือกไฟล์
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
          <Users className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">เชิญทีม</h3>
          <p className="text-green-100 text-sm mb-4">เพิ่มสมาชิกเข้าร่วมทีม</p>
          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-2" />
            เชิญสมาชิก
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
          <Lightbulb className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">AI Suggestions</h3>
          <p className="text-orange-100 text-sm mb-4">ดูคำแนะนำการใช้งาน</p>
          <div className="flex items-center text-sm">
            <Zap className="h-4 w-4 mr-2" />
            ดูเทคนิค
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-start space-x-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Lightbulb className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">เทคนิคประหยัดเครดิต</h3>
            <p className="text-gray-700 mb-3">
              ใช้ AI Router เพื่อให้ระบบเลือก AI ที่เหมาะสมกับงานแต่ละประเภท ช่วยประหยัดเครดิตได้มากถึง 40%
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border">💡 ใช้ Gemini สำหรับงานเขียน</span>
              <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border">🔍 ใช้ Perplexity สำหรับค้นหา</span>
              <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border">📊 ใช้ Claude สำหรับวิเคราะห์</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;