import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import compressionRoutes from './routes/compressionRoutes';
import authRoutes from './routes/authRoutes';
import { prisma } from './models';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true // Allow cookies to be sent across domains
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/compression', compressionRoutes);

// Home route
app.get('/', (req: Request, res: Response) => {
  res.send('File Compression API is running');
});

// Start Express server
const startServer = async () => {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log('Connected to database successfully');
    
    // Set port
    const PORT = process.env.PORT || 5000;
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

// Handle application shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

startServer();

export default app; 