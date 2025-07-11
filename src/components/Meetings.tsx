import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, MicOff, Play, Pause, Square, Upload, Download, FileText, Users, Calendar, Clock, CheckCircle, AlertCircle, Edit3, Save, X, Plus, Trash2, Eye, EyeOff, Volume2, VolumeX, RotateCcw, FastForward, Rewind, Settings, Share2, Copy, Star, Flag, MessageSquare, Target, User, Building, Phone, Headphones, AudioWaveform as Waveform, Brain, Zap, Shield, Award, TrendingUp, Filter, Search, MoreHorizontal, ChevronDown, ChevronUp, ExternalLink, Lightbulb, BookOpen, Archive } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  duration: number;
  participants: Participant[];
  status: 'recording' | 'processing' | 'completed' | 'draft';
  audioFile?: string;
  transcript?: TranscriptSegment[];
  summary?: MeetingSummary;
  actionItems?: ActionItem[];
  tags: string[];
  type: 'internal' | 'client' | 'board' | 'training' | 'other';
}

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  speakingTime: number;
  isHost: boolean;
}

interface TranscriptSegment {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
  confidence: number;
  isEdited: boolean;
  isUnclear: boolean;
}

interface MeetingSummary {
  overview: string;
  keyPoints: string[];
  decisions: string[];
  nextSteps: string[];
  aiModel: string;
  confidence: number;
}

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
}

