import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Smartphone,
  Layers,
  Shield,
  ShieldAlert,
  Home,
  Film,
  Search,
  MessageSquare,
  User as UserIcon,
  Volume2,
  VolumeX,
  Lock,
  Eye,
  Sliders,
  Settings,
  Grid,
  CheckCircle2,
  Sparkles,
  X,
  Clock,
  PlusCircle,
  Radio,
  Bell,
  Tv,
  Plus,
  BarChart2,
  Share2,
  DollarSign,
  Gift,
  Briefcase,
  Wallet,
} from 'lucide-react';
import { SmartFeed } from './components/SmartFeed';
import { ReelsEngine } from './components/ReelsEngine';
import { SearchExploreHub } from './components/SearchExploreHub';
import { MessengerHub } from './components/MessengerHub';
import { StoryViewer } from './components/StoryViewer';
import { StoryCreator } from './components/StoryCreator';
import { StoryHighlightsBar } from './components/StoryHighlightsBar';
import { StoryArchiveModal } from './components/StoryArchiveModal';
import { CreateActionSheet } from './components/CreateActionSheet';
import { PostCreatorModal } from './components/PostCreatorModal';
import { ReelCreatorModal } from './components/ReelCreatorModal';
const LiveStreamingStudio = lazy(() =>
  import('./components/LiveStreamingStudio').then((m) => ({ default: m.LiveStreamingStudio }))
);
import { ChannelCreationModal } from './components/ChannelCreationModal';
import { ChannelProfileView } from './components/ChannelProfileView';
const ChannelDashboardModal = lazy(() =>
  import('./components/ChannelDashboardModal').then((m) => ({ default: m.ChannelDashboardModal }))
);
const AdminPanelModal = lazy(() =>
  import('./components/AdminPanelModal').then((m) => ({ default: m.AdminPanelModal }))
);
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AntiScreenshotShield } from './components/AntiScreenshotShield';
const ArchitectureStudio = lazy(() =>
  import('./components/ArchitectureStudio').then((m) => ({ default: m.ArchitectureStudio }))
);
import { DynamicWatermark } from './components/DynamicWatermark';
const CreatorMonetizationHubModal = lazy(() =>
  import('./components/CreatorMonetizationHubModal').then((m) => ({
    default: m.CreatorMonetizationHubModal,
  }))
);
const BrandDashboardModal = lazy(() =>
  import('./components/BrandDashboardModal').then((m) => ({ default: m.BrandDashboardModal }))
);
import { VirtualGiftsModal } from './components/VirtualGiftsModal';
import { UserProfileView } from './components/profile/UserProfileView';
import { AuthModal } from './components/auth/AuthModal';
const SuperAppHub = lazy(() =>
  import('./components/SuperAppHub').then((m) => ({ default: m.SuperAppHub }))
);
const SecurityProtectionDashboard = lazy(() =>
  import('./components/SecurityProtectionDashboard').then((m) => ({
    default: m.SecurityProtectionDashboard,
  }))
);
import { MOCK_STORIES, MOCK_POSTS, CURRENT_USER, MOCK_HIGHLIGHTS, MOCK_ARCHIVED_STORIES } from './data/mockData';
import { Story, StoryHighlight, User, Post, Reel, LiveStream, Channel, NotificationItem } from './types';
import { socialStore } from './utils/socialStore';
import { sound } from './utils/audioSynth';

