const express = require('express');
const router = express.Router();
const db = require('../database/init');

// GET /history
router.get('/', (req, res) => {
  try {
    const history = db.prepare('SELECT * FROM history ORDER BY created_at DESC LIMIT 50').all();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /history/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM history WHERE id = ?').run(id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;