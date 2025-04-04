# Database Migration Guide

This project uses Prisma ORM for database management and migrations. This document outlines how to work with the migration system.

## Overview

The project has migrated from Sequelize to Prisma ORM, which provides better type safety, a more intuitive API, and improved migration capabilities.

## Available Commands

The following migration commands are available in the `package.json`:

- `npm run prisma:generate` - Generate Prisma client based on your schema
- `npm run prisma:migrate:dev` - Create and apply migrations in development
- `npm run prisma:migrate:deploy` - Apply migrations in production
- `npm run prisma:migrate:reset` - Reset the database (drop all tables and recreate)
- `npm run prisma:studio` - Launch Prisma Studio to visually explore your database
- `npm run prisma:seed` - Seed the database with initial data

For convenience, shorter aliases are also available:

- `npm run db:migrate` - Alias for prisma:migrate:dev
- `npm run db:deploy` - Alias for prisma:migrate:deploy
- `npm run db:reset` - Alias for prisma:migrate:reset
- `npm run db:seed` - Alias for prisma:seed

Additionally, there's a custom migration script:

- `npm run migrate [command]` - Run the custom migration script with optional command (dev/deploy/reset/generate/seed)

## Creating a Migration

To create a new migration when you've changed your schema:

```bash
npm run db:migrate -- --name name_of_your_migration
```

This will:
1. Analyze your schema changes
2. Generate SQL migration files
3. Apply the migrations to your database
4. Update the Prisma client

## Deploying Migrations

In production environments, use:

```bash
npm run db:deploy
```

This will apply any pending migrations without generating new ones.

## Seeding the Database

To populate your database with initial data:

```bash
npm run db:seed
```

This runs the seed script located at `prisma/seed.ts`.

## Viewing the Database

To explore your database visually:

```bash
npm run prisma:studio
```

This launches a web interface at http://localhost:5555 where you can browse and edit your data.

## Schema Location

The Prisma schema is located at `prisma/schema.prisma`. This file defines:

- Database connection
- Data models
- Relationships between models
- Indexing and other database features

## Migration Files

Migration files are stored in the `prisma/migrations` directory. Each migration has its own folder with SQL files and metadata.

## Troubleshooting

If you encounter issues:

1. **Reset the database**: Use `npm run db:reset` to completely reset the database and apply all migrations from scratch.
2. **Check your schema**: Ensure your Prisma schema is valid with `npx prisma validate`.
3. **Regenerate the client**: Run `npm run prisma:generate` to ensure your client matches the current schema.
4. **Check migration status**: Run `npx prisma migrate status` to see the status of your migrations.

## Moving from Sequelize to Prisma

This project has been migrated from Sequelize to Prisma. The main changes include:

1. Model definitions now use Prisma schema instead of Sequelize model classes
2. Database queries use Prisma Client instead of Sequelize ORM
3. Migrations are handled through Prisma's migration system

The code has been refactored to use a service-based approach that wraps Prisma client operations. 