#!/bin/bash

echo ""
echo "Deleting Backend App..."
kubectl delete deployment app
kubectl delete svc app-service
kubectl delete secret app-secret

kubectl get pods -l app=app