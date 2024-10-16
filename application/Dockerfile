# Use an official Node.js image from Docker Hub
FROM node:16

# Create and set the working directory inside the container
WORKDIR /usr/src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Define the command to start your app
CMD ["npm", "run", "start"]
