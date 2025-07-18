import React, { useState, useRef, useEffect } from 'react';
import { Bell, HelpCircle, User, CreditCard, Shield, Key, Settings, LogOut, Menu, History, Plus } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  credits: number;
  onMenuClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, credits, onMenuClick, onProfileClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isLoggedIn) {
    return (
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-indigo-600">ThaiAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              เข้าสู่ระบบ
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              สมัครสมาชิก
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-indigo-600">ThaiAI</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Credits */}
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span className="font-medium">{credits.toLocaleString()} เครดิต</span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">การแจ้งเตือน</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">เครดิตของคุณเหลือน้อย</p>
                        <p className="text-xs text-gray-500 mt-1">2 นาทีที่แล้ว</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">การประชุมเสร็จสิ้นแล้ว</p>
                        <p className="text-xs text-gray-500 mt-1">15 นาทีที่แล้ว</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">รายงาน Compliance พร้อมแล้ว</p>
                        <p className="text-xs text-gray-500 mt-1">1 ชั่วโมงที่แล้ว</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    ดูทั้งหมด
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">สมชาย ใจดี</p>
                      <p className="text-sm text-gray-500">somchai@example.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={onProfileClick}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>โปรไฟล์</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    <CreditCard className="w-4 h-4" />
                    <span>เติมเครดิต</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    <Shield className="w-4 h-4" />
                    <span>ความปลอดภัย</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    <Key className="w-4 h-4" />
                    <span>API Keys</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>ตั้งค่า</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-200 py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;