# 🚀 Floranodus Monorepo

> **AI-Native Creative Canvas Platform with Figma Integration & Console Ninja Debugging**

A comprehensive monorepo combining an infinite canvas application with AI-powered Figma design generation, unified workspace management, and advanced debugging capabilities.

## 🎯 **Project Overview**

Floranodus is a revolutionary creative platform that bridges AI-powered design generation with modern web development. This monorepo contains packages that work together to provide a complete design-to-development workflow with integrated debugging.

### **🌟 Key Features**

- 🤖 **AI-Powered Design Generation** - Create Figma designs via MCP tools and natural language
- 🎨 **Infinite Canvas Interface** - React-based node editor for creative workflows  
- 🔄 **Design Token Synchronization** - Automatic CSS variable extraction from Figma
- 🐛 **Console Ninja Integration** - Runtime debugging with console logs and error tracking
- 🔧 **MCP Bridge** - Direct API communication with Figma bypassing sandbox restrictions
- 📦 **Monorepo Architecture** - Unified workspace with shared dependencies

---

## 📦 **Package Architecture**

```
floranodus-monorepo/
├── 🔌 packages/figma-plugin/     # AI-powered Figma MCP bridge (v2.0.0)
├── 🎨 packages/floranodus-app/   # React canvas application
├── 🔧 packages/shared/           # Common utilities & types
├── ⚙️  .cursor/                   # MCP server configuration
├── 📄 scripts/                   # Cross-package automation
└── ⚙️  .vscode/                   # VS Code workspace config
```

### **🔌 @floranodus/figma-plugin** (Current Implementation)
*AI-Powered Figma MCP Bridge v2.0.0*

**Key Features**:
- 🚀 **Unified TypeScript Bridge** - Production-ready server with type safety
- 🤖 **22+ MCP Tools** - Natural language to Figma design generation
- 🌐 **HTTP API Endpoints** - RESTful interface for design operations
- 🔄 **Smart Organization** - Responsive layouts and intelligent layer grouping
- 📊 **Media & Asset Support** - AI image generation and asset management
- 🎯 **Direct Figma API** - Authenticated communication with your Figma account

### **🎨 @floranodus/app**
*React Canvas Application*

**Key Features**:
- 🌊 **Infinite Canvas** - React Flow-based node editor
- 🎯 **AI Node System** - Specialized nodes for different AI operations
- 🔄 **Real-time Collaboration** - Multi-user canvas interaction
- 📱 **Responsive Design** - Works across desktop and mobile
- 🎨 **Design Token Integration** - Uses extracted Figma variables

---

## 🔧 **MCP Server Configuration**

The project includes configured MCP servers for enhanced AI development:

### **Console Ninja MCP**
- **Runtime Debugging** - Live console.log output and error tracking
- **Network Monitoring** - HTTP request inspection
- **Variable Inspection** - Runtime value examination

### **Floranodus Figma MCP**
- **Design Automation** - 22+ professional Figma tools
- **UI Kit Generation** - Complete design systems
- **Smart Organization** - Intelligent layer management
- **Media & Assets** - AI-powered asset creation

**Configuration**: `.cursor/mcp.json`
```json
{
  "mcpServers": {
    "console-ninja": {
      "command": "node",
      "args": ["~/.console-ninja/mcp/"]
    },
    "floranodus-figma-current": {
      "command": "node",
      "args": ["./packages/figma-plugin/dist/unified-figma-bridge.js"],
      "cwd": "/path/to/floranodus-monorepo"
    }
  }
}
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0  
- **Figma Account** with API access
- **Cursor/VS Code** with Console Ninja extension

### **1. Clone & Install**

```bash
git clone https://github.com/trevoralexanderrobey/floranodus-monorepo.git
cd floranodus-monorepo
pnpm install
```

### **2. Configure Figma API**

Update your Figma API token in:
```bash
# Edit the environment file
code packages/figma-plugin/.env
# Update: FIGMA_API_TOKEN=your_token_here
```

### **3. Start Development**

```bash
# Start Figma MCP server
cd packages/figma-plugin && npm run dev

