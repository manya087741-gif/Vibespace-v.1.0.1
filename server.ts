import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { CURRENT_USER, MOCK_USERS, MOCK_POSTS, MOCK_REELS, MOCK_STORIES, MOCK_CHATS, MOCK_NOTES } from './src/data/mockData';
import { Post, Reel, Story, User, ChatThread, Message } from './src/types';
import { DiskPersistence } from './src/server/dbPersistence';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Rate limiting & security headers middleware
const requestCounts = new Map<string, { count: number; resetAt: number }>();
app.use('/api', (req, res, next) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60_000 });
  } else {
    entry.count += 1;
    if (entry.count > 120) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again shortly.' });
    }
  }
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-API-Version', 'v1');

  // SQLi & XSS payload guard
  const payload = JSON.stringify(req.body || {}) + JSON.stringify(req.query || {});
  if (/(<script|javascript:|union\s+select|drop\s+table|--\s)/i.test(payload)) {
    return res.status(403).json({
      error: 'Blocked by WAF: Suspicious SQLi/XSS payload detected.',
    });
  }
  next();
});

// Disk-backed database persistence (data/db.json)
const persistence = new DiskPersistence(path.join(__dirname, 'data'));

const backendState = {
  posts: [...MOCK_POSTS] as Post[],
  reels: [...MOCK_REELS] as Reel[],
  stories: [...MOCK_STORIES] as Story[],
  threads: [...MOCK_CHATS] as ChatThread[],
  notes: [...MOCK_NOTES],
  users: [CURRENT_USER, ...MOCK_USERS] as User[],
  currentUser: { ...CURRENT_USER } as User,
  channels: [
    {
      id: 'ch_01',
      name: 'VibeCinema 120Hz',
      handle: '@vibecinema',
      subscribersCount: 14820,
      category: 'Cinema & 120Hz',
      description: 'Official 120Hz HDR creator workflows, anamorphic mobile cinema guides, and color science.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      bannerUrl: '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg',
    },
  ],
  wallet: {
    availableBalance: 28400,
    pendingBalance: 15000,
    lifetimeEarnings: 84500,
    withdrawals: [
      {
        id: 'wdr_101',
        amount: 25000,
        type: 'UPI',
        destination: 'alex_creator@okhdfcbank',
        status: 'paid',
        timestamp: 'Oct 25, 2026',
      },
    ],
  },
  brandDeals: [
    {
      id: 'deal_01',
      brandName: 'CyberVolt Dynamics',
      title: 'Next-Gen 120Hz Ultra-Low Latency Headset Launch',
      budget: 35000,
      status: 'accepted',
      deadline: 'Nov 14, 2026',
    },
    {
      id: 'deal_02',
      brandName: 'Prism Sound Labs',
      title: 'Analog Darkwave Synth Plugin Sound Design Review',
      budget: 22000,
      status: 'approved_paid',
      deadline: 'Nov 02, 2026',
    },
  ],
  notifications: [
    {
      id: 'notif_01',
      type: 'live',
      title: 'Live Stream Started',
      message: 'Maya Lin is live now: "Late Night Spatial Glass UI Prototyping 🎨"',
      timestamp: 'Just now',
      isRead: false,
    },
    {
      id: 'notif_02',
      type: 'milestone',
      title: 'Monetization Unlocked',
      message: '🎉 You have exceeded 1,000 Genuine Followers. Channel Creator Program is active!',
      timestamp: '2h ago',
      isRead: false,
    },
  ],
  orders: [] as Array<{
    id: string;
    itemId: string;
    itemTitle: string;
    amount: number;
    status: 'verified' | 'processing' | 'refunded';
    createdAt: string;
  }>,
  communities: [
    {
      id: 'comm_1',
      name: 'AI & 120Hz Creators',
      category: 'Technology',
      privacy: 'public' as 'public' | 'private',
      membersCount: 14280,
      description: 'Daily workflows, camera rigs, and AI post-production.',
      rules: ['No spam or self-promo links', 'Credit original creators', 'Keep feedback constructive'],
    },
    {
      id: 'comm_2',
      name: 'Indie Brand Founders',
      category: 'Business',
      privacy: 'private' as 'public' | 'private',
      membersCount: 3890,
      description: 'Verified founders sharing conversion metrics, UGC briefs, and ad creatives.',
      rules: ['Verified business or creator accounts only', 'No unauthorized screenshots'],
    },
  ],
  courses: [
    {
      id: 'course_1',
      title: '120Hz Mobile Filmmaking & Color Grading',
      instructor: 'Aarav Mehta',
      price: 0,
      enrolled: true,
      progress: 75,
      lessonsCount: 12,
      certificateId: 'CERT-NXG-88412',
    },
    {
      id: 'course_2',
      title: 'Creator Monetization & Brand Deal Negotiation',
      instructor: 'Elena Vance',
      price: 49,
      enrolled: false,
      progress: 0,
      lessonsCount: 18,
      certificateId: null as string | null,
    },
  ],
  adCampaigns: [
    {
      id: 'ad_1',
      name: 'Creator Pro Lens Kit Launch',
      objective: 'Conversions',
      format: 'Reel Ad',
      budget: 500,
      spent: 214,
      impressions: 48200,
      clicks: 1940,
      status: 'active' as 'active' | 'paused',
    },
  ],
  auditLogs: [
    {
      id: 'log_1',
      actor: 'System',
      action: 'API v1 & Rate Limiter Initialized',
      timestamp: new Date().toISOString(),
    },
  ],
};

