# Stage 1: build frontend
FROM node:18-alpine AS build

WORKDIR /app
COPY Tymer-frontend/package*.json ./ 
RUN npm install
COPY Tymer-frontend ./ 
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
