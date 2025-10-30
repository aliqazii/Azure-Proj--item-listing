# 📦 Items Listing App - Cloud Computing Deployment Pipeline

A complete full-stack application demonstrating a cloud deployment pipeline from local development to Azure Kubernetes Service (AKS).

## 🏗️ Architecture

- **Frontend**: HTML/CSS/JavaScript (Responsive UI)
- **Backend**: Node.js + Express.js (REST API)
- **Database**: MongoDB (Document storage)
- **Containerization**: Docker
- **Orchestration**: Kubernetes (Azure AKS)
- **Version Control**: Git/GitHub

## 🚀 Features

- ✅ Add, view, and delete items
- 📱 Responsive design
- 🔄 Real-time updates
- 🏥 Health check endpoints
- 🐳 Docker containerization
- ☸️ Kubernetes deployment ready
- 🌍 Cloud deployment (Azure AKS)

## 📋 Section 1: Dockerization & Local Deployment

### Prerequisites
- Node.js 18+ installed
- Docker installed and running
- Git installed

### 1. Run App Locally (2 marks)

```bash
# Install dependencies
npm install

# Option 1: Quick Start (In-Memory Storage - No Database Required)
npm run start:memory

# Option 2: Full Database (Requires MongoDB)
npm start

# Option 3: Docker Compose (MongoDB + App)
docker-compose up

# Visit http://localhost:3000
```

**⚠️ If you get a 500 error**: Use `npm run start:memory` for immediate testing without MongoDB setup.

### 2. Create Dockerfile (3 marks)

The `Dockerfile` includes:
- Multi-stage build optimization
- Security best practices (non-root user)
- Health checks
- Proper layer caching

### 3. Build and Run Docker Container (3 marks)

```bash
# Build the Docker image
docker build -t items-listing-app:latest .

# Run the container
docker run -d --name items-app -p 3000:3000 items-listing-app:latest

# Check container status
docker ps

# View logs
docker logs items-app

# Stop container
docker stop items-app
docker rm items-app
```

### 4. Push to Docker Hub (2 marks)

```bash
# Tag the image
docker tag items-listing-app:latest YOUR_USERNAME/items-listing-app:latest

# Login to Docker Hub
docker login

# Push the image
docker push YOUR_USERNAME/items-listing-app:latest
```

## ☁️ Section 2: Azure Kubernetes Deployment

### 1. Create Azure AKS Cluster (3 marks)

```bash
# Login to Azure
az login

# Create resource group
az group create --name items-app-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group items-app-rg \
  --name items-app-cluster \
  --node-count 2 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group items-app-rg --name items-app-cluster
```

### 2. Deploy Application (4 marks)

```bash
# Update the image name in k8s/app-deployment.yaml
# Replace 'your-dockerhub-username' with your actual username

# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/app-deployment.yaml

# Check deployment status
kubectl get pods -n items-app-namespace
kubectl get services -n items-app-namespace
```

### 3. Expose via Public IP (3 marks)

```bash
# Get external IP (may take a few minutes)
kubectl get service items-app-service --watch

# Once EXTERNAL-IP is assigned, access your app at:
# http://EXTERNAL-IP
```

## 💻 Section 3: GitHub Repository

### 1. Create Repository (1 mark)

```bash
# Initialize git repository
git init

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/items-listing-app.git
```

### 2. Add Files (2 marks)

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Complete items listing app with Docker and K8s"
```

### 3. Git Commands (2 marks)

```bash
# Push to GitHub
git push -u origin main

# Pull latest changes
git pull origin main

# Create and switch to new branch
git checkout -b feature/new-feature

# Merge branch
git checkout main
git merge feature/new-feature
```

## 📁 Project Structure

```
items-listing-app/
├── public/
│   ├── index.html          # Frontend HTML
│   ├── styles.css          # CSS styling
│   └── script.js           # JavaScript functionality
├── k8s/
│   ├── namespace.yaml      # Kubernetes namespace
│   ├── mongodb-deployment.yaml  # MongoDB deployment
│   └── app-deployment.yaml # Application deployment
├── server.js               # Node.js backend
├── package.json            # Dependencies
├── Dockerfile              # Container configuration
├── .dockerignore          # Docker ignore rules
├── .env.example           # Environment variables template
├── deploy.sh              # Deployment script
└── README.md              # This file
```

## 🔧 API Endpoints

- `GET /` - Frontend application
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get single item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /health` - Health check

## 🌍 Environment Variables

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/itemsdb
```

## 📸 Screenshots Required

1. **Local Application Running** - Browser showing app at localhost:3000
2. **Docker Build Success** - Terminal showing successful docker build
3. **Docker Container Running** - `docker ps` output
4. **Docker Hub Repository** - Your pushed image on Docker Hub
5. **AKS Cluster Created** - Azure portal showing AKS cluster
6. **Kubernetes Pods Running** - `kubectl get pods` output
7. **Public URL Access** - Browser showing app via Azure public IP
8. **GitHub Repository** - Your GitHub repo with all files

## 🔗 Submission Links

- **GitHub Repository**: `https://github.com/YOUR_USERNAME/items-listing-app`
- **Docker Hub Image**: `https://hub.docker.com/r/YOUR_USERNAME/items-listing-app`
- **Azure App URL**: `http://YOUR_AKS_EXTERNAL_IP`

## 🛠️ Troubleshooting

### Common Issues:

1. **MongoDB Connection**: Ensure MongoDB service is running in Kubernetes
2. **External IP Pending**: Wait 5-10 minutes for Azure to assign public IP
3. **Pod CrashLoopBackOff**: Check logs with `kubectl logs POD_NAME`
4. **Docker Build Fails**: Ensure all files are present and Docker is running

### Useful Commands:

```bash
# Check pod logs
kubectl logs -f deployment/items-app-deployment

# Describe pod for troubleshooting
kubectl describe pod POD_NAME

# Port forward for local testing
kubectl port-forward service/items-app-service 3000:80

# Scale deployment
kubectl scale deployment items-app-deployment --replicas=3
```

## 📝 Notes

- This application uses in-memory MongoDB for simplicity
- For production, use persistent volumes for database storage
- Consider implementing authentication and authorization
- Add monitoring and logging for production deployments
- Use secrets for sensitive configuration data

---

**Developed for Cloud Computing Deployment Pipeline Demonstration**