#!/bin/bash

# This script initializes the Supabase database schema
# Run from the command line: ./scripts/init-db.sh
# Or set up as a Vercel deployment hook

set -e

echo "Initializing Underground Debate Club database..."

# Use psql to execute the SQL scripts
if [ -z "$POSTGRES_URL" ]; then
  echo "Error: POSTGRES_URL environment variable not set"
  exit 1
fi

echo "Creating database schema..."
psql "$POSTGRES_URL" < scripts/001_setup_database.sql

echo "Database initialization complete!"
