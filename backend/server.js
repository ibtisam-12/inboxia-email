import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import emailRoutes from './routes/emailRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api/email', emailRoutes);
app.use('/api/auth', authRoutes);

// Error middleware should be last
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));