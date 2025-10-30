@echo off
echo 🚀 Items Listing App Startup Options
echo.
echo Choose your startup method:
echo 1. In-Memory Storage (No MongoDB required - Quick Start)
echo 2. MongoDB Required (Full Database)
echo 3. Docker Compose (MongoDB + App)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🎯 Starting with In-Memory Storage...
    echo ✅ No database setup required
    echo 📦 Sample data included
    echo 🌍 Visit: http://localhost:3000
    echo.
    npm run start:memory
) else if "%choice%"=="2" (
    echo.
    echo 🗄️ Starting with MongoDB...
    echo ⚠️  Make sure MongoDB is running on localhost:27017
    echo 🌍 Visit: http://localhost:3000
    echo.
    npm start
) else if "%choice%"=="3" (
    echo.
    echo 🐳 Starting with Docker Compose...
    echo 📦 This will start MongoDB + App in containers
    echo ⏳ First run may take a few minutes to download images
    echo.
    docker-compose up --build
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

pause