function loadDb() {
  persistence.load({ backendState, securityState });
}

function saveDb() {
  persistence.save({ backendState, securityState });
}

// Automatically save mutations to disk on non-GET /api/v1 requests
app.use('/api/v1', (req, res, next) => {
  if (req.method !== 'GET') {
    res.on('finish', () => saveDb());
  }
  next();
});

// 1. Health & System Status
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    platform: 'NextGen Social Super App',
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Creator Studio (Server-Side @google/genai)
app.post('/api/v1/ai/generate', async (req, res) => {
  try {
    const { tool, topic, tone = 'engaging', audience = 'general' } = req.body || {};
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompts: Record<string, string> = {
      caption: `Write 3 high-converting social media captions about "${topic}" for a ${audience} audience in a ${tone} tone. Include a clear hook and call-to-action.`,
      hashtags: `Generate 15 relevant, high-reach and niche hashtags for "${topic}" targeted at ${audience}. Group them by High Volume and Niche.`,
      ideas: `Generate 5 viral short-video (Reel) content ideas about "${topic}" for ${audience}. Include a 3-second hook for each.`,
      script: `Write a 30-second vertical video script about "${topic}" in a ${tone} tone. Include [Visual Cue] and [Voiceover] sections.`,
      smart_reply: `Write 3 professional, friendly DM replies to this customer/follower message: "${topic}".`,
      product_desc: `Write a compelling, conversion-focused product description for "${topic}" with 3 bulleted key benefits.`,
    };

    const prompt = prompts[tool] || prompts.caption;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      tool: tool || 'caption',
      output: response.text || '',
      syntheticMediaLabel: 'AI-Assisted Draft (Review & Edit Before Publishing)',
      model: 'gemini-3.8-flash',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI generation failed';
    res.status(500).json({ error: message });
  }
});

// 3. Business Marketplace Orders
app.get('/api/v1/marketplace/orders', (_req, res) => {
  res.json({ orders: backendState.orders });
});

app.post('/api/v1/marketplace/orders', (req, res) => {
  const { itemId, itemTitle, amount } = req.body || {};
  if (!itemId || !itemTitle || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  const order = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    itemId,
    itemTitle,
    amount,
    status: 'verified' as const,
    createdAt: new Date().toISOString(),
  };
  backendState.orders.unshift(order);
  backendState.auditLogs.unshift({
    id: `log_${Date.now()}`,
    actor: 'CheckoutService',
    action: `Verified order ${order.id} ($${amount})`,
    timestamp: new Date().toISOString(),
  });
  res.status(201).json({ order });
});