const Meetings: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'live' | 'upload' | 'history'>('live');
  const [editingSegment, setEditingSegment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showTranscript, setShowTranscript] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data
  const mockMeetings: Meeting[] = [
    {
      id: '1',
      title: 'การประชุมคณะกรรมการ Q4 2024',
      date: new Date('2024-01-15T14:00:00'),
      duration: 3600,
      participants: [
        { id: '1', name: 'คุณสมชาย', role: 'ประธาน', speakingTime: 1200, isHost: true },
        { id: '2', name: 'คุณปัทมา', role: 'เลขานุการ', speakingTime: 800, isHost: false },
        { id: '3', name: 'คุณอนุชา', role: 'กรรมการ', speakingTime: 600, isHost: false }
      ],
      status: 'completed',
      tags: ['Q4', 'งบประมาณ', 'กลยุทธ์'],
      type: 'board',
      summary: {
        overview: 'การประชุมเพื่อทบทวนผลการดำเนินงานไตรมาส 4 และวางแผนกลยุทธ์ปี 2025',
        keyPoints: [
          'รายได้เพิ่มขึ้น 15% เมื่อเทียบกับปีที่แล้ว',
          'ต้องปรับปรุงระบบ IT ให้ทันสมัยมากขึ้น',
          'ขยายทีมการตลาดดิจิทัลในปี 2025'
        ],
        decisions: [
          'อนุมัติงบประมาณ IT 5 ล้านบาท',
          'จัดตั้งแผนก Digital Marketing',
          'เริ่มโครงการ AI Implementation'
        ],
        nextSteps: [
          'จัดทำแผนการใช้งบประมาณ IT',
          'สรรหาหัวหน้าแผนก Digital Marketing',
          'ศึกษาความเป็นไปได้ของ AI'
        ],
        aiModel: 'Claude 3.5 Sonnet',
        confidence: 92
      },
      actionItems: [
        {
          id: '1',
          task: 'จัดทำแผนการใช้งบประมาณ IT',
          assignee: 'คุณอนุชา',
          dueDate: new Date('2024-02-01'),
          priority: 'high',
          status: 'pending',
          category: 'IT'
        },
        {
          id: '2',
          task: 'สรรหาหัวหน้าแผนก Digital Marketing',
          assignee: 'คุณปัทมา',
          dueDate: new Date('2024-02-15'),
          priority: 'medium',
          status: 'in-progress',
          category: 'HR'
        }
      ]
    }
  ];

  const mockTranscript: TranscriptSegment[] = [
    {
      id: '1',
      speaker: 'คุณสมชาย',
      text: 'สวัสดีครับทุกท่าน วันนี้เราจะมาประชุมเรื่องผลการดำเนินงานไตรมาส 4',
      timestamp: 0,
      confidence: 95,
      isEdited: false,
      isUnclear: false
    },
    {
      id: '2',
      speaker: 'คุณปัทมา',
      text: '[ไม่ชัดเจน] รายได้ของเราในไตรมาสนี้...',
      timestamp: 30,
      confidence: 45,
      isEdited: false,
      isUnclear: true
    },
    {
      id: '3',
      speaker: 'คุณอนุชา',
      text: 'ผมคิดว่าเราควรลงทุนในระบบ IT ใหม่ เพื่อเพิ่มประสิทธิภาพการทำงาน',
      timestamp: 120,
      confidence: 88,
      isEdited: false,
      isUnclear: false
    }
  ];

  useEffect(() => {
    setMeetings(mockMeetings);
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Create new meeting
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        title: `การประชุม ${new Date().toLocaleDateString('th-TH')}`,
        date: new Date(),
        duration: 0,
        participants: [],
        status: 'recording',
        tags: [],
        type: 'internal'
      };
      setCurrentMeeting(newMeeting);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (currentMeeting) {
        const updatedMeeting = {
          ...currentMeeting,
          duration: recordingTime,
          status: 'processing' as const
        };
        setMeetings(prev => [...prev, updatedMeeting]);
        
        // Simulate processing
        setTimeout(() => {
          setMeetings(prev => prev.map(m => 
            m.id === updatedMeeting.id 
              ? { ...m, status: 'completed', transcript: mockTranscript }
              : m
          ));
        }, 3000);
      }
      
      setCurrentMeeting(null);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEditSegment = (segment: TranscriptSegment) => {
    setEditingSegment(segment.id);
    setEditText(segment.text);
  };

  const saveEditSegment = (segmentId: string) => {
    if (selectedMeeting && selectedMeeting.transcript) {
      const updatedTranscript = selectedMeeting.transcript.map(segment =>
        segment.id === segmentId
          ? { ...segment, text: editText, isEdited: true, isUnclear: false }
          : segment
      );
      
      const updatedMeeting = {
        ...selectedMeeting,
        transcript: updatedTranscript
      };
      
      setSelectedMeeting(updatedMeeting);
      setMeetings(prev => prev.map(m => m.id === selectedMeeting.id ? updatedMeeting : m));
    }
    
    setEditingSegment(null);
    setEditText('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'board': return <Building className="h-4 w-4" />;
      case 'client': return <Users className="h-4 w-4" />;
      case 'training': return <BookOpen className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesStatus = filterStatus === 'all' || meeting.status === filterStatus;
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Video className="h-7 w-7 mr-3 text-blue-600" />
              ประชุม
            </h1>
            <p className="text-gray-600 text-sm mt-1">บันทึก ถอดเสียง และสรุปการประชุมด้วย AI</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'live', label: 'บันทึกสด', icon: Mic },
            { id: 'upload', label: 'อัปโหลดไฟล์', icon: Upload },
            { id: 'history', label: 'ประวัติการประชุม', icon: Archive }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab.id
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
      <div className="flex-1 overflow-hidden">
        {selectedTab === 'live' && (
          <div className="h-full flex">
            {/* Recording Panel */}
            <div className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                {/* Recording Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
                  <div className="text-center">
                    <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 ${
                      isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
                    }`}>
                      <Mic className={`h-16 w-16 ${isRecording ? 'text-red-600' : 'text-gray-400'}`} />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isRecording ? 'กำลังบันทึก...' : 'พร้อมบันทึกการประชุม'}
                    </h2>
                    
                    {isRecording && (
                      <div className="text-3xl font-mono text-red-600 mb-4">
                        {formatTime(recordingTime)}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center space-x-4">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center"
                        >
                          <Mic className="h-5 w-5 mr-2" />
                          เริ่มบันทึก
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={pauseRecording}
                            className={`px-6 py-3 rounded-xl font-semibold transition-colors flex items-center ${
                              isPaused 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'bg-yellow-600 text-white hover:bg-yellow-700'
                            }`}
                          >
                            {isPaused ? <Play className="h-5 w-5 mr-2" /> : <Pause className="h-5 w-5 mr-2" />}
                            {isPaused ? 'ดำเนินการต่อ' : 'หยุดชั่วคราว'}
                          </button>
                          <button
                            onClick={stopRecording}
                            className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center"
                          >
                            <Square className="h-5 w-5 mr-2" />
                            หยุดบันทึก
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Transcript */}
                {isRecording && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Waveform className="h-5 w-5 mr-2 text-blue-600" />
                      การถอดเสียงแบบเรียลไทม์
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">ผู้พูดที่ 1</span>
                          <span className="text-xs text-blue-600">{formatTime(recordingTime - 10)}</span>
                        </div>
                        <p className="text-gray-700">สวัสดีครับทุกท่าน วันนี้เราจะมาประชุมเรื่อง...</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-800">ผู้พูดที่ 2</span>
                          <span className="text-xs text-gray-600">{formatTime(recordingTime - 5)}</span>
                        </div>
                        <p className="text-gray-700 animate-pulse">กำลังถอดเสียง...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recording Settings Sidebar */}
            <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">การตั้งค่า</h3>
              
              <div className="space-y-6">
                {/* Meeting Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อการประชุม</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ระบุชื่อการประชุม"
                    value={currentMeeting?.title || ''}
                    onChange={(e) => setCurrentMeeting(prev => prev ? {...prev, title: e.target.value} : null)}
                  />
                </div>

                {/* Meeting Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทการประชุม</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="internal">ประชุมภายใน</option>
                    <option value="client">ประชุมลูกค้า</option>
                    <option value="board">ประชุมคณะกรรมการ</option>
                    <option value="training">อบรม/สัมมนา</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>

                {/* Audio Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คุณภาพเสียง</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="high">สูง (ใช้เครดิตมาก)</option>
                    <option value="medium">ปานกลาง (แนะนำ)</option>
                    <option value="low">ต่ำ (ประหยัดเครดิต)</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ภาษา</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="th">ไทย</option>
                    <option value="en">อังกฤษ</option>
                    <option value="auto">ตรวจจับอัตโนมัติ</option>
                  </select>
                </div>

                {/* Auto Summary */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">สรุปอัตโนมัติ</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>

                {/* Cost Estimate */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">ประมาณการค่าใช้จ่าย</h4>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div className="flex justify-between">
                      <span>การถอดเสียง (1 ชม.)</span>
                      <span>฿12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>การสรุป AI</span>
                      <span>฿8</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-blue-200 pt-1">
                      <span>รวม</span>
                      <span>฿20</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'upload' && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* Upload Area */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
                <div className="text-center">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">อัปโหลดไฟล์เสียงการประชุม</h2>
                  <p className="text-gray-600 mb-6">รองรับไฟล์ MP3, WAV, M4A ขนาดสูงสุด 500MB</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors cursor-pointer">
                    <input type="file" className="hidden" accept="audio/*" />
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-gray-600">ลากไฟล์มาวางที่นี่ หรือ <span className="text-blue-600 font-medium">เลือกไฟล์</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    ตัวเลือกการประมวลผล
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">ถอดเสียงเป็นข้อความ</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">สรุปการประชุม</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">สกัดงานที่ต้องทำ</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">ระบุผู้พูด</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                    AI Models
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Whisper (OpenAI)</span>
                        <span className="text-xs text-green-600">แนะนำ</span>
                      </div>
                      <p className="text-xs text-gray-600">เหมาะสำหรับภาษาไทย ความแม่นยำสูง</p>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Claude 3.5 Sonnet</span>
                        <span className="text-xs text-blue-600">สรุป</span>
                      </div>
                      <p className="text-xs text-gray-600">สำหรับสรุปและวิเคราะห์เนื้อหา</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'history' && (
          <div className="h-full flex">
            {/* Meeting List */}
            <div className="flex-1 p-6">
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาการประชุม..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="processing">กำลังประมวลผล</option>
                  <option value="draft">ร่าง</option>
                </select>
              </div>

              {/* Meeting Cards */}
              <div className="space-y-4">
                {filteredMeetings.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getMeetingTypeIcon(meeting.type)}
                            <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                            {meeting.status === 'completed' ? 'เสร็จสิ้น' : 
                             meeting.status === 'processing' ? 'กำลังประมวลผล' : 
                             meeting.status === 'recording' ? 'กำลังบันทึก' : 'ร่าง'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {meeting.date.toLocaleDateString('th-TH')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(meeting.duration)}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {meeting.participants.length} คน
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          {meeting.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {meeting.summary && (
                          <p className="text-sm text-gray-600 line-clamp-2">{meeting.summary.overview}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Detail Sidebar */}
            {selectedMeeting && (
              <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">รายละเอียดการประชุม</h2>
                    <button 
                      onClick={() => setSelectedMeeting(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Meeting Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedMeeting.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {selectedMeeting.date.toLocaleDateString('th-TH', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(selectedMeeting.duration)}
                        </div>
                      </div>
                    </div>

                    {/* Participants */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">ผู้เข้าร่วม ({selectedMeeting.participants.length})</h4>
                      <div className="space-y-2">
                        {selectedMeeting.participants.map((participant) => (
                          <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                                <p className="text-xs text-gray-600">{participant.role}</p>
                              </div>
                            </div>
                            {participant.isHost && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">ประธาน</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    {selectedMeeting.summary && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <Brain className="h-4 w-4 mr-2 text-purple-600" />
                          สรุปการประชุม
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {selectedMeeting.summary.confidence}% แม่นยำ
                          </span>
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-xs font-medium text-gray-700 mb-1">ภาพรวม</h5>
                            <p className="text-sm text-gray-600">{selectedMeeting.summary.overview}</p>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-medium text-gray-700 mb-2">ประเด็นสำคัญ</h5>
                            <ul className="space-y-1">
                              {selectedMeeting.summary.keyPoints.map((point, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-xs font-medium text-gray-700 mb-2">การตัดสินใจ</h5>
                            <ul className="space-y-1">
                              {selectedMeeting.summary.decisions.map((decision, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                  {decision}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Items */}
                    {selectedMeeting.actionItems && selectedMeeting.actionItems.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <Target className="h-4 w-4 mr-2 text-orange-600" />
                          งานที่ต้องทำ ({selectedMeeting.actionItems.length})
                        </h4>
                        <div className="space-y-3">
                          {selectedMeeting.actionItems.map((item) => (
                            <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <p className="text-sm font-medium text-gray-900">{item.task}</p>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                                  {item.priority === 'high' ? 'สูง' : item.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>ผู้รับผิดชอบ: {item.assignee}</span>
                                <span>ครบกำหนด: {item.dueDate.toLocaleDateString('th-TH')}</span>
                              </div>
                              <div className="mt-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                  {item.status === 'completed' ? 'เสร็จสิ้น' : 
                                   item.status === 'in-progress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transcript Toggle */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />
                        บันทึกการสนทนา
                      </h4>
                      <button 
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {showTranscript ? 'ซ่อน' : 'แสดง'}
                      </button>
                    </div>

                    {/* Transcript */}
                    {showTranscript && selectedMeeting.transcript && (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedMeeting.transcript.map((segment) => (
                          <div key={segment.id} className={`p-3 rounded-lg ${
                            segment.isUnclear ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-700">{segment.speaker}</span>
                                <span className="text-xs text-gray-500">{formatTime(segment.timestamp)}</span>
                                {segment.isUnclear && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    ไม่ชัดเจน
                                  </span>
                                )}
                                {segment.isEdited && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    แก้ไขแล้ว
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">{segment.confidence}%</span>
                                <button 
                                  onClick={() => handleEditSegment(segment)}
                                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            
                            {editingSegment === segment.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={3}
                                />
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => saveEditSegment(segment.id)}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                                  >
                                    บันทึก
                                  </button>
                                  <button 
                                    onClick={() => setEditingSegment(null)}
                                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-400"
                                  >
                                    ยกเลิก
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-700">{segment.text}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Export Options */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">ส่งออกข้อมูล</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Word
                        </button>
                        <button className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          แชร์
                        </button>
                        <button className="flex items-center justify-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                          <Shield className="h-4 w-4 mr-2" />
                          ตรวจสอบ
                        </button>
                        <button className="flex items-center justify-center px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                          <Download className="h-4 w-4 mr-2" />
                          ดาวน์โหลด
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;