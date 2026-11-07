import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChatThread,
  Message,
  User,
  MessengerNote,
  ChatThemeId,
  ChatWallpaperId,
  ChatFontId,
  ChatCustomization,
  SavedReply,
  AutomationRule,
  TeamMember,
  ScreenshotPrivacySettings,
} from '../types';
import {
  SavedRepliesModal,
  AutomationRulesModal,
  TeamInboxModal,
  MessagingAnalyticsModal,
  ChatLabelsModal,
  ScreenshotPrivacyModal,
  DEFAULT_CHAT_LABELS,
  DEFAULT_SAVED_REPLIES,
  DEFAULT_AUTOMATION_RULES,
  DEFAULT_TEAM_MEMBERS,
} from './messenger/ProfessionalMessengerTools';
import { MOCK_CHATS, MOCK_USERS, MOCK_NOTES, CURRENT_USER } from '../data/mockData';
import {
  Search,
  Lock,
  Shield,
  Phone,
  Video,
  Mic,
  Send,
  Timer,
  Play,
  Pause,
  ChevronLeft,
  Check,
  CheckCheck,
  Plus,
  Music,
  Image as ImageIcon,
  Palette,
  Sparkles,
  PhoneOff,
  MicOff,
  Camera,
  X,
  Globe,
  Users,
  Eye,
  Disc3,
  MessageSquare,
  FileText,
  Download,
  Film,
  Paperclip,
  UsersRound,
  Settings,
  Info,
  Pin,
  BellOff,
  Archive,
  Trash2,
  Edit3,
  Copy,
  Forward,
  Reply,
  Smile,
  ShieldAlert,
  UserX,
  Ban,
  MoreVertical,
  SquarePen,
} from 'lucide-react';
import { sound } from '../utils/audioSynth';
import { socialStore } from '../utils/socialStore';

