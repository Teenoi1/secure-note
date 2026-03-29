'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '../types/note';
import { formatDate, formatRelativeTime } from '../utils/dateFormatter';

interface NoteCardProps {
  note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/note/${note._id}`);
  };

  return (
  <div
    onClick={handleCardClick}
    className="group cursor-pointer w-full flex items-center justify-between gap-4 px-5 py-4 bg-[var(--card)]/50 backdrop-blur-md border border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:shadow-md transition-all overflow-hidden"
  >
    {/* Left */}
    <div className="flex-1 min-w-0 space-y-3">
      {/* Title + time */}
      <div className=" gap-4 flex items-center p-4 min-w-0">
        <h3 className="text-base font-semibold text-[var(--card-foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
          {note.title || 'Untitled'}
        </h3>

        <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap flex-shrink-0">
          ({formatRelativeTime(note.updated_at)})
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
        {note.content || ''}
      </p>
    </div>
  </div>
);
};

export default NoteCard;