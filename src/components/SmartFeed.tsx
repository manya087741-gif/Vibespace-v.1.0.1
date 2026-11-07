import React, { useState, useEffect } from 'react';
import { Post, Story, LiveStream, Channel, User } from '../types';
import { MOCK_POSTS, MOCK_STORIES, CURRENT_USER } from '../data/mockData';
import { 
  Heart, MessageCircle, Send, Bookmark, Music, MoreHorizontal, 
  ShieldCheck, Check, Sparkles, Tv, Users, Trash2 
} from 'lucide-react';
import { DynamicWatermark } from './DynamicWatermark';
import { LiveFeedSection } from './LiveFeedSection';
import { sound } from '../utils/audioSynth';
import { socialStore } from '../utils/socialStore';

interface SmartFeedProps {
  posts?: Post[];
  stories?: Story[];
  liveStreams?: LiveStream[];
  channels?: Channel[];
  onOpenStory: (index: number) => void;
  onOpenCreateStory?: () => void;
  onSelectLiveStream?: (stream: LiveStream) => void;
  onGoLive?: () => void;
  onSelectChannel?: (channel: Channel) => void;
  onDeletePost?: (postId: string) => void;
  onSelectUser?: (user: User) => void;
  watermarkEnabled: boolean;
  watermarkOpacity: number;
}

