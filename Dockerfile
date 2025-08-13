# Multi-stage build for React + Node.js full-stack app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY src/server/package*.json ./src/server/

# Install dependencies for both frontend and backend
RUN npm install
RUN cd src/server && npm install

# Copy source code
COPY . .

# Build the React frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy backend package.json and install production dependencies
COPY src/server/package*.json ./
RUN npm install --only=production

# Copy built frontend from build stage
COPY --from=build /app/dist ./public

# Copy backend source code
COPY src/server/ ./src/server/
COPY .env ./

# Create upload directories
RUN mkdir -p uploads/messages uploads/profiles uploads/materials uploads/projects

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the backend server (which will serve the built frontend)
CMD ["node", "src/server/index.js"]