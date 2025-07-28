#!/bin/bash

# JournAI Kubernetes Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
}

# Function to check if cluster is accessible
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
}

print_status "🚀 Starting JournAI Kubernetes Deployment..."

# Preliminary checks
check_kubectl
check_cluster

# Create namespace
print_status "📂 Creating namespace..."
if kubectl apply -f namespace.yaml; then
    print_success "Namespace created successfully"
else
    print_error "Failed to create namespace"
    exit 1
fi

# Deploy database components
print_status "🗄️ Deploying database components..."
kubectl apply -f database/secrets.yaml
kubectl apply -f database/pv.yaml
kubectl apply -f database/pvc.yaml
kubectl apply -f database/deployment-temp.yaml
kubectl apply -f database/service.yaml
print_success "Database components deployed"

# Wait for database to be ready
print_status "⏳ Waiting for database to be ready..."
if kubectl wait --for=condition=ready pod -l app=postgres -n journai --timeout=100s; then
    print_success "Database is ready"
else
    print_error "Database failed to become ready within timeout"
    kubectl logs -l app=postgres -n journai --tail=50
    exit 1
fi

# Deploy application secrets
print_status "🔐 Deploying application secrets..."
if kubectl apply -f app-secrets.yaml; then
    print_success "Application secrets deployed"
else
    print_error "Failed to deploy application secrets"
    exit 1
fi

# Deploy server
print_status "🖥️ Deploying server..."
kubectl apply -f server/deployment.yaml
kubectl apply -f server/service.yaml
print_success "Server deployed"

# Wait for server to be ready
print_status "⏳ Waiting for server to be ready..."
if kubectl wait --for=condition=ready pod -l app=journai-server -n journai --timeout=100s; then
    print_success "Server is ready"
else
    print_error "Server failed to become ready within timeout"
    kubectl logs -l app=journai-server -n journai --tail=50
    exit 1
fi

# Deploy client
print_status "🌐 Deploying client..."
kubectl apply -f client/deployment.yaml
kubectl apply -f client/service.yaml
print_success "Client deployed"

# Wait for client to be ready
print_status "⏳ Waiting for client to be ready..."
if kubectl wait --for=condition=ready pod -l app=journai-client -n journai --timeout=100s; then
    print_success "Client is ready"
else
    print_error "Client failed to become ready within timeout"
    kubectl logs -l app=journai-client -n journai --tail=50
    exit 1
fi

# Deploy ingress
print_status "🌍 Deploying ingress..."
if kubectl apply -f ingress.yaml; then
    print_success "Ingress deployed"
else
    print_error "Failed to deploy ingress"
    exit 1
fi

print_success "🎉 Deployment completed successfully!"
echo ""
print_status "📋 Deployment Status:"
kubectl get pods -n journai
echo ""
kubectl get services -n journai
echo ""
kubectl get ingress -n journai
echo ""
print_status "🔍 Useful Commands:"
echo "   View logs:"
echo "     kubectl logs -l app=journai-server -n journai -f"
echo "     kubectl logs -l app=journai-client -n journai -f"
echo "     kubectl logs -l app=postgres -n journai -f"
echo ""
echo "   Check pod status:"
echo "     kubectl get pods -n journai -w"
echo ""
echo "   Access services:"
echo "     kubectl port-forward -n journai svc/journai-client-service 3000:3000"
echo "     kubectl port-forward -n journai svc/journai-server-service 8000:8000"
echo ""
print_warning "🔧 Don't forget to:"
echo "   1. Update the secrets in app-secrets.yaml and database/secrets.yaml with your actual base64 encoded values"
echo "   2. Update the domain and certificate ARN in ingress.yaml"
echo "   3. Create an EBS volume and update the volume ID in database/pv.yaml if using persistent volumes"
