import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  TrendingUp,
  User as UserIcon,
  Film,
  Hash,
  Music,
  MapPin,
  Heart,
  Sparkles,
  Check,
  Play,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { MOCK_USERS, MOCK_POSTS, MOCK_REELS, CURRENT_USER } from '../data/mockData';
import { User, Post, Reel } from '../types';
import { sound } from '../utils/audioSynth';

interface SearchExploreHubProps {
  onSelectReel?: (reelId: string) => void;
  onSelectUser?: (user: User) => void;
  onSelectTag?: (tag: string) => void;
  watermarkEnabled?: boolean;
}

export const SearchExploreHub: React.FC<SearchExploreHubProps> = ({
  onSelectReel,
  onSelectUser,
  onSelectTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'accounts' | 'reels' | 'tags' | 'audio' | 'places'>('all');
  const [followedUserIds, setFollowedUserIds] = useState<Record<string, boolean>>({
    usr_01: true,
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '#CyberpunkRealism',
    'elena_design',
    'Tokyo Night',
    '#ArchitectureDaily',
  ]);
  const [previewMedia, setPreviewMedia] = useState<{
    url: string;
    title: string;
    author: string;
    type: 'post' | 'reel';
  } | null>(null);

  const toggleFollow = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playHeartPop();
    setFollowedUserIds((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSelectRecent = (term: string) => {
    sound.playHeartPop();
    setSearchQuery(term);
  };

  const clearRecent = () => {
    sound.playHeartPop();
    setRecentSearches([]);
  };

  // Filtered Accounts
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_USERS;
    const q = searchQuery.toLowerCase().replace('@', '');
    return MOCK_USERS.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q) ||
        (u.bio && u.bio.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Filtered Reels
  const filteredReels = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_REELS;
    const q = searchQuery.toLowerCase();
    return MOCK_REELS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.audioTrack.title.toLowerCase().includes(q) ||
        r.user.username.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_POSTS;
    const q = searchQuery.toLowerCase();
    return MOCK_POSTS.filter(
      (p) =>
        p.caption.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        p.user.username.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered Tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    MOCK_POSTS.forEach((p) => p.tags.forEach((t) => set.add(t)));
    MOCK_REELS.forEach((r) => r.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return allTags;
    const q = searchQuery.toLowerCase();
    return allTags.filter((t) => t.toLowerCase().includes(q));
  }, [searchQuery, allTags]);

  // Filtered Audio Tracks
  const allAudioTracks = useMemo(() => {
    const list: { title: string; artist: string; count: number }[] = [];
    MOCK_POSTS.forEach((p) => {
      if (p.audioTrack) list.push({ ...p.audioTrack, count: p.likesCount });
    });
    MOCK_REELS.forEach((r) => {
      list.push({ ...r.audioTrack, count: r.likesCount });
    });
    return list;
  }, []);

  const filteredAudio = useMemo(() => {
    if (!searchQuery.trim()) return allAudioTracks;
    const q = searchQuery.toLowerCase();
    return allAudioTracks.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)
    );
  }, [searchQuery, allAudioTracks]);

  // Locations
  const allLocations = useMemo(() => {
    const locs: { name: string; count: number }[] = [
      { name: 'Shinjuku, Tokyo', count: 14200 },
      { name: 'Kyoto Prefecture', count: 8930 },
      { name: 'SoHo, New York', count: 15410 },
      { name: 'Berlin Mitte, Germany', count: 9100 },
      { name: 'Seoul, Gangnam', count: 22400 },
    ];
    if (!searchQuery.trim()) return locs;
    const q = searchQuery.toLowerCase();
    return locs.filter((l) => l.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="pb-24 max-w-xl mx-auto w-full">
      {/* Search Header Bar */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md px-4 pt-3 pb-2.5 border-b border-slate-900 space-y-2.5">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators, reels, tags, sound, places..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 text-slate-400 hover:text-white p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(
            [
              { id: 'all', label: 'Top' },
              { id: 'accounts', label: 'Accounts' },
              { id: 'reels', label: 'Reels' },
              { id: 'tags', label: 'Tags' },
              { id: 'audio', label: 'Audio' },
              { id: 'places', label: 'Places' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playHeartPop();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? 'bg-violet-600 text-white border-violet-500 shadow-xs'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-5">
        {/* Recent Searches (shown when search is idle) */}
        {!hasSearch && recentSearches.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-violet-400" /> Recent & Trending Searches
              </span>
              <button
                onClick={clearRecent}
                className="text-[11px] text-slate-400 hover:text-rose-400"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectRecent(term)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACCOUNTS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'accounts') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-violet-400" /> Creators & Accounts
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {filteredUsers.length} found
              </span>
            </div>

            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isFollowed = followedUserIds[user.id];
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      sound.playHeartPop();
                      if (onSelectUser) onSelectUser(user);
                    }}
                    className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-11 h-11 rounded-full object-cover border border-violet-500/40"
                        />
                        {user.isCloseFriend && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {user.fullName}
                          </span>
                          {user.verified && <span className="text-violet-400 text-xs">✓</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          @{user.username} · {user.followersCount.toLocaleString()} followers
                        </div>
                        {user.bio && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleFollow(user.id, e)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                        isFollowed
                          ? 'bg-slate-800 text-slate-300 border border-slate-700'
                          : 'bg-violet-600 hover:bg-violet-500 text-white shadow-xs'
                      }`}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REELS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'reels') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-rose-400" /> Short Videos & 120Hz Reels
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {filteredReels.length} available
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {filteredReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => {
                    sound.playHeartPop();
                    if (onSelectReel) {
                      onSelectReel(reel.id);
                    } else {
                      setPreviewMedia({
                        url: reel.videoPoster,
                        title: reel.title,
                        author: `@${reel.user.username}`,
                        type: 'reel',
                      });
                    }
                  }}
                  className="aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden relative group cursor-pointer border border-slate-800"
                >
                  <img
                    src={reel.videoPoster}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 flex flex-col justify-between p-2">
                    <span className="self-end text-[10px] font-mono bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.5 rounded">
                      {reel.duration}
                    </span>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-white font-medium drop-shadow-sm">
                        <Play className="w-3 h-3 fill-current" />
                        <span className="font-mono">{(reel.likesCount / 1000).toFixed(1)}k</span>
                      </div>
                      <span className="text-[10px] text-white/90 line-clamp-1 font-semibold">
                        @{reel.user.username}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HASHTAGS & TOPICS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'tags') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-teal-400" /> Trending Tags & Communities
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {filteredTags.map((tag) => (
                <div
                  key={tag}
                  onClick={() => {
                    sound.playHeartPop();
                    if (onSelectTag) onSelectTag(tag);
                  }}
                  className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-violet-400 hover:underline">
                      {tag}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Encrypted Public Stream
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIO TRACKS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'audio') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" /> Lossless Audio & Music
              </span>
            </div>

            <div className="space-y-2">
              {filteredAudio.map((track, idx) => (
                <div
                  key={idx}
                  onClick={() => sound.playHeartPop()}
                  className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{track.title}</span>
                      <span className="text-[11px] text-slate-400">{track.artist}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded">
                    48kHz Master
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLACES / LOCATIONS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'places') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Discover by Location
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allLocations.map((loc) => (
                <div
                  key={loc.name}
                  onClick={() => sound.playHeartPop()}
                  className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-200">{loc.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {loc.count.toLocaleString()} posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISUAL DISCOVER BENTO GRID (Explore Feed) */}
        {!hasSearch && activeCategory === 'all' && (
          <div className="space-y-3 pt-4 border-t border-slate-900">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Explore Trending Gallery
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    sound.playHeartPop();
                    setPreviewMedia({
                      url: post.mediaUrls[0],
                      title: post.caption,
                      author: `@${post.user.username}`,
                      type: 'post',
                    });
                  }}
                  className="aspect-square bg-slate-900 rounded-2xl overflow-hidden relative group cursor-pointer border border-slate-800"
                >
                  <img
                    src={post.mediaUrls[0]}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                    <span className="text-xs font-bold text-white">{post.user.username}</span>
                    <span className="text-[11px] text-slate-300 line-clamp-1">{post.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-square w-full bg-black">
              <img
                src={previewMedia.url}
                alt={previewMedia.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 space-y-2">
              <span className="text-xs font-bold text-violet-400">{previewMedia.author}</span>
              <p className="text-xs text-slate-200 leading-relaxed">{previewMedia.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
