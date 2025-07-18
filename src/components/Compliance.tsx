import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Clock,
  FileText, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  Settings,
  MoreHorizontal,
  RefreshCw,
  Star,
  Flag,
  Award,
  Target,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Globe,
  Brain,
  Zap,
  Database,
  Network,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  UserCheck,
  FileCheck,
  ClipboardCheck,
  BookOpen,
  Scale,
  Gavel,
  Certificate,
  Verified,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Copy,
  Share2,
  Bookmark,
  Edit3,
  Trash2,
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Link,
  Tag,
  Hash,
  Percent,
  DollarSign,
  Timer,
  Cpu,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface ComplianceCheck {
  id: string;
  title: string;
  description: string;
  category: 'data-privacy' | 'security' | 'accuracy' | 'ethics' | 'legal' | 'quality';
  status: 'passed' | 'failed' | 'warning' | 'pending' | 'not-applicable';
  severity: 'critical' | 'high' | 'medium' | 'low';
  lastChecked: Date;
  nextCheck: Date;
  autoCheck: boolean;
  details: string;
  recommendations: string[];
  relatedDocuments: string[];
  assignedTo?: string;
  progress: number;
}

interface ComplianceReport {
  id: string;
  title: string;
  type: 'audit' | 'assessment' | 'review' | 'certification';
  status: 'draft' | 'in-progress' | 'completed' | 'approved' | 'rejected';
  createdDate: Date;
  completedDate?: Date;
  createdBy: string;
  approvedBy?: string;
  summary: string;
  findings: Array<{
    category: string;
    issue: string;
    severity: string;
    recommendation: string;
    status: string;
  }>;
  score: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
}

interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  isActive: boolean;
  requirements: Array<{
    id: string;
    title: string;
    description: string;
    status: 'compliant' | 'non-compliant' | 'partial' | 'not-assessed';
    evidence: string[];
    lastAssessed: Date;
  }>;
  certificationDate?: Date;
  expiryDate?: Date;
  certifyingBody?: string;
}

const Compliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'checks' | 'reports' | 'standards' | 'settings'>('overview');
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [standards, setStandards] = useState<ComplianceStandard[]>([]);
  const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockChecks: ComplianceCheck[] = [
    {
      id: '1',
      title: 'การเข้ารหัสข้อมูลส่วนบุคคล',
      description: 'ตรวจสอบการเข้ารหัสข้อมูลส่วนบุคคลของผู้ใช้ตาม PDPA',
      category: 'data-privacy',
      status: 'passed',
      severity: 'critical',
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      autoCheck: true,
      details: 'ข้อมูลส่วนบุคคลทั้งหมดได้รับการเข้ารหัสด้วย AES-256 และจัดเก็บอย่างปลอดภัย',
      recommendations: [
        'ตรวจสอบการเข้ารหัสอย่างสม่ำเสมอ',
        'อัปเดตกุญแจเข้ารหัสทุก 6 เดือน',
        'ทำการ Backup กุญแจเข้ารหัสในที่ปลอดภัย'
      ],
      relatedDocuments: ['PDPA Policy', 'Data Encryption Standard'],
      assignedTo: 'ทีมความปลอดภัย',
      progress: 100
    },
    {
      id: '2',
      title: 'การตรวจสอบความแม่นยำของ AI',
      description: 'ประเมินความแม่นยำและความเป็นธรรมของผลลัพธ์จาก AI Models',
      category: 'accuracy',
      status: 'warning',
      severity: 'high',
      lastChecked: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nextCheck: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      autoCheck: true,
      details: 'พบความแม่นยำของ GPT-4 ลดลง 2% ในการตอบคำถามภาษาไทย',
      recommendations: [
        'ปรับปรุง Prompt Engineering',
        'เพิ่มข้อมูลฝึกภาษาไทย',
        'ทดสอบกับข้อมูลตัวอย่างเพิ่มเติม'
      ],
      relatedDocuments: ['AI Quality Standards', 'Model Performance Report'],
      assignedTo: 'ทีม AI',
      progress: 65
    },
    {
      id: '3',
      title: 'การจัดการสิทธิ์การเข้าถึง',
      description: 'ตรวจสอบการกำหนดสิทธิ์การเข้าถึงข้อมูลและระบบ',
      category: 'security',
      status: 'failed',
      severity: 'critical',
      lastChecked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextCheck: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      autoCheck: false,
      details: 'พบผู้ใช้ 3 คนที่มีสิทธิ์เข้าถึงข้อมูลเกินความจำเป็น',
      recommendations: [
        'ทบทวนสิทธิ์การเข้าถึงทุกเดือน',
        'ใช้หลักการ Least Privilege',
        'ติดตั้งระบบ Access Control ที่เข้มงวดขึ้น'
      ],
      relatedDocuments: ['Access Control Policy', 'User Management Guide'],
      assignedTo: 'ทีมความปลอดภัย',
      progress: 30
    },
    {
      id: '4',
      title: 'การปฏิบัติตาม AI Ethics',
      description: 'ตรวจสอบการใช้งาน AI ให้เป็นไปตามหลักจริยธรรม',
      category: 'ethics',
      status: 'passed',
      severity: 'medium',
      lastChecked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextCheck: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      autoCheck: true,
      details: 'การใช้งาน AI เป็นไปตามหลักจริยธรรมและไม่มีการใช้งานที่ไม่เหมาะสม',
      recommendations: [
        'จัดอบรมจริยธรรม AI ให้ผู้ใช้',
        'สร้างแนวทางการใช้งาน AI ที่ชัดเจน',
        'ติดตามการใช้งานอย่างสม่ำเสมอ'
      ],
      relatedDocuments: ['AI Ethics Guidelines', 'Responsible AI Policy'],
      assignedTo: 'ทีมนโยบาย',
      progress: 100
    },
    {
      id: '5',
      title: 'การสำรองข้อมูล',
      description: 'ตรวจสอบระบบการสำรองข้อมูลและการกู้คืน',
      category: 'security',
      status: 'pending',
      severity: 'high',
      lastChecked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextCheck: new Date(),
      autoCheck: true,
      details: 'กำลังดำเนินการทดสอบระบบการสำรองข้อมูลและการกู้คืน',
      recommendations: [
        'ทดสอบการกู้คืนข้อมูลทุกเดือน',
        'เก็บสำรองข้อมูลในหลายสถานที่',
        'จัดทำแผนการกู้คืนในภาวะฉุกเฉิน'
      ],
      relatedDocuments: ['Backup Policy', 'Disaster Recovery Plan'],
      assignedTo: 'ทีม IT',
      progress: 45
    }
  ];

  const mockReports: ComplianceReport[] = [
    {
      id: '1',
      title: 'รายงานการตรวจสอบ PDPA ประจำไตรมาส Q1 2024',
      type: 'audit',
      status: 'completed',
      createdDate: new Date('2024-01-15'),
      completedDate: new Date('2024-01-30'),
      createdBy: 'คุณสมชาย วิทยากร',
      approvedBy: 'คุณปัทมา ธุรกิจ',
      summary: 'การตรวจสอบการปฏิบัติตาม PDPA พบว่าองค์กรมีการปฏิบัติตามกฎหมายในระดับดี',
      findings: [
        {
          category: 'Data Privacy',
          issue: 'การเข้ารหัสข้อมูล',
          severity: 'Low',
          recommendation: 'ปรับปรุงการเข้ารหัสให้แข็งแกร่งขึ้น',
          status: 'Resolved'
        },
        {
          category: 'Access Control',
          issue: 'การจัดการสิทธิ์',
          severity: 'Medium',
          recommendation: 'ทบทวนสิทธิ์การเข้าถึงอย่างสม่ำเสมอ',
          status: 'In Progress'
        }
      ],
      score: 85,
      totalChecks: 20,
      passedChecks: 17,
      failedChecks: 1,
      warningChecks: 2
    },
    {
      id: '2',
      title: 'การประเมินความปลอดภัย AI Systems',
      type: 'assessment',
      status: 'in-progress',
      createdDate: new Date('2024-02-01'),
      createdBy: 'คุณอนุชา นักศึกษา',
      summary: 'การประเมินความปลอดภัยของระบบ AI และการป้องกันการใช้งานที่ไม่เหมาะสม',
      findings: [
        {
          category: 'AI Security',
          issue: 'Model Vulnerability',
          severity: 'High',
          recommendation: 'เพิ่มการตรวจสอบ Input Validation',
          status: 'Open'
        }
      ],
      score: 0,
      totalChecks: 15,
      passedChecks: 8,
      failedChecks: 2,
      warningChecks: 5
    }
  ];

  const mockStandards: ComplianceStandard[] = [
    {
      id: '1',
      name: 'PDPA (Personal Data Protection Act)',
      description: 'พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562',
      version: '2019',
      category: 'Data Privacy',
      isActive: true,
      requirements: [
        {
          id: '1',
          title: 'การขอความยินยอม',
          description: 'ต้องได้รับความยินยอมจากเจ้าของข้อมูลก่อนการเก็บรวบรวม',
          status: 'compliant',
          evidence: ['Consent Form', 'Privacy Policy'],
          lastAssessed: new Date('2024-01-15')
        },
        {
          id: '2',
          title: 'การเข้ารหัสข้อมูล',
          description: 'ข้อมูลส่วนบุคคลต้องได้รับการเข้ารหัสอย่างเหมาะสม',
          status: 'compliant',
          evidence: ['Encryption Certificate', 'Security Audit'],
          lastAssessed: new Date('2024-01-20')
        }
      ],
      certificationDate: new Date('2024-01-01'),
      expiryDate: new Date('2025-01-01'),
      certifyingBody: 'สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล'
    },
    {
      id: '2',
      name: 'ISO 27001',
      description: 'มาตรฐานการจัดการความมั่นคงปลอดภัยสารสนเทศ',
      version: '2013',
      category: 'Information Security',
      isActive: true,
      requirements: [
        {
          id: '1',
          title: 'นโยบายความปลอดภัย',
          description: 'จัดทำและดำเนินการตามนโยบายความปลอดภัยสารสนเทศ',
          status: 'compliant',
          evidence: ['Security Policy Document'],
          lastAssessed: new Date('2024-01-10')
        }
      ],
      certificationDate: new Date('2023-06-01'),
      expiryDate: new Date('2026-06-01'),
      certifyingBody: 'ISO Certification Body'
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setChecks(mockChecks);
      setReports(mockReports);
      setStandards(mockStandards);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'compliant':
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'non-compliant':
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
      case 'in-progress':
      case 'draft':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'not-applicable':
      case 'not-assessed':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'passed': return 'ผ่าน';
      case 'failed': return 'ไม่ผ่าน';
      case 'warning': return 'เตือน';
      case 'pending': return 'รอดำเนินการ';
      case 'not-applicable': return 'ไม่เกี่ยวข้อง';
      case 'compliant': return 'ปฏิบัติตาม';
      case 'non-compliant': return 'ไม่ปฏิบัติตาม';
      case 'partial': return 'ปฏิบัติตามบางส่วน';
      case 'not-assessed': return 'ยังไม่ประเมิน';
      case 'completed': return 'เสร็จสิ้น';
      case 'in-progress': return 'กำลังดำเนินการ';
      case 'draft': return 'ร่าง';
      case 'approved': return 'อนุมัติแล้ว';
      case 'rejected': return 'ปฏิเสธ';
      default: return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data-privacy':
        return <Lock className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'accuracy':
        return <Target className="h-4 w-4" />;
      case 'ethics':
        return <Scale className="h-4 w-4" />;
      case 'legal':
        return <Gavel className="h-4 w-4" />;
      case 'quality':
        return <Award className="h-4 w-4" />;
      default:
        return <FileCheck className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'data-privacy': return 'ความเป็นส่วนตัว';
      case 'security': return 'ความปลอดภัย';
      case 'accuracy': return 'ความแม่นยำ';
      case 'ethics': return 'จริยธรรม';
      case 'legal': return 'กฎหมาย';
      case 'quality': return 'คุณภาพ';
      default: return category;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'วิกฤต';
      case 'high': return 'สูง';
      case 'medium': return 'ปานกลาง';
      case 'low': return 'ต่ำ';
      default: return severity;
    }
  };

  const filteredChecks = checks.filter(check => {
    const matchesSearch = check.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         check.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || check.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || check.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getOverviewStats = () => {
    const totalChecks = checks.length;
    const passedChecks = checks.filter(c => c.status === 'passed').length;
    const failedChecks = checks.filter(c => c.status === 'failed').length;
    const warningChecks = checks.filter(c => c.status === 'warning').length;
    const pendingChecks = checks.filter(c => c.status === 'pending').length;
    
    const complianceScore = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
    
    return {
      totalChecks,
      passedChecks,
      failedChecks,
      warningChecks,
      pendingChecks,
      complianceScore
    };
  };

  const stats = getOverviewStats();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลดข้อมูลการตรวจสอบ...</p>
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
              <Shield className="h-7 w-7 mr-3 text-blue-600" />
              ตรวจสอบและปฏิบัติตาม
            </h1>
            <p className="text-gray-600 text-sm mt-1">ตรวจสอบการปฏิบัติตามมาตรฐานและกฎระเบียบ</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              ส่งออกรายงาน
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'ภาพรวม', icon: BarChart3 },
            { id: 'checks', label: 'การตรวจสอบ', icon: ClipboardCheck },
            { id: 'reports', label: 'รายงาน', icon: FileText },
            { id: 'standards', label: 'มาตรฐาน', icon: Certificate },
            { id: 'settings', label: 'ตั้งค่า', icon: Settings }
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
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ClipboardCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">การตรวจสอบทั้งหมด</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalChecks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">ผ่าน</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.passedChecks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">ไม่ผ่าน</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.failedChecks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">เตือน</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.warningChecks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">คะแนนรวม</h3>
                    <p className="text-2xl font-bold text-purple-600">{stats.complianceScore}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Score Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">คะแนนการปฏิบัติตาม</h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${stats.complianceScore * 2.51} 251`}
                        className="text-blue-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{stats.complianceScore}%</div>
                        <div className="text-sm text-gray-600">คะแนนรวม</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">การแจ้งเตือนที่ต้องดำเนินการ</h3>
                <div className="space-y-4">
                  {checks.filter(c => c.status === 'failed' || c.status === 'warning').slice(0, 4).map((check) => (
                    <div key={check.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(check.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{check.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{check.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(check.severity)}`}>
                            {getSeverityLabel(check.severity)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ครบกำหนด: {check.nextCheck.toLocaleDateString('th-TH')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">รายงานล่าสุด</h3>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ดูทั้งหมด
                </button>
              </div>
              <div className="space-y-4">
                {reports.slice(0, 3).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(report.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.title}</p>
                        <p className="text-sm text-gray-600">
                          สร้างโดย {report.createdBy} • {report.createdDate.toLocaleDateString('th-TH')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{report.score}%</p>
                      <p className="text-sm text-gray-600">{getStatusLabel(report.status)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checks' && (
          <div>
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาการตรวจสอบ..."
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
                <option value="data-privacy">ความเป็นส่วนตัว</option>
                <option value="security">ความปลอดภัย</option>
                <option value="accuracy">ความแม่นยำ</option>
                <option value="ethics">จริยธรรม</option>
                <option value="legal">กฎหมาย</option>
                <option value="quality">คุณภาพ</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="passed">ผ่าน</option>
                <option value="failed">ไม่ผ่าน</option>
                <option value="warning">เตือน</option>
                <option value="pending">รอดำเนินการ</option>
              </select>
            </div>

            {/* Checks List */}
            <div className="space-y-4">
              {filteredChecks.map((check) => (
                <div
                  key={check.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedCheck(check);
                    setShowCheckModal(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(check.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{check.title}</h3>
                          <div className="flex items-center space-x-1">
                            {getCategoryIcon(check.category)}
                            <span className="text-sm text-gray-600">{getCategoryLabel(check.category)}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(check.severity)}`}>
                            {getSeverityLabel(check.severity)}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{check.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">ตรวจสอบล่าสุด:</span>
                            <br />
                            {check.lastChecked.toLocaleDateString('th-TH')}
                          </div>
                          <div>
                            <span className="font-medium">ตรวจสอบครั้งถัดไป:</span>
                            <br />
                            {check.nextCheck.toLocaleDateString('th-TH')}
                          </div>
                          <div>
                            <span className="font-medium">ผู้รับผิดชอบ:</span>
                            <br />
                            {check.assignedTo || 'ไม่ระบุ'}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">ความคืบหน้า</span>
                            <span className="font-medium text-gray-900">{check.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${check.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {check.autoCheck && (
                        <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <RefreshCw className="h-3 w-3" />
                          <span>อัตโนมัติ</span>
                        </div>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">รายงานการตรวจสอบ</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                สร้างรายงานใหม่
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedReport(report);
                    setShowReportModal(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        {getStatusIcon(report.status)}
                        <span className="text-sm text-gray-600">{getStatusLabel(report.status)}</span>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{report.summary}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <ClipboardCheck className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">การตรวจสอบ</span>
                          </div>
                          <p className="text-lg font-bold text-blue-600">{report.totalChecks}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">ผ่าน</span>
                          </div>
                          <p className="text-lg font-bold text-green-600">{report.passedChecks}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-900">ไม่ผ่าน</span>
                          </div>
                          <p className="text-lg font-bold text-red-600">{report.failedChecks}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">คะแนน</span>
                          </div>
                          <p className="text-lg font-bold text-purple-600">{report.score}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>สร้างโดย: {report.createdBy}</span>
                        <span>วันที่สร้าง: {report.createdDate.toLocaleDateString('th-TH')}</span>
                        {report.completedDate && (
                          <span>เสร็จสิ้น: {report.completedDate.toLocaleDateString('th-TH')}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'standards' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">มาตรฐานและกฎระเบียบ</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มมาตรฐาน
              </button>
            </div>

            <div className="space-y-6">
              {standards.map((standard) => (
                <div key={standard.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Certificate className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{standard.name}</h3>
                        <p className="text-sm text-gray-600">{standard.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>เวอร์ชัน: {standard.version}</span>
                          <span>หมวดหมู่: {standard.category}</span>
                          {standard.certificationDate && (
                            <span>รับรอง: {standard.certificationDate.toLocaleDateString('th-TH')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        standard.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {standard.isActive ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">ข้อกำหนด</h4>
                    {standard.requirements.map((req) => (
                      <div key={req.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(req.status)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{req.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>ประเมินล่าสุด: {req.lastAssessed.toLocaleDateString('th-TH')}</span>
                            <span>หลักฐาน: {req.evidence.length} รายการ</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{getStatusLabel(req.status)}</span>
                      </div>
                    ))}
                  </div>

                  {standard.expiryDate && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          หมดอายุ: {standard.expiryDate.toLocaleDateString('th-TH')}
                        </span>
                        {standard.certifyingBody && (
                          <span className="text-sm text-yellow-700">
                            โดย {standard.certifyingBody}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">ตั้งค่าการตรวจสอบ</h2>
            
            <div className="space-y-6">
              {/* Auto Check Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">การตรวจสอบอัตโนมัติ</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">เปิดใช้การตรวจสอบอัตโนมัติ</p>
                      <p className="text-sm text-gray-600">ระบบจะตรวจสอบตามกำหนดเวลาโดยอัตโนมัติ</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">แจ้งเตือนเมื่อพบปัญหา</p>
                      <p className="text-sm text-gray-600">ส่งการแจ้งเตือนทันทีเมื่อพบการไม่ปฏิบัติตาม</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ความถี่การตรวจสอบ</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="daily">ทุกวัน</option>
                      <option value="weekly">ทุกสัปดาห์</option>
                      <option value="monthly">ทุกเดือน</option>
                      <option value="quarterly">ทุกไตรมาส</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">การแจ้งเตือน</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">การตรวจสอบเสร็จสิ้น</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">พบการไม่ปฏิบัติตาม</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">รายงานพร้อมใช้งาน</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">มาตรฐานใกล้หมดอายุ</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Integration Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">การเชื่อมต่อ</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ระบบ SIEM</label>
                    <input
                      type="text"
                      placeholder="URL ของระบบ SIEM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                    <input
                      type="text"
                      placeholder="URL สำหรับรับการแจ้งเตือน"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Check Detail Modal */}
      {showCheckModal && selectedCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getStatusIcon(selectedCheck.status)}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedCheck.title}</h3>
                  <p className="text-sm text-gray-600">{getCategoryLabel(selectedCheck.category)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCheckModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">รายละเอียด</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedCheck.details}</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">คำแนะนำ</h4>
                  <ul className="space-y-2">
                    {selectedCheck.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">เอกสารที่เกี่ยวข้อง</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCheck.relatedDocuments.map((doc, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">ข้อมูลการตรวจสอบ</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ตรวจสอบล่าสุด:</span>
                        <span className="text-gray-900">{selectedCheck.lastChecked.toLocaleDateString('th-TH')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ตรวจสอบครั้งถัดไป:</span>
                        <span className="text-gray-900">{selectedCheck.nextCheck.toLocaleDateString('th-TH')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">การตรวจสอบอัตโนมัติ:</span>
                        <span className="text-gray-900">{selectedCheck.autoCheck ? 'เปิด' : 'ปิด'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">การจัดการ</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ผู้รับผิดชอบ:</span>
                        <span className="text-gray-900">{selectedCheck.assignedTo || 'ไม่ระบุ'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ระดับความสำคัญ:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(selectedCheck.severity)}`}>
                          {getSeverityLabel(selectedCheck.severity)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ความคืบหน้า:</span>
                        <span className="text-gray-900">{selectedCheck.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    ตรวจสอบใหม่
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit3 className="h-4 w-4 mr-2" />
                    แก้ไข
                  </button>
                </div>
                <button
                  onClick={() => setShowCheckModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getStatusIcon(selectedReport.status)}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedReport.title}</h3>
                  <p className="text-sm text-gray-600">{selectedReport.type} • {getStatusLabel(selectedReport.status)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">สรุปผลการตรวจสอบ</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedReport.summary}</p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedReport.totalChecks}</p>
                    <p className="text-sm text-blue-800">การตรวจสอบทั้งหมด</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedReport.passedChecks}</p>
                    <p className="text-sm text-green-800">ผ่าน</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{selectedReport.failedChecks}</p>
                    <p className="text-sm text-red-800">ไม่ผ่าน</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedReport.score}%</p>
                    <p className="text-sm text-purple-800">คะแนนรวม</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">ผลการตรวจพบ</h4>
                  <div className="space-y-3">
                    {selectedReport.findings.map((finding, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900">{finding.category}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(finding.severity.toLowerCase())}`}>
                                {finding.severity}
                              </span>
                            </div>
                            <p className="text-gray-700">{finding.issue}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            finding.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            finding.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {finding.status}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded p-3 mt-2">
                          <p className="text-sm text-gray-700">
                            <strong>คำแนะนำ:</strong> {finding.recommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">ข้อมูลรายงาน</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">สร้างโดย:</span>
                        <span className="text-gray-900">{selectedReport.createdBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">วันที่สร้าง:</span>
                        <span className="text-gray-900">{selectedReport.createdDate.toLocaleDateString('th-TH')}</span>
                      </div>
                      {selectedReport.completedDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">วันที่เสร็จสิ้น:</span>
                          <span className="text-gray-900">{selectedReport.completedDate.toLocaleDateString('th-TH')}</span>
                        </div>
                      )}
                      {selectedReport.approvedBy && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">อนุมัติโดย:</span>
                          <span className="text-gray-900">{selectedReport.approvedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    ดาวน์โหลด
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="h-4 w-4 mr-2" />
                    แชร์
                  </button>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;