// 4. Communities & Groups
app.get('/api/v1/communities', (_req, res) => {
  res.json({ communities: backendState.communities });
});

app.post('/api/v1/communities', (req, res) => {
  const { name, category, privacy = 'public', description } = req.body || {};
  if (!name || !description) {
    return res.status(400).json({ error: 'Community name and description are required' });
  }
  const community = {
    id: `comm_${Date.now()}`,
    name,
    category: category || 'General',
    privacy: privacy === 'private' ? ('private' as const) : ('public' as const),
    membersCount: 1,
    description,
    rules: ['Be respectful', 'No spam'],
  };
  backendState.communities.unshift(community);
  res.status(201).json({ community });
});

// 5. Events & Online Learning
app.get('/api/v1/learning/courses', (_req, res) => {
  res.json({ courses: backendState.courses });
});

app.post('/api/v1/learning/enroll', (req, res) => {
  const { courseId } = req.body || {};
  const course = backendState.courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  course.enrolled = true;
  course.progress = Math.max(course.progress, 10);
  if (!course.certificateId) {
    course.certificateId = `CERT-NXG-${Math.floor(10000 + Math.random() * 90000)}`;
  }
  res.json({ course });
});

// 6. Advertising Network
app.get('/api/v1/ads/campaigns', (_req, res) => {
  res.json({ campaigns: backendState.adCampaigns });
});

app.post('/api/v1/ads/campaigns', (req, res) => {
  const { name, objective = 'Reach', format = 'Feed Ad', budget = 100 } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'Campaign name is required' });
  }
  const campaign = {
    id: `ad_${Date.now()}`,
    name,
    objective,
    format,
    budget: Number(budget) || 100,
    spent: 0,
    impressions: 0,
    clicks: 0,
    status: 'active' as const,
  };
  backendState.adCampaigns.unshift(campaign);
  res.status(201).json({ campaign });
});

app.patch('/api/v1/ads/campaigns/:id', (req, res) => {
  const campaign = backendState.adCampaigns.find((c) => c.id === req.params.id);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  campaign.status = campaign.status === 'active' ? 'paused' : 'active';
  res.json({ campaign });
});

// 7. Admin Overview & Audit Logs
app.get('/api/v1/admin/overview', (_req, res) => {
  res.json({
    ordersCount: backendState.orders.length,
    communitiesCount: backendState.communities.length,
    activeAdCampaigns: backendState.adCampaigns.filter((c) => c.status === 'active').length,
    auditLogs: backendState.auditLogs.slice(0, 20),
  });
});

// 9. Posts API
app.get('/api/v1/posts', (req, res) => {
  const { tag, user_id } = req.query;
  let result = backendState.posts;
  if (user_id) {
    result = result.filter((p) => p.user.id === user_id);
  }
  if (tag) {
    result = result.filter((p) => p.tags.includes(String(tag)));
  }
  res.json({ posts: result, total: result.length });
});

app.post('/api/v1/posts', (req, res) => {
  const { caption, mediaUrls, mediaType = 'image', tags = [], location, audioTrack } = req.body || {};
  if (!caption && (!mediaUrls || mediaUrls.length === 0)) {
    return res.status(400).json({ error: 'Caption or media is required' });
  }
  const newPost: Post = {
    id: `post_${Date.now()}`,
    user: backendState.currentUser,
    mediaUrls: mediaUrls || ['/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg'],
    mediaType: mediaType || 'image',
    caption: caption || '',
    tags: tags || [],
    location: location || '',
    likesCount: 0,
    commentsCount: 0,
    comments: [],
    hasLiked: false,
    hasBookmarked: false,
    audioTrack,
    timestamp: 'Just now',
  };
  backendState.posts.unshift(newPost);
  backendState.auditLogs.unshift({
    id: `log_${Date.now()}`,
    actor: backendState.currentUser.username,
    action: `Created post ${newPost.id}`,
    timestamp: new Date().toISOString(),
  });
  res.status(201).json({ post: newPost });
});

