import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import teamsRoutes from './routes/teams.js';     
import tasksRoutes from './routes/tasks.js';  
import membershipsRoutes from './routes/memberships.js';

dotenv.config();

const app = express(); 
const PgSession = pgSession(session);

app.set('trust proxy', 1);

// ✅ CORS Middleware: dynamic for dev + production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// ✅ Session Middleware: secure + cross-origin ready
app.use(session({
  store: new PgSession({ conString: process.env.DATABASE_URL }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/teams', teamsRoutes);    
app.use('/tasks', tasksRoutes);   
app.use('/memberships', membershipsRoutes); 

// ✅ Healthcheck
app.get('/', (req, res) => {
  res.send('Backend is up and running 🚂');
});

// ✅ Server listen
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
