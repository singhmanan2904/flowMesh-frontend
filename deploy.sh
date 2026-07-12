#!/usr/bin/env bash

set -Eeuo pipefail

APP_NAME="flowmesh-frontend"
APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

cd "$APP_DIR"

echo "Pulling latest changes..."
git pull --ff-only

echo "Installing dependencies..."
npm ci

echo "Building application..."
npm run build

if command -v pm2 >/dev/null 2>&1; then
  echo "Restarting application..."
  pm2 restart "$APP_NAME" --update-env ||
    pm2 start npm --name "$APP_NAME" -- start
  pm2 save
else
  echo "Build complete. PM2 is not installed; start the app with: npm start"
fi
