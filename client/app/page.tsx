'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNote as createNoteApi } from './services/noteApi';
import { fetchNotes } from './services/noteApi';
import { Note } from './types/note';
import { NoteCard } from './components/NoteCard';
import { SkeletonCard } from './components/Skeleton';

type ViewMode = 'grid' | 'list';

/** 
 * Home page - displays all notes
 */
export default function Home() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load notes';
      setError(message);
      console.error('Load notes error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      const newNote = await createNoteApi({
        title: 'Untitled',
        content: ''
      });
      router.push(`/note/${newNote._id}`);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--card)]/60 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Title and count */}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--card-foreground)] truncate">
                Secure Note
              </h1>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>

            {/* Right side - View toggle and create button */}
            <div className="flex items-center gap-8 sm:gap-10 flex-shrink-0">
              {/* View toggle */}
              <div className="flex bg-[var(--secondary)] rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:bg-[var(--muted)] ${
                    viewMode === 'grid'
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--muted-foreground)]'
                  }`}
                  title="Grid view"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:bg-[var(--muted)] ${
                    viewMode === 'list'
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--muted-foreground)]'
                  }`}
                  title="List view"
                >
                  ☰
                </button>
              </div>

              {/* Create button */}
              <button
                onClick={handleCreateNote}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--primary)] hover:bg-[#c25110] text-[var(--primary-foreground)] rounded-full border-none hover:opacity-95 transition-all font-medium shadow-md hover:shadow-lg text-2xl sm:text-3xl leading-none flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)] rounded-lg">
            <p className="text-[var(--destructive)] font-medium">⚠️ {error}</p>
            <button
              onClick={loadNotes}
              className="mt-3 px-4 py-1 text-sm bg-[var(--destructive)] hover:bg-[#ad1433] text-[var(--destructive-foreground)] rounded-full hover:opacity-95 transition-all"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Loading State - Skeleton */}
        {isLoading ? (
          <div
            key={`loading-${viewMode}`}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-7'
                : 'space-y-4 sm:space-y-5'
            }
          >
            <SkeletonCard count={6} />
          </div>
        ) : notes.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center min-h-80">
            <div className="text-center px-4">
              <div className="text-5xl sm:text-6xl mb-4">📭</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--card-foreground)] mb-2">
                No notes yet
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)] mb-6">
                Create your first note to get started
              </p>
              <button
                onClick={handleCreateNote}
                className="px-6 py-2 bg-[var(--primary)] hover:bg-[#c25110] text-[var(--primary-foreground)] rounded-full hover:opacity-95 transition-all font-medium"
              >
                Create First Note
              </button>
            </div>
          </div>
        ) : (
          /* Notes Grid/List */
          <div
            key={viewMode}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 animate-fade-in'
                : 'space-y-4 sm:space-y-5 animate-fade-in'
            }
          >
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card)]/50 backdrop-blur-md border-t border-[var(--border)]">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center text-xs sm:text-sm text-[var(--muted-foreground)]">
          <p>© 2026 Secure Note(Web Applications Project). Implemented & Designed by Teenoi1</p>
        </div>
      </footer>
    </div>
  );
}

