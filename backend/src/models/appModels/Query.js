const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const NoteSchema = new Schema({
  noteId: { type: String, default: uuidv4 },
  note: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const QuerySchema = new Schema(
  {
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    client: { type: String },
    description: { type: String },
    resolution: { type: String },
    notes: [NoteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', QuerySchema);
