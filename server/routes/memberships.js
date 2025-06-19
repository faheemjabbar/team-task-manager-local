import express from 'express';
import db from '../db/knex.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /memberships/:teamId - Get all users in a team
router.get('/:teamId', checkAuth, async (req, res) => {
  const { teamId } = req.params;

  try {
    const members = await db('memberships')
      .join('users', 'memberships.user_id', 'users.id')
      .where('memberships.team_id', teamId)
      .select('users.id', 'users.username', 'users.email');

    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});


// POST /memberships - Add user to team using user_id
router.post('/', checkAuth, async (req, res) => {
  const { user_id, team_id } = req.body;

  try {
    const user = await db('users').where({ id: user_id }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Insert into memberships
    await db('memberships').insert({
      user_id,
      team_id,
    });

    res.status(201).json({
      message: 'User added to team',
      member: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'User already in team' });
    }

    console.error(err);
    res.status(500).json({ error: 'Failed to add user to team' });
  }
});


export default router;
