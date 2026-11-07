import React, { useState } from 'react';
import { 
  Tv, Bell, Check, Users, Video, Film, Radio, MessageSquare, 
  BarChart2, Share2, Plus, Sparkles, ExternalLink, MoreHorizontal 
} from 'lucide-react';
import { Channel, ChannelCommunityPost } from '../types';
import { CURRENT_USER, MOCK_POSTS } from '../data/mockData';
import { socialStore } from '../utils/socialStore';
import { sound } from '../utils/audioSynth';

interface ChannelProfileViewProps {
  channel: Channel;
  onOpenDashboard?: () => void;
  onClose?: () => void;
}

export const ChannelProfileView: React.FC<ChannelProfileViewProps> = ({
  channel,
  onOpenDashboard,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'shorts' | 'community' | 'about'>('home');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(channel.isSubscribed || false);
  const [subscribersCount, setSubscribersCount] = useState<number>(channel.subscribersCount);
  
  // Community tab post input
  const [newCommunityText, setNewCommunityText] = useState<string>('');
  const [communityPosts, setCommunityPosts] = useState<ChannelCommunityPost[]>(
    channel.communityPosts || []
  );
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>({});

  const isOwner = channel.ownerId === CURRENT_USER.id;

  const handleToggleSubscribe = () => {
    sound.playSparkle();
    const nextSub = !isSubscribed;
    setIsSubscribed(nextSub);
    setSubscribersCount((c) => (nextSub ? c + 1 : Math.max(0, c - 1)));
    socialStore.toggleSubscribeChannel(channel.id);
  };

  const handleAddCommunityPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunityText.trim()) return;
    sound.playSparkle();

    const post: ChannelCommunityPost = {
      id: 'cp_' + Date.now().toString(36),
      channelId: channel.id,
      content: newCommunityText.trim(),
      likesCount: 1,
      commentsCount: 0,
      timestamp: 'Just now',
    };

    setCommunityPosts([post, ...communityPosts]);
    socialStore.addCommunityPost(channel.id, newCommunityText.trim());
    setNewCommunityText('');
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    sound.playSparkle();
    setVotedPolls((prev) => ({ ...prev, [postId]: optionId }));
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col pb-24">
      
      {/* Banner */}
      <div className="relative aspect-[3/1] w-full bg-slate-900 overflow-hidden border-b border-slate-800">
        <img
          src={channel.bannerUrl}
          alt={channel.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 left-3 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Channel Profile Header */}
      <div className="px-4 -mt-10 sm:-mt-12 relative z-10 space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-end gap-3.5">
            <img
              src={channel.avatar}
              alt={channel.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-slate-950 shadow-2xl"
            />
            <div className="pb-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-bold text-white">{channel.name}</h2>
                {channel.verified && <span className="text-violet-400 font-bold">✓</span>}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {channel.handle} · {subscribersCount.toLocaleString()} subscribers
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pb-1">
            {isOwner ? (
              <button
                onClick={() => {
                  sound.playHeartPop();
                  if (onOpenDashboard) onOpenDashboard();
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Creator Studio</span>
              </button>
            ) : (
              <button
                onClick={handleToggleSubscribe}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isSubscribed
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-950 hover:bg-slate-200 shadow-md'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="w-3.5 h-3.5 text-violet-400" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Channel Description */}
        <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
          {channel.description}
        </p>

        {/* Custom URL Pill */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="font-mono text-violet-400">{channel.customUrl}</span>
          <span>·</span>
          <span>Joined {channel.createdAt}</span>
          <span>·</span>
          <span className="px-2 py-0.2 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
            {channel.category}
          </span>
        </div>
      </div>

      {/* Channel Navigation Tabs */}
      <div className="mt-4 border-b border-slate-800/80 px-4 flex gap-4 overflow-x-auto no-scrollbar text-xs font-semibold">
        {(['home', 'videos', 'shorts', 'community', 'about'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sound.playHeartPop();
              setActiveTab(tab);
            }}
            className={`py-2.5 capitalize transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? 'border-violet-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'shorts' ? 'Shorts & Reels' : tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="p-4">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Featured Channel Spotlight */}
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">
                Featured Broadcast
              </span>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                <img
                  src={channel.bannerUrl}
                  alt="Featured Video"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-2xl">
                    ▶
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Mastering 120Hz Spatial Design & Gesture Physics
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                  Comprehensive breakdown of zero-latency frame pipelines, gesture physics on iOS & Android, and hardware DRM.
                </p>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  420K views · 2 weeks ago
                </div>
              </div>
            </div>

            {/* Recent Uploads Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">Recent Videos</span>
              <div className="grid grid-cols-2 gap-2.5">
                {MOCK_POSTS.slice(0, 4).map((p, idx) => (
                  <div key={p.id} className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 space-y-2 pb-2">
                    <div className="aspect-video relative overflow-hidden bg-black">
                      <img src={p.mediaUrls[0]} alt={p.caption} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-mono text-white">
                        12:{idx * 14 + 10}
                      </span>
                    </div>
                    <div className="px-2">
                      <div className="text-xs font-semibold text-white line-clamp-1">{p.caption}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.likesCount * 3} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIDEOS */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_POSTS.map((p, idx) => (
              <div key={p.id} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex gap-3">
                <div className="w-32 aspect-video relative rounded-xl overflow-hidden bg-black shrink-0">
                  <img src={p.mediaUrls[0]} alt={p.caption} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 rounded text-[9px] font-mono text-white">
                    08:{idx * 12 + 20}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h5 className="text-xs font-bold text-white line-clamp-2">{p.caption}</h5>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {p.likesCount * 4} views · {p.timestamp}
                    </div>
                  </div>
                  <span className="text-[10px] text-violet-400 font-semibold">4K Ultra HD</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SHORTS & REELS */}
        {activeTab === 'shorts' && (
          <div className="grid grid-cols-3 gap-2">
            {MOCK_POSTS.map((p) => (
              <div key={p.id} className="aspect-[9/16] rounded-2xl overflow-hidden relative group bg-black border border-slate-800 cursor-pointer">
                <img src={p.mediaUrls[0]} alt="Shorts" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                  <span className="text-[10px] font-bold text-white line-clamp-1">{p.caption}</span>
                  <span className="text-[9px] text-slate-300 font-mono">{p.likesCount} likes</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: COMMUNITY TAB */}
        {activeTab === 'community' && (
          <div className="space-y-4 max-w-lg mx-auto">
            {/* Create Community Post (If Owner) */}
            {isOwner && (
              <form onSubmit={handleAddCommunityPost} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <img src={channel.avatar} alt="You" className="w-8 h-8 rounded-full object-cover" />
                  <input
                    type="text"
                    value={newCommunityText}
                    onChange={(e) => setNewCommunityText(e.target.value)}
                    placeholder="Post an update, poll, or announcement to your subscribers..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
                  >
                    Publish Update
                  </button>
                </div>
              </form>
            )}

            {/* Community Posts Stream */}
            <div className="space-y-3">
              {communityPosts.map((cp) => (
                <div key={cp.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <img src={channel.avatar} alt={channel.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white">{channel.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{cp.timestamp}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">{cp.content}</p>

                  {/* Poll voting if present */}
                  {cp.pollOptions && (
                    <div className="space-y-1.5 pt-1">
                      {cp.pollOptions.map((opt) => {
                        const hasVoted = Boolean(votedPolls[cp.id]);
                        const isChosen = votedPolls[cp.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            disabled={hasVoted}
                            onClick={() => handleVotePoll(cp.id, opt.id)}
                            className={`w-full py-2 px-3 rounded-xl border text-xs text-left flex items-center justify-between transition-all ${
                              isChosen
                                ? 'bg-violet-600/30 border-violet-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span>{opt.text}</span>
                            {hasVoted && (
                              <span className="font-mono text-slate-400">
                                {opt.votes + (isChosen ? 1 : 0)} votes
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <button className="flex items-center gap-1 hover:text-rose-400">
                      <span>❤️</span>
                      <span>{cp.likesCount}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-white">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{cp.commentsCount} comments</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ABOUT */}
        {activeTab === 'about' && (
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-lg mx-auto text-xs">
            <div>
              <h4 className="font-bold text-white mb-1">Description</h4>
              <p className="text-slate-300 leading-relaxed">{channel.description}</p>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2">
              <h4 className="font-bold text-white">Channel Details</h4>
              <div className="flex justify-between py-1 text-slate-400 border-b border-slate-800/60">
                <span>Custom URL</span>
                <span className="font-mono text-violet-400">{channel.customUrl}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400 border-b border-slate-800/60">
                <span>Category</span>
                <span className="text-white">{channel.category}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400 border-b border-slate-800/60">
                <span>Subscribers</span>
                <span className="font-mono text-white">{subscribersCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>Joined Date</span>
                <span className="text-white">{channel.createdAt}</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