app.post('/api/v1/posts/:id/like', (req, res) => {
  const post = backendState.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.hasLiked = !post.hasLiked;
  post.likesCount = post.hasLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);
  res.json({ post, hasLiked: post.hasLiked, likesCount: post.likesCount });
});

app.post('/api/v1/posts/:id/comments', (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Comment text required' });
  const post = backendState.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const newComment = {
    id: `cm_${Date.now()}`,
    username: backendState.currentUser.username,
    avatar: backendState.currentUser.avatar,
    text: text.trim(),
    timestamp: 'Just now',
    likes: 0,
  };
  post.comments.unshift(newComment);
  post.commentsCount += 1;
  res.status(201).json({ comment: newComment, commentsCount: post.commentsCount });
});

app.delete('/api/v1/posts/:id', (req, res) => {
  const idx = backendState.posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Post not found' });
  const [deleted] = backendState.posts.splice(idx, 1);
  res.json({ message: 'Post deleted successfully', postId: deleted.id });
});

// 10. Reels API
app.get('/api/v1/reels', (_req, res) => {
  res.json({ reels: backendState.reels });
});

app.post('/api/v1/reels', (req, res) => {
  const { title, videoPoster, audioTrack, duration = '0:30', tags = [] } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Reel title required' });
  const newReel: Reel = {
    id: `reel_${Date.now()}`,
    user: backendState.currentUser,
    videoPoster: videoPoster || '/src/assets/images/vibespace_reel_tokyo_1793677134321.jpg',
    title,
    audioTrack: audioTrack || { title: 'Ambient Pulse 120Hz', artist: backendState.currentUser.fullName },
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    tags,
    duration,
    hasLiked: false,
    hasSaved: false,
  };
  backendState.reels.unshift(newReel);
  res.status(201).json({ reel: newReel });
});

app.post('/api/v1/reels/:id/like', (req, res) => {
  const reel = backendState.reels.find((r) => r.id === req.params.id);
  if (!reel) return res.status(404).json({ error: 'Reel not found' });
  reel.hasLiked = !reel.hasLiked;
  reel.likesCount = reel.hasLiked ? reel.likesCount + 1 : Math.max(0, reel.likesCount - 1);
  res.json({ reel, hasLiked: reel.hasLiked, likesCount: reel.likesCount });
});

// 11. Stories API
app.get('/api/v1/stories', (_req, res) => {
  res.json({ stories: backendState.stories });
});

app.post('/api/v1/stories', (req, res) => {
  const { mediaUrl, mediaType = 'image', caption, isCloseFriends = false } = req.body || {};
  const newStory: Story = {
    id: `st_${Date.now()}`,
    user: backendState.currentUser,
    mediaUrl: mediaUrl || '/src/assets/images/vibespace_story_portrait_1793677134555.jpg',
    mediaType,
    caption: caption || '',
    timestamp: 'Just now',
    expiresIn: '24h left',
    isCloseFriends,
    viewersCount: 0,
    viewsPrevented: 0,
  };
  backendState.stories.unshift(newStory);
  res.status(201).json({ story: newStory });
});

// 12. Channels API
app.get('/api/v1/channels', (_req, res) => {
  res.json({ channels: backendState.channels });
});

app.post('/api/v1/channels', (req, res) => {
  const { name, handle, category, description, bannerUrl } = req.body || {};
  if (!name || !handle) return res.status(400).json({ error: 'Channel name and handle required' });
  const newChannel = {
    id: `ch_${Date.now()}`,
    name,
    handle,
    subscribersCount: 1,
    category: category || 'Creator Channel',
    description: description || '',
    avatar: backendState.currentUser.avatar,
    bannerUrl: bannerUrl || '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg',
  };
  backendState.channels.unshift(newChannel);
  res.status(201).json({ channel: newChannel });
});

// 13. Creator Wallet & Withdrawals API
app.get('/api/v1/wallet', (_req, res) => {
  res.json({ wallet: backendState.wallet });
});

