import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Lock,
  Bell,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  Search,
  Smartphone,
  KeyRound,
  Eye,
  MessageCircle,
  AtSign,
  Tag,
  DollarSign,
  BarChart2,
  Download,
  UserX,
  Check,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { User, UserSettings } from '../../types';
import { socialStore } from '../../utils/socialStore';
import { sound } from '../../utils/audioSynth';

interface SettingsPanelProps {
  user: User;
  onBack?: () => void;
  onUpdateUser?: (updated: User) => void;
  onOpenEditProfile?: () => void;
  onOpenAccountInfo?: () => void;
  onOpenMonetizationHub?: () => void;
  onOpenProfessionalDashboard?: () => void;
}

type PanelSection = 'overview' | 'account' | 'security' | 'privacy' | 'notifications' | 'creator';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
      checked ? 'bg-violet-600' : 'bg-slate-700'
    }`}
  >
    <div
      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  user,
  onBack,
  onUpdateUser,
  onOpenEditProfile,
  onOpenAccountInfo,
  onOpenMonetizationHub,
  onOpenProfessionalDashboard,
}) => {
  const [section, setSection] = useState<PanelSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<UserSettings>(socialStore.getUserSettings());
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const showSaved = (msg = 'Preference saved') => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 1800);
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    sound.playHeartPop();
    const updated = socialStore.updateUserSettings({ [key]: value });
    setSettings(updated);
    showSaved();
  };

  const updateNotification = (key: keyof UserSettings['notifications'], value: boolean) => {
    sound.playHeartPop();
    const updatedNotifs = {
      ...settings.notifications,
      [key]: value,
    };
    const updated = socialStore.updateUserSettings({ notifications: updatedNotifs });
    setSettings(updated);
    showSaved();
  };

  const handleTogglePrivateAccount = () => {
    const next = !settings.isPrivate;
    updateSetting('isPrivate', next);
    const updatedUser = socialStore.updateCurrentUser({ isPrivateAccount: next });
    if (onUpdateUser) onUpdateUser(updatedUser);
  };

  const handleToggleActivityStatus = () => {
    const next = !settings.activityStatus;
    updateSetting('activityStatus', next);
    const updatedUser = socialStore.updateCurrentUser({ activityStatusEnabled: next });
    if (onUpdateUser) onUpdateUser(updatedUser);
  };

  const handleToggleProfessionalAccount = () => {
    const next = !settings.isProfessionalAccount;
    updateSetting('isProfessionalAccount', next);
    const updatedUser = socialStore.updateCurrentUser({ isProfessionalAccount: next });
    if (onUpdateUser) onUpdateUser(updatedUser);
  };

  const sectionsList: {
    id: Exclude<PanelSection, 'overview'>;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'account',
      title: 'Account',
      subtitle: 'Personal info, account type, data export',
      icon: UserIcon,
    },
    {
      id: 'security',
      title: 'Login & Security',
      subtitle: '2FA, login alerts, active devices, recovery codes',
      icon: Shield,
      badge: settings.twoFactorEnabled ? '2FA On' : '2FA Off',
    },
    {
      id: 'privacy',
      title: 'Privacy',
      subtitle: 'Private account, activity status, read receipts, tags',
      icon: Lock,
      badge: settings.isPrivate ? 'Private' : 'Public',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Push, email, SMS, likes, comments, messages',
      icon: Bell,
      badge: settings.notifications.pauseAll ? 'Paused' : undefined,
    },
    {
      id: 'creator',
      title: 'Creator Tools',
      subtitle: 'Professional account, brand deals, monetization',
      icon: Briefcase,
      badge: settings.isProfessionalAccount ? 'Pro' : undefined,
    },
  ];

  const filteredSections = sectionsList.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 text-slate-100 rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-800/90 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          {(section !== 'overview' || onBack) && (
            <button
              type="button"
              onClick={() => {
                sound.playHeartPop();
                if (section !== 'overview') {
                  setSection('overview');
                } else if (onBack) {
                  onBack();
                }
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-sm font-bold text-white">
              {section === 'overview' && 'Settings & Professional Controls'}
              {section === 'account' && 'Account'}
              {section === 'security' && 'Login & Security'}
              {section === 'privacy' && 'Privacy'}
              {section === 'notifications' && 'Notifications'}
              {section === 'creator' && 'Creator Tools'}
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">@{user.username}</p>
          </div>
        </div>

        {savedToast && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" />
            {savedToast}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-4 text-xs">
        {section === 'overview' && (
          <>
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search settings..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Sections List */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
              {filteredSections.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sound.playHeartPop();
                      setSection(item.id);
                    }}
                    className="w-full p-3.5 flex items-center justify-between hover:bg-slate-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-violet-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{item.title}</span>
                        <span className="text-[10px] text-slate-400 block">{item.subtitle}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* 1. ACCOUNT SECTION */}
        {section === 'account' && (
          <div className="space-y-3">
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
              {onOpenEditProfile && (
                <button
                  type="button"
                  onClick={onOpenEditProfile}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-900 text-left"
                >
                  <div>
                    <span className="font-semibold text-white block">Edit Profile</span>
                    <span className="text-[10px] text-slate-400">Name, username, bio, links</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              )}

              {onOpenAccountInfo && (
                <button
                  type="button"
                  onClick={onOpenAccountInfo}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-900 text-left"
                >
                  <div>
                    <span className="font-semibold text-white block">Personal Information</span>
                    <span className="text-[10px] text-slate-400">{settings.email} · {settings.phone}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              )}

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Account Type</span>
                  <span className="text-[10px] text-slate-400 capitalize">{settings.accountType} account</span>
                </div>
                <select
                  value={settings.accountType}
                  onChange={(e) => updateSetting('accountType', e.target.value as UserSettings['accountType'])}
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-2.5 py-1.5 text-xs"
                >
                  <option value="personal">Personal</option>
                  <option value="creator">Creator</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Deactivate Account</span>
                  <span className="text-[10px] text-slate-400">Temporarily hide your profile</span>
                </div>
                <ToggleSwitch
                  checked={settings.isDeactivated}
                  onChange={() => updateSetting('isDeactivated', !settings.isDeactivated)}
                  label="Deactivate Account"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. LOGIN & SECURITY SECTION */}
        {section === 'security' && (
          <div className="space-y-3">
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[10px] text-slate-400">Protect account with OTP verification</span>
                </div>
                <ToggleSwitch
                  checked={settings.twoFactorEnabled}
                  onChange={() => updateSetting('twoFactorEnabled', !settings.twoFactorEnabled)}
                  label="Two-Factor Authentication"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Security Alerts</span>
                  <span className="text-[10px] text-slate-400">Notify on password or email changes</span>
                </div>
                <ToggleSwitch
                  checked={settings.securityAlerts}
                  onChange={() => updateSetting('securityAlerts', !settings.securityAlerts)}
                  label="Security Alerts"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Suspicious Login Alerts</span>
                  <span className="text-[10px] text-slate-400">Alert on unrecognized device or location</span>
                </div>
                <ToggleSwitch
                  checked={settings.suspiciousLoginAlerts}
                  onChange={() => updateSetting('suspiciousLoginAlerts', !settings.suspiciousLoginAlerts)}
                  label="Suspicious Login Alerts"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Active Devices ({settings.loginActivity.length})</span>
                {settings.loginActivity.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSparkle();
                      socialStore.logoutAllOtherDevices();
                      setSettings(socialStore.getUserSettings());
                      showSaved('Logged out other devices');
                    }}
                    className="text-[10px] text-rose-400 hover:underline font-semibold"
                  >
                    Log out other devices
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {settings.loginActivity.map((sess) => (
                  <div key={sess.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-violet-400" />
                      <div>
                        <span className="font-semibold text-white block">{sess.device}</span>
                        <span className="text-[10px] text-slate-400">{sess.location} · {sess.time}</span>
                      </div>
                    </div>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. PRIVACY SECTION */}
        {section === 'privacy' && (
          <div className="space-y-3">
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Private Account</span>
                  <span className="text-[10px] text-slate-400">Only approved followers can see your posts</span>
                </div>
                <ToggleSwitch
                  checked={settings.isPrivate}
                  onChange={handleTogglePrivateAccount}
                  label="Private Account"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Activity Status</span>
                  <span className="text-[10px] text-slate-400">Show when you are active</span>
                </div>
                <ToggleSwitch
                  checked={settings.activityStatus}
                  onChange={handleToggleActivityStatus}
                  label="Activity Status"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Read Receipts</span>
                  <span className="text-[10px] text-slate-400">Show seen indicator in messages</span>
                </div>
                <ToggleSwitch
                  checked={settings.readReceipts}
                  onChange={() => updateSetting('readReceipts', !settings.readReceipts)}
                  label="Read Receipts"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Filter Offensive Comments</span>
                  <span className="text-[10px] text-slate-400">Automatically hide spam & offensive replies</span>
                </div>
                <ToggleSwitch
                  checked={settings.commentFilterOffensive}
                  onChange={() => updateSetting('commentFilterOffensive', !settings.commentFilterOffensive)}
                  label="Filter Offensive Comments"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <span className="font-semibold text-white">Who Can Tag You</span>
                <select
                  value={settings.whoCanTag}
                  onChange={(e) => updateSetting('whoCanTag', e.target.value as UserSettings['whoCanTag'])}
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-2.5 py-1 text-xs"
                >
                  <option value="everyone">Everyone</option>
                  <option value="following">Following</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <span className="font-semibold text-white">Who Can Mention You</span>
                <select
                  value={settings.whoCanMention}
                  onChange={(e) => updateSetting('whoCanMention', e.target.value as UserSettings['whoCanMention'])}
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-2.5 py-1 text-xs"
                >
                  <option value="everyone">Everyone</option>
                  <option value="following">Following</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 4. NOTIFICATIONS SECTION */}
        {section === 'notifications' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-violet-950/30 border border-violet-500/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Pause All Notifications</span>
                <span className="text-[10px] text-slate-400">Temporarily mute all push & in-app alerts</span>
              </div>
              <ToggleSwitch
                checked={settings.notifications.pauseAll}
                onChange={() => updateNotification('pauseAll', !settings.notifications.pauseAll)}
                label="Pause All Notifications"
              />
            </div>

            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
              {(
                [
                  { key: 'likes', label: 'Likes' },
                  { key: 'comments', label: 'Comments' },
                  { key: 'followers', label: 'New Followers' },
                  { key: 'followRequests', label: 'Follow Requests' },
                  { key: 'messages', label: 'Direct Messages' },
                  { key: 'stories', label: 'Stories' },
                  { key: 'liveBroadcasts', label: 'Live Broadcasts' },
                  { key: 'reels', label: 'Reels' },
                  { key: 'mentionsTags', label: 'Mentions & Tags' },
                  { key: 'brandDeals', label: 'Brand Deals' },
                  { key: 'earnings', label: 'Creator Earnings' },
                  { key: 'pushEnabled', label: 'Push Notifications' },
                  { key: 'emailNotifications', label: 'Email Notifications' },
                  { key: 'smsNotifications', label: 'SMS Notifications' },
                ] as const
              ).map((item) => (
                <div key={item.key} className="p-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{item.label}</span>
                  <ToggleSwitch
                    checked={settings.notifications[item.key]}
                    onChange={() => updateNotification(item.key, !settings.notifications[item.key])}
                    label={item.label}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CREATOR TOOLS SECTION */}
        {section === 'creator' && (
          <div className="space-y-3">
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Professional Account</span>
                  <span className="text-[10px] text-slate-400">Unlock insights, creator tools & contact buttons</span>
                </div>
                <ToggleSwitch
                  checked={settings.isProfessionalAccount}
                  onChange={handleToggleProfessionalAccount}
                  label="Professional Account"
                />
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Brand Partnership Tools</span>
                  <span className="text-[10px] text-slate-400">Allow brands to send collaboration requests</span>
                </div>
                <ToggleSwitch
                  checked={settings.brandPartnershipActive}
                  onChange={() => updateSetting('brandPartnershipActive', !settings.brandPartnershipActive)}
                  label="Brand Partnership Tools"
                />
              </div>
            </div>

            {onOpenProfessionalDashboard && (
              <button
                type="button"
                onClick={onOpenProfessionalDashboard}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-violet-400" />
                  Insights & Analytics Dashboard
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            )}

            {onOpenMonetizationHub && (
              <button
                type="button"
                onClick={onOpenMonetizationHub}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Creator Monetization & Payouts
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
