'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchNoteById, updateNote as updateNoteApi, deleteNote as deleteNoteApi } from '../../services/noteApi';
import { Note } from '../../types/note';

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load note
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNoteById(id);
        setNote(data);
      } catch (err) {
        console.error('Failed to load note:', err);
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
      updateNoteApi(id, {
        title: note.title,
        content: note.content
      }).catch(err => console.error('Auto-save failed:', err));
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
      <div className="min-h-screen bg-[var(--background)] text-white px-4 sm:px-6 py-8 sm:py-10 flex items-center justify-center">
        <div className="text-base sm:text-lg text-[var(--muted-foreground)]">Loading...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-white px-4 sm:px-6 py-8 sm:py-10 flex items-center justify-center">
        <div className="text-base sm:text-lg text-[var(--destructive)]">Note not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Top - Back and Delete buttons */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-[var(--card)]/20"
          >
            ← Back
          </button>

          <button
            onClick={handleDelete}
            className="text-lg sm:text-xl text-[var(--destructive)] hover:opacity-70 transition-opacity p-2 hover:bg-[var(--destructive)]/10 rounded-lg"
            title="Delete note"
          >
            🗑️
          </button>
        </div>

        {/* Updated timestamp */}
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-4">
          Updated: {new Date(note.updated_at).toDateString()}
        </p>

        {/* Card container with rounded corners */}
        <div className="bg-[var(--card)]/30 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 sm:p-8">
          {/* Title */}
          <input
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            placeholder="Note title..."
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-transparent outline-none w-full text-[var(--foreground)] placeholder-[var(--muted-foreground)] mb-6 sm:mb-8 leading-tight"
          />

          {/* Content - seamless, no divider */}
          <textarea
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            placeholder="Start typing..."
            className="w-full min-h-96 bg-transparent outline-none text-base sm:text-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] resize-none leading-relaxed"
          />

          {/* Footer - Created date */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[var(--border)]/50">
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              Created: {new Date(note.created_at).toDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
