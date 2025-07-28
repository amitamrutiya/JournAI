#!/bin/bash

# JournAI Kubernetes Cleanup Script

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

print_warning "🧹 Starting JournAI Kubernetes Cleanup..."
print_warning "This will delete all JournAI resources including data!"

# Ask for confirmation
read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Cleanup cancelled."
    exit 0
fi

# Function to safely delete resource
safe_delete() {
    local resource_file=$1
    local resource_name=$2

    if kubectl delete -f "$resource_file" --ignore-not-found=true; then
        print_success "$resource_name deleted"
    else
        print_warning "Failed to delete $resource_name (may not exist)"
    fi
}

print_status "🌍 Deleting ingress..."
safe_delete "ingress.yaml" "Ingress"

print_status "🌐 Deleting client..."
safe_delete "client/service.yaml" "Client service"
safe_delete "client/deployment.yaml" "Client deployment"

print_status "🖥️ Deleting server..."
safe_delete "server/service.yaml" "Server service"
safe_delete "server/deployment.yaml" "Server deployment"

print_status "🔐 Deleting application secrets..."
safe_delete "app-secrets.yaml" "Application secrets"

print_status "🗄️ Deleting database..."
safe_delete "database/service.yaml" "Database service"
safe_delete "database/deployment.yaml" "Database deployment"
safe_delete "database/pvc.yaml" "Database PVC"
safe_delete "database/pv.yaml" "Database PV"
safe_delete "database/secrets.yaml" "Database secrets"

print_status "📂 Deleting namespace..."
if kubectl delete namespace journai --ignore-not-found=true; then
    print_success "Namespace deleted"
else
    print_warning "Failed to delete namespace (may not exist)"
fi

print_success "🎉 Cleanup completed!"
print_warning "Note: Persistent volumes may still exist and need manual cleanup"
