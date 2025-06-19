import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db/knex.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// -------------------------
// POST /auth/register
// -------------------------
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db('users')
      .insert({
        username,
        email,
        password: hashedPassword,
      })
      .returning(['id', 'username', 'email']);

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// -------------------------
// POST /auth/login
// -------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    res.json({
      message: 'Login successful',
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// -------------------------
// GET /auth/dashboard (protected)
// -------------------------
router.get('/dashboard', (req, res) => {
  try {
    console.log('SESSION:', req.session); // 🔍 log it
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({ user: req.session.user });
  } catch (err) {
    console.error('Dashboard route error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});


// -------------------------
// POST /auth/logout
// -------------------------
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// -------------------------
// GET /auth/users (for team assignment)
// -------------------------
router.get('/users', async (req, res) => {
  try {
    const users = await db('users').select('id', 'username', 'email');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
