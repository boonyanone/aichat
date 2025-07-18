import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Key, 
  Globe, 
  Palette, 
  Download, 
  Upload, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  Brain, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Smartphone, 
  Moon, 
  Sun, 
  Languages, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Plus, 
  Edit3, 
  Copy, 
  RefreshCw, 
  LogOut, 
  UserX, 
  Database, 
  Lock, 
  Unlock, 
  FileText, 
  Image, 
  Camera, 
  Mic, 
  MoreHorizontal
  MicOff, 
  Headphones, 
  Speaker, 
  Wifi, 
  WifiOff, 
  Bluetooth, 
  BluetoothOff
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  organization?: string;
  department?: string;
  position?: string;
  location?: string;
  timezone: string;
  language: string;
  joinDate: Date;
  lastLogin: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface NotificationSettings {
  email: {
    newMessages: boolean;
    documentProcessed: boolean;
    meetingSummary: boolean;
    teamInvitations: boolean;
    billingUpdates: boolean;
    securityAlerts: boolean;
    weeklyReport: boolean;
  };
  push: {
    newMessages: boolean;
    documentProcessed: boolean;
    meetingSummary: boolean;
    teamInvitations: boolean;
    urgentAlerts: boolean;
  };
  inApp: {
    soundEnabled: boolean;
    desktopNotifications: boolean;
    quietHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
  deviceTrust: boolean;
  apiKeys: Array<{
    id: string;
    name: string;
    key: string;
    createdDate: Date;
    lastUsed: Date;
    permissions: string[];
  }>;
  trustedDevices: Array<{
    id: string;
    name: string;
    type: 'desktop' | 'mobile' | 'tablet';
    lastUsed: Date;
    location: string;
  }>;
}

interface AIPreferences {
  defaultModel: string;
  autoRouter: boolean;
  costOptimization: boolean;
  qualityPreference: 'speed' | 'balanced' | 'quality';
  languagePreference: string;
  customPrompts: Array<{
    id: string;
    name: string;
    prompt: string;
    category: string;
  }>;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'ai' | 'billing' | 'privacy' | 'advanced'>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'คุณสมชาย วิทยากร',
    email: 'somchai@company.com',
    phone: '081-234-5678',
    organization: 'บริษัท ABC จำกัด',
    department: 'วิจัยและพัฒนา',
    position: 'หัวหน้าทีม',
    location: 'กรุงเทพมหานคร',
    timezone: 'Asia/Bangkok',
    language: 'th',
    joinDate: new Date('2024-01-01'),
    lastLogin: new Date(),
    emailVerified: true,
    phoneVerified: false
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: {
      newMessages: true,
      documentProcessed: true,
      meetingSummary: true,
      teamInvitations: true,
      billingUpdates: true,
      securityAlerts: true,
      weeklyReport: false
    },
    push: {
      newMessages: true,
      documentProcessed: false,
      meetingSummary: true,
      teamInvitations: true,
      urgentAlerts: true
    },
    inApp: {
      soundEnabled: true,
      desktopNotifications: true,
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      }
    }
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceTrust: true,
    apiKeys: [
      {
        id: '1',
        name: 'Mobile App',
        key: 'sk-...abc123',
        createdDate: new Date('2024-01-15'),
        lastUsed: new Date(),
        permissions: ['read', 'write']
      }
    ],
    trustedDevices: [
      {
        id: '1',
        name: 'MacBook Pro',
        type: 'desktop',
        lastUsed: new Date(),
        location: 'กรุงเทพมหานคร'
      },
      {
        id: '2',
        name: 'iPhone 15',
        type: 'mobile',
        lastUsed: new Date(Date.now() - 86400000),
        location: 'กรุงเทพมหานคร'
      }
    ]
  });

  const [aiPreferences, setAiPreferences] = useState<AIPreferences>({
    defaultModel: 'ai-router',
    autoRouter: true,
    costOptimization: true,
    qualityPreference: 'balanced',
    languagePreference: 'th',
    customPrompts: [
      {
        id: '1',
        name: 'สรุปเอกสารวิจัย',
        prompt: 'กรุณาสรุปเอกสารนี้โดยเน้นที่ผลการวิจัย วิธีการ และข้อสรุป',
        category: 'research'
      }
    ]
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'profile', label: 'โปรไฟล์', icon: User },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
    { id: 'security', label: 'ความปลอดภัย', icon: Shield },
    { id: 'ai', label: 'AI Preferences', icon: Brain },
    { id: 'billing', label: 'การเรียกเก็บเงิน', icon: CreditCard },
    { id: 'privacy', label: 'ความเป็นส่วนตัว', icon: Lock },
    { id: 'advanced', label: 'ขั้นสูง', icon: SettingsIcon }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
    }, 1500);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <SettingsIcon className="h-6 w-6 mr-2 text-blue-600" />
            ตั้งค่า
          </h1>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="h-4 w-4 mr-2" />
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">โปรไฟล์ของฉัน</h2>
                <p className="text-gray-600">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี</p>
              </div>

              {/* Profile Picture */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">รูปโปรไฟล์</h3>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-3">
                      <Camera className="h-4 w-4 mr-2 inline" />
                      เปลี่ยนรูป
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 transition-colors">
                      ลบรูป
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลพื้นฐาน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      />
                      {userProfile.emailVerified ? (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      />
                      {userProfile.phoneVerified ? (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">องค์กร</label>
                    <input
                      type="text"
                      value={userProfile.organization}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, organization: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">แผนก</label>
                    <input
                      type="text"
                      value={userProfile.department}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ตำแหน่ง</label>
                    <input
                      type="text"
                      value={userProfile.position}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">การตั้งค่าภูมิภาค</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เขตเวลา</label>
                    <select
                      value={userProfile.timezone}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Asia/Bangkok">เวลาไทย (GMT+7)</option>
                      <option value="Asia/Singapore">สิงคโปร์ (GMT+8)</option>
                      <option value="Asia/Tokyo">ญี่ปุ่น (GMT+9)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ภาษา</label>
                    <select
                      value={userProfile.language}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="th">ไทย</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลบัญชี</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">วันที่สมัครสมาชิก</p>
                      <p className="text-sm text-gray-600">{userProfile.joinDate.toLocaleDateString('th-TH')}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">เข้าสู่ระบบล่าสุด</p>
                      <p className="text-sm text-gray-600">{userProfile.lastLogin.toLocaleString('th-TH')}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">รหัสผ่าน</p>
                      <p className="text-sm text-gray-600">แก้ไขล่าสุด 30 วันที่แล้ว</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      เปลี่ยนรหัสผ่าน
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">การแจ้งเตือน</h2>
                <p className="text-gray-600">จัดการการแจ้งเตือนและการสื่อสาร</p>
              </div>

              {/* Email Notifications */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  การแจ้งเตือนทางอีเมล
                </h3>
                <div className="space-y-4">
                  {Object.entries(notifications.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {key === 'newMessages' ? 'ข้อความใหม่' :
                           key === 'documentProcessed' ? 'เอกสารประมวลผลเสร็จ' :
                           key === 'meetingSummary' ? 'สรุปการประชุม' :
                           key === 'teamInvitations' ? 'คำเชิญเข้าทีม' :
                           key === 'billingUpdates' ? 'อัปเดตการเรียกเก็บเงิน' :
                           key === 'securityAlerts' ? 'แจ้งเตือนความปลอดภัย' :
                           key === 'weeklyReport' ? 'รายงานสัปดาห์' : key}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({
                          ...prev,
                          email: { ...prev.email, [key]: !value }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-green-600" />
                  การแจ้งเตือนแบบ Push
                </h3>
                <div className="space-y-4">
                  {Object.entries(notifications.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {key === 'newMessages' ? 'ข้อความใหม่' :
                           key === 'documentProcessed' ? 'เอกสารประมวลผลเสร็จ' :
                           key === 'meetingSummary' ? 'สรุปการประชุม' :
                           key === 'teamInvitations' ? 'คำเชิญเข้าทีม' :
                           key === 'urgentAlerts' ? 'แจ้งเตือนด่วน' : key}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({
                          ...prev,
                          push: { ...prev.push, [key]: !value }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-App Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Volume2 className="h-5 w-5 mr-2 text-purple-600" />
                  การตั้งค่าในแอป
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">เสียงแจ้งเตือน</p>
                      <p className="text-sm text-gray-600">เปิดเสียงเมื่อมีการแจ้งเตือน</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({
                        ...prev,
                        inApp: { ...prev.inApp, soundEnabled: !prev.inApp.soundEnabled }
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.inApp.soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.inApp.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">การแจ้งเตือนบนเดสก์ท็อป</p>
                      <p className="text-sm text-gray-600">แสดงการแจ้งเตือนบนหน้าจอ</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({
                        ...prev,
                        inApp: { ...prev.inApp, desktopNotifications: !prev.inApp.desktopNotifications }
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.inApp.desktopNotifications ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.inApp.desktopNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-gray-900">โหมดเงียบ</p>
                        <p className="text-sm text-gray-600">ปิดการแจ้งเตือนในช่วงเวลาที่กำหนด</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({
                          ...prev,
                          inApp: { 
                            ...prev.inApp, 
                            quietHours: { 
                              ...prev.inApp.quietHours, 
                              enabled: !prev.inApp.quietHours.enabled 
                            }
                          }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.inApp.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.inApp.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {notifications.inApp.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">เริ่มเวลา</label>
                          <input
                            type="time"
                            value={notifications.inApp.quietHours.startTime}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              inApp: {
                                ...prev.inApp,
                                quietHours: { ...prev.inApp.quietHours, startTime: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">สิ้นสุดเวลา</label>
                          <input
                            type="time"
                            value={notifications.inApp.quietHours.endTime}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              inApp: {
                                ...prev.inApp,
                                quietHours: { ...prev.inApp.quietHours, endTime: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">ความปลอดภัย</h2>
                <p className="text-gray-600">จัดการการตั้งค่าความปลอดภัยและการเข้าถึง</p>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  การยืนยันตัวตนแบบสองขั้นตอน (2FA)
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">สถานะ: {security.twoFactorEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</p>
                    <p className="text-sm text-gray-600">เพิ่มความปลอดภัยให้กับบัญชีของคุณ</p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      security.twoFactorEnabled
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {security.twoFactorEnabled ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                  </button>
                </div>
              </div>

              {/* Session Management */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  การจัดการเซสชัน
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      หมดเวลาเซสชันอัตโนมัติ (นาที)
                    </label>
                    <select
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={15}>15 นาที</option>
                      <option value={30}>30 นาที</option>
                      <option value={60}>1 ชั่วโมง</option>
                      <option value={240}>4 ชั่วโมง</option>
                      <option value={480}>8 ชั่วโมง</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">แจ้งเตือนการเข้าสู่ระบบ</p>
                      <p className="text-sm text-gray-600">ส่งอีเมลเมื่อมีการเข้าสู่ระบบใหม่</p>
                    </div>
                    <button
                      onClick={() => setSecurity(prev => ({ ...prev, loginAlerts: !prev.loginAlerts }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        security.loginAlerts ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* API Keys */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Key className="h-5 w-5 mr-2 text-purple-600" />
                    API Keys
                  </h3>
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    สร้าง API Key
                  </button>
                </div>
                <div className="space-y-3">
                  {security.apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{apiKey.name}</p>
                        <p className="text-sm text-gray-600">
                          สร้างเมื่อ: {apiKey.createdDate.toLocaleDateString('th-TH')} • 
                          ใช้ล่าสุด: {apiKey.lastUsed.toLocaleDateString('th-TH')}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-xs bg-gray-200 px-2 py-1 rounded">{apiKey.key}</code>
                          <button className="text-blue-600 hover:text-blue-700">
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trusted Devices */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-orange-600" />
                  อุปกรณ์ที่เชื่อถือได้
                </h3>
                <div className="space-y-3">
                  {security.trustedDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getDeviceIcon(device.type)}
                        <div>
                          <p className="font-medium text-gray-900">{device.name}</p>
                          <p className="text-sm text-gray-600">
                            ใช้ล่าสุด: {device.lastUsed.toLocaleDateString('th-TH')} • {device.location}
                          </p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Preferences</h2>
                <p className="text-gray-600">ปรับแต่งการใช้งาน AI ให้เหมาะกับความต้องการ</p>
              </div>

              {/* Default AI Model */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI Model เริ่มต้น
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เลือก AI Model</label>
                    <select
                      value={aiPreferences.defaultModel}
                      onChange={(e) => setAiPreferences(prev => ({ ...prev, defaultModel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ai-router">AI Router (แนะนำ)</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="claude">Claude 3.5 Sonnet</option>
                      <option value="gemini">Gemini Pro</option>
                      <option value="perplexity">Perplexity</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">เปิดใช้ AI Router</p>
                      <p className="text-sm text-gray-600">ให้ระบบเลือก AI ที่เหมาะสมอัตโนมัติ</p>
                    </div>
                    <button
                      onClick={() => setAiPreferences(prev => ({ ...prev, autoRouter: !prev.autoRouter }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        aiPreferences.autoRouter ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        aiPreferences.autoRouter ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">ปรับให้ประหยัดต้นทุน</p>
                      <p className="text-sm text-gray-600">เลือก AI ที่ให้ผลลัพธ์ดีและประหยัดที่สุด</p>
                    </div>
                    <button
                      onClick={() => setAiPreferences(prev => ({ ...prev, costOptimization: !prev.costOptimization }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        aiPreferences.costOptimization ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        aiPreferences.costOptimization ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quality Preferences */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                  ความต้องการด้านคุณภาพ
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ลำดับความสำคัญ</label>
                    <select
                      value={aiPreferences.qualityPreference}
                      onChange={(e) => setAiPreferences(prev => ({ ...prev, qualityPreference: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="speed">ความเร็ว - ตอบเร็วที่สุด</option>
                      <option value="balanced">สมดุล - ความเร็วและคุณภาพ</option>
                      <option value="quality">คุณภาพ - ผลลัพธ์ดีที่สุด</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ภาษาที่ต้องการ</label>
                    <select
                      value={aiPreferences.languagePreference}
                      onChange={(e) => setAiPreferences(prev => ({ ...prev, languagePreference: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="th">ไทย</option>
                      <option value="en">English</option>
                      <option value="auto">ตรวจจับอัตโนมัติ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Custom Prompts */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    Prompt ที่กำหนดเอง
                  </h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2 inline" />
                    เพิ่ม Prompt
                  </button>
                </div>
                <div className="space-y-3">
                  {aiPreferences.customPrompts.map((prompt) => (
                    <div key={prompt.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{prompt.name}</h4>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{prompt.prompt}</p>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {prompt.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">การเรียกเก็บเงิน</h2>
                <p className="text-gray-600">จัดการการชำระเงินและการใช้งาน</p>
              </div>

              {/* Current Plan */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  แพ็คเกจปัจจุบัน
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">แพ็คเกจโปร</p>
                    <p className="text-gray-600">฿199/เดือน + จ่ายตามใช้</p>
                    <p className="text-sm text-gray-500 mt-1">ต่ออายุอัตโนมัติในวันที่ 15 ก.พ. 2025</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    เปลี่ยนแพ็คเกจ
                  </button>
                </div>
              </div>

              {/* Usage Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">สรุปการใช้งานเดือนนี้</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">2,847</p>
                    <p className="text-gray-600">คำขอ AI</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">156</p>
                    <p className="text-gray-600">เอกสารที่วิเคราะห์</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">23</p>
                    <p className="text-gray-600">การประชุม</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">วิธีการชำระเงิน</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2 inline" />
                    เพิ่มการชำระเงิน
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">•••• •••• •••• 1234</p>
                        <p className="text-sm text-gray-600">หมดอายุ 12/26</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">หลัก</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">ประวัติการเรียกเก็บเงิน</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    ดูทั้งหมด
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { date: '15 ม.ค. 2025', amount: '฿245.50', status: 'ชำระแล้ว', description: 'แพ็คเกจโปร + การใช้งาน' },
                    { date: '15 ธ.ค. 2024', amount: '฿199.00', status: 'ชำระแล้ว', description: 'แพ็คเกจโปร' },
                    { date: '15 พ.ย. 2024', amount: '฿289.75', status: 'ชำระแล้ว', description: 'แพ็คเกจโปร + การใช้งาน' }
                  ].map((bill, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{bill.description}</p>
                        <p className="text-sm text-gray-600">{bill.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{bill.amount}</p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {bill.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">ความเป็นส่วนตัว</h2>
                <p className="text-gray-600">จัดการข้อมูลส่วนตัวและความเป็นส่วนตัว</p>
              </div>

              {/* Data Privacy */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-green-600" />
                  การจัดการข้อมูล
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">การเก็บประวัติการสนทนา</p>
                      <p className="text-sm text-gray-600">เก็บประวัติเพื่อปรับปรุงประสบการณ์</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">การวิเคราะห์การใช้งาน</p>
                      <p className="text-sm text-gray-600">ช่วยปรับปรุงบริการให้ดีขึ้น</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">การแชร์ข้อมูลกับ AI Providers</p>
                      <p className="text-sm text-gray-600">จำเป็นสำหรับการทำงานของ AI</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Export */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-blue-600" />
                  ส่งออกข้อมูล
                </h3>
                <p className="text-gray-600 mb-4">ดาวน์โหลดข้อมูลทั้งหมดของคุณ</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  ขอส่งออกข้อมูล
                </button>
              </div>

              {/* Data Deletion */}
              <div className="bg-white rounded-xl border border-red-200 p-6">
                <h3 className="text-lg font-medium text-red-900 mb-4 flex items-center">
                  <Trash2 className="h-5 w-5 mr-2 text-red-600" />
                  ลบข้อมูล
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">ลบประวัติการสนทนา</p>
                      <p className="text-sm text-gray-600">ลบประวัติการสนทนาทั้งหมด</p>
                    </div>
                    <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                      ลบประวัติ
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">ลบเอกสารทั้งหมด</p>
                      <p className="text-sm text-gray-600">ลบเอกสารที่อัปโหลดทั้งหมด</p>
                    </div>
                    <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                      ลบเอกสาร
                    </button>
                  </div>

                  <div className="border-t border-red-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">ลบบัญชี</p>
                        <p className="text-sm text-red-700">ลบบัญชีและข้อมูลทั้งหมดอย่างถาวร</p>
                      </div>
                      <button
                        onClick={() => setShowDeleteAccountModal(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ลบบัญชี
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">การตั้งค่าขั้นสูง</h2>
                <p className="text-gray-600">การตั้งค่าสำหรับผู้ใช้ขั้นสูง</p>
              </div>

              {/* Developer Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-purple-600" />
                  การตั้งค่านักพัฒนา
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">โหมดดีบัก</p>
                      <p className="text-sm text-gray-600">แสดงข้อมูลเพิ่มเติมสำหรับการแก้ไขปัญหา</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">API Rate Limiting</p>
                      <p className="text-sm text-gray-600">จำกัดจำนวนคำขอต่อนาที</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="60">60 คำขอ/นาที</option>
                      <option value="120">120 คำขอ/นาที</option>
                      <option value="300">300 คำขอ/นาที</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Experimental Features */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                  ฟีเจอร์ทดลอง
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">AI Voice Assistant</p>
                      <p className="text-sm text-gray-600">ผู้ช่วย AI ด้วยเสียง (Beta)</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Advanced RAG</p>
                      <p className="text-sm text-gray-600">การค้นหาข้อมูลขั้นสูง (Alpha)</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Custom AI Models</p>
                      <p className="text-sm text-gray-600">ใช้ AI Model ที่กำหนดเอง</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  ข้อมูลระบบ
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">เวอร์ชัน:</span>
                    <span className="font-medium text-gray-900">v1.2.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">สร้างเมื่อ:</span>
                    <span className="font-medium text-gray-900">15 ม.ค. 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">เซิร์ฟเวอร์:</span>
                    <span className="font-medium text-gray-900">ap-southeast-1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="font-medium text-gray-900 font-mono">usr_abc123def456</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">เปลี่ยนรหัสผ่าน</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  เปลี่ยนรหัสผ่าน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-900">ลบบัญชี</h3>
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">คำเตือน</span>
                </div>
                <p className="text-sm text-red-700">
                  การลบบัญชีจะไม่สามารถย้อนกลับได้ ข้อมูลทั้งหมดจะถูกลบอย่างถาวร
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  พิมพ์ "DELETE" เพื่อยืนยัน
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  ลบบัญชี
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;