export interface UserExternalLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  coverPhoto?: string;
  verified: boolean;
  isCloseFriend?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  bio?: string;
  pronouns?: string; // e.g., "they/them", "she/her"
  category?: string; // e.g., "Digital Creator", "Visual Artist", "Tech Entrepreneur"
  website?: string;
  externalLinks?: UserExternalLink[];
  location?: string;
  professionalEmail?: string;
  phoneNumber?: string;
  isProfessionalAccount?: boolean;
  isPrivateAccount?: boolean;
  followersCount: number;
  followingCount: number;
  reelsCount?: number;
  totalImpressions?: number;
  channelSubscribersCount?: number;
  pinnedPostIds?: string[]; // Up to 3 pinned posts
  isFollowing?: boolean;
  isFollowedBy?: boolean;
  hasFollowRequestPending?: boolean;
  isBlocked?: boolean;
  isRestricted?: boolean;
  isMuted?: boolean;
  hideFollowersList?: boolean;
  activityStatusEnabled?: boolean;
  allowMentionsFrom?: 'everyone' | 'following' | 'none';
  allowTagsFrom?: 'everyone' | 'following' | 'none';
  allowMessagesFrom?: 'everyone' | 'following';
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  user: User;
  mediaUrls: string[];
  mediaType: 'image' | 'video' | 'carousel';
  caption: string;
  tags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  hasLiked?: boolean;
  hasBookmarked?: boolean;
  isPinned?: boolean;
  audioTrack?: {
    title: string;
    artist: string;
  };
  timestamp: string;
  isSensitive?: boolean;
  isCloseFriendsOnly?: boolean;
  isExclusiveSubscriberOnly?: boolean;
  hasAdMonetization?: boolean;
  monetizationEarnings?: number;
}

export interface FollowRequest {
  id: string;
  user: User;
  timestamp: string;
}

export interface UserProfileAnalytics {
  accountsReached: number;
  accountsEngaged: number;
  profileActivity: number;
  impressions30Days: number;
  followerGrowthPercent: number;
  topAudienceCity: string;
  topAudienceAge: string;
}

export interface LoginSession {
  id: string;
  device: string;
  os: string;
  browser: string;
  location: string;
  ip: string;
  time: string;
  isCurrent: boolean;
  trusted: boolean;
}

export interface AuthAccount {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  email: string;
  phone: string;
  accountType: 'personal' | 'creator' | 'business';
  isCurrent: boolean;
  unreadCount?: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'bug' | 'content_violation' | 'account_access' | 'billing' | 'general';
  description: string;
  status: 'open' | 'under_review' | 'resolved';
  submittedAt: string;
  response?: string;
}

export interface UserSettings {
  // Account Information
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  gender: string;
  birthday: string;
  accountType: 'personal' | 'creator' | 'business';
  accountCreationDate: string;
  isDeactivated: boolean;
  
  // Login & Security
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'authenticator' | 'whatsapp';
  securityAlerts: boolean;
  suspiciousLoginAlerts: boolean;
  recoveryCodes: string[];
  loginActivity: LoginSession[];
  trustedDevices: string[];
  
  // Privacy Settings
  isPrivate: boolean;
  whoCanFollow: 'everyone' | 'approval_required';
  whoCanMessage: 'everyone' | 'following' | 'nobody';
  whoCanTag: 'everyone' | 'following' | 'nobody';
  whoCanMention: 'everyone' | 'following' | 'nobody';
  whoCanComment: 'everyone' | 'following' | 'nobody';
  commentFilterOffensive: boolean;
  hiddenWords: string[];
  activityStatus: boolean;
  readReceipts: boolean;
  hideStoryFromUserIds: string[];
  closeFriendsUserIds: string[];
  blockedUserIds: string[];
  restrictedUserIds: string[];
  mutedUserIds: string[];

  // Notifications Settings
  notifications: {
    pauseAll: boolean;
    likes: boolean;
    comments: boolean;
    followers: boolean;
    followRequests: boolean;
    messages: boolean;
    stories: boolean;
    liveBroadcasts: boolean;
    reels: boolean;
    mentionsTags: boolean;
    subscriptions: boolean;
    brandDeals: boolean;
    earnings: boolean;
    pushEnabled: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };

  // Story & Reel Settings
  storyPrivacy: 'everyone' | 'close_friends';
  storyReplies: 'everyone' | 'following' | 'off';
  allowStorySharing: boolean;
  saveStoryToArchive: boolean;
  saveStoryToGallery: boolean;
  allowReelDownload: boolean;
  allowReelRemix: boolean;
  allowReelSharing: boolean;
  autoCaptions: boolean;
  uploadQuality: 'high' | 'ultra' | 'data_saver';
  dataSaverMode: boolean;

