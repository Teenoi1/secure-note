'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchNoteById, updateNote as updateNoteApi, deleteNote as deleteNoteApi } from '../../services/noteApi';
import { Note } from '../../types/note';
import { Skeleton } from '../../components/Skeleton';
import { formatDate, formatRelativeTime  } from '../../utils/dateFormatter';
import { time } from 'console';

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  // Load note
  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const data = await fetchNoteById(id);
        setNote(data);
      } catch (err) {
        console.error('Failed to load note:', err);
        const message = err instanceof Error ? err.message : 'Failed to load note.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  // Auto-save every 800ms when note changes
  useEffect(() => {
    if (!note) return;

    const timeout = setTimeout(() => {
      setAutoSaveStatus('saving');
      updateNoteApi(id, {
        title: note.title,
        content: note.content,
      })
        .then(() => {
          setAutoSaveStatus('idle');
          setError(null);
        })
        .catch((err) => {
          console.error('Auto-save failed:', err);
          const message = err instanceof Error ? err.message : 'Auto-save failed.';
          setAutoSaveStatus('error');
          setError(message);
        });
    }, 800);

    return () => clearTimeout(timeout);
  }, [note, id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteNoteApi(id);
      router.push('/');
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton variant="line" className="h-8 w-24 rounded-full" />
            <Skeleton variant="line" className="h-8 w-10 rounded-full" />
          </div>
          <Skeleton variant="line" className="h-4 w-40" />
          <div className="bg-[var(--card)]/30 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 sm:p-8 space-y-6">
            <Skeleton variant="text" className="h-10 w-3/4" />
            <div className="space-y-3">
              <Skeleton variant="line" className="w-full" />
              <Skeleton variant="line" className="w-11/12" />
              <Skeleton variant="line" className="w-10/12" />
              <Skeleton variant="line" className="w-9/12" />
            </div>
            <div className="pt-4 border-t border-[var(--border)]/50">
              <Skeleton variant="line" className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-white px-4 sm:px-6 py-8 sm:py-10 flex items-center justify-center">
        <div className="text-base sm:text-lg text-[var(--destructive)]">
          {error || 'Note not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)]">
        {error && (
          <div className="mb-4 rounded-xl border border-[var(--destructive)]/60 bg-[var(--destructive)]/10 px-4 py-3 text-xs sm:text-sm text-[var(--destructive)]">
            {error}
          </div>
        )}
        {/* Top - Back and Delete buttons */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all rounded-xl bg-[#1a1a1a] hover:bg-[#333333] border-none"
          >
            ← Back
          </button>

          <button
            onClick={handleDelete}
            className="text-lg sm:text-xl text-[var(--destructive)] transition-all px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-[#333333] rounded-2xl bg-[#1a1a1a] border-none"
            title="Delete note"
          >
            🗑️
          </button>
        </div>

        {/* Updated timestamp */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Updated: {formatDate(note.updated_at)}, {formatRelativeTime(note.updated_at)}
          </p>
          {autoSaveStatus === 'saving' && (
            <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)] animate-pulse">
              Saving...
            </span>
          )}
          {autoSaveStatus === 'error' && (
            <span className="text-[10px] sm:text-xs text-[var(--destructive)]">
              Auto-save failed
            </span>
          )}
        </div>

        {/* Card container with rounded corners */} 
        <div className="bg-[var(--card)]/30 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 sm:p-8 flex-1 flex flex-col">
          {/* Title */}
          <input
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            placeholder="Note title..."
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-transparent outline-none border-none focus:outline-none focus:ring-0 w-full text-[var(--foreground)] placeholder-[var(--muted-foreground)] mb-10 sm:mb-12 leading-tight break-words"          />

          {/* Content - seamless, fills remaining space */}
          <textarea
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            placeholder="Start typing..."
            className="w-full flex-1 min-h-[50vh] bg-transparent outline-none border-none focus:outline-none focus:ring-0 text-base sm:text-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] resize-none leading-relaxed"
          />

          {/* Footer - Created date */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[var(--border)]/50">
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] text-center">
              Created: {formatDate(note.created_at)}, {formatRelativeTime(note.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
