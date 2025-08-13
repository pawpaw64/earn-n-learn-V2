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
WORKDIR /app/src/server
RUN npm install

# Switch back to root folder
WORKDIR /app

# Copy backend code
COPY src/server/ ./src/server/
COPY server.js ./ 
COPY uploads/ ./uploads/

# Copy frontend build from stage 1
COPY --from=build /app/dist ./public

# Create upload directories
RUN mkdir -p uploads/messages uploads/profiles uploads/materials uploads/projects

# Expose port
EXPOSE 8080

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV DB_HOST=mysql
ENV DB_USER=root
ENV DB_PASSWORD=password
ENV DB_NAME=dbEarn_learn
ENV JWT_SECRET=your-super-secret-jwt-key

# Start backend server
CMD ["node", "src/server/index.js"]
