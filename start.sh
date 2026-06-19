#!/bin/bash

# Start the Mahjong Scoring App
echo "🀄 Starting Mahjong Scoring App..."

# Check if running in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the mahjong_scoring_app directory"
    exit 1
fi

# Start the backend server
echo "Starting backend server on port 3001..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start the frontend
echo "Starting frontend on port 3000..."
cd client && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ App is starting!"
echo "📊 Backend API: http://localhost:3001"
echo "🎮 Frontend:    http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
