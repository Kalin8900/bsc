FROM node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .
RUN npm ci

# Build app
RUN npm run build

# Expose port
EXPOSE 8080

# Run app
CMD [ "npm", "start" ]