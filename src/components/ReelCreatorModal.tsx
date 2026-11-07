import React, { useState, useRef } from 'react';
import { 
  X, Camera, Film, Music, Sparkles, Sliders, Check, 
  RotateCw, Play, Pause, Download, Send, Volume2, VolumeX 
} from 'lucide-react';
import { Reel } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { sound } from '../utils/audioSynth';

interface ReelCreatorModalProps {
  onClose: () => void;
  onReelCreated?: (newReel: Reel) => void;
}

const PRESET_REEL_VIDEOS = [
  '/src/assets/images/vibespace_reel_tokyo_1793677134321.jpg',
  '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg',
  '/src/assets/images/vibespace_story_portrait_1793677134555.jpg',
];

const REEL_MUSIC = [
  { title: 'Tokyo Hyper-Drive 120Hz', artist: 'Kavinsky Drift', duration: '0:30' },
  { title: 'Neon Skyline Synth', artist: 'Aria Thorne', duration: '0:15' },
  { title: 'Midnight Resonance', artist: 'M83 Cyber', duration: '0:60' },
  { title: 'Darkwave Bassline', artist: 'Rebel System', duration: '0:45' },
];

const FILTERS = [
  { id: 'none', label: 'Normal', css: '' },
  { id: 'cyberpunk', label: 'Cyberpunk', css: 'hue-rotate-[290deg] contrast-125 saturate-150' },
  { id: 'golden', label: 'Golden Hour', css: 'sepia-[0.35] brightness-105 saturate-125' },
  { id: 'vhs', label: 'VHS Glitch', css: 'contrast-125 brightness-110 saturate-150' },
  { id: 'noir', label: 'Noir (B&W)', css: 'grayscale contrast-150' },
  { id: 'prism', label: 'Prism Neon', css: 'hue-rotate-180 contrast-125' },
];

export const ReelCreatorModal: React.FC<ReelCreatorModalProps> = ({ onClose, onReelCreated }) => {
  // Duration: 15s, 30s, 60s, 90s
  const [durationSec, setDurationSec] = useState<'15s' | '30s' | '60s' | '90s'>('30s');
  
  // Media source
  const [selectedVideo, setSelectedVideo] = useState<string>(PRESET_REEL_VIDEOS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('cyberpunk');
  const [caption, setCaption] = useState<string>('Late night speed testing on Tokyo transit. 120Hz smooth scrolling active! #VibeSpace #Reels');
  
  // Audio track
  const [selectedTrack, setSelectedTrack] = useState(REEL_MUSIC[0]);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Video trimming
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(30);

  // Recording simulator
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedSeconds, setRecordedSeconds] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartRecord = () => {
    sound.playHeartPop();
    setIsRecording(true);
    setRecordedSeconds(0);
    const interval = setInterval(() => {
      setRecordedSeconds((prev) => {
        if (prev >= 15) {
          clearInterval(interval);
          setIsRecording(false);
          sound.playSparkle();
          return 15;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playSparkle();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedVideo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishReel = () => {
    sound.playSparkle();

    const newReel: Reel = {
      id: 'reel_usr_' + Date.now().toString(36),
      user: CURRENT_USER,
      videoPoster: selectedVideo,
      title: caption.trim() || 'New Reel on VibeSpace',
      audioTrack: {
        title: selectedTrack.title,
        artist: selectedTrack.artist,
      },
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      tags: ['#VibeSpace', '#Reels', '#Trending'],
      duration: durationSec,
      hasLiked: false,
      hasSaved: false,
    };

    if (onReelCreated) onReelCreated(newReel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playHeartPop();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Create Reel</span>
              <span className="text-[10px] bg-fuchsia-600/30 text-fuchsia-300 px-2 py-0.5 rounded-full border border-fuchsia-500/30">
                120Hz
              </span>
            </h3>
          </div>

          {/* Duration Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['15s', '30s', '60s', '90s'] as const).map((d) => (
              <button
                key={d}
                onClick={() => {
                  sound.playHeartPop();
                  setDurationSec(d);
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  durationSec === d ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Reel Video Preview Frame */}
          <div className="relative aspect-[9/14] rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
            <img
              src={selectedVideo}
              alt="Reel content"
              className={`w-full h-full object-cover transition-all ${FILTERS.find((f) => f.id === activeFilter)?.css || ''}`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Audio badge */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs flex items-center gap-2 border border-white/10">
              <Music className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
              <span className="font-semibold">{selectedTrack.title}</span>
            </div>

            {/* Recording badge if recording */}
            {isRecording && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white text-xs font-mono font-bold rounded-full animate-pulse">
                REC 00:{recordedSeconds < 10 ? `0${recordedSeconds}` : recordedSeconds}
              </div>
            )}

            {/* Shutter / Action Controls inside video preview */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20 hover:bg-black/80"
              >
                Gallery Video
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={handleStartRecord}
                className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all ${
                  isRecording ? 'border-red-500 bg-red-500/20 scale-110' : 'border-white bg-white/20 hover:scale-105'
                }`}
              >
                <div className={`rounded-full transition-all ${isRecording ? 'w-5 h-5 bg-red-500 rounded-sm' : 'w-10 h-10 bg-white'}`} />
              </button>

              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Sound / Music Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-fuchsia-400" /> Choose Soundtrack
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {REEL_MUSIC.map((track) => (
                <div
                  key={track.title}
                  onClick={() => {
                    sound.playHeartPop();
                    setSelectedTrack(track);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedTrack.title === track.title
                      ? 'bg-fuchsia-600/20 border-fuchsia-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{track.title}</div>
                    <div className="text-[10px] text-slate-400">{track.artist} · {track.duration}</div>
                  </div>
                  {selectedTrack.title === track.title && <Check className="w-4 h-4 text-fuchsia-400" />}
                </div>
              ))}
            </div>
          </div>

          {/* Visual Shaders & Filters */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Reel Filters
            </span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    sound.playHeartPop();
                    setActiveFilter(f.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                    activeFilter === f.id
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Video Trimmer Slider */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Trim Duration</span>
              <span className="font-mono text-fuchsia-400">{trimStart}s - {trimEnd}s</span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              value={trimEnd}
              onChange={(e) => setTrimEnd(parseInt(e.target.value))}
              className="w-full accent-fuchsia-500"
            />
          </div>

          {/* Caption Input */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[11px] block">Caption & Tags</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-fuchsia-500"
              placeholder="Write a caption... #VibeSpace"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">120Hz Frame Buffer Ready</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handlePublishReel}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs shadow-lg transition-all"
            >
              Share Reel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
