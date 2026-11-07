import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, Camera, Link as LinkIcon, Plus, 
  Trash2, Globe, Shield, User as UserIcon, Sparkles, Image as ImageIcon 
} from 'lucide-react';
import { User, UserExternalLink } from '../../types';
import { socialStore } from '../../utils/socialStore';
import { sound } from '../../utils/audioSynth';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updated: User) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
];

const CATEGORIES = [
  'Digital Creator',
  'Visual Artist',
  'Tech Entrepreneur',
  'Music Producer & DJ',
  'Photographer',
  'Writer & Journalist',
  'Software Engineer',
  'Gaming & Esports',
  'Fashion & Stylist',
  'Fitness & Athlete',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [pronouns, setPronouns] = useState(user.pronouns || 'they/them');
  const [bio, setBio] = useState(user.bio || '');
  const [category, setCategory] = useState(user.category || 'Digital Creator');
  const [website, setWebsite] = useState(user.website || '');
  const [location, setLocation] = useState(user.location || '');
  const [professionalEmail, setProfessionalEmail] = useState(user.professionalEmail || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [coverPhoto, setCoverPhoto] = useState(user.coverPhoto || '');
  const [isProfessional, setIsProfessional] = useState(user.isProfessionalAccount ?? true);
  const [isPrivate, setIsPrivate] = useState(user.isPrivateAccount ?? false);

  // External links
  const [externalLinks, setExternalLinks] = useState<UserExternalLink[]>(user.externalLinks || []);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Custom photo URL popup
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Username validation & availability
  const isUsernameAvailable = socialStore.checkUsernameAvailability(username, user.id);
  const isUsernameValid = username.trim().length >= 3 && /^[a-zA-Z0-9_]+$/.test(username.trim());

  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    sound.playSparkle();
    const formattedUrl = newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`;
    const newLink: UserExternalLink = {
      id: 'lnk_' + Date.now().toString(36),
      title: newLinkTitle.trim(),
      url: formattedUrl,
    };
    setExternalLinks([...externalLinks, newLink]);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (linkId: string) => {
    sound.playHeartPop();
    setExternalLinks(externalLinks.filter((l) => l.id !== linkId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUsernameValid || !isUsernameAvailable) return;

    sound.playSparkle();
    const updated = socialStore.updateCurrentUser({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      pronouns: pronouns.trim(),
      bio: bio.trim(),
      category: category,
      website: website.trim(),
      externalLinks: externalLinks,
      location: location.trim(),
      professionalEmail: professionalEmail.trim(),
      phoneNumber: phoneNumber.trim(),
      avatar: avatar,
      coverPhoto: coverPhoto,
      isProfessionalAccount: isProfessional,
      isPrivateAccount: isPrivate,
    });

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              sound.playHeartPop();
              onClose();
            }}
            className="text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <h3 className="text-sm font-bold text-white">Edit Profile</h3>
          <button
            onClick={handleSubmit}
            disabled={!isUsernameValid || !isUsernameAvailable}
            className="text-xs font-bold text-violet-400 hover:text-violet-300 disabled:opacity-40"
          >
            Done
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
          {/* Avatar and Cover Photo section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group">
              <img
                src={avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-violet-500 shadow-xl"
              />
              <button
                type="button"
                onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                className="text-xs font-bold text-violet-400 hover:text-violet-300 block"
              >
                Change Profile Photo
              </button>
              <span className="text-[10px] text-slate-500">Pick from presets or enter custom URL</span>
            </div>

            {/* Presets Row */}
            <div className="flex items-center gap-2 pt-1">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playHeartPop();
                    setAvatar(preset);
                  }}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                    avatar === preset ? 'border-violet-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {showCustomAvatarInput && (
              <div className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 mt-2">
                <span className="text-[11px] text-slate-400 block">Custom Image URL</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAvatarUrl.trim()) {
                        setAvatar(customAvatarUrl.trim());
                        setShowCustomAvatarInput(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-violet-600 text-white rounded-xl font-bold text-xs"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Full Name & Username */}
          <div className="space-y-3.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <label className="text-slate-400 text-[11px] font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 text-[11px] font-semibold">Username</label>
                {username.trim() && (
                  <span className={`text-[10px] font-mono flex items-center gap-1 ${
                    isUsernameValid && isUsernameAvailable ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isUsernameValid && isUsernameAvailable ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>{!isUsernameValid ? 'Min 3 letters (a-z, 0-9, _)' : 'Already taken'}</span>
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 font-mono">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className={`w-full bg-slate-900 border rounded-xl pl-7 pr-3 py-2 text-white outline-none ${
                    isUsernameValid && isUsernameAvailable ? 'border-slate-800 focus:border-violet-500' : 'border-rose-500/60'
                  }`}
                  placeholder="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-[11px] font-semibold block mb-1">Pronouns</label>
              <input
                type="text"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500"
                placeholder="e.g. they/them, she/her, he/him"
              />
            </div>
          </div>

          {/* Bio & Category */}
          <div className="space-y-3.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 text-[11px] font-semibold">Bio</label>
                <span className={`text-[10px] font-mono ${bio.length > 150 ? 'text-rose-400' : 'text-slate-500'}`}>
                  {bio.length} / 150
                </span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500 resize-none leading-relaxed"
                placeholder="Tell the world about your creative space..."
              />
            </div>

            <div>
              <label className="text-slate-400 text-[11px] font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Links & Website */}
          <div className="space-y-3.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-slate-400 text-[11px] font-semibold flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-violet-400" />
                <span>External Links & Portfolios</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">{externalLinks.length} Links</span>
            </div>

            <div>
              <label className="text-slate-500 text-[10px] block mb-1">Primary Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500 font-mono text-[11px]"
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* List of current external links */}
            <div className="space-y-2">
              {externalLinks.map((link) => (
                <div key={link.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{link.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{link.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new link fields */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-semibold text-violet-400 block">Add New External Link</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="Link Title (e.g. YouTube Channel)"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="URL (e.g. youtube.com/@me)"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddLink}
                disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link to Profile</span>
              </button>
            </div>
          </div>

          {/* Location & Contact Information */}
          <div className="space-y-3.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-400 text-[11px] font-semibold block">Location & Contact Details</span>

            <div>
              <label className="text-slate-500 text-[10px] block mb-1">Public Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500"
                placeholder="e.g. Tokyo & Bengaluru · Earth"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-500 text-[10px] block mb-1">Collaboration Email</label>
                <input
                  type="email"
                  value={professionalEmail}
                  onChange={(e) => setProfessionalEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500 text-[11px]"
                  placeholder="collab@domain.com"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block mb-1">Direct Phone</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500 text-[11px]"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Account Type & Privacy Switches */}
          <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Professional / Creator Account</div>
                <div className="text-[10px] text-slate-400">Enables Creator Dashboard, Insights & Brand Collabs</div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfessional(!isProfessional)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  isProfessional ? 'bg-violet-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  isProfessional ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <div className="font-semibold text-white">Private Account</div>
                <div className="text-[10px] text-slate-400">Only approved followers can see your posts and reels</div>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  isPrivate ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  isPrivate ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
