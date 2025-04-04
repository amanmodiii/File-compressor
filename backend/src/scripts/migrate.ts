import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    // Check command line arguments
    const args = process.argv.slice(2);
    const command = args[0] || 'dev';
    
    console.log(`Running migration command: ${command}`);
    
    switch (command) {
      case 'dev':
        // Create a development migration
        console.log('Creating development migration...');
        execSync('npx prisma migrate dev', { stdio: 'inherit' });
        break;
        
      case 'deploy':
        // Apply migrations in production
        console.log('Deploying migrations...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        break;
        
      case 'reset':
        // Reset the database
        console.log('Resetting database...');
        execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
        break;
        
      case 'generate':
        // Generate Prisma client
        console.log('Generating Prisma client...');
        execSync('npx prisma generate', { stdio: 'inherit' });
        break;
        
      case 'seed':
        // Seed the database
        console.log('Seeding the database...');
        // Add your seeding logic here if needed
        break;
        
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Available commands: dev, deploy, reset, generate, seed');
        process.exit(1);
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 