import React, { useState, useRef } from 'react';
import { 
  X, Image as ImageIcon, Film, Music, MapPin, AtSign, 
  Hash, Users, Lock, Sparkles, Check, Plus, Trash2, Globe 
} from 'lucide-react';
import { Post } from '../types';
import { CURRENT_USER, MOCK_USERS } from '../data/mockData';
import { socialStore } from '../utils/socialStore';
import { sound } from '../utils/audioSynth';

interface PostCreatorModalProps {
  onClose: () => void;
  onPostCreated?: (newPost: Post) => void;
}

const PRESET_PHOTOS = [
  '/src/assets/images/vibespace_feed_cyberpunk_1793677134128.jpg',
  '/src/assets/images/vibespace_feed_design_1793677137017.jpg',
  '/src/assets/images/vibespace_story_portrait_1793677134555.jpg',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
];

const PRESET_LOCATIONS = ['Tokyo, Japan 🗼', 'Kyoto, Japan ⛩️', 'New York, USA 🗽', 'Mumbai, India 🕌', 'Berlin, Germany 🇩🇪'];

const SUGGESTED_TAGS = ['#VibeSpace', '#DesignSystem', '#Cyberpunk', '#Photography', '#Minimalism', '#NextGenSocial'];

export const PostCreatorModal: React.FC<PostCreatorModalProps> = ({ onClose, onPostCreated }) => {
  // Post Type: 'media' (Photo / Carousel / Video) vs 'text'
  const [postType, setPostType] = useState<'media' | 'text'>('media');
  
  // Media state
  const [mediaUrls, setMediaUrls] = useState<string[]>([PRESET_PHOTOS[0]]);
  const [activeMediaIdx, setActiveMediaIdx] = useState<number>(0);
  const [mediaFormat, setMediaFormat] = useState<'image' | 'video' | 'carousel'>('image');
  
  // Content state
  const [caption, setCaption] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['#VibeSpace']);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [showMentionPicker, setShowMentionPicker] = useState<boolean>(false);
  
  // Music state
  const [includeMusic, setIncludeMusic] = useState<boolean>(false);
  const [musicTrack, setMusicTrack] = useState({ title: 'Neon Skyline', artist: 'Aria Thorne' });

  // Privacy state
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      sound.playSparkle();
      const newUrls: string[] = [];
      Array.from(files).forEach((file) => {
        const isVideo = file.type.startsWith('video');
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newUrls.push(event.target.result as string);
            if (newUrls.length === files.length) {
              setMediaUrls((prev) => [...prev, ...newUrls]);
              setMediaFormat(newUrls.length > 1 || mediaUrls.length > 0 ? 'carousel' : isVideo ? 'video' : 'image');
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (idx: number) => {
    sound.playHeartPop();
    const updated = mediaUrls.filter((_, i) => i !== idx);
    setMediaUrls(updated);
    if (activeMediaIdx >= updated.length) {
      setActiveMediaIdx(Math.max(0, updated.length - 1));
    }
    setMediaFormat(updated.length > 1 ? 'carousel' : 'image');
  };

  const toggleTag = (tag: string) => {
    sound.playHeartPop();
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleMention = (username: string) => {
    sound.playHeartPop();
    setTaggedUsers((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
    setShowMentionPicker(false);
  };

  const handlePublish = () => {
    if (postType === 'media' && mediaUrls.length === 0) return;
    if (postType === 'text' && !caption.trim()) return;

    sound.playSparkle();

    const newPost: Post = {
      id: 'post_usr_' + Date.now().toString(36),
      user: CURRENT_USER,
      mediaUrls: postType === 'text' ? [] : mediaUrls,
      mediaType: postType === 'text' ? 'image' : mediaUrls.length > 1 ? 'carousel' : mediaFormat,
      caption: caption.trim() || 'Shared a moment on VibeSpace.',
      tags: selectedTags,
      location: selectedLocation || undefined,
      likesCount: 0,
      commentsCount: 0,
      comments: [],
      hasLiked: false,
      hasBookmarked: false,
      audioTrack: includeMusic ? musicTrack : undefined,
      timestamp: 'Just now',
      isCloseFriendsOnly: isPrivate,
    };

    socialStore.addPost(newPost);
    if (onPostCreated) onPostCreated(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
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
            <h3 className="text-sm font-bold text-white">Create New Post</h3>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sound.playHeartPop();
                setPostType('media');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                postType === 'media' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Media / Carousel
            </button>
            <button
              onClick={() => {
                sound.playHeartPop();
                setPostType('text');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                postType === 'text' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Text Post
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.fullName}
                className="w-10 h-10 rounded-full object-cover border border-violet-500/40"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{CURRENT_USER.fullName}</span>
                  <span className="text-violet-400">✓</span>
                </div>
                <div className="text-[11px] text-slate-400">@{CURRENT_USER.username}</div>
              </div>
            </div>

            {/* Audience Privacy Toggle */}
            <button
              onClick={() => {
                sound.playHeartPop();
                setIsPrivate(!isPrivate);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isPrivate
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-950 text-slate-300 border-slate-800'
              }`}
            >
              {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5 text-violet-400" />}
              <span>{isPrivate ? 'Close Friends Only' : 'Public'}</span>
            </button>
          </div>

          {/* MEDIA PREVIEW & SELECTOR */}
          {postType === 'media' && (
            <div className="space-y-3">
              {/* Active Media Frame */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                {mediaUrls.length > 0 ? (
                  mediaFormat === 'video' ? (
                    <video
                      src={mediaUrls[activeMediaIdx] || mediaUrls[0]}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={mediaUrls[activeMediaIdx] || mediaUrls[0]}
                      alt="Selected media"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-500">
                    <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
                    <p className="text-xs">No media selected yet</p>
                  </div>
                )}

                {/* Multiple carousel indicator */}
                {mediaUrls.length > 1 && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                    {activeMediaIdx + 1} / {mediaUrls.length}
                  </div>
                )}
              </div>

              {/* Thumbnails Row + Add More Files */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {mediaUrls.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveMediaIdx(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                      activeMediaIdx === i ? 'border-violet-500 scale-105' : 'border-slate-800 opacity-70'
                    }`}
                  >
                    <img src={url} alt="Thumb" className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia(i);
                      }}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600/90 text-white rounded-full flex items-center justify-center text-[10px]"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* File Upload button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-700 hover:border-violet-500 bg-slate-950/60 flex flex-col items-center justify-center text-slate-400 hover:text-white shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Add File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Preset Fast Picker */}
                {PRESET_PHOTOS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playHeartPop();
                      setMediaUrls((prev) => [...prev, preset]);
                      setMediaFormat('carousel');
                    }}
                    className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-800 hover:border-violet-400 opacity-60 hover:opacity-100 transition-opacity"
                    title="Add preset photo to carousel"
                  >
                    <img src={preset} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Caption Textarea */}
          <div className="space-y-1.5">
            <textarea
              placeholder={postType === 'text' ? 'What’s on your mind? Write a thought, announcement, or question...' : 'Write an inspiring caption... use #tags and @mentions'}
              rows={postType === 'text' ? 5 : 3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-violet-500 placeholder-slate-500 resize-none leading-relaxed"
            />
          </div>

          {/* Music Attachment Toggle */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-fuchsia-600/20 text-fuchsia-400">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Attach Soundtrack</div>
                <div className="text-[10px] text-slate-400">{musicTrack.title} · {musicTrack.artist}</div>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playSparkle();
                setIncludeMusic(!includeMusic);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                includeMusic ? 'bg-fuchsia-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {includeMusic ? 'Attached' : 'Add'}
            </button>
          </div>

          {/* Location & Mentions bar */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Location selector */}
            <div className="relative">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="truncate">{selectedLocation || 'Add Location'}</span>
              </button>

              {showLocationPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1">
                  {PRESET_LOCATIONS.map((loc) => (
                    <div
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setShowLocationPicker(false);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-800 text-[11px] text-slate-200 cursor-pointer"
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Mention selector */}
            <div className="relative">
              <button
                onClick={() => setShowMentionPicker(!showMentionPicker)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <AtSign className="w-4 h-4 text-violet-400 shrink-0" />
                <span className="truncate">
                  {taggedUsers.length > 0 ? `@${taggedUsers.join(', @')}` : 'Tag Friends'}
                </span>
              </button>

              {showMentionPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 max-h-40 overflow-y-auto">
                  {MOCK_USERS.map((usr) => (
                    <div
                      key={usr.id}
                      onClick={() => toggleMention(usr.username)}
                      className="p-2 rounded-lg hover:bg-slate-800 text-[11px] text-slate-200 cursor-pointer flex items-center justify-between"
                    >
                      <span>@{usr.username}</span>
                      {taggedUsers.includes(usr.username) && <Check className="w-3.5 h-3.5 text-violet-400" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hashtag Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Hash className="w-3 h-3 text-violet-400" /> Suggested Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">120Hz E2EE Media Pipeline</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 text-white font-bold text-xs shadow-lg transition-all"
            >
              Publish Post
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
