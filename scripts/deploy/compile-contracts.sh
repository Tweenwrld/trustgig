#!/bin/bash

# Compile Aiken smart contracts
# This script compiles all Aiken validators and generates the plutus.json blueprint

set -e

echo "🔨 Compiling Aiken smart contracts..."

# Navigate to contracts directory
cd "$(dirname "$0")/../../contracts"

# Check if Aiken is installed
if ! command -v aiken &> /dev/null; then
    echo "❌ Aiken is not installed. Please install it from https://aiken-lang.org/installation-instructions"
    exit 1
fi

# Build contracts
echo "📦 Building contracts..."
aiken build

# Check if build was successful
if [ -f "plutus.json" ]; then
    echo "✅ Contracts compiled successfully!"
    echo "📄 Blueprint generated: plutus.json"
    
    # Display contract hashes
    echo ""
    echo "📋 Contract hashes:"
    cat plutus.json | jq -r '.validators[] | "\(.title): \(.hash)"'
else
    echo "❌ Build failed. plutus.json not found."
    exit 1
fi

echo ""
echo "🎉 Compilation complete!"
