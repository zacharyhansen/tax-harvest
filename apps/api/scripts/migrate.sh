#!/bin/sh
set -e # Exit on any error

echo "Starting Prisma migration..."
# Wait briefly for the proxy to be ready
sleep 5

# Run the migration
if ! npx prisma migrate deploy; then
  echo "Migration failed with status $?"
  exit 1
fi

echo "Migration completed successfully, terminating sidecar..."
# Use wget if available
if command -v wget > /dev/null; then
  wget -q -O - http://localhost:9091/quitquitquit || echo "Using wget to terminate proxy"
# Use node fetch if wget not available
else
  node -e "fetch('http://localhost:9091/quitquitquit').then(() => console.log('Proxy termination request sent')).catch(e => console.error('Failed to terminate proxy:', e))" || echo "Using Node.js to terminate proxy"
fi

echo "Termination signal sent to proxy, waiting for shutdown..."
sleep 3
echo "Job completed"
exit 0
