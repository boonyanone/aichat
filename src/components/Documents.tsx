import React, { useState, useRef, useCallback } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Share2, 
  Copy, 
  Star, 
  Clock, 
  User, 
  Calendar, 
  Tag, 
  Folder, 
  FolderOpen, 
  Plus, 
  MoreHorizontal, 
  CheckCircle, 
  AlertCircle, 
  Brain, 
  Zap, 
  Shield, 
  Target, 
  TrendingUp, 
  BookOpen, 
  FileImage, 
  FileSpreadsheet, 
  FileVideo, 
  FileAudio, 
  Archive, 
  ExternalLink, 
  Lightbulb, 
  Award, 
  Globe, 
  Users, 
  Building, 
  GraduationCap, 
  Briefcase, 
  X, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Settings, 
  Link, 
  MessageSquare, 
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Database,
  HardDrive,
  Cloud,
  Lock,
  Unlock,
  History,
  GitBranch,
  Save,
  Send,
  Mail,
  Phone,
  MapPin,
  Camera,
  Mic,
  Video,
  Image,
  Music,
  Film,
  Code,
  Terminal,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Headphones,
  Speaker,
  Printer,
  Scanner,
  Keyboard,
  Mouse,
  Gamepad2,
  Joystick,
  Wifi,
  Bluetooth,
  Usb,
  HardDrive as Storage,
  Server,
  Router,
  Modem,
  Antenna,
  Satellite,
  Radio,
  Tv,
  Camera as WebCam,
  Projector,
  Flashlight,
  Battery,
  BatteryCharging,
  Power,
  PowerOff,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Repeat,
  Shuffle,
  List,
  Grid,
  Columns,
  Rows,
  Table,
  Layout,
  Sidebar,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Maximize,
  Minimize,
  Move,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Scissors,
  Paintbrush,
  Palette,
  Pipette,
  Eraser,
  Pen,
  PenTool,
  Pencil,
  Highlighter,
  Marker,
  Ruler,
  Compass,
  Triangle,
  Square as SquareShape,
  Circle,
  Pentagon,
  Hexagon,
  Octagon,
  Star as StarShape,
  Heart,
  Diamond,
  Spade,
  Club,
  Hash,
  AtSign,
  Percent,
  Dollar,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  CreditCard,
  Banknote,
  Coins,
  Wallet,
  ShoppingCart,
  ShoppingBag,
  Store,
  Storefront,
  Package,
  Package2,
  PackageOpen,
  PackageCheck,
  PackageX,
  PackagePlus,
  PackageMinus,
  PackageSearch,
  Truck,
  Car,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Scooter,
  Motorcycle,
  Taxi,
  PlaneTakeoff,
  PlaneLanding,
  MapPin as Location,
  Map,
  Navigation,
  Compass as CompassIcon,
  Route,
  Road,
  Bridge,
  Building2,
  Home,
  Office,
  School,
  Hospital,
  Church,
  Factory,
  Warehouse,
  Store as Shop,
  Restaurant,
  Hotel,
  Bank,
  Library,
  Museum,
  Theater,
  Stadium,
  Park,
  Tree,
  TreePine,
  Flower,
  Flower2,
  Leaf,
  Seedling,
  Sprout,
  Sun,
  Moon,
  Star as StarIcon,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudHail,
  Tornado,
  Hurricane,
  Thermometer,
  Gauge,
  Barometer,
  Wind,
  Umbrella,
  Snowflake,
  Flame,
  Droplet,
  Waves,
  Mountain,
  Volcano,
  Desert,
  Forest,
  Island,
  Beach,
  River,
  Lake,
  Ocean,
  Fish,
  Turtle,
  Rabbit,
  Squirrel,
  Hedgehog,
  Dog,
  Cat,
  Bird,
  Butterfly,
  Bug,
  Ant,
  Bee,
  Spider,
  Snail,
  Worm,
  Elephant,
  Lion,
  Tiger,
  Bear,
  Wolf,
  Fox,
  Deer,
  Horse,
  Cow,
  Pig,
  Sheep,
  Goat,
  Chicken,
  Duck,
  Turkey,
  Penguin,
  Owl,
  Eagle,
  Dove,
  Peacock,
  Parrot,
  Flamingo,
  Swan,
  Crane,
  Stork,
  Pelican,
  Seagull,
  Albatross,
  Hummingbird,
  Woodpecker,
  Robin,
  Sparrow,
  Canary,
  Cardinal,
  BlueJay,
  Crow,
  Raven,
  Magpie,
  Kingfisher,
  Toucan,
  Hornbill,
  Hoopoe,
  Bee as BeeIcon,
  Ladybug,
  Dragonfly,
  Grasshopper,
  Cricket,
  Mantis,
  Scorpion,
  Crab,
  Lobster,
  Shrimp,
  Octopus,
  Squid,
  Jellyfish,
  Starfish,
  Seahorse,
  Whale,
  Dolphin,
  Shark,
  Stingray,
  Swordfish,
  Tuna,
  Salmon,
  Trout,
  Bass,
  Carp,
  Goldfish,
  Angelfish,
  Clownfish,
  Pufferfish,
  Eel,
  Catfish,
  Piranha,
  Barracuda,
  Manta,
  Hammerhead,
  GreatWhite,
  TigerShark,
  BullShark,
  MakoShark,
  NurseShark,
  ReefShark,
  BlacktipShark,
  WhitetipShark,
  SandTigerShark,
  ThresherShark,
  GoblinShark,
  BaskingShark,
  WhaleShark,
  MegamouthShark,
  CookieCutterShark,
  LanternShark,
  DogfishShark,
  CatShark,
  HornShark,
  PortJacksonShark,
  ZebraShark,
  WobbegongShark,
  AngelShark,
  SawShark,
  FrillShark,
  GhostShark,
  ElephantShark,
  RayShark,
  SkateShark,
  GuitarShark,
  BanjoShark,
  ShovelNoseShark,
  SawfishShark,
  ElectricRayShark,
  TorpedoRayShark,
  StingrayShark,
  EagleRayShark,
  MantaRayShark,
  DevilRayShark,
  CownoseRayShark,
  ButterflyRayShark,
  RoundRayShark,
  SkateRayShark,
  ThornbackRayShark,
  BlondRayShark,
  UndulateRayShark,
  SpottedRayShark,
  MarbledRayShark,
  SmallEyedRayShark,
  LongNosedRayShark,
  CommonRayShark,
  BlueRayShark,
  YellowRayShark,
  PinkRayShark,
  WhiteRayShark,
  BlackRayShark,
  GrayRayShark,
  BrownRayShark,
  GreenRayShark,
  RedRayShark,
  OrangeRayShark,
  PurpleRayShark,
  SilverRayShark,
  GoldRayShark,
  CopperRayShark,
  BronzeRayShark,
  IronRayShark,
  SteelRayShark,
  TitaniumRayShark,
  AluminumRayShark,
  ChromeRayShark,
  NickelRayShark,
  ZincRayShark,
  TinRayShark,
  LeadRayShark,
  MercuryRayShark,
  PlatinumRayShark,
  PalladiumRayShark,
  RhodiumRayShark,
  IridiumRayShark,
  OsmiumRayShark,
  RutheniumRayShark,
  RheniumRayShark,
  TungstenRayShark,
  TantalumRayShark,
  HafniumRayShark,
  ZirconiumRayShark,
  NiobiumRayShark,
  MolybdenumRayShark,
  TechnetiumRayShark,
  RutherfordiumRayShark,
  DubniumRayShark,
  SeaborgiumRayShark,
  BohriumRayShark,
  HassiumRayShark,
  MeitneriumRayShark,
  DarmstadtiumRayShark,
  RoentgeniumRayShark,
  CoperniciumRayShark,
  NihoniumRayShark,
  FleroviumRayShark,
  MoscoviumRayShark,
  LivermoriumRayShark,
  TennessineRayShark,
  OganessonRayShark
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'image' | 'text' | 'other';
  size: number;
  uploadDate: Date;
  lastModified: Date;
  uploadedBy: string;
  folderId?: string;
  tags: string[];
  status: 'processing' | 'completed' | 'error' | 'draft';
  summary?: DocumentSummary;
  analysis?: DocumentAnalysis;
  isStarred: boolean;
  isShared: boolean;
  permissions: 'private' | 'team' | 'public';
  version: number;
  originalUrl?: string;
  thumbnailUrl?: string;
}