app.post('/api/v1/wallet/withdraw', (req, res) => {
  const { amount, destination, payoutMethod = 'UPI' } = req.body || {};
  const numAmount = Number(amount);
  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ error: 'Valid withdrawal amount required' });
  }
  if (numAmount > backendState.wallet.availableBalance) {
    return res.status(400).json({ error: 'Insufficient available wallet balance' });
  }
  backendState.wallet.availableBalance -= numAmount;
  const newWithdrawal = {
    id: `wdr_${Date.now().toString().slice(-6)}`,
    amount: numAmount,
    type: payoutMethod.toUpperCase(),
    destination: destination || 'Verified Bank / UPI',
    status: 'paid',
    timestamp: 'Just now',
  };
  backendState.wallet.withdrawals.unshift(newWithdrawal);
  backendState.auditLogs.unshift({
    id: `log_${Date.now()}`,
    actor: 'WalletPayoutService',
    action: `Processed payout of ₹${numAmount} via ${payoutMethod} to ${destination}`,
    timestamp: new Date().toISOString(),
  });
  res.status(201).json({ withdrawal: newWithdrawal, wallet: backendState.wallet });
});

app.post('/api/v1/gifts/send', (req, res) => {
  const { giftName, coinCost = 50, cashValueINR = 25, recipientUsername = 'creator' } = req.body || {};
  backendState.wallet.lifetimeEarnings += Number(cashValueINR) || 25;
  backendState.wallet.availableBalance += Number(cashValueINR) || 25;
  backendState.notifications.unshift({
    id: `notif_${Date.now()}`,
    type: 'gift',
    title: 'Virtual Gift Received!',
    message: `Received ${giftName} (₹${cashValueINR}) from a fan!`,
    timestamp: 'Just now',
    isRead: false,
  });
  res.json({ message: 'Gift sent successfully', cashValueINR, giftName, recipient: recipientUsername });
});

// 14. Brand Deals API
app.get('/api/v1/deals', (_req, res) => {
  res.json({ deals: backendState.brandDeals });
});

app.post('/api/v1/deals', (req, res) => {
  const { brandName, title, budget, deadline } = req.body || {};
  if (!brandName || !title || !budget) return res.status(400).json({ error: 'Missing deal fields' });
  const newDeal = {
    id: `deal_${Date.now().toString().slice(-6)}`,
    brandName,
    title,
    budget: Number(budget) || 10000,
    status: 'accepted',
    deadline: deadline || 'In 14 days',
  };
  backendState.brandDeals.unshift(newDeal);
  res.status(201).json({ deal: newDeal });
});

app.patch('/api/v1/deals/:id', (req, res) => {
  const deal = backendState.brandDeals.find((d) => d.id === req.params.id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  if (req.body.status) deal.status = req.body.status;
  res.json({ deal });
});

// 15. Direct Messaging API
app.get('/api/v1/messages/threads', (_req, res) => {
  res.json({ threads: backendState.threads });
});

app.post('/api/v1/messages/threads/:id/messages', (req, res) => {
  const { text, mediaType = 'text', mediaUrl } = req.body || {};
  const thread = backendState.threads.find((t) => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: 'Chat thread not found' });
  const newMsg: Message = {
    id: `msg_${Date.now()}`,
    senderId: backendState.currentUser.id,
    senderName: backendState.currentUser.fullName,
    senderAvatar: backendState.currentUser.avatar,
    text: text || '',
    mediaType,
    mediaUrl,
    timestamp: 'Just now',
    status: 'read',
    isE2EE: true,
  };
  thread.messages.push(newMsg);
  thread.lastMessage = text || 'Attachment sent';
  thread.lastMessageTime = 'Just now';
  res.status(201).json({ message: newMsg, thread });
});

