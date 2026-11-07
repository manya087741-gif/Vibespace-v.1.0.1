import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Camera, Image as ImageIcon, Type, Sparkles, Music, 
  Smile, Download, Send, RefreshCw, Volume2, VolumeX, 
  Check, Lock, Users, AlertCircle, Palette, RotateCw, 
  Sliders, Plus, Play, Pause, ChevronLeft, MapPin, AtSign, Hash
} from 'lucide-react';
import { User, Story, StorySticker } from '../types';
import { CURRENT_USER, MOCK_USERS } from '../data/mockData';
import { sound } from '../utils/audioSynth';

interface StoryCreatorProps {
  onClose: () => void;
  onPublishStory: (newStory: Story) => void;
}

const PRESET_BACKGROUNDS = [
  { id: 'p1', name: 'Cyberpunk Studio', url: '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg', type: 'image' },
  { id: 'p2', name: 'Golden Hour', url: '/src/assets/images/vibespace_story_portrait_1793677134555.jpg', type: 'image' },
  { id: 'p3', name: 'Tokyo Neon', url: '/src/assets/images/vibespace_reel_tokyo_1793677134321.jpg', type: 'video' },
  { id: 'p4', name: 'Architectural Minimal', url: '/src/assets/images/vibespace_feed_design_1793677137017.jpg', type: 'image' },
  { id: 'p5', name: 'Deep Space Violet', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80', type: 'image' },
  { id: 'p6', name: 'Emerald Mirage', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', type: 'image' },
];

const GRADIENTS = [
  'from-violet-900 via-purple-900 to-indigo-950',
  'from-rose-900 via-pink-900 to-slate-950',
  'from-emerald-900 via-teal-900 to-slate-950',
  'from-amber-700 via-orange-900 to-slate-950',
  'from-cyan-900 via-blue-900 to-slate-950',
  'from-fuchsia-950 via-purple-950 to-black',
  'from-slate-900 via-slate-800 to-black',
  'from-red-950 via-zinc-900 to-black',
];

const TEXT_COLORS = [
  '#ffffff', '#000000', '#a855f7', '#ec4899', '#10b981', 
  '#3b82f6', '#f59e0b', '#06b6d4', '#e11d48', '#84cc16'
];

const FONTS: { id: 'classic' | 'modern' | 'neon' | 'typewriter' | 'strong'; label: string; className: string }[] = [
  { id: 'modern', label: 'Modern', className: 'font-sans font-bold tracking-tight' },
  { id: 'neon', label: 'Neon Script', className: 'font-serif italic font-semibold' },
  { id: 'typewriter', label: 'Typewriter', className: 'font-mono tracking-wide' },
  { id: 'strong', label: 'Strong', className: 'font-black uppercase tracking-wider' },
  { id: 'classic', label: 'Classic', className: 'font-serif tracking-normal' },
];

const FILTERS = [
  { id: 'none', label: 'Normal', css: '' },
  { id: 'cyberpunk', label: 'Cyberpunk', css: 'hue-rotate-[290deg] contrast-125 saturate-150' },
  { id: 'golden', label: 'Golden Hour', css: 'sepia-[0.35] brightness-105 saturate-125' },
  { id: 'vhs', label: 'VHS Glitch', css: 'contrast-125 brightness-110 saturate-150' },
  { id: 'noir', label: 'Noir (B&W)', css: 'grayscale contrast-150' },
  { id: 'emerald', label: 'Emerald Dream', css: 'hue-rotate-90 saturate-125' },
  { id: 'retro', label: 'Retro 90s', css: 'sepia-[0.2] contrast-115' },
];

const MUSIC_TRACKS = [
  { title: 'Neon Skyline', artist: 'Aria Thorne', genre: 'Synthwave' },
  { title: 'Midnight City Beats', artist: 'M83 Resonance', genre: 'Chillwave' },
  { title: 'Tokyo Hyper-Drive', artist: 'Kavinsky Drift', genre: 'Electro' },
  { title: 'Emerald Mirage', artist: 'Tycho Ambient', genre: 'Lo-Fi' },
  { title: 'Liquid Cyberpunk', artist: 'Cyberpunk 2077 OST', genre: 'Darkwave' },
];

export const StoryCreator: React.FC<StoryCreatorProps> = ({ onClose, onPublishStory }) => {
  // Mode: 'camera' | 'gallery' | 'text'
  const [mode, setMode] = useState<'camera' | 'gallery' | 'text'>('camera');
  
  // Media state
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>(PRESET_BACKGROUNDS[0].url);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'text'>('image');
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [rotation, setRotation] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Camera state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Text mode state
  const [textContent, setTextContent] = useState<string>('Share a thought with your friends...');
  const [textGradientIdx, setTextGradientIdx] = useState<number>(0);
  const [activeFontIdx, setActiveFontIdx] = useState<number>(0);
  const [activeTextColor, setActiveTextColor] = useState<string>('#ffffff');
  const [textHighlight, setTextHighlight] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(24);

  // Tools drawer: null | 'text' | 'stickers' | 'drawing' | 'filters' | 'music' | 'privacy'
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Interactive Stickers on story
  const [stickers, setStickers] = useState<StorySticker[]>([]);
  
  // Drawing Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawColor, setDrawColor] = useState<string>('#a855f7');
  const [drawSize, setDrawSize] = useState<number>(5);
  const [drawMode, setDrawMode] = useState<'pen' | 'neon' | 'highlighter' | 'eraser'>('pen');
  const [hasDrawings, setHasDrawings] = useState<boolean>(false);

  // Audio track
  const [selectedMusic, setSelectedMusic] = useState<{ title: string; artist: string } | null>(null);

  // Privacy audience
  const [audience, setAudience] = useState<'public' | 'close_friends'>('public');
  const [hiddenUsers, setHiddenUsers] = useState<string[]>([]);
  const [showHideUsersModal, setShowHideUsersModal] = useState<boolean>(false);

  // Sticker creation sub-modal
  const [stickerTypeToCreate, setStickerTypeToCreate] = useState<string | null>(null);
  const [stickerInputs, setStickerInputs] = useState<any>({});

  // File input ref for gallery upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Camera when in camera mode
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, cameraFacing]);

  const startCamera = async () => {
    try {
      stopCamera();
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing, width: { ideal: 720 }, height: { ideal: 1280 } },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      }
    } catch {
      // Camera permission denied or not available; fallback to simulated camera view
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCapturePhoto = () => {
    sound.playShutter();
    if (videoRef.current && cameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 720;
      canvas.height = videoRef.current.videoHeight || 1280;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setSelectedMediaUrl(dataUrl);
        setMediaType('image');
        stopCamera();
        setMode('gallery');
      }
    } else {
      // Simulate snapshot from active preset
      setSelectedMediaUrl(PRESET_BACKGROUNDS[0].url);
      setMediaType('image');
      setMode('gallery');
    }
  };

  const handleStartRecordVideo = () => {
    sound.playHeartPop();
    setIsRecordingVideo(true);
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 15) {
          clearInterval(interval);
          handleStopRecordVideo();
          return 15;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecordVideo = () => {
    sound.playHeartPop();
    setIsRecordingVideo(false);
    setSelectedMediaUrl(PRESET_BACKGROUNDS[2].url);
    setMediaType('video');
    stopCamera();
    setMode('gallery');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playSparkle();
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedMediaUrl(event.target.result as string);
          setMediaType(isVideo ? 'video' : 'image');
          stopCamera();
          setMode('gallery');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drawing Canvas Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawings(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = drawSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (drawMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.shadowBlur = 0;
    } else if (drawMode === 'neon') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = drawColor;
    } else if (drawMode === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawColor + '80'; // 50% opacity
      ctx.shadowBlur = 0;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawColor;
      ctx.shadowBlur = 0;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawings(false);
      sound.playHeartPop();
    }
  };

  // Sticker Creation Handler
  const handleAddSticker = (type: string) => {
    sound.playSparkle();
    if (type === 'poll') {
      const newSticker: StorySticker = {
        id: 'stk_' + Math.random().toString(36).substring(2, 9),
        type: 'poll',
        x: 50,
        y: 45,
        data: {
          question: stickerInputs.pollQuestion || 'Ask a question...',
          options: [
            { id: 'opt_1', text: stickerInputs.opt1 || 'Yes 🔥', votes: 0 },
            { id: 'opt_2', text: stickerInputs.opt2 || 'No 👎', votes: 0 },
          ],
          totalVotes: 0,
        },
      };
      setStickers((prev) => [...prev, newSticker]);
    } else if (type === 'question') {
      const newSticker: StorySticker = {
        id: 'stk_' + Math.random().toString(36).substring(2, 9),
        type: 'question',
        x: 50,
        y: 50,
        data: {
          question: stickerInputs.questionText || 'Ask me a question',
        },
      };
      setStickers((prev) => [...prev, newSticker]);
    } else if (type === 'quiz') {
      const newSticker: StorySticker = {
        id: 'stk_' + Math.random().toString(36).substring(2, 9),
        type: 'quiz',
        x: 50,
        y: 50,
        data: {
          question: stickerInputs.quizQuestion || 'Guess the right answer!',
          options: [
            { id: 'q_1', text: stickerInputs.qOpt1 || 'Option A', isCorrect: true },
            { id: 'q_2', text: stickerInputs.qOpt2 || 'Option B', isCorrect: false },
            { id: 'q_3', text: stickerInputs.qOpt3 || 'Option C', isCorrect: false },
          ],
        },
      };
      setStickers((prev) => [...prev, newSticker]);
    } else if (type === 'countdown') {
      const newSticker: StorySticker = {
        id: 'stk_' + Math.random().toString(36).substring(2, 9),
        type: 'countdown',
        x: 50,
        y: 40,
        data: {
          title: stickerInputs.countdownTitle || 'Special Event 🎉',
          targetDate: stickerInputs.countdownDate || '2026-12-31T00:00:00',
        },
      };
      setStickers((prev) => [...prev, newSticker]);
    } else if (type === 'link') {
      const newSticker: StorySticker = {
        id: 'stk_' + Math.random().toString(36).substring(2, 9),
        type: 'link',
        x: 50,
        y: 75,
        data: {
          title: stickerInputs.linkText || 'Visit Link',
          url: stickerInputs.linkUrl || 'https://vibespace.dev',
        },
      };
      setStickers((prev) => [...prev, newSticker]);
    } else if (type === 'location') {
      const newSticker: StorySticker = {
        id: 'stk_' + Math.random().toString(36).substring(2, 9),
        type: 'location',
        x: 50,
        y: 75,
        data: {
          locationName: stickerInputs.locationName || 'Tokyo, Japan ⛩️',
        },
      };
      setStickers((prev) => [...prev, newSticker]);
    } else if (type === 'mention') {
      const newSticker: StorySticker = {
        id: 'stk_' + Math.random().toString(36).substring(2, 9),
        type: 'mention',
        x: 50,
        y: 80,
        data: {
          tag: stickerInputs.mentionUser || 'elena_design',
        },
      };
      setStickers((prev) => [...prev, newSticker]);
    } else if (type === 'hashtag') {
      const newSticker: StorySticker = {
        id: 'stk_' + Math.random().toString(36).substring(2, 9),
        type: 'hashtag',
        x: 50,
        y: 80,
        data: {
          tag: stickerInputs.hashtag || 'VibeSpace',
        },
      };
      setStickers((prev) => [...prev, newSticker]);
    } else if (type === 'emoji') {
      const newSticker: StorySticker = {
        id: 'stk_' + Math.random().toString(36).substring(2, 9),
        type: 'emoji',
        x: 50,
        y: 50,
        data: {
          emoji: stickerInputs.selectedEmoji || '🔥',
        },
      };
      setStickers((prev) => [...prev, newSticker]);
    }
    setStickerTypeToCreate(null);
    setActiveTool(null);
  };

  const removeSticker = (id: string) => {
    sound.playHeartPop();
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // Publish / Share Story
  const handlePublish = () => {
    sound.playSparkle();
    
    // Grab drawings data url if any
    let drawingsUrl: string | undefined = undefined;
    if (hasDrawings && canvasRef.current) {
      drawingsUrl = canvasRef.current.toDataURL('image/png');
    }

    const newStory: Story = {
      id: 'st_usr_' + Date.now().toString(36),
      user: CURRENT_USER,
      mediaUrl: mode === 'text' ? '' : selectedMediaUrl,
      mediaType: mode === 'text' ? 'text' : mediaType,
      textContent: mode === 'text' ? textContent : undefined,
      backgroundGradient: mode === 'text' ? GRADIENTS[textGradientIdx] : undefined,
      fontStyle: FONTS[activeFontIdx].id,
      textColor: activeTextColor,
      textHighlight: textHighlight,
      timestamp: 'Just now',
      createdAt: Date.now(),
      expiresIn: '24h',
      isCloseFriends: audience === 'close_friends',
      hiddenFromUsers: hiddenUsers,
      viewersCount: 0,
      viewsPrevented: 0,
      filter: activeFilter,
      isMuted: isMuted,
      audioTrack: selectedMusic ? selectedMusic : undefined,
      stickers: stickers,
      drawingsDataUrl: drawingsUrl,
      viewers: [],
      insights: {
        impressions: 1,
        reach: 1,
        forwardTaps: 0,
        backTaps: 0,
        exits: 0,
        replies: 0,
        shares: 0,
      },
      likesCount: 0,
      hasLiked: false,
    };

    onPublishStory(newStory);
    onClose();
  };

  const handleDownloadDraft = () => {
    sound.playSparkle();
    // Simulate downloading story image
    const link = document.createElement('a');
    link.download = `vibespace_story_${Date.now()}.jpg`;
    link.href = selectedMediaUrl || PRESET_BACKGROUNDS[0].url;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full md:h-[92vh] md:max-h-[850px] md:rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-slate-800">
        
        {/* TOP TOOLBAR */}
        <div className="relative z-40 p-3 pt-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <button
            onClick={() => {
              sound.playHeartPop();
              onClose();
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            title="Discard Story"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Center Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
            <button
              onClick={() => {
                sound.playHeartPop();
                setMode('camera');
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                mode === 'camera' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Camera
            </button>
            <button
              onClick={() => {
                sound.playHeartPop();
                setMode('gallery');
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                mode === 'gallery' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => {
                sound.playHeartPop();
                setMode('text');
                stopCamera();
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                mode === 'text' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Text (Aa)
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* Audio Mute Toggle */}
            <button
              onClick={() => {
                sound.playHeartPop();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Save / Download */}
            <button
              onClick={handleDownloadDraft}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md"
              title="Save to Gallery"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECONDARY FLOATING EDIT TOOLBAR (Text, Stickers, Drawing, Filters, Music) */}
        <div className="absolute top-16 right-3 z-40 flex flex-col gap-2.5">
          {/* Text Tool */}
          <button
            onClick={() => {
              sound.playHeartPop();
              setActiveTool(activeTool === 'text' ? null : 'text');
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              activeTool === 'text' ? 'bg-violet-600 text-white scale-110' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            title="Add Text"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Stickers Tool */}
          <button
            onClick={() => {
              sound.playSparkle();
              setActiveTool(activeTool === 'stickers' ? null : 'stickers');
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              activeTool === 'stickers' ? 'bg-violet-600 text-white scale-110' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            title="Add Interactive Stickers (Poll, Quiz, etc.)"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Drawing Tool */}
          <button
            onClick={() => {
              sound.playHeartPop();
              setActiveTool(activeTool === 'drawing' ? null : 'drawing');
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              activeTool === 'drawing' ? 'bg-violet-600 text-white scale-110' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            title="Brush & Drawing"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Filters Tool */}
          <button
            onClick={() => {
              sound.playHeartPop();
              setActiveTool(activeTool === 'filters' ? null : 'filters');
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              activeTool === 'filters' ? 'bg-violet-600 text-white scale-110' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            title="Photo & Video Filters"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Music Tool */}
          <button
            onClick={() => {
              sound.playSparkle();
              setActiveTool(activeTool === 'music' ? null : 'music');
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              selectedMusic ? 'bg-fuchsia-600 text-white ring-2 ring-fuchsia-400' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            title="Add Music Soundtrack"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Rotate / Flip Tool */}
          <button
            onClick={() => {
              sound.playHeartPop();
              setRotation((prev) => (prev + 90) % 360);
            }}
            className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md shadow-md"
            title="Rotate Media"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN CANVAS / MEDIA PREVIEW AREA */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
          
          {/* CAMERA MODE */}
          {mode === 'camera' && (
            <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  cameraFacing === 'user' ? 'scale-x-[-1]' : ''
                } ${FILTERS.find((f) => f.id === activeFilter)?.css || ''}`}
              />
              
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-white space-y-3">
                  <div className="p-4 bg-violet-600/20 rounded-full text-violet-400">
                    <Camera className="w-10 h-10" />
                  </div>
                  <h4 className="text-base font-bold">Live Camera Active</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Ready to capture photos or 15-second story videos with zero frame lag.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Enable Browser Camera
                  </button>
                </div>
              )}

              {/* Shutter Controls */}
              <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-around px-8">
                {/* Gallery Preset Quick Select */}
                <button
                  onClick={() => setMode('gallery')}
                  className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/50 bg-black/40 shadow-lg"
                >
                  <img src={PRESET_BACKGROUNDS[0].url} alt="Gallery" className="w-full h-full object-cover" />
                </button>

                {/* Main Shutter Button (Tap for Photo, Hold for Video) */}
                <div className="relative flex items-center justify-center">
                  {isRecordingVideo && (
                    <div className="absolute -top-10 px-3 py-1 bg-red-600 text-white text-xs font-mono font-bold rounded-full animate-pulse">
                      REC 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                    </div>
                  )}
                  <button
                    onClick={handleCapturePhoto}
                    onMouseDown={handleStartRecordVideo}
                    onMouseUp={handleStopRecordVideo}
                    onTouchStart={handleStartRecordVideo}
                    onTouchEnd={handleStopRecordVideo}
                    className={`w-20 h-20 rounded-full border-4 transition-all flex items-center justify-center ${
                      isRecordingVideo
                        ? 'border-red-500 bg-red-500/20 scale-110'
                        : 'border-white bg-white/20 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <div className={`rounded-full transition-all ${
                      isRecordingVideo ? 'w-8 h-8 bg-red-500 rounded-md' : 'w-16 h-16 bg-white'
                    }`} />
                  </button>
                </div>

                {/* Flip Front / Rear Camera */}
                <button
                  onClick={() => {
                    sound.playHeartPop();
                    setCameraFacing((f) => (f === 'user' ? 'environment' : 'user'));
                  }}
                  className="w-11 h-11 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* GALLERY / MEDIA EDIT MODE */}
          {mode === 'gallery' && (
            <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
              {mediaType === 'video' ? (
                <video
                  src={selectedMediaUrl}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className={`w-full h-full object-cover transition-all ${FILTERS.find((f) => f.id === activeFilter)?.css || ''}`}
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${isFlipped ? -1 : 1})`,
                  }}
                />
              ) : (
                <img
                  src={selectedMediaUrl}
                  alt="Story content"
                  className={`w-full h-full object-cover transition-all ${FILTERS.find((f) => f.id === activeFilter)?.css || ''}`}
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${isFlipped ? -1 : 1})`,
                  }}
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Music badge if selected */}
              {selectedMusic && (
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs">
                  <Music className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
                  <span className="font-semibold">{selectedMusic.title}</span>
                  <span className="text-[11px] text-slate-300">· {selectedMusic.artist}</span>
                </div>
              )}
            </div>
          )}

          {/* TEXT / CREATE MODE */}
          {mode === 'text' && (
            <div className={`relative w-full h-full bg-gradient-to-br ${GRADIENTS[textGradientIdx]} flex flex-col items-center justify-center p-6 text-center transition-all`}>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type your story..."
                rows={4}
                style={{
                  color: activeTextColor,
                  fontSize: `${fontSize}px`,
                }}
                className={`w-full bg-transparent resize-none border-none outline-none text-center leading-relaxed transition-all ${
                  FONTS[activeFontIdx].className
                } ${
                  textHighlight
                    ? 'p-4 rounded-2xl bg-black/40 backdrop-blur-md shadow-xl'
                    : ''
                }`}
              />

              {/* Gradient Quick Switcher at bottom of text canvas */}
              <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2">
                <button
                  onClick={() => setTextGradientIdx((prev) => (prev + 1) % GRADIENTS.length)}
                  className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Palette className="w-3.5 h-3.5 text-violet-400" />
                  <span>Cycle Background</span>
                </button>
              </div>
            </div>
          )}

          {/* INTERACTIVE STICKERS OVERLAY */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {stickers.map((stk) => (
              <div
                key={stk.id}
                className="absolute pointer-events-auto cursor-move transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${stk.x}%`, top: `${stk.y}%` }}
              >
                {/* Delete sticker button on hover */}
                <button
                  onClick={() => removeSticker(stk.id)}
                  className="absolute -top-2 -right-2 z-40 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Poll Sticker Preview */}
                {stk.type === 'poll' && (
                  <div className="w-64 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-2xl text-center space-y-2.5">
                    <p className="text-xs font-bold text-white">{stk.data.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="py-2 px-3 bg-violet-600/30 border border-violet-500/50 rounded-xl text-xs font-bold text-white">
                        {stk.data.options?.[0]?.text}
                      </div>
                      <div className="py-2 px-3 bg-fuchsia-600/30 border border-fuchsia-500/50 rounded-xl text-xs font-bold text-white">
                        {stk.data.options?.[1]?.text}
                      </div>
                    </div>
                  </div>
                )}

                {/* Question Sticker Preview */}
                {stk.type === 'question' && (
                  <div className="w-60 p-4 rounded-2xl bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-md border border-white/20 shadow-2xl text-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">Question</span>
                    <p className="text-xs font-bold text-white">{stk.data.question}</p>
                    <div className="py-2 px-3 bg-black/40 rounded-xl text-[11px] text-slate-400">
                      Type something...
                    </div>
                  </div>
                )}

                {/* Quiz Sticker Preview */}
                {stk.type === 'quiz' && (
                  <div className="w-64 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-white/20 shadow-2xl space-y-2">
                    <p className="text-xs font-bold text-white text-center">{stk.data.question}</p>
                    <div className="space-y-1.5">
                      {stk.data.options?.map((opt, i) => (
                        <div
                          key={opt.id}
                          className="py-1.5 px-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-white flex items-center justify-between"
                        >
                          <span>{opt.text}</span>
                          {opt.isCorrect && <span className="text-[10px] text-emerald-400 font-bold">✓ Correct</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Countdown Sticker Preview */}
                {stk.type === 'countdown' && (
                  <div className="w-64 p-3.5 rounded-2xl bg-gradient-to-r from-violet-900/90 to-fuchsia-900/90 backdrop-blur-md border border-white/20 shadow-2xl text-center space-y-1.5">
                    <span className="text-xs font-bold text-white">{stk.data.title}</span>
                    <div className="flex justify-center gap-2 font-mono text-xs font-bold text-white">
                      <div className="px-2 py-1 bg-black/40 rounded-lg">12<span className="text-[9px] block text-slate-400">DAYS</span></div>
                      <div className="px-2 py-1 bg-black/40 rounded-lg">08<span className="text-[9px] block text-slate-400">HRS</span></div>
                      <div className="px-2 py-1 bg-black/40 rounded-lg">45<span className="text-[9px] block text-slate-400">MIN</span></div>
                      <div className="px-2 py-1 bg-black/40 rounded-lg">20<span className="text-[9px] block text-slate-400">SEC</span></div>
                    </div>
                  </div>
                )}

                {/* Link Sticker Preview */}
                {stk.type === 'link' && (
                  <div className="px-3.5 py-2 rounded-full bg-white text-slate-950 font-bold text-xs shadow-xl flex items-center gap-2">
                    <span className="text-violet-600">🔗</span>
                    <span>{stk.data.title}</span>
                  </div>
                )}

                {/* Location Sticker Preview */}
                {stk.type === 'location' && (
                  <div className="px-3 py-1.5 rounded-full bg-slate-900/90 text-white font-bold text-xs shadow-xl border border-white/20 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{stk.data.locationName}</span>
                  </div>
                )}

                {/* Mention Sticker Preview */}
                {stk.type === 'mention' && (
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-xl flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5" />
                    <span>{stk.data.tag}</span>
                  </div>
                )}

                {/* Hashtag Sticker Preview */}
                {stk.type === 'hashtag' && (
                  <div className="px-3 py-1.5 rounded-full bg-slate-900/90 text-white font-bold text-xs shadow-xl border border-white/20 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-violet-400" />
                    <span>{stk.data.tag}</span>
                  </div>
                )}

                {/* Emoji Sticker Preview */}
                {stk.type === 'emoji' && (
                  <div className="text-4xl filter drop-shadow-lg animate-bounce">
                    {stk.data.emoji}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* DRAWING CANVAS OVERLAY */}
          <canvas
            ref={canvasRef}
            width={720}
            height={1280}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className={`absolute inset-0 w-full h-full z-35 ${
              activeTool === 'drawing' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
            }`}
          />
        </div>

        {/* BOTTOM DRAWER PANELS (When tools are active) */}
        
        {/* 1. TEXT TOOL OPTIONS */}
        {activeTool === 'text' && (
          <div className="relative z-40 bg-slate-900/95 border-t border-slate-800 p-4 space-y-3 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Font Style</span>
              <button
                onClick={() => setTextHighlight(!textHighlight)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  textHighlight ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Pill Highlight
              </button>
            </div>

            {/* Font selector */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {FONTS.map((font, idx) => (
                <button
                  key={font.id}
                  onClick={() => {
                    sound.playHeartPop();
                    setActiveFontIdx(idx);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                    activeFontIdx === idx ? 'bg-violet-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {TEXT_COLORS.map((col) => (
                <button
                  key={col}
                  onClick={() => {
                    sound.playHeartPop();
                    setActiveTextColor(col);
                  }}
                  className={`w-7 h-7 rounded-full shrink-0 border-2 transition-transform ${
                    activeTextColor === col ? 'scale-125 border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>

            {/* Font size slider */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">Size</span>
              <input
                type="range"
                min="16"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
              <span className="text-xs text-slate-300 font-mono w-6">{fontSize}</span>
            </div>
          </div>
        )}

        {/* 2. STICKERS TRAY */}
        {activeTool === 'stickers' && (
          <div className="relative z-40 bg-slate-900/95 border-t border-slate-800 p-4 max-h-72 overflow-y-auto space-y-3 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Interactive Stickers & Elements</span>
              <button onClick={() => setActiveTool(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setStickerTypeToCreate('poll')}
                className="p-3 bg-violet-600/20 border border-violet-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-white hover:bg-violet-600/30 transition-colors"
              >
                <span className="text-lg">📊</span>
                <span className="font-bold">Poll</span>
              </button>

              <button
                onClick={() => setStickerTypeToCreate('question')}
                className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-white hover:bg-indigo-600/30 transition-colors"
              >
                <span className="text-lg">💬</span>
                <span className="font-bold">Questions</span>
              </button>

              <button
                onClick={() => setStickerTypeToCreate('quiz')}
                className="p-3 bg-fuchsia-600/20 border border-fuchsia-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-white hover:bg-fuchsia-600/30 transition-colors"
              >
                <span className="text-lg">🎯</span>
                <span className="font-bold">Quiz</span>
              </button>

              <button
                onClick={() => setStickerTypeToCreate('countdown')}
                className="p-3 bg-amber-600/20 border border-amber-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-white hover:bg-amber-600/30 transition-colors"
              >
                <span className="text-lg">⏳</span>
                <span className="font-bold">Countdown</span>
              </button>

              <button
                onClick={() => setStickerTypeToCreate('link')}
                className="p-3 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-white hover:bg-emerald-600/30 transition-colors"
              >
                <span className="text-lg">🔗</span>
                <span className="font-bold">Link</span>
              </button>

              <button
                onClick={() => setStickerTypeToCreate('location')}
                className="p-3 bg-rose-600/20 border border-rose-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-white hover:bg-rose-600/30 transition-colors"
              >
                <span className="text-lg">📍</span>
                <span className="font-bold">Location</span>
              </button>

              <button
                onClick={() => setStickerTypeToCreate('mention')}
                className="p-3 bg-cyan-600/20 border border-cyan-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-white hover:bg-cyan-600/30 transition-colors"
              >
                <span className="text-lg">@</span>
                <span className="font-bold">Mention</span>
              </button>

              <button
                onClick={() => setStickerTypeToCreate('hashtag')}
                className="p-3 bg-pink-600/20 border border-pink-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-white hover:bg-pink-600/30 transition-colors"
              >
                <span className="text-lg">#</span>
                <span className="font-bold">Hashtag</span>
              </button>

              <button
                onClick={() => setStickerTypeToCreate('emoji')}
                className="p-3 bg-slate-800 border border-slate-700 rounded-2xl flex flex-col items-center gap-1.5 text-white hover:bg-slate-700 transition-colors"
              >
                <span className="text-lg">🔥</span>
                <span className="font-bold">Emojis</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. DRAWING BRUSH TOOLBAR */}
        {activeTool === 'drawing' && (
          <div className="relative z-40 bg-slate-900/95 border-t border-slate-800 p-4 space-y-3 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Brush Tool</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-2.5 py-1 rounded-lg text-xs bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-3 py-1 rounded-lg text-xs bg-violet-600 text-white font-semibold"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Brush Mode Select */}
            <div className="flex gap-2">
              {(['pen', 'neon', 'highlighter', 'eraser'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setDrawMode(m)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize ${
                    drawMode === m ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {TEXT_COLORS.map((col) => (
                <button
                  key={col}
                  onClick={() => setDrawColor(col)}
                  className={`w-7 h-7 rounded-full shrink-0 border-2 transition-transform ${
                    drawColor === col ? 'scale-125 border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>

            {/* Brush Size Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">Thickness</span>
              <input
                type="range"
                min="2"
                max="24"
                value={drawSize}
                onChange={(e) => setDrawSize(parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
              <span className="text-xs text-slate-300 font-mono w-6">{drawSize}px</span>
            </div>
          </div>
        )}

        {/* 4. FILTERS DRAWER */}
        {activeTool === 'filters' && (
          <div className="relative z-40 bg-slate-900/95 border-t border-slate-800 p-4 space-y-3 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Color Grading & Visual Filters</span>
              <button onClick={() => setActiveTool(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    sound.playHeartPop();
                    setActiveFilter(f.id);
                  }}
                  className={`shrink-0 flex flex-col items-center gap-1.5 transition-transform ${
                    activeFilter === f.id ? 'scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 ${
                    activeFilter === f.id ? 'border-violet-500 shadow-md ring-2 ring-violet-500/30' : 'border-slate-700'
                  }`}>
                    <img
                      src={selectedMediaUrl || PRESET_BACKGROUNDS[0].url}
                      alt={f.label}
                      className={`w-full h-full object-cover ${f.css}`}
                    />
                  </div>
                  <span className={`text-[11px] font-medium ${
                    activeFilter === f.id ? 'text-violet-400 font-bold' : 'text-slate-300'
                  }`}>
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. MUSIC SELECTOR DRAWER */}
        {activeTool === 'music' && (
          <div className="relative z-40 bg-slate-900/95 border-t border-slate-800 p-4 max-h-72 overflow-y-auto space-y-3 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Add Soundtrack to Story</span>
              <button onClick={() => setActiveTool(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {MUSIC_TRACKS.map((track) => (
                <div
                  key={track.title}
                  onClick={() => {
                    sound.playSparkle();
                    setSelectedMusic({ title: track.title, artist: track.artist });
                    setActiveTool(null);
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedMusic?.title === track.title
                      ? 'bg-fuchsia-600/20 border-fuchsia-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-fuchsia-500/20 text-fuchsia-400">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{track.title}</div>
                      <div className="text-[11px] text-slate-400">{track.artist} · {track.genre}</div>
                    </div>
                  </div>
                  {selectedMusic?.title === track.title ? (
                    <Check className="w-4 h-4 text-fuchsia-400" />
                  ) : (
                    <span className="text-xs text-violet-400 font-semibold">Select</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY PRESET SELECTOR (When in gallery mode) */}
        {mode === 'gallery' && !activeTool && (
          <div className="relative z-40 bg-black/80 backdrop-blur-md p-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Choose Media Preset or Upload</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {PRESET_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    sound.playHeartPop();
                    setSelectedMediaUrl(bg.url);
                    setMediaType(bg.type as 'image' | 'video');
                  }}
                  className={`w-14 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-transform ${
                    selectedMediaUrl === bg.url ? 'border-violet-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM STORY PUBLISHING BAR */}
        <div className="relative z-40 p-4 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-between gap-3">
          {/* Audience Selector Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playHeartPop();
                setAudience('public');
              }}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                audience === 'public'
                  ? 'bg-slate-800 text-white ring-1 ring-white/20'
                  : 'bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-violet-400" />
              <span>Your Story</span>
            </button>

            <button
              onClick={() => {
                sound.playHeartPop();
                setAudience('close_friends');
              }}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                audience === 'close_friends'
                  ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                  : 'bg-black/40 text-slate-400 hover:text-emerald-400'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Close Friends</span>
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={handlePublish}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Share Story</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MODAL: SUB-STICKER INPUT BUILDER */}
        {stickerTypeToCreate && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white capitalize">Configure {stickerTypeToCreate} Sticker</span>
                <button onClick={() => setStickerTypeToCreate(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Poll builder */}
              {stickerTypeToCreate === 'poll' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Question</label>
                    <input
                      type="text"
                      placeholder="Ask a question..."
                      value={stickerInputs.pollQuestion || ''}
                      onChange={(e) => setStickerInputs({ ...stickerInputs, pollQuestion: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Option 1 (e.g. Yes 🔥)"
                      value={stickerInputs.opt1 || ''}
                      onChange={(e) => setStickerInputs({ ...stickerInputs, opt1: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Option 2 (e.g. No 👎)"
                      value={stickerInputs.opt2 || ''}
                      onChange={(e) => setStickerInputs({ ...stickerInputs, opt2: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Question builder */}
              {stickerTypeToCreate === 'question' && (
                <div className="space-y-3 text-xs">
                  <label className="text-slate-400 text-[11px] block">Prompt for viewers</label>
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    value={stickerInputs.questionText || ''}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, questionText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500"
                  />
                </div>
              )}

              {/* Quiz builder */}
              {stickerTypeToCreate === 'quiz' && (
                <div className="space-y-2.5 text-xs">
                  <input
                    type="text"
                    placeholder="Quiz question..."
                    value={stickerInputs.quizQuestion || ''}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, quizQuestion: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Option 1 (Correct Answer ✓)"
                    value={stickerInputs.qOpt1 || ''}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, qOpt1: e.target.value })}
                    className="w-full bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-3 py-2 text-emerald-200 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    value={stickerInputs.qOpt2 || ''}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, qOpt2: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Option 3"
                    value={stickerInputs.qOpt3 || ''}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, qOpt3: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              )}

              {/* Countdown builder */}
              {stickerTypeToCreate === 'countdown' && (
                <div className="space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="Event title (e.g. Launch Day 🚀)"
                    value={stickerInputs.countdownTitle || ''}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, countdownTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                  <input
                    type="datetime-local"
                    value={stickerInputs.countdownDate || '2026-12-31T00:00'}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, countdownDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              )}

              {/* Link builder */}
              {stickerTypeToCreate === 'link' && (
                <div className="space-y-3 text-xs">
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={stickerInputs.linkUrl || ''}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, linkUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Sticker text (e.g. Visit Shop)"
                    value={stickerInputs.linkText || ''}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, linkText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              )}

              {/* Location builder */}
              {stickerTypeToCreate === 'location' && (
                <div className="space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="Search or type location..."
                    value={stickerInputs.locationName || ''}
                    onChange={(e) => setStickerInputs({ ...stickerInputs, locationName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {['Tokyo 🗼', 'Kyoto ⛩️', 'New York 🗽', 'Mumbai 🕌', 'Paris 🥐'].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setStickerInputs({ ...stickerInputs, locationName: loc })}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mention builder */}
              {stickerTypeToCreate === 'mention' && (
                <div className="space-y-2 text-xs">
                  <label className="text-slate-400 text-[11px]">Choose friend to tag</label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {MOCK_USERS.map((usr) => (
                      <div
                        key={usr.id}
                        onClick={() => {
                          setStickerInputs({ ...stickerInputs, mentionUser: usr.username });
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                          stickerInputs.mentionUser === usr.username
                            ? 'bg-violet-600/30 border-violet-500'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <img src={usr.avatar} alt={usr.username} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-white font-semibold">@{usr.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emoji builder */}
              {stickerTypeToCreate === 'emoji' && (
                <div className="grid grid-cols-6 gap-3 text-2xl py-2">
                  {['🔥', '❤️', '✨', '⚡', '🚀', '😍', '🎉', '💯', '🎨', '🏖️', '☕', '👑'].map((em) => (
                    <button
                      key={em}
                      onClick={() => {
                        setStickerInputs({ ...stickerInputs, selectedEmoji: em });
                        handleAddSticker('emoji');
                      }}
                      className="p-2 hover:bg-slate-800 rounded-xl transition-transform hover:scale-125"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setStickerTypeToCreate(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddSticker(stickerTypeToCreate)}
                  className="px-4 py-1.5 rounded-xl text-xs bg-violet-600 hover:bg-violet-500 text-white font-bold"
                >
                  Place Sticker
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