# Or start everything in parallel
pnpm dev
```

### **4. Verify MCP Setup**

1. **Restart Cursor** to load MCP configuration
2. **Check MCP Servers** in settings - should see:
   - ✅ console-ninja
   - ✅ floranodus-figma-current
3. **Test integration**: Ask Cursor "What Figma tools do you have?"

---

## 🛠️ **Available Commands**

### **Root Monorepo Commands**

```bash
# Development
pnpm dev                    # Run all packages in parallel
pnpm dev:app               # Run React app only
pnpm dev:plugin            # Run Figma bridge only

# AI & Design Generation  
pnpm generate              # Generate AI components via bridge
pnpm design                # Create design components
pnpm figma:sync            # Sync design tokens

# Building & Testing
pnpm build                 # Build all packages
pnpm test                  # Run all tests  
pnpm clean                 # Clean all build artifacts

# Utilities
pnpm status                # Check all package status
pnpm health                # Check Figma bridge health
```

---

## 🎯 **VS Code Integration**

### **Features Configured**

- 🎨 **Figma Panel** - View designs directly in VS Code
- 🐛 **Console Ninja** - Runtime debugging and log monitoring
- 🔧 **Custom Tasks** - Quick bridge startup and AI generation
- 🧩 **Code Snippets** - Figma color and spacing references  
- ⚙️ **Workspace Settings** - Optimized for monorepo development

### **Quick Actions**

- **Figma Panel**: `View` → `Open View` → `Figma`
- **Console Ninja**: Automatic runtime debugging in editor
- **MCP Tools**: Available through Cursor chat interface

---

## 🧪 **Testing**

### **Health Checks**

```bash
# Test Figma bridge
curl http://localhost:3000/health

# Test Console Ninja integration
# (Automatically monitors console.log and errors)

# Test MCP integration in Cursor
# Ask: "What Figma tools do you have?"
```

---

## 📚 **Documentation**

### **Essential Guides**

- `MCP_SETUP_VERIFICATION.md` - Complete MCP setup verification
- `MCP_CLEANUP_GUIDE.md` - Server configuration troubleshooting
- `packages/figma-plugin/README.md` - Detailed Figma bridge documentation

### **Additional Resources**

- 📖 **[Figma API Documentation](https://www.figma.com/developers/api)**
- 🔧 **[MCP Protocol Guide](https://modelcontextprotocol.io/)**
- 🐛 **[Console Ninja Documentation](https://console-ninja.com/)**
- 📦 **[pnpm Workspaces](https://pnpm.io/workspaces)**

---

## 🔐 **Environment Configuration**

### **Required Environment Variables**

**packages/figma-plugin/.env**:
```env
# Figma API Configuration
FIGMA_API_TOKEN=your_figma_token_here
FIGMA_FILE_ID=your_file_id

# Server Configuration
PORT=3000
NODE_ENV=development

# Bridge Settings
FIGMA_AI_BRIDGE_AUTO=true
FIGMA_MCP_MODE=unified
```

---

## 🤝 **Contributing**

### **Development Setup**

1. **Fork** the repository
2. **Create** a feature branch
3. **Install** dependencies: `pnpm install`
4. **Start** development: `pnpm dev`
5. **Test** your changes
6. **Submit** a Pull Request

---

## 📄 **License**

This project is licensed under the **MIT License**.

---

## 🔗 **Links**

- **🌐 Repository**: [GitHub](https://github.com/trevoralexanderrobey/floranodus-monorepo)
- **📋 Issues**: [GitHub Issues](https://github.com/trevoralexanderrobey/floranodus-monorepo/issues)

---

**🚀 Ready to build the future of AI-powered design? Start with `pnpm dev` and let's create something amazing!**
