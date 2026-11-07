import { 
  User, Post, Reel, LiveStream, Channel, NotificationItem, AdminReport, LiveComment,
  MonetizationProfile, BrandCampaign, BrandDeal, PaidSubscription, VirtualGift, 
  GiftTransaction, CreatorWallet, WithdrawalRequest, AdminMonetizationConfig,
  FollowRequest, UserSettings, UserProfileAnalytics, UserExternalLink, StoryHighlight,
  LoginSession, AuthAccount, SupportTicket
} from '../types';
import { CURRENT_USER, MOCK_USERS, MOCK_POSTS, MOCK_HIGHLIGHTS } from '../data/mockData';

export const MOCK_BRAND_CAMPAIGNS: BrandCampaign[] = [
  {
    id: 'camp_01',
    brandName: 'CyberVolt Dynamics',
    brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    category: 'Gaming & Audio Gear',
    title: 'Next-Gen 120Hz Ultra-Low Latency Headset Launch',
    description: 'Showcase audio spatial fidelity and latency tests in a 60-second high-energy Reel or Story carousel.',
    deliverables: ['sponsored_reel', 'story_mention'],
    budgetINR: 35000,
    slotsAvailable: 5,
    slotsFilled: 2,
    deadline: 'In 12 days',
    minFollowersRequired: 500,
    status: 'active',
    rating: 4.9,
    verifiedBrand: true,
  },
  {
    id: 'camp_02',
    brandName: 'NeoVision Spatial OS',
    brandLogo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
    category: 'Software & Privacy Tools',
    title: 'Zero-Data-Leak Mobile Security Awareness Campaign',
    description: 'Educate creators on hardware DRM, screen-recording blocks, and confidential end-to-end communication.',
    deliverables: ['carousel_post', 'dedicated_video'],
    budgetINR: 50000,
    slotsAvailable: 3,
    slotsFilled: 1,
    deadline: 'In 8 days',
    minFollowersRequired: 500,
    status: 'active',
    rating: 5.0,
    verifiedBrand: true,
  },
  {
    id: 'camp_03',
    brandName: 'Prism Sound Labs',
    brandLogo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    category: 'Synthesizers & Audio Plugins',
    title: 'Analog Darkwave Synth Plugin Sound Design Review',
    description: 'Produce an original beat or short reel utilizing Prism presets with audio credit in caption.',
    deliverables: ['sponsored_reel'],
    budgetINR: 22000,
    slotsAvailable: 10,
    slotsFilled: 6,
    deadline: 'In 15 days',
    minFollowersRequired: 500,
    status: 'active',
    rating: 4.8,
    verifiedBrand: true,
  },
  {
    id: 'camp_04',
    brandName: 'Kuro Urban Apparel',
    brandLogo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&auto=format&fit=crop&q=80',
    category: 'Streetwear & Lifestyle',
    title: 'Tokyo Cyberpunk Autumn Streetwear Lookbook',
    description: 'Photo carousel styling Kuro modular jacket and minimalist accessories in urban night atmosphere.',
    deliverables: ['carousel_post', 'story_mention'],
    budgetINR: 18000,
    slotsAvailable: 8,
    slotsFilled: 4,
    deadline: 'In 20 days',
    minFollowersRequired: 500,
    status: 'active',
    rating: 4.7,
    verifiedBrand: true,
  },
];

export const MOCK_BRAND_DEALS: BrandDeal[] = [
  {
    id: 'deal_01',
    campaignId: 'camp_01',
    campaignTitle: 'Next-Gen 120Hz Ultra-Low Latency Headset Launch',
    brandName: 'CyberVolt Dynamics',
    brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    creatorId: CURRENT_USER.id,
    creatorUsername: CURRENT_USER.username,
    dealAmountINR: 35000,
    deliverable: 'sponsored_reel',
    status: 'accepted',
    deadline: 'Nov 14, 2026',
    createdAt: '2 days ago',
    chatMessages: [
      { id: 'm1', sender: 'brand', text: 'Hi Alex! We love your Tokyo aesthetic. Would you create a 45s reel featuring our headset?', timestamp: '2 days ago', proposedAmountINR: 30000 },
      { id: 'm2', sender: 'creator', text: 'Thank you! I would love to. Since I deliver 120Hz master export, my rate for this tier is ₹35,000.', timestamp: '1 day ago', proposedAmountINR: 35000 },
      { id: 'm3', sender: 'brand', text: 'Agreed! Deal locked at ₹35,000. Funds placed in escrow. Please submit the draft once ready.', timestamp: '1 day ago' },
    ],
    rating: 5.0,
  },
  {
    id: 'deal_02',
    campaignId: 'camp_03',
    campaignTitle: 'Analog Darkwave Synth Plugin Sound Design Review',
    brandName: 'Prism Sound Labs',
    brandLogo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    creatorId: CURRENT_USER.id,
    creatorUsername: CURRENT_USER.username,
    dealAmountINR: 22000,
    deliverable: 'sponsored_reel',
    status: 'approved_paid',
    submittedContentUrl: '/src/assets/images/vibespace_reel_tokyo_1793677134321.jpg',
    deadline: 'Nov 02, 2026',
    createdAt: '1 week ago',
    chatMessages: [
      { id: 'm1', sender: 'brand', text: 'Draft looks phenomenal! Payment released from escrow.', timestamp: 'Yesterday' },
    ],
    rating: 5.0,
    review: 'Outstanding production quality and timely delivery. 10/10 recommended creator.',
  },
];

export const MOCK_VIRTUAL_GIFTS: VirtualGift[] = [
  { id: 'gift_rose', name: 'Floating Rose', icon: '🌹', coinCost: 10, cashValueINR: 5, animation: 'rose_petal', category: 'popular' },
  { id: 'gift_diamond', name: 'Cyber Diamond', icon: '💎', coinCost: 50, cashValueINR: 25, animation: 'diamond_sparkle', category: 'vip' },
  { id: 'gift_rocket', name: 'Super Rocket', icon: '🚀', coinCost: 200, cashValueINR: 100, animation: 'rocket_launch', category: 'vip' },
  { id: 'gift_crown', name: 'Neon Crown', icon: '👑', coinCost: 500, cashValueINR: 250, animation: 'crown_glow', category: 'epic' },
  { id: 'gift_phoenix', name: 'Galactic Phoenix', icon: '🔥', coinCost: 1000, cashValueINR: 500, animation: 'phoenix_fire', category: 'epic' },
];

export const MOCK_SUBSCRIPTIONS: PaidSubscription[] = [
  {
    id: 'sub_01',
    creatorId: CURRENT_USER.id,
    subscriberId: MOCK_USERS[0].id,
    subscriberUser: MOCK_USERS[0],
    plan: 'monthly',
    monthlyPriceINR: 299,
    status: 'active',
    startedAt: 'Oct 12, 2026',
    renewsAt: 'Nov 12, 2026',
    badgeLevel: 'Gold VIP',
  },
  {
    id: 'sub_02',
    creatorId: CURRENT_USER.id,
    subscriberId: MOCK_USERS[1].id,
    subscriberUser: MOCK_USERS[1],
    plan: 'monthly',
    monthlyPriceINR: 299,
    status: 'active',
    startedAt: 'Oct 20, 2026',
    renewsAt: 'Nov 20, 2026',
    badgeLevel: 'Gold VIP',
  },
  {
    id: 'sub_03',
    creatorId: CURRENT_USER.id,
    subscriberId: MOCK_USERS[2].id,
    subscriberUser: MOCK_USERS[2],
    plan: 'monthly',
    monthlyPriceINR: 299,
    status: 'active',
    startedAt: 'Oct 28, 2026',
    renewsAt: 'Nov 28, 2026',
    badgeLevel: 'Silver Supporter',
  },
];

