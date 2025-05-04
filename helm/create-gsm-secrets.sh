#!/bin/bash

# Variables
PROJECT_ID="harvester-ai-428202"
INSTANCE_CONNECTION_NAME="harvester-ai-428202:us-central1:harvester-dev"

# Function to create or update a secret
create_or_update_secret() {
    local secret_name=$1
    local secret_value=$2
    
    # Check if secret exists
    if gcloud secrets describe $secret_name --project=$PROJECT_ID > /dev/null 2>&1; then
        echo "Secret $secret_name already exists, adding new version..."
        echo -n "$secret_value" | gcloud secrets versions add $secret_name --data-file=- --project=$PROJECT_ID
    else
        echo "Creating new secret $secret_name..."
        echo -n "$secret_value" | gcloud secrets create $secret_name --data-file=- --project=$PROJECT_ID
    fi
}

# Database URL with Cloud SQL socket format
# For PostgreSQL: postgresql://username:password@/cloudsql/INSTANCE_CONNECTION_NAME/dbname?schema=public
create_or_update_secret "DATABASE_URL" "postgresql://postgres:your-password@/cloudsql/$INSTANCE_CONNECTION_NAME/harvester?schema=public"

# Clerk Secret Key - Replace with your actual Clerk Secret Key
create_or_update_secret "CLERK_SECRET_KEY" "clerk_secret_key_value"

# Stripe Secret Key - Replace with your actual Stripe Secret Key
create_or_update_secret "STRIPE_SECRET_KEY" "stripe_secret_key_value"

echo "All secrets created/updated successfully!" 