import { v4 as uuidv4 } from 'uuid';
import { File as PrismaFile } from '@prisma/client';
import prisma from '../config/prisma';

// File model service
export default {
  // Create a new file
  async create(data: {
    userId: number;
    fileName: string;
    huffmanData: string;
    compressionRatio: number;
    fileSize: number;
    compressedSize: number;
  }): Promise<PrismaFile> {
    return prisma.file.create({
      data: {
        id: uuidv4(),
        ...data
      }
    });
  },
  
  // Find a file by ID
  async findById(id: string): Promise<PrismaFile | null> {
    return prisma.file.findUnique({
      where: { id }
    });
  },
  
  // Find files by user ID
  async findByUserId(userId: number): Promise<PrismaFile[]> {
    return prisma.file.findMany({
      where: { userId }
    });
  },
  
  // Update a file
  async update(
    id: string, 
    data: Partial<Omit<PrismaFile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<PrismaFile> {
    return prisma.file.update({
      where: { id },
      data
    });
  },
  
  // Delete a file
  async delete(id: string): Promise<PrismaFile> {
    return prisma.file.delete({
      where: { id }
    });
  },
  
  // Delete all files for a user
  async deleteByUserId(userId: number): Promise<{ count: number }> {
    const result = await prisma.file.deleteMany({
      where: { userId }
    });
    
    return { count: result.count };
  }
}; 