interface DocumentSummary {
  overview: string;
  keyPoints: string[];
  wordCount: number;
  pageCount: number;
  language: string;
  aiModel: string;
  confidence: number;
  extractedData?: any;
}

interface DocumentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  entities: string[];
  readabilityScore: number;
  complexity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  color: string;
  documentCount: number;
  createdDate: Date;
  isShared: boolean;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const mockFolders: Folder[] = [
    {
      id: '1',
      name: 'งานวิจัย',
      color: 'bg-blue-500',
      documentCount: 12,
      createdDate: new Date('2024-01-10'),
      isShared: false
    },
    {
      id: '2',
      name: 'รายงานประจำเดือน',
      color: 'bg-green-500',
      documentCount: 8,
      createdDate: new Date('2024-01-15'),
      isShared: true
    },
    {
      id: '3',
      name: 'เอกสารสำคัญ',
      color: 'bg-purple-500',
      documentCount: 5,
      createdDate: new Date('2024-01-20'),
      isShared: false
    }
  ];

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'รายงานการวิจัย AI in Education.pdf',
      type: 'pdf',
      size: 2048000,
      uploadDate: new Date('2024-01-15T10:30:00'),
      lastModified: new Date('2024-01-15T10:30:00'),
      uploadedBy: 'คุณสมชาย',
      folderId: '1',
      tags: ['วิจัย', 'AI', 'การศึกษา'],
      status: 'completed',
      isStarred: true,
      isShared: false,
      permissions: 'team',
      version: 1,
      summary: {
        overview: 'การศึกษาวิจัยเกี่ยวกับการประยุกต์ใช้ปัญญาประดิษฐ์ในระบบการศึกษาไทย พบว่าสามารถเพิ่มประสิทธิภาพการเรียนรู้ได้อย่างมีนัยสำคัญ',
        keyPoints: [
          'AI สามารถปรับการเรียนรู้ให้เหมาะกับผู้เรียนแต่ละคน',
          'ลดเวลาการให้คำปรึกษาของครูได้ 40%',
          'เพิ่มผลการเรียนเฉลี่ย 25%'
        ],
        wordCount: 15420,
        pageCount: 45,
        language: 'th',
        aiModel: 'Claude 3.5 Sonnet',
        confidence: 94
      },
      analysis: {
        sentiment: 'positive',
        topics: ['ปัญญาประดิษฐ์', 'การศึกษา', 'เทคโนโลยี', 'นวัตกรรม'],
        entities: ['มหาวิทยาลัย', 'นักเรียน', 'ครู', 'ระบบการศึกษา'],
        readabilityScore: 78,
        complexity: 'medium',
        recommendations: [
          'เพิ่มตัวอย่างการใช้งานจริง',
          'อธิบายเทคนิคให้เข้าใจง่ายขึ้น',
          'เพิ่มกราฟและแผนภูมิประกอบ'
        ]
      }
    },
    {
      id: '2',
      name: 'งบประมาณ Q4 2024.xlsx',
      type: 'excel',
      size: 512000,
      uploadDate: new Date('2024-01-20T14:15:00'),
      lastModified: new Date('2024-01-22T09:45:00'),
      uploadedBy: 'คุณปัทมา',
      folderId: '2',
      tags: ['งบประมาณ', 'Q4', 'การเงิน'],
      status: 'completed',
      isStarred: false,
      isShared: true,
      permissions: 'team',
      version: 3,
      summary: {
        overview: 'รายงานงบประมาณไตรมาส 4 ปี 2024 แสดงรายได้เพิ่มขึ้น 15% และค่าใช้จ่ายลดลง 8% เมื่อเทียบกับปีที่แล้ว',
        keyPoints: [
          'รายได้รวม 12.5 ล้านบาท',
          'กำไรสุทธิ 2.8 ล้านบาท',
          'ค่าใช้จ่าย IT ลดลง 12%'
        ],
        wordCount: 0,
        pageCount: 15,
        language: 'th',
        aiModel: 'GPT-4',
        confidence: 89
      }
    },
    {
      id: '3',
      name: 'นโยบายการทำงานจากที่บ้าน.docx',
      type: 'word',
      size: 256000,
      uploadDate: new Date('2024-01-25T11:20:00'),
      lastModified: new Date('2024-01-25T11:20:00'),
      uploadedBy: 'คุณอนุชา',
      folderId: '3',
      tags: ['นโยบาย', 'WFH', 'HR'],
      status: 'processing',
      isStarred: false,
      isShared: false,
      permissions: 'private',
      version: 1
    }
  ];

  React.useEffect(() => {
    setFolders(mockFolders);
    setDocuments(mockDocuments);
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'word': return <FileText className="h-8 w-8 text-blue-500" />;
      case 'excel': return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      case 'powerpoint': return <FileText className="h-8 w-8 text-orange-500" />;
      case 'image': return <FileImage className="h-8 w-8 text-purple-500" />;
      case 'video': return <FileVideo className="h-8 w-8 text-pink-500" />;
      case 'audio': return <FileAudio className="h-8 w-8 text-yellow-500" />;
      default: return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Add document after upload complete
          const newDocument: Document = {
            id: fileId,
            name: file.name,
            type: getFileType(file.name),
            size: file.size,
            uploadDate: new Date(),
            lastModified: new Date(),
            uploadedBy: 'คุณ',
            folderId: selectedFolder || undefined,
            tags: [],
            status: 'processing',
            isStarred: false,
            isShared: false,
            permissions: 'private',
            version: 1
          };
          
          setDocuments(prev => [...prev, newDocument]);
          
          // Simulate processing
          setTimeout(() => {
            setDocuments(prev => prev.map(doc => 
              doc.id === fileId ? { ...doc, status: 'completed' } : doc
            ));
          }, 2000);
        }
        
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }, 200);
    });
  };

  const getFileType = (filename: string): Document['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'doc':
      case 'docx': return 'word';
      case 'xls':
      case 'xlsx': return 'excel';
      case 'ppt':
      case 'pptx': return 'powerpoint';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      case 'mp4':
      case 'avi':
      case 'mov': return 'video';
      case 'mp3':
      case 'wav': return 'audio';
      case 'txt': return 'text';
      default: return 'other';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesFolder = !selectedFolder || doc.folderId === selectedFolder;
    
    return matchesSearch && matchesType && matchesStatus && matchesFolder;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'delete':
        setDocuments(prev => prev.filter(doc => !selectedDocuments.includes(doc.id)));
        break;
      case 'star':
        setDocuments(prev => prev.map(doc => 
          selectedDocuments.includes(doc.id) ? { ...doc, isStarred: true } : doc
        ));
        break;
      case 'share':
        setDocuments(prev => prev.map(doc => 
          selectedDocuments.includes(doc.id) ? { ...doc, isShared: true } : doc
        ));
        break;
    }
    setSelectedDocuments([]);
    setShowBulkActions(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="h-7 w-7 mr-3 text-blue-600" />
              เอกสาร
            </h1>
            <p className="text-gray-600 text-sm mt-1">จัดการ วิเคราะห์ และสรุปเอกสารด้วย AI</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              โฟลเดอร์ใหม่
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              อัปโหลดไฟล์
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mt-4">
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">ทุกประเภท</option>
            <option value="pdf">PDF</option>
            <option value="word">Word</option>
            <option value="excel">Excel</option>
            <option value="powerpoint">PowerPoint</option>
            <option value="image">รูปภาพ</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="processing">กำลังประมวลผล</option>
            <option value="error">ข้อผิดพลาด</option>
            <option value="draft">ร่าง</option>
          </select>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDocuments.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-800">
              เลือกแล้ว {selectedDocuments.length} ไฟล์
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('star')}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
              >
                <Star className="h-4 w-4 mr-1 inline" />
                ติดดาว
              </button>
              <button
                onClick={() => handleBulkAction('share')}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                <Share2 className="h-4 w-4 mr-1 inline" />
                แชร์
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1 inline" />
                ลบ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Folders */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-2">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                !selectedFolder ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Folder className="h-5 w-5 mr-3" />
              <span>ทั้งหมด</span>
              <span className="ml-auto text-sm text-gray-500">
                {documents.length}
              </span>
            </button>

            <button
              className="w-full flex items-center px-3 py-2 text-left rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Star className="h-5 w-5 mr-3 text-yellow-500" />
              <span>ติดดาว</span>
              <span className="ml-auto text-sm text-gray-500">
                {documents.filter(d => d.isStarred).length}
              </span>
            </button>

            <button
              className="w-full flex items-center px-3 py-2 text-left rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="h-5 w-5 mr-3 text-green-500" />
              <span>แชร์แล้ว</span>
              <span className="ml-auto text-sm text-gray-500">
                {documents.filter(d => d.isShared).length}
              </span>
            </button>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">โฟลเดอร์</h3>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    selectedFolder === folder.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mr-3 ${folder.color}`} />
                  <span className="flex-1 truncate">{folder.name}</span>
                  <span className="text-sm text-gray-500">{folder.documentCount}</span>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">สถิติ</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ไฟล์ทั้งหมด</span>
                  <span className="font-medium">{documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ขนาดรวม</span>
                  <span className="font-medium">
                    {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วิเคราะห์แล้ว</span>
                  <span className="font-medium">
                    {documents.filter(d => d.status === 'completed').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Document Grid/List */}
          <div 
            className="flex-1 p-6 overflow-y-auto"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {dragOver && (
              <div className="fixed inset-0 bg-blue-500 bg-opacity-20 border-4 border-dashed border-blue-500 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                  <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-900">วางไฟล์ที่นี่</p>
                  <p className="text-gray-600">เพื่ออัปโหลดและวิเคราะห์ด้วย AI</p>
                </div>
              </div>
            )}

            {sortedDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีเอกสาร</h3>
                <p className="text-gray-600 mb-6">เริ่มต้นด้วยการอัปโหลดเอกสารแรกของคุณ</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  อัปโหลดไฟล์
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-2'}>
                {sortedDocuments.map((document) => (
                  <div
                    key={document.id}
                    className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer ${
                      selectedDocuments.includes(document.id) ? 'ring-2 ring-blue-500' : ''
                    } ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'}`}
                    onClick={() => setSelectedDocument(document)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(document.type)}
                            <input
                              type="checkbox"
                              checked={selectedDocuments.includes(document.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleDocumentSelect(document.id);
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex items-center space-x-1">
                            {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            {document.isShared && <Share2 className="h-4 w-4 text-green-500" />}
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{document.name}</h3>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <span>{formatFileSize(document.size)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                            {document.status === 'completed' ? 'เสร็จสิ้น' : 
                             document.status === 'processing' ? 'กำลังประมวลผล' : 
                             document.status === 'error' ? 'ข้อผิดพลาด' : 'ร่าง'}
                          </span>
                        </div>

                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <User className="h-3 w-3 mr-1" />
                          <span className="mr-3">{document.uploadedBy}</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{document.uploadDate.toLocaleDateString('th-TH')}</span>
                        </div>

                        {document.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {document.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                            {document.tags.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{document.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {document.summary && (
                          <p className="text-sm text-gray-600 line-clamp-2">{document.summary.overview}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.includes(document.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleDocumentSelect(document.id);
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          {getFileIcon(document.type)}
                        </div>

                        <div className="flex-1 min-w-0 mx-4">
                          <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{formatFileSize(document.size)}</span>
                            <span>{document.uploadedBy}</span>
                            <span>{document.uploadDate.toLocaleDateString('th-TH')}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                            {document.status === 'completed' ? 'เสร็จสิ้น' : 
                             document.status === 'processing' ? 'กำลังประมวลผล' : 
                             document.status === 'error' ? 'ข้อผิดพลาด' : 'ร่าง'}
                          </span>
                          {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          {document.isShared && <Share2 className="h-4 w-4 text-green-500" />}
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Document Detail Sidebar */}
        {selectedDocument && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">รายละเอียดเอกสาร</h2>
                <button 
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Document Info */}
                <div className="text-center">
                  <div className="mb-4">
                    {getFileIcon(selectedDocument.type)}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{selectedDocument.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>ขนาด:</span>
                      <span>{formatFileSize(selectedDocument.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>อัปโหลดโดย:</span>
                      <span>{selectedDocument.uploadedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>วันที่อัปโหลด:</span>
                      <span>{selectedDocument.uploadDate.toLocaleDateString('th-TH')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>เวอร์ชัน:</span>
                      <span>v{selectedDocument.version}</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDocument.status)}`}>
                    {selectedDocument.status === 'completed' ? 'เสร็จสิ้น' : 
                     selectedDocument.status === 'processing' ? 'กำลังประมวลผล' : 
                     selectedDocument.status === 'error' ? 'ข้อผิดพลาด' : 'ร่าง'}
                  </span>
                </div>

                {/* Tags */}
                {selectedDocument.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">แท็ก</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDocument.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                {selectedDocument.summary && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-purple-600" />
                      สรุปด้วย AI
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {selectedDocument.summary.confidence}% แม่นยำ
                      </span>
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-1">ภาพรวม</h5>
                        <p className="text-sm text-gray-600">{selectedDocument.summary.overview}</p>
                      </div>
                      
                      {selectedDocument.summary.keyPoints.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-2">ประเด็นสำคัญ</h5>
                          <ul className="space-y-1">
                            {selectedDocument.summary.keyPoints.map((point, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-600">จำนวนคำ:</span>
                          <span className="ml-1 font-medium">{selectedDocument.summary.wordCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">จำนวนหน้า:</span>
                          <span className="ml-1 font-medium">{selectedDocument.summary.pageCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">ภาษา:</span>
                          <span className="ml-1 font-medium">{selectedDocument.summary.language === 'th' ? 'ไทย' : 'อังกฤษ'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">AI Model:</span>
                          <span className="ml-1 font-medium">{selectedDocument.summary.aiModel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Document Analysis */}
                {selectedDocument.analysis && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-green-600" />
                      การวิเคราะห์เอกสาร
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-600">ความรู้สึก:</span>
                          <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                            selectedDocument.analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                            selectedDocument.analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedDocument.analysis.sentiment === 'positive' ? 'เชิงบวก' :
                             selectedDocument.analysis.sentiment === 'negative' ? 'เชิงลบ' : 'เป็นกลาง'}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">ความซับซ้อน:</span>
                          <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                            selectedDocument.analysis.complexity === 'high' ? 'bg-red-100 text-red-800' :
                            selectedDocument.analysis.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {selectedDocument.analysis.complexity === 'high' ? 'สูง' :
                             selectedDocument.analysis.complexity === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-gray-600">คะแนนอ่านง่าย:</span>
                        <div className="mt-1 flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${selectedDocument.analysis.readabilityScore}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm font-medium">{selectedDocument.analysis.readabilityScore}/100</span>
                        </div>
                      </div>

                      {selectedDocument.analysis.topics.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-2">หัวข้อหลัก</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedDocument.analysis.topics.map((topic, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedDocument.analysis.recommendations.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            ข้อเสนอแนะ
                          </h5>
                          <ul className="space-y-1">
                            {selectedDocument.analysis.recommendations.map((rec, index) => (
                              <li key={index} className="text-xs text-gray-600 flex items-start">
                                <span className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">การดำเนินการ</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      <Eye className="h-4 w-4 mr-2" />
                      ดู
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      ดาวน์โหลด
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      แชร์
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      แก้ไข
                    </button>
                  </div>
                </div>

                {/* AI Actions */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-600" />
                    AI Actions
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm">
                      <Brain className="h-4 w-4 mr-2" />
                      สรุปใหม่ด้วย AI อื่น
                    </button>
                    <button className="w-full flex items-center px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                      <Shield className="h-4 w-4 mr-2" />
                      ตรวจสอบด้วย Typhoon
                    </button>
                    <button className="w-full flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                      <Target className="h-4 w-4 mr-2" />
                      สกัดงานที่ต้องทำ
                    </button>
                    <button className="w-full flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      สนทนาเกี่ยวกับเอกสาร
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">อัปโหลดเอกสาร</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(Array.from(e.target.files));
                    }
                  }}
                />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">ลากไฟล์มาวางที่นี่</p>
                <p className="text-gray-600 mb-4">หรือคลิกเพื่อเลือกไฟล์</p>
                <p className="text-sm text-gray-500">รองรับ PDF, Word, Excel, PowerPoint, รูปภาพ และอื่นๆ</p>
              </div>

              {/* Processing Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">ตัวเลือกการประมวลผล</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">สรุปเอกสารด้วย AI</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">วิเคราะห์เนื้อหา</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">สกัดข้อมูลสำคัญ</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">ตรวจสอบการคัดลอก</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">การตั้งค่า</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">โฟลเดอร์</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">เลือกโฟลเดอร์</option>
                        {folders.map(folder => (
                          <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">สิทธิ์การเข้าถึง</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="private">ส่วนตัว</option>
                        <option value="team">ทีม</option>
                        <option value="public">สาธารณะ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">แท็ก</label>
                      <input 
                        type="text" 
                        placeholder="เพิ่มแท็ก (คั่นด้วยเครื่องหมายจุลภาค)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Estimate */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">ประมาณการค่าใช้จ่าย</h4>
                <div className="space-y-1 text-xs text-blue-700">
                  <div className="flex justify-between">
                    <span>การสรุปเอกสาร (1 ไฟล์)</span>
                    <span>฿5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>การวิเคราะห์เนื้อหา</span>
                    <span>฿3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>การสกัดข้อมูล</span>
                    <span>฿2</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-blue-200 pt-1">
                    <span>รวม (ต่อไฟล์)</span>
                    <span>฿10</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  เริ่มอัปโหลด
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