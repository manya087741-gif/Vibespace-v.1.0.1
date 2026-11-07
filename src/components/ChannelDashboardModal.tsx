import React from 'react';
import { 
  X, BarChart2, TrendingUp, Users, Eye, Clock, 
  ThumbsUp, Share2, Film, ArrowUpRight, ShieldCheck 
} from 'lucide-react';
import { Channel } from '../types';
import { sound } from '../utils/audioSynth';

interface ChannelDashboardModalProps {
  channel: Channel;
  onClose: () => void;
}

export const ChannelDashboardModal: React.FC<ChannelDashboardModalProps> = ({
  channel,
  onClose,
}) => {
  const analytics = channel.analytics || {
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
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl text-white">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{channel.name} · Creator Studio</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Performance Analytics & Audience Retention</span>
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

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-violet-400" /> Subscribers
              </span>
              <div className="text-base font-bold font-mono text-white">
                {channel.subscribersCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> +12.4% this mo
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3 text-fuchsia-400" /> Total Views
              </span>
              <div className="text-base font-bold font-mono text-white">
                {(analytics.totalViews / 1000).toFixed(1)}K
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> +18.2%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Watch Time
              </span>
              <div className="text-base font-bold font-mono text-white">
                {(analytics.watchTimeHours).toLocaleString()}h
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> +9.8%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-rose-400" /> Total Likes
              </span>
              <div className="text-base font-bold font-mono text-white">
                {(analytics.totalLikes / 1000).toFixed(1)}K
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> +24.1%
              </div>
            </div>
          </div>

          {/* Retention & 120Hz Quality Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-slate-950 border border-violet-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Audience Retention Rate</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  {analytics.audienceRetention}% (Top 5%)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                120Hz zero frame-drop delivery keeps users engaged 2.4x longer than legacy feeds.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0 font-bold text-xs">
              120Hz
            </div>
          </div>

          {/* Top Performing Videos */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white block">Top Content Performance</span>
            <div className="space-y-2">
              {analytics.topVideos.map((vid, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500 w-4">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white">{vid.title}</div>
                      <div className="text-[10px] text-slate-400">{vid.date}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-white">
                      {vid.views.toLocaleString()} views
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      94.2% positive
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">Channel Analytics Engine v2.4</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Close Studio
          </button>
        </div>

      </div>
    </div>
  );
};
