#!/bin/bash
set -e

echo "Deploying Backend App to Kubernetes..."

echo "Creating secrets..."
kubectl apply -f ../k8s/secrets/app-secret.yaml

echo "Creating App deployment..."
kubectl apply -f ../k8s/deployments/app.yaml

echo "Creating App service..."
kubectl apply -f ../k8s/services/app-service.yaml

echo ""
kubectl get pods -l app=app
kubectl get svc -l app=app
