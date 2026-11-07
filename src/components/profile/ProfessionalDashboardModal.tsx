import React from 'react';
import { 
  X, BarChart2, TrendingUp, Users, Eye, DollarSign, 
  Briefcase, Award, ChevronRight, Sparkles, Tv, ArrowUpRight 
} from 'lucide-react';
import { User, UserProfileAnalytics } from '../../types';
import { socialStore } from '../../utils/socialStore';
import { sound } from '../../utils/audioSynth';

interface ProfessionalDashboardModalProps {
  user: User;
  onClose: () => void;
  onOpenMonetization: () => void;
  onOpenBrandDeals: () => void;
}

export const ProfessionalDashboardModal: React.FC<ProfessionalDashboardModalProps> = ({
  user,
  onClose,
  onOpenMonetization,
  onOpenBrandDeals,
}) => {
  const analytics: UserProfileAnalytics = socialStore.getUserAnalytics();
  const wallet = socialStore.getCreatorWallet();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-600/20 text-violet-400 rounded-xl border border-violet-500/30">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Professional Dashboard</span>
                <span className="px-2 py-0.2 rounded-full bg-violet-600/30 text-violet-300 font-mono text-[9px] border border-violet-500/30">
                  Creator Insights
                </span>
              </h3>
              <span className="text-[10px] text-slate-400">Last 30 days performance & reach</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playHeartPop();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Top KPI Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px]">Accounts Reached</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">+{analytics.followerGrowthPercent}%</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {analytics.accountsReached.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 block">vs previous 30 days</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px]">Accounts Engaged</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">+22.4%</span>
              </div>
              <div className="text-xl font-bold font-mono text-violet-400">
                {analytics.accountsEngaged.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 block">Likes, comments, shares</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px]">Total Impressions</span>
                <span className="text-[10px] font-mono font-bold text-violet-400">120Hz Verified</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {analytics.impressions30Days.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 block">Content views across feed</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px]">Profile Activity</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">+8.1%</span>
              </div>
              <div className="text-xl font-bold font-mono text-amber-400">
                {analytics.profileActivity.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 block">Taps, link clicks, shares</span>
            </div>
          </div>

          {/* Audience Demographics */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="font-semibold text-white block">Audience Demographics</span>
            
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Top Geographic Locations</span>
                <span className="text-white font-mono font-bold">{analytics.topAudienceCity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Primary Age Group</span>
                <span className="text-white font-mono font-bold">{analytics.topAudienceAge}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Follower Follow-back Ratio</span>
                <span className="text-emerald-400 font-mono font-bold">94.2% Genuine Humans</span>
              </div>
            </div>
          </div>

          {/* Quick Actions into Monetization & Deals */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-1">
              Creator Monetization Tools
            </span>

            <div
              onClick={() => {
                sound.playSparkle();
                onOpenMonetization();
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block group-hover:text-emerald-300 transition-colors">
                    Creator Monetization Hub
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Available: <strong className="text-emerald-400 font-mono">₹{wallet.availableBalanceINR.toLocaleString()}</strong> · Subscriptions & Gifts
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div
              onClick={() => {
                sound.playSparkle();
                onOpenBrandDeals();
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-900 border border-violet-500/30 hover:border-violet-500/60 cursor-pointer flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-600 rounded-xl text-white shadow-md">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block group-hover:text-violet-300 transition-colors">
                    Brand Collaboration Marketplace
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Active Escrow: <strong className="text-amber-400 font-mono">₹{wallet.pendingEscrowBalanceINR.toLocaleString()}</strong> · Direct Deals
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
