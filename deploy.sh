#!/bin/bash

# Deployment Script for E-commerce Website
# This script deploys the Next.js e-commerce website to production

set -e

# Configuration
APP_NAME="ecommerce"
APP_DIR="/var/www/$APP_NAME"
APP_USER="www-data"
NODE_VERSION="18"
PORT="3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root"
fi

log "Starting deployment of $APP_NAME..."

# Update system packages
log "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
log "Installing required packages..."
apt install -y curl wget git nginx certbot python3-certbot-nginx build-essential

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
    log "Installing Node.js $NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
else
    log "Node.js is already installed"
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2..."
    npm install -g pm2
else
    log "PM2 is already installed"
fi

# Create application directory
log "Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# Clone or pull the latest code
if [ -d ".git" ]; then
    log "Pulling latest changes..."
    git pull origin main
else
    log "Cloning repository..."
    # Replace with your actual repository URL
    git clone https://github.com/your-username/ecommerce-website.git .
fi

# Install dependencies
log "Installing dependencies..."
npm ci --production=false

# Build the application
log "Building application..."
npm run build

# Install production dependencies
log "Installing production dependencies..."
npm ci --production

# Create PM2 ecosystem file
log "Creating PM2 ecosystem file..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT
    },
    error_file: '/var/log/pm2/$APP_NAME-error.log',
    out_file: '/var/log/pm2/$APP_NAME-out.log',
    log_file: '/var/log/pm2/$APP_NAME-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create PM2 log directory
mkdir -p /var/log/pm2

# Start/restart the application with PM2
log "Starting application with PM2..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup | grep -E '^sudo' | sh

# Set proper permissions
chown -R $APP_USER:$APP_USER $APP_DIR

# Setup firewall
log "Configuring firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Setup log rotation
log "Setting up log rotation..."
cat > /etc/logrotate.d/$APP_NAME << EOF
/var/log/pm2/$APP_NAME-*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 $APP_USER $APP_USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Health check endpoint
log "Creating health check endpoint..."
mkdir -p $APP_DIR/pages/api
cat > $APP_DIR/pages/api/health.js << EOF
export default function handler(req, res) {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
}
EOF

log "Deployment completed successfully!"
log "Application is running on port $PORT"
log "Configure your reverse proxy (Nginx/Caddy) to point to localhost:$PORT"
log ""
log "Useful commands:"
log "  pm2 status                 - Check application status"
log "  pm2 logs $APP_NAME         - View application logs"
log "  pm2 restart $APP_NAME      - Restart application"
log "  pm2 reload $APP_NAME       - Reload application without downtime"
log ""
log "Don't forget to:"
log "1. Configure your domain DNS to point to this server"
log "2. Set up reverse proxy (Nginx/Caddy) for SSL termination"
log "3. Configure environment variables (.env.production)"