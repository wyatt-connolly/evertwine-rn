#!/bin/bash

# Figma MCP Setup Script for Cursor
# This script helps you set up Figma MCP integration

echo "🎨 Figma MCP Setup for Cursor"
echo "=============================="
echo ""

# Check if Figma token is provided
if [ -z "$1" ]; then
    echo "❌ Usage: ./setup-figma-mcp.sh <your-figma-token>"
    echo ""
    echo "To get your Figma token:"
    echo "1. Go to https://www.figma.com/settings"
    echo "2. Scroll to 'Personal Access Tokens'"
    echo "3. Create a new token"
    echo "4. Copy it and run this script again"
    exit 1
fi

FIGMA_TOKEN=$1

echo "✅ Figma token provided"
echo ""

# Check if Cursor settings directory exists
CURSOR_SETTINGS="$HOME/Library/Application Support/Cursor/User"
if [ ! -d "$CURSOR_SETTINGS" ]; then
    echo "❌ Cursor settings directory not found"
    echo "   Expected: $CURSOR_SETTINGS"
    exit 1
fi

echo "📝 To complete the setup:"
echo ""
echo "1. Open Cursor"
echo "2. Press Cmd+, (or Ctrl+,) to open Settings"
echo "3. Search for 'MCP' or click on 'Features' → 'Model Context Protocol'"
echo "4. Click 'Add MCP Server' or 'Edit MCP Servers'"
echo "5. Add the following configuration:"
echo ""
echo "   Server Name: figma"
echo "   Command: npx"
echo "   Args: -y @figma/mcp-server"
echo "   Environment Variables:"
echo "     FIGMA_ACCESS_TOKEN: $FIGMA_TOKEN"
echo ""
echo "6. Save and restart Cursor"
echo ""
echo "Alternatively, you can manually edit the MCP configuration file."
echo ""
echo "✨ Setup instructions saved to FIGMA_MCP_SETUP.md"
echo ""
echo "After setup, you can use Figma MCP by:"
echo "- Sharing Figma file URLs with Cursor"
echo "- Asking Cursor to extract design tokens"
echo "- Generating code from Figma designs"

