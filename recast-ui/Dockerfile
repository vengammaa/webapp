FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
###ARG configuration=production
###RUN npm run build -- --output-path=/usr/src/app/dist/recast-UI --configuration $configuration
RUN node_modules/.bin/ng b --prod --aot=false --build-optimizer=false

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/recast-UI /usr/share/nginx/html
EXPOSE 80
 
ENTRYPOINT ["nginx","-g","daemon off;"]