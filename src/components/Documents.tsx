import React, { useState, useRef, useCallback } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  Edit3, 
  MoreHorizontal,
  Plus,
  FolderPlus,
  Star,
  Clock,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Brain,
  Zap,
  Globe,
  Shield,
  BookOpen,
  BarChart3,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  RefreshCw,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  Image,
  Video,
  Music,
  Code,
  Database,
  Presentation,
  Calendar,
  Mail,
  Link,
  ExternalLink,
  Copy,
  Save,
  Bookmark,
  Flag,
  MessageSquare,
  Target,
  Award,
  TrendingUp,
  Users,
  Building,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'image' | 'video' | 'audio' | 'text' | 'other';
  size: number;
  uploadDate: Date;
  lastModified: Date;
  status: 'processing' | 'completed' | 'failed' | 'analyzing';
  uploadedBy: string;
  folder?: string;
  tags: string[];
  summary?: string;
  keyPoints?: string[];
  aiModel?: string;
  processingCost?: number;
  confidence?: number;
  language?: string;
  pageCount?: number;
  wordCount?: number;
  isStarred: boolean;
  isShared: boolean;
  sharedWith?: string[];
  permissions: 'owner' | 'editor' | 'viewer';
  category: 'research' | 'report' | 'presentation' | 'contract' | 'manual' | 'other';
}

