#!/bin/bash

echo "Loading local Docker images: "

echo "Loading frontend image..."
minikube image load frontend-web:latest

echo "Loading backend image..."
minikube image load app-app-service:latest

echo "Loading postgres image..."
minikube image load postgres:18

minikube image ls | grep -E 'frontend-web:latest|app-app-service:latest|postgres:18'