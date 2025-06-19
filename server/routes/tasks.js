import express from 'express';
import db from '../db/knex.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a task
router.post('/', checkAuth, async (req, res) => {
  const { title, description, due_date, status, team_id, assignee_id } = req.body;

  try {
    const [task] = await db('tasks')
      .insert({
        title,
        description,
        due_date,
        status,
        team_id,
        assignee_id,
      })
      .returning('*');

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get all tasks assigned to the logged-in user (with optional ?team=ID filter)
router.get('/', checkAuth, async (req, res) => {
  const userId = req.session.user.id;
  const { team } = req.query;

  try {
    let query = db('tasks').select('*').where('assignee_id', userId);

    if (team) {
      query = query.andWhere('team_id', team);
    }

    const tasks = await query;
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Update a task
router.put('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [task] = await db('tasks')
      .where({ id })
      .update(updates)
      .returning('*');

    res.json({ message: 'Task updated', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ✅ Correct full version
router.delete('/:id', checkAuth, async (req, res) => {
  const taskId = Number(req.params.id);

  try {
    const deletedCount = await db('tasks').where({ id: taskId }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});


export default router;
