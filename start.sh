#!/bin/bash

# Quick Start Script for Celo Coin Flip Game

echo "🪙 Celo Coin Flip Game - Quick Start"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Navigate to celo-game directory
cd celo-game || exit

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your configuration"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the dev server
echo "🚀 Starting development server..."
echo ""
echo "The app will be available at http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