export const MessengerHub: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const reqThread: ChatThread = {
      id: 'thread_req_01',
      user: MOCK_USERS[4] || MOCK_USERS[0],
      lastMessage: 'Hey! Loved your latest 120Hz reel, would love to collab 🔥',
      lastMessageTime: '14m ago',
      unreadCount: 1,
      isRequest: true,
      disappearingTimer: 0,
      fingerprint: 'REQ-8821-9901',
      messages: [
        {
          id: 'msg_req_1',
          senderId: (MOCK_USERS[4] || MOCK_USERS[0]).id,
          text: 'Hey! Loved your latest 120Hz reel, would love to collab 🔥',
          timestamp: '14m ago',
          status: 'delivered',
          isE2EE: true,
        },
      ],
    };
    return [...MOCK_CHATS, reqThread];
  });
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [notes, setNotes] = useState<MessengerNote[]>(MOCK_NOTES);
  const [searchFriendQuery, setSearchFriendQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [chatListFilter, setChatListFilter] = useState<'all' | 'requests' | 'archived'>('all');
  const [showMessengerSettings, setShowMessengerSettings] = useState(false);
  const [showChatInfoDrawer, setShowChatInfoDrawer] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
  const [selectedNoteToView, setSelectedNoteToView] = useState<MessengerNote | null>(null);
  const [nicknameInput, setNicknameInput] = useState('');
  const [inputText, setInputText] = useState('');

  // Professional Account & Advanced Inbox States
  const [accountType, setAccountType] = useState<'personal' | 'creator' | 'business'>(
    () => socialStore.getUserSettings().accountType || 'creator'
  );
  const [inboxFolder, setInboxFolder] = useState<'primary' | 'general' | 'requests'>('primary');
  const [inboxFilter, setInboxFilter] = useState<
    'all' | 'unread' | 'unanswered' | 'important' | 'verified' | 'open' | 'closed'
  >('all');
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);

  // Professional Tools States
  const [savedReplies, setSavedReplies] = useState<SavedReply[]>(DEFAULT_SAVED_REPLIES);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(DEFAULT_AUTOMATION_RULES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM_MEMBERS);
  const [availableLabels, setAvailableLabels] = useState<string[]>(DEFAULT_CHAT_LABELS);
  const [screenshotPrivacy, setScreenshotPrivacy] = useState<ScreenshotPrivacySettings>({
    screenshotNotifications: true,
    screenRecordingAlerts: true,
    disappearingMessagePrivacy: true,
    viewOncePhotoPrivacy: true,
    viewOnceVideoPrivacy: true,
    blockProtectedScreenshots: false,
  });

  // Professional Modals
  const [showSavedReplies, setShowSavedReplies] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);
  const [showTeamInbox, setShowTeamInbox] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [showScreenshotPrivacy, setShowScreenshotPrivacy] = useState(false);

  // Messenger Sub Tab: 'chats' or 'notes'
  const [messengerSubTab, setMessengerSubTab] = useState<'chats' | 'notes'>('chats');
  const [noteFilter, setNoteFilter] = useState<'all' | 'close_friends' | 'music' | 'photos'>('all');
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [noteReplyTexts, setNoteReplyTexts] = useState<Record<string, string>>({});

  // Media attachment picker menu
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Group creation modal
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState<string[]>([]);

  // Playing message song / video states inside chat
  const [playingMessageSongId, setPlayingMessageSongId] = useState<string | null>(null);
  const [playingMessageVideoId, setPlayingMessageVideoId] = useState<string | null>(null);
  const [fullMediaModal, setFullMediaModal] = useState<{
    url: string;
    type: 'image' | 'video';
    title?: string;
  } | null>(null);

  // Call states
  const [activeCallType, setActiveCallType] = useState<'voice' | 'video' | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);

  // Note creator modal
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [newNoteThought, setNewNoteThought] = useState('');
  const [newNoteSongTitle, setNewNoteSongTitle] = useState('');
  const [newNoteSongArtist, setNewNoteSongArtist] = useState('');
  const [newNotePhotoUrl, setNewNotePhotoUrl] = useState<string | undefined>(undefined);
  const [newNoteAudience, setNewNoteAudience] = useState<'public' | 'close_friends'>('public');

  // Customization states
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [customization, setCustomization] = useState<ChatCustomization>({
    theme: 'violet',
    wallpaper: 'minimal',
    font: 'sans',
  });

  // Voice note recording states
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // Active reaction picker on message
  const [reactingMessageId, setReactingMessageId] = useState<string | null>(null);

  // Active thread object
  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) || null,
    [threads, activeThreadId]
  );

  // Countdown timer for disappearing messages
  useEffect(() => {
    const timer = setInterval(() => {
      setThreads((prevThreads) =>
        prevThreads.map((thread) => {
          const updatedMessages = thread.messages
            .map((msg) => {
              if (msg.expiresInSeconds && msg.timeRemaining !== undefined) {
                if (msg.timeRemaining <= 1) {
                  return null;
                }
                return { ...msg, timeRemaining: msg.timeRemaining - 1 };
              }
              return msg;
            })
            .filter((m): m is Message => m !== null);

          return { ...thread, messages: updatedMessages };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Call duration counter
  useEffect(() => {
    let callTimer: number | null = null;
    if (activeCallType) {
      callTimer = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [activeCallType]);

  // Voice recording simulation
  const startRecording = () => {
    sound.playHeartPop();
    setIsRecordingVoice(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopAndSendRecording = () => {
    sound.playHeartPop();
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingVoice(false);

    if (recordingSeconds >= 1 && activeThread) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg: Message = {
        id: Math.random().toString(),
        senderId: CURRENT_USER.id,
        senderName: CURRENT_USER.fullName,
        senderAvatar: CURRENT_USER.avatar,
        mediaType: 'audio',
        audioDuration: recordingSeconds,
        timestamp: now,
        status: 'delivered',
        isE2EE: true,
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? {
                ...t,
                lastMessage: `Voice recording (0:${recordingSeconds.toString().padStart(2, '0')})`,
                lastMessageTime: now,
                messages: [...t.messages, newMsg],
              }
            : t
        )
      );
    }
  };

  // Generic message sender (text, photo, video, song, file)
  const sendContentMessage = (
    mediaType: 'text' | 'image' | 'video' | 'song' | 'file',
    options?: {
      text?: string;
      mediaUrl?: string;
      videoDuration?: string;
      songTrack?: { title: string; artist: string };
      fileInfo?: { name: string; size: string };
    }
  ) => {
    if (!activeThread) return;
    sound.playHeartPop();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let previewText = options?.text || '';
    if (mediaType === 'image') previewText = previewText || 'Shared a Photo 📸';
    if (mediaType === 'video') previewText = previewText || 'Shared a Video 🎥';
    if (mediaType === 'song') previewText = `Shared track: ${options?.songTrack?.title || 'Song'} 🎵`;
    if (mediaType === 'file') previewText = `Shared file: ${options?.fileInfo?.name || 'Document'} 📁`;

    const newMsg: Message = {
      id: Math.random().toString(),
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.fullName,
      senderAvatar: CURRENT_USER.avatar,
      mediaType,
      text: options?.text || (mediaType === 'text' ? inputText.trim() : undefined),
      mediaUrl: options?.mediaUrl,
      videoDuration: options?.videoDuration,
      songTrack: options?.songTrack,
      fileInfo: options?.fileInfo,
      timestamp: now,
      status: 'delivered',
      isE2EE: true,
      expiresInSeconds: activeThread.disappearingTimer || undefined,
      timeRemaining: activeThread.disappearingTimer || undefined,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastMessage: previewText,
              lastMessageTime: now,
              messages: [...t.messages, newMsg],
            }
          : t
      )
    );

    if (mediaType === 'text') setInputText('');
    setShowAttachMenu(false);

    // Simulate read indicator after 2.5 seconds
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? {
                ...t,
                messages: t.messages.map((m) =>
                  m.id === newMsg.id ? { ...m, status: 'read', readAt: 'Just now' } : m
                ),
              }
            : t
        )
      );
    }, 2500);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendContentMessage('text', { text: inputText.trim() });
  };

  // Add emoji reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    sound.playHeartPop();
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread?.id
          ? {
              ...t,
              messages: t.messages.map((m) => {
                if (m.id === messageId) {
                  const existing = m.reactions || [];
                  const updated = existing.includes(emoji)
                    ? existing.filter((e) => e !== emoji)
                    : [...existing, emoji];
                  return { ...m, reactions: updated };
                }
                return m;
              }),
            }
          : t
      )
    );
    setReactingMessageId(null);
  };

  const handlePlayVoice = (id: string, duration: number = 3) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
      return;
    }
    setPlayingVoiceId(id);
    sound.playVoiceNote(duration, () => {
      setPlayingVoiceId(null);
    });
  };

  const handlePlayNoteSong = (noteId: string) => {
    if (playingSongId === noteId) {
      setPlayingSongId(null);
      sound.toggleReelSoundtrack(false);
      return;
    }
    sound.playHeartPop();
    setPlayingSongId(noteId);
    sound.toggleReelSoundtrack(true);
    setTimeout(() => {
      setPlayingSongId(null);
      sound.toggleReelSoundtrack(false);
    }, 6000);
  };

  const handleToggleMessageSong = (msgId: string) => {
    if (playingMessageSongId === msgId) {
      setPlayingMessageSongId(null);
      sound.toggleReelSoundtrack(false);
      return;
    }
    sound.playHeartPop();
    setPlayingMessageSongId(msgId);
    sound.toggleReelSoundtrack(true);
    setTimeout(() => {
      setPlayingMessageSongId(null);
      sound.toggleReelSoundtrack(false);
    }, 6000);
  };

  const handleToggleMessageVideo = (msgId: string) => {
    if (playingMessageVideoId === msgId) {
      setPlayingMessageVideoId(null);
    } else {
      sound.playHeartPop();
      setPlayingMessageVideoId(msgId);
    }
  };

  const setDisappearingTimer = (seconds: number) => {
    sound.playHeartPop();
    if (!activeThread) return;
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThread.id ? { ...t, disappearingTimer: seconds } : t))
    );
  };

  // Create a new note
  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteThought.trim()) return;

    sound.playHeartPop();
    const newNote: MessengerNote = {
      id: Math.random().toString(),
      user: CURRENT_USER,
      thought: newNoteThought.trim(),
      song: newNoteSongTitle.trim()
        ? {
            title: newNoteSongTitle.trim(),
            artist: newNoteSongArtist.trim() || 'Featured Artist',
          }
        : undefined,
      photoUrl: newNotePhotoUrl,
      isCloseFriends: newNoteAudience === 'close_friends',
      timestamp: 'Just now',
    };

    setNotes((prev) => [newNote, ...prev.filter((n) => n.user.id !== CURRENT_USER.id)]);
    setShowCreateNoteModal(false);
    setNewNoteThought('');
    setNewNoteSongTitle('');
    setNewNoteSongArtist('');
    setNewNotePhotoUrl(undefined);
  };

  // Create New Group Chat
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || selectedGroupMemberIds.length === 0) return;

    sound.playHeartPop();
    const members = MOCK_USERS.filter((u) => selectedGroupMemberIds.includes(u.id));
    members.unshift(CURRENT_USER);

    const newGroupThread: ChatThread = {
      id: `group_${Date.now()}`,
      isGroup: true,
      groupName: newGroupName.trim(),
      groupAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      groupMembers: members,
      user: members[1] || CURRENT_USER,
      lastMessage: 'Group created with E2EE MLS security',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      disappearingTimer: 0,
      fingerprint: `GROUP_MLS: ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      messages: [
        {
          id: Math.random().toString(),
          senderId: CURRENT_USER.id,
          senderName: CURRENT_USER.fullName,
          text: `Welcome to ${newGroupName.trim()}! Messages and media are end-to-end encrypted with Signal MLS protocols.`,
          timestamp: 'Just now',
          status: 'read',
          isE2EE: true,
        },
      ],
    };

    setThreads((prev) => [newGroupThread, ...prev]);
    setActiveThreadId(newGroupThread.id);
    setShowCreateGroupModal(false);
    setNewGroupName('');
    setSelectedGroupMemberIds([]);
  };

  // Reply to note directly
  const handleReplyToNote = (note: MessengerNote) => {
    const text = noteReplyTexts[note.id];
    if (!text || !text.trim()) return;

    sound.playHeartPop();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const replyMessage = `Replying to Note ("${note.thought}"): ${text.trim()}`;

    let targetThread = threads.find((t) => !t.isGroup && t.user.id === note.user.id);
    if (targetThread) {
      const newMsg: Message = {
        id: Math.random().toString(),
        senderId: CURRENT_USER.id,
        text: replyMessage,
        timestamp: now,
        status: 'delivered',
        isE2EE: true,
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === targetThread!.id
            ? {
                ...t,
                lastMessage: replyMessage,
                lastMessageTime: now,
                messages: [...t.messages, newMsg],
              }
            : t
        )
      );
      setActiveThreadId(targetThread.id);
    }

    setNoteReplyTexts((prev) => ({ ...prev, [note.id]: '' }));
  };

  // Filter threads by search input
  const filteredThreads = useMemo(() => {
    if (!searchFriendQuery.trim()) return threads;
    const q = searchFriendQuery.toLowerCase();
    return threads.filter(
      (t) =>
        (t.groupName && t.groupName.toLowerCase().includes(q)) ||
        t.user.fullName.toLowerCase().includes(q) ||
        t.user.username.toLowerCase().includes(q) ||
        t.lastMessage.toLowerCase().includes(q)
    );
  }, [threads, searchFriendQuery]);

  // Filter notes by category
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (noteFilter === 'close_friends') return n.isCloseFriends;
      if (noteFilter === 'music') return !!n.song;
      if (noteFilter === 'photos') return !!n.photoUrl;
      return true;
    });
  }, [notes, noteFilter]);

  // Active online friends
  const onlineFriends = useMemo(() => {
    return MOCK_USERS.filter((u) => u.isOnline);
  }, []);

  // Theme styling helpers
  const getThemeBubbleClass = (isSender: boolean) => {
    if (!isSender) return 'bg-slate-900 text-slate-200 border border-slate-800';
    switch (customization.theme) {
      case 'rose':
        return 'bg-rose-600 text-white shadow-rose-950/30';
      case 'emerald':
        return 'bg-emerald-600 text-white shadow-emerald-950/30';
      case 'ocean':
        return 'bg-cyan-600 text-white shadow-cyan-950/30';
      case 'midnight':
        return 'bg-slate-700 text-white shadow-slate-950/30';
      case 'violet':
      default:
        return 'bg-violet-600 text-white shadow-violet-950/30';
    }
  };

  const getWallpaperBackground = () => {
    switch (customization.wallpaper) {
      case 'cyberpunk':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/70 via-slate-950 to-black';
      case 'galaxy':
        return 'bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-fuchsia-950/50 via-slate-950 to-slate-950';
      case 'loft':
        return 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-950 to-black';
      case 'mesh':
        return 'bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950';
      case 'minimal':
      default:
        return 'bg-slate-950';
    }
  };

  const getFontFamilyClass = () => {
    switch (customization.font) {
      case 'mono':
        return 'font-mono';
      case 'serif':
        return 'font-serif';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  return (
    <div className={`pb-24 max-w-xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col ${getFontFamilyClass()} bg-slate-950`}>
      {/* VIEW 1: MESSENGER INBOX (PERSONAL & GROUP CHATS + NOTES) */}
      {!activeThread ? (
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Messenger Top Header */}
          <div className="px-4 py-3 bg-slate-950/90 sticky top-0 z-20 backdrop-blur-md border-b border-slate-900/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">Messenger</h1>
                {socialStore.getUserSettings().activityStatus && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" title="Active Now" />
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* New Message / Group Chat Icon */}
                <button
                  onClick={() => {
                    sound.playHeartPop();
                    setShowCreateGroupModal(true);
                  }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors"
                  title="New Message or Group"
                >
                  <SquarePen className="w-4 h-4 text-violet-400" />
                </button>

                {/* Search Icon */}
                <button
                  onClick={() => {
                    sound.playHeartPop();
                    setShowSearchBar((prev) => !prev);
                  }}
                  className={`p-2 rounded-xl border transition-colors ${
                    showSearchBar || searchFriendQuery
                      ? 'bg-violet-600/30 border-violet-500 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
                  }`}
                  title="Search Messenger"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Messenger Settings Icon */}
                <button
                  onClick={() => {
                    sound.playHeartPop();
                    setShowMessengerSettings(true);
                  }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors"
                  title="Messenger Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expandable Search Friends, Messages & Groups Input */}
            {(showSearchBar || searchFriendQuery) && (
              <div className="relative flex items-center animate-in fade-in duration-150">
                <Search className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={searchFriendQuery}
                  onChange={(e) => setSearchFriendQuery(e.target.value)}
                  placeholder="Search username, name, messages, or groups..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
                {searchFriendQuery && (
                  <button
                    onClick={() => setSearchFriendQuery('')}
                    className="absolute right-2.5 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* SUB-VIEW A: CHATS VIEW */}
          {messengerSubTab === 'chats' && (
            <>
              {/* MESSENGER NOTES TOP RAIL (Mini Quick Rail) */}
              <div className="px-4 py-3 border-b border-slate-900/80 bg-slate-950/60 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-3.5 min-w-max">
                  {/* Current User Note Button */}
                  <div
                    onClick={() => setShowCreateNoteModal(true)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-violet-500 group-hover:border-violet-400 transition-colors overflow-hidden">
                        <img
                          src={CURRENT_USER.avatar}
                          alt={CURRENT_USER.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 shadow-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                        <span>💭 + Note</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 group-hover:text-white">
                      Your Note
                    </span>
                  </div>

                  {/* Friends' Active Notes Rail */}
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => {
                        sound.playHeartPop();
                        setSelectedNoteToView(note);
                      }}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group max-w-[100px]"
                    >
                      <div className="relative">
                        <div
                          className={`w-16 h-16 rounded-full p-0.5 border-2 transition-transform group-hover:scale-105 ${
                            note.isCloseFriends ? 'border-emerald-400' : 'border-violet-500'
                          }`}
                        >
                          <img
                            src={note.user.avatar}
                            alt={note.user.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 shadow-xl text-white text-[10px] px-2 py-0.5 rounded-xl whitespace-nowrap max-w-[110px] truncate flex items-center gap-1 backdrop-blur-md">
                          {note.song && <Music className="w-2.5 h-2.5 text-violet-400 shrink-0 animate-spin" />}
                          <span className="truncate">{note.thought}</span>
                        </div>

                        {note.isCloseFriends && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                        )}
                      </div>

                      <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate w-full text-center">
                        {note.user.fullName.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROFESSIONAL ACCOUNT SWITCHER & TOOLS BAR */}
              <div className="px-4 py-2 bg-slate-950/90 border-b border-slate-900 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800">
                  {(['personal', 'creator', 'business'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        sound.playHeartPop();
                        setAccountType(type);
                        socialStore.updateUserSettings({
                          accountType: type,
                          isProfessionalAccount: type !== 'personal',
                        });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-colors ${
                        accountType === type
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {accountType !== 'personal' && (
                    <>
                      <button
                        onClick={() => setShowSavedReplies(true)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-violet-300 flex items-center gap-1 shrink-0"
                      >
                        <span>⚡ Saved Replies</span>
                      </button>
                      <button
                        onClick={() => setShowAutomation(true)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-emerald-300 flex items-center gap-1 shrink-0"
                      >
                        <span>🤖 Auto-Reply</span>
                      </button>
                      <button
                        onClick={() => setShowAnalytics(true)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-amber-300 flex items-center gap-1 shrink-0"
                      >
                        <span>📊 Analytics</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowScreenshotPrivacy(true)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-rose-300 flex items-center gap-1 shrink-0"
                  >
                    <span>🛡️ Screenshot Privacy</span>
                  </button>
                </div>
              </div>

              {/* CHATS HEADING & PRIMARY / GENERAL / REQUESTS / ARCHIVED TABS */}
              <div className="px-4 py-2.5 border-b border-slate-900/80 flex flex-wrap items-center justify-between gap-2 bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">Inbox</h2>
                  <button
                    onClick={() => {
                      setBulkSelectMode(!bulkSelectMode);
                      setSelectedThreadIds([]);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-colors ${
                      bulkSelectMode
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {bulkSelectMode ? 'Done' : 'Select'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      sound.playHeartPop();
                      setChatListFilter('all');
                      setInboxFolder('primary');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      chatListFilter === 'all' && inboxFolder === 'primary'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Primary
                  </button>
                  {accountType !== 'personal' && (
                    <button
                      onClick={() => {
                        sound.playHeartPop();
                        setChatListFilter('all');
                        setInboxFolder('general');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        chatListFilter === 'all' && inboxFolder === 'general'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      General
                    </button>
                  )}
                  <button
                    onClick={() => {
                      sound.playHeartPop();
                      setChatListFilter('requests');
                      setInboxFolder('requests');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      chatListFilter === 'requests'
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Requests</span>
                    {threads.filter((t) => t.isRequest).length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-mono">
                        {threads.filter((t) => t.isRequest).length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      sound.playHeartPop();
                      setChatListFilter('archived');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      chatListFilter === 'archived'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Archived
                  </button>
                </div>
              </div>

              {/* ADVANCED INBOX FILTERS & BULK ACTION BAR */}
              {bulkSelectMode && selectedThreadIds.length > 0 ? (
                <div className="px-4 py-2 bg-violet-950/40 border-b border-violet-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-violet-200">
                    {selectedThreadIds.length} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setThreads((prev) =>
                          prev.map((t) =>
                            selectedThreadIds.includes(t.id)
                              ? { ...t, folder: inboxFolder === 'primary' ? 'general' : 'primary', isRequest: false }
                              : t
                          )
                        );
                        setSelectedThreadIds([]);
                        setBulkSelectMode(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-violet-600 text-white text-[11px] font-semibold"
                    >
                      Move to {inboxFolder === 'primary' ? 'General' : 'Primary'}
                    </button>
                    <button
                      onClick={() => {
                        setThreads((prev) =>
                          prev.map((t) =>
                            selectedThreadIds.includes(t.id) ? { ...t, isArchived: true } : t
                          )
                        );
                        setSelectedThreadIds([]);
                        setBulkSelectMode(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-semibold"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-1.5 border-b border-slate-900/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-950/40">
                  {(['all', 'unread', 'unanswered', 'important', 'verified', 'open', 'closed'] as const).map(
                    (f) => (
                      <button
                        key={f}
                        onClick={() => setInboxFilter(f)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize shrink-0 transition-colors ${
                          inboxFilter === f
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    )
                  )}
                </div>
              )}

              {/* PERSONAL DMs AND GROUP THREADS LIST */}
              <div className="flex-1 divide-y divide-slate-900">
                {filteredThreads
                  .filter((t) => {
                    if (chatListFilter === 'requests') return !!t.isRequest;
                    if (chatListFilter === 'archived') return !!t.isArchived && !t.isRequest;
                    if (t.isRequest || t.isArchived) return false;
                    if (accountType !== 'personal') {
                      const folder = t.folder || 'primary';
                      if (folder !== inboxFolder) return false;
                    }
                    if (inboxFilter === 'unread') return t.unreadCount > 0;
                    if (inboxFilter === 'unanswered') return !!t.isUnanswered;
                    if (inboxFilter === 'important') return !!t.isStarred;
                    if (inboxFilter === 'verified') return !!t.user.verified;
                    if (inboxFilter === 'open') return (t.conversationStatus || 'open') === 'open';
                    if (inboxFilter === 'closed') return t.conversationStatus === 'closed';
                    return true;
                  })
                  .sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return (b.updatedAt || 0) - (a.updatedAt || 0);
                  })
                  .map((thread) => {
                    const hasUnread = thread.unreadCount > 0;
                    const lastMsg = thread.messages[thread.messages.length - 1];
                    const isSenderMe = lastMsg?.senderId === CURRENT_USER.id;

                  return (
                    <div
                      key={thread.id}
                      onClick={() => {
                        sound.playHeartPop();
                        setActiveThreadId(thread.id);
                      }}
                      className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        hasUnread ? 'bg-slate-900/40 hover:bg-slate-900/70' : 'hover:bg-slate-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar: Group vs 1-on-1 */}
                        <div className="relative shrink-0">
                          {thread.isGroup ? (
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white border border-slate-800 shadow-md">
                              <Users className="w-6 h-6" />
                            </div>
                          ) : (
                            <>
                              <img
                                src={thread.user.avatar}
                                alt={thread.user.username}
                                className="w-12 h-12 rounded-full object-cover border border-slate-800"
                              />
                              {thread.user.isOnline ? (
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                              ) : (
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-600 rounded-full border-2 border-slate-950" />
                              )}
                            </>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold text-white truncate ${hasUnread ? 'text-white' : 'text-slate-200'}`}>
                              {thread.isGroup ? thread.groupName : thread.user.fullName}
                            </span>
                            {thread.isGroup && (
                              <span className="text-[10px] font-mono text-violet-400 bg-violet-950/60 border border-violet-800/60 px-1.5 py-0.2 rounded">
                                Group ({thread.groupMembers?.length || 4})
                              </span>
                            )}
                            {!thread.isGroup && thread.user.verified && (
                              <span className="text-violet-400 text-xs">✓</span>
                            )}
                            {!thread.isGroup && thread.user.isCloseFriend && (
                              <span className="text-[10px] text-emerald-400 font-medium">· Close Friend</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate mt-0.5">
                            {isSenderMe && (
                              <span>
                                {lastMsg?.status === 'read' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-violet-400 inline mr-0.5" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-slate-500 inline mr-0.5" />
                                )}
                              </span>
                            )}
                            <span className={`truncate ${hasUnread ? 'font-semibold text-slate-100' : 'text-slate-400'}`}>
                              {thread.lastMessage}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">{thread.lastMessageTime}</span>
                        <div className="flex items-center gap-1.5">
                          {thread.disappearingTimer > 0 && (
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-900/40 px-1 rounded">
                              ⚡ {thread.disappearingTimer === 10 ? '10s' : thread.disappearingTimer === 60 ? '1m' : '24h'}
                            </span>
                          )}
                          {hasUnread && (
                            <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* SUB-VIEW B: FULL DEDICATED 'NOTES' SECTION */}
          {messengerSubTab === 'notes' && (
            <div className="p-4 space-y-4">
              {/* Post Note Prompt Banner */}
              <div
                onClick={() => setShowCreateNoteModal(true)}
                className="p-4 bg-gradient-to-r from-violet-950/60 via-slate-900 to-slate-900 border border-violet-800/40 rounded-2xl cursor-pointer hover:border-violet-600/60 transition-all flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={CURRENT_USER.avatar}
                      alt={CURRENT_USER.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-violet-500"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
                      +
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Share a New Note</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Post short text updates, songs, or photos to Public or Close Friends
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-xl shrink-0">
                  Post
                </button>
              </div>

              {/* Notes Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {(
                  [
                    { id: 'all', label: `All Notes (${notes.length})` },
                    { id: 'close_friends', label: 'Close Friends 🌿' },
                    { id: 'music', label: 'Songs 🎵' },
                    { id: 'photos', label: 'Photos 📸' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      sound.playHeartPop();
                      setNoteFilter(f.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all border ${
                      noteFilter === f.id
                        ? 'bg-violet-600 text-white border-violet-500 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Rich Notes Feed Cards */}
              <div className="space-y-3.5">
                {filteredNotes.map((note) => {
                  const isMusicPlaying = playingSongId === note.id;

                  return (
                    <div
                      key={note.id}
                      className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={note.user.avatar}
                            alt={note.user.username}
                            className={`w-10 h-10 rounded-full object-cover border-2 ${
                              note.isCloseFriends ? 'border-emerald-400' : 'border-violet-500'
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{note.user.fullName}</span>
                              {note.user.verified && <span className="text-violet-400 text-xs">✓</span>}
                            </div>
                            <span className="text-[11px] text-slate-400">@{note.user.username}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">{note.timestamp}</span>
                          {note.isCloseFriends ? (
                            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Close Friends
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-300 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Globe className="w-3 h-3 text-violet-400" /> Public
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
                        <p className="text-sm font-medium text-white leading-relaxed">
                          "{note.thought}"
                        </p>
                      </div>

                      {/* Attached Song Player */}
                      {note.song && (
                        <div className="p-2.5 bg-violet-950/30 border border-violet-900/50 rounded-xl flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 bg-violet-600/20 text-violet-300 rounded-lg shrink-0">
                              <Disc3 className={`w-5 h-5 ${isMusicPlaying ? 'animate-spin text-violet-400' : ''}`} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">{note.song.title}</div>
                              <div className="text-[10px] text-violet-300 truncate">{note.song.artist}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => handlePlayNoteSong(note.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                              isMusicPlaying
                                ? 'bg-violet-600 text-white shadow-xs'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            }`}
                          >
                            {isMusicPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Playing</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Attached Photo */}
                      {note.photoUrl && (
                        <div
                          onClick={() => setFullMediaModal({ url: note.photoUrl!, type: 'image', title: note.thought })}
                          className="rounded-xl overflow-hidden max-h-48 border border-slate-800 bg-black cursor-pointer group relative"
                        >
                          <img
                            src={note.photoUrl}
                            alt="Note attachment"
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium">
                            Click to Expand
                          </div>
                        </div>
                      )}

                      {/* Inline Reply to Note Form */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                        <input
                          type="text"
                          value={noteReplyTexts[note.id] || ''}
                          onChange={(e) =>
                            setNoteReplyTexts((prev) => ({ ...prev, [note.id]: e.target.value }))
                          }
                          placeholder={`Reply to ${note.user.fullName.split(' ')[0]}'s note...`}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                        />
                        <button
                          onClick={() => handleReplyToNote(note)}
                          disabled={!noteReplyTexts[note.id]?.trim()}
                          className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: ACTIVE CONVERSATION (PERSONAL DM OR GROUP CHAT) */
        <div className={`flex-1 flex flex-col justify-between ${getWallpaperBackground()} relative`}>
          {/* Active Conversation Top Bar */}
          <div className="p-3 bg-slate-950/90 border-b border-slate-900 flex items-center justify-between shrink-0 backdrop-blur-md z-20">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setActiveThreadId(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                title="Back to All Chats"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                {activeThread.isGroup ? (
                  <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white border border-slate-800">
                    <Users className="w-5 h-5" />
                  </div>
                ) : (
                  <>
                    <img
                      src={activeThread.user.avatar}
                      alt={activeThread.user.username}
                      className="w-9 h-9 rounded-full object-cover border border-violet-500/40"
                    />
                    {activeThread.user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
                    )}
                  </>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white">
                    {activeThread.isGroup ? activeThread.groupName : activeThread.user.fullName}
                  </span>
                  {!activeThread.isGroup && activeThread.user.verified && (
                    <span className="text-violet-400 text-xs">✓</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  {activeThread.isGroup ? (
                    <span className="text-slate-300 font-mono">
                      {activeThread.groupMembers?.length || 4} members · Group MLS
                    </span>
                  ) : activeThread.user.isOnline ? (
                    <span className="text-emerald-400">Active now · Signal E2EE</span>
                  ) : (
                    <span>{activeThread.user.lastSeen || 'Offline'} · Signal E2EE</span>
                  )}
                </div>
              </div>
            </div>

            {/* Calling, Theme Customizer & Timer Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setShowThemeModal(true);
                }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-violet-400 border border-slate-800 transition-colors"
                title="Theme, Wallpaper & Font"
              >
                <Palette className="w-4 h-4" />
              </button>

              <div className="relative group">
                <button
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                    activeThread.disappearingTimer > 0
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Disappearing Messages"
                >
                  <Timer className="w-4 h-4" />
                  {activeThread.disappearingTimer > 0 && (
                    <span className="text-[10px]">
                      {activeThread.disappearingTimer === 10
                        ? '10s'
                        : activeThread.disappearingTimer === 60
                        ? '1m'
                        : '24h'}
                    </span>
                  )}
                </button>

                <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-xl z-30 min-w-[120px] text-xs">
                  <button
                    onClick={() => setDisappearingTimer(0)}
                    className="px-3 py-1.5 text-left rounded-lg text-slate-400 hover:text-white"
                  >
                    Off
                  </button>
                  <button
                    onClick={() => setDisappearingTimer(10)}
                    className="px-3 py-1.5 text-left rounded-lg text-amber-300 hover:bg-slate-800"
                  >
                    10 Seconds ⚡
                  </button>
                  <button
                    onClick={() => setDisappearingTimer(60)}
                    className="px-3 py-1.5 text-left rounded-lg text-amber-300 hover:bg-slate-800"
                  >
                    1 Minute
                  </button>
                  <button
                    onClick={() => setDisappearingTimer(86400)}
                    className="px-3 py-1.5 text-left rounded-lg text-amber-300 hover:bg-slate-800"
                  >
                    24 Hours
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playHeartPop();
                  setActiveCallType('voice');
                }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sound.playHeartPop();
                  setActiveCallType('video');
                }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {activeThread.messages.map((msg, index) => {
              const isSenderMe = msg.senderId === CURRENT_USER.id;
              const isLastMsg = index === activeThread.messages.length - 1;
              const isSongPlaying = playingMessageSongId === msg.id;
              const isVideoPlaying = playingMessageVideoId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSenderMe ? 'items-end' : 'items-start'} group relative`}
                >
                  {/* Sender Name in Group Chat */}
                  {activeThread.isGroup && !isSenderMe && msg.senderName && (
                    <div className="flex items-center gap-1.5 mb-1 ml-1 text-[11px] text-slate-400 font-semibold">
                      {msg.senderAvatar && (
                        <img src={msg.senderAvatar} alt="Sender" className="w-4 h-4 rounded-full object-cover" />
                      )}
                      <span>{msg.senderName}</span>
                    </div>
                  )}

                  <div
                    onDoubleClick={() => setReactingMessageId(msg.id)}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs relative select-none ${getThemeBubbleClass(
                      isSenderMe
                    )} ${isSenderMe ? 'rounded-br-xs' : 'rounded-bl-xs'}`}
                  >
                    {/* Text Message */}
                    {msg.text && <p className="leading-relaxed mb-1">{msg.text}</p>}

                    {/* PHOTO MESSAGE */}
                    {msg.mediaType === 'image' && msg.mediaUrl && (
                      <div
                        onClick={() => setFullMediaModal({ url: msg.mediaUrl!, type: 'image', title: msg.text })}
                        className="rounded-xl overflow-hidden my-1 max-h-56 bg-black border border-white/10 cursor-pointer relative group/img"
                      >
                        <img src={msg.mediaUrl} alt="Photo" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-[10px] text-white font-medium">
                          Tap to view full resolution
                        </div>
                      </div>
                    )}

                    {/* VIDEO MESSAGE */}
                    {msg.mediaType === 'video' && msg.mediaUrl && (
                      <div className="rounded-xl overflow-hidden my-1 bg-black border border-white/10 relative">
                        <img
                          src={msg.mediaUrl}
                          alt="Video poster"
                          className={`w-full max-h-56 object-cover ${isVideoPlaying ? 'scale-102' : ''}`}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <button
                            onClick={() => handleToggleMessageVideo(msg.id)}
                            className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:scale-110 transition-transform"
                          >
                            {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded text-white flex items-center gap-1">
                          <Film className="w-3 h-3 text-rose-400" />
                          <span>{msg.videoDuration || '0:24'} · 120fps HLS</span>
                        </div>
                      </div>
                    )}

                    {/* SONG / MUSIC MESSAGE */}
                    {msg.mediaType === 'song' && msg.songTrack && (
                      <div className="p-2.5 my-1 bg-black/40 rounded-xl border border-white/15 flex items-center justify-between gap-3 min-w-[200px]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-lg bg-violet-600/30 text-white shrink-0">
                            <Disc3 className={`w-5 h-5 ${isSongPlaying ? 'animate-spin text-violet-300' : ''}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{msg.songTrack.title}</div>
                            <div className="text-[10px] text-slate-300 truncate">{msg.songTrack.artist}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleMessageSong(msg.id)}
                          className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
                        >
                          {isSongPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{isSongPlaying ? 'Playing' : 'Play'}</span>
                        </button>
                      </div>
                    )}

                    {/* ENCRYPTED FILE / DOCUMENT MESSAGE */}
                    {msg.mediaType === 'file' && msg.fileInfo && (
                      <div className="p-2.5 my-1 bg-black/40 rounded-xl border border-white/15 flex items-center justify-between gap-3 min-w-[200px]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-lg bg-cyan-600/30 text-cyan-300 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{msg.fileInfo.name}</div>
                            <div className="text-[10px] text-slate-300 font-mono">{msg.fileInfo.size} · E2EE AES-256</div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            sound.playHeartPop();
                          }}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                          title="Download Decrypted File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* AUDIO RECORDING (VOICE NOTE) */}
                    {msg.mediaType === 'audio' && msg.audioDuration && (
                      <div className="flex items-center gap-3 py-1 min-w-[190px]">
                        <button
                          onClick={() => handlePlayVoice(msg.id, msg.audioDuration)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isSenderMe ? 'bg-white text-slate-900' : 'bg-violet-600 text-white'
                          }`}
                        >
                          {playingVoiceId === msg.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center gap-0.5 h-6">
                            {[35, 60, 90, 55, 75, 40, 85, 70, 50, 80, 60, 45].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-150 ${
                                  playingVoiceId === msg.id
                                    ? 'bg-emerald-300 animate-pulse'
                                    : isSenderMe
                                    ? 'bg-white/70'
                                    : 'bg-slate-600'
                                }`}
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] opacity-75 font-mono">
                            0:{msg.audioDuration.toString().padStart(2, '0')} · Opus Lossless
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Message Emoji Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="absolute -bottom-2.5 right-2 bg-slate-900/90 border border-slate-700 rounded-full px-1.5 py-0.5 flex items-center gap-1 text-[11px] shadow-md">
                        {msg.reactions.map((r, ri) => (
                          <span key={ri}>{r}</span>
                        ))}
                      </div>
                    )}

                    {/* Disappearing countdown */}
                    {msg.timeRemaining !== undefined && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-amber-300">
                        <Timer className="w-3 h-3 animate-spin" />
                        <span>Self-destructs in {msg.timeRemaining}s</span>
                      </div>
                    )}

                    {/* Timestamp & Seen / Read Receipt Indicators */}
                    <div
                      className={`flex items-center gap-1.5 text-[10px] mt-1 ${
                        isSenderMe ? 'opacity-80 justify-end' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {isSenderMe && (
                        <span>
                          {msg.status === 'read' ? (
                            <span className="flex items-center gap-0.5 text-emerald-300 font-semibold" title={`Read: ${msg.readAt || 'Yes'}`}>
                              <CheckCheck className="w-3 h-3" /> Seen
                            </span>
                          ) : msg.status === 'delivered' ? (
                            <span className="flex items-center gap-0.5 text-slate-300" title="Delivered">
                              <CheckCheck className="w-3 h-3" /> Delivered
                            </span>
                          ) : (
                            <span title="Sent">
                              <Check className="w-3 h-3 text-slate-400" />
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reaction Button Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 bg-slate-900 border border-slate-800 rounded-full px-2 py-0.5 shadow-md">
                    {['❤️', '🔥', '😂', '👏', '😮'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(msg.id, emoji)}
                        className="hover:scale-125 transition-transform text-xs p-0.5"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Seen Indicator Footer for last message */}
                  {isSenderMe && isLastMsg && msg.status === 'read' && (
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 mr-1 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-400" /> Seen {msg.readAt || 'just now'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ATTACHMENT MENU DRAWER (Photo, Video, Audio Recording, Song, Document) */}
          {showAttachMenu && (
            <div className="p-3 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom duration-150 z-30">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                <span className="font-semibold text-white">Share Content (E2EE Protected)</span>
                <button onClick={() => setShowAttachMenu(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                {/* 1. Share Photo */}
                <button
                  onClick={() => {
                    sendContentMessage('image', {
                      mediaUrl: '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg',
                      text: 'Check out this night capture from Shinjuku! 📸',
                    });
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 font-medium">Photo</span>
                </button>

                {/* 2. Share Video */}
                <button
                  onClick={() => {
                    sendContentMessage('video', {
                      mediaUrl: '/src/assets/images/vibespace_reel_tokyo_1793677134321.jpg',
                      videoDuration: '0:18',
                      text: '120 FPS high-speed transit video clip 🎥',
                    });
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400">
                    <Film className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 font-medium">Video</span>
                </button>

                {/* 3. Share Song */}
                <button
                  onClick={() => {
                    sendContentMessage('song', {
                      songTrack: {
                        title: 'Midnight City (Synthwave Cut)',
                        artist: 'M83',
                      },
                    });
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
                    <Music className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 font-medium">Song</span>
                </button>

                {/* 4. Voice Recording */}
                <button
                  onClick={() => {
                    setShowAttachMenu(false);
                    startRecording();
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 font-medium">Voice</span>
                </button>

                {/* 5. Encrypted File */}
                <button
                  onClick={() => {
                    sendContentMessage('file', {
                      fileInfo: {
                        name: 'Project_VibeSpace_Spec_v3.pdf',
                        size: '4.8 MB',
                      },
                    });
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-cyan-600/20 text-cyan-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 font-medium">Document</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Message Input / Voice Note Bar */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-900 shrink-0 backdrop-blur-md">
            {isRecordingVoice ? (
              <div className="flex items-center justify-between bg-rose-950/50 border border-rose-900/70 rounded-full px-4 py-2 text-rose-300 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Recording Voice Note:</span>
                  <span className="font-mono font-bold">0:{recordingSeconds.toString().padStart(2, '0')}</span>
                </div>
                <button
                  onClick={stopAndSendRecording}
                  className="px-3.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-full text-xs shadow"
                >
                  Send
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Media Attachment Action Plus Button */}
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className={`p-2.5 rounded-full transition-colors border ${
                    showAttachMenu
                      ? 'bg-violet-600 text-white border-violet-500'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                  }`}
                  title="Share Photo, Video, Song, Voice or File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={startRecording}
                  className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
                  title="Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeThread.isGroup
                      ? `Message group ${activeThread.groupName}...`
                      : `Message ${activeThread.user.fullName}...`
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-full transition-colors disabled:opacity-40 text-white ${
                    customization.theme === 'rose'
                      ? 'bg-rose-600 hover:bg-rose-500'
                      : customization.theme === 'emerald'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : customization.theme === 'ocean'
                      ? 'bg-cyan-600 hover:bg-cyan-500'
                      : 'bg-violet-600 hover:bg-violet-500'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW GROUP CHAT */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreateGroupModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400">
                <UsersRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Create E2EE Group Chat</h3>
                <span className="text-xs text-slate-400">Share photos, videos, songs & voice with groups</span>
              </div>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Design Team, Tokyo Travel Crew, Music Studio"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Select Friends to Add</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {MOCK_USERS.map((user) => {
                    const isSelected = selectedGroupMemberIds.includes(user.id);
                    return (
                      <div
                        key={user.id}
                        onClick={() => {
                          sound.playHeartPop();
                          setSelectedGroupMemberIds((prev) =>
                            isSelected ? prev.filter((id) => id !== user.id) : [...prev, user.id]
                          );
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-violet-950/40 border-violet-500/60 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="font-semibold text-white">{user.fullName}</div>
                            <div className="text-[10px] text-slate-400">@{user.username}</div>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            isSelected ? 'bg-violet-600 border-violet-400 text-white' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newGroupName.trim() || selectedGroupMemberIds.length === 0}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold rounded-xl"
                >
                  Create Group ({selectedGroupMemberIds.length + 1} members)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL MEDIA EXPAND MODAL */}
      {fullMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setFullMediaModal(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-square w-full bg-black">
              <img src={fullMediaModal.url} alt="Full view" className="w-full h-full object-contain" />
            </div>
            {fullMediaModal.title && (
              <div className="p-4 text-xs text-slate-200">{fullMediaModal.title}</div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: SHARE A MESSENGER NOTE */}
      {showCreateNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateNoteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold">
                💭
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Share a Messenger Note</h3>
                <span className="text-[11px] text-slate-400">Visible for 24h to your selected audience</span>
              </div>
            </div>

            <form onSubmit={handlePostNote} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">What is on your mind?</label>
                <input
                  type="text"
                  maxLength={60}
                  value={newNoteThought}
                  onChange={(e) => setNewNoteThought(e.target.value)}
                  placeholder="Share a thought (e.g. Late night creative session...)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  {newNoteThought.length}/60
                </div>
              </div>

              {/* Attach Music Track */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-violet-400" /> Attach a Song
                  </span>
                  {newNoteSongTitle && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewNoteSongTitle('');
                        setNewNoteSongArtist('');
                      }}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Clear Song
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { title: 'Midnight City', artist: 'M83' },
                    { title: 'Neon Drift', artist: 'Kavinsky' },
                    { title: 'Starboy', artist: 'The Weeknd' },
                    { title: 'Resonance', artist: 'HOME' },
                  ].map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => {
                        sound.playHeartPop();
                        setNewNoteSongTitle(preset.title);
                        setNewNoteSongArtist(preset.artist);
                      }}
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                        newNoteSongTitle === preset.title
                          ? 'bg-violet-600 text-white border-violet-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      🎵 {preset.title}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    value={newNoteSongTitle}
                    onChange={(e) => setNewNoteSongTitle(e.target.value)}
                    placeholder="Track Title"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newNoteSongArtist}
                    onChange={(e) => setNewNoteSongArtist(e.target.value)}
                    placeholder="Artist"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Attach Photo Preset */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-teal-400" /> Attach a Photo
                  </span>
                  {newNotePhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setNewNotePhotoUrl(undefined)}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playHeartPop();
                      setNewNotePhotoUrl('/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg');
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                      newNotePhotoUrl === '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg'
                        ? 'bg-violet-600 text-white border-violet-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Neon Tokyo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playHeartPop();
                      setNewNotePhotoUrl('/src/assets/images/vibespace_feed_design_1793677137017.jpg');
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                      newNotePhotoUrl === '/src/assets/images/vibespace_feed_design_1793677137017.jpg'
                        ? 'bg-violet-600 text-white border-violet-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Kyoto Architecture
                  </button>
                </div>
              </div>

              {/* Audience Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Who Can See This?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playHeartPop();
                      setNewNoteAudience('public');
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition-colors ${
                      newNoteAudience === 'public'
                        ? 'bg-violet-600 border-violet-400 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Public (All Friends)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playHeartPop();
                      setNewNoteAudience('close_friends');
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition-colors ${
                      newNoteAudience === 'close_friends'
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Close Friends 🌿</span>
                  </button>
                </div>
              </div>

              {newNoteThought && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono">Live Note Preview</span>
                  <div className="flex items-center gap-2">
                    <img src={CURRENT_USER.avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                    <div className="text-xs text-white">
                      <strong>{CURRENT_USER.fullName}:</strong> "{newNoteThought}"
                      {newNoteSongTitle && <span className="text-violet-400 ml-1">🎵 {newNoteSongTitle}</span>}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateNoteModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newNoteThought.trim()}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors"
                >
                  Post Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: THEME, WALLPAPER & FONT CUSTOMIZATION */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowThemeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-violet-600/20 text-violet-400 rounded-xl">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Chat Customization</h3>
                <span className="text-xs text-slate-400">Themes, Wallpapers & Typography</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Color Themes */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Bubble Accent Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'violet', label: 'Violet', color: 'bg-violet-600' },
                    { id: 'rose', label: 'Rose', color: 'bg-rose-600' },
                    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-600' },
                    { id: 'ocean', label: 'Ocean', color: 'bg-cyan-600' },
                    { id: 'midnight', label: 'Midnight', color: 'bg-slate-700' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        sound.playHeartPop();
                        setCustomization((prev) => ({ ...prev, theme: t.id as ChatThemeId }));
                      }}
                      className={`h-10 rounded-xl ${t.color} flex items-center justify-center border-2 transition-transform ${
                        customization.theme === t.id ? 'border-white scale-105 shadow-md' : 'border-transparent'
                      }`}
                      title={t.label}
                    >
                      {customization.theme === t.id && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Wallpapers */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Chat Wallpaper</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'minimal', label: 'Dark Minimal' },
                    { id: 'cyberpunk', label: 'Cyber Neon' },
                    { id: 'galaxy', label: 'Starry Galaxy' },
                    { id: 'loft', label: 'Kyoto Loft' },
                    { id: 'mesh', label: 'Gradient Mesh' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        sound.playHeartPop();
                        setCustomization((prev) => ({ ...prev, wallpaper: w.id as ChatWallpaperId }));
                      }}
                      className={`p-2.5 rounded-xl border font-medium text-center transition-all ${
                        customization.wallpaper === w.id
                          ? 'bg-violet-600 border-violet-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Styles */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Font Typography</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sans', label: 'Modern Sans', font: 'font-sans' },
                    { id: 'mono', label: 'Mono Cyber', font: 'font-mono' },
                    { id: 'serif', label: 'Editorial Serif', font: 'font-serif' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        sound.playHeartPop();
                        setCustomization((prev) => ({ ...prev, font: f.id as ChatFontId }));
                      }}
                      className={`p-2 rounded-xl border font-medium text-center ${f.font} transition-all ${
                        customization.font === f.id
                          ? 'bg-violet-600 border-violet-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowThemeModal(false)}
                className="py-2 px-5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs"
              >
                Apply Customization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: HD VIDEO & VOICE CALL SIMULATOR */}
      {activeCallType && activeThread && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              {activeThread.isGroup ? 'Group WebRTC Mesh' : 'Peer-to-Peer SFU'} · E2EE DTLS-SRTP
            </div>
            <h3 className="text-xl font-bold text-white pt-2">
              {activeThread.isGroup ? activeThread.groupName : activeThread.user.fullName}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Call Duration: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex-1 my-6 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            {activeCallType === 'video' ? (
              <img
                src={activeThread.isGroup ? activeThread.groupAvatar! : activeThread.user.avatar}
                alt="Video caller"
                className="w-full h-full object-cover brightness-75 filter blur-xs"
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={activeThread.isGroup ? activeThread.groupAvatar! : activeThread.user.avatar}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-violet-500 shadow-2xl animate-pulse"
                />
                <span className="text-sm text-slate-400 font-medium">1080p Lossless Opus Audio Active</span>
              </div>
            )}

            {activeCallType === 'video' && (
              <div className="absolute top-4 right-4 w-24 h-36 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-xl">
                <img src={CURRENT_USER.avatar} alt="Self" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pb-6">
            <button
              onClick={() => setIsCallMuted(!isCallMuted)}
              className={`p-4 rounded-full transition-colors ${
                isCallMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {activeCallType === 'video' && (
              <button
                onClick={() => sound.playHeartPop()}
                className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Flip Camera"
              >
                <Camera className="w-6 h-6" />
              </button>
            )}

            <button
              onClick={() => {
                sound.playHeartPop();
                setActiveCallType(null);
              }}
              className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-950/50"
              title="End Call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* NOTE DETAIL & REPLY MODAL */}
      {selectedNoteToView && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedNoteToView.user.avatar}
                  alt={selectedNoteToView.user.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/40"
                />
                <div>
                  <span className="text-xs font-bold text-white block">{selectedNoteToView.user.fullName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    @{selectedNoteToView.user.username} · {selectedNoteToView.timestamp}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNoteToView(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="text-sm text-white font-medium leading-relaxed">{selectedNoteToView.thought}</p>
              {selectedNoteToView.song && (
                <div className="flex items-center gap-2 pt-1 text-xs text-violet-300">
                  <Music className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                  <span>{selectedNoteToView.song.title} — {selectedNoteToView.song.artist}</span>
                </div>
              )}
              {selectedNoteToView.isCloseFriends && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                  Close Friends Only
                </span>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const reply = noteReplyTexts[selectedNoteToView.id] || '';
                if (!reply.trim()) return;
                sound.playSparkle();
                const targetThread = threads.find((t) => !t.isGroup && t.user.id === selectedNoteToView.user.id);
                if (targetThread) {
                  const newMsg: Message = {
                    id: 'msg_' + Date.now().toString(36),
                    senderId: CURRENT_USER.id,
                    text: `Replied to note "${selectedNoteToView.thought}": ${reply.trim()}`,
                    timestamp: 'Just now',
                    status: 'sent',
                    isE2EE: true,
                  };
                  setThreads((prev) =>
                    prev.map((t) =>
                      t.id === targetThread.id
                        ? {
                            ...t,
                            lastMessage: newMsg.text || '',
                            lastMessageTime: 'Just now',
                            updatedAt: Date.now(),
                            messages: [...t.messages, newMsg],
                          }
                        : t
                    )
                  );
                  setActiveThreadId(targetThread.id);
                }
                setNoteReplyTexts((prev) => ({ ...prev, [selectedNoteToView.id]: '' }));
                setSelectedNoteToView(null);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={noteReplyTexts[selectedNoteToView.id] || ''}
                onChange={(e) =>
                  setNoteReplyTexts((prev) => ({ ...prev, [selectedNoteToView.id]: e.target.value }))
                }
                placeholder={`Reply to ${selectedNoteToView.user.fullName.split(' ')[0]}'s note...`}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MESSENGER SETTINGS MODAL */}
      {showMessengerSettings && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Messenger Settings</h3>
              </div>
              <button
                onClick={() => setShowMessengerSettings(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Show Activity Status</span>
                  <span className="text-[10px] text-slate-400">Let friends see when you're active</span>
                </div>
                <button
                  onClick={() => {
                    sound.playHeartPop();
                    const curr = socialStore.getUserSettings().activityStatus;
                    socialStore.updateUserSettings({ activityStatus: !curr });
                  }}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                    socialStore.getUserSettings().activityStatus ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      socialStore.getUserSettings().activityStatus ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Read Receipts</span>
                  <span className="text-[10px] text-slate-400">Show seen indicator in chats</span>
                </div>
                <button
                  onClick={() => {
                    sound.playHeartPop();
                    const curr = socialStore.getUserSettings().readReceipts;
                    socialStore.updateUserSettings({ readReceipts: !curr });
                  }}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                    socialStore.getUserSettings().readReceipts ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      socialStore.getUserSettings().readReceipts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROFESSIONAL MESSENGER & SCREENSHOT PRIVACY MODALS */}
      {showSavedReplies && (
        <SavedRepliesModal
          replies={savedReplies}
          onClose={() => setShowSavedReplies(false)}
          onAddReply={(r) => setSavedReplies((prev) => [r, ...prev])}
          onDeleteReply={(id) => setSavedReplies((prev) => prev.filter((r) => r.id !== id))}
          onSelectReply={(text) => {
            setInputText(text);
            setShowSavedReplies(false);
          }}
        />
      )}

      {showAutomation && (
        <AutomationRulesModal
          rules={automationRules}
          onClose={() => setShowAutomation(false)}
          onToggleRule={(id) =>
            setAutomationRules((prev) =>
              prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
            )
          }
        />
      )}

      {showTeamInbox && activeThread && (
        <TeamInboxModal
          thread={activeThread}
          teamMembers={teamMembers}
          onClose={() => setShowTeamInbox(false)}
          onAssignMember={(member) =>
            setThreads((prev) =>
              prev.map((t) => (t.id === activeThread.id ? { ...t, assignedTo: member } : t))
            )
          }
          onAddInternalNote={(text) =>
            setThreads((prev) =>
              prev.map((t) =>
                t.id === activeThread.id
                  ? {
                      ...t,
                      internalNotes: [
                        ...(t.internalNotes || []),
                        {
                          id: `note_${Date.now()}`,
                          authorName: CURRENT_USER.fullName,
                          text,
                          timestamp: 'Just now',
                        },
                      ],
                    }
                  : t
              )
            )
          }
          onToggleResolve={() =>
            setThreads((prev) =>
              prev.map((t) =>
                t.id === activeThread.id
                  ? {
                      ...t,
                      conversationStatus: t.conversationStatus === 'closed' ? 'open' : 'closed',
                    }
                  : t
              )
            )
          }
        />
      )}

      {showAnalytics && (
        <MessagingAnalyticsModal threads={threads} onClose={() => setShowAnalytics(false)} />
      )}

      {showLabelsModal && activeThread && (
        <ChatLabelsModal
          selectedLabels={activeThread.labels || []}
          availableLabels={availableLabels}
          onClose={() => setShowLabelsModal(false)}
          onToggleLabel={(label) =>
            setThreads((prev) =>
              prev.map((t) => {
                if (t.id !== activeThread.id) return t;
                const current = t.labels || [];
                const next = current.includes(label)
                  ? current.filter((l) => l !== label)
                  : [...current, label];
                return { ...t, labels: next };
              })
            )
          }
          onCreateLabel={(label) => {
            if (!availableLabels.includes(label)) {
              setAvailableLabels((prev) => [...prev, label]);
            }
          }}
        />
      )}

      {showScreenshotPrivacy && (
        <ScreenshotPrivacyModal
          settings={screenshotPrivacy}
          onClose={() => setShowScreenshotPrivacy(false)}
          onUpdate={(updates) => {
            setScreenshotPrivacy((prev) => ({ ...prev, ...updates }));
            if (updates.screenshotNotifications) {
              const targetName = activeThread ? activeThread.user.fullName : 'Direct Chat';
              socialStore.addNotification({
                id: `notif_${Date.now()}`,
                type: 'story_reply',
                user: activeThread ? activeThread.user : CURRENT_USER,
                message: `📸 Screenshot Privacy updated in ${targetName}`,
                timestamp: 'Just now',
                isRead: false,
              });
            }
          }}
        />
      )}
    </div>
  );
};
