import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Copy, 
  Edit3, 
  Trash2, 
  Share2, 
  Download, 
  Upload, 
  Eye, 
  EyeOff,
  MoreHorizontal,
  X,
  Save,
  Play,
  Pause,
  RotateCcw,
  Bookmark,
  Flag,
  Clock,
  User,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  FlaskConical,
  MessageSquare,
  FileText,
  Code,
  Palette,
  BarChart3,
  Globe,
  Mail,
  Phone,
  Calendar,
  Video,
  Mic,
  Image,
  Music,
  Calculator,
  Lightbulb,
  Target,
  Award,
  TrendingUp,
  Activity,
  Zap,
  Brain,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Tag,
  Layers,
  Grid,
  List,
  Heart,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'business' | 'academic' | 'creative' | 'technical' | 'government' | 'personal';
  tags: string[];
  author: string;
  createdDate: Date;
  lastModified: Date;
  usageCount: number;
  rating: number;
  ratingCount: number;
  isPublic: boolean;
  isFavorite: boolean;
  isBookmarked: boolean;
  aiModel: string;
  estimatedTokens: number;
  estimatedCost: number;
  language: 'th' | 'en' | 'both';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ComponentType<any>;
  color: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  count: number;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating' | 'name'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    description: '',
    content: '',
    category: 'business' as Template['category'],
    tags: [] as string[],
    language: 'th' as Template['language'],
    difficulty: 'beginner' as Template['difficulty']
  });

  // Mock data
  const mockCategories: TemplateCategory[] = [
    { id: 'business', name: 'ธุรกิจ', description: 'เทมเพลตสำหรับงานธุรกิจ', icon: Briefcase, color: 'bg-blue-500', count: 24 },
    { id: 'academic', name: 'วิชาการ', description: 'เทมเพลตสำหรับงานวิชาการ', icon: GraduationCap, color: 'bg-green-500', count: 18 },
    { id: 'creative', name: 'สร้างสรรค์', description: 'เทมเพลตสำหรับงานสร้างสรรค์', icon: Palette, color: 'bg-purple-500', count: 15 },
    { id: 'technical', name: 'เทคนิค', description: 'เทมเพลตสำหรับงานเทคนิค', icon: Code, color: 'bg-orange-500', count: 21 },
    { id: 'government', name: 'ราชการ', description: 'เทมเพลตสำหรับงานราชการ', icon: Building, color: 'bg-red-500', count: 12 },
    { id: 'personal', name: 'ส่วนตัว', description: 'เทมเพลตสำหรับใช้งานส่วนตัว', icon: User, color: 'bg-indigo-500', count: 9 }
  ];

  const mockTemplates: Template[] = [
    {
      id: '1',
      title: 'เขียนอีเมลติดต่อลูกค้าอย่างมืออาชีพ',
      description: 'เทมเพลตสำหรับเขียนอีเมลติดต่อลูกค้าที่สุภาพ เป็นมืออาชีพ และได้ผลลัพธ์',
      content: `เรียน [ชื่อลูกค้า]

สวัสดีครับ/ค่ะ

ขอบคุณที่ให้ความสนใจในผลิตภัณฑ์/บริการของเรา

[เนื้อหาหลัก - อธิบายรายละเอียดที่ต้องการสื่อสาร]

หากท่านมีข้อสงสัยหรือต้องการข้อมูลเพิ่มเติม กรุณาติดต่อกลับมาได้ตลอดเวลา

ขอบคุณครับ/ค่ะ

[ชื่อ-นามสกุล]
[ตำแหน่ง]
[ข้อมูลติดต่อ]`,
      category: 'business',
      tags: ['อีเมล', 'ลูกค้า', 'ธุรกิจ', 'การสื่อสาร'],
      author: 'ThaiAI Team',
      createdDate: new Date('2024-01-15'),
      lastModified: new Date('2024-01-15'),
      usageCount: 1247,
      rating: 4.8,
      ratingCount: 156,
      isPublic: true,
      isFavorite: true,
      isBookmarked: false,
      aiModel: 'GPT-4',
      estimatedTokens: 150,
      estimatedCost: 0.045,
      language: 'th',
      difficulty: 'beginner',
      icon: Mail,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'สรุปเอกสารวิจัยวิชาการ',
      description: 'เทมเพลตสำหรับสรุปเอกสารวิจัยให้กระชับ ครอบคลุม และเข้าใจง่าย',
      content: `กรุณาสรุปเอกสารวิจัยนี้โดยครอบคลุมประเด็นต่อไปนี้:

**1. วัตถุประสงค์การวิจัย**
- [อธิบายวัตถุประสงค์หลักของการวิจัย]

**2. วิธีการวิจัย**
- [สรุปวิธีการที่ใช้ในการวิจัย]

**3. ผลการวิจัย**
- [สรุปผลการวิจัยที่สำคัญ]

**4. ข้อสรุปและข้อเสนอแนะ**
- [สรุปข้อค้นพบและข้อเสนอแนะ]

**5. ประโยชน์ที่ได้รับ**
- [อธิบายประโยชน์ที่สามารถนำไปใช้ได้]

กรุณาใช้ภาษาที่เข้าใจง่าย เหมาะสำหรับผู้ที่ไม่ใช่ผู้เชี่ยวชาญในสาขานั้นๆ`,
      category: 'academic',
      tags: ['วิจัย', 'สรุป', 'วิชาการ', 'เอกสาร'],
      author: 'Dr. สมชาย',
      createdDate: new Date('2024-01-12'),
      lastModified: new Date('2024-01-14'),
      usageCount: 892,
      rating: 4.9,
      ratingCount: 98,
      isPublic: true,
      isFavorite: false,
      isBookmarked: true,
      aiModel: 'Claude 3.5',
      estimatedTokens: 200,
      estimatedCost: 0.05,
      language: 'th',
      difficulty: 'intermediate',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'เขียนโค้ด Python สำหรับมือใหม่',
      description: 'เทมเพลตสำหรับขอให้ AI เขียนโค้ด Python พร้อมคำอธิบายที่เข้าใจง่าย',
      content: `กรุณาเขียนโค้ด Python สำหรับ [อธิบายงานที่ต้องการ] โดยมีข้อกำหนดดังนี้:

**ความต้องการ:**
- [ระบุความต้องการเฉพาะ]
- [ระบุ input และ output ที่ต้องการ]
- [ระบุข้อจำกัดหรือเงื่อนไขพิเศษ]

**คำขอเพิ่มเติม:**
1. กรุณาเขียนคำอธิบาย (comments) ในโค้ดเป็นภาษาไทย
2. ให้ตัวอย่างการใช้งาน (example usage)
3. อธิบายการทำงานของโค้ดแต่ละส่วน
4. แนะนำวิธีการปรับปรุงหรือขยายความสามารถ

**ระดับความยาก:** มือใหม่ (กรุณาอธิบายให้เข้าใจง่าย)`,
      category: 'technical',
      tags: ['Python', 'โปรแกรมมิ่ง', 'โค้ด', 'มือใหม่'],
      author: 'Dev Team',
      createdDate: new Date('2024-01-10'),
      lastModified: new Date('2024-01-13'),
      usageCount: 2156,
      rating: 4.7,
      ratingCount: 234,
      isPublic: true,
      isFavorite: true,
      isBookmarked: true,
      aiModel: 'GPT-4',
      estimatedTokens: 300,
      estimatedCost: 0.09,
      language: 'th',
      difficulty: 'beginner',
      icon: Code,
      color: 'bg-orange-500'
    },
    {
      id: '4',
      title: 'เขียนเนื้อหาโซเชียลมีเดียที่น่าสนใจ',
      description: 'เทมเพลตสำหรับสร้างเนื้อหาโซเชียลมีเดียที่ดึงดูดความสนใจและมี engagement สูง',
      content: `กรุณาสร้างเนื้อหาโซเชียลมีเดียสำหรับ [ระบุแพลตฟอร์ม: Facebook/Instagram/Twitter/LinkedIn] เกี่ยวกับหัวข้อ: [ระบุหัวข้อ]

**รายละเอียด:**
- เป้าหมาย: [ระบุกลุ่มเป้าหมาย]
- โทนการสื่อสار: [เป็นกันเอง/เป็นทางการ/สนุกสนาน/สร้างแรงบันดาลใจ]
- วัตถุประสงค์: [เพิ่มการรับรู้/ขายสินค้า/สร้าง engagement/แชร์ความรู้]

**ข้อกำหนด:**
1. ความยาวเหมาะสมกับแพลตฟอร์ม
2. ใช้ภาษาที่เข้าใจง่ายและน่าสนใจ
3. เพิ่ม hashtags ที่เกี่ยวข้อง
4. มี call-to-action ที่ชัดเจน
5. เหมาะสำหรับกลุ่มเป้าหมายในประเทศไทย

กรุณาสร้าง 3 เวอร์ชันที่แตกต่างกันเพื่อให้เลือกใช้`,
      category: 'creative',
      tags: ['โซเชียลมีเดีย', 'การตลาด', 'เนื้อหา', 'สร้างสรรค์'],
      author: 'Marketing Pro',
      createdDate: new Date('2024-01-08'),
      lastModified: new Date('2024-01-11'),
      usageCount: 1834,
      rating: 4.6,
      ratingCount: 187,
      isPublic: true,
      isFavorite: false,
      isBookmarked: false,
      aiModel: 'Gemini Pro',
      estimatedTokens: 250,
      estimatedCost: 0.05,
      language: 'th',
      difficulty: 'intermediate',
      icon: Palette,
      color: 'bg-purple-500'
    },
    {
      id: '5',
      title: 'ร่างหนังสือราชการตามระเบียบ',
      description: 'เทมเพลตสำหรับร่างหนังสือราชการให้ถูกต้องตามระเบียบและมีความเป็นทางการ',
      content: `กรุณาร่างหนังสือราชการประเภท [ระบุประเภท: หนังสือแจ้ง/หนังสือเชิญ/หนังสือขอความอนุเคราะห์/หนังสือตอบ] เรื่อง [ระบุเรื่อง]

**รายละเอียด:**
- จาก: [ระบุหน่วยงานผู้ส่ง]
- ถึง: [ระบุหน่วยงานผู้รับ]
- วัตถุประสงค์: [ระบุวัตถุประสงค์หลัก]
- รายละเอียดเพิ่มเติม: [ระบุรายละเอียดที่ต้องการสื่อสาร]

**ข้อกำหนด:**
1. ใช้รูปแบบหนังสือราชการมาตรฐาน
2. ใช้ภาษาราชการที่เหมาะสม สุภาพ และเป็นทางการ
3. มีโครงสร้างที่ชัดเจน: คำนำ เนื้อเรื่อง และการปิดท้าย
4. ระบุเอกสารแนบ (ถ้ามี)
5. เหมาะสำหรับการใช้งานในหน่วยงานราชการไทย

กรุณาจัดรูปแบบให้พร้อมใช้งาน`,
      category: 'government',
      tags: ['หนังสือราชการ', 'ราชการ', 'ทางการ', 'ระเบียบ'],
      author: 'Gov Officer',
      createdDate: new Date('2024-01-05'),
      lastModified: new Date('2024-01-09'),
      usageCount: 567,
      rating: 4.9,
      ratingCount: 67,
      isPublic: true,
      isFavorite: false,
      isBookmarked: true,
      aiModel: 'Claude 3.5',
      estimatedTokens: 400,
      estimatedCost: 0.10,
      language: 'th',
      difficulty: 'advanced',
      icon: Building,
      color: 'bg-red-500'
    },
    {
      id: '6',
      title: 'วางแผนการเดินทางส่วนตัว',
      description: 'เทมเพลตสำหรับขอให้ AI ช่วยวางแผนการเดินทางที่ครอบคลุมและเหมาะสมกับงบประมาณ',
      content: `กรุณาช่วยวางแผนการเดินทางไป [ระบุจุดหมาย] สำหรับ [จำนวนคน] คน ระยะเวลา [จำนวนวัน] วัน

**ข้อมูลการเดินทาง:**
- งบประมาณ: [ระบุงบประมาณโดยประมาณ]
- ประเภทการเดินทาง: [พักผ่อน/ธุรกิจ/ผจญภัย/วัฒนธรรม]
- ความสนใจพิเศษ: [อาหาร/ธรรมชาติ/ประวัติศาสตร์/ช้อปปิ้ง/กิจกรรม]
- ข้อจำกัด: [อาหาร/สุขภาพ/การเดินทาง]

**กรุณาจัดทำแผนที่ครอบคลุม:**
1. **การเดินทาง:** เที่ยวบิน/รถ/ที่พัก พร้อมราคาประมาณ
2. **กิจกรรมรายวัน:** แนะนำสถานที่และกิจกรรมที่น่าสนใจ
3. **อาหาร:** ร้านอาหารและอาหารท้องถิ่นที่ควรลอง
4. **งบประมาณ:** แยกรายการค่าใช้จ่ายโดยละเอียด
5. **เคล็ดลับ:** คำแนะนำสำหรับการเดินทางที่ดี

กรุณาจัดรูปแบบให้อ่านง่ายและใช้งานได้จริง`,
      category: 'personal',
      tags: ['เดินทาง', 'วางแผน', 'ท่องเที่ยว', 'ส่วนตัว'],
      author: 'Travel Lover',
      createdDate: new Date('2024-01-03'),
      lastModified: new Date('2024-01-07'),
      usageCount: 1123,
      rating: 4.5,
      ratingCount: 145,
      isPublic: true,
      isFavorite: true,
      isBookmarked: false,
      aiModel: 'Perplexity',
      estimatedTokens: 350,
      estimatedCost: 0.12,
      language: 'th',
      difficulty: 'beginner',
      icon: User,
      color: 'bg-indigo-500'
    }
  ];

  React.useEffect(() => {
    setCategories(mockCategories);
    setTemplates(mockTemplates);
  }, []);

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : BookOpen;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'เริ่มต้น';
      case 'intermediate': return 'ปานกลาง';
      case 'advanced': return 'ขั้นสูง';
      default: return 'ไม่ระบุ';
    }
  };

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case 'th': return 'ไทย';
      case 'en': return 'อังกฤษ';
      case 'both': return 'ไทย/อังกฤษ';
      default: return 'ไม่ระบุ';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = filterDifficulty === 'all' || template.difficulty === filterDifficulty;
    const matchesLanguage = filterLanguage === 'all' || template.language === filterLanguage;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.usageCount - a.usageCount;
      case 'recent':
        return b.lastModified.getTime() - a.lastModified.getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const toggleFavorite = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId ? { ...template, isFavorite: !template.isFavorite } : template
    ));
  };

  const toggleBookmark = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId ? { ...template, isBookmarked: !template.isBookmarked } : template
    ));
  };

  const handleUseTemplate = (template: Template) => {
    // Copy template content to clipboard
    navigator.clipboard.writeText(template.content);
    alert('เทมเพลตถูกคัดลอกไปยังคลิปบอร์ดแล้ว!');
  };

  const handleCreateTemplate = () => {
    const template: Template = {
      id: Date.now().toString(),
      ...newTemplate,
      tags: newTemplate.tags,
      author: 'คุณ',
      createdDate: new Date(),
      lastModified: new Date(),
      usageCount: 0,
      rating: 0,
      ratingCount: 0,
      isPublic: false,
      isFavorite: false,
      isBookmarked: false,
      aiModel: 'GPT-4',
      estimatedTokens: Math.ceil(newTemplate.content.length / 4),
      estimatedCost: Math.ceil(newTemplate.content.length / 4) * 0.0003,
      icon: getCategoryIcon(newTemplate.category),
      color: getCategoryColor(newTemplate.category)
    };

    setTemplates(prev => [template, ...prev]);
    setNewTemplate({
      title: '',
      description: '',
      content: '',
      category: 'business',
      tags: [],
      language: 'th',
      difficulty: 'beginner'
    });
    setShowCreateModal(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="h-7 w-7 mr-3 text-blue-600" />
              เทมเพลต
            </h1>
            <p className="text-gray-600 text-sm mt-1">เทมเพลต Prompt สำหรับงานต่างๆ ที่ใช้งานได้จริง</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              สร้างเทมเพลต
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาเทมเพลต..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">หมวดหมู่ทั้งหมด</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">ระดับทั้งหมด</option>
            <option value="beginner">เริ่มต้น</option>
            <option value="intermediate">ปานกลาง</option>
            <option value="advanced">ขั้นสูง</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="popular">ยอดนิยม</option>
            <option value="recent">ล่าสุด</option>
            <option value="rating">คะแนน</option>
            <option value="name">ชื่อ</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">หมวดหมู่</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    selectedCategory === category.id
                      ? `${category.color} text-white border-transparent`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{category.name}</div>
                  <div className="text-xs opacity-75">{category.count} เทมเพลต</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              เทมเพลต ({sortedTemplates.length})
            </h2>
          </div>

          {sortedTemplates.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบเทมเพลต</h3>
              <p className="text-gray-600 mb-6">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                สร้างเทมเพลตใหม่
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    className={`bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow ${
                      viewMode === 'list' ? 'p-4' : 'p-6'
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Grid View */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`${template.color} p-3 rounded-lg`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 line-clamp-2">{template.title}</h3>
                              <p className="text-sm text-gray-600">โดย {template.author}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => toggleFavorite(template.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                template.isFavorite ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${template.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => toggleBookmark(template.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                template.isBookmarked ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <Bookmark className={`h-4 w-4 ${template.isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{template.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{template.tags.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {template.usageCount.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              {template.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                            {getDifficultyLabel(template.difficulty)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            <span>฿{template.estimatedCost.toFixed(3)} • {template.estimatedTokens} tokens</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedTemplate(template);
                                setShowTemplateModal(true);
                              }}
                              className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                            >
                              ดูรายละเอียด
                            </button>
                            <button
                              onClick={() => handleUseTemplate(template)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              ใช้งาน
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`${template.color} p-2 rounded-lg flex-shrink-0`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">{template.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                                  {getDifficultyLabel(template.difficulty)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{template.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>โดย {template.author}</span>
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {template.usageCount.toLocaleString()}
                                </span>
                                <span className="flex items-center">
                                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                  {template.rating.toFixed(1)}
                                </span>
                                <span>฿{template.estimatedCost.toFixed(3)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => toggleFavorite(template.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                template.isFavorite ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${template.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTemplate(template);
                                setShowTemplateModal(true);
                              }}
                              className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                            >
                              ดู
                            </button>
                            <button
                              onClick={() => handleUseTemplate(template)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              ใช้งาน
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">สร้างเทมเพลตใหม่</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อเทมเพลต</label>
                  <input
                    type="text"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="ระบุชื่อเทมเพลต"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="อธิบายการใช้งานและประโยชน์ของเทมเพลต"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ระดับความยาก</label>
                    <select
                      value={newTemplate.difficulty}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="beginner">เริ่มต้น</option>
                      <option value="intermediate">ปานกลาง</option>
                      <option value="advanced">ขั้นสูง</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เนื้อหาเทมเพลต</label>
                  <textarea
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="เขียน Prompt Template ที่ต้องการ..."
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">แท็ก (คั่นด้วยเครื่องหมายจุลภาค)</label>
                  <input
                    type="text"
                    onChange={(e) => setNewTemplate(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                    }))}
                    placeholder="เช่น: อีเมล, ธุรกิจ, การสื่อสาร"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleCreateTemplate}
                  disabled={!newTemplate.title || !newTemplate.content}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  สร้างเทมเพลต
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Detail Modal */}
      {showTemplateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`${selectedTemplate.color} p-3 rounded-xl`}>
                  <selectedTemplate.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedTemplate.title}</h3>
                  <p className="text-sm text-gray-600">โดย {selectedTemplate.author}</p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
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
                  <p className="text-gray-700 leading-relaxed">{selectedTemplate.description}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">หมวดหมู่</p>
                    <p className="font-semibold text-gray-900">{categories.find(c => c.id === selectedTemplate.category)?.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">ระดับความยาก</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                      {getDifficultyLabel(selectedTemplate.difficulty)}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">การใช้งาน</p>
                    <p className="font-semibold text-gray-900">{selectedTemplate.usageCount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">คะแนน</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900">{selectedTemplate.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-600">({selectedTemplate.ratingCount})</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">แท็ก</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">เนื้อหาเทมเพลต</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                      {selectedTemplate.content}
                    </pre>
                  </div>
                </div>

                {/* Cost Estimate */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">ประมาณการค่าใช้จ่าย</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">AI Model</p>
                      <p className="font-semibold text-blue-900">{selectedTemplate.aiModel}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Tokens</p>
                      <p className="font-semibold text-blue-900">{selectedTemplate.estimatedTokens.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">ค่าใช้จ่าย</p>
                      <p className="font-semibold text-blue-900">฿{selectedTemplate.estimatedCost.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleFavorite(selectedTemplate.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      selectedTemplate.isFavorite 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${selectedTemplate.isFavorite ? 'fill-current' : ''}`} />
                    {selectedTemplate.isFavorite ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="h-4 w-4 mr-2" />
                    แชร์
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ปิด
                  </button>
                  <button
                    onClick={() => handleUseTemplate(selectedTemplate)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ใช้งานเทมเพลต
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

export default Templates;