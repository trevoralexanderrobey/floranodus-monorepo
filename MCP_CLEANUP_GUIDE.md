# 🧹 MCP Server Cleanup Guide

## ✅ **RESOLVED: Using the Current Figma MCP Server**

You had **two different Figma MCP servers** showing up in Cursor. Here's what was happening and what we fixed:

## 🔍 **The Issue**

You were seeing:
1. **"figma file creator & manager"** - Legacy/duplicate implementation
2. **"figma-write-mcp"** - Previous configuration name

## 🎯 **The Solution**

**✅ NOW USING: `floranodus-figma-current`**
- **Source**: `packages/figma-plugin/` (Version 2.0.0)
- **Status**: Current, up-to-date implementation
- **Last Updated**: June 27, 2025
- **Features**: Unified TypeScript Bridge with 22+ MCP tools

## 📝 **Updated MCP Configuration**

**File**: `.cursor/mcp.json`

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
      "cwd": "/Volumes/ExtraCurricular/VScode/Github/Cursor/Repos/floranodus-monorepo"
    }
  }
}
```

## ⚡ **What You Should See Now**

After restarting Cursor, you should see **only these two MCP servers**:
- ✅ **console-ninja** - For runtime debugging
- ✅ **floranodus-figma-current** - For Figma design automation

## 🗑️ **Legacy Implementation Details**

**❌ Removed**: `figma-write-mcp/` directory reference
- This was an older copy (Version 1.0.0)
- File dates from June 26 (older)
- Duplicate of the main implementation

**✅ Using**: `packages/figma-plugin/` implementation  
- Current version (Version 2.0.0)
- File dates from June 27 (newer)
- Part of proper monorepo structure
- TypeScript production server

## 🔧 **How to Verify Everything is Working**

### 1. Restart Cursor
Close and reopen Cursor completely to reload MCP configuration.

### 2. Check MCP Servers
1. Open Cursor Settings (`Cmd + Shift + J`)
2. Go to "MCP Servers" tab
3. You should see exactly **2 servers**:
   - console-ninja
   - floranodus-figma-current

### 3. Test the Figma Server
```bash
# Start the server
cd packages/figma-plugin && npm run dev

# Check health
curl http://localhost:3000/health
```

### 4. Test in Cursor Chat
Ask Cursor something like:
- "What Figma tools do you have available?"
- "Create a simple button component in Figma"
- "Check my console logs for errors"

## 🎯 **Current MCP Capabilities**

**Console Ninja**: Runtime debugging, console logs, error tracking, network monitoring

**Floranodus Figma Current**: 22+ professional Figma tools including:
- Design component generation
- UI kit creation  
- Smart layer organization
- Media asset management
- Design variable extraction
- Page organization
- Responsive layout creation

## 🚨 **If You Still See "figma file creator & manager"**

This means you have another MCP configuration file somewhere. Check:

1. **Global Cursor settings**: `~/.cursor/mcp.json`
2. **VS Code settings**: `.vscode/settings.json`  
3. **Other project configs**: Look for other `mcp.json` files

To find all MCP configs:
```bash
find ~ -name "mcp.json" 2>/dev/null
```

## ✅ **Setup Complete**

Your MCP configuration is now clean and using the most current implementations:
- **Console Ninja**: Latest debugging capabilities
- **Floranodus Figma**: Version 2.0.0 with full feature set

No more confusion between different Figma servers! 🎉 