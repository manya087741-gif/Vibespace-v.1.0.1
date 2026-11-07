import React, { useState } from 'react';
import { 
  X, DollarSign, TrendingUp, Users, Gift, Film, ShieldCheck, 
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, Sparkles, 
  Briefcase, MessageSquare, CreditCard, Send, Lock, ChevronRight, 
  BarChart2, FileText, Download, Wallet, Plus, RefreshCw, Award 
} from 'lucide-react';
import { 
  MonetizationProfile, CreatorWallet, BrandCampaign, 
  BrandDeal, PaidSubscription, VirtualGift, WithdrawalRequest 
} from '../types';
import { CURRENT_USER } from '../data/mockData';
import { socialStore } from '../utils/socialStore';
import { sound } from '../utils/audioSynth';

interface CreatorMonetizationHubModalProps {
  onClose: () => void;
  onOpenWithdrawal?: () => void;
  onOpenBrandMarketplace?: () => void;
}

export const CreatorMonetizationHubModal: React.FC<CreatorMonetizationHubModalProps> = ({
  onClose,
  onOpenWithdrawal,
}) => {
  const [profile, setProfile] = useState<MonetizationProfile>(socialStore.getMonetizationProfile());
  const [wallet, setWallet] = useState<CreatorWallet>(socialStore.getCreatorWallet());
  const [brandDeals, setBrandDeals] = useState<BrandDeal[]>(socialStore.getBrandDeals());
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>(socialStore.getBrandCampaigns());
  const [subscriptions, setSubscriptions] = useState<PaidSubscription[]>(socialStore.getSubscriptions());
  const [virtualGifts, setVirtualGifts] = useState<VirtualGift[]>(socialStore.getVirtualGifts());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(socialStore.getWithdrawals());
  const [followersCount, setFollowersCount] = useState<number>(socialStore.getUserFollowersCount());

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'overview' | 'brand_deals' | 'subscriptions' | 'gifts' | 'ads' | 'payouts'>('overview');

  // Deal interaction state
  const [selectedDealForChat, setSelectedDealForChat] = useState<BrandDeal | null>(null);
  const [dealChatText, setDealChatText] = useState('');
  const [submittingContentDealId, setSubmittingContentDealId] = useState<string | null>(null);
  const [contentDraftUrl, setContentDraftUrl] = useState('');
  const [contentDraftNotes, setContentDraftNotes] = useState('');

  // KYC & Payment details state
  const [showKYCForm, setShowKYCForm] = useState(false);
  const [panInput, setPanInput] = useState(profile.panNumber || '');
  const [docNameInput, setDocNameInput] = useState(profile.idDocumentName || 'PAN_Card_Verification.pdf');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [upiInput, setUpiInput] = useState(profile.paymentDetails.upiId || 'alex_creator@okhdfcbank');
  const [bankAccInput, setBankAccInput] = useState(profile.paymentDetails.bankAccountNumber || '50100492817291');
  const [bankIfscInput, setBankIfscInput] = useState(profile.paymentDetails.bankIfscCode || 'HDFC0001249');
  const [bankNameInput, setBankNameInput] = useState(profile.paymentDetails.bankName || 'HDFC Bank Ltd');

  // Selected receipt to view
  const [viewingReceipt, setViewingReceipt] = useState<WithdrawalRequest | null>(null);

  // Quick withdrawal prompt
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState('10000');
  const [withdrawMethodInput, setWithdrawMethodInput] = useState<'upi' | 'bank_transfer'>('upi');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // Coin Purchase Store in gifts
  const [showBuyCoins, setShowBuyCoins] = useState(false);

  // Subscription price editor
  const [subPriceInput, setSubPriceInput] = useState(profile.subscriptionPriceINR.toString());
  const [priceSavedSuccess, setPriceSavedSuccess] = useState(false);

  const isEligible = followersCount >= 500;

  const refreshState = () => {
    setProfile(socialStore.getMonetizationProfile());
    setWallet(socialStore.getCreatorWallet());
    setBrandDeals(socialStore.getBrandDeals());
    setCampaigns(socialStore.getBrandCampaigns());
    setSubscriptions(socialStore.getSubscriptions());
    setVirtualGifts(socialStore.getVirtualGifts());
    setWithdrawals(socialStore.getWithdrawals());
    setFollowersCount(socialStore.getUserFollowersCount());
  };

  const handleSimulateFollowers = (delta: number) => {
    sound.playSparkle();
    socialStore.simulateFollowerChange(delta);
    refreshState();
  };

  const handleSetFollowersExact = (count: number) => {
    sound.playSparkle();
    socialStore.simulateSetFollowers(count);
    refreshState();
  };

  const handleAgreeTerms = () => {
    sound.playSparkle();
    socialStore.updateMonetizationProfile({ hasAgreedToTerms: true, isApproved: true });
    refreshState();
  };

  const handleSaveSubPrice = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playHeartPop();
    const val = parseInt(subPriceInput, 10);
    if (!isNaN(val) && val >= 49) {
      socialStore.updateMonetizationProfile({ subscriptionPriceINR: val });
      setPriceSavedSuccess(true);
      setTimeout(() => setPriceSavedSuccess(false), 2500);
      refreshState();
    }
  };

  const handleSaveKYC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!panInput.trim()) return;
    sound.playSparkle();
    socialStore.submitKYC(panInput.trim().toUpperCase(), docNameInput);
    // Instant simulation auto-verify
    setTimeout(() => {
      socialStore.verifyKYC('verified');
      refreshState();
    }, 600);
    setShowKYCForm(false);
    refreshState();
  };

  const handleSavePaymentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playHeartPop();
    socialStore.updatePaymentDetails({
      payoutMethod: profile.paymentDetails.payoutMethod,
      upiId: upiInput.trim(),
      bankAccountNumber: bankAccInput.trim(),
      bankIfscCode: bankIfscInput.trim().toUpperCase(),
      bankName: bankNameInput.trim(),
      bankAccountName: CURRENT_USER.fullName,
    });
    setShowPaymentForm(false);
    refreshState();
  };

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccessMsg(null);

    const amt = parseInt(withdrawAmountInput, 10);
    if (isNaN(amt) || amt < 1000) {
      setWithdrawError('Minimum withdrawal amount is ₹1,000');
      return;
    }
    if (amt > wallet.availableBalanceINR) {
      setWithdrawError('Amount exceeds current available balance');
      return;
    }

    const destination = withdrawMethodInput === 'upi' ? upiInput : `${bankNameInput} - A/C ${bankAccInput.slice(-4)}`;
    const res = socialStore.requestWithdrawal(amt, withdrawMethodInput, destination);

    if (res.success && res.request) {
      sound.playSparkle();
      setWithdrawSuccessMsg(`Withdrawal of ₹${amt.toLocaleString()} initiated! Tax invoice ${res.request.receiptNumber} generated.`);
      refreshState();
      setTimeout(() => {
        setShowWithdrawForm(false);
        setWithdrawSuccessMsg(null);
      }, 2000);
    } else {
      setWithdrawError(res.message || 'Withdrawal failed');
    }
  };

  const handleSendDealMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealForChat || !dealChatText.trim()) return;
    sound.playHeartPop();
    socialStore.sendBrandDealMessage(selectedDealForChat.id, 'creator', dealChatText.trim());
    setDealChatText('');
    refreshState();
    const updated = socialStore.getBrandDeals().find((d) => d.id === selectedDealForChat.id);
    if (updated) setSelectedDealForChat(updated);
  };

  const handleSubmitDeliverableDraft = (dealId: string) => {
    sound.playSparkle();
    const url = contentDraftUrl || '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg';
    socialStore.submitDealContent(dealId, url, contentDraftNotes || 'Uploaded in full 4K 60fps HDR master.');
    setSubmittingContentDealId(null);
    setContentDraftUrl('');
    setContentDraftNotes('');
    refreshState();
  };

  const handleApproveEscrowDirectly = (dealId: string) => {
    sound.playSparkle();
    socialStore.approveAndPayDeal(dealId);
    refreshState();
    if (selectedDealForChat && selectedDealForChat.id === dealId) {
      const updated = socialStore.getBrandDeals().find((d) => d.id === dealId);
      if (updated) setSelectedDealForChat(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-950/40">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Creator Earning & Monetization Hub</h3>
                {isEligible && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                    500+ Unlocked
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Official Revenue Dashboard • Brand Sponsorships, Subscriptions, Gifts & Ads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 500 Genuine Followers Gate Notice (If Not Eligible) */}
        {!isEligible ? (
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Monetization Eligibility Locked</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  To protect our creator economy from bots, creators must have a minimum of{' '}
                  <strong className="text-amber-300">500 Genuine Followers</strong> to activate Brand Deals, Paid Memberships, Virtual Gifts, and Ad Revenue Sharing.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Genuine Followers</span>
                  <span className="font-mono text-white font-bold">
                    {followersCount.toLocaleString()} / 500 ({Math.min(100, Math.round((followersCount / 500) * 100))}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (followersCount / 500) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-mono text-right">
                  {Math.max(0, 500 - followersCount)} more followers needed to unlock
                </p>
              </div>

              {/* Strict Criteria Checklist */}
              <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5 text-left text-xs pt-2">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">Email & Mobile Verified</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">0 Community Strikes</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">Bot Shield Pass (No Fake)</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-200">500 Followers Required</span>
                </div>
              </div>

              {/* Developer Testing Simulator Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 max-w-md mx-auto space-y-2">
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Testing Simulator (Adjust Followers)</span>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleSetFollowersExact(350)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Set 350 (Locked)
                  </button>
                  <button
                    onClick={() => handleSimulateFollowers(150)}
                    className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
                  >
                    +150 Followers
                  </button>
                  <button
                    onClick={() => handleSetFollowersExact(850)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold"
                  >
                    Unlock 500 Now 🔓
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !profile.hasAgreedToTerms ? (
          /* Agreement Terms Modal (One-time before first access) */
          <div className="p-6 space-y-5 overflow-y-auto">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">500 Followers Milestone Reached!</h4>
                  <p className="text-xs text-slate-400">Sign the VibeSpace Creator Partner Agreement to begin earning</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2.5 text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                <p><strong>1. Genuine Revenue Assurance:</strong> Earnings are derived exclusively from verified brand escrows, subscriber membership payments, virtual gifts, and real verified view impressions.</p>
                <p><strong>2. Fair Platform Commission:</strong> Platform retains standard industry fees (10% Brand Deals, 15% Subscriptions, 20% Virtual Gifts). 55% Ad revenue is directly shared with eligible creators.</p>
                <p><strong>3. Indian Taxation & TDS:</strong> In compliance with Section 194-O, a 1% TDS deduction is automatically credited against your PAN number for Indian domestic bank/UPI settlements.</p>
                <p><strong>4. Strict Anti-Fraud:</strong> Generating artificial views, fake subscriptions, or spoofed screen interactions will result in instant forfeiture of earnings and account suspension.</p>
              </div>

              <button
                onClick={handleAgreeTerms}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Terms & Enter Creator Earning Hub</span>
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED FULL CREATOR MONETIZATION HUB */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Financial Stat Banners */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. Available Balance with Withdraw button */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Wallet className="w-3.5 h-3.5" /> Available for Payout
                    </span>
                    <span className="text-[10px] text-emerald-400/80 font-mono">Instant UPI</span>
                  </div>
                  <div className="my-1.5">
                    <div className="text-2xl font-bold font-mono text-white tracking-tight">
                      ₹{wallet.availableBalanceINR.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWithdrawForm(true)}
                    className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Withdraw Funds</span>
                  </button>
                </div>

                {/* 2. In Escrow / Pending Deals */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" /> Secured in Escrow
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Brand Deals</span>
                  </div>
                  <div className="my-1.5">
                    <div className="text-2xl font-bold font-mono text-amber-300 tracking-tight">
                      ₹{wallet.pendingEscrowBalanceINR.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Auto-releases when deliverables are accepted
                  </div>
                </div>

                {/* 3. Lifetime Total Gross */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="flex items-center gap-1.5 text-violet-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> Lifetime Gross
                    </span>
                    <span className="text-[10px] text-violet-400 font-mono">+24% this mo</span>
                  </div>
                  <div className="my-1.5">
                    <div className="text-2xl font-bold font-mono text-white tracking-tight">
                      ₹{wallet.totalLifetimeEarningsINR.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Active VIP Members</span>
                    <span className="text-white font-mono font-bold">{subscriptions.length} creators</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/40 flex gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
              <button
                onClick={() => { sound.playHeartPop(); setActiveTab('overview'); }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'overview' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => { sound.playHeartPop(); setActiveTab('brand_deals'); }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'brand_deals' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Brand Deals ({brandDeals.length})</span>
              </button>

              <button
                onClick={() => { sound.playHeartPop(); setActiveTab('subscriptions'); }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'subscriptions' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Paid Subscriptions</span>
              </button>

              <button
                onClick={() => { sound.playHeartPop(); setActiveTab('gifts'); }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'gifts' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Virtual Gifts</span>
              </button>

              <button
                onClick={() => { sound.playHeartPop(); setActiveTab('ads'); }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'ads' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video & Reels Ads</span>
              </button>

              <button
                onClick={() => { sound.playHeartPop(); setActiveTab('payouts'); }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'payouts' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payouts & KYC</span>
              </button>
            </div>

            {/* Scrollable Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6 text-xs">
                  {/* Revenue Stream Breakdown Grid */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white text-sm">Revenue Stream Breakdown</h4>
                      <span className="text-[11px] font-mono text-slate-400">Past 30 Days</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-slate-400">Brand Deals</span>
                        <div className="text-base font-bold font-mono text-white">₹{wallet.brandDealEarningsINR.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">49.7% of total</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-slate-400">Subscriptions</span>
                        <div className="text-base font-bold font-mono text-white">₹{wallet.subscriptionEarningsINR.toLocaleString()}</div>
                        <div className="text-[10px] text-violet-400 font-mono">21.9% of total</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-slate-400">Virtual Gifts</span>
                        <div className="text-base font-bold font-mono text-white">₹{wallet.giftEarningsINR.toLocaleString()}</div>
                        <div className="text-[10px] text-rose-400 font-mono">16.8% of total</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-slate-400">Video Ads (RPM)</span>
                        <div className="text-base font-bold font-mono text-white">₹{wallet.adRevenueEarningsINR.toLocaleString()}</div>
                        <div className="text-[10px] text-amber-400 font-mono">11.6% of total</div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Performance Bar Chart Simulation */}
                  <div className="p-4 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white text-xs">Weekly Net Growth (Oct 2026)</div>
                        <div className="text-[11px] text-slate-400">Audited settlement deposits</div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">+18.4% WoW</span>
                    </div>

                    <div className="h-32 flex items-end gap-3 pt-4 px-2 border-b border-slate-800/80 pb-2">
                      {[
                        { week: 'Week 1', amt: 14200, height: '45%' },
                        { week: 'Week 2', amt: 19800, height: '62%' },
                        { week: 'Week 3', amt: 22100, height: '70%' },
                        { week: 'Week 4 (Current)', amt: 28400, height: '90%' },
                      ].map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                          <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-400 transition-colors">
                            ₹{(bar.amt / 1000).toFixed(1)}k
                          </span>
                          <div
                            className="w-full rounded-t-xl bg-gradient-to-t from-violet-600 to-emerald-400 group-hover:brightness-125 transition-all shadow-md"
                            style={{ height: bar.height }}
                          />
                          <span className="text-[10px] text-slate-400 mt-1">{bar.week}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Shortcut CTA cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setActiveTab('brand_deals')}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 cursor-pointer flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 group-hover:scale-110 transition-transform">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">Brand Marketplace</div>
                          <div className="text-[11px] text-slate-400">4 open sponsorships ready to apply</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                    </div>

                    <div
                      onClick={() => setActiveTab('payouts')}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">KYC & Settlement Hub</div>
                          <div className="text-[11px] text-slate-400">
                            PAN {profile.kycStatus === 'verified' ? '✓ Verified' : 'Action Required'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BRAND DEALS & SPONSORSHIPS */}
              {activeTab === 'brand_deals' && (
                <div className="space-y-6 text-xs">
                  {/* Active Campaigns Marketplace */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white text-sm">Open Brand Sponsorship Campaigns</h4>
                        <p className="text-[11px] text-slate-400">Apply with your rate & deliverable pitch</p>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Escrow Guaranteed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {campaigns.map((camp) => (
                        <div key={camp.id} className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <img src={camp.brandLogo} alt={camp.brandName} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                              <div>
                                <div className="font-bold text-white flex items-center gap-1">
                                  <span>{camp.brandName}</span>
                                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                                </div>
                                <span className="text-[10px] text-slate-400">{camp.category}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-bold text-emerald-400 text-sm">₹{camp.budgetINR.toLocaleString()}</div>
                              <span className="text-[10px] text-slate-500">{camp.deadline}</span>
                            </div>
                          </div>

                          <h5 className="font-semibold text-white text-xs">{camp.title}</h5>
                          <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{camp.description}</p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                            <div className="flex gap-1.5">
                              {camp.deliverables.map((deliv, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] font-mono border border-slate-800">
                                  {deliv.replace('_', ' ')}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                sound.playSparkle();
                                socialStore.applyForBrandCampaign(camp.id, `Hi ${camp.brandName}, Alex here! I will produce an ultra-crisp 4K deliverable with full 120Hz aesthetics.`, camp.deliverables[0], camp.budgetINR);
                                refreshState();
                              }}
                              className="px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] transition-colors"
                            >
                              Apply for Deal
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* My Active Deals */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-white text-sm">My Active & Completed Deals ({brandDeals.length})</h4>

                    <div className="space-y-2.5">
                      {brandDeals.map((deal) => (
                        <div key={deal.id} className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={deal.brandLogo} alt={deal.brandName} className="w-8 h-8 rounded-xl object-cover" />
                              <div>
                                <h5 className="font-bold text-white text-xs">{deal.campaignTitle}</h5>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {deal.brandName} • {deal.deliverable.replace('_', ' ')}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white text-xs">
                                ₹{deal.dealAmountINR.toLocaleString()}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                  deal.status === 'approved_paid'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : deal.status === 'content_submitted'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : deal.status === 'accepted'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {deal.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-400">
                              Deadline: <strong className="text-white">{deal.deadline}</strong>
                            </span>

                            <div className="flex gap-2">
                              {/* Open Chat Negotiation */}
                              <button
                                onClick={() => setSelectedDealForChat(deal)}
                                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                                <span>Negotiation Chat</span>
                              </button>

                              {/* Submit Deliverable */}
                              {deal.status === 'accepted' && (
                                <button
                                  onClick={() => setSubmittingContentDealId(deal.id)}
                                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs"
                                >
                                  Submit Content Draft
                                </button>
                              )}

                              {/* Direct Approve & Release Escrow button (Simulation shortcut) */}
                              {deal.status === 'content_submitted' && (
                                <button
                                  onClick={() => handleApproveEscrowDirectly(deal.id)}
                                  className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                                >
                                  Release Escrow Payout ✓
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PAID SUBSCRIPTIONS (CREATOR MEMBERSHIPS) */}
              {activeTab === 'subscriptions' && (
                <div className="space-y-6 text-xs">
                  {/* Pricing Configuration Card */}
                  <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">Monthly Paid Membership Plan</h4>
                        <p className="text-[11px] text-slate-400">
                          Set your subscription price. Followers gain exclusive posts, subscriber badges, and private live streams.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 font-mono text-[10px] font-bold border border-violet-500/30">
                        {subscriptions.length} Active Members
                      </span>
                    </div>

                    <form onSubmit={handleSaveSubPrice} className="flex items-center gap-3 max-w-sm">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₹</span>
                        <input
                          type="number"
                          value={subPriceInput}
                          onChange={(e) => setSubPriceInput(e.target.value)}
                          min="49"
                          max="4999"
                          className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:border-violet-500 outline-none"
                        />
                      </div>
                      <span className="text-slate-400 font-mono">/ month</span>
                      <button
                        type="submit"
                        className="py-2 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors shrink-0"
                      >
                        Save Price
                      </button>
                    </form>

                    {priceSavedSuccess && (
                      <p className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Subscription price updated successfully!
                      </p>
                    )}
                  </div>

                  {/* Included Subscriber Perks */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                    <h5 className="font-bold text-white text-xs">Exclusive Perks Active for Subscribers</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-violet-400" />
                        <span className="text-slate-300">Subscriber-Only Exclusive Posts & Carousels</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
                        <span className="text-slate-300">VIP Golden Crown Badge on Comments & DMs</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-slate-300">Subscriber-Only Private Live Stream Stages</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-300">Community Tab Exclusive Polls & Downloads</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Subscribers Roster */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-white text-xs">Current Paid Subscribers ({subscriptions.length})</h5>
                    <div className="divide-y divide-slate-900 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden">
                      {subscriptions.map((sub) => (
                        <div key={sub.id} className="p-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={sub.subscriberUser.avatar} alt={sub.subscriberUser.fullName} className="w-8 h-8 rounded-full object-cover border border-violet-500/40" />
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{sub.subscriberUser.fullName}</span>
                                <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] border border-amber-500/30">
                                  {sub.badgeLevel}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">@{sub.subscriberUser.username} • Renews {sub.renewsAt}</span>
                            </div>
                          </div>

                          <div className="text-right font-mono font-bold text-emerald-400 text-xs">
                            +₹{sub.monthlyPriceINR}/mo
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VIRTUAL GIFTS & COIN WALLET */}
              {activeTab === 'gifts' && (
                <div className="space-y-6 text-xs">
                  {/* Coin Balance & Top Up Banner */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-slate-400 text-[11px] font-mono">Your Supporter Coin Balance</div>
                      <div className="text-2xl font-bold font-mono text-amber-300 flex items-center gap-2">
                        <span>🪙 {wallet.userCoinBalance} Coins</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Use coins to gift other creators on live streams, reels and stories</p>
                    </div>

                    <button
                      onClick={() => setShowBuyCoins(!showBuyCoins)}
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
                    >
                      Top Up Coins
                    </button>
                  </div>

                  {/* Coin Packs Drawer */}
                  {showBuyCoins && (
                    <div className="p-4 rounded-3xl bg-slate-950 border border-amber-500/30 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">Purchase Digital Coins Pack</span>
                        <span className="text-slate-400 font-mono">UPI & Cards</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { coins: 100, price: 99 },
                          { coins: 350, price: 299 },
                          { coins: 1200, price: 899 },
                        ].map((pack, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              sound.playSparkle();
                              socialStore.buyCoinPack(pack.coins, pack.price);
                              refreshState();
                              setShowBuyCoins(false);
                            }}
                            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400 text-center space-y-1 transition-all"
                          >
                            <div className="font-mono font-bold text-amber-300 text-sm">🪙 {pack.coins}</div>
                            <div className="text-[11px] text-white font-bold font-mono">₹{pack.price}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Virtual Gifts Catalogue */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-sm">Virtual Gifts Catalogue & Earnings Value</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {virtualGifts.map((gift) => (
                        <div key={gift.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                          <div className="text-3xl animate-bounce">{gift.icon}</div>
                          <div className="font-bold text-white text-xs">{gift.name}</div>
                          <div className="text-[10px] text-amber-300 font-mono font-semibold">🪙 {gift.coinCost} coins</div>
                          <div className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 py-0.5 rounded-md border border-emerald-500/20">
                            Creator earns: ₹{gift.cashValueINR}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: VIDEO & REELS AD REVENUE */}
              {activeTab === 'ads' && (
                <div className="space-y-6 text-xs">
                  <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">Ad Revenue Sharing & Performance RPM</h4>
                        <p className="text-[11px] text-slate-400">
                          Earn ₹55% of all contextual and non-intrusive stream ads rendered across your reels and videos.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                        55% Creator Share
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-slate-400">Average RPM</span>
                        <div className="text-base font-bold font-mono text-emerald-400">₹58.40</div>
                        <div className="text-[10px] text-slate-500">per 1,000 views</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-slate-400">Eligible Views</span>
                        <div className="text-base font-bold font-mono text-white">168,420</div>
                        <div className="text-[10px] text-slate-500">100% human verified</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-slate-400">Ad Earnings</span>
                        <div className="text-base font-bold font-mono text-white">₹{wallet.adRevenueEarningsINR.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-400">Settled to wallet</div>
                      </div>
                    </div>
                  </div>

                  {/* Monetized Content List */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-white text-xs">Top Monetized Videos & Reels</h5>
                    <div className="divide-y divide-slate-900 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden">
                      {[
                        { title: 'Tokyo Cyberpunk Hyper-Drive (120Hz Master)', views: 82400, rpm: '₹62.10', earned: '₹5,117' },
                        { title: 'Zero-Latency Gesture Physics Breakdown', views: 48900, rpm: '₹56.80', earned: '₹2,777' },
                        { title: 'Brutalist Spatial UI & Glass Gradients', views: 37120, rpm: '₹51.30', earned: '₹1,904' },
                      ].map((item, i) => (
                        <div key={i} className="p-3.5 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-xs">{item.title}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {item.views.toLocaleString()} views • RPM {item.rpm}
                            </div>
                          </div>
                          <div className="text-right font-mono font-bold text-emerald-400 text-xs">
                            {item.earned}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: PAYOUTS & KYC */}
              {activeTab === 'payouts' && (
                <div className="space-y-6 text-xs">
                  {/* KYC Status Banner */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">KYC & Identity Verification</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                            {profile.kycStatus === 'verified' ? 'Verified ✓' : 'Pending Verification'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          PAN Card: <strong className="text-white font-mono">{profile.panNumber || 'Not submitted'}</strong> • Verified via Govt NSDL API
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowKYCForm(!showKYCForm)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-semibold text-xs"
                    >
                      {profile.kycStatus === 'verified' ? 'Edit KYC' : 'Submit KYC'}
                    </button>
                  </div>

                  {/* KYC Form Modal/Drawer */}
                  {showKYCForm && (
                    <form onSubmit={handleSaveKYC} className="p-5 rounded-3xl bg-slate-950 border border-violet-500/30 space-y-3">
                      <h5 className="font-bold text-white text-xs">Tax Identification & PAN Verification</h5>
                      <div className="space-y-2">
                        <label className="text-slate-400 text-[11px]">Indian Permanent Account Number (PAN)</label>
                        <input
                          type="text"
                          value={panInput}
                          onChange={(e) => setPanInput(e.target.value)}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono uppercase focus:border-violet-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-slate-400 text-[11px]">Identity Document Proof</label>
                        <input
                          type="text"
                          value={docNameInput}
                          onChange={(e) => setDocNameInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-violet-500 outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setShowKYCForm(false)} className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300">
                          Cancel
                        </button>
                        <button type="submit" className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                          Verify & Save
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Payout Destination (UPI / Bank Account) */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white text-sm">Settlement Destination (UPI & Bank)</h4>
                        <p className="text-[11px] text-slate-400">Withdrawals are credited within 24 hours to your verified account</p>
                      </div>
                      <button
                        onClick={() => setShowPaymentForm(!showPaymentForm)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-semibold text-xs"
                      >
                        Change Details
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <div className="text-slate-400 font-mono text-[10px]">Primary UPI ID</div>
                        <div className="font-bold text-emerald-400 font-mono">{profile.paymentDetails.upiId}</div>
                        <div className="text-[10px] text-slate-500">Supports GPay, PhonePe, Paytm, BHIM</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <div className="text-slate-400 font-mono text-[10px]">Domestic Indian Bank Account</div>
                        <div className="font-bold text-white font-mono">{profile.paymentDetails.bankName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          A/C: •••• {profile.paymentDetails.bankAccountNumber?.slice(-4)} • IFSC: {profile.paymentDetails.bankIfscCode}
                        </div>
                      </div>
                    </div>

                    {showPaymentForm && (
                      <form onSubmit={handleSavePaymentDetails} className="pt-3 border-t border-slate-900 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-400">UPI ID</label>
                            <input
                              type="text"
                              value={upiInput}
                              onChange={(e) => setUpiInput(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-400">Bank Account Number</label>
                            <input
                              type="text"
                              value={bankAccInput}
                              onChange={(e) => setBankAccInput(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-400">Bank IFSC Code</label>
                            <input
                              type="text"
                              value={bankIfscInput}
                              onChange={(e) => setBankIfscInput(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs outline-none uppercase"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-400">Bank Name & Branch</label>
                            <input
                              type="text"
                              value={bankNameInput}
                              onChange={(e) => setBankNameInput(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button type="button" onClick={() => setShowPaymentForm(false)} className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300">
                            Cancel
                          </button>
                          <button type="submit" className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                            Save Destination
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Withdrawal & Settlement History */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-white text-xs">Audited Withdrawal History & Tax Invoices</h5>
                    <div className="divide-y divide-slate-900 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden">
                      {withdrawals.map((w) => (
                        <div key={w.id} className="p-3.5 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-2">
                              <span>₹{w.amountINR.toLocaleString()}</span>
                              <span
                                className={`px-2 py-0.2 rounded-full font-mono text-[9px] font-bold ${
                                  w.status === 'paid'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {w.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Receipt #{w.receiptNumber} • {w.payoutDestination} • {w.requestedAt}
                            </div>
                          </div>

                          <button
                            onClick={() => setViewingReceipt(w)}
                            className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-violet-400 border border-slate-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Slip</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Brand Deal Chat Negotiation Modal */}
        {selectedDealForChat && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-2.5">
                  <img src={selectedDealForChat.brandLogo} alt={selectedDealForChat.brandName} className="w-8 h-8 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-bold text-white text-xs">{selectedDealForChat.brandName}</h5>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Deal: ₹{selectedDealForChat.dealAmountINR.toLocaleString()} • {selectedDealForChat.status}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedDealForChat(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {selectedDealForChat.chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === 'creator' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.sender === 'creator'
                          ? 'bg-violet-600 text-white rounded-br-xs'
                          : 'bg-slate-800 text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      {msg.proposedAmountINR && (
                        <div className="mt-1 font-mono font-bold text-amber-300 text-[11px]">
                          Proposed Rate: ₹{msg.proposedAmountINR.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 font-mono">{msg.timestamp}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendDealMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
                <input
                  type="text"
                  value={dealChatText}
                  onChange={(e) => setDealChatText(e.target.value)}
                  placeholder="Discuss terms or counter-propose rate..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs outline-none focus:border-violet-500"
                />
                <button type="submit" className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Submit Content Draft Modal */}
        {submittingContentDealId && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm">Submit Deliverable Draft</h4>
                <button onClick={() => setSubmittingContentDealId(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">Deliverable Media URL / Reel Link</label>
                  <input
                    type="text"
                    value={contentDraftUrl}
                    onChange={(e) => setContentDraftUrl(e.target.value)}
                    placeholder="https://... or uploaded post URL"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Submission Notes & Tags Used</label>
                  <textarea
                    rows={3}
                    value={contentDraftNotes}
                    onChange={(e) => setContentDraftNotes(e.target.value)}
                    placeholder="Included sponsored hashtag #CyberVolt and product link sticker."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setSubmittingContentDealId(null)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs">
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitDeliverableDraft(submittingContentDealId)}
                  className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
                >
                  Send for Approval
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Modal */}
        {showWithdrawForm && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Withdraw to Bank / UPI</h4>
                    <span className="text-[10px] text-slate-400">Available: ₹{wallet.availableBalanceINR.toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setShowWithdrawForm(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleExecuteWithdrawal} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">Withdrawal Amount (Min ₹1,000)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₹</span>
                    <input
                      type="number"
                      value={withdrawAmountInput}
                      onChange={(e) => setWithdrawAmountInput(e.target.value)}
                      min="1000"
                      max={wallet.availableBalanceINR}
                      className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Payout Channel</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethodInput('upi')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        withdrawMethodInput === 'upi'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      Instant UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawMethodInput('bank_transfer')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        withdrawMethodInput === 'bank_transfer'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      NEFT / IMPS Bank
                    </button>
                  </div>
                </div>

                {/* Live Tax & Fee Deduction Summary */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Withdrawal</span>
                    <span className="font-mono text-white font-semibold">₹{parseInt(withdrawAmountInput || '0').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Section 194-O TDS (1%)</span>
                    <span className="font-mono text-rose-400">-₹{Math.round((parseInt(withdrawAmountInput || '0') * 0.01)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Settlement Fee</span>
                    <span className="font-mono text-emerald-400">₹0 (Free)</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold">
                    <span className="text-white">Net Payout to Account</span>
                    <span className="font-mono text-emerald-400 text-sm">
                      ₹{Math.max(0, parseInt(withdrawAmountInput || '0') - Math.round(parseInt(withdrawAmountInput || '0') * 0.01)).toLocaleString()}
                    </span>
                  </div>
                </div>

                {withdrawError && (
                  <p className="text-rose-400 text-[11px] font-semibold">{withdrawError}</p>
                )}
                {withdrawSuccessMsg && (
                  <p className="text-emerald-400 text-[11px] font-semibold">{withdrawSuccessMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  Confirm Payout Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Official Indian Tax Invoice / Payment Receipt Slip Modal */}
        {viewingReceipt && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setViewingReceipt(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1 pb-2 border-b border-slate-800">
                <div className="w-10 h-10 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h4 className="text-base font-bold text-white">Payment Disbursement Receipt</h4>
                <div className="text-[10px] text-slate-400 font-mono">Invoice #{viewingReceipt.receiptNumber}</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Beneficiary:</span>
                    <span className="text-white font-bold">{CURRENT_USER.fullName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Settled To:</span>
                    <span className="text-white">{viewingReceipt.payoutDestination}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Reference No:</span>
                    <span className="text-emerald-400">{viewingReceipt.transactionReference || 'UPI-SETTLE-PENDING'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Date & Time:</span>
                    <span className="text-white">{viewingReceipt.requestedAt}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Disbursed:</span>
                    <span className="font-mono text-white">₹{viewingReceipt.amountINR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>TDS Deducted (Sec 194-O):</span>
                    <span className="font-mono text-rose-400">-₹{viewingReceipt.tdsAmountINR.toLocaleString()}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800 flex justify-between font-bold">
                    <span className="text-white">Net Transferred:</span>
                    <span className="font-mono text-emerald-400">₹{viewingReceipt.netPayoutINR.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingReceipt(null)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
