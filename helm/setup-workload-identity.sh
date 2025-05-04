#!/bin/bash

# Variables
PROJECT_ID="harvester-ai-428202"
GSA_NAME="harvester-secret-manager"
K8S_NAMESPACE="harvester"
KSA_NAME="google-secret-service-account"
CLUSTER_NAME="harvester-dev"
REGION="us-central1-b"

# Create Google Service Account
gcloud iam service-accounts create $GSA_NAME \
  --project=$PROJECT_ID \
  --description="Service account for accessing Secret Manager" \
  --display-name="Harvester Secret Manager"

# Grant Secret Manager access to the Google Service Account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Grant Cloud SQL Admin access to the Google Service Account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.admin"

# Create Kubernetes ServiceAccount (if not already created by Helm)
kubectl create serviceaccount $KSA_NAME -n $K8S_NAMESPACE

# Set up IAM policy binding for Workload Identity
gcloud iam service-accounts add-iam-policy-binding $GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --project=$PROJECT_ID \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:$PROJECT_ID.svc.id.goog[$K8S_NAMESPACE/$KSA_NAME]"

# Annotate the Kubernetes ServiceAccount
kubectl annotate serviceaccount $KSA_NAME \
  --namespace $K8S_NAMESPACE \
  iam.gke.io/gcp-service-account=$GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com 