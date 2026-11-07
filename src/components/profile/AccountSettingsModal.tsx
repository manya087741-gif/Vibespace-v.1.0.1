import React, { useState } from 'react';
import { 
  X, ChevronRight, Shield, Lock, Bell, Eye, Globe, 
  Download, UserX, KeyRound, Smartphone, AlertTriangle, 
  LogOut, Trash2, Check, Sparkles, SmartphoneCharging, ArrowLeft,
  Search, Sliders, Film, MessageCircle, Heart, Palette, 
  Layers, HelpCircle, ShieldCheck, UserCheck, RefreshCw, 
  Volume2, CheckCircle2, UserPlus, DollarSign, Laptop, 
  FileText, Info, Award, User as UserIcon, Clock, Moon, Sun, Monitor
} from 'lucide-react';
import { User, UserSettings, LoginSession, AuthAccount, SupportTicket } from '../../types';
import { socialStore } from '../../utils/socialStore';
import { sound } from '../../utils/audioSynth';

interface AccountSettingsModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updated: User) => void;
  onOpenEditProfile?: () => void;
  onOpenAccountInfo?: () => void;
  onOpenMonetizationHub?: () => void;
  onOpenProfessionalDashboard?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'signup' | 'otp' | 'switch_accounts') => void;
}

