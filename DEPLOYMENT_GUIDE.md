# 🚀 Complete Deployment Guide

## Step-by-Step Instructions for Cloud Computing Pipeline

### Phase 1: Local Development & Testing ✅

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Run Application Locally
```bash
npm start
```
- Visit: http://localhost:3000
- Test adding/deleting items
- **Screenshot Required**: Browser showing working app

### Phase 2: Dockerization 🐳

#### 1. Build Docker Image
```bash
docker build -t items-listing-app:latest .
```
- **Screenshot Required**: Successful build output

#### 2. Run Docker Container
```bash
docker run -d --name items-app -p 3000:3000 items-listing-app:latest
```
- **Screenshot Required**: `docker ps` showing running container

#### 3. Test Containerized App
- Visit: http://localhost:3000
- Verify functionality works in container

#### 4. Push to Docker Hub
```bash
# Replace YOUR_USERNAME with your Docker Hub username
docker tag items-listing-app:latest YOUR_USERNAME/items-listing-app:latest
docker login
docker push YOUR_USERNAME/items-listing-app:latest
```
- **Screenshot Required**: Docker Hub repository page

### Phase 3: Azure AKS Deployment ☁️

#### 1. Create Azure Resources
```bash
# Login to Azure
az login

# Create resource group
az group create --name items-app-rg --location eastus

# Create AKS cluster (this takes 5-10 minutes)
az aks create \
  --resource-group items-app-rg \
  --name items-app-cluster \
  --node-count 2 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get cluster credentials
az aks get-credentials --resource-group items-app-rg --name items-app-cluster
```
- **Screenshot Required**: Azure portal showing AKS cluster

#### 2. Update Kubernetes Configuration
Edit `k8s/app-deployment.yaml`:
```yaml
# Line 15: Replace with your Docker Hub username
image: YOUR_USERNAME/items-listing-app:latest
```

#### 3. Deploy to Kubernetes
```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/app-deployment.yaml

# Check deployment status
kubectl get pods -n items-app-namespace
kubectl get services -n items-app-namespace
```
- **Screenshot Required**: `kubectl get pods` output showing running pods

#### 4. Get Public URL
```bash
# Wait for external IP (may take 5-10 minutes)
kubectl get service items-app-service --watch
```
- **Screenshot Required**: Browser showing app via public IP

### Phase 4: GitHub Repository 📁

#### 1. Initialize Git Repository
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/items-listing-app.git
```

#### 2. Commit and Push Files
```bash
git add .
git commit -m "Initial commit: Complete cloud deployment pipeline"
git push -u origin main
```
- **Screenshot Required**: GitHub repository page

### Phase 5: Testing & Verification 🧪

#### Verify Each Component:

1. **Local App**: http://localhost:3000
2. **Docker Container**: http://localhost:3000 (containerized)
3. **Azure AKS**: http://YOUR_EXTERNAL_IP
4. **GitHub Repo**: https://github.com/YOUR_USERNAME/items-listing-app
5. **Docker Hub**: https://hub.docker.com/r/YOUR_USERNAME/items-listing-app

### Required Screenshots Checklist 📸

- [ ] Local app running in browser
- [ ] Docker build success terminal output
- [ ] Docker container running (`docker ps`)
- [ ] Docker Hub repository page
- [ ] Azure AKS cluster in portal
- [ ] Kubernetes pods running (`kubectl get pods`)
- [ ] App accessible via Azure public IP
- [ ] GitHub repository with all files

### Troubleshooting Common Issues 🔧

#### MongoDB Connection Issues:
```bash
# Check MongoDB pod status
kubectl get pods -l app=mongodb

# Check MongoDB logs
kubectl logs deployment/mongodb-deployment
```

#### External IP Not Assigned:
```bash
# Check service status
kubectl describe service items-app-service

# If stuck, delete and recreate service
kubectl delete service items-app-service
kubectl apply -f k8s/app-deployment.yaml
```

#### Application Not Starting:
```bash
# Check app logs
kubectl logs deployment/items-app-deployment

# Check pod details
kubectl describe pod POD_NAME
```

### Cleanup Resources 🧹

When done with testing:
```bash
# Delete AKS cluster
az aks delete --resource-group items-app-rg --name items-app-cluster

# Delete resource group
az group delete --name items-app-rg

# Stop local Docker container
docker stop items-app
docker rm items-app
```

### Submission Format 📋

Create a document with:
1. **Links Section**:
   - GitHub Repository URL
   - Docker Hub Image URL
   - Azure App Public URL

2. **Screenshots Section**:
   - All 8 required screenshots with captions

3. **Commands Section**:
   - Key commands used for each phase

### Grading Breakdown 📊

**Section 1: Dockerization (10 marks)**
- Local app running: 2 marks
- Dockerfile creation: 3 marks
- Docker build/run: 3 marks
- Docker Hub push: 2 marks

**Section 2: Azure AKS (10 marks)**
- AKS cluster creation: 3 marks
- App deployment: 4 marks
- Public URL access: 3 marks

**Section 3: GitHub (5 marks)**
- Repository creation: 1 mark
- File uploads: 2 marks
- Git commands: 2 marks

**Total: 25 marks**