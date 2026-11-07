import React, { useState } from 'react';
import { 
  X, Shield, ShieldAlert, Users, Tv, Radio, Flag, 
  Check, Trash2, Ban, AlertTriangle, RefreshCw, BarChart2,
  DollarSign, CreditCard, Award, CheckCircle2
} from 'lucide-react';
import { AdminReport, Channel } from '../types';
import { MOCK_USERS, CURRENT_USER } from '../data/mockData';
import { socialStore } from '../utils/socialStore';
import { sound } from '../utils/audioSynth';

interface AdminPanelModalProps {
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'users' | 'channels' | 'bots' | 'monetization'>('reports');
  const [reports, setReports] = useState<AdminReport[]>(socialStore.getAdminReports());
  const [channels, setChannels] = useState<Channel[]>(socialStore.getChannels());
  const [users, setUsers] = useState(MOCK_USERS);
  
  // Monetization & Payouts admin state
  const [monetizationConfig, setMonetizationConfig] = useState(socialStore.getAdminMonetizationConfig());
  const [withdrawals, setWithdrawals] = useState(socialStore.getWithdrawals());
  const [monetizationProfile, setMonetizationProfile] = useState(socialStore.getMonetizationProfile());

  // Bot detection engine simulator
  const [isScanningBots, setIsScanningBots] = useState<boolean>(false);
  const [botsFound, setBotsFound] = useState<number>(14);
  const [botsPurged, setBotsPurged] = useState<boolean>(false);