interface Folder {
  id: string;
  name: string;
  documentCount: number;
  createdDate: Date;
  color: string;
  isExpanded?: boolean;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'processing' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'รายงานการวิจัย AI in Education 2024.pdf',
      type: 'pdf',
      size: 2500000,
      uploadDate: new Date('2024-01-15T10:30:00'),
      lastModified: new Date('2024-01-15T10:30:00'),
      status: 'completed',
      uploadedBy: 'คุณสมชาย',
      folder: 'งานวิจัย',
      tags: ['AI', 'การศึกษา', 'วิจัย', '2024'],
      summary: 'รายงานการวิจัยเกี่ยวกับการใช้ AI ในระบบการศึกษาไทย พบว่า AI สามารถช่วยเพิ่มประสิทธิภาพการเรียนการสอนได้ถึง 40%',
      keyPoints: [
        'AI ช่วยเพิ่มประสิทธิภาพการเรียนการสอน 40%',
        'ลดเวลาการตรวจงานของครูลง 60%',
        'นักเรียนมีความพึงพอใจเพิ่มขึ้น 25%'
      ],
      aiModel: 'Claude 3.5 Sonnet',
      processingCost: 0.85,
      confidence: 92,
      language: 'th',
      pageCount: 45,
      wordCount: 12500,
      isStarred: true,
      isShared: false,
      permissions: 'owner',
      category: 'research'
    },
    {
      id: '2',
      name: 'แผนกลยุทธ์ดิจิทัล 2025-2027.docx',
      type: 'word',
      size: 1800000,
      uploadDate: new Date('2024-01-14T14:20:00'),
      lastModified: new Date('2024-01-14T16:45:00'),
      status: 'completed',
      uploadedBy: 'คุณปัทมา',
      folder: 'แผนงาน',
      tags: ['กลยุทธ์', 'ดิจิทัล', 'แผน', '2025'],
      summary: 'แผนกลยุทธ์การเปลี่ยนผ่านสู่ดิจิทัลขององค์กร ครอบคลุมการลงทุนในเทคโนโลยี การพัฒนาบุคลากร และการปรับปรุงกระบวนการทำงาน',
      keyPoints: [
        'งบประมาณลงทุน IT 50 ล้านบาท',
        'อบรมพนักงาน Digital Skills 100%',
        'ปรับปรุงระบบงานหลัก 15 ระบบ'
      ],
      aiModel: 'GPT-4',
      processingCost: 0.65,
      confidence: 88,
      language: 'th',
      pageCount: 28,
      wordCount: 8900,
      isStarred: false,
      isShared: true,
      sharedWith: ['คุณอนุชา', 'คุณวิชัย'],
      permissions: 'owner',
      category: 'report'
    },
    {
      id: '3',
      name: 'การนำเสนอผลงาน Q4 2024.pptx',
      type: 'powerpoint',
      size: 5200000,
      uploadDate: new Date('2024-01-13T09:15:00'),
      lastModified: new Date('2024-01-13T11:30:00'),
      status: 'processing',
      uploadedBy: 'คุณอนุชา',
      folder: 'การนำเสนอ',
      tags: ['Q4', 'ผลงาน', 'การนำเสนอ'],
      isStarred: false,
      isShared: false,
      permissions: 'owner',
      category: 'presentation'
    },
    {
      id: '4',
      name: 'สัญญาจ้างที่ปรึกษา AI.pdf',
      type: 'pdf',
      size: 890000,
      uploadDate: new Date('2024-01-12T16:00:00'),
      lastModified: new Date('2024-01-12T16:00:00'),
      status: 'completed',
      uploadedBy: 'คุณสุดา',
      folder: 'สัญญา',
      tags: ['สัญญา', 'ที่ปรึกษา', 'AI'],
      summary: 'สัญญาจ้างที่ปรึกษาด้าน AI เพื่อพัฒนาระบบอัจฉริยะขององค์กร ระยะเวลา 12 เดือน งบประมาณ 2.5 ล้านบาท',
      keyPoints: [
        'ระยะเวลาสัญญา 12 เดือน',
        'งบประมาณ 2.5 ล้านบาท',
        'ส่งมอบระบบ AI 3 ระบบ'
      ],
      aiModel: 'Claude 3.5 Sonnet',
      processingCost: 0.35,
      confidence: 95,
      language: 'th',
      pageCount: 12,
      wordCount: 3200,
      isStarred: false,
      isShared: true,
      sharedWith: ['คุณสมชาย'],
      permissions: 'owner',
      category: 'contract'
    }
  ];

  const mockFolders: Folder[] = [
    { id: '1', name: 'งานวิจัย', documentCount: 15, createdDate: new Date('2024-01-01'), color: 'bg-blue-500', isExpanded: true },
    { id: '2', name: 'แผนงาน', documentCount: 8, createdDate: new Date('2024-01-05'), color: 'bg-green-500', isExpanded: false },
    { id: '3', name: 'การนำเสนอ', documentCount: 12, createdDate: new Date('2024-01-10'), color: 'bg-purple-500', isExpanded: false },
    { id: '4', name: 'สัญญา', documentCount: 6, createdDate: new Date('2024-01-12'), color: 'bg-orange-500', isExpanded: false },
    { id: '5', name: 'คู่มือ', documentCount: 20, createdDate: new Date('2024-01-08'), color: 'bg-red-500', isExpanded: false }
  ];

  React.useEffect(() => {
    setDocuments(mockDocuments);
    setFolders(mockFolders);
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'word':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'excel':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'powerpoint':
        return <Presentation className="h-5 w-5 text-orange-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-purple-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-pink-500" />;
      case 'audio':
        return <Music className="h-5 w-5 text-indigo-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'analyzing':
        return <Brain className="h-4 w-4 text-purple-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      const newDoc: Document = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        uploadDate: new Date(),
        lastModified: new Date(),
        status: 'processing',
        uploadedBy: 'คุณ',
        folder: selectedFolder || undefined,
        tags: [],
        isStarred: false,
        isShared: false,
        permissions: 'owner',
        category: 'other'
      };

      setDocuments(prev => [...prev, newDoc]);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // Simulate processing completion
          setTimeout(() => {
            setDocuments(prev => prev.map(doc => 
              doc.id === newDoc.id 
                ? { ...doc, status: 'completed', summary: 'เอกสารได้รับการวิเคราะห์เรียบร้อยแล้ว' }
                : doc
            ));
          }, 2000);
        }
        setUploadProgress(prev => ({ ...prev, [newDoc.id]: progress }));
      }, 500);
    });
  }, [selectedFolder]);

  const getFileType = (filename: string): Document['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'word';
      case 'xls':
      case 'xlsx':
        return 'excel';
      case 'ppt':
      case 'pptx':
        return 'powerpoint';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'video';
      case 'mp3':
      case 'wav':
      case 'flac':
        return 'audio';
      case 'txt':
        return 'text';
      default:
        return 'other';
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterBy === 'all' || doc.status === filterBy;
    const matchesFolder = !selectedFolder || doc.folder === selectedFolder;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesFilter && matchesFolder && matchesCategory;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.uploadDate.getTime() - a.uploadDate.getTime();
      case 'size':
        return b.size - a.size;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        documentCount: 0,
        createdDate: new Date(),
        color: 'bg-gray-500',
        isExpanded: false
      };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'research':
        return <GraduationCap className="h-4 w-4" />;
      case 'report':
        return <BarChart3 className="h-4 w-4" />;
      case 'presentation':
        return <Presentation className="h-4 w-4" />;
      case 'contract':
        return <Building className="h-4 w-4" />;
      case 'manual':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'research':
        return 'งานวิจัย';
      case 'report':
        return 'รายงาน';
      case 'presentation':
        return 'การนำเสนอ';
      case 'contract':
        return 'สัญญา';
      case 'manual':
        return 'คู่มือ';
      default:
        return 'อื่นๆ';
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            เอกสาร
          </h2>
        </div>

        {/* Quick Actions */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            อัปโหลดเอกสาร
          </button>
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="w-full flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            สร้างโฟลเดอร์
          </button>
        </div>

        {/* Folders */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">โฟลเดอร์</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  selectedFolder === null ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Folder className="h-4 w-4 mr-2" />
                <span className="flex-1 text-left">ทั้งหมด</span>
                <span className="text-xs text-gray-500">{documents.length}</span>
              </button>
              
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.name)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    selectedFolder === folder.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mr-2 ${folder.color}`} />
                  <span className="flex-1 text-left">{folder.name}</span>
                  <span className="text-xs text-gray-500">{folder.documentCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">หมวดหมู่</h3>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'ทั้งหมด', icon: FileText },
                { id: 'research', label: 'งานวิจัย', icon: GraduationCap },
                { id: 'report', label: 'รายงาน', icon: BarChart3 },
                { id: 'presentation', label: 'การนำเสนอ', icon: Presentation },
                { id: 'contract', label: 'สัญญา', icon: Building },
                { id: 'manual', label: 'คู่มือ', icon: BookOpen }
              ].map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="flex-1 text-left">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedFolder ? `โฟลเดอร์: ${selectedFolder}` : 'เอกสารทั้งหมด'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                จัดการและวิเคราะห์เอกสารด้วย AI
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Archive className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาเอกสาร..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">เรียงตามวันที่</option>
              <option value="name">เรียงตามชื่อ</option>
              <option value="size">เรียงตามขนาด</option>
              <option value="type">เรียงตามประเภท</option>
            </select>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทั้งหมด</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="processing">กำลังประมวลผล</option>
              <option value="failed">ล้มเหลว</option>
            </select>
          </div>
        </div>

        {/* Document List */}
        <div 
          className={`flex-1 overflow-y-auto p-6 ${dragOver ? 'bg-blue-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {dragOver && (
            <div className="fixed inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-dashed border-blue-500">
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 text-center">วางไฟล์ที่นี่เพื่ออัปโหลด</p>
              </div>
            </div>
          )}

          {sortedDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบเอกสาร</h3>
              <p className="text-gray-600 mb-6">เริ่มต้นด้วยการอัปโหลดเอกสารแรกของคุณ</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                อัปโหลดเอกสาร
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{doc.name}</h3>
                          {doc.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          {doc.isShared && <Users className="h-4 w-4 text-blue-500" />}
                          {getStatusIcon(doc.status)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {doc.uploadedBy}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {doc.uploadDate.toLocaleDateString('th-TH')}
                          </span>
                          <span>{formatFileSize(doc.size)}</span>
                          {doc.pageCount && <span>{doc.pageCount} หน้า</span>}
                          <span className="flex items-center">
                            {getCategoryIcon(doc.category)}
                            <span className="ml-1">{getCategoryLabel(doc.category)}</span>
                          </span>
                        </div>

                        {doc.summary && (
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{doc.summary}</p>
                        )}

                        {doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {doc.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {doc.status === 'completed' && doc.confidence && (
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Brain className="h-3 w-3 mr-1" />
                              {doc.aiModel}
                            </span>
                            <span>ความแม่นยำ: {doc.confidence}%</span>
                            {doc.processingCost && <span>ค่าใช้จ่าย: ฿{doc.processingCost.toFixed(2)}</span>}
                          </div>
                        )}

                        {doc.status === 'processing' && uploadProgress[doc.id] && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>กำลังประมวลผล...</span>
                              <span>{Math.round(uploadProgress[doc.id])}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[doc.id]}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocuments(prev => prev.map(d => 
                            d.id === doc.id ? { ...d, isStarred: !d.isStarred } : d
                          ));
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          doc.isStarred ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Star className={`h-4 w-4 ${doc.isStarred ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">อัปโหลดเอกสาร</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง</p>
                <p className="text-xs text-gray-500 mt-1">รองรับ PDF, Word, Excel, PowerPoint, รูปภาพ</p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(e.target.files);
                    setShowUploadModal(false);
                  }
                }}
              />
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  เลือกไฟล์
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">สร้างโฟลเดอร์ใหม่</h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อโฟลเดอร์</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="ระบุชื่อโฟลเดอร์"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  สร้าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedDocument.type)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(selectedDocument.size)} • {selectedDocument.uploadDate.toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {selectedDocument.status === 'completed' ? (
                <div className="space-y-6">
                  {selectedDocument.summary && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">สรุปเอกสาร</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedDocument.summary}</p>
                    </div>
                  )}
                  
                  {selectedDocument.keyPoints && selectedDocument.keyPoints.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">จุดสำคัญ</h4>
                      <ul className="space-y-2">
                        {selectedDocument.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">ข้อมูลเอกสาร</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ประเภท:</span>
                          <span className="text-gray-900">{selectedDocument.type.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ขนาด:</span>
                          <span className="text-gray-900">{formatFileSize(selectedDocument.size)}</span>
                        </div>
                        {selectedDocument.pageCount && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">จำนวนหน้า:</span>
                            <span className="text-gray-900">{selectedDocument.pageCount}</span>
                          </div>
                        )}
                        {selectedDocument.wordCount && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">จำนวนคำ:</span>
                            <span className="text-gray-900">{selectedDocument.wordCount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">การวิเคราะห์</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">AI Model:</span>
                          <span className="text-gray-900">{selectedDocument.aiModel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ความแม่นยำ:</span>
                          <span className="text-gray-900">{selectedDocument.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ค่าใช้จ่าย:</span>
                          <span className="text-gray-900">฿{selectedDocument.processingCost?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ภาษา:</span>
                          <span className="text-gray-900">{selectedDocument.language === 'th' ? 'ไทย' : 'อังกฤษ'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">กำลังประมวลผลเอกสาร</h3>
                  <p className="text-gray-600">กรุณารอสักครู่...</p>
                </div>
              )}
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
                <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4 mr-2" />
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;