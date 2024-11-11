FROM node:20.15.0 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:20.15.0 as runtime
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000
CMD npm start