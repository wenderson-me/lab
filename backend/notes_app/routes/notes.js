// backend/routes/notes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching notes for user:', req.user.userId);
    const { search } = req.query; // Removemos o parâmetro archived, pois o frontend agora gerencia isso
    let query = { userId: req.user.userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    console.log('Notes found:', notes.length, 'notes:', notes);
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    console.log('Creating note:', { title, content, userId: req.user.userId });
    const note = new Note({
      userId: req.user.userId,
      title,
      content,
      isArchived: false
    });
    await note.save();
    console.log('Note saved:', note);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, isArchived } = req.body;
    console.log('Updating note:', req.params.id);
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, updatedAt: new Date(), isArchived: isArchived !== undefined ? isArchived : false },
      { new: true }
    );
    if (!note) {
      console.log('Note not found');
      return res.status(404).json({ error: 'Note not found' });
    }
    console.log('Note updated:', note);
    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting note:', req.params.id);
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    if (!note) {
      console.log('Note not found');
      return res.status(404).json({ error: 'Note not found' });
    }
    console.log('Note deleted');
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;