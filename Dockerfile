# Multi-stage build for React + Node.js full-stack app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# First, copy and install backend dependencies
COPY src/server/package*.json ./src/server/
RUN cd src/server && npm install

# Copy built frontend from build stage
COPY --from=build /app/dist ./public

# Copy backend source code and other necessary files
COPY src/server/ ./src/server/
COPY server.js ./
COPY uploads/ ./uploads/

# Create upload directories if they don't exist
RUN mkdir -p uploads/messages uploads/profiles uploads/materials uploads/projects

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV DB_HOST=mysql
ENV DB_USER=root
ENV DB_PASSWORD=password
ENV DB_NAME=dbEarn_learn
ENV JWT_SECRET=your-super-secret-jwt-key

# Start the backend server directly
CMD ["node", "src/server/index.js"]