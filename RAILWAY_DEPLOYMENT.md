# Railway.app Deployment Guide

This guide walks you through deploying the File Compression System on [Railway.app](https://railway.app).

## Prerequisites

1. Create a Railway.app account
2. Install the Railway CLI (optional, but recommended)
   ```
   npm i -g @railway/cli
   ```
3. Login to Railway CLI
   ```
   railway login
   ```

## Backend Deployment

### Step 1: Create a PostgreSQL Database Service

1. From the Railway dashboard, click "New Project"
2. Select "PostgreSQL" to create a new database service
3. After creation, click on the PostgreSQL service and find the "Connect" tab
4. Copy the connection string - you'll need this for the DATABASE_URL variable

### Step 2: Deploy the Backend Service

1. From your project dashboard, click "New Service" > "GitHub Repo"
2. Select your repository and click "Deploy"
3. Once connected, configure the service to use the `/backend` directory:
   - Go to Settings > Service Settings
   - Set Root Directory to `/backend`

4. Add the following environment variables in the Variables tab:
   - `PORT`: 5000 (Railway will override this, but it's good practice to set it)
   - `DATABASE_URL`: paste the PostgreSQL connection string you copied earlier
   - `JWT_SECRET`: create a secure random string for your JWT token signing
   - `NODE_ENV`: production

5. Railway will automatically detect the Node.js application and build/deploy it using the commands in your package.json and railway.json.

### Step 3: Run Migrations

After deployment, your backend may need to run migrations to set up the database schema:

1. Open the service in Railway dashboard
2. Go to the "Deploy" tab
3. Click on "Variables"
4. Add a temporary variable: `RAILWAY_DEPLOYMENT_TRIGGER=1` (this will trigger a redeployment)
5. The `railway:deploy` script in package.json will run migrations automatically

## Frontend Deployment

### Step 1: Deploy the Frontend Service

1. From your project dashboard, click "New Service" > "GitHub Repo"
2. Select the same repository (if you haven't already)
3. Configure the service to use the `/frontend` directory:
   - Go to Settings > Service Settings
   - Set Root Directory to `/frontend`

4. Add the following environment variables:
   - `NEXT_PUBLIC_API_URL`: The URL to your deployed backend service (e.g., `https://your-backend-service.railway.app`)

5. Railway will automatically build and deploy your Next.js application.

### Step 2: Assign Domain

1. Go to your frontend service settings
2. Click on "Settings" > "Domains"
3. Add a custom domain or use the Railway-provided domain

## Checking Deployment

1. After deployment, you can check the logs by clicking the "Logs" tab for each service
2. The "Deployments" tab shows the history of all deployments and their status

## Troubleshooting

### Module Not Found Error

If you encounter a "Cannot find module '/app/dist/index.js'" error:

1. This indicates that TypeScript compilation failed or the output directory structure is incorrect
2. Verify your tsconfig.json has the correct settings:
   - `"outDir": "./dist"` should be set
   - `"rootDir": "./src"` should be set
   - `"include": ["src/**/*"]` should be included to ensure all source files are compiled

3. Check the build logs in Railway to see if TypeScript compilation succeeded
4. If necessary, SSH into your Railway instance to investigate:
   ```
   railway login
   railway connect
   ```
   Then check if the dist directory and index.js file exist:
   ```
   ls -la /app/dist
   ```

### Database Connection Issues

If you encounter database connection issues:
1. Verify that your DATABASE_URL environment variable is correctly set
2. Check if the PostgreSQL service is running
3. Make sure the IP allowing settings are configured correctly in the PostgreSQL service

### Build Failures

If your build fails:
1. Check the logs in the "Deployments" tab
2. Verify your package.json scripts are correctly configured
3. Make sure all dependencies are properly listed in your package.json
4. Ensure TypeScript is properly installed and configured
5. Try running the build process locally to identify issues:
   ```
   npm run build
   ```

### Frontend Can't Connect to Backend

If your frontend can't connect to your backend:
1. Verify the NEXT_PUBLIC_API_URL is correctly set
2. Check CORS settings in your backend to allow requests from your frontend domain
3. Verify both services are running correctly

## Manual Deployment Steps

If you continue to encounter issues with automatic deployment, you can try these manual steps:

1. Build your app locally:
   ```
   cd backend
   npm run build
   ```

2. Verify the dist/index.js file exists locally

3. Push the built code to Railway:
   ```
   railway up
   ```

4. Run migrations manually:
   ```
   railway run npm run db:deploy
   ```

5. Restart your service from the Railway dashboard

## Further Improvements

- Set up a shared network between your services for better security
- Configure a custom domain for your application
- Set up CI/CD with GitHub Actions for automated testing before deployment 