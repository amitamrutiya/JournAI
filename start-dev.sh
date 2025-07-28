#!/bin/bash
set -e

echo "🚀 Starting JournAI Development Environment..."

echo "Stopping existing containers..."
docker-compose -f docker-compose.yml down

echo "🔨 Building and starting services..."
docker-compose -f docker-compose.yml up --build

echo "JournAI is now running!"
echo "Client: http://localhost:3000"
echo "Server: http://localhost:8000"
echo "Database: localhost:5432"
