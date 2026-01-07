# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve stage (not used directly; Nginx will serve in main container)
# Keep this for testing if needed
