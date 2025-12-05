#!/bin/bash
set -e

echo "Deploying PostgreSQL to Kubernetes..."

echo "Creating secrets..."
kubectl apply -f ../k8s/secrets/postgres-secret.yaml

echo "Creating PostgreSQL init scripts..."
kubectl apply -f ../k8s/configmaps/postgres-config.yaml

echo "Creating persistent volumes..."
kubectl apply -f ../k8s/volumes/postgres-volume.yaml

echo "Creating persistent volume claims..."
kubectl apply -f ../k8s/volumes/postgres-claim.yaml

echo "Creating PostgreSQL deployment..."
kubectl apply -f ../k8s/deployments/postgres.yaml

echo "Creating PostgreSQL service..."
kubectl apply -f ../k8s/services/postgres-service.yaml

echo ""
kubectl get pods -l app=postgres
kubectl get svc -l app=postgres
