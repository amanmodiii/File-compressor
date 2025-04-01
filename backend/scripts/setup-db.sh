#!/bin/bash

# Setup PostgreSQL database for the file compressor application
echo "Starting PostgreSQL setup for file compressor..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL is not installed. Please install it first."
    exit 1
fi

echo "Creating users and database..."

psql -U postgres -h localhost -p 5432 <<EOF
-- Create users
DO 
\$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'file-compressor-user') THEN
        CREATE USER "file-compressor-user" WITH PASSWORD '12345678';
        RAISE NOTICE 'User file-compressor-user created';
    ELSE
        RAISE NOTICE 'User file-compressor-user already exists';
    END IF;
END
\$\$;

DO 
\$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'file-compressor-su') THEN
        CREATE USER "file-compressor-su" WITH PASSWORD '12345678' CREATEDB;
        RAISE NOTICE 'User file-compressor-su created';
    ELSE
        RAISE NOTICE 'User file-compressor-su already exists';
    END IF;
END
\$\$;

-- Set role and create database
SET ROLE "file-compressor-su";
DO 
\$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'file-compressor-db') THEN
        CREATE DATABASE "file-compressor-db";
        RAISE NOTICE 'Database file-compressor-db created';
    ELSE
        RAISE NOTICE 'Database file-compressor-db already exists';
    END IF;
END
\$\$;

-- Connect to the database and grant privileges
\connect "file-compressor-db";
GRANT ALL PRIVILEGES ON DATABASE "file-compressor-db" TO "file-compressor-user";

-- Switch back to postgres role and grant schema privileges
SET ROLE "postgres";
GRANT ALL PRIVILEGES ON SCHEMA public TO "file-compressor-user";
GRANT ALL PRIVILEGES ON DATABASE "file-compressor-db" TO "file-compressor-su";
GRANT ALL PRIVILEGES ON SCHEMA public TO "file-compressor-su";
EOF

echo "PostgreSQL setup completed successfully."
echo "Connection URL: postgresql://file-compressor-su:12345678@localhost:5432/file-compressor-db"