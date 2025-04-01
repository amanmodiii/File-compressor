# PowerShell script to setup PostgreSQL database for file compressor inside Docker

$DB_USER = "file-compressor-su"
$DB_PASSWORD = "12345678"
$DB_NAME = "file-compressor-db"
$POSTGRES_CONTAINER = "kind_bouman"  # Replace with your actual container name

Write-Output "Starting PostgreSQL setup for file compressor in Docker..."

# Check if the PostgreSQL container is running
$containerRunning = docker ps --format "{{.Names}}" | Select-String -Pattern $POSTGRES_CONTAINER
if (-not $containerRunning) {
    Write-Output "Error: PostgreSQL container '$POSTGRES_CONTAINER' is not running."
    exit 1
}

Write-Output "Creating users and database..."

# Define SQL commands
$SQL_COMMANDS = @"
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'file-compressor-user') THEN
        CREATE USER "file-compressor-user" WITH PASSWORD '$DB_PASSWORD';
        RAISE NOTICE 'User file-compressor-user created';
    ELSE
        RAISE NOTICE 'User file-compressor-user already exists';
    END IF;
END
\$\$;

DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER "$DB_USER" WITH PASSWORD '$DB_PASSWORD' CREATEDB;
        RAISE NOTICE 'User $DB_USER created';
    ELSE
        RAISE NOTICE 'User $DB_USER already exists';
    END IF;
END
\$\$;

SET ROLE "$DB_USER";
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME') THEN
        CREATE DATABASE "$DB_NAME";
        RAISE NOTICE 'Database $DB_NAME created';
    ELSE
        RAISE NOTICE 'Database $DB_NAME already exists';
    END IF;
END
\$\$;

\connect "$DB_NAME";
GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO "file-compressor-user";

SET ROLE "postgres";
GRANT ALL PRIVILEGES ON SCHEMA public TO "file-compressor-user";
GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO "$DB_USER";
GRANT ALL PRIVILEGES ON SCHEMA public TO "$DB_USER";
"@

# Execute the SQL commands inside the PostgreSQL container
$SQL_COMMANDS | docker exec -i $POSTGRES_CONTAINER psql -U postgres

Write-Output "PostgreSQL setup completed successfully inside Docker."
Write-Output "Connection URL: postgresql://$DB_USER`:12345678@localhost:5432/$DB_NAME"

