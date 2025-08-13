# Stage 1: Build frontend
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production backend
FROM node:18-alpine AS production
WORKDIR /app

# Copy backend package files
COPY src/server/package*.json ./src/server/

# Install backend dependencies
WORKDIR /app/src/server
RUN npm install

# Copy backend source AFTER installing dependencies
COPY src/server/ ./src/server/
COPY server.js ./ 
COPY uploads/ ./uploads/

# Copy frontend build from previous stage
COPY --from=build /app/dist ./public

# Create upload directories
RUN mkdir -p uploads/messages uploads/profiles uploads/materials uploads/projects

# Expose backend port
EXPOSE 8080

# Start backend server
CMD ["node", "src/server/index.js"]
