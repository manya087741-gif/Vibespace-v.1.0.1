import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Users,
  GraduationCap,
  Megaphone,
  CheckCircle2,
  Award,
  Plus,
  Pause,
  Play,
  Lock,
  Globe,
  ShieldCheck,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { sound } from '../utils/audioSynth';

type HubSection = 'ai_studio' | 'marketplace' | 'communities' | 'learning' | 'ads';

interface OrderItem {
  id: string;
  itemId: string;
  itemTitle: string;
  amount: number;
  status: 'verified' | 'processing' | 'refunded';
  createdAt: string;
}

interface CommunityItem {
  id: string;
  name: string;
  category: string;
  privacy: 'public' | 'private';
  membersCount: number;
  description: string;
  rules: string[];
}

interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  price: number;
  enrolled: boolean;
  progress: number;
  lessonsCount: number;
  certificateId: string | null;
}

interface AdCampaignItem {
  id: string;
  name: string;
  objective: string;
  format: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  status: 'active' | 'paused';
}

const MARKETPLACE_CATALOG = [
  {
    id: 'prod_1',
    title: 'Anamorphic 1.33x Mobile Cinema Lens',
    seller: 'OpticPro Studio',
    category: 'Product',
    price: 129,
    rating: 4.9,
  },
  {
    id: 'prod_2',
    title: '120Hz LUTs & Sound Design Pack (40+ Assets)',
    seller: 'Aarav Mehta',
    category: 'Digital Product',
    price: 29,
    rating: 4.8,
  },
  {
    id: 'prod_3',
    title: '1-on-1 Brand Deal & Media Kit Audit',
    seller: 'Elena Vance',
    category: 'Service',
    price: 75,
    rating: 5.0,
  },
];

