# backend Dockerfile

# base image
FROM node:20

# set working directory
WORKDIR /app

# copy package.json and package-lock.json (if available)
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code (EVERYTHING)
COPY . .

# Set port environment variable
ENV PORT=5001
# expose the port so it can be used
EXPOSE 5001

# RUN the application
CMD ["npm", "start"]
