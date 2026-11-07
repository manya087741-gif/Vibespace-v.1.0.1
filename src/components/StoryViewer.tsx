import React, { useState, useEffect, useRef } from 'react';
import { Story, StorySticker, User, StoryHighlight } from '../types';
import { 
  X, Shield, Eye, ShieldCheck, Heart, Send, ChevronLeft, 
  ChevronRight, MoreHorizontal, Trash2, Bookmark, Download, 
  Share2, BarChart2, Volume2, VolumeX, Sparkles, MapPin, 
  AtSign, Hash, Check, Clock, Plus, Flame, Users, Music
} from 'lucide-react';
import { DynamicWatermark } from './DynamicWatermark';
import { sound } from '../utils/audioSynth';
import { CURRENT_USER, MOCK_USERS } from '../data/mockData';
import { socialStore } from '../utils/socialStore';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  watermarkEnabled: boolean;
  onDeleteStory?: (storyId: string) => void;
  onSaveToHighlight?: (story: Story) => void;
  onReplyMessage?: (recipientUser: User, text: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
  watermarkEnabled,
  onDeleteStory,
  onSaveToHighlight,
  onReplyMessage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Floating reaction particles
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: string; emoji: string; left: number }[]>([]);

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [replySentToast, setReplySentToast] = useState(false);

  // Modals & Drawers
  const [showViewersDrawer, setShowViewersDrawer] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccessToast, setShareSuccessToast] = useState(false);

  // Interactive sticker states
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>({}); // stickerId -> optionId
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({}); // stickerId -> optionId
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});

  const activeStory = stories[currentIndex] || stories[0];
  const isOwner = activeStory?.user?.id === CURRENT_USER.id;

  useEffect(() => {
    setProgress(0);
    setHasLiked(activeStory?.hasLiked || false);
    setLikeCount(activeStory?.likesCount || 0);
  }, [currentIndex, activeStory]);

  // Story progression timer
  useEffect(() => {
    if (isPaused || showViewersDrawer || showMoreMenu || showShareModal) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 1.6; // ~6 seconds per story
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, showViewersDrawer, showMoreMenu, showShareModal, stories.length, onClose]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIndex > 0) {
      sound.playHeartPop();
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      sound.playHeartPop();
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playHeartPop();
    const newLiked = !hasLiked;
    setHasLiked(newLiked);
    setLikeCount((c) => (newLiked ? c + 1 : Math.max(0, c - 1)));
    if (newLiked) {
      triggerFloatingEmoji('❤️');
    }
  };

  const triggerFloatingEmoji = (emoji: string) => {
    sound.playSparkle();
    const id = Math.random().toString(36).substring(2, 9);
    const left = 35 + Math.random() * 50; // Random horizontal placement
    setFloatingEmojis((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 1800);

    const reactor = socialStore.getCurrentUser();
    socialStore.addNotification({
      id: 'notif_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      type: 'story_reply',
      user: reactor,
      message: `reacted ${emoji} to ${activeStory.user.id === reactor.id ? 'your' : `@${activeStory.user.username}'s`} story`,
      timestamp: 'Just now',
      isRead: false,
      targetId: activeStory.id,
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sound.playSparkle();

    if (onReplyMessage) {
      onReplyMessage(activeStory.user, `Replied to your story: "${replyText.trim()}"`);
    }

    setReplyText('');
    setReplySentToast(true);
    setTimeout(() => setReplySentToast(false), 2500);
  };

  const handleShareToUser = (user: User) => {
    sound.playSparkle();
    if (onReplyMessage) {
      onReplyMessage(user, `Sent you a story by @${activeStory.user.username}`);
    }
    setShowShareModal(false);
    setShareSuccessToast(true);
    setTimeout(() => setShareSuccessToast(false), 2500);
  };

  const handleVotePoll = (stickerId: string, optionId: string) => {
    sound.playSparkle();
    setVotedPolls((prev) => ({ ...prev, [stickerId]: optionId }));
  };

  const handleAnswerQuiz = (stickerId: string, optionId: string) => {
    sound.playSparkle();
    setQuizAnswers((prev) => ({ ...prev, [stickerId]: optionId }));
  };

  const handleDownload = () => {
    sound.playSparkle();
    const link = document.createElement('a');
    link.download = `story_${activeStory.id}.jpg`;
    link.href = activeStory.mediaUrl || '';
    link.click();
    setShowMoreMenu(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      
      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute text-4xl animate-in fade-in duration-300 transition-all"
            style={{
              left: `${item.left}%`,
              bottom: '15%',
              animation: 'floatUp 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0px) scale(0.6); opacity: 1; }
          50% { transform: translateY(-160px) scale(1.3); opacity: 0.9; }
          100% { transform: translateY(-320px) scale(1); opacity: 0; }
        }
      `}</style>

      {/* MAIN STORY CONTAINER */}
      <div 
        className="relative w-full max-w-md h-full md:h-[92vh] md:max-h-[850px] md:rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-slate-800"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* STORY MEDIA BACKGROUND */}
        {activeStory.mediaType === 'text' ? (
          <div className={`absolute inset-0 bg-gradient-to-br ${activeStory.backgroundGradient || 'from-violet-900 to-black'} flex items-center justify-center p-8 text-center`}>
            <p className="text-xl md:text-2xl font-bold leading-relaxed text-white drop-shadow-lg">
              {activeStory.textContent}
            </p>
          </div>
        ) : activeStory.mediaType === 'video' ? (
          <video
            src={activeStory.mediaUrl}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={activeStory.mediaUrl}
            alt={activeStory.caption || 'Story content'}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Hand-drawn Overlay if present */}
        {activeStory.drawingsDataUrl && (
          <img
            src={activeStory.drawingsDataUrl}
            alt="Story drawings"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
          />
        )}

        {/* Vignette Gradients for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/85 pointer-events-none z-10" />

        {/* Hardware Dynamic Watermark */}
        <DynamicWatermark enabled={watermarkEnabled} opacity={0.35} mode="discrete" />

        {/* TOP CONTROLS & SEGMENTED PROGRESS BARS */}
        <div className="relative z-30 p-4 pt-5 space-y-3">
          {/* Segmented Progress Bars */}
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-xs"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width:
                      idx === currentIndex
                        ? `${progress}%`
                        : idx < currentIndex
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Profile Bar & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-0.5 rounded-full ${
                activeStory.isCloseFriends
                  ? 'bg-gradient-to-tr from-emerald-400 to-teal-300'
                  : 'bg-gradient-to-tr from-violet-500 to-pink-500'
              }`}>
                <img
                  src={activeStory.user.avatar}
                  alt={activeStory.user.username}
                  className="w-8 h-8 rounded-full object-cover border border-black"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white drop-shadow-xs">
                    {activeStory.user.username}
                  </span>
                  <span className="text-[11px] text-white/70">· {activeStory.timestamp}</span>
                  {activeStory.isCloseFriends && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      ★ Close Friends
                    </span>
                  )}
                </div>
                {activeStory.audioTrack && (
                  <div className="flex items-center gap-1 text-[10px] text-white/80">
                    <Music className="w-2.5 h-2.5 text-fuchsia-300" />
                    <span>{activeStory.audioTrack.title} · {activeStory.audioTrack.artist}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Audio Mute Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playHeartPop();
                  setIsMuted(!isMuted);
                }}
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* More Actions Menu */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playHeartPop();
                  setShowMoreMenu(true);
                }}
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playHeartPop();
                  onClose();
                }}
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* TAP NAVIGATION ZONES (Left / Right) */}
        <div className="absolute inset-y-16 inset-x-0 z-20 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-1/3 h-full cursor-pointer" />
          <div className="w-1/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* INTERACTIVE STICKERS RENDERING */}
        <div className="relative z-25 flex-1 pointer-events-none p-4 flex flex-col justify-center items-center">
          {activeStory.stickers?.map((stk) => (
            <div
              key={stk.id}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-102"
              style={{ left: `${stk.x}%`, top: `${stk.y}%` }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. POLL STICKER */}
              {stk.type === 'poll' && (
                <div className="w-68 p-4 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3">
                  <p className="text-xs font-bold text-white text-center">{stk.data.question}</p>
                  <div className="space-y-2">
                    {stk.data.options?.map((opt, i) => {
                      const hasVoted = Boolean(votedPolls[stk.id]);
                      const isSelected = votedPolls[stk.id] === opt.id;
                      const total = (stk.data.totalVotes || 0) + (hasVoted ? 1 : 0);
                      const optionVotes = (opt.votes || 0) + (isSelected ? 1 : 0);
                      const pct = total > 0 ? Math.round((optionVotes / total) * 100) : (i === 0 ? 60 : 40);

                      return (
                        <button
                          key={opt.id}
                          disabled={hasVoted}
                          onClick={() => handleVotePoll(stk.id, opt.id)}
                          className={`relative w-full py-2.5 px-3.5 rounded-2xl text-xs font-bold overflow-hidden border transition-all text-left flex items-center justify-between ${
                            isSelected
                              ? 'border-violet-500 bg-violet-600/30 text-white'
                              : 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          {hasVoted && (
                            <div
                              className="absolute inset-y-0 left-0 bg-violet-600/40 transition-all duration-500 ease-out"
                              style={{ width: `${pct}%` }}
                            />
                          )}
                          <span className="relative z-10">{opt.text}</span>
                          {hasVoted && <span className="relative z-10 font-mono text-white">{pct}%</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. QUESTION STICKER */}
              {stk.type === 'question' && (
                <div className="w-64 p-4 rounded-3xl bg-gradient-to-br from-indigo-950/95 to-purple-950/95 backdrop-blur-xl border border-white/20 shadow-2xl space-y-2.5">
                  <div className="text-[10px] font-bold text-violet-300 uppercase tracking-wider text-center">
                    Ask me anything
                  </div>
                  <p className="text-xs font-bold text-white text-center leading-snug">{stk.data.question}</p>
                  <div className="flex items-center gap-1.5 bg-black/50 rounded-2xl p-1.5 border border-white/10">
                    <input
                      type="text"
                      placeholder="Send response..."
                      value={questionAnswers[stk.id] || ''}
                      onChange={(e) => setQuestionAnswers({ ...questionAnswers, [stk.id]: e.target.value })}
                      className="w-full bg-transparent px-2 text-xs text-white outline-none placeholder-slate-400"
                    />
                    <button
                      onClick={() => {
                        sound.playSparkle();
                        setQuestionAnswers({ ...questionAnswers, [stk.id]: 'Sent! ✓' });
                        setTimeout(() => setQuestionAnswers({ ...questionAnswers, [stk.id]: '' }), 2000);
                      }}
                      className="p-1.5 rounded-xl bg-violet-600 text-white hover:bg-violet-500 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. QUIZ STICKER */}
              {stk.type === 'quiz' && (
                <div className="w-68 p-4 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl space-y-2.5">
                  <div className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider text-center">
                    Quiz Challenge 🎯
                  </div>
                  <p className="text-xs font-bold text-white text-center">{stk.data.question}</p>
                  <div className="space-y-1.5">
                    {stk.data.options?.map((opt) => {
                      const answered = Boolean(quizAnswers[stk.id]);
                      const isSelected = quizAnswers[stk.id] === opt.id;
                      let bgStyle = 'bg-slate-800/80 border-slate-700 text-slate-200';
                      if (answered) {
                        if (opt.isCorrect) {
                          bgStyle = 'bg-emerald-600/40 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isSelected) {
                          bgStyle = 'bg-rose-600/40 border-rose-500 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={answered}
                          onClick={() => handleAnswerQuiz(stk.id, opt.id)}
                          className={`w-full py-2 px-3 rounded-xl border text-xs text-left flex items-center justify-between transition-all ${bgStyle}`}
                        >
                          <span>{opt.text}</span>
                          {answered && opt.isCorrect && <span className="text-emerald-400 font-bold">✓</span>}
                          {answered && isSelected && !opt.isCorrect && <span className="text-rose-400 font-bold">✗</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. COUNTDOWN STICKER */}
              {stk.type === 'countdown' && (
                <div className="w-68 p-4 rounded-3xl bg-gradient-to-r from-violet-900/95 via-fuchsia-900/95 to-purple-950/95 backdrop-blur-xl border border-white/20 shadow-2xl text-center space-y-2">
                  <span className="text-xs font-bold text-white block">{stk.data.title}</span>
                  <div className="flex justify-center gap-2 font-mono text-xs font-bold text-white">
                    <div className="px-2.5 py-1.5 bg-black/40 rounded-xl">12<span className="text-[8px] block text-slate-400">DAYS</span></div>
                    <div className="px-2.5 py-1.5 bg-black/40 rounded-xl">08<span className="text-[8px] block text-slate-400">HOURS</span></div>
                    <div className="px-2.5 py-1.5 bg-black/40 rounded-xl">45<span className="text-[8px] block text-slate-400">MINS</span></div>
                    <div className="px-2.5 py-1.5 bg-black/40 rounded-xl">20<span className="text-[8px] block text-slate-400">SECS</span></div>
                  </div>
                </div>
              )}

              {/* 5. LINK STICKER */}
              {stk.type === 'link' && (
                <a
                  href={stk.data.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playSparkle();
                  }}
                  className="px-4 py-2 rounded-full bg-white text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                >
                  <span className="text-violet-600">🔗</span>
                  <span>{stk.data.title}</span>
                </a>
              )}

              {/* 6. LOCATION STICKER */}
              {stk.type === 'location' && (
                <div className="px-3.5 py-2 rounded-full bg-slate-900/90 text-white font-bold text-xs shadow-2xl border border-white/20 flex items-center gap-1.5 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{stk.data.locationName}</span>
                </div>
              )}

              {/* 7. MENTION STICKER */}
              {stk.type === 'mention' && (
                <div className="px-3.5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-2xl flex items-center gap-1 backdrop-blur-md">
                  <AtSign className="w-3.5 h-3.5" />
                  <span>{stk.data.tag}</span>
                </div>
              )}

              {/* 8. MUSIC STICKER */}
              {stk.type === 'music' && (
                <div className="px-4 py-2 rounded-full bg-black/60 text-white font-bold text-xs shadow-2xl border border-fuchsia-500/40 flex items-center gap-2 backdrop-blur-md">
                  <div className="w-5 h-5 rounded-full border border-fuchsia-400 flex items-center justify-center animate-spin">
                    <span className="text-[9px]">💿</span>
                  </div>
                  <div>
                    <span className="block text-white leading-tight">{stk.data.trackTitle}</span>
                    <span className="block text-[10px] text-fuchsia-300 font-normal leading-tight">{stk.data.artist}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BOTTOM USER INTERACTION OR CREATOR INSIGHTS BAR */}
        <div className="relative z-30 p-4 pb-6 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent">
          
          {/* Quick Reaction Tray (Flying emojis) */}
          <div className="flex items-center justify-between px-1">
            {['🔥', '❤️', '😂', '😮', '😢', '👏', '💯', '🚀'].map((em) => (
              <button
                key={em}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFloatingEmoji(em);
                }}
                className="text-xl hover:scale-125 active:scale-95 transition-transform"
                title={`React ${em}`}
              >
                {em}
              </button>
            ))}
          </div>

          {/* Bottom Bar: Reply Input vs Viewers count */}
          {isOwner ? (
            /* Creator's Own Story Controls */
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playHeartPop();
                  setShowViewersDrawer(true);
                }}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white text-xs font-semibold flex items-center justify-between hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-violet-400" />
                  <span>Seen by <strong>{activeStory.viewersCount || 284}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span>{activeStory.viewsPrevented || 9} prevented</span>
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playHeartPop();
                  if (onSaveToHighlight) onSaveToHighlight(activeStory);
                }}
                className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-white hover:bg-slate-800 transition-colors"
                title="Add to Highlights"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playHeartPop();
                  if (onDeleteStory) onDeleteStory(activeStory.id);
                  onClose();
                }}
                className="p-2.5 rounded-2xl bg-rose-600/20 border border-rose-500/30 text-rose-300 hover:bg-rose-600/30 transition-colors"
                title="Delete Story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Viewer Reply Controls */
            <div className="flex items-center gap-2">
              <form onSubmit={handleSendReply} className="flex-1 flex items-center bg-black/60 backdrop-blur-md rounded-full border border-white/20 px-3.5 py-1.5">
                <input
                  type="text"
                  placeholder={`Send message to @${activeStory.user.username}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  className="w-full bg-transparent text-xs text-white outline-none placeholder-white/60"
                />
                <button type="submit" className="p-1 text-white hover:text-violet-400 shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Like Heart Button */}
              <button
                onClick={handleLike}
                className={`p-2.5 rounded-full backdrop-blur-md transition-transform ${
                  hasLiked ? 'text-rose-500 scale-110' : 'text-white hover:scale-105'
                }`}
                title="Like Story"
              >
                <Heart className={`w-5 h-5 ${hasLiked ? 'fill-rose-500' : ''}`} />
              </button>

              {/* Share Story Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playHeartPop();
                  setShowShareModal(true);
                }}
                className="p-2.5 rounded-full text-white hover:text-violet-400 transition-colors"
                title="Share Story to Chat"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Reply sent confirmation toast */}
          {replySentToast && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-emerald-500/90 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-md animate-in fade-in duration-200">
              Message sent to @{activeStory.user.username} ✓
            </div>
          )}

          {/* Share confirmation toast */}
          {shareSuccessToast && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-violet-600/90 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-md animate-in fade-in duration-200">
              Story shared to Messenger ✓
            </div>
          )}
        </div>

        {/* MODAL: STORY VIEWERS & INSIGHTS DRAWER */}
        {showViewersDrawer && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between animate-in slide-in-from-bottom duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Story Activity & Insights</h3>
                <span className="text-[11px] text-slate-400 font-mono">Real-time metrics & anti-screenshot audit</span>
              </div>
              <button
                onClick={() => setShowViewersDrawer(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics cards */}
            <div className="p-4 grid grid-cols-4 gap-2 text-center border-b border-slate-800 bg-slate-900/60">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-sm font-bold text-white block">{activeStory.viewersCount || 284}</span>
                <span className="text-[9px] text-slate-400 uppercase">Views</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-sm font-bold text-emerald-400 block">{activeStory.viewsPrevented || 9}</span>
                <span className="text-[9px] text-slate-400 uppercase">Blocked</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-sm font-bold text-rose-400 block">{likeCount}</span>
                <span className="text-[9px] text-slate-400 uppercase">Likes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-sm font-bold text-violet-400 block">19</span>
                <span className="text-[9px] text-slate-400 uppercase">Replies</span>
              </div>
            </div>

            {/* Viewers list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Viewers ({activeStory.viewers?.length || MOCK_USERS.length})
              </span>
              
              {(activeStory.viewers || MOCK_USERS.map((u, i) => ({
                id: `v_${i}`,
                user: u,
                viewedAt: `${(i + 1) * 8}m ago`,
                hasLiked: i % 2 === 0,
                reactionEmoji: i === 0 ? '🔥' : i === 1 ? '❤️' : undefined,
              }))).map((vw) => (
                <div
                  key={vw.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={vw.user.avatar}
                      alt={vw.user.username}
                      className="w-9 h-9 rounded-full object-cover border border-violet-500/40"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>@{vw.user.username}</span>
                        {vw.reactionEmoji && <span>{vw.reactionEmoji}</span>}
                      </div>
                      <span className="text-[11px] text-slate-400">{vw.viewedAt}</span>
                    </div>
                  </div>

                  {vw.hasLiked && (
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900">
              <button
                onClick={() => setShowViewersDrawer(false)}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Back to Story
              </button>
            </div>
          </div>
        )}

        {/* MODAL: SHARE TO MESSENGER */}
        {showShareModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white">Share Story to Friend or Group</span>
                <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {MOCK_USERS.map((usr) => (
                  <div
                    key={usr.id}
                    onClick={() => handleShareToUser(usr)}
                    className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-violet-500 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={usr.avatar} alt={usr.username} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-bold text-white">@{usr.username}</div>
                        <div className="text-[10px] text-slate-400">{usr.fullName}</div>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-violet-600 hover:bg-violet-500 rounded-xl text-white text-xs font-semibold">
                      Send
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: MORE OPTIONS MENU */}
        {showMoreMenu && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-4 shadow-2xl space-y-2 animate-in slide-in-from-bottom duration-200">
              <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-2" />

              {isOwner && (
                <>
                  <button
                    onClick={() => {
                      if (onSaveToHighlight) onSaveToHighlight(activeStory);
                      setShowMoreMenu(false);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-3 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>Add to Story Highlights</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onDeleteStory) onDeleteStory(activeStory.id);
                      setShowMoreMenu(false);
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold flex items-center gap-3 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Story</span>
                  </button>
                </>
              )}

              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-3 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Save to Camera Roll / Device</span>
              </button>

              <button
                onClick={() => {
                  sound.playHeartPop();
                  setShowMoreMenu(false);
                  setShowShareModal(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-3 transition-colors"
              >
                <Share2 className="w-4 h-4 text-violet-400" />
                <span>Share to Messenger</span>
              </button>

              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold text-center mt-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
