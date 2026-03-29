export interface Note {
    _id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface CreateNoteInput {
    title: string;
    content: string;
}

export interface UpdateNoteInput {
    title?: string;
    content?: string;
}
