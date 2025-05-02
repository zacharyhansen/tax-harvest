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
