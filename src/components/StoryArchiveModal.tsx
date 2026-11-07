import React from 'react';
import { Story } from '../types';
import { X, Clock, Calendar, Share2, Plus, Sparkles, Eye, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audioSynth';

interface StoryArchiveModalProps {
  archivedStories: Story[];
  onClose: () => void;
  onReShareStory: (story: Story) => void;
  onAddStoryToHighlight: (story: Story) => void;
}

export const StoryArchiveModal: React.FC<StoryArchiveModalProps> = ({
  archivedStories,
  onClose,
  onReShareStory,
  onAddStoryToHighlight,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-600/20 text-violet-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Stories Archive</h3>
              <span className="text-[11px] text-slate-400">Past 24-hour stories automatically saved</span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playHeartPop();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Archive Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {archivedStories.length === 0 ? (
            <div className="py-12 text-center space-y-2 text-slate-400">
              <Clock className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No archived stories yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {archivedStories.map((story) => (
                <div
                  key={story.id}
                  className="relative group rounded-2xl overflow-hidden aspect-[9/16] bg-slate-950 border border-slate-800 shadow-md flex flex-col justify-between p-2"
                >
                  <img
                    src={story.mediaUrl}
                    alt={story.caption || 'Archived story'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />

                  {/* Date badge */}
                  <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-violet-400" />
                    <span>{story.timestamp}</span>
                  </div>

                  {/* Actions overlay on hover / bottom */}
                  <div className="relative z-10 space-y-1">
                    <div className="text-[10px] text-slate-300 truncate">
                      {story.viewersCount} views
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          sound.playSparkle();
                          onReShareStory(story);
                        }}
                        className="flex-1 py-1 px-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Re-share to today's story"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Re-share</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playSparkle();
                          onAddStoryToHighlight(story);
                        }}
                        className="py-1 px-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg text-amber-300 text-[10px] font-bold transition-colors"
                        title="Add to Highlight"
                      >
                        + Highlight
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-500">
          Only you can see your archived stories unless you share them.
        </div>
      </div>
    </div>
  );
};
