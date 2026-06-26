import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import membersRoutes from './routes/members.js';
import stationsRoutes from './routes/stations.js';
import sessionsRoutes from './routes/sessions.js';
import bookingsRoutes from './routes/bookings.js';
import securityRoutes from './routes/security.js';
import dashboardRoutes from './routes/dashboard.js';
import packagesRoutes from './routes/packages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'CyberShield Cafe Manager' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/stations', stationsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/packages', packagesRoutes);

if (isProduction) {
  const staticPath = process.env.STATIC_PATH || path.join(__dirname, '..', 'public');
  app.use(express.static(staticPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(staticPath, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CyberShield Cafe API running on http://0.0.0.0:${PORT}`);
});
