'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '../types/note';
import { formatDate } from '../utils/dateFormatter';

interface NoteCardProps {
  note: Note;
  viewMode?: 'grid' | 'list';
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode = 'grid' }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/note/${note._id}`);
  };

  // 🟩 LIST MODE (แนวนอน ชัดมาก)
  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="group cursor-pointer w-full flex items-center justify-between gap-4 px-5 py-4 bg-[var(--card)]/50 backdrop-blur-md border border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:shadow-md transition-all"
      >
        {/* Left */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[var(--card-foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
            {note.title || 'Untitled'}
          </h3>

          <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2 break-words">
            {note.content || 'No content'}
          </p>
        </div>

        {/* Right */}
        <div className="text-xs text-[var(--muted-foreground)] whitespace-nowrap">
          {formatDate(note.updated_at)}
        </div>
      </div>
    );
  }

  // 🟦 GRID MODE (การ์ดใหญ่)
  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer h-full flex flex-col justify-between p-5 sm:p-6 bg-[var(--card)]/60 backdrop-blur-md border border-[var(--border)] rounded-2xl hover:border-[var(--primary)] hover:shadow-xl transition-all relative overflow-hidden"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-lg sm:text-xl font-bold text-[var(--card-foreground)] line-clamp-2 mb-3 group-hover:text-[var(--primary)] transition-colors">
          {note.title || 'Untitled'}
        </h3>

        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 flex-1">
          {note.content || 'No content'}
        </p>

        <div className="mt-4 pt-3 border-t border-[var(--border)]/50 text-xs text-[var(--muted-foreground)]">
          {formatDate(note.updated_at)}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;