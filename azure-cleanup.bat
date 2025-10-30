@echo off
echo 🧹 Azure Resource Cleanup Script
echo ================================
echo.

REM Check if Azure CLI is available
az --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Azure CLI is not installed or not available
    echo Please install Azure CLI first or use Azure Cloud Shell
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
echo 📋 Listing all resource groups...
az group list --output table

echo.
echo 🔍 Looking for items-app related resources...
az group list --query "[?contains(name, 'items-app')]" --output table

echo.
echo ⚠️  WARNING: This will delete ALL resources in the items-app-rg resource group!
echo This includes:
echo - AKS cluster
echo - Virtual networks
echo - Storage accounts
echo - Load balancers
echo - All associated resources
echo.

set /p confirm="Are you sure you want to delete the items-app-rg resource group? (y/N): "

if /i not "%confirm%"=="y" (
    echo ❌ Cleanup cancelled
    pause
    exit /b 0
)

echo.
echo 🗑️ Deleting resource group 'items-app-rg'...
echo This may take 5-10 minutes...

az group delete --name items-app-rg --yes --no-wait

if %ERRORLEVEL% EQU 0 (
    echo ✅ Deletion initiated successfully
    echo ⏳ Resources are being deleted in the background
    echo.
    echo 📋 To check deletion status:
    echo    az group show --name items-app-rg
    echo.
    echo 🔍 To list all resource groups:
    echo    az group list --output table
) else (
    echo ❌ Failed to delete resource group
    echo This might be because:
    echo - Resource group doesn't exist
    echo - You don't have permissions
    echo - Resources are locked
)

echo.
echo 🧹 Cleanup other potential resources...

REM Clean up any kubectl contexts
echo Removing kubectl contexts...
kubectl config get-contexts
kubectl config delete-context items-app-cluster >nul 2>&1

echo.
echo ✅ Cleanup process completed!
echo.
echo 📋 Next steps:
echo 1. Verify resources are deleted: az group list
echo 2. Start fresh deployment with azure-deploy-fresh.bat
echo.

pause