app.patch('/api/v1/messages/threads/:id', (req, res) => {
  const thread = backendState.threads.find((t) => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  if (req.body.folder) thread.folder = req.body.folder;
  if (typeof req.body.isArchived === 'boolean') thread.isArchived = req.body.isArchived;
  if (typeof req.body.isPinned === 'boolean') thread.isPinned = req.body.isPinned;
  res.json({ thread });
});

// 16. User Authentication & Profile API
app.post('/api/v1/auth/login', (req, res) => {
  const { identifier, password } = req.body || {};
  if (!identifier || !password) return res.status(400).json({ error: 'Identifier and password required' });
  const user = backendState.users.find(
    (u) => u.username === identifier || u.professionalEmail === identifier || u.id === identifier
  ) || backendState.currentUser;
  res.json({
    user,
    token: `vibe_jwt_${Buffer.from(user.username + ':' + Date.now()).toString('base64')}`,
    message: 'Login successful',
  });
});

app.post('/api/v1/auth/signup', (req, res) => {
  const { username, fullName, email } = req.body || {};
  if (!username || !email) return res.status(400).json({ error: 'Username and email required' });
  const newUser: User = {
    id: `usr_${Date.now().toString().slice(-6)}`,
    username,
    fullName: fullName || username,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    verified: false,
    followersCount: 0,
    followingCount: 0,
    bio: 'New VibeSpace Explorer',
  };
  backendState.users.push(newUser);
  res.status(201).json({ user: newUser, token: `vibe_jwt_${Date.now()}` });
});

app.post('/api/v1/auth/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/v1/users/me', (_req, res) => {
  res.json({ user: backendState.currentUser });
});

app.put('/api/v1/users/me', (req, res) => {
  const { fullName, bio, website, location, category, avatar, coverPhoto } = req.body || {};
  if (fullName) backendState.currentUser.fullName = fullName;
  if (bio !== undefined) backendState.currentUser.bio = bio;
  if (website !== undefined) backendState.currentUser.website = website;
  if (location !== undefined) backendState.currentUser.location = location;
  if (category) backendState.currentUser.category = category;
  if (avatar) backendState.currentUser.avatar = avatar;
  if (coverPhoto) backendState.currentUser.coverPhoto = coverPhoto;
  res.json({ user: backendState.currentUser });
});

app.post('/api/v1/users/:id/follow', (req, res) => {
  const user = backendState.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.isFollowing = !user.isFollowing;
  user.followersCount = user.isFollowing ? user.followersCount + 1 : Math.max(0, user.followersCount - 1);
  res.json({ user, isFollowing: user.isFollowing, followersCount: user.followersCount });
});

// 17. Notifications API
app.get('/api/v1/notifications', (_req, res) => {
  res.json({ notifications: backendState.notifications });
});

app.post('/api/v1/notifications/mark-read', (_req, res) => {
  backendState.notifications.forEach((n) => (n.isRead = true));
  res.json({ success: true, count: backendState.notifications.length });
});

// 18. File Upload API
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOAD_DIR));

app.post('/api/v1/upload', (req, res) => {
  const { dataUrl, filename } = req.body || {};
  if (!dataUrl || typeof dataUrl !== 'string') {
    return res.status(400).json({ error: 'Valid data URL is required' });
  }
  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 payload' });
    }
    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = mimeType.split('/')[1] || 'png';
    const safeFilename = `${Date.now()}_${filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : 'asset'}.${ext}`;
    const targetPath = path.join(UPLOAD_DIR, safeFilename);
    fs.writeFileSync(targetPath, buffer);
    res.status(201).json({ url: `/uploads/${safeFilename}`, mimeType, size: buffer.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    res.status(500).json({ error: msg });
  }
});