export const SmartFeed: React.FC<SmartFeedProps> = ({
  posts: externalPosts = MOCK_POSTS,
  stories = MOCK_STORIES,
  liveStreams,
  channels,
  onOpenStory,
  onOpenCreateStory,
  onSelectLiveStream,
  onGoLive,
  onSelectChannel,
  onDeletePost,
  onSelectUser,
  watermarkEnabled,
  watermarkOpacity,
}) => {
  const [feedMode, setFeedMode] = useState<'for_you' | 'following' | 'trending'>('for_you');
  const [posts, setPosts] = useState<Post[]>(externalPosts);

  useEffect(() => {
    setPosts(externalPosts);
  }, [externalPosts]);
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({
    post_02: true,
  });
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({
    post_02: true,
  });
  const [doubleTapHeartPostId, setDoubleTapHeartPostId] = useState<string | null>(null);
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({});

  const handleLikeToggle = (postId: string) => {
    sound.playHeartPop();
    const isLiked = !likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: isLiked }));
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleDoubleTap = (postId: string) => {
    if (!likedPosts[postId]) {
      handleLikeToggle(postId);
    } else {
      sound.playHeartPop();
    }
    setDoubleTapHeartPostId(postId);
    setTimeout(() => {
      setDoubleTapHeartPostId(null);
    }, 800);
  };

  const handleBookmarkToggle = (postId: string) => {
    sound.playHeartPop();
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentsPost) return;

    sound.playHeartPop();
    const newComment = {
      id: Math.random().toString(),
      username: CURRENT_USER.username,
      avatar: CURRENT_USER.avatar,
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === activeCommentsPost.id) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );

    setActiveCommentsPost((prev) =>
      prev ? { ...prev, commentsCount: prev.commentsCount + 1, comments: [newComment, ...prev.comments] } : null
    );
    setNewCommentText('');
  };

  const handleCarouselNext = (postId: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCarouselIndices((prev) => ({
      ...prev,
      [postId]: Math.min((prev[postId] || 0) + 1, max - 1),
    }));
  };

  const handleCarouselPrev = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCarouselIndices((prev) => ({
      ...prev,
      [postId]: Math.max((prev[postId] || 0) - 1, 0),
    }));
  };

  return (
    <div className="pb-24 max-w-xl mx-auto w-full">
      {/* Mobile Feed Top Bar with App Icon & Brand */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-slate-950 border-b border-slate-900/60">
        <div className="flex items-center gap-2.5">
          <img
            src="/app-icon.png"
            alt="VibeSpace"
            className="w-7 h-7 rounded-xl object-cover shadow-sm ring-1 ring-violet-500/40"
          />
          <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
            VibeSpace
          </span>
        </div>
        <div className="text-[11px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-semibold">120Hz Feed</span>
        </div>
      </div>

      {/* Top Segmented Controls: For You / Following / Trending */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-4 py-2 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800 w-full justify-between sm:justify-start sm:w-auto">
          <button
            onClick={() => setFeedMode('for_you')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              feedMode === 'for_you'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setFeedMode('following')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              feedMode === 'following'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setFeedMode('trending')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              feedMode === 'trending'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trending
          </button>
        </div>
      </div>

      {/* Stories Rail */}
      <div className="px-4 py-3.5 overflow-x-auto no-scrollbar border-b border-slate-900/80 flex items-center gap-4">
        {/* Your Story Avatar */}
        {(() => {
          const myStoryIndex = stories.findIndex((s) => s.user.id === CURRENT_USER.id);
          const hasMyStory = myStoryIndex !== -1;
          const myStory = hasMyStory ? stories[myStoryIndex] : null;

          return (
            <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className="relative">
                <div
                  onClick={() => {
                    sound.playHeartPop();
                    if (hasMyStory) {
                      onOpenStory(myStoryIndex);
                    } else if (onOpenCreateStory) {
                      onOpenCreateStory();
                    }
                  }}
                  className={`p-[2.5px] rounded-full transition-transform group-hover:scale-105 ${
                    hasMyStory
                      ? myStory?.isCloseFriends
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-300'
                        : 'bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400'
                      : 'border-2 border-dashed border-slate-700 group-hover:border-violet-500'
                  }`}
                >
                  <div className="p-0.5 bg-slate-950 rounded-full">
                    <img
                      src={CURRENT_USER.avatar}
                      alt={CURRENT_USER.username}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* + Add Story Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playSparkle();
                    if (onOpenCreateStory) onOpenCreateStory();
                  }}
                  className="absolute bottom-0 right-0 w-5 h-5 bg-violet-600 hover:bg-violet-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold shadow-md transition-transform hover:scale-110 active:scale-95"
                  title="Create Story"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200">
                {hasMyStory ? 'Your Story' : 'Add Story'}
              </span>
            </div>
          );
        })()}

        {/* Other Creators' Stories - Grouped by unique user */}
        {(() => {
          // Find first story of each creator (excluding current user)
          const seenUsers = new Set<string>();
          const otherCreatorStories: { story: Story; firstIndex: number; count: number }[] = [];

          stories.forEach((st, idx) => {
            if (st.user.id !== CURRENT_USER.id) {
              if (!seenUsers.has(st.user.id)) {
                seenUsers.add(st.user.id);
                const count = stories.filter((s) => s.user.id === st.user.id).length;
                otherCreatorStories.push({ story: st, firstIndex: idx, count });
              }
            }
          });

          return otherCreatorStories.map(({ story, firstIndex, count }) => (
            <div
              key={story.id}
              onClick={() => {
                sound.playHeartPop();
                onOpenStory(firstIndex);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div
                className={`p-[2.5px] rounded-full transition-transform group-hover:scale-105 ${
                  story.isCloseFriends
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-300'
                    : 'bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400'
                }`}
              >
                <div className="p-0.5 bg-slate-950 rounded-full">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate max-w-[68px]">
                {story.user.username}
              </span>
            </div>
          ));
        })()}
      </div>

      {/* Live Now Rail */}
      {liveStreams && liveStreams.length > 0 && onSelectLiveStream && onGoLive && (
        <LiveFeedSection
          streams={liveStreams}
          onSelectStream={onSelectLiveStream}
          onGoLive={onGoLive}
        />
      )}

      {/* Channels Showcase Rail */}
      {channels && channels.length > 0 && onSelectChannel && (
        <div className="py-2.5 px-4 border-b border-slate-900/80 bg-slate-950/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-violet-400" />
              <span>Channels to Follow</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1K+ Creators</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
            {channels.map((ch) => (
              <div
                key={ch.id}
                onClick={() => {
                  sound.playHeartPop();
                  onSelectChannel(ch);
                }}
                className="w-40 shrink-0 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 cursor-pointer flex flex-col items-center text-center space-y-1.5 transition-all group"
              >
                <img
                  src={ch.avatar}
                  alt={ch.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-violet-500/40 group-hover:scale-105 transition-transform"
                />
                <div className="w-full">
                  <div className="text-xs font-bold text-white truncate">{ch.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {(ch.subscribersCount / 1000).toFixed(1)}K subs
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playSparkle();
                    socialStore.toggleSubscribeChannel(ch.id);
                  }}
                  className={`w-full py-1 rounded-xl text-[10px] font-bold transition-colors ${
                    ch.isSubscribed
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-white text-slate-950 hover:bg-slate-200'
                  }`}
                >
                  {ch.isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feed Posts Stream */}
      <div className="divide-y divide-slate-900">
        {posts.map((post) => {
          const isLiked = likedPosts[post.id];
          const isBookmarked = bookmarkedPosts[post.id];
          const carouselIndex = carouselIndices[post.id] || 0;
          const currentMediaUrl = post.mediaUrls[carouselIndex] || post.mediaUrls[0];

          return (
            <article key={post.id} className="py-4">
              {/* Post Header */}
              <div className="px-4 flex items-center justify-between mb-3">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => {
                    sound.playHeartPop();
                    if (onSelectUser) onSelectUser(post.user);
                  }}
                >
                  <div className="p-0.5 bg-gradient-to-tr from-violet-500 to-indigo-500 rounded-full group-hover:scale-105 transition-transform">
                    <img
                      src={post.user.avatar}
                      alt={post.user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-100 group-hover:text-violet-300 cursor-pointer transition-colors">
                        {post.user.username}
                      </span>
                      {post.user.verified && (
                        <span className="text-violet-400 text-xs">✓</span>
                      )}
                      {post.isCloseFriendsOnly && (
                        <span className="text-[10px] text-emerald-400 font-medium ml-1">
                          · Close Friends
                        </span>
                      )}
                    </div>
                    {post.location && (
                      <span className="text-[11px] text-slate-400 block -mt-0.5">
                        {post.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{post.timestamp}</span>
                  {post.user.id === CURRENT_USER.id && onDeletePost && (
                    <button
                      onClick={() => {
                        sound.playHeartPop();
                        onDeletePost(post.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button className="text-slate-400 hover:text-slate-200 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Audio Track Pill if present */}
              {post.audioTrack && (
                <div className="px-4 pb-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                    <Music className="w-3 h-3 text-fuchsia-400 animate-pulse" />
                    <span className="font-semibold text-white">{post.audioTrack.title}</span>
                    <span className="text-slate-400">· {post.audioTrack.artist}</span>
                  </div>
                </div>
              )}

              {/* Media Viewport or Text Post Card */}
              {post.mediaUrls.length > 0 ? (
                <div
                  className="relative bg-slate-900 overflow-hidden cursor-pointer select-none group aspect-square sm:aspect-4/3 w-full"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                >
                  <img
                    src={currentMediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Dynamic Tamper-Evident Watermark */}
                  <DynamicWatermark enabled={watermarkEnabled} opacity={watermarkOpacity} />

                  {/* Double Tap Big Heart Animation */}
                  {doubleTapHeartPostId === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 duration-200">
                      <Heart className="w-24 h-24 text-rose-500 fill-current drop-shadow-2xl scale-125" />
                    </div>
                  )}

                  {/* Multi-Media Carousel Controls */}
                  {post.mediaUrls.length > 1 && (
                    <>
                      {carouselIndex > 0 && (
                        <button
                          onClick={(e) => handleCarouselPrev(post.id, e)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm backdrop-blur-xs hover:bg-black/80"
                        >
                          ‹
                        </button>
                      )}
                      {carouselIndex < post.mediaUrls.length - 1 && (
                        <button
                          onClick={(e) => handleCarouselNext(post.id, post.mediaUrls.length, e)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm backdrop-blur-xs hover:bg-black/80"
                        >
                          ›
                        </button>
                      )}
                      {/* Carousel Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-xs">
                        {post.mediaUrls.map((_, dotIdx) => (
                          <div
                            key={dotIdx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              dotIdx === carouselIndex ? 'w-4 bg-white' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div
                  className="p-8 bg-gradient-to-br from-violet-950/40 via-purple-950/30 to-slate-950 border-y border-slate-900 text-center flex items-center justify-center min-h-[180px] cursor-pointer"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                >
                  <p className="text-sm font-bold text-white leading-relaxed max-w-md">
                    “{post.caption}”
                  </p>
                </div>
              )}

              {/* Action Bar (Like, Comment, Share, Bookmark) */}
              <div className="px-4 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLikeToggle(post.id)}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-rose-500 transition-colors group"
                  >
                    <Heart
                      className={`w-6 h-6 transition-transform group-active:scale-125 ${
                        isLiked ? 'text-rose-500 fill-current' : ''
                      }`}
                    />
                    <span className="text-xs font-semibold tabular-nums text-slate-200">
                      {post.likesCount.toLocaleString()}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveCommentsPost(post)}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-xs font-semibold tabular-nums text-slate-200">
                      {post.commentsCount.toLocaleString()}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playHeartPop();
                      navigator.clipboard?.writeText(window.location.href);
                    }}
                    className="text-slate-300 hover:text-white transition-colors"
                    title="Copy E2EE Link"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => handleBookmarkToggle(post.id)}
                  className="text-slate-300 hover:text-violet-400 transition-colors"
                >
                  <Bookmark
                    className={`w-6 h-6 ${isBookmarked ? 'text-violet-400 fill-current' : ''}`}
                  />
                </button>
              </div>

              {/* Caption and Audio Track */}
              <div className="px-4 pt-2.5 space-y-1.5">
                <p className="text-xs text-slate-200 leading-relaxed">
                  <span className="font-semibold text-white mr-1.5">{post.user.username}</span>
                  {post.caption}
                </p>

                {/* Hashtags (Clean typography without pills) */}
                <div className="flex flex-wrap gap-2 text-xs text-violet-400 font-medium">
                  {post.tags.map((tag) => (
                    <span key={tag} className="hover:underline cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Audio Track Badge */}
                {post.audioTrack && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <Music className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                    <span className="font-medium text-slate-300">{post.audioTrack.title}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.audioTrack.artist}</span>
                  </div>
                )}

                {/* View Comments Trigger */}
                {post.comments.length > 0 && (
                  <button
                    onClick={() => setActiveCommentsPost(post)}
                    className="text-xs text-slate-400 hover:text-slate-200 block pt-1 font-medium"
                  >
                    View all {post.commentsCount} encrypted comments
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Comments Drawer Modal */}
      {activeCommentsPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Encrypted Comments</h3>
                <span className="text-[11px] text-slate-400">
                  {activeCommentsPost.commentsCount} thoughts on @{activeCommentsPost.user.username}
                </span>
              </div>
              <button
                onClick={() => setActiveCommentsPost(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeCommentsPost.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 text-xs">
                  <img
                    src={comment.avatar}
                    alt={comment.username}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{comment.username}</span>
                      <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{comment.text}</p>
                  </div>
                  <button className="text-slate-500 hover:text-rose-400 text-xs shrink-0 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </button>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.username}
                className="w-7 h-7 rounded-full object-cover"
              />
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={`Comment as ${CURRENT_USER.username}...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold rounded-full transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
