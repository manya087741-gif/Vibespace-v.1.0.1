import React from 'react';
import { X, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { User } from '../../types';
import { sound } from '../../utils/audioSynth';

interface ProfileContactModalProps {
  user: User;
  onClose: () => void;
  onOpenMessage?: () => void;
}

export const ProfileContactModal: React.FC<ProfileContactModalProps> = ({
  user,
  onClose,
  onOpenMessage,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white">Contact {user.fullName}</h3>
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

        {/* Contact Options */}
        <div className="p-4 space-y-2.5">
          {/* E2EE Messenger Direct */}
          {onOpenMessage && (
            <button
              onClick={() => {
                sound.playSparkle();
                onOpenMessage();
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-violet-600/20 border border-violet-500/40 hover:bg-violet-600/30 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-600 rounded-xl text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">VibeSpace E2EE Messenger</span>
                  <span className="text-[10px] text-violet-300">Fast confidential direct chat</span>
                </div>
              </div>
              <Send className="w-3.5 h-3.5 text-violet-400" />
            </button>
          )}

          {/* Email */}
          {user.professionalEmail && (
            <a
              href={`mailto:${user.professionalEmail}`}
              onClick={() => sound.playSparkle()}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-xl text-slate-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Professional Inquiries</span>
                  <span className="text-[10px] text-slate-400 font-mono">{user.professionalEmail}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Email</span>
            </a>
          )}

          {/* Phone */}
          {user.phoneNumber && (
            <a
              href={`tel:${user.phoneNumber}`}
              onClick={() => sound.playSparkle()}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-xl text-slate-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Direct Voice / Phone</span>
                  <span className="text-[10px] text-slate-400 font-mono">{user.phoneNumber}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Call</span>
            </a>
          )}

          {/* Location */}
          {user.location && (
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 bg-slate-800/80 rounded-xl text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Creator Location</span>
                <span className="text-[10px] text-slate-400">{user.location}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
