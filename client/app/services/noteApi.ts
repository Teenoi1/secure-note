import { Note, CreateNoteInput, UpdateNoteInput } from '../types/note';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || '';

console.log('API_BASE_URL:', API_BASE_URL);
console.log("SECRET_KEY exists:", !!SECRET_KEY);

/**
 * Fetch all notes from backend
 */
export const fetchNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET_KEY}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let message = 'Failed to fetch notes';

      if (response.status === 401) {
        message = 'Session expired or unauthorized. Please check your secret key.';
      } else if (response.status === 429) {
        message = 'You are sending requests too quickly. Please wait a moment and try again.';
      } else if (response.status >= 500) {
        message = 'Server is currently unavailable. Please try again in a moment.';
      }

      throw new Error(message);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

/**
 * Get a single note by ID
 */
export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET_KEY}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let message = 'Failed to fetch note';

      if (response.status === 401) {
        message = 'Session expired or unauthorized. Please check your secret key.';
      } else if (response.status === 404) {
        message = 'Note not found.';
      } else if (response.status === 429) {
        message = 'You are sending requests too quickly. Please wait a moment and try again.';
      } else if (response.status >= 500) {
        message = 'Server is currently unavailable. Please try again in a moment.';
      }

      throw new Error(message);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

/**
 * Create a new note
 */
export const createNote = async (data: CreateNoteInput): Promise<Note> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET_KEY}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let message = 'Failed to create note';

      if (response.status === 401) {
        message = 'Unauthorized to create note. Please check your secret key.';
      } else if (response.status === 429) {
        message = 'You are creating notes too quickly. Please slow down and try again.';
      } else if (response.status >= 500) {
        message = 'Server error while creating note. Please try again later.';
      }

      throw new Error(message);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

/**
 * Update an existing note
 */
export const updateNote = async (id: string, data: UpdateNoteInput): Promise<Note> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let message = 'Failed to update note';
      let backendMessage = '';

      try {
        const errorBody = await response.json();
        backendMessage = errorBody?.message || '';
      } catch {
        backendMessage = '';
      }

      if (response.status === 401) {
        message = 'Unauthorized to update note. Please check your secret key.';
      } else if (response.status === 400) {
        message = backendMessage || 'Invalid note content. Please check title/content length.';
      } else if (response.status === 403) {
        message = backendMessage || 'Access denied. Please verify your token and request source.';
      } else if (response.status === 429) {
        message = 'You are updating too quickly. Please pause for a moment and try again.';
      } else if (response.status >= 500) {
        message = 'Server error while updating note. Your changes may not have been saved.';
      } else if (backendMessage) {
        message = backendMessage;
      }

      throw new Error(message);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

/**
 * Delete a note
 */
export const deleteNote = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let message = 'Failed to delete note';
      let backendMessage = '';

      try {
        const errorBody = await response.json();
        backendMessage = errorBody?.message || '';
      } catch {
        backendMessage = '';
      }

      if (response.status === 401) {
        message = 'Unauthorized to delete note. Please check your secret key.';
      } else if (response.status === 403) {
        message = backendMessage || 'Access denied. Please verify your token and request source.';
      } else if (response.status === 404) {
        message = 'Note not found. It may have already been deleted.';
      } else if (response.status === 429) {
        message = 'You are deleting notes too quickly. Please wait a moment and try again.';
      } else if (response.status >= 500) {
        message = backendMessage || 'Server error while deleting note. Please try again later.';
      } else if (backendMessage) {
        message = backendMessage;
      }

      throw new Error(message);
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};
