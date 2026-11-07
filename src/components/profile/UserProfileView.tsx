import React, { useState } from 'react';
import { 
  Grid, Film, Bookmark, Tag, Tv, Settings, QrCode, Share2, 
  Plus, MoreHorizontal, Check, UserPlus, UserCheck, MessageSquare, 
  Mail, Link as LinkIcon, MapPin, Pin, Heart, MessageCircle, 
  ArrowLeft, Shield, DollarSign, BarChart2, Radio, Lock, 
  Sparkles, Award, ExternalLink, Play, AlertCircle, Ban, Volume2, X 
} from 'lucide-react';
import { User, Post, Reel, StoryHighlight, Channel, Story } from '../../types';
import { socialStore } from '../../utils/socialStore';
import { sound } from '../../utils/audioSynth';
import { EditProfileModal } from './EditProfileModal';
import { FollowersFollowingModal } from './FollowersFollowingModal';
import { ProfileQRCodeModal } from './ProfileQRCodeModal';
import { ExternalLinksModal } from './ExternalLinksModal';
import { ProfileContactModal } from './ProfileContactModal';
import { AccountSettingsModal } from './AccountSettingsModal';
import { ProfessionalDashboardModal } from './ProfessionalDashboardModal';
import { AccountInformationModal } from './AccountInformationModal';
import { AuthModal } from '../auth/AuthModal';
import { DynamicWatermark } from '../DynamicWatermark';

