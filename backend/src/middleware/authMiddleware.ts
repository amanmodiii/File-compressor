import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Interface for JWT payload
interface JwtPayload {
  id: number;
  username: string;
}

// Protect routes middleware
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check if token exists in cookie or authorization header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token provided' });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // Get user from database
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] } // Exclude password from returned data
      });

      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      // Attach user to request object
      (req as any).user = user;
      next();
    } catch (error) {
      // Token verification failed
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in auth middleware' });
  }
}; 