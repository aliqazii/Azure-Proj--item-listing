@echo off
echo ☁️ Azure AKS Deployment Script
echo =============================
echo.

REM Check if Azure CLI is installed
az --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Azure CLI is not installed
    echo Please install Azure CLI from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
    pause
    exit /b 1
)

echo ✅ Azure CLI is available
echo.

REM Get Docker Hub username for image reference
set /p DOCKER_USERNAME="Enter your Docker Hub username (for image reference): "
if "%DOCKER_USERNAME%"=="" (
    echo ❌ Docker Hub username is required
    pause
    exit /b 1
)

echo.
echo 🔐 Logging into Azure...
az login

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Azure login failed
    pause
    exit /b 1
)

echo.
echo 📍 Creating resource group...
az group create --name items-app-rg --location eastus

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create resource group
    pause
    exit /b 1
)

echo ✅ Resource group created
echo.

echo 🏗️ Creating AKS cluster (this may take 5-10 minutes)...
az aks create ^
  --resource-group items-app-rg ^
  --name items-app-cluster ^
  --node-count 2 ^
  --enable-addons monitoring ^
  --generate-ssh-keys

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create AKS cluster
    pause
    exit /b 1
)

echo ✅ AKS cluster created successfully
echo.

echo 🔑 Getting cluster credentials...
az aks get-credentials --resource-group items-app-rg --name items-app-cluster

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to get cluster credentials
    pause
    exit /b 1
)

echo.
echo 📝 Updating deployment file with your Docker image...
powershell -Command "(Get-Content k8s\app-deployment.yaml) -replace 'YOUR_DOCKERHUB_USERNAME', '%DOCKER_USERNAME%' | Set-Content k8s\app-deployment.yaml"

echo.
echo 🚀 Deploying to Kubernetes...
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/app-deployment.yaml

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Kubernetes deployment failed
    pause
    exit /b 1
)

echo ✅ Deployment successful!
echo.

echo ⏳ Waiting for pods to start...
timeout /t 30 /nobreak >nul

echo.
echo 📋 Checking deployment status...
kubectl get pods -n items-app-namespace
echo.
kubectl get services -n items-app-namespace

echo.
echo 🌍 Getting external IP (may take 5-10 minutes)...
echo Run this command to monitor: kubectl get service items-app-service --watch
echo.

echo 📊 Useful commands:
echo - Check pods: kubectl get pods -n items-app-namespace
echo - Check services: kubectl get services -n items-app-namespace  
echo - View logs: kubectl logs deployment/items-app-deployment -n items-app-namespace
echo - Get external IP: kubectl get service items-app-service -n items-app-namespace
echo.

echo 🧹 To cleanup later:
echo - Delete cluster: az aks delete --resource-group items-app-rg --name items-app-cluster
echo - Delete resource group: az group delete --name items-app-rg
echo.

pause