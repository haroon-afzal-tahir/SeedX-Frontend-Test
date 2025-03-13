FROM node:20.10-alpine

WORKDIR /app

# Install necessary build dependencies including git and ca-certificates
RUN apk add --no-cache git ca-certificates

# Copy package files first
COPY package*.json ./

# Clean install dependencies
RUN npm install

# Copy source code (node_modules will be excluded by .dockerignore)
COPY . .

# Only expose non-sensitive environment variable
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# ARG APP_PASSWORD
# ENV APP_PASSWORD=${APP_PASSWORD}

# ARG OPENAI_API_KEY
# ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Build the application
RUN npm run build

EXPOSE 3000

# Use production start command
CMD ["npm", "start"]
