import React from 'react';
import { X, ExternalLink, Globe, Youtube, Github, Link as LinkIcon, Compass } from 'lucide-react';
import { UserExternalLink } from '../../types';
import { sound } from '../../utils/audioSynth';

interface ExternalLinksModalProps {
  links: UserExternalLink[];
  website?: string;
  username: string;
  onClose: () => void;
}

export const ExternalLinksModal: React.FC<ExternalLinksModalProps> = ({
  links,
  website,
  username,
  onClose,
}) => {
  const getIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return <Youtube className="w-4 h-4 text-rose-500" />;
    }
    if (url.includes('github.com')) {
      return <Github className="w-4 h-4 text-slate-300" />;
    }
    return <Globe className="w-4 h-4 text-violet-400" />;
  };

  const allLinks = [
    ...(website ? [{ id: 'web_main', title: 'Main Website', url: website }] : []),
    ...links,
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white">Links from @{username}</h3>
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

        {/* Links list */}
        <div className="p-4 space-y-2 overflow-y-auto">
          {allLinks.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No links provided yet.
            </div>
          ) : (
            allLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playSparkle()}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-800/50 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-white">
                    {getIcon(link.url)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-violet-300 transition-colors">
                      {link.title}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[200px] block font-mono">
                      {link.url.replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                </div>

                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors" />
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