export const SuperAppHub: React.FC = () => {
  const [section, setSection] = useState<HubSection>('ai_studio');

  // AI Studio State
  const [aiTool, setAiTool] = useState<
    'caption' | 'hashtags' | 'ideas' | 'script' | 'smart_reply' | 'product_desc'
  >('caption');
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('engaging');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLabel, setAiLabel] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [copiedAi, setCopiedAi] = useState(false);

  // Marketplace State
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Communities State
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommPrivacy, setNewCommPrivacy] = useState<'public' | 'private'>('public');

  // Learning State
  const [courses, setCourses] = useState<CourseItem[]>([]);

  // Ads State
  const [campaigns, setCampaigns] = useState<AdCampaignItem[]>([]);
  const [newAdName, setNewAdName] = useState('');
  const [newAdBudget, setNewAdBudget] = useState('250');
  const [newAdFormat, setNewAdFormat] = useState('Reel Ad');

  useEffect(() => {
    fetch('/api/v1/marketplace/orders')
      .then((r) => r.json())
      .then((d) => d.orders && setOrders(d.orders))
      .catch(() => {});
    fetch('/api/v1/communities')
      .then((r) => r.json())
      .then((d) => d.communities && setCommunities(d.communities))
      .catch(() => {});
    fetch('/api/v1/learning/courses')
      .then((r) => r.json())
      .then((d) => d.courses && setCourses(d.courses))
      .catch(() => {});
    fetch('/api/v1/ads/campaigns')
      .then((r) => r.json())
      .then((d) => d.campaigns && setCampaigns(d.campaigns))
      .catch(() => {});
  }, []);

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;
    sound.playSparkle();
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: aiTool, topic: aiTopic, tone: aiTone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || 'Failed to generate content');
      } else {
        setAiOutput(data.output);
        setAiLabel(data.syntheticMediaLabel || 'AI-Assisted Draft');
      }
    } catch {
      setAiError('Network error contacting AI Creator Studio');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCheckout = async (item: (typeof MARKETPLACE_CATALOG)[0]) => {
    sound.playHeartPop();
    setCheckoutLoading(item.id);
    try {
      const res = await fetch('/api/v1/marketplace/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          itemTitle: item.title,
          amount: item.price,
        }),
      });
      const data = await res.json();
      if (data.order) {
        setOrders((prev) => [data.order, ...prev]);
      }
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim() || !newCommDesc.trim()) return;
    sound.playHeartPop();
    const res = await fetch('/api/v1/communities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newCommName.trim(),
        description: newCommDesc.trim(),
        privacy: newCommPrivacy,
      }),
    });
    const data = await res.json();
    if (data.community) {
      setCommunities((prev) => [data.community, ...prev]);
      setNewCommName('');
      setNewCommDesc('');
    }
  };

  const handleEnrollCourse = async (courseId: string) => {
    sound.playSparkle();
    const res = await fetch('/api/v1/learning/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json();
    if (data.course) {
      setCourses((prev) => prev.map((c) => (c.id === courseId ? data.course : c)));
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdName.trim()) return;
    sound.playHeartPop();
    const res = await fetch('/api/v1/ads/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newAdName.trim(),
        budget: Number(newAdBudget) || 250,
        format: newAdFormat,
      }),
    });
    const data = await res.json();
    if (data.campaign) {
      setCampaigns((prev) => [data.campaign, ...prev]);
      setNewAdName('');
    }
  };

  const handleToggleAd = async (id: string) => {
    sound.playHeartPop();
    const res = await fetch(`/api/v1/ads/campaigns/${id}`, { method: 'PATCH' });
    const data = await res.json();
    if (data.campaign) {
      setCampaigns((prev) => prev.map((c) => (c.id === id ? data.campaign : c)));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-900 bg-slate-950/90 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span>NextGen Super Hub</span>
            </h1>
            <p className="text-[11px] text-slate-400">
              AI Studio · Business Marketplace · Communities · Learning · Ads
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
            API v1 Live
          </span>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'ai_studio', label: 'AI Studio', icon: Sparkles },
            { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
            { id: 'communities', label: 'Communities', icon: Users },
            { id: 'learning', label: 'Learning', icon: GraduationCap },
            { id: 'ads', label: 'Ad Network', icon: Megaphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = section === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playHeartPop();
                  setSection(tab.id as HubSection);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
                  active
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {section === 'ai_studio' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">AI Creator Studio</h2>
                <span className="text-[10px] text-violet-300 bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded-full">
                  Gemini 3.8 Flash
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'caption', label: 'Captions' },
                  { id: 'hashtags', label: 'Hashtags' },
                  { id: 'ideas', label: 'Reel Ideas' },
                  { id: 'script', label: '30s Script' },
                  { id: 'smart_reply', label: 'Smart Reply' },
                  { id: 'product_desc', label: 'Product Copy' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAiTool(t.id as typeof aiTool)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-colors ${
                      aiTool === t.id
                        ? 'bg-violet-600/20 border-violet-500 text-violet-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleGenerateAI} className="space-y-2.5">
                <textarea
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  rows={2}
                  placeholder="Describe your post topic, product, or customer message..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="engaging">Engaging Tone</option>
                    <option value="professional">Professional Tone</option>
                    <option value="bold">Bold & Viral</option>
                    <option value="educational">Educational</option>
                  </select>
                  <button
                    type="submit"
                    disabled={aiLoading || !aiTopic.trim()}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Generate</span>
                  </button>
                </div>
              </form>

              {aiError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {aiError}
                </div>
              )}

              {aiOutput && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      {aiLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(aiOutput);
                        setCopiedAi(true);
                        setTimeout(() => setCopiedAi(false), 1500);
                      }}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedAi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    value={aiOutput}
                    onChange={(e) => setAiOutput(e.target.value)}
                    rows={6}
                    className="w-full bg-transparent text-xs text-slate-200 leading-relaxed focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {section === 'marketplace' && (
          <div className="space-y-4">
            <div className="space-y-2.5">
              <h2 className="text-sm font-bold text-white">Verified Business Marketplace</h2>
              {MARKETPLACE_CATALOG.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-amber-400">★ {item.rating}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1">{item.title}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{item.seller}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleCheckout(item)}
                    disabled={checkoutLoading === item.id}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shrink-0"
                  >
                    {checkoutLoading === item.id ? 'Verifying...' : `Buy $${item.price}`}
                  </button>
                </div>
              ))}
            </div>

            {orders.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-300">Verified Orders</h3>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60 last:border-0"
                  >
                    <div>
                      <span className="font-mono text-violet-300">{ord.id}</span> ·{' '}
                      <span className="text-white">{ord.itemTitle}</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">${ord.amount} Verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section === 'communities' && (
          <div className="space-y-4">
            <form
              onSubmit={handleCreateCommunity}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5"
            >
              <h2 className="text-xs font-bold text-white">Create Community</h2>
              <input
                type="text"
                value={newCommName}
                onChange={(e) => setNewCommName(e.target.value)}
                placeholder="Community name..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                value={newCommDesc}
                onChange={(e) => setNewCommDesc(e.target.value)}
                placeholder="Short description..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <div className="flex items-center justify-between">
                <select
                  value={newCommPrivacy}
                  onChange={(e) => setNewCommPrivacy(e.target.value as 'public' | 'private')}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="public">Public Community</option>
                  <option value="private">Private Community</option>
                </select>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create</span>
                </button>
              </div>
            </form>

            <div className="space-y-2.5">
              {communities.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {c.privacy === 'private' ? (
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>{c.name}</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {c.membersCount.toLocaleString()} members
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'learning' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white">Creator Courses & Verifiable Certificates</h2>
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white">{course.title}</h3>
                    <p className="text-[11px] text-slate-400">
                      By {course.instructor} · {course.lessonsCount} lessons
                    </p>
                  </div>
                  {course.enrolled ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Enrolled</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnrollCourse(course.id)}
                      className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white"
                    >
                      {course.price === 0 ? 'Enroll Free' : `Enroll $${course.price}`}
                    </button>
                  )}
                </div>

                {course.enrolled && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Progress: {course.progress}%</span>
                      {course.certificateId && (
                        <span className="text-amber-300 flex items-center gap-1 font-mono">
                          <Award className="w-3 h-3" />
                          {course.certificateId}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {section === 'ads' && (
          <div className="space-y-4">
            <form
              onSubmit={handleCreateAd}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5"
            >
              <h2 className="text-xs font-bold text-white">Create Ad Campaign</h2>
              <input
                type="text"
                value={newAdName}
                onChange={(e) => setNewAdName(e.target.value)}
                placeholder="Campaign name..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newAdFormat}
                  onChange={(e) => setNewAdFormat(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="Reel Ad">Reel Ad</option>
                  <option value="Feed Ad">Feed Ad</option>
                  <option value="Story Ad">Story Ad</option>
                  <option value="Video Ad">Video Ad</option>
                </select>
                <input
                  type="number"
                  value={newAdBudget}
                  onChange={(e) => setNewAdBudget(e.target.value)}
                  placeholder="Budget ($)"
                  className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white"
                >
                  Launch
                </button>
              </div>
            </form>

            <div className="space-y-2.5">
              {campaigns.map((ad) => (
                <div
                  key={ad.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {ad.format}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          ad.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {ad.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1">{ad.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Budget: ${ad.budget} · {ad.impressions.toLocaleString()} impr · {ad.clicks} clicks
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAd(ad.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
                    title={ad.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                  >
                    {ad.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
