#!/bin/bash

# Variables
PROJECT_ID="harvester-ai-428202"
GSA_NAME="harvester-secret-manager"
K8S_NAMESPACE="harvester-prod"
KSA_NAME="google-secret-service-account"

echo "Fixing Workload Identity permissions for production..."

# Grant Secret Manager access to the Google Service Account
echo "1. Ensuring Secret Manager Secret Accessor role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Grant Service Account Token Creator role (THIS IS THE MISSING PERMISSION)
echo "2. Adding Service Account Token Creator role..."
gcloud iam service-accounts add-iam-policy-binding $GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --project=$PROJECT_ID \
  --member="serviceAccount:$GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountTokenCreator"

# Ensure IAM policy binding for Workload Identity
echo "3. Ensuring Workload Identity User role..."
gcloud iam service-accounts add-iam-policy-binding $GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --project=$PROJECT_ID \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:$PROJECT_ID.svc.id.goog[$K8S_NAMESPACE/$KSA_NAME]"

echo ""
echo "Permissions fixed! The SecretStore should now be able to authenticate."
echo ""
echo "To verify, check the SecretStore status:"
echo "kubectl get secretstore -n $K8S_NAMESPACE"