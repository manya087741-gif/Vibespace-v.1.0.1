import React from 'react';
import { X, Image, Film, Video, Sparkles, Radio, Layers } from 'lucide-react';
import { sound } from '../utils/audioSynth';

interface CreateActionSheetProps {
  onClose: () => void;
  onOpenCreatePost: () => void;
  onOpenCreateReel: () => void;
  onOpenCreateVideo: () => void;
  onOpenCreateStory: () => void;
  onOpenGoLive: () => void;
}

export const CreateActionSheet: React.FC<CreateActionSheetProps> = ({
  onClose,
  onOpenCreatePost,
  onOpenCreateReel,
  onOpenCreateVideo,
  onOpenCreateStory,
  onOpenGoLive,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Create Content</span>
              <span className="text-[10px] font-mono bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30">
                Studio
              </span>
            </h3>
            <span className="text-[11px] text-slate-400">Share with your followers and channels</span>
          </div>
          <button
            onClick={() => {
              sound.playHeartPop();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="space-y-2.5">
          {/* 1. Create Post */}
          <div
            onClick={() => {
              sound.playHeartPop();
              onClose();
              onOpenCreatePost();
            }}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-violet-500 flex items-center justify-between cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 group-hover:scale-105 transition-transform">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-violet-300">Create Post</div>
                <div className="text-[11px] text-slate-400">Photos, carousel, text post or music</div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-violet-400 font-bold text-xs">→</span>
          </div>

          {/* 2. Upload Reel */}
          <div
            onClick={() => {
              sound.playHeartPop();
              onClose();
              onOpenCreateReel();
            }}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-fuchsia-500 flex items-center justify-between cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-fuchsia-600/20 text-fuchsia-400 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-fuchsia-300">Upload Reel</div>
                <div className="text-[11px] text-slate-400">15s to 90s short-form video with audio & filters</div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-fuchsia-400 font-bold text-xs">→</span>
          </div>

          {/* 3. Upload Video / Channel Broadcast */}
          <div
            onClick={() => {
              sound.playHeartPop();
              onClose();
              onOpenCreateVideo();
            }}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500 flex items-center justify-between cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">Channel Video</div>
                <div className="text-[11px] text-slate-400">Long-form video with chapters & 4K delivery</div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-amber-400 font-bold text-xs">→</span>
          </div>

          {/* 4. Create Story */}
          <div
            onClick={() => {
              sound.playSparkle();
              onClose();
              onOpenCreateStory();
            }}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 flex items-center justify-between cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300">Create Story</div>
                <div className="text-[11px] text-slate-400">24-hour disappearing story with interactive stickers</div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-emerald-400 font-bold text-xs">→</span>
          </div>

          {/* 5. Go Live */}
          <div
            onClick={() => {
              sound.playSparkle();
              onClose();
              onOpenGoLive();
            }}
            className="p-3 rounded-2xl bg-slate-950 border border-rose-500/30 hover:border-rose-500 flex items-center justify-between cursor-pointer group transition-all bg-gradient-to-r hover:from-rose-950/20 hover:to-slate-950"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 group-hover:scale-105 transition-transform relative">
                <Radio className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-rose-300 flex items-center gap-1.5">
                  <span>Go Live</span>
                  <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-bold rounded-full">
                    LIVE
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Real-time streaming, live chat, multi-guest</div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-rose-400 font-bold text-xs">→</span>
          </div>
        </div>

      </div>
    </div>
  );
};
