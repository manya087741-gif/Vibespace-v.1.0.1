import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Radio, Users, Heart, Send, MessageSquare, Volume2, 
  VolumeX, Shield, ShieldAlert, Sparkles, UserPlus, Pin, 
  Settings, Check, Camera, RefreshCw, BarChart2, Download, Film,
  Gift
} from 'lucide-react';
import { LiveStream, LiveComment, User } from '../types';
import { CURRENT_USER, MOCK_USERS } from '../data/mockData';
import { sound } from '../utils/audioSynth';

interface LiveStreamingStudioProps {
  initialStream?: LiveStream | null;
  onClose: () => void;
  onSaveReplay?: (stream: LiveStream) => void;
  onOpenGifts?: (creator: User) => void;
}

const SAMPLE_VIEWER_COMMENTS = [
  { username: 'elena_design', text: 'That new glass gradient is unbelievable 🔥', time: 'Just now' },
  { username: 'marcus_cyber', text: 'Audio fidelity is crisp. Zero latency on WebRTC!', time: '1s ago' },
  { username: 'aaliyah_visuals', text: 'Greetings from Shibuya! Loving the stream 🗼', time: '2s ago' },
  { username: 'julian_lens', text: 'Can you show the drawing tool strokes again?', time: '3s ago' },
  { username: 'tech_visionary', text: 'VibeSpace 120Hz is miles ahead of legacy apps 🚀', time: '4s ago' },
  { username: 'sarah_creator', text: 'Just subscribed to your channel! ✨', time: '5s ago' },
];

