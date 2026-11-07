import React, { useState } from 'react';
import { StoryHighlight, Story } from '../types';
import { Plus, X, Bookmark, Check, Trash2, Edit2, Play } from 'lucide-react';
import { sound } from '../utils/audioSynth';
import { CURRENT_USER } from '../data/mockData';

interface StoryHighlightsBarProps {
  highlights: StoryHighlight[];
  onSelectHighlight: (highlight: StoryHighlight) => void;
  onCreateHighlight: (title: string, coverUrl: string, stories: Story[]) => void;
  onDeleteHighlight?: (highlightId: string) => void;
  availableStories: Story[];
}

export const StoryHighlightsBar: React.FC<StoryHighlightsBarProps> = ({
  highlights,
  onSelectHighlight,
  onCreateHighlight,
  onDeleteHighlight,
  availableStories,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [highlightTitle, setHighlightTitle] = useState('');
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
  const [selectedCoverUrl, setSelectedCoverUrl] = useState('');

  const handleOpenCreateModal = () => {
    sound.playHeartPop();
    setHighlightTitle('');
    setSelectedStoryIds(availableStories.length > 0 ? [availableStories[0].id] : []);
    setSelectedCoverUrl(availableStories.length > 0 ? availableStories[0].mediaUrl : '');
    setShowCreateModal(true);
  };

  const toggleSelectStory = (story: Story) => {
    sound.playHeartPop();
    setSelectedStoryIds((prev) => {
      if (prev.includes(story.id)) {
        return prev.filter((id) => id !== story.id);
      } else {
        if (!selectedCoverUrl) setSelectedCoverUrl(story.mediaUrl);
        return [...prev, story.id];
      }
    });
  };

  const handleSaveHighlight = () => {
    if (!highlightTitle.trim() || selectedStoryIds.length === 0) return;
    sound.playSparkle();

    const selectedStoriesList = availableStories.filter((s) => selectedStoryIds.includes(s.id));
    onCreateHighlight(
      highlightTitle.trim(),
      selectedCoverUrl || selectedStoriesList[0]?.mediaUrl || '',
      selectedStoriesList
    );

    setShowCreateModal(false);
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-bold text-slate-300">Story Highlights</span>
        <span className="text-[10px] text-slate-500 font-mono">{highlights.length} collections</span>
      </div>

      {/* Horizontal Highlights Rail */}
      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
        {/* + New Highlight Button */}
        <div
          onClick={handleOpenCreateModal}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-700 group-hover:border-violet-500 bg-slate-900/60 flex items-center justify-center transition-all group-hover:scale-105">
            <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-400" />
          </div>
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-white truncate max-w-[64px]">
            New
          </span>
        </div>

        {/* Highlight Circles */}
        {highlights.map((hl) => (
          <div
            key={hl.id}
            onClick={() => {
              sound.playHeartPop();
              onSelectHighlight(hl);
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-slate-700 via-slate-600 to-slate-800 group-hover:from-violet-500 group-hover:to-pink-500 transition-all group-hover:scale-105 shadow-md">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-950 p-0.5">
                <img
                  src={hl.coverUrl}
                  alt={hl.title}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate max-w-[68px]">
              {hl.title}
            </span>
          </div>
        ))}
      </div>

      {/* CREATE STORY HIGHLIGHT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-white">Create Story Highlight</span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title Input */}
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">Highlight Name</label>
              <input
                type="text"
                placeholder="e.g. Tokyo 2026 🗼"
                value={highlightTitle}
                onChange={(e) => setHighlightTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
              />
            </div>

            {/* Select Stories from Active & Archive */}
            <div>
              <label className="text-slate-400 text-[11px] block mb-2">
                Select Stories ({selectedStoryIds.length} chosen)
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto no-scrollbar">
                {availableStories.map((story) => {
                  const isSelected = selectedStoryIds.includes(story.id);
                  return (
                    <div
                      key={story.id}
                      onClick={() => toggleSelectStory(story)}
                      className={`relative aspect-[9/16] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-violet-500 ring-2 ring-violet-500/30' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img
                        src={story.mediaUrl || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400'}
                        alt="Story"
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={!highlightTitle.trim() || selectedStoryIds.length === 0}
                onClick={handleSaveHighlight}
                className="px-4 py-1.5 rounded-xl text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold transition-colors"
              >
                Add Highlight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
