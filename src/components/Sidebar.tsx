import React from 'react';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Bot,
  Zap,
  Shield,
  BookOpen,
  Video
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: Home },
    { id: 'chat', label: 'Chat AI', icon: MessageSquare },
    { id: 'team-chat', label: 'Team Chat', icon: Users },
    { id: 'documents', label: 'เอกสาร', icon: FileText },
    { id: 'meetings', label: 'ประชุม', icon: Video },
    { id: 'teams', label: 'ทีม', icon: Users },
    { id: 'ai-models', label: 'โมเดล AI', icon: Bot },
    { id: 'analytics', label: 'รายงาน', icon: BarChart3 },
    { id: 'compliance', label: 'ตรวจสอบ', icon: Shield },
    { id: 'templates', label: 'เทมเพลต', icon: BookOpen },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings }
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:static lg:inset-0 lg:w-64
    `}>
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">เมนูหลัก</h2>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-left transition-colors
                    ${activeTab === item.id 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 
                    ${activeTab === item.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Pro Tips</span>
            </div>
            <p className="text-xs mt-1 opacity-90">
              ใช้ AI Router เพื่อเลือกโมเดลที่เหมาะสมและประหยัดเครดิต
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;