# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 🚨 Issue: 500 Internal Server Error - Database Connection

**Problem**: The app shows "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"

**Cause**: MongoDB is not running or not accessible

**Solutions**:

#### Option 1: Quick Fix - Use In-Memory Storage ⚡
```bash
# Use this for immediate testing without MongoDB
npm run start:memory
```
This starts the app with sample data stored in memory (no database required).

#### Option 2: Install and Run MongoDB Locally 🗄️
```bash
# Windows (using Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community

# Start MongoDB service
net start MongoDB

# Then run the app
npm start
```

#### Option 3: Use Docker Compose (Recommended) 🐳
```bash
# This starts both MongoDB and the app in containers
docker-compose up --build
```

### 🚨 Issue: Port 3000 Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID [PID_NUMBER] /F

# Or use a different port
set PORT=3001 && npm run start:memory
```

### 🚨 Issue: Docker Build Fails

**Common Causes**:
1. Docker not running
2. Missing files
3. Network issues

**Solutions**:
```bash
# Check Docker is running
docker --version

# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t items-listing-app .
```

### 🚨 Issue: Kubernetes Deployment Fails

**Common Issues**:
1. Wrong image name in deployment.yaml
2. MongoDB not ready
3. Resource limits

**Solutions**:
```bash
# Check pod status
kubectl get pods -n items-app-namespace

# Check pod logs
kubectl logs deployment/items-app-deployment -n items-app-namespace

# Describe pod for details
kubectl describe pod [POD_NAME] -n items-app-namespace

# Delete and recreate deployment
kubectl delete -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-deployment.yaml
```

### 🚨 Issue: External IP Pending in AKS

**Problem**: LoadBalancer service shows `<pending>` for external IP

**Solutions**:
```bash
# Wait 5-10 minutes for Azure to assign IP
kubectl get service items-app-service --watch

# Check service events
kubectl describe service items-app-service

# Alternative: Use NodePort for testing
# Edit k8s/app-deployment.yaml and change type to NodePort
```

## 🔍 Debugging Commands

### Check Application Health
```bash
# Local health check
curl http://localhost:3000/health

# Kubernetes health check
kubectl port-forward service/items-app-service 3000:80
curl http://localhost:3000/health
```

### View Logs
```bash
# Local logs (in-memory version)
# Logs appear in terminal where you ran npm run start:memory

# Docker logs
docker logs items-app

# Kubernetes logs
kubectl logs -f deployment/items-app-deployment
```

### Database Connection Test
```bash
# Test MongoDB connection (if using MongoDB)
mongo --eval "db.adminCommand('ismaster')"

# Or using MongoDB Compass GUI tool
# Connect to: mongodb://localhost:27017
```

## 🚀 Quick Start Options

### For Immediate Testing (No Setup Required)
```bash
npm run start:memory
# Visit: http://localhost:3000
```

### For Full Database Experience
```bash
# Option 1: Docker Compose (Easiest)
docker-compose up

# Option 2: Local MongoDB + Node.js
# 1. Install and start MongoDB
# 2. npm start
```

### For Cloud Deployment
```bash
# 1. Build and push Docker image
docker build -t your-username/items-listing-app .
docker push your-username/items-listing-app

# 2. Update k8s/app-deployment.yaml with your image name
# 3. Deploy to AKS
kubectl apply -f k8s/
```

## 📞 Getting Help

If you're still having issues:

1. **Check the console logs** in your browser's developer tools
2. **Check server logs** in the terminal where the app is running
3. **Verify all prerequisites** are installed (Node.js, Docker, etc.)
4. **Try the in-memory version first** to isolate database issues
5. **Check firewall settings** if having network connectivity issues

## 🎯 Testing Checklist

- [ ] App loads at http://localhost:3000
- [ ] Can add new items
- [ ] Can delete items
- [ ] Items persist (or show sample data in memory mode)
- [ ] Health endpoint works: http://localhost:3000/health
- [ ] No console errors in browser
- [ ] Server logs show no errors

---

**Remember**: Use `npm run start:memory` for quick testing without database setup!