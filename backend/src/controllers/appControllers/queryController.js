const Query = require('@/models/appModels/Query');
const { v4: uuidv4 } = require('uuid');

// GET /api/queries?page=&limit=
exports.list = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  console.log('checkkkk in /api/queries...', req);
  const [queries, total] = await Promise.all([
    Query.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Query.countDocuments(),
  ]);
  res.json({ data: queries, total, page, limit });
};

// POST /api/queries
exports.create = async (req, res) => {
  const { status, resolution } = req.body;
  const query = new Query({ status, resolution });
  await query.save();
  res.status(201).json(query);
};

// GET /api/queries/:id
exports.read = async (req, res) => {
  const query = await Query.findById(req.params.id);
  if (!query) return res.status(404).json({ error: 'Query not found' });
  res.json(query);
};

// PUT /api/queries/:id
exports.update = async (req, res) => {
  const { status, resolution } = req.body;
  const query = await Query.findByIdAndUpdate(req.params.id, { status, resolution }, { new: true });
  if (!query) return res.status(404).json({ error: 'Query not found' });
  res.json(query);
};

// POST /api/queries/:id/notes
exports.addNote = async (req, res) => {
  const { text } = req.body;
  const note = { noteId: uuidv4(), text };
  const query = await Query.findByIdAndUpdate(
    req.params.id,
    { $push: { notes: note } },
    { new: true }
  );
  if (!query) return res.status(404).json({ error: 'Query not found' });
  res.json(query);
};

// DELETE /api/queries/:id/notes/:noteId
exports.deleteNote = async (req, res) => {
  const { id, noteId } = req.params;
  const query = await Query.findByIdAndUpdate(id, { $pull: { notes: { noteId } } }, { new: true });
  if (!query) return res.status(404).json({ error: 'Query or note not found' });
  res.json(query);
};
