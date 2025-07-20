#!/bin/bash

# === CONFIG ===
ENV_PROD="prod"
PROD_PREFIX="PROD_"

echo "Fetching all secrets..."

# === 1. Get all secret names ===
SECRETS=$(gcloud secrets list --format="value(name)")

echo "Found secrets:"
echo "$SECRETS"

# === 2. Loop over each secret ===
for SECRET in $SECRETS; do
  echo "Processing secret: $SECRET"

  # Get the secret payload (latest version)
  SECRET_VALUE=$(gcloud secrets versions access latest --secret="$SECRET")

  # Define the new secret name
  NEW_SECRET_NAME="${PROD_PREFIX}${SECRET}"

  echo "Creating new secret: $NEW_SECRET_NAME"

  # Create the new secret
  gcloud secrets create "$NEW_SECRET_NAME" \
    --replication-policy="automatic"

  # Add the secret value as a new version
  echo -n "$SECRET_VALUE" | gcloud secrets versions add "$NEW_SECRET_NAME" --data-file=-

  # Add env=prod label
  gcloud secrets update "$NEW_SECRET_NAME" --update-labels=env="$ENV_PROD"

  echo "Duplicated $SECRET to $NEW_SECRET_NAME with env=$ENV_PROD"
done

echo "✅ All secrets duplicated with PROD_ prefix and env=prod label."