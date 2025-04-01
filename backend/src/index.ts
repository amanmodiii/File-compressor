import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import compressionRoutes from './routes/compressionRoutes';
import authRoutes from './routes/authRoutes';
import sequelize from './config/database';

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

// Sync database before starting the server
const syncDatabase = async () => {
  try {
    // In development environment, force sync to drop and recreate tables 
    // This helps with type conversion issues
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });
      console.log('Database synchronized successfully (tables dropped and recreated)');
    } else {
      await sequelize.sync();
      console.log('Database synchronized successfully');
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

// Start Express server
const startServer = async () => {
  await syncDatabase();
  
  // Set port
  const PORT = process.env.PORT || 5000;
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

export default app; 