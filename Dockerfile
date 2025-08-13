# Stage 2: Production backend
FROM node:18-alpine AS production

WORKDIR /app

# Step 1: Copy backend package files
COPY src/server/package*.json ./src/server/

# Step 2: Install backend dependencies
WORKDIR /app/src/server
RUN npm install

# Step 3: Copy backend source AFTER installing dependencies
COPY src/server/ ./src/server/
COPY server.js ./ 
COPY uploads/ ./uploads/

# Step 4: Copy frontend build
COPY --from=build /app/dist ./public

# Step 5: Create upload directories
RUN mkdir -p uploads/messages uploads/profiles uploads/materials uploads/projects

# Step 6: Expose port
EXPOSE 8080

# Step 7: Start backend server
CMD ["node", "src/server/index.js"]
