FROM node:20.15.0 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM nginx
EXPOSE 3000
COPY --from=build /app/out /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
