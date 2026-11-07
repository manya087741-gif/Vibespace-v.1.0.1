import React, { useState } from 'react';
import { 
  X, Lock, Unlock, CheckCircle2, AlertCircle, Sparkles, 
  Tv, Users, ArrowRight, ShieldCheck, Image as ImageIcon 
} from 'lucide-react';
import { Channel } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { socialStore } from '../utils/socialStore';
import { sound } from '../utils/audioSynth';

interface ChannelCreationModalProps {
  onClose: () => void;
  onChannelCreated: (channel: Channel) => void;
}

const CATEGORIES = [
  'Tech & Code', 'Design & UI/UX', 'Gaming & Esports', 
  'Music & Synths', 'Science & Privacy', 'Creative Film', 'Education'
];

export const ChannelCreationModal: React.FC<ChannelCreationModalProps> = ({
  onClose,
  onChannelCreated,
}) => {
  const [followersCount, setFollowersCount] = useState<number>(socialStore.getUserFollowersCount());
  const isEligible = followersCount >= 1000;
  const progressPct = Math.min(100, Math.round((followersCount / 1000) * 100));

  // Channel Creation Form State
  const [channelName, setChannelName] = useState<string>('Aria Spatial Studio');
  const [handle, setHandle] = useState<string>('aria_spatial');
  const [category, setCategory] = useState<string>('Design & UI/UX');
  const [description, setDescription] = useState<string>(
    'Official creator channel for 120Hz gesture physics, tactile UI patterns, and spatial audio experiments.'
  );
  const [bannerUrl, setBannerUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80'
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSimulateGainFollowers = () => {
    sound.playSparkle();
    socialStore.simulateFollowerChange(250);
    setFollowersCount(socialStore.getUserFollowersCount());
  };

  const handleSimulateResetFollowers = () => {
    sound.playHeartPop();
    socialStore.setFollowersCount(850); // Set below 1,000 to test locked view
    setFollowersCount(850);
  };

  const handleCreateChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim() || !handle.trim()) {
      setErrorMsg('Please enter Channel Name and Handle.');
      return;
    }

    if (!isEligible) {
      setErrorMsg('Requirement not met: Minimum 1,000 Genuine Followers required.');
      return;
    }

    sound.playSparkle();
    const result = socialStore.createChannel({
      name: channelName.trim(),
      handle: handle.trim(),
      description: description.trim(),
      category: category,
      avatar: CURRENT_USER.avatar,
      bannerUrl: bannerUrl,
      customUrl: `vibespace.com/c/${handle.replace('@', '')}`,
    });

    if (result.success) {
      const created = socialStore.getUserChannel();
      if (created) onChannelCreated(created);
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to create channel.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl text-white">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Create Your Channel</span>
                {isEligible ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-mono">
                    <Unlock className="w-2.5 h-2.5" /> Eligible
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 font-mono">
                    <Lock className="w-2.5 h-2.5" /> 1K Followers Needed
                  </span>
                )}
              </h3>
              <span className="text-[11px] text-slate-400">YouTube-style creator platform & community hub</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playHeartPop();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* 1K FOLLOWERS ELIGIBILITY SECTION */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isEligible
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-violet-400" />
                <span>Follower Verification Progress</span>
              </span>
              <span className={`text-xs font-mono font-bold ${isEligible ? 'text-emerald-400' : 'text-amber-400'}`}>
                {followersCount.toLocaleString()} / 1,000 Followers
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isEligible
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-500'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Verification Criteria Checklist */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/60 text-[10px]">
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Email/Phone Verified</span>
              </div>
              <div className={`flex items-center gap-1 ${isEligible ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isEligible ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                <span>1K Genuine Followers</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Clean Community Standing</span>
              </div>
            </div>

            {/* Testing simulator buttons */}
            <div className="flex items-center justify-between mt-3 pt-2 text-[10px] text-slate-400">
              <span>Testing Rule Simulator:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSimulateResetFollowers}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                  title="Simulate 850 followers to test locked state"
                >
                  Set to 850 (Locked)
                </button>
                <button
                  type="button"
                  onClick={handleSimulateGainFollowers}
                  className="px-2 py-1 bg-violet-600/40 hover:bg-violet-600 text-violet-200 rounded-lg font-semibold"
                  title="Simulate +250 followers to unlock channel"
                >
                  +250 Followers (Unlock)
                </button>
              </div>
            </div>
          </div>

          {/* CHANNEL CREATION FORM (If eligible, active; if locked, disabled with banner) */}
          {!isEligible ? (
            <div className="py-8 text-center space-y-3 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Channel Creation Locked</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                To prevent spam and protect creator quality, VibeSpace requires at least <strong>1,000 Genuine Followers</strong> before launching a Creator Channel. You currently need <strong>{(1000 - followersCount).toLocaleString()} more followers</strong>.
              </p>
              <button
                onClick={handleSimulateGainFollowers}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-xs font-bold shadow-md hover:brightness-110"
              >
                Simulate Reaching 1K Followers Now 🚀
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateChannelSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Banner Preview */}
              <div className="relative aspect-[3/1] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={bannerUrl} alt="Channel Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={CURRENT_USER.avatar}
                      alt={CURRENT_USER.fullName}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-lg"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{channelName || 'Channel Name'}</div>
                      <div className="text-[10px] text-slate-300 font-mono">@{handle.replace('@', '')} · {category}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Channel Name & Handle */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">Channel Name</label>
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                    placeholder="e.g. Aria Spatial Studio"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">Channel Handle (@)</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                    placeholder="e.g. aria_spatial"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] block">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        category === cat
                          ? 'bg-violet-600 text-white font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-slate-400 text-[11px] block">Description / About</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-violet-500 resize-none"
                  placeholder="What is your channel about?"
                />
              </div>

              {/* Custom URL */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Custom URL:</span>
                <span className="font-mono text-violet-400">vibespace.com/c/{handle.replace('@', '')}</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 hover:brightness-110 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Creator Channel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
