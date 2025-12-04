# build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* tsconfig.json ./
COPY src ./src
RUN npm ci --production=false
RUN npm run build

# runtime image
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist
RUN npm ci --production=true
EXPOSE 8080
CMD ["node", "dist/index.js"]