  const handleResolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    sound.playHeartPop();
    socialStore.resolveReport(reportId, action);
    setReports(socialStore.getAdminReports());
  };

  const handleRunBotScan = () => {
    sound.playSparkle();
    setIsScanningBots(true);
    setTimeout(() => {
      setIsScanningBots(false);
      setBotsFound(18);
    }, 1200);
  };

  const handlePurgeBots = () => {
    sound.playSparkle();
    setBotsPurged(true);
    setBotsFound(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>VibeSpace Admin & Moderation Console</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-600/30 text-rose-300 font-mono text-[10px] border border-rose-500/30">
                  Super Admin
                </span>
              </h3>
              <span className="text-[11px] text-slate-400">Content safety, channel approvals & bot defense</span>
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

        {/* Navigation Tabs */}
        <div className="border-b border-slate-800 bg-slate-950/60 px-4 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'reports' ? 'border-rose-500 text-white font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-rose-400" />
            <span>Reported Content ({reports.filter((r) => r.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'channels' ? 'border-violet-500 text-white font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-violet-400" />
            <span>Channel Approvals</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'users' ? 'border-violet-500 text-white font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab('bots')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'bots' ? 'border-amber-500 text-white font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Bot Detection</span>
          </button>

          <button
            onClick={() => setActiveTab('monetization')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'monetization' ? 'border-emerald-500 text-white font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Monetization & Payouts</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: REPORTED CONTENT */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Pending Community Reports
              </span>

              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    rep.status === 'pending'
                      ? 'bg-slate-950 border-rose-500/30'
                      : 'bg-slate-950/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-600/20 text-rose-300 font-mono text-[10px] font-bold uppercase">
                          {rep.targetType}
                        </span>
                        <span className="text-xs font-bold text-white">{rep.targetTitle}</span>
                        <span className="text-[10px] text-slate-500 font-mono">· {rep.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300">{rep.reason}</p>
                      <div className="text-[10px] text-slate-400">
                        Reported by: <strong>@{rep.reportedBy.username}</strong>
                      </div>
                    </div>

                    {rep.status === 'pending' ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleResolveReport(rep.id, 'dismissed')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'resolved')}
                          className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                        >
                          Take Down
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 uppercase px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/30">
                        {rep.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CHANNEL APPROVALS */}
          {activeTab === 'channels' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active & Verified Channels ({channels.length})
              </span>

              {channels.map((ch) => (
                <div key={ch.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={ch.avatar} alt={ch.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{ch.name}</span>
                        <span className="text-violet-400">✓</span>
                        <span className="text-[10px] text-slate-400 font-normal">({ch.category})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {ch.handle} · {ch.subscribersCount.toLocaleString()} subscribers
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                    <button className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                      <Ban className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Platform Creators & Accounts
              </span>

              {[CURRENT_USER, ...users].map((usr) => (
                <div key={usr.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={usr.avatar} alt={usr.username} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{usr.fullName}</span>
                        {usr.verified && <span className="text-violet-400">✓</span>}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        @{usr.username} · {usr.followersCount.toLocaleString()} followers
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">Good Standing</span>
                    <button className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-[11px]">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: BOT & FAKE FOLLOWER DETECTION */}
          {activeTab === 'bots' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Real-Time Bot & Sybil Defense System</span>
                  </h4>
                  <button
                    onClick={handleRunBotScan}
                    disabled={isScanningBots}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanningBots ? 'animate-spin' : ''}`} />
                    <span>{isScanningBots ? 'Scanning...' : 'Run Scan'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automated heuristics analyze follow velocity, IP geolocation diversity, and device telemetry to ensure all 500 and 1,000 follower milestones are 100% genuine humans.
                </p>
              </div>

              {/* Bot Scan Result */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Flagged Suspicious Accounts</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {botsFound} Accounts Flagged
                    </span>
                  </div>

                  {botsFound > 0 && (
                    <button
                      onClick={handlePurgeBots}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg"
                    >
                      1-Click Purge & Ban
                    </button>
                  )}
                </div>

                {botsPurged && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    ✓ All fake bot accounts purged. Creator metrics recalculated and verified clean.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CREATOR MONETIZATION & PAYOUT AUDIT */}
          {activeTab === 'monetization' && (
            <div className="space-y-5">
              {/* Overview Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Platform GMV</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    ₹{monetizationConfig.platformTotalGMVINR.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 block">Brand deals + subs + gifts</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Platform Revenue</span>
                  <span className="text-base font-bold font-mono text-amber-400">
                    ₹{monetizationConfig.platformTotalRevenueINR.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 block">VibeSpace commission margin</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Follower Gate</span>
                  <span className="text-base font-bold font-mono text-violet-400">
                    {monetizationConfig.minFollowersRequired} Followers
                  </span>
                  <span className="text-[9px] text-emerald-400 block">Automatic Unlock</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Pending Payouts</span>
                  <span className="text-base font-bold font-mono text-rose-400">
                    {withdrawals.filter(w => w.status === 'pending').length} Requests
                  </span>
                  <span className="text-[9px] text-slate-500 block">Awaiting NEFT / UPI</span>
                </div>
              </div>

              {/* Threshold & Commission Policy Controls */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Monetization Policy & Revenue Split Settings</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Real-Time Sync</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Monetization Min Followers:</span>
                      <strong className="text-white font-mono">{monetizationConfig.minFollowersRequired}</strong>
                    </div>
                    <span className="text-[10px] text-slate-500 block">500 genuine followers unlocked automatically</span>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Paid Subscriptions Platform Cut:</span>
                      <strong className="text-white font-mono">{monetizationConfig.subscriptionCommissionPercent}%</strong>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Creator receives 85% of monthly sub price</span>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Virtual Gift Platform Fee:</span>
                      <strong className="text-white font-mono">{monetizationConfig.giftCommissionPercent}%</strong>
                    </div>
                    <span className="text-[10px] text-slate-500 block">80% credited immediately to creator wallet</span>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Reels / Video Ad Rev Share:</span>
                      <strong className="text-white font-mono">{monetizationConfig.adRevenueSharePercent}%</strong>
                    </div>
                    <span className="text-[10px] text-slate-500 block">55% creator share for eligible views</span>
                  </div>
                </div>
              </div>

              {/* Creator KYC Verifications */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-violet-400" />
                    <span>Creator KYC & Legal Tax Status</span>
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    monetizationProfile.kycStatus === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {monetizationProfile.kycStatus === 'verified' ? 'KYC Approved' : monetizationProfile.kycStatus === 'pending' ? 'Pending Review' : 'Not Submitted'}
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{CURRENT_USER.fullName} (@{CURRENT_USER.username})</span>
                      <span className="text-[10px] font-mono text-slate-400">PAN: {monetizationProfile.panNumber || 'ABCDE1234F'}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Document: {monetizationProfile.idDocumentName || 'PAN Card (Income Tax Dept)'} · TDS Compliance: 1% Section 194-O
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {monetizationProfile.kycStatus === 'verified' ? (
                      <button
                        onClick={() => {
                          sound.playHeartPop();
                          socialStore.verifyKYC('rejected');
                          setMonetizationProfile(socialStore.getMonetizationProfile());
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-900/50"
                      >
                        Revoke KYC
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playSparkle();
                          socialStore.verifyKYC('verified');
                          setMonetizationProfile(socialStore.getMonetizationProfile());
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve KYC</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Creator Withdrawal Requests Queue */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Withdrawal Processing Queue ({withdrawals.length})
                  </span>
                  <span className="text-[10px] text-slate-500">Auto TDS Section 194-O</span>
                </div>

                {withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      w.status === 'pending'
                        ? 'bg-slate-950 border-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-mono text-white">₹{w.amountINR.toLocaleString()}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {w.payoutMethod.toUpperCase()}: {w.payoutDestination}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            w.status === 'paid'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : w.status === 'pending'
                              ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-950 text-rose-400'
                          }`}>
                            {w.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-3">
                          <span>1% TDS: <strong className="text-slate-300 font-mono">₹{w.tdsAmountINR}</strong></span>
                          <span>Net Disbursed: <strong className="text-emerald-400 font-mono">₹{w.netPayoutINR.toLocaleString()}</strong></span>
                          <span>Ref: <span className="font-mono text-slate-500">{w.transactionReference || w.receiptNumber}</span></span>
                        </div>
                      </div>

                      {w.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              sound.playSparkle();
                              socialStore.approveWithdrawal(w.id);
                              setWithdrawals(socialStore.getWithdrawals());
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Paid</span>
                          </button>
                          <button
                            onClick={() => {
                              sound.playHeartPop();
                              socialStore.rejectWithdrawal(w.id, 'Invalid bank account or UPI');
                              setWithdrawals(socialStore.getWithdrawals());
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold rounded-xl"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};
