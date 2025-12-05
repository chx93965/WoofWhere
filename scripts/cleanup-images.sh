#!/bin/bash
set -e

echo "Cleaning up K8s Docker images: "

echo "Removing frontend image..."
minikube image rm frontend-web:latest

echo "Removing backend image..."
minikube image rm app-app-service:latest

echo "Removing postgres image..."
minikube image rm postgres:18

minikube image ls | grep -E 'frontend-web:latest|app-app-service:latest|postgres:18'