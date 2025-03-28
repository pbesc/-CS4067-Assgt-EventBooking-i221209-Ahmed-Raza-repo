# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before running npm install
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight web server to serve the React app
RUN npm install -g serve

# Expose the port that the frontend will run on
EXPOSE 3000

# Command to run the app using 'serve'
CMD ["serve", "-s", "build", "-l", "3000"]