export const LiveStreamingStudio: React.FC<LiveStreamingStudioProps> = ({
  initialStream,
  onClose,
  onSaveReplay,
  onOpenGifts,
}) => {
  // Mode: 'host' (user is broadcasting) or 'viewer' (user is watching)
  const isHost = !initialStream || initialStream.user.id === CURRENT_USER.id;
  
  // Stream meta
  const [streamTitle, setStreamTitle] = useState<string>(
    initialStream?.title || 'Late Night Spatial Design & 120Hz Social Engineering ⚡'
  );
  const [streamCategory, setStreamCategory] = useState<string>(
    initialStream?.category || 'Tech & Creative'
  );

  // Broadcast state
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(!isHost);
  const [streamDuration, setStreamDuration] = useState<number>(0);
  const [viewerCount, setViewerCount] = useState<number>(initialStream?.viewerCount || 1);
  const [likesCount, setLikesCount] = useState<number>(initialStream?.likesCount || 0);

  // Floating reaction particles
  const [floatingHearts, setFloatingHearts] = useState<{ id: string; emoji: string; left: number }[]>([]);

  // Comments state
  const [comments, setComments] = useState<LiveComment[]>([
    {
      id: 'lc_0',
      user: MOCK_USERS[0],
      text: 'Welcome everyone! Tap the heart button to support the stream ❤️',
      timestamp: '1m ago',
      isPinned: true,
      isModerator: true,
    },
  ]);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Multi-guest split screen
  const [activeGuests, setActiveGuests] = useState<User[]>(initialStream?.guests || []);
  const [pendingGuestRequest, setPendingGuestRequest] = useState<User | null>(null);

  // Moderation state
  const [isChatMuted, setIsChatMuted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [saveReplayChecked, setSaveReplayChecked] = useState<boolean>(true);

  // Camera video ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize camera for host
  useEffect(() => {
    if (isHost && !isBroadcasting) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isHost, isBroadcasting]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch {
      // Fallback
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Live timer & incoming comments simulation
  useEffect(() => {
    if (!isBroadcasting) return;

    // Stream duration timer
    const timerInterval = setInterval(() => {
      setStreamDuration((prev) => prev + 1);
    }, 1000);

    // Dynamic viewer count fluctuations
    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 2;
        return Math.max(12, prev + delta);
      });
    }, 3000);

    // Auto-incoming comments
    let commentIdx = 0;
    const commentInterval = setInterval(() => {
      if (commentIdx < SAMPLE_VIEWER_COMMENTS.length) {
        const sample = SAMPLE_VIEWER_COMMENTS[commentIdx];
        const newCom: LiveComment = {
          id: 'com_' + Math.random().toString(36).substring(2, 9),
          user: MOCK_USERS[commentIdx % MOCK_USERS.length],
          text: sample.text,
          timestamp: 'Just now',
        };
        setComments((prev) => [...prev.slice(-15), newCom]);
        commentIdx++;
      }
    }, 4500);

    // Prompt guest request after 8 seconds if none active
    const guestTimer = setTimeout(() => {
      if (isHost && activeGuests.length === 0) {
        setPendingGuestRequest(MOCK_USERS[1]); // Marcus requests to join
      }
    }, 8000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(viewerInterval);
      clearInterval(commentInterval);
      clearTimeout(guestTimer);
    };
  }, [isBroadcasting, isHost, activeGuests.length]);

  const handleStartBroadcast = () => {
    sound.playSparkle();
    setIsBroadcasting(true);
    setViewerCount(42);
    setStreamDuration(0);
  };

  const handleEndBroadcast = () => {
    sound.playHeartPop();
    setIsBroadcasting(false);
    stopCamera();
    setShowSummary(true);
  };

  const triggerReactionHeart = () => {
    sound.playHeartPop();
    setLikesCount((prev) => prev + 1);
    const id = Math.random().toString(36).substring(2, 9);
    const left = 65 + Math.random() * 25;
    const emojis = ['❤️', '🔥', '✨', '⚡', '🚀'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    setFloatingHearts((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1800);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isChatMuted) return;
    sound.playHeartPop();

    const newCom: LiveComment = {
      id: 'com_usr_' + Date.now().toString(36),
      user: CURRENT_USER,
      text: newCommentText.trim(),
      timestamp: 'Just now',
      isModerator: isHost,
    };

    setComments((prev) => [...prev, newCom]);
    setNewCommentText('');
  };

  const acceptGuestRequest = () => {
    sound.playSparkle();
    if (pendingGuestRequest) {
      setActiveGuests((prev) => [...prev, pendingGuestRequest]);
      setPendingGuestRequest(null);
    }
  };

  const declineGuestRequest = () => {
    sound.playHeartPop();
    setPendingGuestRequest(null);
  };

  const removeGuest = (guestId: string) => {
    sound.playHeartPop();
    setActiveGuests((prev) => prev.filter((g) => g.id !== guestId));
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      
      {/* FLOATING HEARTS ANIMATION */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingHearts.map((item) => (
          <div
            key={item.id}
            className="absolute text-3xl animate-in fade-in duration-300"
            style={{
              left: `${item.left}%`,
              bottom: '15%',
              animation: 'floatLiveHeart 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatLiveHeart {
          0% { transform: translateY(0px) scale(0.6); opacity: 1; }
          50% { transform: translateY(-160px) scale(1.3); opacity: 0.9; }
          100% { transform: translateY(-340px) scale(1); opacity: 0; }
        }
      `}</style>

      {/* MAIN STREAM VIEW CONTAINER */}
      <div className="relative w-full max-w-md h-full md:h-[92vh] md:max-h-[850px] md:rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-slate-800">
        
        {/* VIDEO BROADCAST CANVAS / SPLIT-SCREEN */}
        <div className="absolute inset-0 z-0 bg-black flex flex-col">
          {activeGuests.length > 0 ? (
            /* Split Screen Multi-Guest (Host + Guest) */
            <div className="w-full h-full grid grid-rows-2">
              {/* Top: Host Stream */}
              <div className="relative w-full h-full overflow-hidden border-b border-white/20">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                  Host: @{CURRENT_USER.username}
                </div>
              </div>

              {/* Bottom: Co-host / Guest Stream */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={activeGuests[0].avatar}
                  alt={activeGuests[0].username}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-3 flex items-center justify-between right-3">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                    Guest: @{activeGuests[0].username}
                  </span>
                  {isHost && (
                    <button
                      onClick={() => removeGuest(activeGuests[0].id)}
                      className="px-2 py-0.5 rounded-md bg-red-600/80 text-white text-[10px] font-semibold"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Single Host or Single Stream */
            <div className="relative w-full h-full overflow-hidden">
              {isHost ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <img
                  src={initialStream?.coverUrl || '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg'}
                  alt="Live Stream"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
        </div>

        {/* TOP STATUS & HEADER BAR */}
        <div className="relative z-30 p-4 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Flashing LIVE indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-mono text-xs font-bold shadow-lg animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>LIVE</span>
            </div>

            {/* Viewer Count */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
              <Users className="w-3.5 h-3.5 text-violet-400" />
              <span>{viewerCount.toLocaleString()}</span>
            </div>

            {/* Timer */}
            {isBroadcasting && (
              <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-xs border border-white/10">
                {formatDuration(streamDuration)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/10"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* End / Exit Button */}
            <button
              onClick={() => {
                if (isHost && isBroadcasting) {
                  handleEndBroadcast();
                } else {
                  onClose();
                }
              }}
              className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-colors"
            >
              {isHost && isBroadcasting ? 'End Live' : 'Leave'}
            </button>
          </div>
        </div>

        {/* HOST PRE-LIVE SETUP OVERLAY */}
        {isHost && !isBroadcasting && (
          <div className="relative z-30 m-4 p-5 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                <span>Go Live Studio</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stream in ultra-low latency with 120Hz frame rates and native DRM protection.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-slate-400 text-[11px] block">Stream Title</label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-rose-500"
                placeholder="Give your live stream a title..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] block">Category</label>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {['Tech & Code', 'Design & Art', 'Gaming', 'Music & Synth', 'Chit-Chat'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setStreamCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                      streamCategory === cat ? 'bg-rose-600 text-white font-bold' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartBroadcast}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Radio className="w-4 h-4" />
              <span>Start Live Broadcast</span>
            </button>
          </div>
        )}

        {/* PENDING GUEST REQUEST TOAST (FOR HOST) */}
        {pendingGuestRequest && (
          <div className="relative z-40 mx-4 p-3 rounded-2xl bg-slate-900/95 border border-violet-500/50 shadow-2xl flex items-center justify-between backdrop-blur-xl animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2.5">
              <img
                src={pendingGuestRequest.avatar}
                alt={pendingGuestRequest.username}
                className="w-9 h-9 rounded-full object-cover border border-violet-400"
              />
              <div>
                <div className="text-xs font-bold text-white">@{pendingGuestRequest.username}</div>
                <div className="text-[10px] text-violet-300">Requested to join split-screen</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={declineGuestRequest}
                className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Decline
              </button>
              <button
                onClick={acceptGuestRequest}
                className="px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
              >
                Accept
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM LIVE CHAT & REACTION CONTROLS */}
        {isBroadcasting && (
          <div className="relative z-30 p-4 pb-6 space-y-3">
            
            {/* Live Chat Stream (Scrolls up) */}
            <div className="max-h-52 overflow-y-auto space-y-2 no-scrollbar mask-top-gradient pr-1">
              {comments.map((com) => (
                <div
                  key={com.id}
                  className={`p-2 rounded-2xl backdrop-blur-md flex items-start gap-2 max-w-[85%] text-xs ${
                    com.isPinned
                      ? 'bg-violet-900/80 border border-violet-500/50 text-white'
                      : 'bg-black/60 border border-white/10 text-white'
                  }`}
                >
                  <img
                    src={com.user.avatar}
                    alt={com.user.username}
                    className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{com.user.username}</span>
                      {com.isModerator && (
                        <span className="px-1.5 py-0.2 rounded-md bg-rose-600 text-[9px] font-bold">
                          MOD
                        </span>
                      )}
                      {com.isPinned && (
                        <span className="text-[10px] text-violet-300 flex items-center gap-0.5">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200 mt-0.5 leading-snug">{com.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input and Reaction Heart */}
            <div className="flex items-center gap-2">
              <form onSubmit={handleSendComment} className="flex-1 flex items-center bg-black/60 backdrop-blur-md rounded-full border border-white/20 px-3.5 py-2">
                <input
                  type="text"
                  placeholder={isChatMuted ? 'Live chat is paused by host...' : 'Comment on live stream...'}
                  disabled={isChatMuted}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full bg-transparent text-xs text-white outline-none placeholder-white/50"
                />
                <button type="submit" disabled={isChatMuted} className="p-1 text-white hover:text-violet-400 shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Virtual Gift Button (for viewers) */}
              {!isHost && onOpenGifts && (
                <button
                  onClick={() => {
                    sound.playSparkle();
                    onOpenGifts(initialStream?.user || MOCK_USERS[0]);
                  }}
                  className="p-3 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 hover:brightness-110 text-white shadow-xl transition-transform active:scale-90 shrink-0 border border-amber-300/30"
                  title="Send Virtual Gift"
                >
                  <Gift className="w-5 h-5" />
                </button>
              )}

              {/* Flying Reaction Heart Button */}
              <button
                onClick={triggerReactionHeart}
                className="p-3 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white shadow-xl transition-transform active:scale-90 shrink-0"
                title="Send Live Reaction"
              >
                <Heart className="w-5 h-5 fill-white" />
              </button>
            </div>

            {/* Host Moderator Toolbar */}
            {isHost && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsChatMuted(!isChatMuted)}
                    className="hover:text-white flex items-center gap-1"
                  >
                    <span>{isChatMuted ? 'Unpause Chat' : 'Pause Chat'}</span>
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => {
                      sound.playSparkle();
                      setPendingGuestRequest(MOCK_USERS[0]);
                    }}
                    className="hover:text-violet-400 flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite Guest</span>
                  </button>
                </div>

                <div className="font-mono text-emerald-400">
                  {likesCount} Reactions
                </div>
              </div>
            )}

          </div>
        )}

        {/* STREAM ENDED SUMMARY MODAL */}
        {showSummary && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-6 animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Live Stream Summary</h3>
                  <span className="text-xs text-slate-400 font-mono">Session statistics & replay archive</span>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stream KPIs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Total Duration</span>
                  <span className="text-lg font-bold font-mono text-white mt-1">
                    {formatDuration(streamDuration)}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Peak Viewers</span>
                  <span className="text-lg font-bold font-mono text-violet-400 mt-1">
                    {Math.max(viewerCount, 48).toLocaleString()}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Total Reactions</span>
                  <span className="text-lg font-bold font-mono text-rose-400 mt-1">
                    {likesCount + 120}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">New Followers</span>
                  <span className="text-lg font-bold font-mono text-emerald-400 mt-1">
                    +18
                  </span>
                </div>
              </div>

              {/* Save Replay Option */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Save Replay to Channel</div>
                  <div className="text-[11px] text-slate-400">Allow followers to watch after broadcast</div>
                </div>
                <input
                  type="checkbox"
                  checked={saveReplayChecked}
                  onChange={(e) => setSaveReplayChecked(e.target.checked)}
                  className="w-4 h-4 accent-violet-600 rounded"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  sound.playSparkle();
                  if (saveReplayChecked && onSaveReplay && initialStream) {
                    onSaveReplay(initialStream);
                  }
                  onClose();
                }}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-2xl transition-colors"
              >
                Done & Return Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
