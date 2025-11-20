#!/bin/bash
set -e

echo "Deploying Frontend App to Kubernetes..."

echo "Creating frontend deployment..."
kubectl apply -f ../k8s/deployments/frontend.yaml

echo "Creating frontend service..."
kubectl apply -f ../k8s/services/frontend-service.yaml

echo ""
kubectl get pods -l app=frontend
kubectl get svc -l app=frontend
