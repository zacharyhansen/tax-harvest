#!/bin/sh
set -e # Exit on any error

# Run the migration command and fail the script if it exits with a non-zero status
if ! npx prisma migrate deploy; then
  echo "Migration failed"
  exit 1
fi

echo "Migration completed successfully"

# Find and terminate the Cloud SQL Auth Proxy sidecar more gracefully
echo "Gracefully terminating Cloud SQL Auth Proxy sidecar..."
# Send SIGTERM and give it time to shut down gracefully
if pgrep -f cloud-sql-proxy > /dev/null; then
  pkill -TERM -f cloud-sql-proxy
  # Wait a moment for graceful shutdown
  sleep 5
  # Check if it's still running and force kill if necessary
  if pgrep -f cloud-sql-proxy > /dev/null; then
    echo "Forcing termination of proxy..."
    pkill -9 -f cloud-sql-proxy || true
  fi
fi

echo "Migration job complete"
exit 0
