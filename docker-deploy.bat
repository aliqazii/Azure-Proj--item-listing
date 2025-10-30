@echo off
echo 🐳 Docker Deployment Script
echo ========================
echo.

REM Check if Docker is running
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed or not running
    echo Please install Docker Desktop and try again
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Get Docker Hub username
set /p DOCKER_USERNAME="Enter your Docker Hub username: "
if "%DOCKER_USERNAME%"=="" (
    echo ❌ Docker Hub username is required
    pause
    exit /b 1
)

echo.
echo 📦 Building Docker image...
docker build -t items-listing-app:latest .

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker build failed
    pause
    exit /b 1
)

echo ✅ Docker image built successfully
echo.

echo 🧪 Testing container locally...
docker stop items-app-test >nul 2>&1
docker rm items-app-test >nul 2>&1

docker run -d --name items-app-test -p 3000:3000 items-listing-app:latest

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to start container
    pause
    exit /b 1
)

echo ⏳ Waiting for container to start...
timeout /t 10 /nobreak >nul

echo 📋 Container status:
docker ps -f name=items-app-test

echo.
echo 📝 Container logs:
docker logs items-app-test

echo.
echo 🏷️ Tagging image for Docker Hub...
docker tag items-listing-app:latest %DOCKER_USERNAME%/items-listing-app:latest

echo.
echo 🔐 Please login to Docker Hub...
docker login

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker login failed
    echo 🧹 Cleaning up test container...
    docker stop items-app-test
    docker rm items-app-test
    pause
    exit /b 1
)

echo.
echo 📤 Pushing image to Docker Hub...
docker push %DOCKER_USERNAME%/items-listing-app:latest

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker push failed
    echo 🧹 Cleaning up test container...
    docker stop items-app-test
    docker rm items-app-test
    pause
    exit /b 1
)

echo.
echo ✅ Successfully pushed to Docker Hub!
echo 🔗 Your image: https://hub.docker.com/r/%DOCKER_USERNAME%/items-listing-app

echo.
echo 🧹 Cleaning up test container...
docker stop items-app-test
docker rm items-app-test

echo.
echo 📋 Next Steps:
echo 1. Update k8s/app-deployment.yaml with your image name:
echo    image: %DOCKER_USERNAME%/items-listing-app:latest
echo.
echo 2. Create Azure AKS cluster:
echo    az group create --name items-app-rg --location eastus
echo    az aks create --resource-group items-app-rg --name items-app-cluster --node-count 2
echo.
echo 3. Deploy to AKS:
echo    az aks get-credentials --resource-group items-app-rg --name items-app-cluster
echo    kubectl apply -f k8s/
echo.

pause