export default function App() {
  // Main view: 'app' (Mobile Social App Simulator) vs 'studio' (Architectural Deliverables & Native Code)
  const [mainView, setMainView] = useState<'app' | 'studio'>('app');
  // App navigation tab: 'feed' | 'reels' | 'live' | 'search' | 'messages' | 'hub' | 'profile'
  const [activeTab, setActiveTab] = useState<'feed' | 'reels' | 'live' | 'search' | 'messages' | 'hub' | 'profile'>('feed');
  // Device frame wrapper toggle
  const [showPhoneFrame, setShowPhoneFrame] = useState(true);

  // Security states & modal
  const [showSecurityDrawer, setShowSecurityDrawer] = useState(false);
  const [flagSecureEnabled, setFlagSecureEnabled] = useState(true);
  const [screenRecordingActive, setScreenRecordingActive] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.28);

  // Social Store synchronized states
  const [posts, setPosts] = useState<Post[]>(socialStore.getPosts());
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(socialStore.getLiveStreams());
  const [channels, setChannels] = useState<Channel[]>(socialStore.getChannels());
  const [notifications, setNotifications] = useState<NotificationItem[]>(socialStore.getNotifications());
  const [userFollowersCount, setUserFollowersCount] = useState<number>(socialStore.getUserFollowersCount());
  const [userChannel, setUserChannel] = useState<Channel | null>(socialStore.getUserChannel());
  
  // Creator Monetization & Earning Hub states
  const [showMonetizationHub, setShowMonetizationHub] = useState(false);
  const [showBrandDashboard, setShowBrandDashboard] = useState(false);
  const [showVirtualGiftsModal, setShowVirtualGiftsModal] = useState(false);
  const [giftRecipientUser, setGiftRecipientUser] = useState<User | null>(null);
  const [creatorWallet, setCreatorWallet] = useState(socialStore.getCreatorWallet());
  const [monetizationProfile, setMonetizationProfile] = useState(socialStore.getMonetizationProfile());
  const [currentUser, setCurrentUser] = useState<User>(socialStore.getCurrentUser());
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);
  const [showGlobalAuthModal, setShowGlobalAuthModal] = useState(false);
  const [globalAuthMode, setGlobalAuthMode] = useState<'login' | 'signup' | 'otp' | 'switch_accounts'>('switch_accounts');

  useEffect(() => {
    return socialStore.subscribe(() => {
      setPosts(socialStore.getPosts());
      setLiveStreams(socialStore.getLiveStreams());
      setChannels(socialStore.getChannels());
      setNotifications(socialStore.getNotifications());
      setUserFollowersCount(socialStore.getUserFollowersCount());
      setUserChannel(socialStore.getUserChannel());
      setCreatorWallet(socialStore.getCreatorWallet());
      setMonetizationProfile(socialStore.getMonetizationProfile());
      setCurrentUser(socialStore.getCurrentUser());
    });
  }, []);

  const handleOpenGiftModal = (recipient: User) => {
    sound.playSparkle();
    setGiftRecipientUser(recipient);
    setShowVirtualGiftsModal(true);
  };

  // Creation & Studio Modals
  const [showCreateActionSheet, setShowCreateActionSheet] = useState(false);
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [showReelCreator, setShowReelCreator] = useState(false);
  const [showLiveStudio, setShowLiveStudio] = useState(false);
  const [activeLiveStreamToWatch, setActiveLiveStreamToWatch] = useState<LiveStream | null>(null);
  const [showChannelCreationModal, setShowChannelCreationModal] = useState(false);
  const [viewingChannel, setViewingChannel] = useState<Channel | null>(null);
  const [showChannelDashboard, setShowChannelDashboard] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

  // Stories system states
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [archivedStories, setArchivedStories] = useState<Story[]>(MOCK_ARCHIVED_STORIES);
  const [highlights, setHighlights] = useState<StoryHighlight[]>(MOCK_HIGHLIGHTS);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [highlightStoriesToView, setHighlightStoriesToView] = useState<Story[] | null>(null);
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [showStoryArchive, setShowStoryArchive] = useState(false);

  // Mute state
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const openStory = (index: number) => {
    sound.playHeartPop();
    setHighlightStoriesToView(null);
    setActiveStoryIndex(index);
  };

  const openHighlight = (highlight: StoryHighlight) => {
    sound.playHeartPop();
    setHighlightStoriesToView(highlight.stories);
    setActiveStoryIndex(0);
  };

  const handlePublishStory = (newStory: Story) => {
    sound.playSparkle();
    setStories((prev) => [newStory, ...prev]);
    setHighlightStoriesToView(null);
    setActiveStoryIndex(0);
  };

  const handleDeleteStory = (storyId: string) => {
    sound.playHeartPop();
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    setActiveStoryIndex(null);
  };

  const handleSaveToHighlight = (story: Story) => {
    sound.playSparkle();
    if (highlights.length > 0) {
      setHighlights((prev) =>
        prev.map((hl, idx) =>
          idx === 0
            ? { ...hl, stories: [...hl.stories, story] }
            : hl
        )
      );
    } else {
      const newHl: StoryHighlight = {
        id: 'hl_' + Date.now().toString(36),
        userId: CURRENT_USER.id,
        title: 'Highlights ✨',
        coverUrl: story.mediaUrl,
        stories: [story],
        createdAt: 'Just now',
      };
      setHighlights([newHl]);
    }
  };

  const handleCreateHighlight = (title: string, coverUrl: string, selectedStories: Story[]) => {
    sound.playSparkle();
    const newHl: StoryHighlight = {
      id: 'hl_' + Date.now().toString(36),
      userId: CURRENT_USER.id,
      title: title,
      coverUrl: coverUrl,
      stories: selectedStories,
      createdAt: 'Just now',
    };
    setHighlights((prev) => [...prev, newHl]);
  };

  const handleReShareStory = (story: Story) => {
    sound.playSparkle();
    const reshared: Story = {
      ...story,
      id: 'st_re_' + Date.now().toString(36),
      timestamp: 'Just now',
      createdAt: Date.now(),
      expiresIn: '24h',
      viewersCount: 0,
      viewsPrevented: 0,
      isArchived: false,
    };
    setStories((prev) => [reshared, ...prev]);
    setShowStoryArchive(false);
    setActiveStoryIndex(0);
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-violet-500/30">
      {/* Universal Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-900 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <img
            src="/app-icon.png"
            alt="VibeSpace Icon"
            className="w-8 h-8 rounded-xl object-cover shadow-md shadow-violet-950/40 ring-1 ring-violet-500/40"
          />
          <span className="text-lg font-extrabold tracking-tight text-white">
            VibeSpace
          </span>
          <span className="text-[10px] font-mono bg-violet-950/60 border border-violet-800/60 text-violet-300 px-2 py-0.5 rounded-full hidden sm:inline-block">
            Next-Gen E2EE
          </span>
        </div>

        {/* Zone 2: Navigation Links / View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sound.playHeartPop();
              setMainView('app');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              mainView === 'app'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App Simulator</span>
          </button>

          <button
            onClick={() => {
              sound.playHeartPop();
              setMainView('studio');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              mainView === 'studio'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Native Code</span>
          </button>
        </div>

        {/* Zone 3: Primary Utility Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {mainView === 'app' && (
            <>
              {/* Search Shortcut */}
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setActiveTab('search');
                }}
                className={`p-2 rounded-lg border transition-colors ${
                  activeTab === 'search'
                    ? 'bg-violet-600/30 border-violet-500 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                }`}
                title="Search & Explore"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Live Broadcasts Shortcut */}
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setViewingProfileUser(null);
                  setViewingChannel(null);
                  setActiveTab('live');
                }}
                className={`p-2 rounded-lg border transition-colors relative ${
                  activeTab === 'live'
                    ? 'bg-rose-600/30 border-rose-500 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border-slate-800'
                }`}
                title="Live Broadcasts"
              >
                <Radio className="w-4 h-4 text-rose-400" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </button>

              {/* Notifications Bell */}
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setShowNotificationsDrawer(true);
                }}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {/* Creator Earnings & Monetization Hub Shortcut */}
              <button
                onClick={() => {
                  sound.playSparkle();
                  setShowMonetizationHub(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all border border-emerald-400/30"
                title="Creator Monetization & Earning Hub (500 Followers)"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline font-mono">₹{creatorWallet.availableBalanceINR.toLocaleString()}</span>
              </button>

              {/* Admin Moderation Panel Shortcut */}
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setShowAdminPanel(true);
                }}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                title="Admin Moderation Console"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </button>

              {/* Create + Shortcut */}
              <button
                onClick={() => {
                  sound.playSparkle();
                  setShowCreateActionSheet(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
                title="Create Post, Reel, Live, Story"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Create</span>
              </button>

              <button
                onClick={() => {
                  sound.playHeartPop();
                  setGlobalAuthMode('switch_accounts');
                  setShowGlobalAuthModal(true);
                }}
                className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5"
                title="Switch or Manage Accounts"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-4 h-4 rounded-full object-cover ring-1 ring-violet-500/50"
                />
                <span className="text-xs font-semibold hidden lg:inline">@{currentUser.username}</span>
              </button>
            </>
          )}

          {mainView === 'app' && (
            <button
              onClick={() => setShowPhoneFrame(!showPhoneFrame)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium hidden md:flex items-center gap-1.5 transition-colors"
              title="Toggle iPhone Shell vs Responsive"
            >
              <Smartphone className="w-3.5 h-3.5 text-violet-400" />
              <span>{showPhoneFrame ? 'Full Width' : 'Phone Shell'}</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playHeartPop();
              setShowSecurityDrawer(true);
            }}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors relative"
            title="Security & Content DRM Policies"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            {flagSecureEnabled && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4">
        {mainView === 'studio' ? (
          /* Architecture Deliverables Portal */
          <ArchitectureStudio />
        ) : (
          /* Mobile App Simulator View */
          <div
            className={`w-full transition-all duration-300 ${
              showPhoneFrame
                ? 'max-w-[430px] my-3 border border-slate-800 rounded-[44px] shadow-2xl shadow-violet-950/20 bg-slate-950 overflow-hidden relative ring-8 ring-slate-900/60'
                : 'max-w-2xl'
            }`}
          >
            {/* iPhone Dynamic Island & Status Bar (if phone frame enabled) */}
            {showPhoneFrame && (
              <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-slate-400 select-none bg-slate-950 shrink-0">
                <span className="font-semibold text-white font-mono text-[11px]">19:38</span>
                {/* Dynamic Island pill */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2 border border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span>5G</span>
                  <div className="w-5 h-2.5 border border-slate-600 rounded-xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-white rounded-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* App Screen Content depending on activeTab or viewingChannel */}
            <div className="min-h-[660px] relative">
              {viewingProfileUser ? (
                /* Full Instagram-style User Profile View */
                <UserProfileView
                  user={viewingProfileUser}
                  isOwner={viewingProfileUser.id === currentUser.id}
                  onBack={() => setViewingProfileUser(null)}
                  onOpenStory={(st) => {
                    setStories((prev) => [st, ...prev]);
                    setActiveStoryIndex(0);
                  }}
                  onOpenHighlight={openHighlight}
                  onOpenMessenger={() => {
                    setViewingProfileUser(null);
                    setActiveTab('messages');
                  }}
                  onOpenMonetizationHub={() => setShowMonetizationHub(true)}
                  onOpenChannelStudio={() => {
                    if (userChannel) setShowChannelDashboard(true);
                    else setShowChannelCreationModal(true);
                  }}
                  onOpenBrandDeals={() => setShowBrandDashboard(true)}
                  onSelectUser={(selected) => setViewingProfileUser(selected)}
                  watermarkEnabled={watermarkEnabled}
                />
              ) : viewingChannel ? (
                /* Full YouTube-style Channel Page */
                <ChannelProfileView
                  channel={viewingChannel}
                  onClose={() => setViewingChannel(null)}
                  onOpenDashboard={() => setShowChannelDashboard(true)}
                />
              ) : activeTab === 'feed' ? (
                <SmartFeed
                  posts={posts}
                  stories={stories}
                  liveStreams={liveStreams}
                  channels={channels}
                  onOpenStory={openStory}
                  onOpenCreateStory={() => setShowStoryCreator(true)}
                  onSelectLiveStream={(stream) => {
                    setActiveLiveStreamToWatch(stream);
                    setShowLiveStudio(true);
                  }}
                  onGoLive={() => {
                    setActiveLiveStreamToWatch(null);
                    setShowLiveStudio(true);
                  }}
                  onSelectChannel={(ch) => setViewingChannel(ch)}
                  onSelectUser={(u) => setViewingProfileUser(u)}
                  onDeletePost={(postId) => socialStore.deletePost(postId)}
                  watermarkEnabled={watermarkEnabled}
                  watermarkOpacity={watermarkOpacity}
                />
              ) : activeTab === 'reels' ? (
                <div className="p-2 sm:p-3">
                  <ReelsEngine
                    watermarkEnabled={watermarkEnabled}
                    watermarkOpacity={watermarkOpacity}
                    onOpenGift={handleOpenGiftModal}
                    onSelectUser={(u) => setViewingProfileUser(u)}
                  />
                </div>
              ) : activeTab === 'live' ? (
                /* DEDICATED LIVE BROADCASTS & STAGES HUB */
                <div className="p-4 space-y-4 max-w-lg mx-auto pb-24 text-xs">
                  {/* Go Live Banner Card */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/80 via-pink-950/40 to-slate-900 border border-rose-500/30 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                          Live Broadcasting Studio
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                        Ultra Low Latency
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Start your real-time video stream with live chat, interactive hearts, multi-guest split screens, and automatic replay archiving.
                    </p>

                    <button
                      onClick={() => {
                        sound.playSparkle();
                        setActiveLiveStreamToWatch(null);
                        setShowLiveStudio(true);
                      }}
                      className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                    >
                      <Radio className="w-4 h-4" />
                      <span>Start Your Live Stream</span>
                    </button>
                  </div>

                  {/* Active Streams List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        <span>Happening Right Now ({liveStreams.length})</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Real-time SFU</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {liveStreams.map((stream) => (
                        <div
                          key={stream.id}
                          onClick={() => {
                            sound.playHeartPop();
                            setActiveLiveStreamToWatch(stream);
                            setShowLiveStudio(true);
                          }}
                          className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-rose-500/50 cursor-pointer group transition-all"
                        >
                          <div className="aspect-video relative overflow-hidden bg-black">
                            <img
                              src={stream.coverUrl}
                              alt={stream.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center gap-1 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span>LIVE</span>
                            </div>

                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[9px] border border-white/10">
                              {stream.viewerCount.toLocaleString()} watching
                            </div>

                            <div className="absolute bottom-2 left-2">
                              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] text-rose-300 font-semibold border border-white/10">
                                {stream.category}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={stream.user.avatar}
                                alt={stream.user.username}
                                className="w-8 h-8 rounded-full object-cover border border-rose-500/40"
                              />
                              <div>
                                <h5 className="text-xs font-bold text-white line-clamp-1">{stream.title}</h5>
                                <div className="text-[10px] text-slate-400">@{stream.user.username}</div>
                              </div>
                            </div>

                            <button className="px-3 py-1 rounded-xl bg-violet-600/30 text-violet-300 hover:bg-violet-600 hover:text-white text-xs font-semibold transition-colors">
                              Watch Live
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeTab === 'search' ? (
                <SearchExploreHub
                  onSelectReel={() => {
                    sound.playHeartPop();
                    setActiveTab('reels');
                  }}
                  onSelectUser={(u) => setViewingProfileUser(u)}
                  onSelectTag={() => {
                    sound.playHeartPop();
                    setActiveTab('feed');
                  }}
                  watermarkEnabled={watermarkEnabled}
                />
              ) : activeTab === 'messages' ? (
                <MessengerHub />
              ) : activeTab === 'hub' ? (
                <SuperAppHub />
              ) : (
                /* INSTAGRAM-STYLE USER PROFILE TAB */
                <UserProfileView
                  user={currentUser}
                  isOwner={true}
                  onOpenCreate={() => setShowCreateActionSheet(true)}
                  onOpenStory={(st) => {
                    setStories((prev) => [st, ...prev]);
                    setActiveStoryIndex(0);
                  }}
                  onOpenHighlight={openHighlight}
                  onOpenMessenger={() => setActiveTab('messages')}
                  onOpenMonetizationHub={() => setShowMonetizationHub(true)}
                  onOpenChannelStudio={() => {
                    if (userChannel) setShowChannelDashboard(true);
                    else setShowChannelCreationModal(true);
                  }}
                  onOpenBrandDeals={() => setShowBrandDashboard(true)}
                  onSelectUser={(selected) => setViewingProfileUser(selected)}
                  watermarkEnabled={watermarkEnabled}
                />
              )}
            </div>

            {/* Fixed Bottom Mobile Navigation Bar (Home, Reels, Create (+), Live, Profile) */}
            <nav className="sticky bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-slate-900/90 backdrop-blur-md px-3 py-1.5 flex items-center justify-around">
              {/* 1. Home */}
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setViewingProfileUser(null);
                  setViewingChannel(null);
                  setActiveTab('feed');
                }}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'feed' && !viewingChannel && !viewingProfileUser ? 'text-violet-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Home</span>
              </button>

              {/* 2. Reels */}
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setViewingProfileUser(null);
                  setViewingChannel(null);
                  setActiveTab('reels');
                }}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'reels' && !viewingProfileUser ? 'text-fuchsia-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Film className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Reels</span>
              </button>

              {/* 3. Create (+) Central Floating Button */}
              <button
                onClick={() => {
                  sound.playSparkle();
                  setShowCreateActionSheet(true);
                }}
                className="w-12 h-12 -mt-4 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-violet-950/60 hover:scale-105 active:scale-95 transition-all"
                title="Create Post, Reel, Story, Live"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* 4. Messenger */}
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setViewingProfileUser(null);
                  setViewingChannel(null);
                  setActiveTab('messages');
                }}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all relative ${
                  activeTab === 'messages' && !viewingProfileUser ? 'text-violet-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Messenger</span>
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-violet-500" />
              </button>

              {/* 5. Super Hub */}
              <button
                onClick={() => {
                  sound.playSparkle();
                  setViewingProfileUser(null);
                  setViewingChannel(null);
                  setActiveTab('hub');
                }}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'hub' && !viewingProfileUser ? 'text-violet-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Hub</span>
              </button>

              {/* 6. Profile */}
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setViewingProfileUser(null);
                  setViewingChannel(null);
                  setActiveTab('profile');
                }}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'profile' && !viewingProfileUser ? 'text-violet-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Profile</span>
              </button>
            </nav>

            {/* Bottom Home Indicator Bar (if phone frame enabled) */}
            {showPhoneFrame && (
              <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
                <div className="w-32 h-1 bg-slate-700 rounded-full" />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Security & Privacy Settings Drawer Modal */}
      {showSecurityDrawer && (
        <SecurityProtectionDashboard onClose={() => setShowSecurityDrawer(false)} />
      )}

      {/* Instagram Story Creator & Studio Modal */}
      {showStoryCreator && (
        <StoryCreator
          onClose={() => setShowStoryCreator(false)}
          onPublishStory={handlePublishStory}
        />
      )}

      {/* 24-Hour Story Archive Modal */}
      {showStoryArchive && (
        <StoryArchiveModal
          archivedStories={archivedStories}
          onClose={() => setShowStoryArchive(false)}
          onReShareStory={handleReShareStory}
          onAddStoryToHighlight={(st) => handleSaveToHighlight(st)}
        />
      )}

      {/* 24-Hour Disappearing Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={highlightStoriesToView || stories}
          initialIndex={activeStoryIndex}
          onClose={() => {
            setActiveStoryIndex(null);
            setHighlightStoriesToView(null);
          }}
          watermarkEnabled={watermarkEnabled}
          onDeleteStory={handleDeleteStory}
          onSaveToHighlight={handleSaveToHighlight}
        />
      )}

      {/* Create Action Sheet (Posts, Reels, Channel Video, Story, Go Live) */}
      {showCreateActionSheet && (
        <CreateActionSheet
          onClose={() => setShowCreateActionSheet(false)}
          onOpenCreatePost={() => setShowPostCreator(true)}
          onOpenCreateReel={() => setShowReelCreator(true)}
          onOpenCreateVideo={() => setShowPostCreator(true)}
          onOpenCreateStory={() => setShowStoryCreator(true)}
          onOpenGoLive={() => {
            setActiveLiveStreamToWatch(null);
            setShowLiveStudio(true);
          }}
        />
      )}

      {/* Post Creator Modal (Photo, Carousel, Video, Text, Music, Tagging, Location) */}
      {showPostCreator && (
        <PostCreatorModal
          onClose={() => setShowPostCreator(false)}
          onPostCreated={() => {
            setPosts(socialStore.getPosts());
          }}
        />
      )}

      {/* Reel Creator Modal (15s/30s/60s/90s, Music, Filters, Trimming) */}
      {showReelCreator && (
        <ReelCreatorModal
          onClose={() => setShowReelCreator(false)}
          onReelCreated={() => {
            setActiveTab('reels');
          }}
        />
      )}

      {/* Live Streaming Studio & Replay Archiving */}
      {showLiveStudio && (
        <LiveStreamingStudio
          initialStream={activeLiveStreamToWatch}
          onClose={() => {
            setShowLiveStudio(false);
            setActiveLiveStreamToWatch(null);
          }}
          onSaveReplay={() => {
            setLiveStreams(socialStore.getLiveStreams());
          }}
          onOpenGifts={handleOpenGiftModal}
        />
      )}

      {/* 1,000 Genuine Followers Channel Creation Gate & Wizard */}
      {showChannelCreationModal && (
        <ChannelCreationModal
          onClose={() => setShowChannelCreationModal(false)}
          onChannelCreated={(newChannel) => {
            setViewingChannel(newChannel);
          }}
        />
      )}

      {/* Creator Studio & Channel Analytics */}
      {showChannelDashboard && (
        <ChannelDashboardModal
          channel={userChannel || channels[0]}
          onClose={() => setShowChannelDashboard(false)}
        />
      )}

      {/* Creator Monetization & Earning Hub Modal (500 Genuine Followers Gate) */}
      {showMonetizationHub && (
        <CreatorMonetizationHubModal
          onClose={() => setShowMonetizationHub(false)}
          onOpenBrandMarketplace={() => {
            setShowMonetizationHub(false);
            setShowBrandDashboard(true);
          }}
        />
      )}

      {/* Brand Deals & Sponsorship Marketplace Modal */}
      {showBrandDashboard && (
        <BrandDashboardModal
          onClose={() => setShowBrandDashboard(false)}
        />
      )}

      {/* Virtual Gifts & Coin Store Modal */}
      {showVirtualGiftsModal && (
        <VirtualGiftsModal
          creator={giftRecipientUser || CURRENT_USER}
          context="profile"
          onClose={() => {
            setShowVirtualGiftsModal(false);
            setGiftRecipientUser(null);
          }}
        />
      )}

      {/* Super Admin & Content Moderation Console */}
      {showAdminPanel && (
        <AdminPanelModal
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* Real-Time Push Notifications Drawer */}
      {showNotificationsDrawer && (
        <NotificationsDrawer
          notifications={notifications}
          onClose={() => setShowNotificationsDrawer(false)}
          onSelectNotification={(notif) => {
            if (notif.type === 'live') {
              setActiveLiveStreamToWatch(liveStreams[0] || null);
              setShowLiveStudio(true);
            } else if (notif.type === 'channel_milestone' || notif.type === 'subscribe') {
              if (channels.length > 0) setViewingChannel(channels[0]);
            } else if (
              notif.type === 'monetization_unlocked' ||
              notif.type === 'brand_deal_offer' ||
              notif.type === 'gift_received' ||
              notif.type === 'withdrawal_paid'
            ) {
              setShowMonetizationHub(true);
            }
          }}
        />
      )}

      {/* Global Authentication & Multi-Account Modal */}
      <AuthModal
        isOpen={showGlobalAuthModal}
        initialMode={globalAuthMode}
        onClose={() => setShowGlobalAuthModal(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setShowGlobalAuthModal(false);
        }}
      />

      {/* Anti-Screenshot & Screen Recording Defense Simulator */}
      <AntiScreenshotShield
        flagSecureEnabled={flagSecureEnabled}
        screenRecordingActive={screenRecordingActive}
        onToggleFlagSecure={() => setFlagSecureEnabled(!flagSecureEnabled)}
        onToggleScreenRecording={() => setScreenRecordingActive(!screenRecordingActive)}
      />
    </div>
    </Suspense>
  );
}
