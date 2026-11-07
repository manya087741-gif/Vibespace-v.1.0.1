import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  Lock,
  Smartphone,
  KeyRound,
  Fingerprint,
  Globe,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Link2,
  X,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../utils/audioSynth';

interface SessionItem {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  trusted: boolean;
}

interface PasskeyItem {
  id: string;
  name: string;
  createdAt: string;
}

interface ThreatItem {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  sourceIp: string;
  detail: string;
  timestamp: string;
}

interface SecurityProtectionDashboardProps {
  onClose: () => void;
}

export const SecurityProtectionDashboard: React.FC<SecurityProtectionDashboardProps> = ({
  onClose,
}) => {
  const [tab, setTab] = useState<'overview' | 'devices' | 'phishing' | 'admin'>('overview');
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([]);
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [failedLogins24h, setFailedLogins24h] = useState(0);
  const [blockedIPs, setBlockedIPs] = useState(0);

  // Anti-Phishing URL Scanner
  const [urlInput, setUrlInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    safe: boolean;
    riskLevel: string;
    recommendation: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/v1/security/status')
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.emergencyLockdown === 'boolean') setEmergencyLockdown(d.emergencyLockdown);
        if (typeof d.twoFactorEnabled === 'boolean') setTwoFactorEnabled(d.twoFactorEnabled);
        if (d.sessions) setSessions(d.sessions);
        if (d.passkeys) setPasskeys(d.passkeys);
        if (d.threats) setThreats(d.threats);
        if (typeof d.failedLoginAttempts24h === 'number')
          setFailedLogins24h(d.failedLoginAttempts24h);
        if (typeof d.blockedBruteForceIPs === 'number') setBlockedIPs(d.blockedBruteForceIPs);
      })
      .catch(() => {});
  }, []);

  const handleToggleLockdown = async () => {
    sound.playSparkle();
    const res = await fetch('/api/v1/security/lockdown', { method: 'POST' });
    const data = await res.json();
    if (typeof data.emergencyLockdown === 'boolean') {
      setEmergencyLockdown(data.emergencyLockdown);
    }
  };

  const handleAddPasskey = async () => {
    sound.playHeartPop();
    const res = await fetch('/api/v1/security/passkeys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Biometric Passkey · Fingerprint & Face' }),
    });
    const data = await res.json();
    if (data.passkeys) setPasskeys(data.passkeys);
  };

  const handleLogoutSession = async (id: string) => {
    sound.playHeartPop();
    const res = await fetch(`/api/v1/security/sessions/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.sessions) setSessions(data.sessions);
  };

  const handleRevokeAllSessions = async () => {
    sound.playSparkle();
    const res = await fetch('/api/v1/security/sessions/revoke-all', { method: 'POST' });
    const data = await res.json();
    if (data.sessions) setSessions(data.sessions);
  };

  const handleScanUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    sound.playHeartPop();
    const res = await fetch('/api/v1/security/scan-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput.trim() }),
    });
    const data = await res.json();
    setScanResult(data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-900 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">
                Cyber Security & Account Protection
              </h2>
              <p className="text-[10px] text-slate-400">
                Multi-Layer Defense · WAF · 2FA · Passkeys · AI Threat Monitor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 border-b border-slate-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-950/60">
          {[
            { id: 'overview', label: 'Protection & 2FA' },
            { id: 'devices', label: 'Devices & Recovery' },
            { id: 'phishing', label: 'Anti-Phishing' },
            { id: 'admin', label: 'Threat & Admin' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                tab === t.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tab === 'overview' && (
            <>
              {/* Emergency Lockdown */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  emergencyLockdown
                    ? 'bg-rose-950/40 border-rose-500/50'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Emergency Account Lockdown</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Instantly freeze withdrawals, password changes & new logins.
                  </p>
                </div>
                <button
                  onClick={handleToggleLockdown}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                    emergencyLockdown
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {emergencyLockdown ? 'Locked' : 'Enable'}
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-violet-400" />
                    <span>Two-Factor Authentication (2FA)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Authenticator App + Email & SMS OTP verification active
                  </p>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                    twoFactorEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {twoFactorEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Passkey Management */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                    <span>Passkeys (Fingerprint / Face / PIN)</span>
                  </h3>
                  <button
                    onClick={handleAddPasskey}
                    className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-[11px] font-bold text-white flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Passkey</span>
                  </button>
                </div>
                {passkeys.map((pk) => (
                  <div
                    key={pk.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-200 font-medium">{pk.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{pk.createdAt}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'devices' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white">Where You're Logged In</h3>
                <button
                  onClick={handleRevokeAllSessions}
                  className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Revoke All Other Sessions</span>
                </button>
              </div>

              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-xs font-bold text-white">{s.device}</span>
                      {s.isCurrent && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                          Current
                        </span>
                      )}
                      {!s.trusted && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                          Suspicious
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>
                        {s.location} · IP {s.ip} · {s.lastActive}
                      </span>
                    </p>
                  </div>
                  {!s.isCurrent && (
                    <button
                      onClick={() => handleLogoutSession(s.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-300"
                      title="Remote Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'phishing' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-violet-400" />
                  <span>Anti-Phishing & Malicious URL Scanner</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Scan any external link before opening. We never ask for OTPs or passwords in chat.
                </p>
                <form onSubmit={handleScanUrl} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/verify..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white"
                  >
                    Scan
                  </button>
                </form>

                {scanResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      scanResult.safe
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {scanResult.safe ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                      <span>{scanResult.riskLevel}</span>
                    </div>
                    <p className="text-[11px] opacity-90">{scanResult.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'admin' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Failed Logins (24h)</span>
                  <div className="text-lg font-extrabold text-white font-mono mt-0.5">
                    {failedLogins24h}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Blocked Brute-Force IPs</span>
                  <div className="text-lg font-extrabold text-rose-400 font-mono mt-0.5">
                    {blockedIPs}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-white">AI-Based Threat Detection Feed</h3>
                {threats.map((thr) => (
                  <div
                    key={thr.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-300">{thr.type}</span>
                      <span className="text-[10px] font-mono text-slate-500">{thr.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{thr.detail}</p>
                    <span className="text-[10px] font-mono text-slate-500">
                      Source IP: {thr.sourceIp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
