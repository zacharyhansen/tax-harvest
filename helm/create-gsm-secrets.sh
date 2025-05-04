#!/bin/bash

# Variables
PROJECT_ID="harvester-ai-428202"

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

# Database URL - Replace with your actual database URL
create_or_update_secret "DATABASE_URL" "postgresql://username:password@host:5432/database?schema=public"

# Clerk Secret Key - Replace with your actual Clerk Secret Key
create_or_update_secret "CLERK_SECRET_KEY" "clerk_secret_key_value"

# Stripe Secret Key - Replace with your actual Stripe Secret Key
create_or_update_secret "STRIPE_SECRET_KEY" "stripe_secret_key_value"

echo "All secrets created/updated successfully!" 