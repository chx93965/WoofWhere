#!/bin/bash

echo ""
echo "Deleting Frontend App..."
kubectl delete deployment frontend
kubectl delete svc frontend-service

kubectl get pods -l app=frontend