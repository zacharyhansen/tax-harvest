#!/bin/sh
set -e # Exit on any error

# Run the migration command and fail the script if it exits with a non-zero status
if ! npx prisma migrate deploy; then
  echo "Migration failed"
  exit 1
fi

# Explicitly exit with success code to ensure Kubernetes job completes
echo "Migration completed successfully"
exit 0
