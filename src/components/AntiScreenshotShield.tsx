import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, AlertTriangle, Lock, Eye, VideoOff, CheckCircle2, X } from 'lucide-react';
import { sound } from '../utils/audioSynth';

interface AntiScreenshotShieldProps {
  flagSecureEnabled: boolean;
  screenRecordingActive: boolean;
  onToggleFlagSecure: () => void;
  onToggleScreenRecording: () => void;
}

export const AntiScreenshotShield: React.FC<AntiScreenshotShieldProps> = ({
  flagSecureEnabled,
  screenRecordingActive,
  onToggleFlagSecure,
  onToggleScreenRecording,
}) => {
  const [showBlackout, setShowBlackout] = useState(false);
  const [creatorAlert, setCreatorAlert] = useState<{
    id: string;
    creator: string;
    timestamp: string;
    code: string;
  } | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [screenshotAttemptCount, setScreenshotAttemptCount] = useState(0);

  // Trigger simulated screenshot attempt
  const triggerScreenshotSimulation = (creatorName: string = 'elena_design') => {
    sound.playSecurityShieldAlert();
    setScreenshotAttemptCount((prev) => prev + 1);

    if (flagSecureEnabled) {
      // Visual representation of Android FLAG_SECURE / iOS Secure Subview
      setShowBlackout(true);
      setTimeout(() => {
        setShowBlackout(false);
      }, 1200);
    }

    // Instant creator notification dispatch
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setCreatorAlert({
      id: Math.random().toString(),
      creator: creatorName,
      timestamp: now,
      code: `FLAG_SECURE_API34#${Math.floor(1000 + Math.random() * 9000)}`,
    });

    // Auto dismiss alert after 5 seconds
    setTimeout(() => {
      setCreatorAlert(null);
    }, 5500);
  };

  // Keyboard shortcut listener (Cmd+Shift+S or PrtScn)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        triggerScreenshotSimulation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flagSecureEnabled]);

  return (
    <>
      {/* Blackout Flash Screen (Simulating FLAG_SECURE black snapshot) */}
      {showBlackout && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-100">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-2">
            Protected by VibeSpace Security
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
            FLAG_SECURE is active. System screenshot captured pitch-black frame (0x000000). No media data was exposed to the clipboard.
          </p>
          <div className="font-mono text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 px-3 py-1 rounded">
            Native Hardware Shield Enforced
          </div>
        </div>
      )}

      {/* Screen Recording Blocker Scrim (Active when recording detected) */}
      {screenRecordingActive && (
        <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
            <VideoOff className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            Screen Recording Detected
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            Under VibeSpace content protection policy, video and private feeds are masked during AirPlay mirroring or screen recording.
          </p>
          <button
            onClick={onToggleScreenRecording}
            className="text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700"
          >
            Simulate Stop Recording
          </button>
        </div>
      )}

      {/* Instant Creator Alert Banner Toast */}
      {creatorAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-slate-900/95 border border-rose-500/40 shadow-2xl shadow-rose-950/50 rounded-xl p-3.5 backdrop-blur-md animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-400">
                  Security Event Intercepted
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {creatorAlert.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-snug">
                Screenshot attempt on <strong className="text-white">@{creatorAlert.creator}</strong> was blocked. Dynamic cryptographic watermark logged.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center gap-2">
                <span>Code: {creatorAlert.code}</span>
                <span>·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Creator Notified
                </span>
              </div>
            </div>
            <button
              onClick={() => setCreatorAlert(null)}
              className="text-slate-500 hover:text-slate-300 p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Security Status Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSecurityModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              aria-label="Close security modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Hardware-Enforced Security Suite
                </h3>
                <span className="text-xs text-slate-400">
                  Active Cryptographic & DRM Policies
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div>
                  <div className="font-medium text-slate-200">Android FLAG_SECURE & iOS Window Mask</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Renders black frame on system capture & app switcher
                  </div>
                </div>
                <button
                  onClick={onToggleFlagSecure}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    flagSecureEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {flagSecureEnabled ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div>
                  <div className="font-medium text-slate-200">Anti-Screen Recording Defense</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Listens to UIScreen.capturedDidChange / MediaProjection
                  </div>
                </div>
                <button
                  onClick={onToggleScreenRecording}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    screenRecordingActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {screenRecordingActive ? 'Simulating' : 'Idle'}
                </button>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-400">Total Capture Attempts Blocked: <span className="text-white font-semibold">{screenshotAttemptCount}</span></div>
                <div className="text-slate-400">Double Ratchet Cipher: <span className="text-violet-400">Curve25519 + AES-256-GCM</span></div>
                <div className="text-slate-400">Telemetry Tracking Cookies: <span className="text-emerald-400">0 (Zero Third-Party SDKs)</span></div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setShowSecurityModal(false);
                  triggerScreenshotSimulation();
                }}
                className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" /> Test Screenshot Intercept
              </button>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Simulator Trigger for the User */}
      <div className="fixed bottom-20 right-4 z-30 flex flex-col items-end gap-2">
        <button
          onClick={() => triggerScreenshotSimulation()}
          title="Simulate Native Screenshot Attempt (Cmd+Shift+S)"
          className="flex items-center gap-2 px-3 py-2 bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-rose-950/50 backdrop-blur-md border border-rose-400/30 transition-transform active:scale-95 group"
        >
          <ShieldAlert className="w-4 h-4 text-rose-200 group-hover:rotate-12 transition-transform" />
          <span>Simulate Screenshot Attempt</span>
        </button>
      </div>
    </>
  );
};
