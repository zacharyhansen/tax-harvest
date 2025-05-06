#!/bin/sh
set -e # Exit on any error

# Run the migration command and fail the script if it exits with a non-zero status
if ! npx prisma migrate deploy; then
  echo "Migration failed"
  exit 1
fi

echo "Migration completed successfully"
echo "Terminating Cloud SQL Auth Proxy sidecar..."
pkill -f cloud-sql-proxy || true

exit 0
