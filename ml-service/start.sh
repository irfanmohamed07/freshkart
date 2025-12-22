#!/bin/bash
set -e

# Function to handle shutdown
cleanup() {
    echo "Shutting down services..."
    kill $PYTHON_PID $NODE_PID 2>/dev/null || true
    exit 0
}

# Trap signals
trap cleanup SIGTERM SIGINT

# Start Python ML service in background
echo "Starting ML service on port 5000..."
cd /app/ml-service
python app.py &
PYTHON_PID=$!

# Wait for ML service to be ready
echo "Waiting for ML service to start..."
for i in {1..30}; do
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        echo "ML service is ready!"
        break
    fi
    sleep 1
done

# Start Node.js application
echo "Starting Node.js application on port 3000..."
cd /app
npm start &
NODE_PID=$!

# Wait for both processes
wait $PYTHON_PID $NODE_PID

