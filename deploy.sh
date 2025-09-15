#!/bin/bash

# ==================================================
# Production Deployment Script
# FuelPHP + React Application Deployment
# ==================================================

set -e  # Exit on any error

# Configuration
PROJECT_DIR="/mnt/c/xampp/htdocs/fuel-react-app"
FRONTEND_DIR="$PROJECT_DIR/frontend"
DIST_DIR="$PROJECT_DIR/dist"
EC2_USER="${DEPLOY_EC2_USER:-ec2-user}"
EC2_HOST="${DEPLOY_EC2_HOST}"
SSH_KEY="$HOME/.ssh/${DEPLOY_SSH_KEY:-temp-keypair.pem}"
WEB_ROOT="/var/www/html"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if frontend directory exists
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi

    # Check if SSH key exists
    if [ ! -f "$SSH_KEY" ]; then
        log_error "SSH key not found: $SSH_KEY"
        exit 1
    fi

    # Check SSH connection
    if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o BatchMode=yes "$EC2_USER@$EC2_HOST" exit 2>/dev/null; then
        log_error "Cannot connect to EC2 instance: $EC2_USER@$EC2_HOST"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Build frontend application
build_frontend() {
    log_info "Building frontend application..."

    cd "$FRONTEND_DIR"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log_warning "node_modules not found. Running npm install..."
        npm install
    fi

    # Run production build
    log_info "Running production build..."
    npm run build

    # Verify build output
    if [ ! -f "$DIST_DIR/bundle.js" ]; then
        log_error "Build failed: bundle.js not found in $DIST_DIR"
        exit 1
    fi

    if [ ! -f "$DIST_DIR/index.html" ]; then
        log_error "Build failed: index.html not found in $DIST_DIR"
        exit 1
    fi

    log_success "Frontend build completed successfully"

    # Show build info
    local bundle_size=$(stat -c%s "$DIST_DIR/bundle.js" 2>/dev/null || stat -f%z "$DIST_DIR/bundle.js" 2>/dev/null)
    log_info "Bundle size: $(($bundle_size / 1024))KB"
}

# Deploy files to production server
deploy_files() {
    log_info "Deploying files to production server..."

    # Transfer files to EC2 temporary directory
    log_info "Transferring files to EC2..."

    if ! scp -i "$SSH_KEY" "$DIST_DIR/bundle.js" "$EC2_USER@$EC2_HOST:/tmp/"; then
        log_error "Failed to transfer bundle.js"
        exit 1
    fi

    if ! scp -i "$SSH_KEY" "$DIST_DIR/index.html" "$EC2_USER@$EC2_HOST:/tmp/"; then
        log_error "Failed to transfer index.html"
        exit 1
    fi

    # Transfer images directory
    log_info "Transferring images..."
    if [ -d "$FRONTEND_DIR/public/images" ]; then
        if ! scp -r -i "$SSH_KEY" "$FRONTEND_DIR/public/images" "$EC2_USER@$EC2_HOST:/tmp/"; then
            log_error "Failed to transfer images directory"
            exit 1
        fi
        log_success "Images transferred successfully"
    else
        log_warning "Images directory not found, skipping..."
    fi

    log_success "Files transferred successfully"

    # Move files to web root and set proper permissions
    log_info "Setting up files on production server..."

    if ! ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "
        sudo cp /tmp/bundle.js $WEB_ROOT/ &&
        sudo cp /tmp/index.html $WEB_ROOT/ &&
        sudo chown nginx:nginx $WEB_ROOT/bundle.js $WEB_ROOT/index.html &&
        sudo chmod 644 $WEB_ROOT/bundle.js $WEB_ROOT/index.html &&
        if [ -d /tmp/images ]; then
            sudo cp -r /tmp/images $WEB_ROOT/ &&
            sudo chown -R nginx:nginx $WEB_ROOT/images &&
            sudo chmod -R 644 $WEB_ROOT/images &&
            sudo chmod 755 $WEB_ROOT/images &&
            rm -rf /tmp/images
        fi &&
        rm -f /tmp/bundle.js /tmp/index.html
    "; then
        log_error "Failed to deploy files on production server"
        exit 1
    fi

    log_success "Files deployed and permissions set"

    # Reload Nginx configuration (optional, but good practice)
    log_info "Reloading Nginx configuration..."
    if ! ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "sudo systemctl reload nginx"; then
        log_warning "Failed to reload Nginx (this may not be critical)"
    else
        log_success "Nginx reloaded successfully"
    fi

    log_success "File deployment completed"
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."

    # Check HTTPS response
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" "https://suzutuki-portfolio.com")
    if [ "$http_status" != "200" ]; then
        log_error "Website not responding correctly (HTTP $http_status)"
        return 1
    fi

    # Check bundle.js
    local bundle_status=$(curl -s -o /dev/null -w "%{http_code}" "https://suzutuki-portfolio.com/bundle.js")
    if [ "$bundle_status" != "200" ]; then
        log_error "Bundle.js not accessible (HTTP $bundle_status)"
        return 1
    fi

    # Check bundle size on server
    local remote_size=$(ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "stat -c%s /var/www/html/bundle.js" 2>/dev/null)
    local local_size=$(stat -c%s "$DIST_DIR/bundle.js" 2>/dev/null || stat -f%z "$DIST_DIR/bundle.js" 2>/dev/null)

    if [ "$remote_size" != "$local_size" ]; then
        log_warning "File size mismatch: local=$local_size, remote=$remote_size"
    else
        log_success "File sizes match: $local_size bytes"
    fi

    # Check images deployment
    log_info "Verifying images deployment..."
    local image_status=$(curl -s -o /dev/null -w "%{http_code}" "https://suzutuki-portfolio.com/images/fuelphp-icon.png")
    if [ "$image_status" = "200" ]; then
        log_success "Images deployed successfully"
    else
        log_warning "Images not accessible (HTTP $image_status)"
    fi

    log_success "Deployment verification completed"
    log_info "Website: https://suzutuki-portfolio.com"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up temporary files..."
    # Add cleanup logic here if needed
}

# Main deployment process
main() {
    log_info "Starting deployment process..."

    # Set trap for cleanup on exit
    trap cleanup EXIT

    # Run deployment steps
    check_prerequisites
    build_frontend
    deploy_files
    verify_deployment

    log_success "Deployment completed successfully!"
    log_info "Website deployed to: https://suzutuki-portfolio.com"
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi