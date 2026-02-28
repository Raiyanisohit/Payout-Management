import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import seedUsers from './utils/seed.js';
import authRoutes from './routes/auth.js';
import vendorRoutes from './routes/vendors.js';
import payoutRoutes from './routes/payouts.js';
import { jwtMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
const dns = await import('node:dns');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
// protect all following routes
app.use(jwtMiddleware);
app.use('/vendors', vendorRoutes);
app.use('/payouts', payoutRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  dns.setServers(['0.0.0.0', '1.1.1.1']);
  
  await connectDB(process.env.MONGODB_URI);
  await seedUsers();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});
