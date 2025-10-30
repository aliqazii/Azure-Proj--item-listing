#!/bin/bash

# Cloud Computing Deployment Pipeline Script
# This script automates the deployment process

echo "🚀 Starting Cloud Computing Deployment Pipeline..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_success "Docker is running!"

# Build Docker image
print_status "Building Docker image..."
docker build -t items-listing-app:latest .

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully!"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Run container locally for testing
print_status "Testing container locally..."
docker run -d --name items-app-test -p 3000:3000 items-listing-app:latest

if [ $? -eq 0 ]; then
    print_success "Container started successfully on port 3000"
    print_status "You can test the app at: http://localhost:3000"
    
    # Wait a moment for the container to start
    sleep 5
    
    # Test health endpoint
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Health check passed!"
    else
        print_warning "Health check failed, but container is running"
    fi
    
    # Stop test container
    print_status "Stopping test container..."
    docker stop items-app-test
    docker rm items-app-test
else
    print_error "Failed to start container"
    exit 1
fi

print_success "Local deployment test completed!"

echo ""
echo "📋 Next Steps:"
echo "1. Push image to Docker Hub: docker tag items-listing-app:latest YOUR_USERNAME/items-listing-app:latest"
echo "2. docker push YOUR_USERNAME/items-listing-app:latest"
echo "3. Update k8s/app-deployment.yaml with your Docker Hub username"
echo "4. Deploy to Azure AKS using kubectl apply -f k8s/"
echo ""