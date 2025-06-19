import express from 'express';
import db from '../db/knex.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /teams — create a team
router.post('/', checkAuth, async (req, res) => {
  const { name } = req.body;

  try {
    const [team] = await db('teams').insert({ name }).returning('*');
    res.status(201).json({ message: 'Team created', team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// GET /teams — list all teams
router.get('/', checkAuth, async (req, res) => {
  try {
    const teams = await db('teams').select('*');
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});
// DELETE /teams/:id
router.delete('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;

  try {
    // First, delete all related memberships and tasks
    await db('memberships').where({ team_id: id }).del();
    await db('tasks').where({ team_id: id }).del();

    // Then delete the team itself
    const deleted = await db('teams').where({ id }).del();

    if (deleted) {
      res.json({ message: 'Team deleted successfully' });
    } else {
      res.status(404).json({ error: 'Team not found' });
    }
  } catch (err) {
    console.error('Error deleting team:', err);
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

export default router;
