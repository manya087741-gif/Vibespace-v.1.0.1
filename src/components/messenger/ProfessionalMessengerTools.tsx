import React, { useState } from 'react';
import {
  X,
  Zap,
  Bot,
  Users,
  BarChart2,
  Tag,
  Shield,
  Plus,
  Check,
  Clock,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Trash2,
  Sparkles,
  Smartphone,
  EyeOff,
} from 'lucide-react';
import {
  SavedReply,
  AutomationRule,
  TeamMember,
  InternalNote,
  ScreenshotPrivacySettings,
  ChatThread,
} from '../../types';
import { sound } from '../../utils/audioSynth';

export const DEFAULT_CHAT_LABELS = [
  'New Customer',
  'Important',
  'Potential Buyer',
  'Order Received',
  'Payment Pending',
  'Payment Completed',
  'Collaboration',
  'Brand Deal',
  'Influencer',
  'VIP Customer',
  'Follow Up',
  'Completed',
];

export const DEFAULT_SAVED_REPLIES: SavedReply[] = [
  {
    id: 'sr_1',
    shortcut: '/hello',
    title: 'Welcome Greeting',
    message: 'Hello! Welcome to our page. How can we help you today? ✨',
    category: 'welcome',
  },
  {
    id: 'sr_2',
    shortcut: '/collab',
    title: 'Brand Collaboration Inquiry',
    message: 'Thanks for reaching out! Please share your campaign brief, deliverables, and timeline. Our team will review it within 24 hours.',
    category: 'collab',
  },
  {
    id: 'sr_3',
    shortcut: '/pricing',
    title: 'Rate Card & Pricing',
    message: 'Our standard Reel + Story package starts at ₹25,000. Let us know your budget and goals for a custom quote!',
    category: 'pricing',
  },
  {
    id: 'sr_4',
    shortcut: '/thanks',
    title: 'Thank You Note',
    message: 'Thank you so much for your order and support! Reach out anytime if you need assistance. 🙌',
    category: 'thanks',
  },
  {
    id: 'sr_5',
    shortcut: '/support',
    title: 'Customer Support',
    message: 'We have received your support request. Please share your Order ID so we can resolve this right away.',
    category: 'support',
  },
];

export const DEFAULT_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'auto_1',
    type: 'welcome',
    title: 'Automatic Welcome Message',
    enabled: true,
    response: 'Hey there! 👋 Thanks for messaging us on VibeSpace. We usually reply within 15 minutes.',
    schedule: 'Instant on first message',
  },
  {
    id: 'auto_2',
    type: 'away',
    title: 'Away / Out of Office Message',
    enabled: false,
    response: 'We are currently away (Business Hours: 10 AM – 7 PM IST). We will get back to you first thing tomorrow!',
    schedule: '7:00 PM – 10:00 AM IST',
  },
  {
    id: 'auto_3',
    type: 'keyword',
    title: 'Keyword Auto-Reply ("price" / "collab")',
    enabled: true,
    triggerKeyword: 'price, collab, rate',
    response: 'For collaborations & pricing, please email business@vibespace.net or type /pricing!',
    schedule: 'Always active',
  },
  {
    id: 'auto_4',
    type: 'faq',
    title: 'FAQ: Order & Shipping Status',
    enabled: true,
    triggerKeyword: 'order, track, delivery',
    response: 'You can track your order anytime from your Profile > Orders tab, or share your Order ID here.',
    schedule: 'Always active',
  },
];

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm_1',
    name: 'Alex Thorne (Owner)',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    isOnline: true,
  },
  {
    id: 'tm_2',
    name: 'Riya Sharma (Support)',
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    isOnline: true,
  },
  {
    id: 'tm_3',
    name: 'Kabir Mehta (Brand Mgr)',
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    isOnline: false,
  },
];

