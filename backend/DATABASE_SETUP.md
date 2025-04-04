# Database Setup Guide

This guide outlines how to set up the database for the File Compression System using Prisma migrations.

## Prerequisites

- Node.js and npm installed
- PostgreSQL server running (locally or remote)
- Database credentials configured in `.env` file

## Configuration

1. Make sure your `.env` file has the correct `DATABASE_URL` environment variable:

```
DATABASE_URL=postgresql://username:password@hostname:port/database
```

For local development, you might use:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/file-compressor-db
```

## Database Setup Process

### Option 1: Quick Setup (Recommended)

Run the combined setup command:

```bash
npm run db:setup
```

This command will:
1. Run all migrations to create the database schema
2. Seed the database with initial data

### Option 2: Manual Setup

If you prefer to run each step manually:

1. Run the migrations to create the database schema:
   ```bash
   npm run db:migrate
   ```

2. Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

## Reset the Database

If you need to reset the database (drop all tables and recreate):

```bash
npm run db:reset
```

**Warning**: This will delete all data in the database!

## Development Commands

- `npm run prisma:studio` - Launches Prisma Studio, a visual editor for your database
- `npm run db:migrate -- --name migration_name` - Create a new migration with a specific name
- `npm run prisma:generate` - Generate Prisma client after schema changes

## Production Deployment

For production environments, use:

```bash
npm run db:deploy
```

This will apply migrations without prompting or generating new ones, suitable for CI/CD environments. 