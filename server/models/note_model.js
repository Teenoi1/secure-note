import mongoose from "mongoose";

// Note Schema
const noteSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: false,
      default: "",
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

noteSchema.index({ updated_at: -1 });

export const Note = mongoose.model("Note", noteSchema);