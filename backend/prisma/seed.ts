import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding database...');
    
    // Create a test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });
    
    console.log(`Created test user with id: ${testUser.id}`);
    
    // Create a sample file for the test user
    const testFile = await prisma.file.upsert({
      where: { id: '00000000-0000-0000-0000-000000000000' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000000',
        userId: testUser.id,
        fileName: 'sample.txt',
        huffmanData: '{"a":1,"b":2}',
        compressionRatio: 0.5,
        fileSize: 1000,
        compressedSize: 500,
      },
    });
    
    console.log(`Created test file with id: ${testFile.id}`);
    
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 