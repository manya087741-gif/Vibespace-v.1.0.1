import React from 'react';
import { Radio, Users, Sparkles, ChevronRight } from 'lucide-react';
import { LiveStream } from '../types';
import { sound } from '../utils/audioSynth';

interface LiveFeedSectionProps {
  streams: LiveStream[];
  onSelectStream: (stream: LiveStream) => void;
  onGoLive: () => void;
}

export const LiveFeedSection: React.FC<LiveFeedSectionProps> = ({
  streams,
  onSelectStream,
  onGoLive,
}) => {
  if (streams.length === 0) return null;

  return (
    <div className="py-3 px-4 border-b border-slate-900/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span>Live Now</span>
            <span className="px-1.5 py-0.2 bg-rose-600/30 text-rose-300 rounded text-[9px] font-mono border border-rose-500/30">
              {streams.length} Active
            </span>
          </span>
        </div>

        <button
          onClick={() => {
            sound.playSparkle();
            onGoLive();
          }}
          className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-colors"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Go Live</span>
        </button>
      </div>

      {/* Horizontal Live Streams Rail */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
        {streams.map((stream) => (
          <div
            key={stream.id}
            onClick={() => {
              sound.playHeartPop();
              onSelectStream(stream);
            }}
            className="w-48 sm:w-56 shrink-0 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-rose-500/50 cursor-pointer group transition-all relative"
          >
            {/* Stream Cover / Live Preview */}
            <div className="aspect-[4/3] relative overflow-hidden bg-black">
              <img
                src={stream.coverUrl}
                alt={stream.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* LIVE Badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>LIVE</span>
              </div>

              {/* Viewer Counter */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[9px] flex items-center gap-1 border border-white/10">
                <Users className="w-2.5 h-2.5 text-violet-400" />
                <span>{stream.viewerCount.toLocaleString()}</span>
              </div>

              {/* Category */}
              <div className="absolute bottom-2 left-2 right-2">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] text-rose-300 font-semibold border border-white/10">
                  {stream.category}
                </span>
              </div>
            </div>

            {/* Stream Info */}
            <div className="p-2.5 space-y-1">
              <div className="flex items-center gap-2">
                <img
                  src={stream.user.avatar}
                  alt={stream.user.username}
                  className="w-6 h-6 rounded-full object-cover border border-rose-500/40"
                />
                <span className="text-[11px] font-bold text-white truncate">
                  @{stream.user.username}
                </span>
              </div>
              <h5 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                {stream.title}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