/* 1. SAVED REPLIES MODAL */
export const SavedRepliesModal: React.FC<{
  replies: SavedReply[];
  onClose: () => void;
  onSelectReply?: (text: string) => void;
  onAddReply: (reply: SavedReply) => void;
  onDeleteReply: (id: string) => void;
}> = ({ replies, onClose, onSelectReply, onAddReply, onDeleteReply }) => {
  const [shortcut, setShortcut] = useState('/');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortcut.trim() || !title.trim() || !message.trim()) return;
    sound.playSparkle();
    onAddReply({
      id: 'sr_' + Date.now().toString(36),
      shortcut: shortcut.startsWith('/') ? shortcut.trim() : `/${shortcut.trim()}`,
      title: title.trim(),
      message: message.trim(),
      category: 'support',
    });
    setShortcut('/');
    setTitle('');
    setMessage('');
    setShowAdd(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Saved Replies & Shortcuts</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="px-2.5 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {showAdd && (
            <form onSubmit={handleCreate} className="p-3.5 rounded-2xl bg-slate-950 border border-violet-500/40 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={shortcut}
                  onChange={(e) => setShortcut(e.target.value)}
                  placeholder="/shortcut"
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Reply Title"
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your quick reply message..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold"
              >
                Save Quick Reply
              </button>
            </form>
          )}

          {replies.map((r) => (
            <div
              key={r.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-violet-600/20 text-violet-300 font-mono font-bold text-[11px]">
                    {r.shortcut}
                  </span>
                  <span className="font-bold text-white">{r.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {onSelectReply && (
                    <button
                      onClick={() => {
                        sound.playSparkle();
                        onSelectReply(r.message);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px]"
                    >
                      Insert
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteReply(r.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{r.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* 2. AUTOMATION RULES MODAL */
export const AutomationRulesModal: React.FC<{
  rules: AutomationRule[];
  onClose: () => void;
  onToggleRule: (id: string) => void;
}> = ({ rules, onClose, onToggleRule }) => (
  <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Automated Messaging & FAQ</h3>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        <p className="text-[11px] text-slate-400">
          User-controlled automation. No promotional messages are sent without explicit user permission.
        </p>
        {rules.map((rule) => (
          <div key={rule.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">{rule.title}</span>
                {rule.schedule && (
                  <span className="text-[10px] text-slate-400 font-mono">{rule.schedule}</span>
                )}
              </div>
              <button
                onClick={() => {
                  sound.playHeartPop();
                  onToggleRule(rule.id);
                }}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  rule.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    rule.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {rule.triggerKeyword && (
              <div className="text-[10px] font-mono text-violet-300">
                Keywords: {rule.triggerKeyword}
              </div>
            )}
            <p className="text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
              {rule.response}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* 3. TEAM INBOX & INTERNAL NOTES MODAL */
export const TeamInboxModal: React.FC<{
  thread: ChatThread;
  teamMembers: TeamMember[];
  onClose: () => void;
  onAssignMember: (member: TeamMember) => void;
  onAddInternalNote: (text: string) => void;
  onToggleResolve: () => void;
}> = ({ thread, teamMembers, onClose, onAssignMember, onAddInternalNote, onToggleResolve }) => {
  const [noteText, setNoteText] = useState('');

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    sound.playSparkle();
    onAddInternalNote(noteText.trim());
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Team Inbox & Internal Notes</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Conversation Status */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Conversation Status</span>
              <span className="text-[10px] text-slate-400">
                {thread.conversationStatus === 'closed' ? 'Resolved & Closed' : 'Open & Active'}
              </span>
            </div>
            <button
              onClick={() => {
                sound.playHeartPop();
                onToggleResolve();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                thread.conversationStatus === 'closed'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {thread.conversationStatus === 'closed' ? 'Reopen Chat' : 'Mark Resolved ✓'}
            </button>
          </div>

          {/* Assign Team Member */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Assign Conversation Owner
            </span>
            <div className="space-y-1.5">
              {teamMembers.map((m) => {
                const isAssigned = thread.assignedTo?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      sound.playHeartPop();
                      onAssignMember(m);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                      isAssigned
                        ? 'bg-violet-950/40 border-violet-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-semibold text-white block">{m.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{m.role}</span>
                      </div>
                    </div>
                    {isAssigned && <Check className="w-4 h-4 text-violet-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Internal Notes (Visible only to Team Members) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Internal Team Notes (Hidden from Customer)
              </span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(!thread.internalNotes || thread.internalNotes.length === 0) ? (
                <p className="text-[11px] text-slate-500 italic">No internal notes yet.</p>
              ) : (
                thread.internalNotes.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                    <div className="flex justify-between text-[10px] text-amber-300 font-semibold">
                      <span>{n.authorName}</span>
                      <span className="font-mono text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-200">{n.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleNoteSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add private team note..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 4. MESSAGING ANALYTICS DASHBOARD MODAL */
export const MessagingAnalyticsModal: React.FC<{
  threads: ChatThread[];
  onClose: () => void;
}> = ({ threads, onClose }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const totalMessages = threads.reduce((acc, t) => acc + t.messages.length, 0);
  const unreadCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);
  const resolvedCount = threads.filter((t) => t.conversationStatus === 'closed').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Messaging Analytics</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          <div className="flex gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 py-1.5 rounded-lg capitalize font-semibold ${
                  period === p ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Messages</span>
              <span className="text-lg font-extrabold text-white font-mono">{totalMessages}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Avg Response Time</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">12m 40s</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Response Rate</span>
              <span className="text-lg font-extrabold text-violet-400 font-mono">96.4%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Unread / Pending</span>
              <span className="text-lg font-extrabold text-amber-400 font-mono">{unreadCount}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Resolved Chats</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{resolvedCount}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Brand Collabs</span>
              <span className="text-lg font-extrabold text-fuchsia-400 font-mono">8 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 5. CHAT LABELS MODAL */
export const ChatLabelsModal: React.FC<{
  selectedLabels: string[];
  availableLabels: string[];
  onClose: () => void;
  onToggleLabel: (label: string) => void;
  onCreateLabel: (label: string) => void;
}> = ({ selectedLabels, availableLabels, onClose, onToggleLabel, onCreateLabel }) => {
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    sound.playSparkle();
    onCreateLabel(newLabel.trim());
    setNewLabel('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Professional Chat Labels</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Create custom label..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {availableLabels.map((lbl) => {
              const active = selectedLabels.includes(lbl);
              return (
                <button
                  key={lbl}
                  onClick={() => {
                    sound.playHeartPop();
                    onToggleLabel(lbl);
                  }}
                  className={`px-3 py-1.5 rounded-xl border font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lbl}</span>
                  {active && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 6. SCREENSHOT PRIVACY SETTINGS MODAL */
export const ScreenshotPrivacyModal: React.FC<{
  settings: ScreenshotPrivacySettings;
  onClose: () => void;
  onUpdate: (updates: Partial<ScreenshotPrivacySettings>) => void;
}> = ({ settings, onClose, onUpdate }) => (
  <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Screenshot Privacy & Alerts</h3>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-800">
          {(
            [
              {
                key: 'screenshotNotifications',
                title: 'Screenshot Notifications',
                desc: 'Notify sender when a screenshot is taken in protected chats',
              },
              {
                key: 'screenRecordingAlerts',
                title: 'Screen Recording Alerts',
                desc: 'Detect and alert when screen recording is active',
              },
              {
                key: 'disappearingMessagePrivacy',
                title: 'Disappearing Message Privacy',
                desc: 'Alert sender if Vanish Mode messages are captured',
              },
              {
                key: 'viewOncePhotoPrivacy',
                title: 'View Once Photo Privacy',
                desc: 'Protect View Once photos with capture alerts',
              },
              {
                key: 'viewOnceVideoPrivacy',
                title: 'View Once Video Privacy',
                desc: 'Protect View Once videos with capture alerts',
              },
              {
                key: 'blockProtectedScreenshots',
                title: 'Block Protected Screenshots',
                desc: 'Enable FLAG_SECURE / window protection where supported',
              },
            ] as const
          ).map((item) => (
            <div key={item.key} className="p-3.5 flex items-center justify-between">
              <div className="pr-3">
                <span className="font-semibold text-white block">{item.title}</span>
                <span className="text-[10px] text-slate-400">{item.desc}</span>
              </div>
              <button
                onClick={() => {
                  sound.playHeartPop();
                  onUpdate({ [item.key]: !settings[item.key] });
                }}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                  settings[item.key] ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5 text-[11px] text-amber-200/90">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4" />
            <span>Platform & OS Technical Limitations</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            <strong>Android:</strong> Uses <code className="text-amber-300">FLAG_SECURE</code> to block screenshots & screen recordings at the OS window level.
            <br />
            <strong>iOS:</strong> Uses <code className="text-amber-300">UIScreen.isCaptured</code> & <code className="text-amber-300">userDidTakeScreenshotNotification</code> for instant alerts.
            <br />
            <strong>Web / Unsupported Devices:</strong> Browsers cannot 100% block OS-level screenshots; capture events are logged and alerted where supported.
          </p>
        </div>
      </div>
    </div>
  </div>
);
