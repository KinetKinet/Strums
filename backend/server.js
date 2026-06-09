import express from 'express';
import { pool } from './db/index.js';
import cors from 'cors';
import dotenv from 'dotenv';
import lessonsRoutes from './routes/lessons.js';
import chordLibraryRoutes from './routes/chordLibrary.js';
import adminRoutes from './routes/admin.js';
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/lessons', lessonsRoutes);
app.use('/api/chord-library', chordLibraryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

const PORT = process.env.PORT || 5000;
// Connect to Postgres and start server
async function start() {
  try {
    await pool.connect();
    console.log('Connected to Postgres');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Postgres connection error:', err.message || err);
    process.exit(1);
  }
}

start();
