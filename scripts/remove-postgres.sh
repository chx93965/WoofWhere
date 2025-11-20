#!/bin/bash

echo ""
echo "Deleting PostgreSQL database..."
kubectl delete deployment postgres
kubectl delete svc postgres
kubectl delete pvc postgres-volume-claim
kubectl delete pv postgres-volume
kubectl delete secret postgres-secret

kubectl get pods -l app=postgres