export const MOCK_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wdr_101',
    creatorId: CURRENT_USER.id,
    amountINR: 25000,
    platformFeeINR: 0,
    tdsAmountINR: 250,
    netPayoutINR: 24750,
    payoutMethod: 'upi',
    payoutDestination: 'alex_creator@okhdfcbank',
    status: 'paid',
    requestedAt: 'Oct 25, 2026',
    processedAt: 'Oct 26, 2026',
    transactionReference: 'UPI-HDFC-9928174829',
    receiptNumber: 'VIBE-PAY-2026-1049',
  },
  {
    id: 'wdr_102',
    creatorId: CURRENT_USER.id,
    amountINR: 15000,
    platformFeeINR: 0,
    tdsAmountINR: 150,
    netPayoutINR: 14850,
    payoutMethod: 'bank_transfer',
    payoutDestination: 'HDFC Bank - A/C ***4921',
    status: 'paid',
    requestedAt: 'Sep 30, 2026',
    processedAt: 'Oct 01, 2026',
    transactionReference: 'NEFT-AXIS-881920381',
    receiptNumber: 'VIBE-PAY-2026-0922',
  },
];

export const MOCK_CHANNELS: Channel[] = [
  {
    id: 'ch_01',
    ownerId: MOCK_USERS[0].id,
    name: 'Elena Visual Studio',
    handle: '@elena_studio',
    avatar: MOCK_USERS[0].avatar,
    bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    description: 'Masterclasses on brutalist spatial UI, micro-interactions, and 120Hz gesture physics. Publishing weekly breakdowns.',
    category: 'Design & Tech',
    subscribersCount: 148000,
    isSubscribed: true,
    customUrl: 'vibespace.com/c/elenastudio',
    createdAt: 'Jan 2025',
    verified: true,
    communityPosts: [
      {
        id: 'cp_01',
        channelId: 'ch_01',
        content: 'Which design aesthetic should we build in tomorrow’s 4K live stream? Vote below! 👇',
        pollOptions: [
          { id: 'po_1', text: 'Liquid Glass 🔮', votes: 1420 },
          { id: 'po_2', text: 'Cyberpunk Industrial ⚡', votes: 890 },
          { id: 'po_3', text: 'Minimalist Brutalism 🏛️', votes: 2150 },
        ],
        likesCount: 840,
        commentsCount: 64,
        timestamp: '3h ago',
      },
    ],
    analytics: {
      totalViews: 1240000,
      totalReelViews: 3890000,
      watchTimeHours: 42100,
      subscribersGained: 12400,
      totalLikes: 489000,
      totalShares: 94000,
      topVideos: [
        { title: 'Designing for 120Hz Screens', views: 420000, date: '2 weeks ago' },
        { title: 'Zero-Latency Motion Architecture', views: 310000, date: '1 month ago' },
        { title: 'The Death of Cookie-Cutter SaaS', views: 510000, date: '2 months ago' },
      ],
      audienceRetention: 78.4,
    },
  },
  {
    id: 'ch_02',
    ownerId: MOCK_USERS[1].id,
    name: 'CyberCode Lab',
    handle: '@cybercode',
    avatar: MOCK_USERS[1].avatar,
    bannerUrl: '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg',
    description: 'Hardware encryption, zero-data-leak microservices, and WebRTC ultra low latency engineering.',
    category: 'Engineering & Privacy',
    subscribersCount: 92400,
    isSubscribed: false,
    customUrl: 'vibespace.com/c/cybercode',
    createdAt: 'Mar 2025',
    verified: true,
    communityPosts: [
      {
        id: 'cp_02',
        channelId: 'ch_02',
        content: 'New benchmark results: FLAG_SECURE on Android 15 prevents screen-mirroring frame capture with 0% CPU overhead.',
        likesCount: 1980,
        commentsCount: 112,
        timestamp: '1d ago',
      },
    ],
    analytics: {
      totalViews: 890000,
      totalReelViews: 2450000,
      watchTimeHours: 29800,
      subscribersGained: 8900,
      totalLikes: 312000,
      totalShares: 72000,
      topVideos: [
        { title: 'Breaking Down E2EE Key Exchanges', views: 390000, date: '3 weeks ago' },
        { title: 'Real-Time SFU Video Architecture', views: 280000, date: '1 month ago' },
      ],
      audienceRetention: 82.1,
    },
  },
];

export const MOCK_LIVE_STREAMS: LiveStream[] = [
  {
    id: 'live_01',
    user: MOCK_USERS[0],
    title: 'Late Night Spatial Glass UI Prototyping & Q&A 🎨',
    category: 'Design & Code',
    coverUrl: '/src/assets/images/vibespace_story_portrait_1793677134555.jpg',
    streamUrl: '/src/assets/images/vibespace_story_portrait_1793677134555.jpg',
    viewerCount: 1842,
    peakViewerCount: 2410,
    likesCount: 9480,
    startedAt: '34m ago',
    isLive: true,
    guests: [MOCK_USERS[1]],
  },
  {
    id: 'live_02',
    user: MOCK_USERS[1],
    title: 'Cyberpunk Modular Synths & Live Sound Synthesis ⚡',
    category: 'Music & Audio',
    coverUrl: '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg',
    streamUrl: '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg',
    viewerCount: 4210,
    peakViewerCount: 5120,
    likesCount: 18420,
    startedAt: '1h 12m ago',
    isLive: true,
  },
  {
    id: 'live_03',
    user: MOCK_USERS[2],
    title: 'Tokyo Night Transit Testing · 120Hz Zero-Frame Drop 🚀',
    category: 'Travel & Tech',
    coverUrl: '/src/assets/images/vibespace_reel_tokyo_1793677134321.jpg',
    streamUrl: '/src/assets/images/vibespace_reel_tokyo_1793677134321.jpg',
    viewerCount: 3150,
    peakViewerCount: 3890,
    likesCount: 12400,
    startedAt: '18m ago',
    isLive: true,
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    type: 'live',
    user: MOCK_USERS[0],
    message: 'is live now: "Late Night Spatial Glass UI Prototyping 🎨"',
    timestamp: 'Just now',
    isRead: false,
    targetId: 'live_01',
  },
  {
    id: 'notif_02',
    type: 'channel_milestone',
    user: CURRENT_USER,
    message: '🎉 Congratulations! You have exceeded 1,000 Genuine Followers. You can now Create Your Channel!',
    timestamp: '2h ago',
    isRead: false,
  },
  {
    id: 'notif_03',
    type: 'subscribe',
    user: MOCK_USERS[2],
    message: 'subscribed to your creator updates.',
    timestamp: '4h ago',
    isRead: true,
  },
  {
    id: 'notif_04',
    type: 'like',
    user: MOCK_USERS[3],
    message: 'liked your post: "Minimalist brutalist sanctuary in Kyoto."',
    timestamp: '6h ago',
    isRead: true,
  },
];

export const MOCK_ADMIN_REPORTS: AdminReport[] = [
  {
    id: 'rep_01',
    reportedBy: MOCK_USERS[2],
    targetType: 'post',
    targetId: 'post_01',
    targetTitle: 'Reflections after the midnight drizzle',
    reason: 'Suspicious third-party scraper telemetry detected on media container.',
    status: 'pending',
    timestamp: '25m ago',
  },
  {
    id: 'rep_02',
    reportedBy: MOCK_USERS[1],
    targetType: 'user',
    targetId: 'usr_bot_99',
    targetTitle: '@fast_followers_bot',
    reason: 'Automated fake follower farm attempting follow burst.',
    status: 'pending',
    timestamp: '1h ago',
  },
  {
    id: 'rep_03',
    reportedBy: MOCK_USERS[0],
    targetType: 'live',
    targetId: 'live_02',
    targetTitle: 'Cyberpunk Modular Synths',
    reason: 'DMCA Audio test match (Flagged & Verified Clean).',
    status: 'resolved',
    timestamp: '3h ago',
  },
];

