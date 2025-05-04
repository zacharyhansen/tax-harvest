#!/bin/bash

# Variables
PROJECT_ID="harvester-ai-428202"
GSA_NAME="harvester-secret-manager"

echo "Adding Cloud SQL Admin role to service account $GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com..."

# Grant Cloud SQL Admin access to the Google Service Account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.admin"

echo "Permission added successfully."
echo "To verify the permissions, run:"
echo "gcloud projects get-iam-policy $PROJECT_ID --flatten=\"bindings[].members\" --format=\"table(bindings.role,bindings.members)\" --filter=\"bindings.members:$GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com\"" 