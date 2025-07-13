# frontend Dockerfile

# base image
FROM node:20 AS build

# set working directory
WORKDIR /app

# copy package.json and package-lock.json (if available)
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code (EVERYTHING)
COPY . .

# RUN the application --> creates the dist folder for nginx to serve
RUN npm run build


# serve the static files in dist folder using nginx (its like cors)
FROM nginx:alpine
# copy the built application from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# expose port
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