  // Messages & Calling Settings
  messageRequestsPermission: 'everyone' | 'followers' | 'nobody';
  groupChatPermissions: 'everyone' | 'following';
  voiceCallPermissions: 'everyone' | 'following' | 'nobody';
  videoCallPermissions: 'everyone' | 'following' | 'nobody';
  chatTheme: string;
  hiddenRequestsCount: number;

  // Content Preferences
  favoriteAccountIds: string[];
  sensitiveContent: 'standard' | 'less' | 'more';
  interestedTopics: string[];
  searchHistory: string[];
  hiddenPostIds: string[];

  // App & Accessibility Settings
  language: string;
  theme: 'dark' | 'light' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
  highContrast: boolean;
  autoPlayVideos: 'always' | 'wifi_only' | 'never';
  highestQualityUploads: boolean;
  cacheSizeMB: number;

  // Creator & Professional
  isProfessionalAccount: boolean;
  professionalCategory: string;
  brandPartnershipActive: boolean;

  // Help & Support
  supportTickets: SupportTicket[];
  accountStanding: 'good_standing' | 'warning' | 'restricted';
}

export interface StorySticker {
  id: string;
  type: 'poll' | 'question' | 'quiz' | 'countdown' | 'link' | 'location' | 'mention' | 'hashtag' | 'emoji' | 'music';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  scale?: number;
  data: {
    question?: string;
    options?: { id: string; text: string; votes?: number; isCorrect?: boolean }[];
    userAnswer?: string;
    targetDate?: string;
    title?: string;
    url?: string;
    tag?: string;
    locationName?: string;
    emoji?: string;
    artist?: string;
    trackTitle?: string;
    color?: string;
    totalVotes?: number;
    userVotedOptionId?: string;
  };
}

export interface StoryViewerUser {
  id: string;
  user: User;
  viewedAt: string;
  hasLiked?: boolean;
  reactionEmoji?: string;
}

export interface StoryInsight {
  impressions: number;
  reach: number;
  forwardTaps: number;
  backTaps: number;
  exits: number;
  replies: number;
  shares: number;
}

export interface Story {
  id: string;
  user: User;
  mediaUrl: string;
  mediaType?: 'image' | 'video' | 'text';
  textContent?: string;
  backgroundGradient?: string;
  fontStyle?: 'classic' | 'modern' | 'neon' | 'typewriter' | 'strong';
  textColor?: string;
  textHighlight?: boolean;
  timestamp: string;
  createdAt?: number;
  expiresIn: string;
  isCloseFriends: boolean;
  hiddenFromUsers?: string[];
  viewersCount: number;
  viewsPrevented: number;
  caption?: string;
  filter?: string;
  isMuted?: boolean;
  audioTrack?: {
    title: string;
    artist: string;
    previewUrl?: string;
  };
  stickers?: StorySticker[];
  drawingsDataUrl?: string;
  viewers?: StoryViewerUser[];
  insights?: StoryInsight;
  likesCount?: number;
  hasLiked?: boolean;
  isArchived?: boolean;
}

export interface StoryHighlight {
  id: string;
  userId: string;
  title: string;
  coverUrl: string;
  stories: Story[];
  createdAt: string;
}

export interface Reel {
  id: string;
  user: User;
  videoPoster: string;
  title: string;
  audioTrack: {
    title: string;
    artist: string;
  };
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  tags: string[];
  duration: string;
  hasLiked?: boolean;
  hasSaved?: boolean;
  isExclusiveSubscriberOnly?: boolean;
  hasAdMonetization?: boolean;
  monetizationEarnings?: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  text?: string;
  mediaType?: 'text' | 'image' | 'video' | 'audio' | 'song' | 'file' | 'gif' | 'sticker';
  mediaUrl?: string;
  videoDuration?: string;
  songTrack?: {
    title: string;
    artist: string;
    coverUrl?: string;
  };
  fileInfo?: {
    name: string;
    size: string;
  };
  audioDuration?: number;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  readAt?: string;
  reactions?: string[];
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  isPinned?: boolean;
  isEdited?: boolean;
  isForwarded?: boolean;
  isViewOnce?: boolean;
  viewOnceOpened?: boolean;
  replayAllowed?: boolean;
  isSystemAlert?: boolean;
  expiresInSeconds?: number;
  timeRemaining?: number;
  isE2EE: boolean;
}

