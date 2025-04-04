const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

try {
  // Run TypeScript compiler
  console.log('Compiling TypeScript...');
  execSync('npx tsc --project tsconfig.json', { stdio: 'inherit' });

  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Verify that index.js was created
  const indexPath = path.join(__dirname, 'dist', 'index.js');
  if (fs.existsSync(indexPath)) {
    console.log(`✅ Build successful! Output file exists at: ${indexPath}`);
  } else {
    console.error(`❌ Build failed! Output file does not exist at: ${indexPath}`);
    process.exit(1);
  }
} catch (error) {
  console.error('Build failed with error:', error.message);
  process.exit(1);
} 