// Reactive Global Social Store
class SocialStore {
  private posts: Post[] = [...MOCK_POSTS];
  private liveStreams: LiveStream[] = [...MOCK_LIVE_STREAMS];
  private channels: Channel[] = [...MOCK_CHANNELS];
  private notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];
  private adminReports: AdminReport[] = [...MOCK_ADMIN_REPORTS];
  private userFollowersCount: number = CURRENT_USER.followersCount; // 14,820 default
  private userHasChannel: boolean = false;
  private userChannel: Channel | null = null;
  private listeners: (() => void)[] = [];

  // User Profile & Settings State
  private currentUser: User = { ...CURRENT_USER };
  private allUsers: User[] = [CURRENT_USER, ...MOCK_USERS];
  private followRequests: FollowRequest[] = [
    {
      id: 'freq_1',
      user: {
        id: 'usr_freq_1',
        username: 'cyber_nomad',
        fullName: 'Devon Miles',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        verified: false,
        followersCount: 1240,
        followingCount: 320,
        bio: 'Remote engineer & spatial computing enthusiast',
      },
      timestamp: '2h ago',
    },
    {
      id: 'freq_2',
      user: {
        id: 'usr_freq_2',
        username: 'solaris_design',
        fullName: 'Claire Chen',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        verified: true,
        followersCount: 18900,
        followingCount: 420,
        bio: 'Solarpunk & generative 3D art director',
      },
      timestamp: '1d ago',
    },
  ];
  private userPasswordHash: string = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  private authAccounts: AuthAccount[] = [
    {
      id: CURRENT_USER.id,
      username: CURRENT_USER.username,
      fullName: CURRENT_USER.fullName,
      avatar: CURRENT_USER.avatar,
      email: 'manya087741@gmail.com',
      phone: '+91 98765 43210',
      accountType: 'creator',
      isCurrent: true,
      unreadCount: 3,
    },
    {
      id: MOCK_USERS[0].id,
      username: MOCK_USERS[0].username,
      fullName: MOCK_USERS[0].fullName,
      avatar: MOCK_USERS[0].avatar,
      email: 'elena.design@vibespace.net',
      phone: '+1 (555) 392-8812',
      accountType: 'creator',
      isCurrent: false,
      unreadCount: 1,
    },
  ];
  private userSettings: UserSettings = {
    email: 'manya087741@gmail.com',
    emailVerified: true,
    phone: '+91 98765 43210',
    phoneVerified: true,
    gender: 'Prefer not to say',
    birthday: '1998-08-14',
    accountType: 'creator',
    accountCreationDate: 'October 12, 2024',
    isDeactivated: false,
    twoFactorEnabled: true,
    twoFactorMethod: 'sms',
    securityAlerts: true,
    suspiciousLoginAlerts: true,
    recoveryCodes: [
      'VIBE-8921-9942',
      'VIBE-3341-8891',
      'VIBE-7729-1142',
      'VIBE-5520-4491',
      'VIBE-9912-3301',
    ],
    loginActivity: [
      { id: 'sess_1', device: 'iPhone 16 Pro', os: 'iOS 18.2', browser: 'VibeSpace App v4.2', location: 'Bengaluru, Karnataka, India', ip: '103.21.244.18', time: 'Active now', isCurrent: true, trusted: true },
      { id: 'sess_2', device: 'MacBook Pro 16"', os: 'macOS Sonoma', browser: 'Chrome 131.0', location: 'Tokyo, Japan', ip: '133.242.18.99', time: '2 hours ago', isCurrent: false, trusted: true },
      { id: 'sess_3', device: 'iPad Air 5th Gen', os: 'iPadOS 18.1', browser: 'Mobile Safari', location: 'Mumbai, Maharashtra, India', ip: '49.36.128.4', time: 'Yesterday', isCurrent: false, trusted: false },
    ],
    trustedDevices: ['iPhone 16 Pro', 'MacBook Pro 16"'],
    isPrivate: false,
    whoCanFollow: 'everyone',
    whoCanMessage: 'everyone',
    whoCanTag: 'everyone',
    whoCanMention: 'everyone',
    whoCanComment: 'everyone',
    commentFilterOffensive: true,
    hiddenWords: ['spam', 'free followers', 'crypto scam', 'click link in bio'],
    activityStatus: true,
    readReceipts: true,
    hideStoryFromUserIds: [],
    closeFriendsUserIds: ['usr_01', 'usr_02'],
    blockedUserIds: ['usr_05'],
    restrictedUserIds: [],
    mutedUserIds: [],
    notifications: {
      pauseAll: false,
      likes: true,
      comments: true,
      followers: true,
      followRequests: true,
      messages: true,
      stories: true,
      liveBroadcasts: true,
      reels: true,
      mentionsTags: true,
      subscriptions: true,
      brandDeals: true,
      earnings: true,
      pushEnabled: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    storyPrivacy: 'everyone',
    storyReplies: 'everyone',
    allowStorySharing: true,
    saveStoryToArchive: true,
    saveStoryToGallery: false,
    allowReelDownload: true,
    allowReelRemix: true,
    allowReelSharing: true,
    autoCaptions: true,
    uploadQuality: 'ultra',
    dataSaverMode: false,
    messageRequestsPermission: 'everyone',
    groupChatPermissions: 'everyone',
    voiceCallPermissions: 'everyone',
    videoCallPermissions: 'everyone',
    chatTheme: 'violet',
    hiddenRequestsCount: 2,
    favoriteAccountIds: ['usr_01'],
    sensitiveContent: 'standard',
    interestedTopics: ['Technology', 'Design', 'Music', 'Urban Exploration', 'Security'],
    searchHistory: ['#CyberpunkRealism', 'elena_design', 'Tokyo Night', '#ArchitectureDaily'],
    hiddenPostIds: [],
    language: 'English (US)',
    theme: 'dark',
    fontSize: 'medium',
    reduceMotion: false,
    highContrast: false,
    autoPlayVideos: 'always',
    highestQualityUploads: true,
    cacheSizeMB: 142.8,
    isProfessionalAccount: true,
    professionalCategory: 'Digital Creator',
    brandPartnershipActive: true,
    supportTickets: [
      {
        id: 'tkt_101',
        subject: '120Hz Ultra Mode Ingestion Test',
        category: 'general',
        description: 'Verified hardware acceleration and DRM watermarking latency.',
        status: 'resolved',
        submittedAt: '3 days ago',
        response: 'All hardware flags PASSED. Your device profile is running optimal 120 FPS pipeline.',
      },
    ],
    accountStanding: 'good_standing',
  };
  private userAnalytics: UserProfileAnalytics = {
    accountsReached: 124800,
    accountsEngaged: 38400,
    profileActivity: 19200,
    impressions30Days: 482900,
    followerGrowthPercent: 14.8,
    topAudienceCity: 'Tokyo, Bengaluru, Berlin',
    topAudienceAge: '18–34 yrs (82%)',
  };
  private savedPostIds: Set<string> = new Set(['post_02', 'post_01']);

  // Creator Monetization & Earning state
  private monetizationProfile: MonetizationProfile = {
    userId: CURRENT_USER.id,
    isEligible: true,
    isApproved: true,
    hasAgreedToTerms: true,
    emailVerified: true,
    mobileVerified: true,
    communityGuidelinesClean: true,
    enabledStreams: {
      brandDeals: true,
      subscriptions: true,
      virtualGifts: true,
      videoAds: true,
    },
    subscriptionPriceINR: 299,
    paymentDetails: {
      payoutMethod: 'upi',
      upiId: 'alex_creator@okhdfcbank',
      bankAccountName: 'Alex Thorne',
      bankAccountNumber: '50100492817291',
      bankIfscCode: 'HDFC0001249',
      bankName: 'HDFC Bank, Bandra Kurla Complex',
    },
    kycStatus: 'verified',
    panNumber: 'ABCDE1234F',
    idDocumentName: 'PAN_Card_Alex_Thorne.pdf',
    verifiedAt: 'Oct 01, 2026',
  };

  private creatorWallet: CreatorWallet = {
    totalLifetimeEarningsINR: 84500,
    availableBalanceINR: 28400,
    pendingEscrowBalanceINR: 15000,
    brandDealEarningsINR: 42000,
    subscriptionEarningsINR: 18500,
    giftEarningsINR: 14200,
    adRevenueEarningsINR: 9800,
    userCoinBalance: 450,
  };

  private brandCampaigns: BrandCampaign[] = [...MOCK_BRAND_CAMPAIGNS];
  private brandDeals: BrandDeal[] = [...MOCK_BRAND_DEALS];
  private subscriptions: PaidSubscription[] = [...MOCK_SUBSCRIPTIONS];
  private virtualGifts: VirtualGift[] = [...MOCK_VIRTUAL_GIFTS];
  private giftTransactions: GiftTransaction[] = [];
  private withdrawals: WithdrawalRequest[] = [...MOCK_WITHDRAWALS];
  private adminMonetizationConfig: AdminMonetizationConfig = {
    minFollowersRequired: 500,
    subscriptionCommissionPercent: 15,
    giftCommissionPercent: 20,
    brandDealPlatformFeePercent: 10,
    adRevenueSharePercent: 55,
    minWithdrawalINR: 1000,
    tdsPercent: 1,
    platformTotalGMVINR: 1250000,
    platformTotalRevenueINR: 187500,
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedPosts = localStorage.getItem('vibespace_posts');
      if (storedPosts) this.posts = JSON.parse(storedPosts);

      const storedChannels = localStorage.getItem('vibespace_channels');
      if (storedChannels) this.channels = JSON.parse(storedChannels);

      const storedUserChannel = localStorage.getItem('vibespace_user_channel');
      if (storedUserChannel) {
        this.userChannel = JSON.parse(storedUserChannel);
        this.userHasChannel = true;
      }

      const storedFollowers = localStorage.getItem('vibespace_followers_count');
      if (storedFollowers) this.userFollowersCount = parseInt(storedFollowers, 10);

      const storedWallet = localStorage.getItem('vibespace_wallet');
      if (storedWallet) this.creatorWallet = JSON.parse(storedWallet);

      const storedProfile = localStorage.getItem('vibespace_monetization_profile');
      if (storedProfile) this.monetizationProfile = JSON.parse(storedProfile);

      const storedDeals = localStorage.getItem('vibespace_brand_deals');
      if (storedDeals) this.brandDeals = JSON.parse(storedDeals);

      const storedWithdrawals = localStorage.getItem('vibespace_withdrawals');
      if (storedWithdrawals) this.withdrawals = JSON.parse(storedWithdrawals);
    } catch {
      // Safe fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('vibespace_posts', JSON.stringify(this.posts));
      localStorage.setItem('vibespace_channels', JSON.stringify(this.channels));
      localStorage.setItem('vibespace_followers_count', this.userFollowersCount.toString());
      localStorage.setItem('vibespace_wallet', JSON.stringify(this.creatorWallet));
      localStorage.setItem('vibespace_monetization_profile', JSON.stringify(this.monetizationProfile));
      localStorage.setItem('vibespace_brand_deals', JSON.stringify(this.brandDeals));
      localStorage.setItem('vibespace_withdrawals', JSON.stringify(this.withdrawals));
      if (this.userChannel) {
        localStorage.setItem('vibespace_user_channel', JSON.stringify(this.userChannel));
      } else {
        localStorage.removeItem('vibespace_user_channel');
      }
    } catch {
      // Safe fallback
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  // --- POSTS ---
  getPosts(): Post[] {
    return this.posts;
  }

  addPost(newPost: Post) {
    this.posts = [newPost, ...this.posts];
    this.notify();
  }

  deletePost(postId: string) {
    this.posts = this.posts.filter((p) => p.id !== postId);
    this.notify();
  }

  likePost(postId: string) {
    this.posts = this.posts.map((p) => {
      if (p.id === postId) {
        const nextLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });
    this.notify();
  }

  bookmarkPost(postId: string) {
    this.posts = this.posts.map((p) => {
      if (p.id === postId) {
        return { ...p, hasBookmarked: !p.hasBookmarked };
      }
      return p;
    });
    this.notify();
  }

  addComment(postId: string, text: string) {
    this.posts = this.posts.map((p) => {
      if (p.id === postId) {
        const newC = {
          id: 'cm_' + Date.now().toString(36),
          username: CURRENT_USER.username,
          avatar: CURRENT_USER.avatar,
          text,
          timestamp: 'Just now',
          likes: 0,
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [newC, ...p.comments],
        };
      }
      return p;
    });
    this.notify();
  }

  // --- 500 FOLLOWERS MONETIZATION & 1K CHANNEL ELIGIBILITY ---
  getUserFollowersCount(): number {
    return this.userFollowersCount;
  }

  isMonetizationEligible(): boolean {
    return this.userFollowersCount >= (this.adminMonetizationConfig?.minFollowersRequired || 500);
  }

  isChannelEligible(): boolean {
    return this.userFollowersCount >= 1000;
  }

  setFollowersCount(count: number) {
    this.userFollowersCount = Math.max(0, count);
    this.checkFollowerMilestones();
    this.notify();
  }

  simulateFollowerChange(delta: number) {
    this.userFollowersCount = Math.max(0, this.userFollowersCount + delta);
    this.checkFollowerMilestones();
    this.notify();
  }

  simulateSetFollowers(count: number) {
    this.userFollowersCount = Math.max(0, count);
    this.checkFollowerMilestones();
    this.notify();
  }

  private checkFollowerMilestones() {
    // 500 Followers Milestone - Monetization Unlock
    if (this.userFollowersCount >= 500 && !this.notifications.some((n) => n.type === 'monetization_unlocked')) {
      this.addNotification({
        id: 'notif_monetize_' + Date.now(),
        type: 'monetization_unlocked',
        user: CURRENT_USER,
        message: '💰 Congratulations! 500 Genuine Followers reached. Creator Monetization & Earning Hub is now unlocked!',
        timestamp: 'Just now',
        isRead: false,
      });
    }

    // 1,000 Followers Milestone - Channel Creation Unlock
    if (this.userFollowersCount >= 1000 && !this.notifications.some((n) => n.type === 'channel_milestone')) {
      this.addNotification({
        id: 'notif_channel_' + Date.now(),
        type: 'channel_milestone',
        user: CURRENT_USER,
        message: '🎉 1,000 Genuine Followers reached! Channel creation unlocked.',
        timestamp: 'Just now',
        isRead: false,
      });
    }
  }

  // --- CHANNELS ---
  getChannels(): Channel[] {
    return this.channels;
  }

  getUserChannel(): Channel | null {
    return this.userChannel;
  }

  createChannel(data: {
    name: string;
    handle: string;
    description: string;
    category: string;
    avatar: string;
    bannerUrl: string;
    customUrl: string;
  }): { success: boolean; error?: string } {
    if (!this.isChannelEligible()) {
      return { success: false, error: 'Requirement not met: Minimum 1,000 Genuine Followers required to create a channel.' };
    }

    const newChannel: Channel = {
      id: 'ch_user_' + Date.now().toString(36),
      ownerId: CURRENT_USER.id,
      name: data.name,
      handle: data.handle.startsWith('@') ? data.handle : `@${data.handle}`,
      avatar: data.avatar || CURRENT_USER.avatar,
      bannerUrl: data.bannerUrl,
      description: data.description,
      category: data.category,
      subscribersCount: 1,
      isSubscribed: true,
      customUrl: data.customUrl || `vibespace.com/c/${data.handle.replace('@', '')}`,
      createdAt: 'Just now',
      verified: true,
      communityPosts: [],
      analytics: {
        totalViews: 0,
        totalReelViews: 0,
        watchTimeHours: 0,
        subscribersGained: 1,
        totalLikes: 0,
        totalShares: 0,
        topVideos: [],
        audienceRetention: 100,
      },
    };

    this.userChannel = newChannel;
    this.userHasChannel = true;
    this.channels = [newChannel, ...this.channels];
    this.notify();
    return { success: true };
  }

  toggleSubscribeChannel(channelId: string) {
    this.channels = this.channels.map((ch) => {
      if (ch.id === channelId) {
        const nextSub = !ch.isSubscribed;
        return {
          ...ch,
          isSubscribed: nextSub,
          subscribersCount: nextSub ? ch.subscribersCount + 1 : Math.max(0, ch.subscribersCount - 1),
        };
      }
      return ch;
    });

    if (this.userChannel && this.userChannel.id === channelId) {
      this.userChannel.isSubscribed = !this.userChannel.isSubscribed;
      this.userChannel.subscribersCount += this.userChannel.isSubscribed ? 1 : -1;
    }

    this.notify();
  }

  addCommunityPost(channelId: string, content: string, imageUrl?: string, pollOptions?: string[]) {
    const post: any = {
      id: 'cp_' + Date.now().toString(36),
      channelId,
      content,
      imageUrl,
      likesCount: 0,
      commentsCount: 0,
      timestamp: 'Just now',
      pollOptions: pollOptions?.map((opt, i) => ({ id: `p_${i}`, text: opt, votes: 0 })),
    };

    this.channels = this.channels.map((ch) => {
      if (ch.id === channelId) {
        return {
          ...ch,
          communityPosts: [post, ...(ch.communityPosts || [])],
        };
      }
      return ch;
    });

    if (this.userChannel && this.userChannel.id === channelId) {
      this.userChannel.communityPosts = [post, ...(this.userChannel.communityPosts || [])];
    }

    this.notify();
  }

  // --- LIVE STREAMS ---
  getLiveStreams(): LiveStream[] {
    return this.liveStreams;
  }

  startLiveStream(title: string, category: string, coverUrl: string): LiveStream {
    const newStream: LiveStream = {
      id: 'live_user_' + Date.now().toString(36),
      user: CURRENT_USER,
      title,
      category,
      coverUrl: coverUrl || CURRENT_USER.avatar,
      viewerCount: 1,
      peakViewerCount: 1,
      likesCount: 0,
      startedAt: 'Just now',
      isLive: true,
      guests: [],
      isChatMuted: false,
    };

    this.liveStreams = [newStream, ...this.liveStreams];
    this.notify();
    return newStream;
  }

  endLiveStream(streamId: string) {
    this.liveStreams = this.liveStreams.filter((ls) => ls.id !== streamId);
    this.notify();
  }

  // --- NOTIFICATIONS ---
  getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  addNotification(notif: NotificationItem) {
    this.notifications = [notif, ...this.notifications];
    this.notify();
  }

  markAllNotificationsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.notify();
  }

  // --- ADMIN REPORTS ---
  getAdminReports(): AdminReport[] {
    return this.adminReports;
  }

  resolveReport(reportId: string, action: 'resolved' | 'dismissed') {
    this.adminReports = this.adminReports.map((r) => {
      if (r.id === reportId) {
        return { ...r, status: action };
      }
      return r;
    });
    this.notify();
  }

  // ==========================================
  // CREATOR MONETIZATION & EARNING METHODS
  // ==========================================

  getMonetizationProfile(): MonetizationProfile {
    return {
      ...this.monetizationProfile,
      isEligible: this.isMonetizationEligible(),
    };
  }

  updateMonetizationProfile(data: Partial<MonetizationProfile>) {
    this.monetizationProfile = {
      ...this.monetizationProfile,
      ...data,
    };
    this.notify();
  }

  submitKYC(panNumber: string, idDocumentName: string) {
    this.monetizationProfile = {
      ...this.monetizationProfile,
      panNumber,
      idDocumentName,
      kycStatus: 'pending',
    };
    this.notify();
  }

  verifyKYC(status: 'verified' | 'rejected', reason?: string) {
    this.monetizationProfile = {
      ...this.monetizationProfile,
      kycStatus: status,
      verifiedAt: status === 'verified' ? 'Just now' : undefined,
      rejectionReason: reason,
    };
    this.notify();
  }

  updatePaymentDetails(details: MonetizationProfile['paymentDetails']) {
    this.monetizationProfile.paymentDetails = {
      ...this.monetizationProfile.paymentDetails,
      ...details,
    };
    this.notify();
  }

  getCreatorWallet(): CreatorWallet {
    return this.creatorWallet;
  }

  // --- BRAND DEALS & CAMPAIGNS ---
  getBrandCampaigns(): BrandCampaign[] {
    return this.brandCampaigns;
  }

  addBrandCampaign(campaignData: Omit<BrandCampaign, 'id' | 'slotsFilled' | 'rating' | 'verifiedBrand'>): BrandCampaign {
    const newCamp: BrandCampaign = {
      ...campaignData,
      id: 'camp_' + Date.now().toString(36),
      slotsFilled: 0,
      rating: 5.0,
      verifiedBrand: true,
    };
    this.brandCampaigns = [newCamp, ...this.brandCampaigns];
    this.notify();
    return newCamp;
  }

  getBrandDeals(): BrandDeal[] {
    return this.brandDeals;
  }

  applyForBrandCampaign(
    campaignId: string,
    proposalText: string,
    deliverable: 'sponsored_reel' | 'carousel_post' | 'story_mention' | 'dedicated_video',
    requestedAmountINR: number
  ): BrandDeal {
    const camp = this.brandCampaigns.find((c) => c.id === campaignId);
    const newDeal: BrandDeal = {
      id: 'deal_' + Date.now().toString(36),
      campaignId,
      campaignTitle: camp ? camp.title : 'Custom Collaboration',
      brandName: camp ? camp.brandName : 'Direct Partner',
      brandLogo: camp ? camp.brandLogo : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      creatorId: CURRENT_USER.id,
      creatorUsername: CURRENT_USER.username,
      dealAmountINR: requestedAmountINR,
      deliverable,
      status: 'applied',
      deadline: camp ? camp.deadline : 'In 14 days',
      createdAt: 'Just now',
      chatMessages: [
        {
          id: 'msg_' + Date.now(),
          sender: 'creator',
          text: proposalText,
          timestamp: 'Just now',
          proposedAmountINR: requestedAmountINR,
        },
      ],
    };

    this.brandDeals = [newDeal, ...this.brandDeals];
    this.notify();
    return newDeal;
  }

  sendBrandDealMessage(dealId: string, sender: 'brand' | 'creator', text: string, proposedAmountINR?: number) {
    this.brandDeals = this.brandDeals.map((deal) => {
      if (deal.id === dealId) {
        const nextAmount = proposedAmountINR || deal.dealAmountINR;
        const nextStatus = proposedAmountINR ? 'negotiating' : deal.status;
        return {
          ...deal,
          dealAmountINR: nextAmount,
          status: nextStatus,
          chatMessages: [
            ...deal.chatMessages,
            {
              id: 'msg_' + Date.now().toString(36),
              sender,
              text,
              timestamp: 'Just now',
              proposedAmountINR,
            },
          ],
        };
      }
      return deal;
    });
    this.notify();
  }

  acceptBrandDeal(dealId: string) {
    this.brandDeals = this.brandDeals.map((deal) => {
      if (deal.id === dealId) {
        // Escrow funds reserved
        this.creatorWallet.pendingEscrowBalanceINR += deal.dealAmountINR;
        return {
          ...deal,
          status: 'accepted',
          chatMessages: [
            ...deal.chatMessages,
            {
              id: 'msg_escrow_' + Date.now(),
              sender: 'brand',
              text: `✅ Deal terms confirmed at ₹${deal.dealAmountINR.toLocaleString()}. Funds have been secured in escrow. Please submit your draft!`,
              timestamp: 'Just now',
            },
          ],
        };
      }
      return deal;
    });
    this.notify();
  }

  submitDealContent(dealId: string, contentUrl: string, notes: string) {
    this.brandDeals = this.brandDeals.map((deal) => {
      if (deal.id === dealId) {
        return {
          ...deal,
          status: 'content_submitted',
          submittedContentUrl: contentUrl,
          submissionNotes: notes,
          chatMessages: [
            ...deal.chatMessages,
            {
              id: 'msg_sub_' + Date.now(),
              sender: 'creator',
              text: `🚀 Deliverable submitted for review! Notes: "${notes}"`,
              timestamp: 'Just now',
            },
          ],
        };
      }
      return deal;
    });
    this.notify();
  }

  approveAndPayDeal(dealId: string) {
    this.brandDeals = this.brandDeals.map((deal) => {
      if (deal.id === dealId) {
        const amount = deal.dealAmountINR;
        // Move from escrow to available balance
        this.creatorWallet.pendingEscrowBalanceINR = Math.max(0, this.creatorWallet.pendingEscrowBalanceINR - amount);
        this.creatorWallet.availableBalanceINR += amount;
        this.creatorWallet.brandDealEarningsINR += amount;
        this.creatorWallet.totalLifetimeEarningsINR += amount;

        // Platform fee
        const platformFee = Math.round((amount * this.adminMonetizationConfig.brandDealPlatformFeePercent) / 100);
        this.adminMonetizationConfig.platformTotalGMVINR += amount;
        this.adminMonetizationConfig.platformTotalRevenueINR += platformFee;

        this.addNotification({
          id: 'notif_deal_paid_' + Date.now(),
          type: 'brand_deal_offer',
          user: CURRENT_USER,
          message: `💰 ${deal.brandName} approved your deliverable! ₹${amount.toLocaleString()} credited to your Available Balance.`,
          timestamp: 'Just now',
          isRead: false,
          amountINR: amount,
        });

        return {
          ...deal,
          status: 'approved_paid',
          rating: 5.0,
          review: 'Exceptional visual polish and flawless brand messaging.',
          chatMessages: [
            ...deal.chatMessages,
            {
              id: 'msg_paid_' + Date.now(),
              sender: 'brand',
              text: `🎉 Content approved! Escrow of ₹${amount.toLocaleString()} has been released directly into your wallet. Thank you for an amazing collab!`,
              timestamp: 'Just now',
            },
          ],
        };
      }
      return deal;
    });
    this.notify();
  }

  // --- PAID SUBSCRIPTIONS ---
  getSubscriptions(): PaidSubscription[] {
    return this.subscriptions;
  }

  toggleCreatorSubscription(creatorId: string, plan: 'monthly' | 'annual' = 'monthly') {
    const existing = this.subscriptions.find((s) => s.creatorId === creatorId && s.subscriberId === CURRENT_USER.id);
    if (existing) {
      this.subscriptions = this.subscriptions.filter((s) => s.id !== existing.id);
    } else {
      const price = this.monetizationProfile.subscriptionPriceINR || 299;
      const newSub: PaidSubscription = {
        id: 'sub_' + Date.now().toString(36),
        creatorId,
        subscriberId: CURRENT_USER.id,
        subscriberUser: CURRENT_USER,
        plan,
        monthlyPriceINR: price,
        status: 'active',
        startedAt: 'Today',
        renewsAt: 'In 30 days',
        badgeLevel: 'Gold VIP',
      };
      this.subscriptions = [newSub, ...this.subscriptions];

      // Add to creator wallet
      this.creatorWallet.availableBalanceINR += price;
      this.creatorWallet.subscriptionEarningsINR += price;
      this.creatorWallet.totalLifetimeEarningsINR += price;

      const commission = Math.round((price * this.adminMonetizationConfig.subscriptionCommissionPercent) / 100);
      this.adminMonetizationConfig.platformTotalGMVINR += price;
      this.adminMonetizationConfig.platformTotalRevenueINR += commission;

      this.addNotification({
        id: 'notif_sub_' + Date.now(),
        type: 'subscribe',
        user: CURRENT_USER,
        message: `🌟 New Gold VIP Member! You earned ₹${price} from a new monthly paid subscription.`,
        timestamp: 'Just now',
        isRead: false,
        amountINR: price,
      });
    }
    this.notify();
  }

  // --- VIRTUAL GIFTS & COIN WALLET ---
  getVirtualGifts(): VirtualGift[] {
    return this.virtualGifts;
  }

  getGiftTransactions(): GiftTransaction[] {
    return this.giftTransactions;
  }

  buyCoinPack(coins: number, priceINR: number) {
    this.creatorWallet.userCoinBalance += coins;
    this.adminMonetizationConfig.platformTotalGMVINR += priceINR;
    this.adminMonetizationConfig.platformTotalRevenueINR += Math.round(priceINR * 0.3); // 30% platform margin on coins
    this.notify();
  }

  sendVirtualGift(
    creatorId: string,
    giftId: string,
    context: 'live_stream' | 'reel' | 'post' | 'profile'
  ): { success: boolean; message?: string } {
    const gift = this.virtualGifts.find((g) => g.id === giftId);
    if (!gift) return { success: false, message: 'Gift not found' };

    if (this.creatorWallet.userCoinBalance < gift.coinCost) {
      return { success: false, message: `Insufficient coins. Need ${gift.coinCost} coins.` };
    }

    // Deduct coins from sender
    this.creatorWallet.userCoinBalance -= gift.coinCost;

    // Credit cash value to creator wallet
    const cashValue = gift.cashValueINR;
    this.creatorWallet.availableBalanceINR += cashValue;
    this.creatorWallet.giftEarningsINR += cashValue;
    this.creatorWallet.totalLifetimeEarningsINR += cashValue;

    const tx: GiftTransaction = {
      id: 'gtx_' + Date.now().toString(36),
      senderUser: CURRENT_USER,
      creatorId,
      gift,
      coins: gift.coinCost,
      cashValueINR: cashValue,
      context,
      timestamp: 'Just now',
    };
    this.giftTransactions = [tx, ...this.giftTransactions];

    this.addNotification({
      id: 'notif_gift_' + Date.now(),
      type: 'gift_received',
      user: CURRENT_USER,
      message: `🎁 ${CURRENT_USER.fullName} sent you a ${gift.name} ${gift.icon}! +₹${cashValue} added to your balance.`,
      timestamp: 'Just now',
      isRead: false,
      amountINR: cashValue,
    });

    this.notify();
    return { success: true };
  }

  // --- WITHDRAWALS & PAYOUTS ---
  getWithdrawals(): WithdrawalRequest[] {
    return this.withdrawals;
  }

  requestWithdrawal(
    amountINR: number,
    payoutMethod: 'upi' | 'bank_transfer',
    destination: string
  ): { success: boolean; message?: string; request?: WithdrawalRequest } {
    // 1. Check KYC
    if (this.monetizationProfile.kycStatus !== 'verified') {
      return { success: false, message: 'KYC Verification (PAN/ID) is required before requesting withdrawals.' };
    }

    // 2. Minimum limit
    const minLimit = this.adminMonetizationConfig.minWithdrawalINR || 1000;
    if (amountINR < minLimit) {
      return { success: false, message: `Minimum withdrawal amount is ₹${minLimit.toLocaleString()}.` };
    }

    // 3. Balance check
    if (amountINR > this.creatorWallet.availableBalanceINR) {
      return { success: false, message: 'Requested amount exceeds your available balance.' };
    }

    // 4. Calculate TDS (1% Indian Section 194-O) and platform processing
    const tdsAmount = Math.round((amountINR * (this.adminMonetizationConfig.tdsPercent || 1)) / 100);
    const netPayout = amountINR - tdsAmount;

    // Deduct from available balance
    this.creatorWallet.availableBalanceINR -= amountINR;

    const newRequest: WithdrawalRequest = {
      id: 'wdr_' + Date.now().toString(36),
      creatorId: CURRENT_USER.id,
      amountINR,
      platformFeeINR: 0,
      tdsAmountINR: tdsAmount,
      netPayoutINR: netPayout,
      payoutMethod,
      payoutDestination: destination,
      status: 'processing',
      requestedAt: 'Just now',
      receiptNumber: `VIBE-PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    this.withdrawals = [newRequest, ...this.withdrawals];
    this.notify();
    return { success: true, request: newRequest };
  }

  approveWithdrawal(withdrawalId: string) {
    this.withdrawals = this.withdrawals.map((w) => {
      if (w.id === withdrawalId) {
        const ref = w.payoutMethod === 'upi' ? `UPI-REF-${Date.now().toString().slice(-8)}` : `NEFT-REF-${Date.now().toString().slice(-8)}`;
        this.addNotification({
          id: 'notif_payout_' + Date.now(),
          type: 'withdrawal_paid',
          user: CURRENT_USER,
          message: `🏦 Payout of ₹${w.netPayoutINR.toLocaleString()} has been successfully transferred to ${w.payoutDestination}! Ref: ${ref}`,
          timestamp: 'Just now',
          isRead: false,
          amountINR: w.netPayoutINR,
        });

        return {
          ...w,
          status: 'paid',
          processedAt: 'Just now',
          transactionReference: ref,
        };
      }
      return w;
    });
    this.notify();
  }

  rejectWithdrawal(withdrawalId: string, reason: string) {
    this.withdrawals = this.withdrawals.map((w) => {
      if (w.id === withdrawalId) {
        // Refund amount back to available balance
        this.creatorWallet.availableBalanceINR += w.amountINR;
        return {
          ...w,
          status: 'rejected',
        };
      }
      return w;
    });
    this.notify();
  }

  // --- ADMIN CONFIG ---
  getAdminMonetizationConfig(): AdminMonetizationConfig {
    return this.adminMonetizationConfig;
  }

  updateAdminMonetizationConfig(config: Partial<AdminMonetizationConfig>) {
    this.adminMonetizationConfig = {
      ...this.adminMonetizationConfig,
      ...config,
    };
    this.notify();
  }

  // --- USER PROFILE & CONNECTION METHODS ---
  getCurrentUser(): User {
    return this.currentUser;
  }

  updateCurrentUser(updates: Partial<User>): User {
    this.currentUser = {
      ...this.currentUser,
      ...updates,
    };
    this.allUsers = this.allUsers.map((u) => (u.id === this.currentUser.id ? this.currentUser : u));
    this.notify();
    return this.currentUser;
  }

  getUserById(userId: string): User | undefined {
    if (userId === this.currentUser.id) return this.currentUser;
    return this.allUsers.find((u) => u.id === userId);
  }

  getUserByUsername(username: string): User | undefined {
    const clean = username.replace(/^@/, '').toLowerCase();
    if (this.currentUser.username.toLowerCase() === clean) return this.currentUser;
    return this.allUsers.find((u) => u.username.toLowerCase() === clean);
  }

  getAllUsers(): User[] {
    return this.allUsers;
  }

  checkUsernameAvailability(username: string, excludeUserId?: string): boolean {
    const clean = username.trim().toLowerCase().replace(/^@/, '');
    if (!clean || clean.length < 3) return false;
    return !this.allUsers.some(
      (u) => u.username.toLowerCase() === clean && (!excludeUserId || u.id !== excludeUserId)
    );
  }

  toggleFollowUser(userId: string): { isFollowing: boolean; newFollowersCount: number } {
    let result = { isFollowing: false, newFollowersCount: 0 };
    this.allUsers = this.allUsers.map((u) => {
      if (u.id === userId) {
        const nextFollowing = !u.isFollowing;
        const newCount = nextFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1);
        result = { isFollowing: nextFollowing, newFollowersCount: newCount };
        return {
          ...u,
          isFollowing: nextFollowing,
          followersCount: newCount,
        };
      }
      return u;
    });

    if (result.isFollowing) {
      this.currentUser.followingCount += 1;
    } else {
      this.currentUser.followingCount = Math.max(0, this.currentUser.followingCount - 1);
    }

    this.notify();
    return result;
  }

  getFollowers(userId?: string): User[] {
    return this.allUsers.filter((u) => u.id !== (userId || this.currentUser.id));
  }

  getFollowing(userId?: string): User[] {
    return this.allUsers.filter((u) => u.id !== (userId || this.currentUser.id) && u.isFollowing);
  }

  getFollowRequests(): FollowRequest[] {
    return this.followRequests;
  }

  acceptFollowRequest(requestId: string) {
    const req = this.followRequests.find((r) => r.id === requestId);
    if (req) {
      this.followRequests = this.followRequests.filter((r) => r.id !== requestId);
      this.currentUser.followersCount += 1;
      this.allUsers.push({ ...req.user, isFollowedBy: true });
      this.notify();
    }
  }

  declineFollowRequest(requestId: string) {
    this.followRequests = this.followRequests.filter((r) => r.id !== requestId);
    this.notify();
  }

  removeFollower(followerUserId: string) {
    this.currentUser.followersCount = Math.max(0, this.currentUser.followersCount - 1);
    this.allUsers = this.allUsers.map((u) => {
      if (u.id === followerUserId) {
        return { ...u, isFollowedBy: false };
      }
      return u;
    });
    this.notify();
  }

  toggleBlockUser(userId: string): boolean {
    let isBlocked = false;
    this.allUsers = this.allUsers.map((u) => {
      if (u.id === userId) {
        isBlocked = !u.isBlocked;
        return { ...u, isBlocked, isFollowing: false };
      }
      return u;
    });
    this.notify();
    return isBlocked;
  }

  toggleRestrictUser(userId: string): boolean {
    let isRestricted = false;
    this.allUsers = this.allUsers.map((u) => {
      if (u.id === userId) {
        isRestricted = !u.isRestricted;
        return { ...u, isRestricted };
      }
      return u;
    });
    this.notify();
    return isRestricted;
  }

  toggleMuteUser(userId: string): boolean {
    let isMuted = false;
    this.allUsers = this.allUsers.map((u) => {
      if (u.id === userId) {
        isMuted = !u.isMuted;
        return { ...u, isMuted };
      }
      return u;
    });
    this.notify();
    return isMuted;
  }

  // --- POSTS, REELS & TAGGED QUERIES ---
  getUserPosts(userId: string): Post[] {
    const targetUserId = userId || this.currentUser.id;
    const userPosts = this.posts.filter((p) => p.user.id === targetUserId);
    // Sort pinned posts first
    const pinned = this.currentUser.pinnedPostIds || [];
    return [...userPosts].sort((a, b) => {
      const aPinned = pinned.includes(a.id) ? 1 : 0;
      const bPinned = pinned.includes(b.id) ? 1 : 0;
      return bPinned - aPinned;
    });
  }

  getUserSavedPosts(): Post[] {
    return this.posts.filter((p) => this.savedPostIds.has(p.id) || p.hasBookmarked);
  }

  getUserTaggedPosts(userId: string): Post[] {
    const targetUser = this.getUserById(userId);
    const username = targetUser ? targetUser.username.toLowerCase() : '';
    // Return posts where user is mentioned or sample tagged
    const found = this.posts.filter(
      (p) =>
        p.user.id !== userId &&
        (p.caption.toLowerCase().includes(`@${username}`) ||
          p.tags.some((t) => t.toLowerCase().includes(username)))
    );
    if (found.length > 0) return found;
    // Fallback: return top 2 posts with tagged label
    return this.posts.slice(1, 3);
  }

  togglePinPost(postId: string): boolean {
    const pinned = this.currentUser.pinnedPostIds || [];
    let isNowPinned = false;
    if (pinned.includes(postId)) {
      this.currentUser.pinnedPostIds = pinned.filter((id) => id !== postId);
      isNowPinned = false;
    } else {
      if (pinned.length >= 3) {
        this.currentUser.pinnedPostIds = [...pinned.slice(1), postId];
      } else {
        this.currentUser.pinnedPostIds = [...pinned, postId];
      }
      isNowPinned = true;
    }

    this.posts = this.posts.map((p) => ({
      ...p,
      isPinned: this.currentUser.pinnedPostIds?.includes(p.id),
    }));

    this.notify();
    return isNowPinned;
  }

  toggleBookmarkPost(postId: string): boolean {
    let isBookmarked = false;
    if (this.savedPostIds.has(postId)) {
      this.savedPostIds.delete(postId);
      isBookmarked = false;
    } else {
      this.savedPostIds.add(postId);
      isBookmarked = true;
    }

    this.posts = this.posts.map((p) =>
      p.id === postId ? { ...p, hasBookmarked: isBookmarked } : p
    );

    this.notify();
    return isBookmarked;
  }

  getUserSettings(): UserSettings {
    return this.userSettings;
  }

  updateUserSettings(updates: Partial<UserSettings>): UserSettings {
    this.userSettings = {
      ...this.userSettings,
      ...updates,
    };
    if (updates.isPrivate !== undefined) {
      this.currentUser.isPrivateAccount = updates.isPrivate;
    }
    this.notify();
    return this.userSettings;
  }

  getUserAnalytics(): UserProfileAnalytics {
    return this.userAnalytics;
  }

  getUserHighlights(userId?: string): StoryHighlight[] {
    return MOCK_HIGHLIGHTS;
  }

  getAuthAccounts(): AuthAccount[] {
    return this.authAccounts;
  }

  switchAuthAccount(userId: string): User {
    const targetAccount = this.authAccounts.find((a) => a.id === userId);
    if (!targetAccount) return this.currentUser;

    this.authAccounts = this.authAccounts.map((a) => ({
      ...a,
      isCurrent: a.id === userId,
    }));

    const matchedUser = this.allUsers.find((u) => u.id === userId) || {
      id: targetAccount.id,
      username: targetAccount.username,
      fullName: targetAccount.fullName,
      avatar: targetAccount.avatar,
      verified: true,
      followersCount: 1420,
      followingCount: 310,
      isProfessionalAccount: targetAccount.accountType !== 'personal',
    };

    this.currentUser = matchedUser;
    this.userSettings.accountType = targetAccount.accountType;
    this.userSettings.email = targetAccount.email;
    this.userSettings.phone = targetAccount.phone;

    this.notify();
    return this.currentUser;
  }

  addAuthAccount(account: AuthAccount): void {
    if (!this.authAccounts.some((a) => a.id === account.id)) {
      this.authAccounts.push(account);
      this.notify();
    }
  }

  removeAuthAccount(userId: string): void {
    this.authAccounts = this.authAccounts.filter((a) => a.id !== userId);
    if (this.authAccounts.length > 0 && this.currentUser.id === userId) {
      this.switchAuthAccount(this.authAccounts[0].id);
    } else {
      this.notify();
    }
  }

  loginUser(identifier: string, password?: string, rememberMe = true): { success: boolean; message: string; user?: User } {
    const cleanId = identifier.trim().toLowerCase();
    const userFound = this.allUsers.find(
      (u) =>
        u.username.toLowerCase() === cleanId ||
        u.fullName.toLowerCase() === cleanId ||
        (u.professionalEmail && u.professionalEmail.toLowerCase() === cleanId)
    ) || (cleanId.includes('manya') || cleanId.includes('alex') ? this.currentUser : null);

    if (userFound) {
      this.currentUser = userFound;
      const existing = this.authAccounts.find((a) => a.id === userFound.id);
      if (!existing) {
        this.authAccounts.push({
          id: userFound.id,
          username: userFound.username,
          fullName: userFound.fullName,
          avatar: userFound.avatar,
          email: userFound.professionalEmail || `${userFound.username}@vibespace.net`,
          phone: userFound.phoneNumber || '+91 98765 43210',
          accountType: userFound.isProfessionalAccount ? 'creator' : 'personal',
          isCurrent: true,
        });
      }
      this.authAccounts = this.authAccounts.map((a) => ({
        ...a,
        isCurrent: a.id === userFound.id,
      }));
      this.notify();
      return { success: true, message: `Welcome back, @${userFound.username}!`, user: userFound };
    }

    const newUser: User = {
      id: 'usr_' + Date.now().toString(36),
      username: cleanId.replace(/[^a-z0-9_]/gi, '') || 'vibe_member',
      fullName: identifier.split('@')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      verified: false,
      followersCount: 0,
      followingCount: 1,
      isProfessionalAccount: false,
      bio: 'New VibeSpace community member 🚀',
    };
    this.allUsers.push(newUser);
    this.currentUser = newUser;
    this.authAccounts.push({
      id: newUser.id,
      username: newUser.username,
      fullName: newUser.fullName,
      avatar: newUser.avatar,
      email: identifier.includes('@') ? identifier : `${cleanId}@vibespace.net`,
      phone: '+91 98765 00000',
      accountType: 'personal',
      isCurrent: true,
    });
    this.authAccounts = this.authAccounts.map((a) => ({ ...a, isCurrent: a.id === newUser.id }));
    this.notify();
    return { success: true, message: `Account authenticated for @${newUser.username}`, user: newUser };
  }

  loginWithOtp(contact: string, otp: string): { success: boolean; message: string; user?: User } {
    if (otp !== '123456' && otp.length !== 6) {
      return { success: false, message: 'Invalid 6-digit verification code. Please check and try again.' };
    }
    return this.loginUser(contact);
  }

  registerUser(details: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    birthday: string;
    gender: string;
    avatar?: string;
    accountType?: 'personal' | 'creator' | 'business';
  }): { success: boolean; message: string; user?: User } {
    const isAvail = this.checkUsernameAvailability(details.username);
    if (!isAvail) {
      return { success: false, message: 'This username is already taken or invalid.' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now().toString(36),
      username: details.username.toLowerCase(),
      fullName: details.fullName,
      avatar: details.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      verified: false,
      followersCount: 0,
      followingCount: 5,
      isProfessionalAccount: details.accountType !== 'personal',
      category: details.accountType === 'creator' ? 'Digital Creator' : details.accountType === 'business' ? 'Brand / Business' : undefined,
      professionalEmail: details.email,
      phoneNumber: details.phone,
      bio: 'Exploring privacy-first social horizons on VibeSpace ✨',
    };

    this.allUsers.push(newUser);
    this.currentUser = newUser;
    this.userSettings = {
      ...this.userSettings,
      email: details.email,
      emailVerified: true,
      phone: details.phone,
      phoneVerified: true,
      gender: details.gender,
      birthday: details.birthday,
      accountType: details.accountType || 'personal',
      accountCreationDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };

    const newAuthAccount: AuthAccount = {
      id: newUser.id,
      username: newUser.username,
      fullName: newUser.fullName,
      avatar: newUser.avatar,
      email: details.email,
      phone: details.phone,
      accountType: details.accountType || 'personal',
      isCurrent: true,
    };
    this.authAccounts = this.authAccounts.map((a) => ({ ...a, isCurrent: false }));
    this.authAccounts.unshift(newAuthAccount);

    this.notify();
    return { success: true, message: 'Account registered and secured successfully!', user: newUser };
  }

  verifyPassword(password: string): boolean {
    return password.length >= 6;
  }

  changePassword(oldPass: string, newPass: string): { success: boolean; message: string } {
    if (newPass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters with mixed symbols.' };
    }
    this.userPasswordHash = 'hash_' + Date.now().toString(36);
    this.notify();
    return { success: true, message: 'Password updated and verified with E2EE key rotation.' };
  }

  deactivateAccount(): void {
    this.userSettings.isDeactivated = true;
    this.notify();
  }

  deleteAccountPermanently(): void {
    this.posts = this.posts.filter((p) => p.user.id !== this.currentUser.id);
    this.userSettings.isDeactivated = true;
    if (this.authAccounts.length > 1) {
      const remaining = this.authAccounts.filter((a) => a.id !== this.currentUser.id);
      this.authAccounts = remaining;
      this.switchAuthAccount(remaining[0].id);
    }
    this.notify();
  }

  removeDeviceSession(sessionId: string): void {
    this.userSettings.loginActivity = this.userSettings.loginActivity.filter((s) => s.id !== sessionId);
    this.notify();
  }

  logoutAllOtherDevices(): void {
    this.userSettings.loginActivity = this.userSettings.loginActivity.filter((s) => s.isCurrent);
    this.notify();
  }

  generateRecoveryCodes(): string[] {
    const codes = Array.from({ length: 5 }, () => `VIBE-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
    this.userSettings.recoveryCodes = codes;
    this.notify();
    return codes;
  }

  clearSearchHistory(): void {
    this.userSettings.searchHistory = [];
    this.notify();
  }

  clearAppCache(): number {
    const freedMB = this.userSettings.cacheSizeMB;
    this.userSettings.cacheSizeMB = 4.2;
    this.notify();
    return freedMB;
  }

  submitSupportTicket(ticket: Omit<SupportTicket, 'id' | 'submittedAt' | 'status'>): SupportTicket {
    const newTicket: SupportTicket = {
      ...ticket,
      id: 'tkt_' + Date.now().toString(36),
      status: 'open',
      submittedAt: 'Just now',
    };
    if (!this.userSettings.supportTickets) {
      this.userSettings.supportTickets = [];
    }
    this.userSettings.supportTickets.unshift(newTicket);
    this.notify();
    return newTicket;
  }

  getSupportTickets(): SupportTicket[] {
    return this.userSettings.supportTickets || [];
  }
}

export const socialStore = new SocialStore();
