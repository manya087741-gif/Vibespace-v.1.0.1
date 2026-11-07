import React, { useState } from 'react';
import { 
  X, Briefcase, Plus, Users, DollarSign, CheckCircle2, 
  Clock, ShieldCheck, Search, Filter, Eye, ArrowUpRight, Award 
} from 'lucide-react';
import { BrandCampaign, BrandDeal, User } from '../types';
import { MOCK_USERS, CURRENT_USER } from '../data/mockData';
import { socialStore } from '../utils/socialStore';
import { sound } from '../utils/audioSynth';

interface BrandDashboardModalProps {
  onClose: () => void;
}

export const BrandDashboardModal: React.FC<BrandDashboardModalProps> = ({ onClose }) => {
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>(socialStore.getBrandCampaigns());
  const [deals, setDeals] = useState<BrandDeal[]>(socialStore.getBrandDeals());
  const [activeTab, setActiveTab] = useState<'campaigns' | 'create_campaign' | 'creators' | 'escrow'>('campaigns');

  // New Campaign Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Tech & Gaming');
  const [newBudget, setNewBudget] = useState('45000');
  const [newSlots, setNewSlots] = useState('5');
  const [newDeadline, setNewDeadline] = useState('In 14 days');
  const [newDescription, setNewDescription] = useState('');
  const [selectedDeliverables, setSelectedDeliverables] = useState<('sponsored_reel' | 'carousel_post' | 'story_mention' | 'dedicated_video')[]>(['sponsored_reel']);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    sound.playSparkle();
    socialStore.addBrandCampaign({
      brandName: 'CyberVolt Dynamics',
      brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim(),
      deliverables: selectedDeliverables,
      budgetINR: parseInt(newBudget, 10) || 30000,
      slotsAvailable: parseInt(newSlots, 10) || 3,
      deadline: newDeadline,
      minFollowersRequired: 500,
      status: 'active',
    });

    setCampaigns(socialStore.getBrandCampaigns());
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('campaigns');
    }, 1500);
  };

  const handleReleaseEscrow = (dealId: string) => {
    sound.playSparkle();
    socialStore.approveAndPayDeal(dealId);
    setDeals(socialStore.getBrandDeals());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Brand Partner Portal</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30">
                  Verified Sponsor
                </span>
              </div>
              <p className="text-xs text-slate-400">Post Campaigns, Discover 500+ Genuine Creators & Manage Escrow</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/40 flex gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'campaigns' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('create_campaign')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'create_campaign' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'creators' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Discover Creators
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'escrow' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Escrow & Content Review ({deals.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          
          {/* TAB 1: CAMPAIGNS */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{camp.title}</h4>
                        <span className="text-[10px] text-blue-400 font-mono">{camp.category}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        ₹{camp.budgetINR.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{camp.description}</p>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-[11px]">
                      <span className="text-slate-400">
                        Slots: <strong className="text-white">{camp.slotsFilled}/{camp.slotsAvailable}</strong>
                      </span>
                      <span className="font-mono text-slate-400">{camp.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE CAMPAIGN */}
          {activeTab === 'create_campaign' && (
            <form onSubmit={handleCreateCampaign} className="space-y-4 max-w-lg mx-auto">
              <div className="space-y-1">
                <label className="text-slate-400">Campaign Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Wireless Mechanical Keyboard Launch"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Budget Per Creator (INR ₹)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Slots Available</label>
                  <input
                    type="number"
                    value={newSlots}
                    onChange={(e) => setNewSlots(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Brief & Deliverable Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain requirements, creative aesthetics, hashtags, and talking points..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Deliverable Format Required</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sponsored_reel', label: 'Sponsored Reel (60s)' },
                    { id: 'carousel_post', label: 'Photo Carousel Post' },
                    { id: 'story_mention', label: 'Story Mention & Link' },
                    { id: 'dedicated_video', label: 'Dedicated 4K Video' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        const exists = selectedDeliverables.includes(item.id as any);
                        setSelectedDeliverables(
                          exists
                            ? selectedDeliverables.filter((d) => d !== item.id)
                            : [...selectedDeliverables, item.id as any]
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedDeliverables.includes(item.id as any)
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {formSuccess && (
                <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Campaign published successfully to the Creator Marketplace!
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
              >
                Publish Campaign to Creators
              </button>
            </form>
          )}

          {/* TAB 3: DISCOVER CREATORS */}
          {activeTab === 'creators' && (
            <div className="space-y-3">
              <div className="divide-y divide-slate-900 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden">
                {[CURRENT_USER, ...MOCK_USERS].map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{user.fullName}</span>
                          <span className="text-violet-400">✓</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          @{user.username} • {(user.followersCount / 1000).toFixed(1)}k followers • 8.4% engagement
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sound.playSparkle();
                        socialStore.applyForBrandCampaign(campaigns[0].id, 'Direct Brand Invite proposal sent to creator.', 'sponsored_reel', 35000);
                        setActiveTab('escrow');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                    >
                      Send Proposal
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ESCROW & REVIEW */}
          {activeTab === 'escrow' && (
            <div className="space-y-3">
              {deals.map((deal) => (
                <div key={deal.id} className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{deal.campaignTitle}</h4>
                      <div className="text-[10px] text-slate-400">
                        Creator: <strong className="text-white">@{deal.creatorUsername}</strong> • Deliverable: {deal.deliverable}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      ₹{deal.dealAmountINR.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">
                      Status: <strong className="text-white">{deal.status.replace('_', ' ').toUpperCase()}</strong>
                    </span>

                    {deal.status === 'content_submitted' ? (
                      <button
                        onClick={() => handleReleaseEscrow(deal.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                      >
                        Approve & Release Escrow Funds ✓
                      </button>
                    ) : deal.status === 'approved_paid' ? (
                      <span className="text-emerald-400 font-bold font-mono">Paid & Settled ✓</span>
                    ) : (
                      <span className="text-amber-300 font-mono text-[11px]">Awaiting creator draft</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