interface UserProfileViewProps {
  user: User;
  isOwner?: boolean;
  onBack?: () => void;
  onOpenCreate?: () => void;
  onOpenStory?: (story: Story) => void;
  onOpenHighlight?: (highlight: StoryHighlight) => void;
  onOpenMessenger?: (user: User) => void;
  onOpenMonetizationHub?: () => void;
  onOpenChannelStudio?: () => void;
  onOpenBrandDeals?: () => void;
  onSelectUser?: (user: User) => void;
  watermarkEnabled?: boolean;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user: initialUser,
  isOwner = true,
  onBack,
  onOpenCreate,
  onOpenStory,
  onOpenHighlight,
  onOpenMessenger,
  onOpenMonetizationHub,
  onOpenChannelStudio,
  onOpenBrandDeals,
  onSelectUser,
  watermarkEnabled = true,
}) => {
  const [user, setUser] = useState<User>(initialUser);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'videos' | 'tagged' | 'saved' | 'channel'>('posts');

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [connectionsInitialTab, setConnectionsInitialTab] = useState<'followers' | 'following' | 'requests'>('followers');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showAccountInfoModal, setShowAccountInfoModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'otp' | 'switch_accounts'>('login');
  const [showOtherMenu, setShowOtherMenu] = useState(false);

  // Post detail preview
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Follow state for other user
  const [isFollowing, setIsFollowing] = useState(user.isFollowing ?? false);
  const [followersCount, setFollowersCount] = useState(user.followersCount);

  // Queries from store
  const userPosts = socialStore.getUserPosts(user.id);
  const userSavedPosts = socialStore.getUserSavedPosts();
  const userTaggedPosts = socialStore.getUserTaggedPosts(user.id);
  const userChannel = socialStore.getUserChannel();
  const highlights = socialStore.getUserHighlights ? socialStore.getUserHighlights(user.id) : [];

  const handleToggleFollow = () => {
    sound.playHeartPop();
    const res = socialStore.toggleFollowUser(user.id);
    setIsFollowing(res.isFollowing);
    setFollowersCount(res.newFollowersCount);
  };

  const handleTogglePin = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSparkle();
    socialStore.togglePinPost(postId);
    setUser({ ...socialStore.getCurrentUser() });
  };

  const handleDoubleTapPost = (post: Post) => {
    sound.playHeartPop();
    setLikedPosts((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
  };

  const totalPostsCount = userPosts.length;
  const totalReelsCount = user.reelsCount || 18;

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans select-none pb-20">
      {/* 1. TOP PROFILE NAVIGATION BAR */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b border-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {!isOwner && onBack && (
            <button
              onClick={() => {
                sound.playHeartPop();
                onBack();
              }}
              className="p-1 -ml-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-1.5">
            {user.isPrivateAccount && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span className="text-sm font-black text-white font-mono tracking-tight">
              {user.username}
            </span>
            {user.verified && <span className="text-violet-400 text-xs font-bold">✓</span>}
          </div>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-1">
          {isOwner && onOpenCreate && (
            <button
              onClick={() => {
                sound.playSparkle();
                onOpenCreate();
              }}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
              title="Create New Post, Reel, or Story"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => {
              sound.playHeartPop();
              setShowQRModal(true);
            }}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
            title="Profile QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>

          {isOwner ? (
            <button
              onClick={() => {
                sound.playHeartPop();
                setShowSettingsModal(true);
              }}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
              title="Settings & Privacy"
            >
              <Settings className="w-5 h-5" />
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowOtherMenu(!showOtherMenu)}
                className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {/* 3-Dot Dropdown for other users */}
              {showOtherMenu && (
                <div className="absolute right-0 top-10 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-1.5 z-40 text-xs animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      sound.playHeartPop();
                      setShowOtherMenu(false);
                      setShowQRModal(true);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-200"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View QR Code</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playSparkle();
                      setShowOtherMenu(false);
                      navigator.clipboard?.writeText(window.location.href);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-200"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Profile URL</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      sound.playHeartPop();
                      socialStore.toggleRestrictUser(user.id);
                      setShowOtherMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-amber-400"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Restrict Account</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playHeartPop();
                      socialStore.toggleBlockUser(user.id);
                      setShowOtherMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-rose-400"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Block @{user.username}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. PROFILE HEADER & METRICS */}
      <div className="px-4 pt-4 pb-2 space-y-3.5 max-w-lg mx-auto w-full">
        {/* Row 1: Profile picture & Statistics */}
        <div className="flex items-center justify-between gap-4">
          {/* Avatar with Story Gradient Ring */}
          <div className="relative group cursor-pointer shrink-0">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 shadow-md">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-19 h-19 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-950 p-0.5 group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* Statistics Grid (Clickable) */}
          <div className="flex-1 flex items-center justify-around text-center">
            <div
              onClick={() => {
                sound.playHeartPop();
                setActiveTab('posts');
              }}
              className="cursor-pointer group"
            >
              <span className="block text-base sm:text-lg font-bold font-mono text-white group-hover:text-violet-400 transition-colors">
                {totalPostsCount}
              </span>
              <span className="text-[11px] text-slate-400">posts</span>
            </div>

            <div
              onClick={() => {
                sound.playHeartPop();
                setConnectionsInitialTab('followers');
                setShowConnectionsModal(true);
              }}
              className="cursor-pointer group"
            >
              <span className="block text-base sm:text-lg font-bold font-mono text-white group-hover:text-violet-400 transition-colors">
                {followersCount >= 10000 ? `${(followersCount / 1000).toFixed(1)}K` : followersCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400">followers</span>
            </div>

            <div
              onClick={() => {
                sound.playHeartPop();
                setConnectionsInitialTab('following');
                setShowConnectionsModal(true);
              }}
              className="cursor-pointer group"
            >
              <span className="block text-base sm:text-lg font-bold font-mono text-white group-hover:text-violet-400 transition-colors">
                {user.followingCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400">following</span>
            </div>

            <div
              onClick={() => {
                sound.playHeartPop();
                setActiveTab('reels');
              }}
              className="cursor-pointer group hidden sm:block"
            >
              <span className="block text-base sm:text-lg font-bold font-mono text-white group-hover:text-violet-400 transition-colors">
                {totalReelsCount}
              </span>
              <span className="text-[11px] text-slate-400">reels</span>
            </div>
          </div>
        </div>

        {/* Row 2: Name, Pronouns, Category & Bio */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-white text-sm">{user.fullName}</h1>
            {user.pronouns && (
              <span className="text-slate-400 font-normal text-[11px]">({user.pronouns})</span>
            )}
            {user.verified && <span className="text-violet-400 text-xs">✓</span>}
          </div>

          {user.category && (
            <span className="text-[11px] font-semibold text-slate-400 block -mt-0.5">
              {user.category}
            </span>
          )}

          {user.bio && (
            <p className="text-slate-200 leading-relaxed whitespace-pre-line text-xs font-normal">
              {user.bio}
            </p>
          )}

          {/* Location */}
          {user.location && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-0.5">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{user.location}</span>
            </div>
          )}

          {/* External Links */}
          {(user.website || (user.externalLinks && user.externalLinks.length > 0)) && (
            <div
              onClick={() => {
                sound.playSparkle();
                setShowLinksModal(true);
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-400 hover:text-violet-300 cursor-pointer pt-0.5 group"
            >
              <LinkIcon className="w-3 h-3 text-violet-400 group-hover:rotate-45 transition-transform" />
              <span className="truncate max-w-[220px]">
                {user.website ? user.website.replace(/^https?:\/\//, '') : user.externalLinks?.[0]?.title}
              </span>
              {user.externalLinks && user.externalLinks.length > 1 && (
                <span className="px-1.5 py-0.2 rounded-full bg-violet-950/60 border border-violet-800/60 text-[9px] text-violet-300 font-mono">
                  +{user.externalLinks.length} links
                </span>
              )}
            </div>
          )}
        </div>

        {/* Professional Creator Dashboard Banner (Owner Creator) */}
        {isOwner && user.isProfessionalAccount && (
          <div
            onClick={() => {
              sound.playSparkle();
              setShowDashboardModal(true);
            }}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/40 cursor-pointer flex items-center justify-between transition-colors shadow-sm"
          >
            <div>
              <span className="text-xs font-bold text-white block">Professional Dashboard</span>
              <span className="text-[10px] text-slate-400">
                <strong className="text-emerald-400 font-mono">124.8K</strong> accounts reached in the last 30 days
              </span>
            </div>
            <BarChart2 className="w-4 h-4 text-violet-400" />
          </div>
        )}

        {/* Row 3: Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {isOwner ? (
            <>
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setShowEditModal(true);
                }}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors"
              >
                Edit Profile
              </button>

              <button
                onClick={() => {
                  sound.playHeartPop();
                  setShowQRModal(true);
                }}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors"
              >
                Share Profile
              </button>

              {onOpenMonetizationHub && (
                <button
                  onClick={() => {
                    sound.playSparkle();
                    onOpenMonetizationHub();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                  title="500 Followers Monetization"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Earn</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleToggleFollow}
                className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                  isFollowing
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-violet-600 hover:bg-violet-500 text-white'
                }`}
              >
                {isFollowing ? 'Following' : user.isFollowedBy ? 'Follow Back' : 'Follow'}
              </button>

              {onOpenMessenger && (
                <button
                  onClick={() => {
                    sound.playSparkle();
                    onOpenMessenger(user);
                  }}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              )}

              <button
                onClick={() => {
                  sound.playSparkle();
                  setShowContactModal(true);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold text-xs transition-colors"
                title="Contact Options"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  sound.playSparkle();
                  setShowQRModal(true);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors"
                title="Share Profile"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. CONTENT TABS BAR (7 Tabs) */}
      <div className="border-t border-slate-900 mt-3 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-around border-b border-slate-900 bg-slate-950/60">
          <button
            onClick={() => {
              sound.playHeartPop();
              setActiveTab('posts');
            }}
            className={`py-3 flex-1 flex items-center justify-center border-b-2 transition-all ${
              activeTab === 'posts' ? 'border-white text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
            title="Posts Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playHeartPop();
              setActiveTab('reels');
            }}
            className={`py-3 flex-1 flex items-center justify-center border-b-2 transition-all ${
              activeTab === 'reels' ? 'border-white text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
            title="Reels"
          >
            <Film className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playHeartPop();
              setActiveTab('videos');
            }}
            className={`py-3 flex-1 flex items-center justify-center border-b-2 transition-all ${
              activeTab === 'videos' ? 'border-white text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
            title="Channel Videos"
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playHeartPop();
              setActiveTab('tagged');
            }}
            className={`py-3 flex-1 flex items-center justify-center border-b-2 transition-all ${
              activeTab === 'tagged' ? 'border-white text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
            title="Tagged Photos"
          >
            <Tag className="w-4 h-4" />
          </button>

          {isOwner && (
            <button
              onClick={() => {
                sound.playHeartPop();
                setActiveTab('saved');
              }}
              className={`py-3 flex-1 flex items-center justify-center border-b-2 transition-all ${
                activeTab === 'saved' ? 'border-white text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
              title="Saved Posts (Private)"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4. TAB VIEWPORTS */}
      <div className="max-w-lg mx-auto w-full flex-1">
        {/* TAB 1: POSTS GRID (3-Column Square) */}
        {activeTab === 'posts' && (
          <div>
            {userPosts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Grid className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">No Posts Yet</h4>
                  <span className="text-xs text-slate-500">When posts are published, they will appear here.</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {userPosts.map((post) => {
                  const isPinned = user.pinnedPostIds?.includes(post.id);
                  const isCarousel = post.mediaUrls && post.mediaUrls.length > 1;

                  return (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      onDoubleClick={() => handleDoubleTapPost(post)}
                      className="aspect-square bg-slate-900 relative group cursor-pointer overflow-hidden select-none"
                    >
                      <img
                        src={post.mediaUrls[0] || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500'}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Hardware DRM Watermark */}
                      <DynamicWatermark enabled={watermarkEnabled} opacity={0.25} />

                      {/* Top Badges: Pinned / Carousel */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10 pointer-events-none">
                        {isPinned && (
                          <div className="p-1 rounded-md bg-black/60 backdrop-blur-md text-amber-300 shadow-md">
                            <Pin className="w-3 h-3 fill-amber-300" />
                          </div>
                        )}
                        {isCarousel && (
                          <div className="p-1 rounded-md bg-black/60 backdrop-blur-md text-white shadow-md">
                            <span className="text-[9px] font-mono font-bold">1/{post.mediaUrls.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Hover Overlay with Likes & Comments */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-bold">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-white" />
                          <span>{post.likesCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>{post.commentsCount}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REELS GRID (3-Column 9:16) */}
        {activeTab === 'reels' && (
          <div className="grid grid-cols-3 gap-1 p-1">
            {userPosts.slice(0, 6).map((post, idx) => (
              <div
                key={post.id + idx}
                onClick={() => setSelectedPost(post)}
                className="aspect-9/16 rounded-xl bg-slate-900 relative group cursor-pointer overflow-hidden"
              >
                <img
                  src={post.mediaUrls[0] || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500'}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[11px] font-bold font-mono">
                  <Play className="w-3 h-3 fill-white" />
                  <span>{(idx + 1) * 12}.4K</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: VIDEOS (Channel Long-form) */}
        {activeTab === 'videos' && (
          <div className="p-3 space-y-3">
            {userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/50 cursor-pointer flex gap-3 transition-colors"
              >
                <div className="w-32 aspect-video bg-black rounded-xl overflow-hidden relative shrink-0">
                  <img src={post.mediaUrls[0]} alt={post.caption} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded-md bg-black/80 text-[9px] font-mono text-white">
                    04:18
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                    {post.caption}
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {post.likesCount * 14} views · {post.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: TAGGED POSTS */}
        {activeTab === 'tagged' && (
          <div>
            {userTaggedPosts.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <Tag className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">Photos & Videos of You</h4>
                <span className="text-xs text-slate-500">When people tag you in photos, they will appear here.</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {userTaggedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="aspect-square bg-slate-900 relative group cursor-pointer overflow-hidden"
                  >
                    <img
                      src={post.mediaUrls[0]}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 p-1 rounded-md bg-black/60 backdrop-blur-md text-white">
                      <Tag className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SAVED POSTS (Private) */}
        {activeTab === 'saved' && isOwner && (
          <div>
            <div className="p-3 text-[11px] text-slate-400 border-b border-slate-900 flex items-center justify-between">
              <span>Only you can see what you've saved</span>
              <span className="font-mono text-white font-bold">{userSavedPosts.length} items</span>
            </div>

            <div className="grid grid-cols-3 gap-0.5">
              {userSavedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="aspect-square bg-slate-900 relative group cursor-pointer overflow-hidden"
                >
                  <img
                    src={post.mediaUrls[0]}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 backdrop-blur-md text-amber-300">
                    <Bookmark className="w-3 h-3 fill-amber-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. POST DETAIL MODAL PREVIEW */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-xs font-bold text-white font-mono">@{user.username}</span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-square bg-black relative select-none">
              <img
                src={selectedPost.mediaUrls[0]}
                alt={selectedPost.caption}
                className="w-full h-full object-cover"
              />
              <DynamicWatermark enabled={watermarkEnabled} opacity={0.25} />
            </div>

            <div className="p-4 space-y-2.5 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDoubleTapPost(selectedPost)}
                    className="text-slate-300 hover:text-rose-500"
                  >
                    <Heart className={`w-5 h-5 ${likedPosts[selectedPost.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  <MessageCircle className="w-5 h-5 text-slate-300" />
                  <Share2 className="w-5 h-5 text-slate-300" />
                </div>

                {isOwner && (
                  <button
                    onClick={(e) => handleTogglePin(selectedPost.id, e)}
                    className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${
                      user.pinnedPostIds?.includes(selectedPost.id)
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Pin className="w-3 h-3" />
                    <span>{user.pinnedPostIds?.includes(selectedPost.id) ? 'Pinned to Profile' : 'Pin to Profile'}</span>
                  </button>
                )}
              </div>

              <div className="text-xs text-white">
                <span className="font-bold mr-1.5 font-mono">@{user.username}</span>
                <span className="text-slate-300">{selectedPost.caption}</span>
              </div>

              <span className="text-[10px] text-slate-500 font-mono block">{selectedPost.timestamp}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => setUser(updated)}
        />
      )}

      {showConnectionsModal && (
        <FollowersFollowingModal
          user={user}
          initialTab={connectionsInitialTab}
          onClose={() => setShowConnectionsModal(false)}
          onSelectUser={(selected) => {
            if (onSelectUser) onSelectUser(selected);
          }}
        />
      )}

      {showQRModal && (
        <ProfileQRCodeModal
          user={user}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {showLinksModal && (
        <ExternalLinksModal
          links={user.externalLinks || []}
          website={user.website}
          username={user.username}
          onClose={() => setShowLinksModal(false)}
        />
      )}

      {showContactModal && (
        <ProfileContactModal
          user={user}
          onClose={() => setShowContactModal(false)}
          onOpenMessage={() => {
            if (onOpenMessenger) onOpenMessenger(user);
          }}
        />
      )}

      {showSettingsModal && (
        <AccountSettingsModal
          user={user}
          onClose={() => setShowSettingsModal(false)}
          onUpdateUser={(updated) => setUser(updated)}
          onOpenEditProfile={() => setShowEditModal(true)}
          onOpenAccountInfo={() => setShowAccountInfoModal(true)}
          onOpenMonetizationHub={onOpenMonetizationHub}
          onOpenProfessionalDashboard={() => setShowDashboardModal(true)}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode);
            setShowAuthModal(true);
          }}
        />
      )}

      {showAccountInfoModal && (
        <AccountInformationModal
          user={user}
          onClose={() => setShowAccountInfoModal(false)}
          onOpenDownload={() => {
            setShowAccountInfoModal(false);
            setShowSettingsModal(true);
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          initialMode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(loggedUser) => {
            setUser(loggedUser);
            setShowAuthModal(false);
          }}
        />
      )}

      {showDashboardModal && (
        <ProfessionalDashboardModal
          user={user}
          onClose={() => setShowDashboardModal(false)}
          onOpenMonetization={() => {
            if (onOpenMonetizationHub) onOpenMonetizationHub();
          }}
          onOpenBrandDeals={() => {
            if (onOpenBrandDeals) onOpenBrandDeals();
          }}
        />
      )}
    </div>
  );
};
