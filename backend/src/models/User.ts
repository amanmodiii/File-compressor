import bcrypt from 'bcrypt';
import { User as PrismaUser } from '@prisma/client';
import prisma from '../config/prisma';

// Extend the Prisma User type with additional methods
export interface UserWithMethods extends PrismaUser {
  validatePassword(password: string): Promise<boolean>;
}

// User model service
export default {
  // Create a new user
  async create(data: { username: string; email: string; password: string }): Promise<UserWithMethods> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    }) as UserWithMethods;
    
    // Add the validatePassword method
    user.validatePassword = async function(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password);
    };
    
    return user;
  },
  
  // Find a user by ID
  async findById(id: number): Promise<UserWithMethods | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    }) as UserWithMethods | null;
    
    if (user) {
      user.validatePassword = async function(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
      };
    }
    
    return user;
  },
  
  // Find a user by email
  async findByEmail(email: string): Promise<UserWithMethods | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    }) as UserWithMethods | null;
    
    if (user) {
      user.validatePassword = async function(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
      };
    }
    
    return user;
  },
  
  // Find a user by username
  async findByUsername(username: string): Promise<UserWithMethods | null> {
    const user = await prisma.user.findUnique({
      where: { username }
    }) as UserWithMethods | null;
    
    if (user) {
      user.validatePassword = async function(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
      };
    }
    
    return user;
  },
  
  // Update a user
  async update(id: number, data: Partial<Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<UserWithMethods> {
    // Hash password if it's being updated
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    
    const user = await prisma.user.update({
      where: { id },
      data
    }) as UserWithMethods;
    
    user.validatePassword = async function(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password);
    };
    
    return user;
  }
}; 