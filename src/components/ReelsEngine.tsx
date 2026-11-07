import React, { useState, useEffect } from 'react';
import { Reel, VideoFilterType } from '../types';
import { MOCK_REELS } from '../data/mockData';
import { Heart, MessageCircle, Share2, Bookmark, Music, Sliders, Volume2, VolumeX, Sparkles, ChevronUp, ChevronDown, Play, Pause, Gift } from 'lucide-react';
import { DynamicWatermark } from './DynamicWatermark';
import { sound } from '../utils/audioSynth';
import { User } from '../types';

interface ReelsEngineProps {
  watermarkEnabled: boolean;
  watermarkOpacity: number;
  onOpenGift?: (creator: User) => void;
  onSelectUser?: (user: User) => void;
}

export const ReelsEngine: React.FC<ReelsEngineProps> = ({
  watermarkEnabled,
  watermarkOpacity,
  onOpenGift,
  onSelectUser,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeFilter, setActiveFilter] = useState<VideoFilterType>('none');
  const [isMuted, setIsMuted] = useState(false);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({
    reel_01: true,
  });
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({
    reel_02: true,
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [reels, setReels] = useState<Reel[]>(MOCK_REELS);

  const activeReel = reels[currentIndex];

  // Control ambient audio synth loop
  useEffect(() => {
    sound.toggleReelSoundtrack(isPlaying && !isMuted);
    return () => {
      sound.toggleReelSoundtrack(false);
    };
  }, [isPlaying, isMuted, currentIndex]);

  const handleNextReel = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  const toggleLike = (reelId: string) => {
    sound.playHeartPop();
    const isLiked = !likedReels[reelId];
    setLikedReels((prev) => ({ ...prev, [reelId]: isLiked }));
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? { ...r, likesCount: isLiked ? r.likesCount + 1 : r.likesCount - 1 }
          : r
      )
    );
  };

  const toggleSave = (reelId: string) => {
    sound.playHeartPop();
    setSavedReels((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  // Keyboard navigation for reels
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') handleNextReel();
      if (e.key === 'ArrowUp') handlePrevReel();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, isPlaying]);

  // CSS Filter styles mapped to video filter selection
  const getFilterClass = () => {
    switch (activeFilter) {
      case 'cyberpunk':
        return 'contrast-125 saturate-150 hue-rotate-15 brightness-110';
      case 'vhs':
        return 'contrast-115 sepia-[0.25] saturate-125 brightness-95';
      case 'golden':
        return 'sepia-[0.35] contrast-110 saturate-140 brightness-105';
      case 'noir':
        return 'grayscale contrast-150 brightness-90';
      case 'prism':
        return 'saturate-200 contrast-125';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-120px)] max-h-[820px] max-w-md mx-auto rounded-3xl overflow-hidden bg-black select-none shadow-2xl flex flex-col justify-between">
      {/* Video Poster with Real-Time Shaders & Filters */}
      <div 
        className="absolute inset-0 overflow-hidden cursor-pointer"
        onClick={togglePlay}
      >
        <img
          src={activeReel.videoPoster}
          alt={activeReel.title}
          className={`w-full h-full object-cover transition-all duration-300 ${getFilterClass()} ${
            isPlaying ? 'scale-100' : 'scale-102 brightness-90'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* VHS Scanline Effect Simulation if VHS active */}
        {activeFilter === 'vhs' && (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-70" />
        )}

        {/* Ambient Dark Gradient Overlays for Controls */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

        {/* Pause Overlay Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Play className="w-8 h-8 ml-1" />
            </div>
          </div>
        )}

        {/* Dynamic Watermark Overlay */}
        <DynamicWatermark enabled={watermarkEnabled} opacity={watermarkOpacity} mode="discrete" />
      </div>

      {/* Top Header Bar inside Reel Player */}
      <div className="relative z-30 p-4 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white tracking-tight drop-shadow-sm">
            Reels 120Hz
          </span>
          <span className="text-[10px] font-mono bg-violet-600/40 border border-violet-400/40 text-violet-200 px-2 py-0.5 rounded-full">
            AVIF Lossless
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Mute / Unmute */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Filter Effects Menu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFilterDrawer(!showFilterDrawer);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-colors ${
              activeFilter !== 'none'
                ? 'bg-violet-600 text-white border-violet-400'
                : 'bg-black/50 hover:bg-black/70 text-white border-white/10'
            }`}
            title="Video FX & Shaders"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reel Up/Down Floating Nav Arrows */}
      <div className="absolute right-4 top-24 z-30 flex flex-col gap-2">
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevReel();
            }}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/70"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextReel();
          }}
          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/70"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Right Action Rail (Likes, Comments, Share, Audio) */}
      <div className="relative z-30 self-end mr-3 mb-16 flex flex-col items-center gap-5">
        {/* Creator Avatar with Follow Plus */}
        <div className="relative group cursor-pointer">
          <img
            src={activeReel.user.avatar}
            alt={activeReel.user.username}
            className="w-11 h-11 rounded-full object-cover border-2 border-violet-500 shadow-lg"
          />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-slate-950">
            +
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(activeReel.id);
          }}
          className="flex flex-col items-center gap-1 group text-white hover:text-rose-400"
        >
          <div className={`p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-active:scale-125 transition-transform ${
            likedReels[activeReel.id] ? 'bg-rose-500/20 text-rose-500 border-rose-500/40' : ''
          }`}>
            <Heart className={`w-6 h-6 ${likedReels[activeReel.id] ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[11px] font-semibold tabular-nums text-white drop-shadow">
            {activeReel.likesCount.toLocaleString()}
          </span>
        </button>

        {/* Comments Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(!showComments);
          }}
          className="flex flex-col items-center gap-1 group text-white hover:text-violet-400"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-active:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold tabular-nums text-white drop-shadow">
            {activeReel.commentsCount.toLocaleString()}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playHeartPop();
            navigator.clipboard?.writeText(window.location.href);
          }}
          className="flex flex-col items-center gap-1 text-white hover:text-violet-300"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold tabular-nums text-white drop-shadow">
            {activeReel.sharesCount.toLocaleString()}
          </span>
        </button>

        {/* Send Virtual Gift Button */}
        {onOpenGift && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playSparkle();
              onOpenGift(activeReel.user);
            }}
            className="flex flex-col items-center gap-1 text-amber-300 hover:text-amber-200 group"
            title="Send Gift to Creator"
          >
            <div className="p-2.5 rounded-full bg-gradient-to-tr from-amber-500/40 to-rose-500/40 backdrop-blur-md border border-amber-400/40 group-active:scale-125 transition-transform shadow-lg shadow-amber-950/40">
              <Gift className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-[10px] font-bold text-amber-300 drop-shadow">Gift</span>
          </button>
        )}

        {/* Save Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave(activeReel.id);
          }}
          className="text-white hover:text-amber-400"
        >
          <div className={`p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 ${
            savedReels[activeReel.id] ? 'text-amber-400 bg-amber-400/20 border-amber-400/40' : ''
          }`}>
            <Bookmark className={`w-5 h-5 ${savedReels[activeReel.id] ? 'fill-current' : ''}`} />
          </div>
        </button>
      </div>

      {/* Reel Bottom Details & Audio Marquee */}
      <div className="relative z-30 p-4 pb-6 space-y-2.5">
        {/* Creator Identity */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            sound.playHeartPop();
            if (onSelectUser) onSelectUser(activeReel.user);
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-sm font-bold text-white drop-shadow-sm group-hover:text-violet-300 transition-colors">
            @{activeReel.user.username}
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium text-white/90 group-hover:bg-violet-600 transition-colors">
            View Profile
          </span>
        </div>

        {/* Reel Title */}
        <p className="text-xs text-white/90 font-medium leading-relaxed drop-shadow line-clamp-2">
          {activeReel.title}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs text-violet-300 font-medium">
          {activeReel.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        {/* Background Audio Continuous Marquee */}
        <div className="flex items-center gap-2 text-xs text-white/80 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 max-w-xs overflow-hidden">
          <Music className="w-3.5 h-3.5 text-violet-400 animate-spin shrink-0" />
          <span className="truncate text-[11px]">
            {activeReel.audioTrack.title} · {activeReel.audioTrack.artist}
          </span>
        </div>
      </div>

      {/* Filter Shaders Drawer */}
      {showFilterDrawer && (
        <div 
          className="absolute inset-x-0 bottom-0 z-40 bg-slate-950/95 border-t border-slate-800 rounded-t-3xl p-5 backdrop-blur-xl animate-in slide-in-from-bottom duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" /> Real-Time Video Shaders
            </h4>
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="text-slate-400 hover:text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {(
              [
                { id: 'none', label: 'Original 120Hz' },
                { id: 'cyberpunk', label: 'Cyberpunk' },
                { id: 'vhs', label: '90s VHS Glitch' },
                { id: 'golden', label: 'Golden Glow' },
                { id: 'noir', label: 'Noir Cinema' },
                { id: 'prism', label: 'Prism Flare' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playHeartPop();
                  setActiveFilter(f.id);
                }}
                className={`py-2 px-2 rounded-xl font-medium border text-center transition-all ${
                  activeFilter === f.id
                    ? 'bg-violet-600 border-violet-400 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Comments Overlay */}
      {showComments && (
        <div
          className="absolute inset-x-0 bottom-0 z-40 bg-slate-950/95 border-t border-slate-800 rounded-t-3xl p-4 max-h-[60%] flex flex-col backdrop-blur-xl animate-in slide-in-from-bottom duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-white">Reel Comments</span>
            <button
              onClick={() => setShowComments(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
          <div className="py-3 text-xs text-slate-300 space-y-2 overflow-y-auto">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-white">@elena_design:</span>
              <p className="text-slate-300">The 120fps motion handling on this is ridiculously smooth!</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-white">@yuki_tokyo:</span>
              <p className="text-slate-300">Zero dropped frames on mobile data. Incredible encoder tuning.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
