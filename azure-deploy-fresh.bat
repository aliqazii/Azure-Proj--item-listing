@echo off
echo 🚀 Fresh Azure AKS Deployment Script
echo ====================================
echo Starting completely from scratch...
echo.

REM Check if Azure CLI is available
az --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Azure CLI is not installed
    echo.
    echo 📥 Install options:
    echo 1. Download: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
    echo 2. Use Azure Cloud Shell: https://portal.azure.com
    echo.
    pause
    exit /b 1
)

echo ✅ Azure CLI is available
echo.

echo 🔐 Logging into Azure...
az login

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Azure login failed
    pause
    exit /b 1
)

echo.
echo 📍 Step 1: Creating fresh resource group...
az group create --name items-app-rg --location eastus

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create resource group
    pause
    exit /b 1
)

echo ✅ Resource group created: items-app-rg
echo.

echo 🏗️ Step 2: Creating AKS cluster (this takes 5-10 minutes)...
echo Please be patient, this is a complex operation...
echo.

az aks create ^
  --resource-group items-app-rg ^
  --name items-app-cluster ^
  --node-count 2 ^
  --enable-addons monitoring ^
  --generate-ssh-keys ^
  --node-vm-size Standard_B2s

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create AKS cluster
    echo.
    echo 🧹 Cleaning up resource group...
    az group delete --name items-app-rg --yes --no-wait
    pause
    exit /b 1
)

echo ✅ AKS cluster created successfully!
echo.

echo 🔑 Step 3: Getting cluster credentials...
az aks get-credentials --resource-group items-app-rg --name items-app-cluster --overwrite-existing

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to get cluster credentials
    pause
    exit /b 1
)

echo ✅ Cluster credentials configured
echo.

echo 🧪 Step 4: Testing kubectl connection...
kubectl get nodes

if %ERRORLEVEL% NEQ 0 (
    echo ❌ kubectl connection failed
    pause
    exit /b 1
)

echo ✅ kubectl is working!
echo.

echo 🚀 Step 5: Deploying application to Kubernetes...
echo.

echo Creating namespace...
kubectl apply -f k8s/namespace.yaml

echo Deploying MongoDB...
kubectl apply -f k8s/mongodb-deployment.yaml

echo Deploying application...
kubectl apply -f k8s/app-deployment.yaml

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Kubernetes deployment failed
    pause
    exit /b 1
)

echo ✅ Application deployed successfully!
echo.

echo ⏳ Step 6: Waiting for pods to start...
timeout /t 30 /nobreak >nul

echo.
echo 📋 Checking deployment status...
kubectl get pods -n items-app-namespace
echo.
kubectl get services -n items-app-namespace

echo.
echo 🌍 Step 7: Getting external IP address...
echo This may take 5-10 minutes for Azure to assign a public IP...
echo.

echo Run this command to monitor the external IP:
echo kubectl get service items-app-service -n items-app-namespace --watch
echo.

echo 📊 Useful monitoring commands:
echo - Check pods: kubectl get pods -n items-app-namespace
echo - Check services: kubectl get services -n items-app-namespace
echo - View app logs: kubectl logs deployment/items-app-deployment -n items-app-namespace
echo - View MongoDB logs: kubectl logs deployment/mongodb-deployment -n items-app-namespace
echo.

echo 🎉 Fresh deployment completed!
echo.
echo 📸 Screenshots needed:
echo 1. Azure portal showing AKS cluster
echo 2. kubectl get pods output
echo 3. Browser showing app via external IP
echo.

pause