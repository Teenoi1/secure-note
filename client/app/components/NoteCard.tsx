'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '../types/note';
import { formatRelativeTime } from '../utils/dateFormatter';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, viewMode = 'grid' }) => {
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note._id);
  };

  const handleCardClick = () => {
    router.push(`/note/${note._id}`);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="group cursor-pointer p-4 sm:p-5 bg-[var(--card)]/30 backdrop-blur-md border border-[var(--border)] rounded-xl hover:border-[var(--primary)] transition-all hover:shadow-lg"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--card-foreground)] mb-2 truncate group-hover:text-[var(--primary)] transition-colors">
              {note.title}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] truncate mb-2">
              {note.content}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {formatRelativeTime(note.updated_at)}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="flex-shrink-0 p-2 text-[var(--destructive)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--destructive)]/10 rounded-lg"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer h-full flex flex-col transition-all hover:shadow-lg hover:scale-[1.02] bg-[var(--card)]/30 backdrop-blur-md border border-[var(--border)] rounded-2xl hover:border-[var(--primary)] p-5 sm:p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--card-foreground)] mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
          {note.title}
        </h3>

        <p className="text-sm sm:text-base text-[var(--muted-foreground)] mb-4 line-clamp-3 flex-1">
          {note.content}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]/50 gap-2">
          <span className="text-xs text-[var(--muted-foreground)]">
            {formatRelativeTime(note.updated_at)}
          </span>

          <button
            onClick={handleDelete}
            className="flex-shrink-0 p-2 rounded-lg text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