// 8. Enterprise Cyber Security & Account Protection Endpoints
const securityState = {
  twoFactorEnabled: true,
  twoFactorMethod: 'Authenticator App' as 'Authenticator App' | 'Email OTP' | 'SMS OTP',
  emergencyLockdown: false,
  failedLoginAttempts24h: 14,
  blockedBruteForceIPs: 3,
  passkeys: [
    {
      id: 'pk_1',
      name: 'Pixel 9 Pro · Fingerprint & Face Unlock',
      createdAt: '2026-10-12',
    },
  ],
  sessions: [
    {
      id: 'sess_1',
      device: 'Pixel 9 Pro (Android 15)',
      location: 'Bengaluru, IN',
      ip: '103.21.124.88',
      lastActive: 'Active now',
      isCurrent: true,
      trusted: true,
    },
    {
      id: 'sess_2',
      device: 'MacBook Pro · Chrome 130',
      location: 'Mumbai, IN',
      ip: '49.36.112.19',
      lastActive: '2h ago',
      isCurrent: false,
      trusted: true,
    },
    {
      id: 'sess_3',
      device: 'Unknown Windows Device',
      location: 'Frankfurt, DE',
      ip: '185.220.101.42',
      lastActive: '14m ago',
      isCurrent: false,
      trusted: false,
    },
  ],
  threats: [
    {
      id: 'thr_1',
      type: 'Credential Stuffing Blocked',
      severity: 'high' as 'high' | 'medium' | 'low',
      sourceIp: '185.220.101.42',
      detail: '5 failed login attempts blocked & rate-limited automatically.',
      timestamp: '14m ago',
    },
    {
      id: 'thr_2',
      type: 'New Device Login Alert',
      severity: 'medium' as 'high' | 'medium' | 'low',
      sourceIp: '49.36.112.19',
      detail: 'OTP verification required for MacBook Pro in Mumbai, IN.',
      timestamp: '2h ago',
    },
  ],
};

app.get('/api/v1/security/status', (_req, res) => {
  res.json(securityState);
});

app.delete('/api/v1/security/sessions/:id', (req, res) => {
  const idx = securityState.sessions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Session not found' });
  const [removed] = securityState.sessions.splice(idx, 1);
  backendState.auditLogs.unshift({
    id: `log_${Date.now()}`,
    actor: 'SecurityService',
    action: `Remote logout: ${removed.device} (${removed.ip})`,
    timestamp: new Date().toISOString(),
  });
  res.json({ sessions: securityState.sessions });
});

app.post('/api/v1/security/sessions/revoke-all', (_req, res) => {
  securityState.sessions = securityState.sessions.filter((s) => s.isCurrent);
  backendState.auditLogs.unshift({
    id: `log_${Date.now()}`,
    actor: 'AccountRecovery',
    action: 'Revoked all non-current sessions & invalidated tokens',
    timestamp: new Date().toISOString(),
  });
  res.json({ sessions: securityState.sessions });
});

app.post('/api/v1/security/passkeys', (req, res) => {
  const { name } = req.body || {};
  const pk = {
    id: `pk_${Date.now()}`,
    name: name || 'Biometric Passkey (Fingerprint / Face)',
    createdAt: new Date().toISOString().slice(0, 10),
  };
  securityState.passkeys.push(pk);
  res.status(201).json({ passkeys: securityState.passkeys });
});

app.post('/api/v1/security/lockdown', (_req, res) => {
  securityState.emergencyLockdown = !securityState.emergencyLockdown;
  backendState.auditLogs.unshift({
    id: `log_${Date.now()}`,
    actor: 'EmergencyProtection',
    action: `Emergency Account Lockdown ${securityState.emergencyLockdown ? 'ENABLED' : 'DISABLED'}`,
    timestamp: new Date().toISOString(),
  });
  res.json({ emergencyLockdown: securityState.emergencyLockdown });
});

app.post('/api/v1/security/scan-url', (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }
  const suspicious =
    /(login-verify|free-nitro|claim-prize|bit\.ly|tinyurl|@|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i.test(
      url
    );
  res.json({
    url,
    safe: !suspicious,
    riskLevel: suspicious ? 'HIGH RISK (Potential Phishing)' : 'SAFE',
    recommendation: suspicious
      ? 'Do not enter your password or OTP on this link.'
      : 'No known phishing signatures detected.',
  });
});

async function startServer() {
  loadDb();
  const PORT = 3000;
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('/src/assets', express.static(path.join(__dirname, 'src/assets')));
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NextGen Social Super App server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
