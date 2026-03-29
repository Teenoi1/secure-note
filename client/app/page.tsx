'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNote as createNoteApi } from './services/noteApi';
import { fetchNotes } from './services/noteApi';
import { Note } from './types/note';
import { NoteCard } from './components/NoteCard';
import { SkeletonCard } from './components/Skeleton';

type SortType = 'title' | 'updated_at' | 'created_at';

/** 
 * Home page - displays all notes
 */
export default function Home() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('updated_at');

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

  const getSortedNotes = () => {
    const sorted = [...notes];
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => (a.title || 'Untitled').localeCompare(b.title || 'Untitled'));
      case 'created_at':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'updated_at':
      default:
        return sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
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
                📓 Secure Note
              </h1>
              <p className="text-lg sm:text-xl font-medium text-[var(--card-foreground)] mt-2 truncate">
                A simple and secure note-taking app
              </p>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>

            {/* Right side - Sort and create button */}
            {/* ปุ่มจะอยู่ในแถวเดียวกับ แถวที่แสดงค่าจำนวน notes ทั้งหมด*/}
            
            <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 ">
              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl bg-[#1a1a1a] hover:bg-[#333333] text-[var(--muted-foreground)] border border-[var(--border)] transition-all cursor-pointer"
              >
                <option value="updated_at">Sort: Updated</option>
                <option value="created_at">Sort: Created</option>
                <option value="title">Sort: Title</option>
              </select>

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

        {/* Loading State - Skeleton */}
        {isLoading ? (
          <div className="space-y-6 sm:space-y-8">
            <SkeletonCard count={6} />
          </div>
        ) : notes.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center min-h-80">
            <div className="text-center px-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--card-foreground)] mb-2">
                No notes Found
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)] mb-6">
                Let's create your first note! Click the button below to get started.
              </p>
              <button
                onClick={handleCreateNote}
                className="px-6 py-2 bg-[var(--primary)] hover:bg-[#c25110] text-[var(--primary-foreground)] rounded-full hover:opacity-95 transition-all font-medium"
              >
                + Create Note
              </button>
            </div>
          </div>
        ) : (
          /* Notes List */
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {getSortedNotes().map((note) => (
              <NoteCard
                key={note._id}
                note={note}
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

