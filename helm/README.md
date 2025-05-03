# Tax Harvester Helm Chart

This Helm chart deploys the Tax Harvester application on a Kubernetes cluster.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- ArgoCD installed in your cluster
- GKE Workload Identity configured (for Cloud SQL access)

## Installing the Chart

To install the chart with ArgoCD, create an Application resource:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: tax-harvester
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/tax-harvester.git
    targetRevision: HEAD
    path: helm
  destination:
    server: https://kubernetes.default.svc
    namespace: harvester
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

## Configuration

The following table lists the configurable parameters of the Tax Harvester chart and their default values:

| Parameter                        | Description                           | Default                              |
|----------------------------------|---------------------------------------|--------------------------------------|
| `global.namespace`               | Kubernetes namespace                   | `harvester`                          |
| `global.domain`                  | Domain name for the application        | `harvester.example.com`              |
| `global.ingress.enabled`         | Enable ingress                         | `true`                               |
| `global.ingress.className`       | Ingress class name                     | `gce`                                |
| `api.replicaCount`               | Number of API replicas                 | `1`                                  |
| `api.image.repository`           | API image repository                   | `gcr.io/your-project/harvester-api`  |
| `api.image.tag`                  | API image tag                          | `latest`                             |
| `api.serviceAccountName`         | K8s service account for GCP identity   | `google-secret-service-account`      |
| `api.cloudsql.enabled`           | Enable Cloud SQL Proxy sidecar         | `true`                               |
| `api.cloudsql.instanceConnectionName` | GCP Cloud SQL instance name       | `project:region:instance`            |
| `api.migrations.enabled`         | Enable database migrations             | `true`                               |
| `web.replicaCount`               | Number of Web replicas                 | `1`                                  |
| `web.image.repository`           | Web image repository                   | `gcr.io/your-project/harvester-web`  |
| `web.image.tag`                  | Web image tag                          | `latest`                             |

## Structure

- `Chart.yaml`: Main chart definition
- `values.yaml`: Default values for the chart
- `charts/common/`: Common templates for all services
- `charts/api/`: API service chart
- `charts/web/`: Web frontend chart

## Cloud SQL Integration

The API deployment includes a Cloud SQL Auth Proxy sidecar container that securely connects to your Cloud SQL instance. This requires:

1. GKE Workload Identity to be configured properly (see the GKE setup notes below)
2. A Kubernetes service account named `google-secret-service-account` in the `harvester` namespace
3. The service account must be bound to a GCP service account with Cloud SQL Client permissions

The Cloud SQL Auth Proxy creates a Unix socket at `/cloudsql/<INSTANCE_CONNECTION_NAME>` which your application should use to connect to the database.

# Helm Resourcecs

[Customizing Chart Before Installing](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing)

[Digital Ocean Example](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-on-digitalocean-kubernetes-using-helm)

# Ingress NGINX

See [Github](https://github.com/kubernetes/ingress-nginx/tree/main/charts/ingress-nginx#configuration)

# GKE Set Up Notes

`gcloud container clusters get-credentials "harvester-dev" --zone us-central1-b`

Create namespace for nginx
`kubectl create namespace ingress-nginx`

Describe ingress
`kubectl describe ing`

Service details
`kubectl describe services harvester-ingress-nginx-test-controller -n harvester`

Access ArgoCD server on cluster (username is `admin`)
`kubectl port-forward svc/argocd-server -n argocd 8080:443`

Get ArgoCD password
`kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=”{.data.password}” | base64 -d; echo`

## Set up container access to google secret manager

[Allow GKE App to read secrets](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)

Create cluster with workload node pool (does get added for existing pools)

```gcloud container clusters create harvester-dev \
    --location=us-central1-b \
    --workload-pool=harvester-ai-428202.svc.id.goog
```

Create Workload pool

```
gcloud container clusters update harvester-dev \
    --location=us-central1-b \
    --workload-pool=harvester-ai-428202.svc.id.goog
```

Create service account in cluster

```
kubectl create serviceaccount google-secret-service-account \
    --namespace harvester

```

Create service account in gcloud

```
gcloud iam service-accounts create cloud-sql-read-write \
  --display-name="Cloud SQL Read & Write"

```

Bind IAM Workload Pool with secret access role

```
gcloud projects add-iam-policy-binding projects/harvester-ai-428202 \
    --role=roles/secretmanager.secretAccessor \
    --member=principal://iam.googleapis.com/projects/415549375710/locations/global/workloadIdentityPools/harvester-ai-428202.svc.id.goog/subject/ns/harvester/sa/google-secret-service-account \
    --condition=None
```

https://cloud.google.com/sql/docs/mysql/connect-kubernetes-engine#gsa

Bind IAM Service Accont with cloudsql role

```
gcloud projects add-iam-policy-binding harvester-ai-428202 \
  --member="serviceAccount:harvester-studio@harvester-ai-428202.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

Start tunnel to argo cd

```
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Helm Debug (exports templated confirgation to the `test.yaml` file)

```
helm dependency build
helm template service .  --debug > test.yaml
```

Create secret with key

```kubectl create secret generic <SECRET> \
  --from-literal=username=<KEY>
```

Create Secret in namespace

```
kubectl create secret generic clerk -n harvester \
  --from-literal=CLERK_SECRET_KEY=<secert>
```

Ingress address

```
kubectl get services -n ingress-nginx
```

Proxy the argodc server

```
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
