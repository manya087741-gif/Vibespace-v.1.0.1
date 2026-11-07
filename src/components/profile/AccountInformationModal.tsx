import React, { useState } from 'react';
import { 
  X, ShieldCheck, UserCheck, Calendar, Mail, Phone, Laptop, 
  Smartphone, Copy, Check, ExternalLink, Download, AlertCircle, KeyRound, Award
} from 'lucide-react';
import { User, UserSettings } from '../../types';
import { socialStore } from '../../utils/socialStore';
import { sound } from '../../utils/audioSynth';

interface AccountInformationModalProps {
  user: User;
  onClose: () => void;
  onOpenDownload?: () => void;
}

export const AccountInformationModal: React.FC<AccountInformationModalProps> = ({
  user,
  onClose,
  onOpenDownload,
}) => {
  const settings = socialStore.getUserSettings();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    sound.playHeartPop();
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Account Information</h3>
              <p className="text-[10px] text-slate-400">Official security & identity credentials</p>
            </div>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Identity Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-950 to-slate-950 border border-violet-500/30 flex items-center gap-3.5">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-violet-500/50 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white truncate">{user.fullName}</span>
                {user.verified && (
                  <span className="text-violet-400" title="Verified Creator">✓</span>
                )}
              </div>
              <span className="text-slate-400 font-mono text-[11px] block">@{user.username}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                  {settings.accountType === 'creator' ? 'Professional Creator' : settings.accountType === 'business' ? 'Business Account' : 'Personal Account'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-[9px] font-bold border border-violet-500/30">
                  Verified Identity
                </span>
              </div>
            </div>
          </div>

          {/* Account Details Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Core Account Records
            </span>

            <div className="bg-slate-950/80 rounded-2xl border border-slate-800/80 divide-y divide-slate-800/80 overflow-hidden">
              {/* User ID */}
              <div className="p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block">Unique User ID (UUID)</span>
                  <span className="font-mono text-white text-xs select-all">{user.id}</span>
                </div>
                <button
                  onClick={() => handleCopy(user.id, 'uuid')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] font-mono flex items-center gap-1 transition-colors"
                >
                  {copiedField === 'uuid' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'uuid' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Registered Email */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Registered Email</span>
                    <span className="font-semibold text-white text-xs">{settings.email}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Verified
                </span>
              </div>

              {/* Registered Mobile */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Registered Mobile Number</span>
                    <span className="font-semibold text-white text-xs">{settings.phone}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> OTP Verified
                </span>
              </div>

              {/* Registration Date */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Account Created On</span>
                    <span className="font-semibold text-white text-xs">{settings.accountCreationDate}</span>
                  </div>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">Active 2+ yrs</span>
              </div>

              {/* Account Status / Good Standing */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Community Standing</span>
                    <span className="font-semibold text-emerald-400 text-xs">Good Standing (0 Violations)</span>
                  </div>
                </div>
                <span className="text-emerald-400 text-xs">✓ Clean</span>
              </div>
            </div>
          </div>

          {/* Connected Hardware & Active Sessions */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Connected Hardware Devices ({settings.loginActivity.length})
            </span>

            <div className="space-y-2">
              {settings.loginActivity.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    session.isCurrent
                      ? 'bg-violet-950/30 border-violet-500/40'
                      : 'bg-slate-950/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 text-slate-300">
                      {session.device.includes('iPhone') || session.device.includes('iPad') ? (
                        <Smartphone className="w-4 h-4 text-violet-400" />
                      ) : (
                        <Laptop className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white text-xs">{session.device}</span>
                        {session.isCurrent && (
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                            Current Device
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[10px] block font-mono">
                        {session.location} · {session.ip}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">{session.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Linked External Profiles */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Linked Accounts & Federated Identity
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center text-white text-[9px] font-bold">
                    IG
                  </div>
                  <span className="text-xs text-white font-semibold">Instagram</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-mono">Linked</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[9px] font-bold">
                    YT
                  </div>
                  <span className="text-xs text-white font-semibold">YouTube</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-mono">Linked</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold">
                    G
                  </div>
                  <span className="text-xs text-white font-semibold">Google SSO</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-mono">Active</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white text-[9px] font-bold">
                    GH
                  </div>
                  <span className="text-xs text-white font-semibold">GitHub</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-mono">Connected</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex gap-2">
            {onOpenDownload && (
              <button
                onClick={() => {
                  sound.playSparkle();
                  onOpenDownload();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-violet-400" />
                <span>Download My Data (JSON)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
