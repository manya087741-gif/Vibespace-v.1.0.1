import React, { useState } from 'react';
import { X, QrCode, Download, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { User } from '../../types';
import { sound } from '../../utils/audioSynth';

interface ProfileQRCodeModalProps {
  user: User;
  onClose: () => void;
}

const GRADIENT_THEMES = [
  { id: 'violet', name: 'Vibe Purple', class: 'from-violet-600 via-indigo-600 to-fuchsia-600' },
  { id: 'sunset', name: 'Sunset Glow', class: 'from-amber-500 via-rose-500 to-pink-600' },
  { id: 'emerald', name: 'Cyber Mint', class: 'from-emerald-500 via-teal-500 to-cyan-500' },
  { id: 'midnight', name: 'Midnight Neon', class: 'from-slate-900 via-purple-950 to-blue-900' },
];

export const ProfileQRCodeModal: React.FC<ProfileQRCodeModalProps> = ({ user, onClose }) => {
  const [selectedTheme, setSelectedTheme] = useState(GRADIENT_THEMES[0]);
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://vibespace.app/@${user.username}`;

  const handleCopyLink = () => {
    sound.playSparkle();
    navigator.clipboard?.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    sound.playHeartPop();
    if (navigator.share) {
      navigator.share({
        title: `${user.fullName} on VibeSpace`,
        text: `Follow @${user.username} on VibeSpace for next-gen privacy and 120Hz spatial feeds.`,
        url: profileUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleDownload = () => {
    sound.playSparkle();
    // Generate synthetic SVG download
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <rect width="600" height="800" fill="#0f172a" rx="40"/>
      <rect x="50" y="50" width="500" height="700" fill="#1e293b" rx="30"/>
      <text x="300" y="140" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">@${user.username}</text>
      <text x="300" y="180" fill="#94a3b8" font-family="sans-serif" font-size="16" text-anchor="middle">VibeSpace Next-Gen Profile</text>
      <rect x="150" y="240" width="300" height="300" fill="#ffffff" rx="20"/>
      <text x="300" y="400" fill="#000000" font-family="monospace" font-size="14" text-anchor="middle">QR CODE: ${user.username}</text>
      <text x="300" y="680" fill="#a855f7" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Scan to Connect on VibeSpace</text>
    </svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibespace_qr_${user.username}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white">Profile QR Code</h3>
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
        <div className="p-6 flex flex-col items-center space-y-6">
          {/* Card Badge */}
          <div
            className={`w-full aspect-3/4 rounded-3xl p-6 bg-gradient-to-br ${selectedTheme.class} shadow-2xl flex flex-col items-center justify-between text-white relative overflow-hidden transition-all duration-300`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

            {/* Top handle */}
            <div className="relative z-10 text-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/80">VibeSpace ID</span>
              <h4 className="text-lg font-black tracking-tight mt-0.5">@{user.username}</h4>
            </div>

            {/* Simulated Clean Instagram-Style QR Code Container */}
            <div className="relative z-10 w-44 h-44 bg-white p-3 rounded-3xl shadow-xl flex flex-col items-center justify-center">
              {/* Corner markers */}
              <div className="w-full h-full relative grid grid-cols-6 grid-rows-6 gap-1 p-1">
                {/* 3 Large Positional Squares (QR spec) */}
                <div className="col-span-2 row-span-2 border-4 border-black p-1 flex items-center justify-center rounded-lg">
                  <div className="w-full h-full bg-black rounded-sm" />
                </div>
                <div className="col-start-5 col-span-2 row-span-2 border-4 border-black p-1 flex items-center justify-center rounded-lg">
                  <div className="w-full h-full bg-black rounded-sm" />
                </div>
                <div className="col-start-1 col-span-2 row-start-5 row-span-2 border-4 border-black p-1 flex items-center justify-center rounded-lg">
                  <div className="w-full h-full bg-black rounded-sm" />
                </div>

                {/* Randomized QR matrix dots */}
                <div className="col-start-3 col-span-2 row-start-1 bg-black rounded-xs" />
                <div className="col-start-1 col-span-2 row-start-3 bg-black rounded-xs" />
                <div className="col-start-5 col-span-2 row-start-3 bg-black rounded-xs" />
                <div className="col-start-3 col-span-2 row-start-5 bg-black rounded-xs" />
                <div className="col-start-5 col-span-2 row-start-5 bg-black rounded-xs" />

                {/* Center Avatar Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-full p-0.5 bg-white shadow-md overflow-hidden border border-slate-200">
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="relative z-10 text-center">
              <span className="text-xs font-semibold text-white/90">{user.fullName}</span>
              <span className="text-[10px] text-white/70 block mt-0.5 font-mono">Scan with camera to connect</span>
            </div>
          </div>

          {/* Theme Color Selector */}
          <div className="flex items-center gap-2">
            {GRADIENT_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  sound.playHeartPop();
                  setSelectedTheme(theme);
                }}
                className={`w-7 h-7 rounded-full bg-gradient-to-tr ${theme.class} transition-all ${
                  selectedTheme.id === theme.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
                }`}
                title={theme.name}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full grid grid-cols-3 gap-2">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
              <span className="text-[10px]">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-300" />
              <span className="text-[10px]">Share</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-2.5 px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-xs font-semibold flex flex-col items-center gap-1 transition-colors shadow-md"
            >
              <Download className="w-4 h-4" />
              <span className="text-[10px]">Save QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
