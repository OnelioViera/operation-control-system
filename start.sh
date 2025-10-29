#!/bin/bash

# Lindsay Precast Operations Control System - Startup Script

echo "🚀 Starting Lindsay Precast Operations Control System..."
echo ""

# Set environment variables
export PORT=8000
export MONGODB_URI="mongodb://localhost:27017/lindsay-precast"
export JWT_SECRET="lindsay_precast_super_secret_jwt_key_change_in_production_2024"
export NODE_ENV="development"

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if mongosh --eval "db.version()" --quiet > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running!"
    echo ""
    echo "Please start MongoDB first:"
    echo "  macOS:  brew services start mongodb-community"
    echo "  Linux:  sudo systemctl start mongodb"
    echo ""
    exit 1
fi

echo ""
echo "🌐 Starting server on http://localhost:$PORT"
echo ""
echo "📝 Login credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server
npm run dev

