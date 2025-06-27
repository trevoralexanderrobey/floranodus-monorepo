# Project Structure

This document explains the organized structure of the Figma Write MCP project.

## Directory Overview

```
figma-write-mcp/
├── src/                    # Core MCP Server (TypeScript)
├── scripts/                # Wireframe Creation Scripts
├── bridge/                 # Bridge System Components
├── plugin/                 # Clean Figma Plugin Files
├── tests/                  # Test Infrastructure & Results
├── docs/                   # Documentation
├── package.json            # Node.js Dependencies
├── tsconfig.json          # TypeScript Configuration
├── .gitignore             # Git Ignore Rules
└── README.md              # Main Project Documentation
```

## Core Directories

### `/src` - MCP Server Core
The main Model Context Protocol server implementation in TypeScript.

**Key Files:**
- `index.ts` - Main MCP server entry point with 13 tools
- `figma-client.ts` - Figma API client implementation
- `figma-plugin-bridge.ts` - Plugin communication bridge
- `tools/figma-tools.ts` - MCP tool definitions
- `types/figma.ts` - TypeScript type definitions

### `/scripts` - Wireframe Creation
Complete e-commerce mobile app wireframe creation scripts.

**Files:**
- `create-wireframe-elements.js` - Product listing page (50+ elements)
- `create-product-detail-wireframe.js` - Product detail page (37+ elements)  
- `create-cart-wireframe.js` - Shopping cart page (50+ elements)

**Total:** 137+ wireframe elements across 3 mobile screens

### `/bridge` - Bridge System
Communication bridge between MCP server and Figma plugin.

**Files:**
- `auto-bridge.js` - Simplified auto-bridge server (port 3003)
- `enhanced-bypass-bridge.js` - Enhanced bridge with full capabilities (port 3002)

### `/plugin` - Figma Plugin
Clean, working Figma plugin files with zero syntax errors.

**Files:**
- `manifest.json` - Plugin manifest configuration
- `code.js` - Plugin implementation with auto-connection

**Plugin Name:** "🤖 AUTO BYPASS - VISUAL ELEMENTS"

### `/tests` - Test Infrastructure
Comprehensive testing system with 100% success rate.

**Test Scripts:**
- `comprehensive-test.js` - Master test for all 4 MCP tools
- `run-all-tests.js` - Sequential test runner with reporting
- `test-code-connections.js` - Code connection testing
- `test-design-preview.js` - Design preview testing

**Test Data:**
- `test-react-components.json` - 6 React components for testing
- `test-design-variables.json` - Design system variables
- `test-design-descriptions.json` - 6 design concepts

**Test Results:** All JSON output files from successful test runs

### `/docs` - Documentation
Project documentation and development logs.

**Files:**
- `PROJECT_STRUCTURE.md` - This file
- `DEVELOPMENT_LOG.md` - Complete development history
- `TEST_RESULTS_SUMMARY.md` - Test execution results
- `INSTALL_PLUGIN.md` - Plugin installation instructions

## Key Features

### ✅ Complete E-Commerce System
- 3-screen mobile shopping app (Browse → Detail → Cart)
- 137+ professional wireframe elements
- Real product data and user flows

### ✅ MCP Server (13 Tools)
- **Read Tools:** get_figma_file, get_figma_nodes, get_figma_images, etc.
- **Creation Tools:** create_nodes_from_code, set_design_variables, etc.
- **Port:** 3000 (configured in ~/.cursor/mcp.json)

### ✅ Auto-Bridge System
- **Port 3003:** Simplified auto-bridge
- **Port 3002:** Enhanced bridge with full capabilities
- Automatic plugin connection and visual creation

### ✅ Test Coverage
- 100% success rate across all tools
- Comprehensive test data and results
- Performance metrics (sub-second execution)

## Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start MCP Server:**
   ```bash
   npm start
   ```

3. **Run Auto-Bridge:**
   ```bash
   node bridge/auto-bridge.js
   ```

4. **Install Plugin:**
   - Load `plugin/` directory in Figma
   - Plugin auto-connects to bridge

5. **Create Wireframes:**
   ```bash
   node scripts/create-wireframe-elements.js
   node scripts/create-product-detail-wireframe.js  
   node scripts/create-cart-wireframe.js
   ```

## Health Checks

- **MCP Server:** Check Cursor MCP connection
- **Bridge Status:** http://localhost:3003/health
- **Plugin Connection:** Auto-connects when loaded

## File Key
- **Figma File:** pN5u5fKsz3B3jMcaF1tMKR
- **View Live:** Check wireframes in Figma with this file key

---

*Last Updated: 2024 - Complete E-commerce Wireframe System* 