export interface SavedReply {
  id: string;
  shortcut: string;
  title: string;
  message: string;
  category: 'welcome' | 'pricing' | 'collab' | 'support' | 'thanks';
}

export interface AutomationRule {
  id: string;
  type: 'welcome' | 'away' | 'keyword' | 'faq';
  title: string;
  enabled: boolean;
  triggerKeyword?: string;
  response: string;
  schedule?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'admin' | 'agent';
  avatar: string;
  isOnline: boolean;
}

export interface InternalNote {
  id: string;
  authorName: string;
  text: string;
  timestamp: string;
}

export interface ScreenshotPrivacySettings {
  screenshotNotifications: boolean;
  screenRecordingAlerts: boolean;
  disappearingMessagePrivacy: boolean;
  viewOncePhotoPrivacy: boolean;
  viewOnceVideoPrivacy: boolean;
  blockProtectedScreenshots: boolean;
}

export interface ChatThread {
  id: string;
  folder?: 'primary' | 'general' | 'requests';
  isGroup?: boolean;
  groupName?: string;
  groupDescription?: string;
  groupAdminId?: string;
  groupMembers?: User[];
  groupAvatar?: string;
  user: User;
  nickname?: string;
  lastMessage: string;
  lastMessageTime: string;
  updatedAt?: number;
  unreadCount: number;
  isPinned?: boolean;
  isStarred?: boolean;
  isUnanswered?: boolean;
  conversationStatus?: 'open' | 'closed';
  labels?: string[];
  assignedTo?: TeamMember;
  internalNotes?: InternalNote[];
  vanishMode?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  isRequest?: boolean;
  isRestricted?: boolean;
  isBlocked?: boolean;
  isTyping?: boolean;
  disappearingTimer: number; // 0 = off, 10 = 10s, 60 = 1m, 86400 = 24h
  fingerprint: string;
  messages: Message[];
}

export interface MessengerNote {
  id: string;
  user: User;
  thought: string;
  song?: {
    title: string;
    artist: string;
  };
  photoUrl?: string;
  isCloseFriends: boolean;
  timestamp: string;
}

export type ChatThemeId = 'violet' | 'rose' | 'emerald' | 'ocean' | 'midnight';
export type ChatWallpaperId = 'minimal' | 'cyberpunk' | 'galaxy' | 'loft' | 'mesh';
export type ChatFontId = 'sans' | 'mono' | 'serif';

export interface ChatCustomization {
  theme: ChatThemeId;
  wallpaper: ChatWallpaperId;
  font: ChatFontId;
}

export type VideoFilterType = 'none' | 'cyberpunk' | 'vhs' | 'golden' | 'noir' | 'prism';

export interface SecurityConfig {
  flagSecureEnabled: boolean;
  antiScreenRecording: boolean;
  dynamicWatermark: boolean;
  watermarkOpacity: number;
  zeroDataLeakEnabled: boolean;
  screenshotBlockedCount: number;
  lastAlertTimestamp?: string;
}

export interface LiveComment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  isPinned?: boolean;
  isModerator?: boolean;
}

export interface LiveStream {
  id: string;
  user: User;
  title: string;
  category: string;
  coverUrl: string;
  streamUrl?: string;
  viewerCount: number;
  peakViewerCount: number;
  likesCount: number;
  startedAt: string;
  isLive: boolean;
  guests?: User[];
  isChatMuted?: boolean;
  hasReplaySaved?: boolean;
}

export interface ChannelCommunityPost {
  id: string;
  channelId: string;
  content: string;
  imageUrl?: string;
  pollOptions?: { id: string; text: string; votes: number }[];
  likesCount: number;
  commentsCount: number;
  timestamp: string;
}

export interface ChannelAnalytics {
  totalViews: number;
  totalReelViews: number;
  watchTimeHours: number;
  subscribersGained: number;
  totalLikes: number;
  totalShares: number;
  topVideos: { title: string; views: number; date: string }[];
  audienceRetention: number;
}

export interface Channel {
  id: string;
  ownerId: string;
  name: string;
  handle: string;
  avatar: string;
  bannerUrl: string;
  description: string;
  category: string;
  subscribersCount: number;
  isSubscribed?: boolean;
  customUrl: string;
  createdAt: string;
  verified: boolean;
  communityPosts?: ChannelCommunityPost[];
  analytics?: ChannelAnalytics;
}

export interface NotificationItem {
  id: string;
  type: 'follow' | 'subscribe' | 'like' | 'comment' | 'live' | 'story_reply' | 'channel_milestone' | 'monetization_unlocked' | 'brand_deal_offer' | 'gift_received' | 'withdrawal_paid';
  user: User;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetId?: string;
  amountINR?: number;
}

