# 🚀 Floranodus AI Figma Workflow - Quick Start

## ⚡ **Instant Setup (No Manual Plugin Installation!)**

### **1. Start the AI Bridge** 
```bash
# In VS Code Terminal (Ctrl+`)
cd ../figma-write-mcp
npm run start
```

**OR use VS Code Task:**
- `Cmd+Shift+P` → "Tasks: Run Task" → "🚀 Start Figma AI Bridge"

### **2. Install Workflow Dependencies**
```bash
cd design/figma
npm run setup
```

### **3. Test the Connection**
```bash
npm run status
```

## 🎨 **Generate AI Components**

### **Quick Test:**
```bash
npm run test-ai
```

### **Generate Complete Floranodus Interface:**
```bash
npm run generate
```

### **Custom AI Generation (in VS Code terminal):**
```javascript
const FloranodusAI = require('./ai-workflow-scripts.js');
const workflow = new FloranodusAI();

// Generate specific AI nodes
await workflow.generateAIComponents(['button', 'input', 'dropdown']);

// Bulk create from data
await workflow.bulkCreateFromData([
  { name: 'Text Node', type: 'text', color: { r: 0, g: 1, b: 0 } },
  { name: 'Image Node', type: 'rectangle', width: 300, height: 200 }
]);
```

## 🔧 **VS Code Integration Features**

### **Auto-Start on Project Open:**
- Bridge starts automatically when you open Floranodus project
- Figma panel loads in VS Code sidebar
- Ready for AI generation immediately

### **Quick Access Tasks:**
- `🚀 Start Figma AI Bridge` - Start the MCP bridge server
- `🎨 Generate AI Components` - Run AI component generation
- `📱 Create Bulk UI Elements` - Bulk create from data
- `Open Floranodus Figma Design` - Open your Figma file

### **Design Token Sync:**
- View designs in VS Code Figma panel
- Extract CSS variables automatically
- Copy design specs to clipboard

## 🎯 **Automated Workflows**

### **1. Canvas Node Generation:**
```bash
# Generate Floranodus AI canvas interface
node ai-workflow-scripts.js generate-interface
```

### **2. Component Library Creation:**
```javascript
// In VS Code terminal or script
const components = [
  'navigation-bar',
  'ai-node-card', 
  'connection-line',
  'toolbar',
  'settings-panel'
];

await workflow.generateAIComponents(components);
```

### **3. Design System Generation:**
```bash
# Generate design system components
npm run generate -- --design-system
```

## 🔄 **Seamless Workflow:**

1. **Code** → Write your component requirements
2. **AI Generate** → Run workflow scripts to create in Figma
3. **View** → See results in VS Code Figma panel
4. **Extract** → Copy design tokens to your code
5. **Iterate** → Repeat with AI refinements

## 🚨 **No Manual Plugin Installation Required!**

The bridge handles all plugin installation and connection automatically. Just start the bridge and begin generating!

## 🎉 **Example: Generate Full Floranodus UI in 30 seconds:**

```bash
# 1. Start bridge (if not auto-started)
npm run start

# 2. Generate complete interface
npm run generate

# 3. View in VS Code Figma panel
# 4. Extract design tokens
# 5. Start coding!
```

## 🔗 **Integration with Your Code:**

Add this to your `floranodus/frontend/src/components/`:

```javascript
// Import design tokens from Figma
import '../design/figma/design-tokens.css';

// Use Figma values
const CanvasNode = styled.div`
  background: var(--figma-node-bg);
  border: 1px solid var(--figma-node-border);
  border-radius: var(--figma-radius-md);
  padding: var(--figma-spacing-md);
`;
```

**🚀 You're now set up for AI-powered Figma design generation directly from VS Code!** 