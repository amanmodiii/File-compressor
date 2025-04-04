import UserModel from './User';
import FileModel from './File';
import prisma from '../config/prisma';

// Model exports
export const User = UserModel;
export const File = FileModel;

// Prisma client export for direct database access
export { prisma }; 