import express from 'express';
import cors from 'cors';
import path from 'path';
import sessionsRouter from './routes/sessions';
import handsRouter from './routes/hands';
import { getHandTypeOptions } from './services/scoringEngine';

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images (ephemeral in production)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend in production
if (isProduction) {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
}

// Routes
app.use('/api/sessions', sessionsRouter);
app.use('/api/hands', handsRouter);

// Get hand type options
app.get('/api/hand-types', (req, res) => {
  res.json(getHandTypeOptions());
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mahjong Scoring API is running' });
});

// Serve frontend in production (catch-all route)
if (isProduction) {
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
