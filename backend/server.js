import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import lessonsRoutes from './routes/lessons.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/lessons', lessonsRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/strums';

console.log('Attempting to connect to MongoDB at:', MONGO);

mongoose.connect(MONGO, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  retryWrites: false
})
  .then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error:', err.message || err);
    console.error('Full error:', err);
    process.exit(1);
  });
