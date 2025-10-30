# 🚀 Next Deployment Steps

## ✅ Completed So Far
- [x] **Local Development**: App running successfully with in-memory storage
- [x] **Docker Build**: Image built successfully (238MB)
- [x] **Docker Test**: Container tested and working
- [x] **Docker Image**: `items-listing-app:latest` ready

## 📋 Current Status
```
✅ Section 1.1: Local app running (2 marks)
✅ Section 1.2: Dockerfile created (3 marks) 
✅ Section 1.3: Docker build/run successful (3 marks)
⏳ Section 1.4: Push to Docker Hub (2 marks) - NEXT
⏳ Section 2: Azure AKS Deployment (10 marks)
⏳ Section 3: GitHub Repository (5 marks)
```

## 🐳 Step 2: Push to Docker Hub (2 marks)

### Option A: Automated Script
```bash
# Run the automated deployment script
docker-deploy.bat
```

### Option B: Manual Steps
```bash
# 1. Get your Docker Hub username (create account at hub.docker.com if needed)

# 2. Tag the image
docker tag items-listing-app:latest YOUR_USERNAME/items-listing-app:latest

# 3. Login to Docker Hub
docker login

# 4. Push the image
docker push YOUR_USERNAME/items-listing-app:latest
```

**📸 Screenshot Required**: Docker Hub repository page showing your pushed image

---

## ☁️ Step 3: Azure AKS Deployment (10 marks)

### Prerequisites
- Azure account (free tier available)
- Azure CLI installed: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

### Option A: Automated Script
```bash
# Run the automated Azure deployment script
azure-deploy.bat
```

### Option B: Manual Steps

#### 3.1 Create AKS Cluster (3 marks)
```bash
# Login to Azure
az login

# Create resource group
az group create --name items-app-rg --location eastus

# Create AKS cluster (takes 5-10 minutes)
az aks create \
  --resource-group items-app-rg \
  --name items-app-cluster \
  --node-count 2 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group items-app-rg --name items-app-cluster
```

**📸 Screenshot Required**: Azure portal showing AKS cluster

#### 3.2 Deploy Application (4 marks)
```bash
# Update k8s/app-deployment.yaml with your Docker Hub username
# Change: YOUR_DOCKERHUB_USERNAME to your actual username

# Deploy to Kubernetes
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/app-deployment.yaml

# Check deployment
kubectl get pods -n items-app-namespace
```

**📸 Screenshot Required**: `kubectl get pods` showing running pods

#### 3.3 Get Public URL (3 marks)
```bash
# Get external IP (may take 5-10 minutes)
kubectl get service items-app-service -n items-app-namespace --watch

# Once external IP is assigned, test the app
# Visit: http://YOUR_EXTERNAL_IP
```

**📸 Screenshot Required**: Browser showing app via Azure public IP

---

## 💻 Step 4: GitHub Repository (5 marks)

### 4.1 Create Repository (1 mark)
1. Go to GitHub.com
2. Click "New Repository"
3. Name: `items-listing-app`
4. Make it public
5. Don't initialize with README (we have files already)

### 4.2 Add Files (2 marks)
```bash
# Initialize git (if not already done)
git init

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/items-listing-app.git

# Add all files
git add .

# Commit
git commit -m "Complete cloud deployment pipeline with Docker and Kubernetes"
```

### 4.3 Git Commands (2 marks)
```bash
# Push to GitHub
git push -u origin main

# Verify with pull
git pull origin main

# Create a new branch (demonstrate branching)
git checkout -b feature/documentation-update
git checkout main
```

**📸 Screenshot Required**: GitHub repository page with all files

---

## 🔍 Verification Checklist

Before submission, verify:

### Local Testing
- [ ] App works at http://localhost:3000
- [ ] Can add/delete items
- [ ] Health check works: http://localhost:3000/health

### Docker
- [ ] Image builds successfully
- [ ] Container runs without errors
- [ ] App accessible in container

### Docker Hub
- [ ] Image pushed successfully
- [ ] Repository visible on Docker Hub
- [ ] Image can be pulled by others

### Azure AKS
- [ ] Cluster created successfully
- [ ] Pods are running
- [ ] External IP assigned
- [ ] App accessible via public URL

### GitHub
- [ ] Repository created
- [ ] All files uploaded
- [ ] README.md displays correctly
- [ ] Repository is public

---

## 📸 Required Screenshots Summary

1. **Local App**: Browser at localhost:3000
2. **Docker Build**: Terminal showing successful build
3. **Docker Running**: `docker ps` output
4. **Docker Hub**: Your repository page
5. **Azure AKS**: Portal showing cluster
6. **Kubernetes Pods**: `kubectl get pods` output
7. **Public Access**: Browser via Azure IP
8. **GitHub Repo**: Repository with all files

---

## 🆘 Troubleshooting

### Docker Issues
- **Build fails**: Check Dockerfile syntax, ensure all files present
- **Container won't start**: Check logs with `docker logs CONTAINER_NAME`
- **Port conflicts**: Use different port or kill existing processes

### Azure Issues
- **AKS creation fails**: Check Azure subscription limits, try different region
- **Pods not starting**: Check logs with `kubectl logs POD_NAME`
- **No external IP**: Wait 10+ minutes, check service type is LoadBalancer

### GitHub Issues
- **Push fails**: Check repository URL, ensure you have write access
- **Large files**: Use .gitignore to exclude node_modules

---

## 🎯 Quick Commands Reference

```bash
# Docker
docker build -t items-listing-app .
docker run -p 3000:3000 items-listing-app
docker push YOUR_USERNAME/items-listing-app

# Kubernetes
kubectl get pods -n items-app-namespace
kubectl get services -n items-app-namespace
kubectl logs deployment/items-app-deployment

# Git
git add .
git commit -m "message"
git push origin main
```

---

**🚀 You're ready for the next phase! Start with Docker Hub deployment.**