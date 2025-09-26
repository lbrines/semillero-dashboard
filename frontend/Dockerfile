FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Copy static files for standalone build
RUN cp -r .next/static .next/standalone/.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", ".next/standalone/server.js"]
