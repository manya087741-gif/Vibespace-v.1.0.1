import React, { useState, useEffect, useRef } from 'react';
import { ChatThread, Message } from '../types';
import { MOCK_CHATS, CURRENT_USER } from '../data/mockData';
import { Lock, Shield, Phone, Video, Mic, Send, Timer, Play, Pause, ChevronLeft, CheckCheck, EyeOff, X, PhoneOff, MicOff, Camera } from 'lucide-react';
import { sound } from '../utils/audioSynth';

export const SecureMessaging: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_CHATS);
  const [activeThreadId, setActiveThreadId] = useState<string>('chat_01');
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showCallModal, setShowCallModal] = useState<'audio' | 'video' | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const recordingTimerRef = useRef<number | null>(null);

  // Countdown timer for disappearing messages
  useEffect(() => {
    const timer = setInterval(() => {
      setThreads((prevThreads) =>
        prevThreads.map((thread) => {
          const updatedMessages = thread.messages
            .map((msg) => {
              if (msg.expiresInSeconds && msg.timeRemaining !== undefined) {
                if (msg.timeRemaining <= 1) {
                  return null; // message expires and is purged
                }
                return { ...msg, timeRemaining: msg.timeRemaining - 1 };
              }
              return msg;
            })
            .filter((m): m is Message => m !== null);

          return { ...thread, messages: updatedMessages };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Call timer
  useEffect(() => {
    let callTimer: number | null = null;
    if (showCallModal) {
      callTimer = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [showCallModal]);

  // Voice recording simulation
  const startRecording = () => {
    sound.playHeartPop();
    setIsRecordingVoice(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopAndSendRecording = () => {
    sound.playHeartPop();
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingVoice(false);

    if (recordingSeconds >= 1) {
      const newMsg: Message = {
        id: Math.random().toString(),
        senderId: CURRENT_USER.id,
        audioDuration: recordingSeconds,
        timestamp: 'Just now',
        status: 'delivered',
        isE2EE: true,
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? {
                ...t,
                lastMessage: `Voice note (0:${recordingSeconds.toString().padStart(2, '0')})`,
                lastMessageTime: 'Just now',
                messages: [...t.messages, newMsg],
              }
            : t
        )
      );
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sound.playHeartPop();
    const newMsg: Message = {
      id: Math.random().toString(),
      senderId: CURRENT_USER.id,
      text: inputText.trim(),
      timestamp: 'Just now',
      status: 'delivered',
      isE2EE: true,
      expiresInSeconds: activeThread.disappearingTimer || undefined,
      timeRemaining: activeThread.disappearingTimer || undefined,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              lastMessage: inputText.trim(),
              lastMessageTime: 'Just now',
              messages: [...t.messages, newMsg],
            }
          : t
      )
    );
    setInputText('');
  };

  const setDisappearingTimer = (seconds: number) => {
    sound.playHeartPop();
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, disappearingTimer: seconds } : t))
    );
  };

  const playVoiceNote = (id: string, duration: number = 3) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
      return;
    }
    setPlayingVoiceId(id);
    sound.playVoiceNote(duration, () => {
      setPlayingVoiceId(null);
    });
  };

  return (
    <div className="pb-24 max-w-xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col bg-slate-950">
      {/* Thread Header with E2EE Status */}
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={activeThread.user.avatar}
              alt={activeThread.user.username}
              className="w-10 h-10 rounded-full object-cover border border-violet-500/40"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">
                {activeThread.user.fullName}
              </span>
              <span className="text-[10px] text-slate-400">@{activeThread.user.username}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <Lock className="w-3 h-3" />
              <span>Signal E2EE Active</span>
            </div>
          </div>
        </div>

        {/* Action Controls: HD Calls & Disappearing Timer Selector */}
        <div className="flex items-center gap-1.5">
          {/* Disappearing Timer Menu */}
          <div className="relative group">
            <button
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                activeThread.disappearingTimer > 0
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Disappearing Messages Timer"
            >
              <Timer className="w-4 h-4" />
              {activeThread.disappearingTimer > 0 && (
                <span className="text-[10px]">
                  {activeThread.disappearingTimer === 10
                    ? '10s'
                    : activeThread.disappearingTimer === 60
                    ? '1m'
                    : '24h'}
                </span>
              )}
            </button>

            {/* Dropdown Options */}
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-xl z-30 min-w-[120px] text-xs">
              <button
                onClick={() => setDisappearingTimer(0)}
                className={`px-3 py-1.5 text-left rounded-lg transition-colors ${
                  activeThread.disappearingTimer === 0 ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Off (Keep)
              </button>
              <button
                onClick={() => setDisappearingTimer(10)}
                className={`px-3 py-1.5 text-left rounded-lg transition-colors ${
                  activeThread.disappearingTimer === 10 ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                10 Seconds ⚡
              </button>
              <button
                onClick={() => setDisappearingTimer(60)}
                className={`px-3 py-1.5 text-left rounded-lg transition-colors ${
                  activeThread.disappearingTimer === 60 ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                1 Minute
              </button>
              <button
                onClick={() => setDisappearingTimer(86400)}
                className={`px-3 py-1.5 text-left rounded-lg transition-colors ${
                  activeThread.disappearingTimer === 86400 ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                24 Hours
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playHeartPop();
              setShowCallModal('audio');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Encrypted HD Audio Call"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playHeartPop();
              setShowCallModal('video');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Encrypted HD Video Call"
          >
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Advisory / Fingerprint Banner */}
      <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-mono">
          <Shield className="w-3.5 h-3.5 text-violet-400" />
          <span>Fingerprint:</span>
          <span className="text-slate-300 truncate max-w-[200px]">{activeThread.fingerprint}</span>
        </div>
        <span className="text-emerald-400">Zero Server Storage</span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeThread.messages.map((msg) => {
          const isSender = msg.senderId === CURRENT_USER.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs relative ${
                  isSender
                    ? 'bg-violet-600 text-white rounded-br-xs shadow-md shadow-violet-950/20'
                    : 'bg-slate-900 text-slate-200 rounded-bl-xs border border-slate-800'
                }`}
              >
                {/* Text Message */}
                {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                {/* Voice Note Audio Component */}
                {msg.audioDuration && (
                  <div className="flex items-center gap-3 py-1 min-w-[180px]">
                    <button
                      onClick={() => playVoiceNote(msg.id, msg.audioDuration)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSender ? 'bg-white text-violet-700' : 'bg-violet-600 text-white'
                      }`}
                    >
                      {playingVoiceId === msg.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1">
                      {/* Audio frequency wave visualizer */}
                      <div className="flex items-center gap-0.5 h-6">
                        {[40, 70, 95, 60, 80, 45, 90, 75, 55, 85, 65, 50].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-150 ${
                              playingVoiceId === msg.id
                                ? 'bg-emerald-400 animate-pulse'
                                : isSender
                                ? 'bg-white/60'
                                : 'bg-slate-600'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] opacity-75 font-mono">
                        0:{msg.audioDuration.toString().padStart(2, '0')} · Opus 48kHz
                      </span>
                    </div>
                  </div>
                )}

                {/* Disappearing Message Expiration Indicator */}
                {msg.timeRemaining !== undefined && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-amber-300">
                    <Timer className="w-3 h-3 animate-spin" />
                    <span>Disappears in {msg.timeRemaining}s</span>
                  </div>
                )}

                {/* Meta details */}
                <div
                  className={`flex items-center gap-1 text-[10px] mt-1 ${
                    isSender ? 'text-violet-200 justify-end' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isSender && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Input Form / Voice Note Recorder */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
        {isRecordingVoice ? (
          <div className="flex items-center justify-between bg-rose-950/40 border border-rose-900/60 rounded-full px-4 py-2 text-rose-300 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Recording Voice Note:</span>
              <span className="font-mono font-bold">0:{recordingSeconds.toString().padStart(2, '0')}</span>
            </div>
            <button
              onClick={stopAndSendRecording}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-full text-xs shadow"
            >
              Send Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button
              type="button"
              onClick={startRecording}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Record Voice Note"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send end-to-end encrypted message..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* HD Video / Audio Call Modal Simulator */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6">
          {/* Top Encrypted Signaling Banner */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              WebRTC SFU · E2EE DTLS-SRTP Active
            </div>
            <h3 className="text-xl font-bold text-white pt-2">{activeThread.user.fullName}</h3>
            <span className="text-xs text-slate-400 font-mono">
              Call Duration: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Video or Audio Avatar Canvas */}
          <div className="flex-1 my-6 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            {showCallModal === 'video' ? (
              <img
                src={activeThread.user.avatar}
                alt="Video caller"
                className="w-full h-full object-cover brightness-75 filter blur-xs"
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={activeThread.user.avatar}
                  alt={activeThread.user.username}
                  className="w-28 h-28 rounded-full object-cover border-4 border-violet-500 shadow-2xl animate-pulse"
                />
                <span className="text-sm text-slate-400 font-medium">1080p Lossless Opus Audio</span>
              </div>
            )}

            {/* Self Video PIP if Video Call */}
            {showCallModal === 'video' && (
              <div className="absolute top-4 right-4 w-24 h-36 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-xl">
                <img
                  src={CURRENT_USER.avatar}
                  alt="Self"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Bottom Call Controls */}
          <div className="flex items-center justify-center gap-6 pb-6">
            <button
              onClick={() => setIsCallMuted(!isCallMuted)}
              className={`p-4 rounded-full transition-colors ${
                isCallMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {showCallModal === 'video' && (
              <button
                onClick={() => sound.playHeartPop()}
                className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Flip Camera"
              >
                <Camera className="w-6 h-6" />
              </button>
            )}

            <button
              onClick={() => {
                sound.playHeartPop();
                setShowCallModal(null);
              }}
              className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-950/50"
              title="End Call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
