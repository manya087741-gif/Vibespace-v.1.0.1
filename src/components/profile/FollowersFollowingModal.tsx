import React, { useState } from 'react';
import { X, Search, UserCheck, UserPlus, UserX, Check, Sparkles, Shield, User as UserIcon } from 'lucide-react';
import { User, FollowRequest } from '../../types';
import { socialStore } from '../../utils/socialStore';
import { sound } from '../../utils/audioSynth';

interface FollowersFollowingModalProps {
  user: User;
  initialTab?: 'followers' | 'following' | 'requests';
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

export const FollowersFollowingModal: React.FC<FollowersFollowingModalProps> = ({
  user,
  initialTab = 'followers',
  onClose,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'requests'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = socialStore.getCurrentUser();
  const isOwner = currentUser.id === user.id;

  const [followers, setFollowers] = useState<User[]>(socialStore.getFollowers(user.id));
  const [following, setFollowing] = useState<User[]>(socialStore.getFollowing(user.id));
  const [requests, setRequests] = useState<FollowRequest[]>(socialStore.getFollowRequests());

  const handleToggleFollow = (targetUser: User) => {
    sound.playHeartPop();
    const res = socialStore.toggleFollowUser(targetUser.id);
    setFollowing(socialStore.getFollowing(user.id));
    setFollowers(socialStore.getFollowers(user.id));
  };

  const handleRemoveFollower = (followerId: string) => {
    sound.playHeartPop();
    socialStore.removeFollower(followerId);
    setFollowers(socialStore.getFollowers(user.id));
  };

  const handleAcceptRequest = (requestId: string) => {
    sound.playSparkle();
    socialStore.acceptFollowRequest(requestId);
    setRequests(socialStore.getFollowRequests());
    setFollowers(socialStore.getFollowers(user.id));
  };

  const handleDeclineRequest = (requestId: string) => {
    sound.playHeartPop();
    socialStore.declineFollowRequest(requestId);
    setRequests(socialStore.getFollowRequests());
  };

  // Filter lists based on searchQuery
  const filterUsers = (list: User[]) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q)
    );
  };

  const displayedFollowers = filterUsers(followers);
  const displayedFollowing = filterUsers(following);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white font-mono">@{user.username}</span>
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs font-semibold">
          <button
            onClick={() => {
              sound.playHeartPop();
              setActiveTab('followers');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'followers'
                ? 'border-violet-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{followers.length} Followers</span>
          </button>

          <button
            onClick={() => {
              sound.playHeartPop();
              setActiveTab('following');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'following'
                ? 'border-violet-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{following.length} Following</span>
          </button>

          {isOwner && requests.length > 0 && (
            <button
              onClick={() => {
                sound.playHeartPop();
                setActiveTab('requests');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'border-amber-500 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Requests</span>
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[9px] font-bold flex items-center justify-center">
                {requests.length}
              </span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        {activeTab !== 'requests' && (
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search connections..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
          {/* TAB 1: FOLLOWERS */}
          {activeTab === 'followers' && (
            <div className="space-y-1">
              {displayedFollowers.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  {searchQuery ? 'No followers match your search.' : 'No followers yet.'}
                </div>
              ) : (
                displayedFollowers.map((follower) => {
                  const isCurrent = follower.id === currentUser.id;
                  return (
                    <div
                      key={follower.id}
                      className="p-2.5 rounded-2xl hover:bg-slate-800/60 transition-colors flex items-center justify-between group cursor-pointer"
                      onClick={() => {
                        onSelectUser(follower);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={follower.avatar}
                          alt={follower.username}
                          className="w-10 h-10 rounded-full object-cover border border-slate-800 group-hover:border-violet-500/50 transition-colors"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1">
                            <span>{follower.fullName}</span>
                            {follower.verified && <span className="text-violet-400 text-[10px]">✓</span>}
                          </div>
                          <span className="text-[11px] text-slate-400">@{follower.username}</span>
                        </div>
                      </div>

                      {!isCurrent && (
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleFollow(follower)}
                            className={`px-3 py-1 rounded-xl font-bold text-xs transition-all ${
                              follower.isFollowing
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm'
                            }`}
                          >
                            {follower.isFollowing ? 'Following' : 'Follow'}
                          </button>

                          {isOwner && (
                            <button
                              onClick={() => handleRemoveFollower(follower.id)}
                              className="px-2 py-1 text-[11px] text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                              title="Remove Follower"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: FOLLOWING */}
          {activeTab === 'following' && (
            <div className="space-y-1">
              {displayedFollowing.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  {searchQuery ? 'No following matches your search.' : 'Not following anyone yet.'}
                </div>
              ) : (
                displayedFollowing.map((followedUser) => {
                  const isCurrent = followedUser.id === currentUser.id;
                  return (
                    <div
                      key={followedUser.id}
                      className="p-2.5 rounded-2xl hover:bg-slate-800/60 transition-colors flex items-center justify-between group cursor-pointer"
                      onClick={() => {
                        onSelectUser(followedUser);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={followedUser.avatar}
                          alt={followedUser.username}
                          className="w-10 h-10 rounded-full object-cover border border-slate-800 group-hover:border-violet-500/50 transition-colors"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1">
                            <span>{followedUser.fullName}</span>
                            {followedUser.verified && <span className="text-violet-400 text-[10px]">✓</span>}
                          </div>
                          <span className="text-[11px] text-slate-400">@{followedUser.username}</span>
                        </div>
                      </div>

                      {!isCurrent && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleFollow(followedUser)}
                            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                          >
                            Following
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: FOLLOW REQUESTS */}
          {activeTab === 'requests' && isOwner && (
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 block px-1">
                People requesting to follow your private account:
              </span>

              {requests.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No pending follow requests.
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.user.avatar}
                        alt={req.user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1">
                          <span>{req.user.fullName}</span>
                          <span className="text-[10px] text-slate-500 font-normal">· {req.timestamp}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">@{req.user.username}</span>
                        {req.user.bio && (
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{req.user.bio}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-sm"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
