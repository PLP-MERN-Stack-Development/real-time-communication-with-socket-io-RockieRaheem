#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Real-Time Chat Application...${NC}"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"
echo ""

# Start server in background
echo -e "${BLUE}📡 Starting server on http://localhost:5000...${NC}"
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 3

# Start client
echo -e "${BLUE}💻 Starting client on http://localhost:5173...${NC}"
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ Application is running!${NC}"
echo ""
echo "📡 Server: http://localhost:5000"
echo "💻 Client: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both server and client"
echo ""

# Wait for Ctrl+C
trap "kill $SERVER_PID $CLIENT_PID; exit" INT
wait
