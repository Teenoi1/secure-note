'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchNotes, deleteNote as deleteNoteApi } from './services/noteApi';
import { createNote as createNoteApi } from './services/noteApi';
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

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      setError('');
      await deleteNoteApi(id);
      setNotes(prev => prev.filter((note) => note._id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete note';
      setError(message);
      console.error('Delete note error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--card)]/50 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Title and count */}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--card-foreground)] truncate">
                📝 My Notes
              </h1>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>

            {/* Right side - View toggle and create button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* View toggle */}
              <div className="flex bg-[var(--secondary)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                  title="Grid view"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                  title="List view"
                >
                  ☰
                </button>
              </div>

              {/* Create button */}
              <button
                onClick={handleCreateNote}
                className="px-4 sm:px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl hover:opacity-90 transition-opacity font-medium shadow-md hover:shadow-lg whitespace-nowrap text-sm sm:text-base"
              >
                + New
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)] rounded-lg">
            <p className="text-[var(--destructive)] font-medium">⚠️ {error}</p>
            <button
              onClick={loadNotes}
              className="mt-3 px-4 py-1 text-sm bg-[var(--destructive)] text-[var(--destructive-foreground)] rounded hover:opacity-90 transition-opacity"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Loading State - Skeleton */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6' : 'space-y-3 sm:space-y-4'}>
            <SkeletonCard count={6} />
          </div>
        ) : notes.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center min-h-96">
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
                className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Create First Note
              </button>
            </div>
          </div>
        ) : (
          /* Notes Grid/List */
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 animate-fade-in' : 'space-y-3 sm:space-y-4 animate-fade-in'}>
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDeleteNote}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card)]/50 backdrop-blur-md border-t border-[var(--border)]">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center text-xs sm:text-sm text-[var(--muted-foreground)]">
          <p>© 2026 Note App. Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

