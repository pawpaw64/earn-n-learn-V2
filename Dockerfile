# Stage 1: Build frontend
FROM node:18-alpine AS build

WORKDIR /app

# Copy root package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies (and any shared dependencies)
RUN npm install

# Copy all source files
COPY . .

# Build the React/Vite frontend
RUN npm run build

# Stage 2: Production backend
FROM node:18-alpine AS production

WORKDIR /app

# Copy backend package files (from src/server)
COPY src/server/package*.json ./src/server/

# Set working directory to backend and install dependencies
WORKDIR /app/src/server
RUN npm install

# Switch back to app root
WORKDIR /app

# Copy backend code and server file
COPY src/server/ ./src/server/
COPY server.js ./
COPY uploads/ ./uploads/

# Copy frontend build from previous stage
COPY --from=build /app/dist ./public

# Create upload directories if missing
RUN mkdir -p uploads/messages uploads/profiles uploads/materials uploads/projects

# Expose backend port
EXPOSE 8080

# Environment variables will be provided by Docker Compose (don't hardcode secrets here)
ENV NODE_ENV=production
ENV PORT=8080

# Start backend server
CMD ["node", "src/server/index.js"]
