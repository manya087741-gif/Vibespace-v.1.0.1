import React from 'react';
import { X, Bell, Radio, Users, Heart, MessageSquare, Sparkles, Tv, Check } from 'lucide-react';
import { NotificationItem } from '../types';
import { sound } from '../utils/audioSynth';

interface NotificationsDrawerProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onSelectNotification?: (notif: NotificationItem) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  onClose,
  onSelectNotification,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center sm:justify-end p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl overflow-hidden mt-12 sm:mr-4">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Notifications</h3>
          </div>

          <button
            onClick={() => {
              sound.playHeartPop();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No new notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  sound.playHeartPop();
                  if (onSelectNotification) onSelectNotification(notif);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  notif.isRead
                    ? 'bg-slate-950/60 border-slate-800/80'
                    : 'bg-violet-950/30 border-violet-500/40 shadow-sm'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={notif.user.avatar}
                    alt={notif.user.username}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-950">
                    {notif.type === 'live' && <Radio className="w-3 h-3 text-rose-500" />}
                    {notif.type === 'channel_milestone' && <Tv className="w-3 h-3 text-violet-400" />}
                    {notif.type === 'subscribe' && <Users className="w-3 h-3 text-emerald-400" />}
                    {notif.type === 'like' && <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />}
                    {notif.type === 'comment' && <MessageSquare className="w-3 h-3 text-amber-400" />}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xs text-white leading-snug">
                    <strong className="font-bold">@{notif.user.username}</strong>{' '}
                    <span className="text-slate-300">{notif.message}</span>
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    {notif.timestamp}
                  </span>
                </div>

                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-1" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center">
          <span className="text-[11px] text-slate-500 font-mono">Real-time Push Alerts Active</span>
        </div>

      </div>
    </div>
  );
};
