@echo off
echo 🚀 Testing Docker Build Process...
echo.

echo 📦 Building Docker image...
docker build -t items-listing-app:latest .

if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker image built successfully!
    echo.
    echo 🔍 Checking image details...
    docker images items-listing-app:latest
    echo.
    echo 🧪 Testing container startup...
    docker run -d --name items-app-test -p 3000:3000 items-listing-app:latest
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Container started successfully!
        echo 📋 Container details:
        docker ps -f name=items-app-test
        echo.
        echo ⏳ Waiting 10 seconds for app to initialize...
        timeout /t 10 /nobreak > nul
        echo.
        echo 🧹 Cleaning up test container...
        docker stop items-app-test
        docker rm items-app-test
        echo ✅ Test completed successfully!
    ) else (
        echo ❌ Failed to start container
    )
) else (
    echo ❌ Failed to build Docker image
)

echo.
echo 📋 Next steps:
echo 1. Tag image: docker tag items-listing-app:latest YOUR_USERNAME/items-listing-app:latest
echo 2. Push to Docker Hub: docker push YOUR_USERNAME/items-listing-app:latest
echo 3. Update k8s/app-deployment.yaml with your Docker Hub username
echo 4. Deploy to Azure AKS
pause