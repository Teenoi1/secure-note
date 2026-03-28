import mongoose from "mongoose";

// Note Schema
const noteSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
      maxlength: 100000,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
},
    {
        versionKey: false,
    }
);

export const Note = mongoose.model("Note", noteSchema);