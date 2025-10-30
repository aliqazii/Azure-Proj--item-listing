# ☁️ Azure AKS Deployment Guide

## 🚀 Current Status
✅ **Docker Hub Deployment Complete!**
- Image successfully pushed: `virk121/items-listing-app:latest`
- Docker Hub URL: https://hub.docker.com/r/virk121/items-listing-app
- Kubernetes deployment file updated with your image

## 📋 Next: Azure AKS Deployment (10 marks)

### Step 1: Install Azure CLI (Required)

**Windows Installation Options:**

#### Option A: Download Installer (Recommended)
1. Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
2. Download the MSI installer
3. Run the installer and follow prompts
4. Restart your terminal/PowerShell

#### Option B: Using PowerShell
```powershell
# Run as Administrator
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
```

#### Option C: Using Chocolatey (if you have it)
```bash
choco install azure-cli
```

### Step 2: Verify Installation
```bash
# After installation, restart terminal and run:
az --version
```

### Step 3: Azure AKS Deployment

#### 3.1 Create AKS Cluster (3 marks)
```bash
# Login to Azure (opens browser)
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

# Get cluster credentials
az aks get-credentials --resource-group items-app-rg --name items-app-cluster
```

**📸 Screenshot Required**: Azure portal showing your AKS cluster

#### 3.2 Deploy Application (4 marks)
```bash
# Verify kubectl is working
kubectl get nodes

# Deploy to Kubernetes (your image is already configured)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/app-deployment.yaml

# Check deployment status
kubectl get pods -n items-app-namespace
kubectl get services -n items-app-namespace
```

**📸 Screenshot Required**: `kubectl get pods` showing running pods

#### 3.3 Get Public URL (3 marks)
```bash
# Get external IP (may take 5-10 minutes)
kubectl get service items-app-service -n items-app-namespace --watch

# Once EXTERNAL-IP appears (not <pending>), test your app
# Visit: http://YOUR_EXTERNAL_IP
```

**📸 Screenshot Required**: Browser showing your app via Azure public IP

---

## 🔧 Alternative: Use Azure Cloud Shell

If you prefer not to install Azure CLI locally:

1. Go to https://portal.azure.com
2. Click the Cloud Shell icon (>_) in the top menu
3. Choose Bash or PowerShell
4. Run the same commands above

---

## 📋 Quick Commands Summary

```bash
# After Azure CLI installation:
az login
az group create --name items-app-rg --location eastus
az aks create --resource-group items-app-rg --name items-app-cluster --node-count 2 --generate-ssh-keys
az aks get-credentials --resource-group items-app-rg --name items-app-cluster

kubectl apply -f k8s/
kubectl get pods -n items-app-namespace
kubectl get service items-app-service -n items-app-namespace
```

---

## 🎯 What's Ready

✅ **Your Docker image**: `virk121/items-listing-app:latest` is live on Docker Hub
✅ **Kubernetes files**: Updated with your image name
✅ **Deployment scripts**: Ready to use

**Next Action**: Install Azure CLI and run the deployment commands above.

---

## 🆘 Need Help?

- **Azure Free Account**: https://azure.microsoft.com/free/
- **Azure CLI Docs**: https://docs.microsoft.com/en-us/cli/azure/
- **AKS Tutorial**: https://docs.microsoft.com/en-us/azure/aks/tutorial-kubernetes-prepare-app

Once Azure CLI is installed, you can proceed with the AKS deployment!