export interface AdminReport {
  id: string;
  reportedBy: User;
  targetType: 'post' | 'reel' | 'live' | 'user' | 'channel';
  targetId: string;
  targetTitle: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
}

// ==========================================
// CREATOR MONETIZATION & EARNING ECOSYSTEM
// ==========================================

export interface MonetizationProfile {
  userId: string;
  isEligible: boolean; // Automatically unlocked at 500+ genuine followers
  isApproved: boolean;
  hasAgreedToTerms: boolean;
  emailVerified: boolean;
  mobileVerified: boolean;
  communityGuidelinesClean: boolean;
  enabledStreams: {
    brandDeals: boolean;
    subscriptions: boolean;
    virtualGifts: boolean;
    videoAds: boolean;
  };
  subscriptionPriceINR: number; // e.g. ₹299 / month
  paymentDetails: {
    payoutMethod: 'upi' | 'bank_transfer';
    upiId?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankIfscCode?: string;
    bankName?: string;
  };
  kycStatus: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  panNumber?: string;
  idDocumentName?: string;
  rejectionReason?: string;
  verifiedAt?: string;
}

export interface BrandCampaign {
  id: string;
  brandName: string;
  brandLogo: string;
  category: string;
  title: string;
  description: string;
  deliverables: ('sponsored_reel' | 'carousel_post' | 'story_mention' | 'dedicated_video')[];
  budgetINR: number;
  slotsAvailable: number;
  slotsFilled: number;
  deadline: string;
  minFollowersRequired: number;
  status: 'active' | 'closed';
  rating: number;
  verifiedBrand: boolean;
}

export interface BrandDealMessage {
  id: string;
  sender: 'brand' | 'creator';
  text: string;
  timestamp: string;
  proposedAmountINR?: number;
}

export interface BrandDeal {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  brandLogo: string;
  creatorId: string;
  creatorUsername: string;
  dealAmountINR: number;
  deliverable: 'sponsored_reel' | 'carousel_post' | 'story_mention' | 'dedicated_video';
  status: 'applied' | 'negotiating' | 'accepted' | 'content_submitted' | 'approved_paid' | 'rejected';
  submittedContentUrl?: string;
  submissionNotes?: string;
  deadline: string;
  createdAt: string;
  chatMessages: BrandDealMessage[];
  rating?: number;
  review?: string;
}

export interface PaidSubscription {
  id: string;
  creatorId: string;
  subscriberId: string;
  subscriberUser: User;
  plan: 'monthly' | 'annual';
  monthlyPriceINR: number;
  status: 'active' | 'cancelled' | 'expired';
  startedAt: string;
  renewsAt: string;
  badgeLevel: 'Silver Supporter' | 'Gold VIP' | 'Diamond Patron';
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  coinCost: number;
  cashValueINR: number;
  animation: 'rose_petal' | 'diamond_sparkle' | 'rocket_launch' | 'crown_glow' | 'phoenix_fire';
  category: 'popular' | 'vip' | 'epic';
}

export interface GiftTransaction {
  id: string;
  senderUser: User;
  creatorId: string;
  gift: VirtualGift;
  coins: number;
  cashValueINR: number;
  context: 'live_stream' | 'reel' | 'post' | 'profile';
  timestamp: string;
}

export interface CreatorWallet {
  totalLifetimeEarningsINR: number;
  availableBalanceINR: number;
  pendingEscrowBalanceINR: number;
  brandDealEarningsINR: number;
  subscriptionEarningsINR: number;
  giftEarningsINR: number;
  adRevenueEarningsINR: number;
  userCoinBalance: number;
}

export interface WithdrawalRequest {
  id: string;
  creatorId: string;
  amountINR: number;
  platformFeeINR: number;
  tdsAmountINR: number;
  netPayoutINR: number;
  payoutMethod: 'upi' | 'bank_transfer';
  payoutDestination: string; // e.g., "upi: creator@okhdfcbank"
  status: 'pending' | 'processing' | 'paid' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  transactionReference?: string;
  receiptNumber: string;
}

export interface AdminMonetizationConfig {
  minFollowersRequired: number; // 500
  subscriptionCommissionPercent: number; // 15%
  giftCommissionPercent: number; // 20%
  brandDealPlatformFeePercent: number; // 10%
  adRevenueSharePercent: number; // 55% to creator
  minWithdrawalINR: number; // ₹1,000
  tdsPercent: number; // 1%
  platformTotalGMVINR: number;
  platformTotalRevenueINR: number;
}

