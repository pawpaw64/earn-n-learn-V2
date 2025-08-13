# Use official Node.js LTS version
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose the port your app uses
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
