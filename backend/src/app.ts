import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import slotRoutes from './routes/slotRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/slots', slotRoutes);
app.use('/api/v1/bookings', bookingRoutes);
// Healthcheck Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server operational hai!',
  });
});

export default app;