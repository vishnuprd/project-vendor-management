# Step 1: Use the Node.js image to build the application
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Step 2: Use a lightweight Nginx image to serve the static files
FROM nginx:alpine

# # Remove the default Nginx static files
# RUN rm -rf /usr/share/nginx/html/*

# # Copy the built React files from the previous stage to the Nginx directory
# COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
