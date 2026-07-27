# Build
FROM node:24-alpine AS build

ARG BUILD_CONFIGURATION=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration=$BUILD_CONFIGURATION

# Serve
FROM nginx:1.30-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/valeros/browser /usr/share/nginx/html

EXPOSE 80