type SettingsSection = 
  | 'menu' 
  | 'account'
  | 'security' 
  | 'privacy' 
  | 'notifications' 
  | 'stories_reels'
  | 'messages_calls'
  | 'content_preferences'
  | 'app_settings'
  | 'creator_studio'
  | 'help_support'
  | 'blocked' 
  | 'download_data'
  | 'report_bug';

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  user,
  onClose,
  onUpdateUser,
  onOpenEditProfile,
  onOpenAccountInfo,
  onOpenMonetizationHub,
  onOpenProfessionalDashboard,
  onOpenAuthModal,
}) => {
  const [section, setSection] = useState<SettingsSection>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<UserSettings>(socialStore.getUserSettings());
  const [blockedUsers, setBlockedUsers] = useState<User[]>(socialStore.getAllUsers().filter((u) => u.isBlocked));

  // Modals for confirmation
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  // Hidden word state
  const [newHiddenWord, setNewHiddenWord] = useState('');

  // Support Ticket Form
  const [bugSubject, setBugSubject] = useState('');
  const [bugCategory, setBugCategory] = useState<'bug' | 'content_violation' | 'account_access' | 'billing' | 'general'>('bug');
  const [bugDesc, setBugDesc] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Recovery Codes state
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Download Data State
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Cache freed state
  const [cacheFreedMB, setCacheFreedMB] = useState<number | null>(null);

  // Generic instant save helper for Settings
  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    sound.playHeartPop();
    const updated = socialStore.updateUserSettings({ [key]: value });
    setSettings(updated);
  };

  const updateNestedNotification = (notifKey: keyof UserSettings['notifications'], val: boolean) => {
    sound.playHeartPop();
    const updatedNotifs = {
      ...settings.notifications,
      [notifKey]: val,
    };
    const updated = socialStore.updateUserSettings({ notifications: updatedNotifs });
    setSettings(updated);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus('New passwords do not match.');
      return;
    }
    const res = socialStore.changePassword(oldPassword, newPassword);
    if (res.success) {
      sound.playSparkle();
      setPasswordStatus('Password rotated and verified successfully! ✓');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordStatus(null), 3000);
    } else {
      setPasswordStatus(res.message);
    }
  };

  const handleTogglePrivate = () => {
    const next = !settings.isPrivate;
    updateSetting('isPrivate', next);
    const updatedUser = socialStore.updateCurrentUser({ isPrivateAccount: next });
    onUpdateUser(updatedUser);
  };

  const handleToggleActivityStatus = () => {
    const next = !settings.activityStatus;
    updateSetting('activityStatus', next);
    const updatedUser = socialStore.updateCurrentUser({ activityStatusEnabled: next });
    onUpdateUser(updatedUser);
  };

  const handleUnblockUser = (blockedId: string) => {
    sound.playHeartPop();
    socialStore.toggleBlockUser(blockedId);
    setBlockedUsers(socialStore.getAllUsers().filter((u) => u.isBlocked));
  };

  const handleAddHiddenWord = () => {
    if (!newHiddenWord.trim()) return;
    sound.playHeartPop();
    const updatedList = [...settings.hiddenWords, newHiddenWord.trim().toLowerCase()];
    updateSetting('hiddenWords', updatedList);
    setNewHiddenWord('');
  };

  const handleRemoveHiddenWord = (word: string) => {
    sound.playHeartPop();
    const updatedList = settings.hiddenWords.filter((w) => w !== word);
    updateSetting('hiddenWords', updatedList);
  };

  const handleGenerateRecoveryCodes = () => {
    sound.playSparkle();
    const newCodes = socialStore.generateRecoveryCodes();
    setSettings({ ...settings, recoveryCodes: newCodes });
  };

  const handleCopyRecoveryCodes = () => {
    sound.playHeartPop();
    navigator.clipboard?.writeText(settings.recoveryCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleClearCache = () => {
    sound.playSparkle();
    const freed = socialStore.clearAppCache();
    setCacheFreedMB(freed);
    setSettings(socialStore.getUserSettings());
    setTimeout(() => setCacheFreedMB(null), 3500);
  };

  const handleClearHistory = () => {
    sound.playHeartPop();
    socialStore.clearSearchHistory();
    setSettings(socialStore.getUserSettings());
  };

  const handleDownloadUserData = () => {
    sound.playSparkle();
    setIsDownloading(true);
    setTimeout(() => {
      const data = {
        exportedAt: new Date().toISOString(),
        profile: user,
        settings: settings,
        postsCount: socialStore.getUserPosts(user.id).length,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        securityRating: 'Hardware Flag Secure E2EE Verified',
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vibespace_data_export_${user.username}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIsDownloading(false);
      setDownloadSuccess(true);
    }, 1000);
  };

  const handleSubmitBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugSubject.trim() || !bugDesc.trim()) return;
    sound.playSparkle();
    socialStore.submitSupportTicket({
      subject: bugSubject,
      category: bugCategory,
      description: bugDesc,
    });
    setTicketSubmitted(true);
    setBugSubject('');
    setBugDesc('');
    setTimeout(() => {
      setTicketSubmitted(false);
      setSection('help_support');
    }, 2000);
  };

  // Filtered menu items for search bar
  const allMenuOptions = [
    { title: 'Account & Personal Info', desc: 'Username, Email, Phone, Deactivation', section: 'account', icon: UserIcon, cat: 'account' },
    { title: 'Password & Security', desc: '2FA, Sessions, Trusted Devices, Recovery', section: 'security', icon: Lock, cat: 'security' },
    { title: 'Privacy & Permissions', desc: 'Private account, Comments, Tags, Mentions', section: 'privacy', icon: Eye, cat: 'privacy' },
    { title: 'Notifications', desc: 'Likes, Comments, Messages, Master Pause', section: 'notifications', icon: Bell, cat: 'notifications' },
    { title: 'Story & Reel Settings', desc: 'Archive, Auto-captions, Remix, Quality', section: 'stories_reels', icon: Film, cat: 'stories' },
    { title: 'Messages & Calling', desc: 'Requests, Read receipts, Call permissions', section: 'messages_calls', icon: MessageCircle, cat: 'messages' },
    { title: 'Content Preferences', desc: 'Sensitive content, Favorites, Search history', section: 'content_preferences', icon: Sliders, cat: 'content' },
    { title: 'App Settings & Cache', desc: 'Dark/Light Theme, Language, Clear cache', section: 'app_settings', icon: Palette, cat: 'app' },
    { title: 'Creator & Professional Studio', desc: 'Monetization, Analytics, Payouts', section: 'creator_studio', icon: DollarSign, cat: 'creator' },
    { title: 'Help & Support', desc: 'Report a bug, Account status, Guidelines', section: 'help_support', icon: HelpCircle, cat: 'help' },
  ];

  const filteredOptions = allMenuOptions.filter(
    (opt) =>
      opt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {section !== 'menu' && (
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setSection('menu');
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors -ml-1 mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="text-sm font-bold text-white">
              {section === 'menu' && 'Settings & Privacy'}
              {section === 'account' && 'Account & Personal Information'}
              {section === 'security' && 'Login & Security Suite'}
              {section === 'privacy' && 'Privacy & Permissions'}
              {section === 'notifications' && 'Notifications Management'}
              {section === 'stories_reels' && 'Story & Reel Settings'}
              {section === 'messages_calls' && 'Messages & Calling Controls'}
              {section === 'content_preferences' && 'Content Preferences & History'}
              {section === 'app_settings' && 'App Settings & Accessibility'}
              {section === 'creator_studio' && 'Creator & Professional Studio'}
              {section === 'help_support' && 'Help, Support & Account Standing'}
              {section === 'blocked' && 'Blocked Accounts'}
              {section === 'download_data' && 'Download Your Data'}
              {section === 'report_bug' && 'Report a Problem / Bug'}
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playHeartPop();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar (Menu View Only) */}
        {section === 'menu' && (
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all settings & privacy options..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* ================= MAIN MENU ================= */}
          {section === 'menu' && (
            <div className="space-y-4">
              {/* Account Quick Banner */}
              <div 
                onClick={() => {
                  sound.playHeartPop();
                  if (onOpenAccountInfo) onOpenAccountInfo();
                  else setSection('account');
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-950 to-slate-950 border border-violet-500/30 flex items-center justify-between cursor-pointer hover:border-violet-500/50 transition-all shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">{user.fullName}</span>
                      {user.verified && <span className="text-violet-400">✓</span>}
                    </div>
                    <span className="text-slate-400 font-mono text-[10px] block">@{user.username}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                      View Official Account Info & Identity →
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>

              {/* Categorized List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Settings Directory
                </span>

                <div className="bg-slate-950/70 rounded-2xl border border-slate-800/80 divide-y divide-slate-800/80 overflow-hidden">
                  {filteredOptions.map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.section}
                        onClick={() => {
                          sound.playHeartPop();
                          setSection(opt.section as SettingsSection);
                        }}
                        className="w-full p-3.5 flex items-center justify-between hover:bg-slate-900/60 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-900 rounded-xl text-slate-300 group-hover:text-violet-400 group-hover:bg-violet-950/30 transition-all">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-xs">{opt.title}</span>
                            <span className="text-[10px] text-slate-400 block">{opt.desc}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multi-Account & Sign Out Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    sound.playHeartPop();
                    if (onOpenAuthModal) onOpenAuthModal('switch_accounts');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
                  <span>Switch Accounts (Multi-Account)</span>
                </button>

                <button
                  onClick={() => {
                    sound.playHeartPop();
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of @{user.username}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= 1. ACCOUNT SETTINGS ================= */}
          {section === 'account' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 divide-y divide-slate-800 overflow-hidden">
                {/* Edit Profile Shortcut */}
                <div 
                  onClick={() => {
                    sound.playHeartPop();
                    if (onOpenEditProfile) {
                      onClose();
                      onOpenEditProfile();
                    }
                  }}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/60"
                >
                  <div className="flex items-center gap-2.5">
                    <UserIcon className="w-4 h-4 text-violet-400" />
                    <div>
                      <span className="font-semibold text-white block">Edit Public Profile</span>
                      <span className="text-[10px] text-slate-400">Name, bio, website link, category</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>

                {/* Account Information Shortcut */}
                <div 
                  onClick={() => {
                    sound.playHeartPop();
                    if (onOpenAccountInfo) onOpenAccountInfo();
                  }}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/60"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-white block">Official Account Records</span>
                      <span className="text-[10px] text-slate-400">UUID, registration date, verified badges</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>

                {/* Email */}
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Registered Email</span>
                    <span className="font-mono text-white text-xs">{settings.email}</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[10px]">Verified ✓</span>
                </div>

                {/* Phone */}
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Registered Mobile Number</span>
                    <span className="font-mono text-white text-xs">{settings.phone}</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[10px]">Verified ✓</span>
                </div>

                {/* Birthday & Gender */}
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date of Birth & Gender</span>
                    <span className="text-white text-xs">{settings.birthday} · {settings.gender}</span>
                  </div>
                </div>

                {/* Account Type */}
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Account Category</span>
                    <span className="text-white font-semibold capitalize text-xs">{settings.accountType} Account</span>
                  </div>
                  <button
                    onClick={() => {
                      const next = settings.accountType === 'creator' ? 'business' : settings.accountType === 'business' ? 'personal' : 'creator';
                      updateSetting('accountType', next);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-semibold"
                  >
                    Switch Type
                  </button>
                </div>
              </div>

              {/* Data Export & Deactivation */}
              <div className="space-y-2">
                <button
                  onClick={() => setSection('download_data')}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-violet-400" />
                  <span>Download Your Information (JSON)</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setShowDeactivateConfirm(true)}
                    className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 font-semibold text-xs"
                  >
                    Deactivate Account
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-semibold text-xs"
                  >
                    Permanently Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. LOGIN & SECURITY ================= */}
          {section === 'security' && (
            <div className="space-y-4">
              {/* Change Password Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-violet-400" />
                  <span className="font-bold text-white text-xs">Change Password</span>
                </div>

                {passwordStatus && (
                  <div className={`p-2.5 rounded-xl text-xs ${
                    passwordStatus.includes('✓') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {passwordStatus}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-2">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                  <input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs"
                  >
                    Update Password & Rotate Keys
                  </button>
                </form>
              </div>

              {/* Two-Factor Authentication */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[10px] text-slate-400">Require 6-digit OTP code upon unrecognized device logins</span>
                </div>
                <button
                  onClick={() => updateSetting('twoFactorEnabled', !settings.twoFactorEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    settings.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Security Alerts */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Suspicious Login Alerts</span>
                  <span className="text-[10px] text-slate-400">Receive instant push notification if a new IP accesses account</span>
                </div>
                <button
                  onClick={() => updateSetting('suspiciousLoginAlerts', !settings.suspiciousLoginAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    settings.suspiciousLoginAlerts ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.suspiciousLoginAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Recovery Codes */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">Emergency Recovery Backup Codes</span>
                  <button
                    onClick={handleGenerateRecoveryCodes}
                    className="text-[10px] text-violet-400 hover:underline"
                  >
                    Regenerate
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-emerald-400 bg-black/40 p-2.5 rounded-xl border border-slate-900">
                  {settings.recoveryCodes.map((code, idx) => (
                    <span key={idx}>{code}</span>
                  ))}
                </div>
                <button
                  onClick={handleCopyRecoveryCodes}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[10px] font-mono flex items-center justify-center gap-1"
                >
                  {copiedCodes ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{copiedCodes ? 'Codes Copied to Clipboard' : 'Copy All 5 Recovery Codes'}</span>
                </button>
              </div>

              {/* Active Logged-in Devices */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Logged-in Devices ({settings.loginActivity.length})
                  </span>
                  <button
                    onClick={() => {
                      sound.playSparkle();
                      socialStore.logoutAllOtherDevices();
                      setSettings(socialStore.getUserSettings());
                    }}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Log Out Other Devices
                  </button>
                </div>

                <div className="space-y-2">
                  {settings.loginActivity.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-violet-400" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white text-xs">{sess.device}</span>
                            {sess.isCurrent && (
                              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[8px]">
                                This Device
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[10px] block">{sess.location} · {sess.time}</span>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          onClick={() => {
                            socialStore.removeDeviceSession(sess.id);
                            setSettings(socialStore.getUserSettings());
                          }}
                          className="text-[10px] text-rose-400 hover:underline"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. PRIVACY SETTINGS ================= */}
          {section === 'privacy' && (
            <div className="space-y-3">
              {/* Private Account */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Private Account</span>
                  <span className="text-[10px] text-slate-400">Only approved followers can view your media</span>
                </div>
                <button
                  onClick={handleTogglePrivate}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    settings.isPrivate ? 'bg-violet-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.isPrivate ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Activity Status */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Show Activity Status</span>
                  <span className="text-[10px] text-slate-400">Allow accounts you follow to see when you're active</span>
                </div>
                <button
                  onClick={handleToggleActivityStatus}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    settings.activityStatus ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.activityStatus ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Read Receipts */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Read Receipts (Seen Indicator)</span>
                  <span className="text-[10px] text-slate-400">Show when you have viewed direct messages</span>
                </div>
                <button
                  onClick={() => updateSetting('readReceipts', !settings.readReceipts)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    settings.readReceipts ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.readReceipts ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Who Can Interactions */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <span className="font-semibold text-white text-xs block">Interaction Permissions</span>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Who Can Tag You</span>
                  <select
                    value={settings.whoCanTag}
                    onChange={(e) => updateSetting('whoCanTag', e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="following">People You Follow</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Who Can Mention You (@)</span>
                  <select
                    value={settings.whoCanMention}
                    onChange={(e) => updateSetting('whoCanMention', e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="following">People You Follow</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Who Can Comment on Posts</span>
                  <select
                    value={settings.whoCanComment}
                    onChange={(e) => updateSetting('whoCanComment', e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="following">Followers Only</option>
                    <option value="nobody">Off</option>
                  </select>
                </div>
              </div>

              {/* Hidden Words & Comment Moderation */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs block">Hidden Words & Anti-Spam Filter</span>
                <p className="text-[10px] text-slate-400">
                  Comments containing these custom words will be automatically quarantined.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHiddenWord}
                    onChange={(e) => setNewHiddenWord(e.target.value)}
                    placeholder="Add filtered word..."
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                  <button
                    onClick={handleAddHiddenWord}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {settings.hiddenWords.map((word) => (
                    <span
                      key={word}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1.5"
                    >
                      <span>{word}</span>
                      <button
                        onClick={() => handleRemoveHiddenWord(word)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Blocked Accounts Shortcut */}
              <button
                onClick={() => setSection('blocked')}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-left hover:border-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <UserX className="w-4 h-4 text-rose-400" />
                  <span className="font-semibold text-white">Blocked Accounts ({blockedUsers.length})</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          )}

          {/* ================= 4. NOTIFICATIONS SETTINGS ================= */}
          {section === 'notifications' && (
            <div className="space-y-3">
              {/* Master Pause Switch */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/40 to-slate-950 border border-violet-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Pause All Notifications</span>
                  <span className="text-[10px] text-slate-400">Temporarily mute all sound & banners</span>
                </div>
                <button
                  onClick={() => updateNestedNotification('pauseAll', !settings.notifications.pauseAll)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    settings.notifications.pauseAll ? 'bg-rose-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.notifications.pauseAll ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Granular Toggles */}
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 divide-y divide-slate-800">
                {[
                  { key: 'likes', label: 'Likes & Reactions' },
                  { key: 'comments', label: 'Comments on Posts & Reels' },
                  { key: 'followers', label: 'New Followers' },
                  { key: 'followRequests', label: 'Follow Requests' },
                  { key: 'messages', label: 'Direct Messages' },
                  { key: 'stories', label: 'Stories from Accounts You Follow' },
                  { key: 'liveBroadcasts', label: 'Live Broadcast Alerts' },
                  { key: 'reels', label: 'Trending Reels & Suggestions' },
                  { key: 'mentionsTags', label: 'Mentions and Tags' },
                  { key: 'brandDeals', label: 'Brand Deal & Sponsorship Offers' },
                  { key: 'earnings', label: 'Creator Wallet & Payout Alerts' },
                  { key: 'pushEnabled', label: 'System Push Notifications' },
                  { key: 'emailNotifications', label: 'Email Summaries' },
                ].map(({ key, label }) => {
                  const val = (settings.notifications as any)[key] ?? true;
                  return (
                    <div key={key} className="p-3 flex items-center justify-between">
                      <span className="text-slate-300 text-xs font-semibold">{label}</span>
                      <button
                        onClick={() => updateNestedNotification(key as any, !val)}
                        className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                          val ? 'bg-violet-600' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          val ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= 5. STORY & REEL SETTINGS ================= */}
          {section === 'stories_reels' && (
            <div className="space-y-3">
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 divide-y divide-slate-800">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Save Story to Archive</span>
                    <span className="text-[10px] text-slate-400">Automatically save expired stories in private archive</span>
                  </div>
                  <button
                    onClick={() => updateSetting('saveStoryToArchive', !settings.saveStoryToArchive)}
                    className={`w-10 h-5 rounded-full transition-colors p-0.5 ${
                      settings.saveStoryToArchive ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.saveStoryToArchive ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Allow Reel Downloads</span>
                    <span className="text-[10px] text-slate-400">Let other users download reels with dynamic watermark</span>
                  </div>
                  <button
                    onClick={() => updateSetting('allowReelDownload', !settings.allowReelDownload)}
                    className={`w-10 h-5 rounded-full transition-colors p-0.5 ${
                      settings.allowReelDownload ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.allowReelDownload ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Allow Reel Remixing</span>
                    <span className="text-[10px] text-slate-400">Let creators duet or remix your audio tracks</span>
                  </div>
                  <button
                    onClick={() => updateSetting('allowReelRemix', !settings.allowReelRemix)}
                    className={`w-10 h-5 rounded-full transition-colors p-0.5 ${
                      settings.allowReelRemix ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.allowReelRemix ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Automatic Video Captions</span>
                    <span className="text-[10px] text-slate-400">Auto-generate synchronized subtitles</span>
                  </div>
                  <button
                    onClick={() => updateSetting('autoCaptions', !settings.autoCaptions)}
                    className={`w-10 h-5 rounded-full transition-colors p-0.5 ${
                      settings.autoCaptions ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.autoCaptions ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <span className="font-semibold text-white">Media Upload Quality</span>
                  <select
                    value={settings.uploadQuality}
                    onChange={(e) => updateSetting('uploadQuality', e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="ultra">Ultra 120Hz Master</option>
                    <option value="high">High Definition 1080p</option>
                    <option value="data_saver">Data Saver Mode</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. MESSAGES & CALLING ================= */}
          {section === 'messages_calls' && (
            <div className="space-y-3">
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 divide-y divide-slate-800">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Message Requests</span>
                    <span className="text-[10px] text-slate-400">Who can send initial direct messages</span>
                  </div>
                  <select
                    value={settings.messageRequestsPermission}
                    onChange={(e) => updateSetting('messageRequestsPermission', e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="followers">Followers Only</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Voice Calls</span>
                    <span className="text-[10px] text-slate-400">Incoming HD audio calls</span>
                  </div>
                  <select
                    value={settings.voiceCallPermissions}
                    onChange={(e) => updateSetting('voiceCallPermissions', e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="following">People You Follow</option>
                    <option value="nobody">Off</option>
                  </select>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Video Calls</span>
                    <span className="text-[10px] text-slate-400">Encrypted spatial video calls</span>
                  </div>
                  <select
                    value={settings.videoCallPermissions}
                    onChange={(e) => updateSetting('videoCallPermissions', e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="following">People You Follow</option>
                    <option value="nobody">Off</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. CONTENT PREFERENCES ================= */}
          {section === 'content_preferences' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs block">Sensitive Content Controls</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['standard', 'less', 'more'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateSetting('sensitiveContent', lvl)}
                      className={`p-2 rounded-xl border text-center capitalize transition-all ${
                        settings.sensitiveContent === lvl
                          ? 'bg-violet-600/30 border-violet-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search History */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">Recent Search History</span>
                  <button
                    onClick={handleClearHistory}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                {settings.searchHistory.length === 0 ? (
                  <span className="text-[10px] text-slate-500 block py-1">Search history is clear.</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {settings.searchHistory.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 text-[10px]">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 8. APP SETTINGS & CACHE ================= */}
          {section === 'app_settings' && (
            <div className="space-y-3">
              {/* Theme Picker */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs block">Interface Theme</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'dark'
                        ? 'bg-violet-600/30 border-violet-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-violet-400" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'light'
                        ? 'bg-violet-600/30 border-violet-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'system')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'system'
                        ? 'bg-violet-600/30 border-violet-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Monitor className="w-4 h-4 text-cyan-400" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">App Language</span>
                  <span className="text-[10px] text-slate-400">Interface localization</span>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                  <option value="Spanish (Español)">Spanish (Español)</option>
                  <option value="Japanese (日本語)">Japanese (日本語)</option>
                  <option value="French (Français)">French (Français)</option>
                  <option value="German (Deutsch)">German (Deutsch)</option>
                </select>
              </div>

              {/* Cache Management */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Media Cache Storage</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Currently utilizing {settings.cacheSizeMB.toFixed(1)} MB
                  </span>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Clear Cache
                </button>
              </div>
              {cacheFreedMB !== null && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs text-center font-mono">
                  ✓ Cache cleared! Freed {cacheFreedMB.toFixed(1)} MB of temporary storage.
                </div>
              )}
            </div>
          )}

          {/* ================= 9. CREATOR & PROFESSIONAL STUDIO ================= */}
          {section === 'creator_studio' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-xs">500 Genuine Followers Monetization Hub</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Access brand deals, monthly paid subscriptions, virtual gifts, and instant UPI/bank payouts.
                </p>
                <button
                  onClick={() => {
                    sound.playSparkle();
                    onClose();
                    if (onOpenMonetizationHub) onOpenMonetizationHub();
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Open Creator Monetization Hub →
                </button>
              </div>

              {/* Professional Insights shortcut */}
              <button
                onClick={() => {
                  sound.playSparkle();
                  onClose();
                  if (onOpenProfessionalDashboard) onOpenProfessionalDashboard();
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-violet-400" />
                <span>Open Professional Analytics & Growth Dashboard</span>
              </button>
            </div>
          )}

          {/* ================= 10. HELP & SUPPORT ================= */}
          {section === 'help_support' && (
            <div className="space-y-3">
              {/* Account Standing Check */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-bold text-emerald-300 block text-xs">Account Status: Good Standing</span>
                    <span className="text-[10px] text-slate-300">Zero policy strikes or community warnings</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-mono text-xs">Clean ✓</span>
              </div>

              {/* Report Problem Button */}
              <button
                onClick={() => setSection('report_bug')}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Report a Problem / Submit Ticket</span>
              </button>

              {/* Submitted Tickets Tracker */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Your Support Tickets ({settings.supportTickets?.length || 0})
                </span>

                <div className="space-y-2">
                  {settings.supportTickets?.map((tkt) => (
                    <div key={tkt.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-xs">{tkt.subject}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] capitalize">
                          {tkt.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{tkt.description}</p>
                      {tkt.response && (
                        <div className="p-2 rounded-lg bg-violet-950/40 text-violet-300 text-[10px] mt-1">
                          <strong>VibeSpace Support:</strong> {tkt.response}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Guidelines */}
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 divide-y divide-slate-800 text-[11px]">
                <div className="p-3 text-slate-300 flex items-center justify-between">
                  <span>Community Guidelines</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="p-3 text-slate-300 flex items-center justify-between">
                  <span>Terms of Service</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="p-3 text-slate-300 flex items-center justify-between">
                  <span>Zero-Knowledge Privacy Policy</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="p-3 text-slate-400 flex items-center justify-between font-mono text-[10px]">
                  <span>VibeSpace App Version</span>
                  <span>v4.2.0 (Build 2026.11)</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= BLOCKED USERS ================= */}
          {section === 'blocked' && (
            <div className="space-y-3">
              {blockedUsers.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  You have not blocked any accounts.
                </div>
              ) : (
                blockedUsers.map((blk) => (
                  <div
                    key={blk.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={blk.avatar} alt={blk.fullName} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <span className="text-white font-bold text-xs block">{blk.fullName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">@{blk.username}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblockUser(blk.id)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ================= DOWNLOAD DATA ================= */}
          {section === 'download_data' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 mx-auto flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Download Your VibeSpace Information</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Export an encrypted JSON file containing your posts, messages, followers, and configuration.
                </p>
              </div>

              {downloadSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <span className="text-emerald-300 font-bold block text-xs">Data export generated successfully!</span>
                  <span className="text-[10px] text-slate-400">File downloaded to your local device.</span>
                </div>
              ) : (
                <button
                  onClick={handleDownloadUserData}
                  disabled={isDownloading}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  {isDownloading ? 'Preparing Encrypted Package...' : 'Request & Download Archive'}
                </button>
              )}
            </div>
          )}

          {/* ================= REPORT BUG ================= */}
          {section === 'report_bug' && (
            <form onSubmit={handleSubmitBug} className="space-y-3">
              {ticketSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs">
                  ✓ Ticket submitted! Our security & moderation team is reviewing it.
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Category</label>
                <select
                  value={bugCategory}
                  onChange={(e) => setBugCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                >
                  <option value="bug">Technical Bug / Crash</option>
                  <option value="content_violation">Report Offensive Content</option>
                  <option value="account_access">Account Access Issue</option>
                  <option value="billing">Earnings / Payout Problem</option>
                  <option value="general">Feature Feedback</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Subject / Issue Summary</label>
                <input
                  type="text"
                  required
                  value={bugSubject}
                  onChange={(e) => setBugSubject(e.target.value)}
                  placeholder="e.g. 120Hz frame pacing on iOS"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={bugDesc}
                  onChange={(e) => setBugDesc(e.target.value)}
                  placeholder="Explain steps to reproduce or details of the issue..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs"
              >
                Submit Support Ticket
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Confirmation Dialogs */}
      {/* 1. Logout Confirm */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xs w-full text-center space-y-3">
            <LogOut className="w-10 h-10 text-rose-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Log out of @{user.username}?</h4>
            <p className="text-xs text-slate-400">
              You can log back in at any time with your credentials or OTP.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playSparkle();
                  setShowLogoutConfirm(false);
                  onClose();
                  if (onOpenAuthModal) onOpenAuthModal('login');
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Deactivate Confirm */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xs w-full text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Deactivate Your Account?</h4>
            <p className="text-xs text-slate-400">
              Your profile, posts, and comments will be hidden until you log back in.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playSparkle();
                  socialStore.deactivateAccount();
                  setShowDeactivateConfirm(false);
                  onClose();
                  if (onOpenAuthModal) onOpenAuthModal('login');
                }}
                className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Permanent Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-5 max-w-xs w-full text-center space-y-3">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">Permanently Delete Account?</h4>
            <p className="text-xs text-rose-300/80">
              This action is permanent and cannot be undone. All encrypted media, messages, and followers will be permanently expunged.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playSparkle();
                  socialStore.deleteAccountPermanently();
                  setShowDeleteConfirm(false);
                  onClose();
                  if (onOpenAuthModal) onOpenAuthModal('signup');
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
