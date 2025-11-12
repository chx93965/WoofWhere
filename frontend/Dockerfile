    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Copy dependency files for caching
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy all source files
    COPY . .
    
    # Accept environment variables at build time
    ARG VITE_AUTH0_DOMAIN
    ARG VITE_AUTH0_CLIENT_ID
    ARG VITE_AUTH0_REDIRECT_URI
    ARG VITE_MAPBOX_ACCESS_TOKEN
    
    # Set them as environment variables for Vite build
    ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
    ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
    ENV VITE_AUTH0_REDIRECT_URI=$VITE_AUTH0_REDIRECT_URI
    ENV VITE_MAPBOX_ACCESS_TOKEN=$VITE_MAPBOX_ACCESS_TOKEN
    
    # Clean previous build if any
    RUN rm -rf dist
    
    # Build the app
    RUN npm run build
    
    FROM nginx:stable-alpine
    
    # Copy built files from builder
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Copy Nginx configuration
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    